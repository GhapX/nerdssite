import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const databasePath = resolve(process.env.DATABASE_PATH || './data/ners.sqlite');
mkdirSync(dirname(databasePath), { recursive: true });

const db = new Database(databasePath);
db.pragma('journal_mode = WAL');
db.pragma('busy_timeout = 5000');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    progress INTEGER NOT NULL DEFAULT 0 CHECK(progress BETWEEN 0 AND 100),
    image TEXT NOT NULL,
    signup_url TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT ''
  );
  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    tags TEXT NOT NULL DEFAULT '[]',
    date TEXT NOT NULL,
    read_time TEXT NOT NULL,
    image TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL DEFAULT '',
    url TEXT NOT NULL DEFAULT ''
  );
  CREATE TABLE IF NOT EXISTS edicts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    deadline TEXT NOT NULL,
    status TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    form_url TEXT NOT NULL DEFAULT ''
  );
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    date TEXT NOT NULL,
    location TEXT NOT NULL DEFAULT '',
    image TEXT NOT NULL DEFAULT '',
    url TEXT NOT NULL DEFAULT ''
  );
  CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    image TEXT NOT NULL DEFAULT ''
  );
  CREATE TABLE IF NOT EXISTS proposals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    institution TEXT NOT NULL,
    challenge TEXT NOT NULL,
    context TEXT NOT NULL DEFAULT '',
    desired_impact TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'Recebida',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS prototypes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'Laboratório',
    stack TEXT NOT NULL DEFAULT '[]',
    image TEXT NOT NULL DEFAULT '',
    url TEXT NOT NULL DEFAULT ''
  );
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
  CREATE INDEX IF NOT EXISTS idx_articles_date ON articles(date);
  CREATE INDEX IF NOT EXISTS idx_edicts_status_deadline ON edicts(status, deadline);
  CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
  CREATE INDEX IF NOT EXISTS idx_proposals_status_created ON proposals(status, created_at);
  CREATE INDEX IF NOT EXISTS idx_prototypes_status ON prototypes(status);
`);

const columns = [
  ['courses', 'signup_url', "TEXT NOT NULL DEFAULT ''"],
  ['courses', 'description', "TEXT NOT NULL DEFAULT ''"],
  ['articles', 'image', "TEXT NOT NULL DEFAULT ''"],
  ['articles', 'content', "TEXT NOT NULL DEFAULT ''"],
  ['articles', 'url', "TEXT NOT NULL DEFAULT ''"],
  ['edicts', 'description', "TEXT NOT NULL DEFAULT ''"],
  ['edicts', 'form_url', "TEXT NOT NULL DEFAULT ''"]
  ,['members', 'image', "TEXT NOT NULL DEFAULT ''"]
];
for (const [table, column, definition] of columns) {
  const exists = db.prepare(`PRAGMA table_info(${table})`).all().some(item => item.name === column);
  if (!exists) db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
}

db.prepare('UPDATE courses SET description = ? WHERE title = ? AND description = ?').run(
  'Uma trilha prática para criar APIs modernas com Python e FastAPI, passando por rotas, validação, autenticação e publicação de serviços confiáveis.',
  'Back-end com Python & FastAPI',
  ''
);
db.prepare('UPDATE courses SET description = ? WHERE title = ? AND description = ?').run(
  'Aprenda os fundamentos da programação orientada a objetos em Java construindo soluções organizadas, testáveis e fáceis de evoluir.',
  'Java POO',
  ''
);
db.prepare('UPDATE articles SET content = ? WHERE title = ? AND content = ?').run(
  'Como transformar reuniões, entregas e aprendizado contínuo em um ritmo de desenvolvimento que faça sentido para equipes universitárias.',
  'Metodologias Ágeis na Prática',
  ''
);
db.prepare('UPDATE articles SET content = ? WHERE title = ? AND content = ?').run(
  'Projetar para pessoas exige escuta, protótipos simples e tecnologia capaz de responder às necessidades reais do território.',
  'Inovação Social com Tecnologia',
  ''
);
db.prepare('UPDATE edicts SET description = ? WHERE title = ? AND description = ?').run(
  'Oportunidade para investigar qualidade, evolução e uso de sistemas de informação aplicados à extensão universitária.',
  'Bolsa de Iniciação Científica - Pesquisa GEX',
  ''
);
db.prepare('UPDATE edicts SET description = ? WHERE title = ? AND description = ?').run(
  'Participe de encontros práticos sobre APIs, testes e boas decisões de arquitetura para quem está começando.',
  'Monitoria Voluntária - Back-end Python',
  ''
);
db.prepare('UPDATE edicts SET description = ? WHERE title = ? AND description = ?').run(
  'Uma frente de trabalho dedicada a criar soluções digitais próximas das demandas da comunidade.',
  'Bolsa de Extensão - Apoio Tecnológico Comunitário',
  ''
);

export default db;
