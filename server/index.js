import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from './db.js';
import './seed.js';

const app = express();
app.disable('x-powered-by');
const port = Number(process.env.PORT || 3001);
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error('JWT_SECRET não configurado.');
const geminiModels = [...new Set([
  process.env.GEMINI_MODEL || 'gemini-3.7-flash',
  ...(process.env.GEMINI_FALLBACK_MODELS || 'gemini-2.5-flash,gemini-3.5-flash-lite')
    .split(',')
    .map(model => model.trim())
    .filter(Boolean)
])];
const aiRequests = new Map();

app.set('trust proxy', 1);
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173,https://nerds-lilac.vercel.app')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origem não autorizada pelo servidor.'));
  },
  credentials: true
}));
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Muitas solicitações. Tente novamente em alguns minutos.' }
}));
const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Muitas tentativas de login. Aguarde alguns minutos.' }
});
const proposalRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 8,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Muitas propostas enviadas. Tente novamente mais tarde.' }
});
app.use(express.json({ limit: '32kb' }));
app.use(cookieParser());

const createToken = user => jwt.sign({ sub: user.id, role: user.role, name: user.name }, jwtSecret, { expiresIn: '7d' });
const publicUser = user => ({ id: user.id, name: user.name, email: user.email, role: user.role });
const sessionCookieOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 604800000
};

const auth = (req, res, next) => {
  const token = req.cookies.ners_session;
  if (!token) return res.status(401).json({ error: 'Autenticação necessária.' });
  try {
    req.user = jwt.verify(token, jwtSecret);
    next();
  } catch {
    res.clearCookie('ners_session');
    return res.status(401).json({ error: 'Sessão inválida ou expirada.' });
  }
};
const admin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acesso restrito ao administrador.' });
  next();
};
const adminOnly = [auth, admin];
const text = (value, fallback = '') => typeof value === 'string' ? value.trim() : fallback;
const positiveId = value => Number.isInteger(Number(value)) && Number(value) > 0;
const emailSchema = z.string().trim().email();
const authSchema = z.object({ email: emailSchema, password: z.string().min(8).max(128) });
const registerSchema = authSchema.extend({ name: z.string().trim().min(2).max(100) });
const proposalSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: emailSchema,
  institution: z.string().trim().min(2).max(160),
  challenge: z.string().trim().min(10).max(5000),
  context: z.string().trim().max(5000).optional().default(''),
  desiredImpact: z.string().trim().max(5000).optional().default('')
});

app.get('/api/health', (_req, res) => {
  try {
    db.prepare('SELECT 1').get();
    res.json({ status: 'ok', database: 'ok', ai: Boolean(process.env.GEMINI_API_KEY) });
  } catch {
    res.status(503).json({ status: 'degraded', database: 'error', ai: Boolean(process.env.GEMINI_API_KEY) });
  }
});

app.use('/api', (req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/admin') && !req.path.startsWith('/auth') && !req.path.startsWith('/ai')) {
    res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=120');
  }
  next();
});

app.post('/api/auth/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Informe nome, e-mail válido e senha com no mínimo 8 caracteres.' });
  }
  const { name, email, password } = parsed.data;
  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const result = db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)').run(name.trim(), email.trim(), passwordHash);
    const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(result.lastInsertRowid);
    res.cookie('ners_session', createToken(user), sessionCookieOptions);
    return res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') return res.status(409).json({ error: 'Este e-mail já está cadastrado.' });
    throw error;
  }
});

app.post('/api/auth/login', loginRateLimit, async (req, res) => {
  const parsed = authSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'E-mail e senha válidos são obrigatórios.' });
  const { email, password } = parsed.data;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.trim());
  if (!user || !(await bcrypt.compare(password, user.password_hash))) return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
  res.cookie('ners_session', createToken(user), sessionCookieOptions);
  res.json({ user: publicUser(user) });
});

app.post('/api/auth/logout', (_req, res) => {
  res.clearCookie('ners_session');
  res.status(204).end();
});

app.get('/api/auth/me', auth, (req, res) => {
  const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(req.user.sub);
  if (!user) return res.status(401).json({ error: 'Usuário não encontrado.' });
  res.json({ user: publicUser(user) });
});

app.get('/api/courses', (_req, res) => res.json(db.prepare('SELECT id, title, category, progress, image, signup_url AS signupUrl, description FROM courses ORDER BY id').all()));
app.get('/api/articles', (_req, res) => res.json(db.prepare('SELECT id, title, tags, date, read_time AS readTime, image, content, url FROM articles ORDER BY id').all().map(item => ({ ...item, tags: JSON.parse(item.tags) }))));
app.get('/api/edicts', (_req, res) => res.json(db.prepare('SELECT id, title, type, deadline, status, description, form_url AS formUrl FROM edicts ORDER BY id').all()));
app.get('/api/members', (_req, res) => res.json(db.prepare('SELECT id, name, role, image FROM members ORDER BY name').all()));
app.get('/api/events', (_req, res) => res.json(db.prepare('SELECT id, title, description, date, location, image, url FROM events ORDER BY date').all()));
app.get('/api/prototypes', (_req, res) => res.json(db.prepare('SELECT id, title, summary, description, status, stack, image, url FROM prototypes ORDER BY id').all().map(item => ({ ...item, stack: JSON.parse(item.stack) }))));

app.post('/api/proposals', proposalRateLimit, (req, res) => {
  const parsed = proposalSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Informe nome, e-mail válido, instituição e o desafio.' });
  }
  const result = db.prepare('INSERT INTO proposals (name, email, institution, challenge, context, desired_impact) VALUES (?, ?, ?, ?, ?, ?)').run(parsed.data.name, parsed.data.email, parsed.data.institution, parsed.data.challenge, parsed.data.context, parsed.data.desiredImpact);
  res.status(201).json({ id: result.lastInsertRowid });
});
app.get('/api/admin/proposals', ...adminOnly, (_req, res) => res.json(db.prepare('SELECT id, name, email, institution, challenge, context, desired_impact AS desiredImpact, status, created_at AS createdAt FROM proposals ORDER BY created_at DESC').all()));
app.post('/api/admin/proposals', ...adminOnly, (req, res) => {
  const { name, email, institution, challenge, context, desiredImpact, status } = req.body ?? {};
  if (!text(name) || !text(email) || !text(institution) || !text(challenge)) return res.status(400).json({ error: 'Nome, e-mail, instituição e desafio são obrigatórios.' });
  const result = db.prepare('INSERT INTO proposals (name, email, institution, challenge, context, desired_impact, status) VALUES (?, ?, ?, ?, ?, ?, ?)').run(text(name), text(email), text(institution), text(challenge), text(context), text(desiredImpact), text(status, 'Recebida'));
  res.status(201).json({ id: result.lastInsertRowid });
});
app.put('/api/admin/proposals/:id', ...adminOnly, (req, res) => {
  const { name, email, institution, challenge, context, desiredImpact, status } = req.body ?? {};
  const result = db.prepare('UPDATE proposals SET name=?, email=?, institution=?, challenge=?, context=?, desired_impact=?, status=? WHERE id=?').run(text(name), text(email), text(institution), text(challenge), text(context), text(desiredImpact), text(status, 'Recebida'), req.params.id);
  if (!result.changes) return res.status(404).json({ error: 'Proposta não encontrada.' });
  res.status(204).end();
});
app.delete('/api/admin/proposals/:id', ...adminOnly, (req, res) => {
  const result = db.prepare('DELETE FROM proposals WHERE id=?').run(req.params.id);
  if (!result.changes) return res.status(404).json({ error: 'Proposta não encontrada.' });
  res.status(204).end();
});
app.get('/api/admin/prototypes', ...adminOnly, (_req, res) => res.json(db.prepare('SELECT id, title, summary, description, status, stack, image, url FROM prototypes ORDER BY id').all().map(item => ({ ...item, stack: JSON.parse(item.stack) }))));
app.post('/api/admin/prototypes', ...adminOnly, (req, res) => {
  const { title, summary, description, status, stack, image, url } = req.body ?? {};
  if (!text(title) || !text(summary)) return res.status(400).json({ error: 'Título e resumo são obrigatórios.' });
  const result = db.prepare('INSERT INTO prototypes (title, summary, description, status, stack, image, url) VALUES (?, ?, ?, ?, ?, ?, ?)').run(text(title), text(summary), text(description), text(status, 'Laboratório'), JSON.stringify(Array.isArray(stack) ? stack : []), text(image), text(url));
  res.status(201).json({ id: result.lastInsertRowid });
});
app.put('/api/admin/prototypes/:id', ...adminOnly, (req, res) => {
  const { title, summary, description, status, stack, image, url } = req.body ?? {};
  const result = db.prepare('UPDATE prototypes SET title=?, summary=?, description=?, status=?, stack=?, image=?, url=? WHERE id=?').run(text(title), text(summary), text(description), text(status, 'Laboratório'), JSON.stringify(Array.isArray(stack) ? stack : []), text(image), text(url), req.params.id);
  if (!result.changes) return res.status(404).json({ error: 'Protótipo não encontrado.' });
  res.status(204).end();
});
app.delete('/api/admin/prototypes/:id', ...adminOnly, (req, res) => {
  const result = db.prepare('DELETE FROM prototypes WHERE id=?').run(req.params.id);
  if (!result.changes) return res.status(404).json({ error: 'Protótipo não encontrado.' });
  res.status(204).end();
});

app.post('/api/admin/courses', ...adminOnly, (req, res) => {
  const { title, category, progress, image, signupUrl, description } = req.body ?? {};
  if (!text(title) || !text(category) || !text(image)) return res.status(400).json({ error: 'Título, categoria e foto são obrigatórios.' });
  const result = db.prepare('INSERT INTO courses (title, category, progress, image, signup_url, description) VALUES (?, ?, ?, ?, ?, ?)').run(text(title), text(category), Math.min(100, Math.max(0, Number(progress) || 0)), text(image), text(signupUrl), text(description));
  res.status(201).json({ id: result.lastInsertRowid });
});
app.put('/api/admin/courses/:id', ...adminOnly, (req, res) => {
  if (!positiveId(req.params.id)) return res.status(400).json({ error: 'ID inválido.' });
  const { title, category, progress, image, signupUrl, description } = req.body ?? {};
  const result = db.prepare('UPDATE courses SET title=?, category=?, progress=?, image=?, signup_url=?, description=? WHERE id=?').run(text(title), text(category), Math.min(100, Math.max(0, Number(progress) || 0)), text(image), text(signupUrl), text(description), req.params.id);
  if (!result.changes) return res.status(404).json({ error: 'Curso não encontrado.' });
  res.status(204).end();
});
app.delete('/api/admin/courses/:id', ...adminOnly, (req, res) => {
  const result = db.prepare('DELETE FROM courses WHERE id=?').run(req.params.id);
  if (!result.changes) return res.status(404).json({ error: 'Curso não encontrado.' });
  res.status(204).end();
});

app.post('/api/admin/articles', ...adminOnly, (req, res) => {
  const { title, tags, date, readTime, image, content, url } = req.body ?? {};
  if (!text(title) || !text(date)) return res.status(400).json({ error: 'Título e data são obrigatórios.' });
  const result = db.prepare('INSERT INTO articles (title,tags,date,read_time,image,content,url) VALUES (?,?,?,?,?,?,?)').run(text(title), JSON.stringify(Array.isArray(tags) ? tags.map(item => text(item)).filter(Boolean) : []), text(date), text(readTime), text(image), text(content), text(url));
  res.status(201).json({ id: result.lastInsertRowid });
});
app.put('/api/admin/articles/:id', ...adminOnly, (req, res) => {
  const { title, tags, date, readTime, image, content, url } = req.body ?? {};
  const result = db.prepare('UPDATE articles SET title=?,tags=?,date=?,read_time=?,image=?,content=?,url=? WHERE id=?').run(text(title), JSON.stringify(Array.isArray(tags) ? tags : []), text(date), text(readTime), text(image), text(content), text(url), req.params.id);
  if (!result.changes) return res.status(404).json({ error: 'Artigo não encontrado.' });
  res.status(204).end();
});
app.delete('/api/admin/articles/:id', ...adminOnly, (req, res) => {
  const result = db.prepare('DELETE FROM articles WHERE id=?').run(req.params.id);
  if (!result.changes) return res.status(404).json({ error: 'Artigo não encontrado.' });
  res.status(204).end();
});

app.post('/api/admin/edicts', ...adminOnly, (req, res) => {
  const { title, type, deadline, status, description, formUrl } = req.body ?? {};
  if (!text(title) || !text(type) || !text(deadline)) return res.status(400).json({ error: 'Título, tipo e prazo são obrigatórios.' });
  const result = db.prepare('INSERT INTO edicts (title,type,deadline,status,description,form_url) VALUES (?,?,?,?,?,?)').run(text(title), text(type), text(deadline), text(status, 'Aberto'), text(description), text(formUrl));
  res.status(201).json({ id: result.lastInsertRowid });
});
app.put('/api/admin/edicts/:id', ...adminOnly, (req, res) => {
  const { title, type, deadline, status, description, formUrl } = req.body ?? {};
  const result = db.prepare('UPDATE edicts SET title=?,type=?,deadline=?,status=?,description=?,form_url=? WHERE id=?').run(text(title), text(type), text(deadline), text(status), text(description), text(formUrl), req.params.id);
  if (!result.changes) return res.status(404).json({ error: 'Edital não encontrado.' });
  res.status(204).end();
});
app.delete('/api/admin/edicts/:id', ...adminOnly, (req, res) => {
  const result = db.prepare('DELETE FROM edicts WHERE id=?').run(req.params.id);
  if (!result.changes) return res.status(404).json({ error: 'Edital não encontrado.' });
  res.status(204).end();
});

app.post('/api/admin/events', ...adminOnly, (req, res) => {
  const { title, description, date, location, image, url } = req.body ?? {};
  if (!text(title) || !text(date)) return res.status(400).json({ error: 'Título e data são obrigatórios.' });
  const result = db.prepare('INSERT INTO events (title,description,date,location,image,url) VALUES (?,?,?,?,?,?)').run(text(title), text(description), text(date), text(location), text(image), text(url));
  res.status(201).json({ id: result.lastInsertRowid });
});
app.put('/api/admin/events/:id', ...adminOnly, (req, res) => {
  const { title, description, date, location, image, url } = req.body ?? {};
  const result = db.prepare('UPDATE events SET title=?,description=?,date=?,location=?,image=?,url=? WHERE id=?').run(text(title), text(description), text(date), text(location), text(image), text(url), req.params.id);
  if (!result.changes) return res.status(404).json({ error: 'Evento não encontrado.' });
  res.status(204).end();
});
app.delete('/api/admin/events/:id', ...adminOnly, (req, res) => {
  const result = db.prepare('DELETE FROM events WHERE id=?').run(req.params.id);
  if (!result.changes) return res.status(404).json({ error: 'Evento não encontrado.' });
  res.status(204).end();
});

app.post('/api/admin/members', ...adminOnly, (req, res) => {
  const { name, role, image } = req.body ?? {};
  if (!text(name) || !text(role)) return res.status(400).json({ error: 'Nome e função são obrigatórios.' });
  const result = db.prepare('INSERT INTO members (name,role,image) VALUES (?,?,?)').run(text(name), text(role), text(image));
  res.status(201).json({ id: result.lastInsertRowid });
});
app.put('/api/admin/members/:id', ...adminOnly, (req, res) => {
  const { name, role, image } = req.body ?? {};
  const result = db.prepare('UPDATE members SET name=?,role=?,image=? WHERE id=?').run(text(name), text(role), text(image), req.params.id);
  if (!result.changes) return res.status(404).json({ error: 'Membro não encontrado.' });
  res.status(204).end();
});
app.delete('/api/admin/members/:id', ...adminOnly, (req, res) => {
  const result = db.prepare('DELETE FROM members WHERE id=?').run(req.params.id);
  if (!result.changes) return res.status(404).json({ error: 'Membro não encontrado.' });
  res.status(204).end();
});

app.post('/api/ai/generate', async (req, res) => {
  const { messages, systemInstruction } = req.body ?? {};
  if (!process.env.GEMINI_API_KEY) return res.status(503).json({ error: 'O Nerdinho está aguardando a chave GEMINI_API_KEY no servidor.' });
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 20) return res.status(400).json({ error: 'Histórico de mensagens inválido.' });
  const now = Date.now();
  const clientKey = req.ip || req.socket.remoteAddress || 'unknown';
  const recentRequests = (aiRequests.get(clientKey) || []).filter(timestamp => now - timestamp < 60000);
  if (recentRequests.length >= 20) return res.status(429).json({ error: 'Muitas mensagens em pouco tempo. Tente novamente em um minuto.' });
  recentRequests.push(now);
  aiRequests.set(clientKey, recentRequests);
  let lastError = 'Os modelos de IA estão temporariamente indisponíveis.';
  for (const model of geminiModels) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: messages, ...(systemInstruction ? { systemInstruction: { parts: [{ text: systemInstruction }] } } : {}) })
        });
        const data = await response.json();
        if (response.ok) {
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (text) return res.json({ text });
          lastError = `O modelo ${model} retornou uma resposta vazia.`;
          break;
        }
        lastError = data.error?.message || `O modelo ${model} não respondeu.`;
        if (![429, 500, 502, 503, 504].includes(response.status)) break;
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Falha de conexão com o provedor de IA.';
      }
    }
  }
  return res.status(502).json({ error: `O Nerdinho tentou modelos alternativos, mas a IA está temporariamente indisponível. ${lastError}` });
});

const cleanupAiRequests = () => {
  const cutoff = Date.now() - 60000;
  for (const [key, timestamps] of aiRequests) {
    const recent = timestamps.filter(timestamp => timestamp > cutoff);
    if (recent.length) aiRequests.set(key, recent);
    else aiRequests.delete(key);
  }
};
const cleanupTimer = setInterval(cleanupAiRequests, 5 * 60 * 1000);
cleanupTimer.unref();

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

const server = app.listen(port, () => console.log(`NERDS API disponível em http://localhost:${port}`));
const shutdown = signal => {
  console.log(`Recebido ${signal}. Encerrando API...`);
  clearInterval(cleanupTimer);
  server.close(() => {
    db.close();
    process.exit(0);
  });
};
process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));
process.on('unhandledRejection', error => console.error('Unhandled rejection:', error));
