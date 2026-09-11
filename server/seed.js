import db from './db.js';
import bcrypt from 'bcryptjs';

const seed = db.transaction(() => {
  if (db.prepare('SELECT COUNT(*) AS count FROM courses').get().count === 0) {
    db.prepare('INSERT INTO courses (title, category, progress, image, description) VALUES (?, ?, ?, ?, ?)').run(
      'Back-end com Python & FastAPI', 'Desenvolvimento', 0,
      'https://images.unsplash.com/photo-1526379095098-d400fd0bfce8?auto=format&fit=crop&q=80&w=800',
      'Uma trilha prática para criar APIs modernas com Python e FastAPI, passando por rotas, validação, autenticação e publicação de serviços confiáveis.'
    );
    db.prepare('INSERT INTO courses (title, category, progress, image, description) VALUES (?, ?, ?, ?, ?)').run(
      'Java POO', 'Desenvolvimento', 45,
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
      'Aprenda os fundamentos da programação orientada a objetos em Java construindo soluções organizadas, testáveis e fáceis de evoluir.'
    );
  }
  if (db.prepare('SELECT COUNT(*) AS count FROM articles').get().count === 0) {
    const insert = db.prepare('INSERT INTO articles (title, tags, date, read_time, content) VALUES (?, ?, ?, ?, ?)');
    insert.run('Metodologias Ágeis na Prática', JSON.stringify(['Scrum', 'Gestão']), '10 Out 2026', '5 min', 'Como transformar reuniões, entregas e aprendizado contínuo em um ritmo de desenvolvimento que faça sentido para equipes universitárias.');
    insert.run('Inovação Social com Tecnologia', JSON.stringify(['Extensão', 'Social']), '12 Out 2026', '8 min', 'Projetar para pessoas exige escuta, protótipos simples e tecnologia capaz de responder às necessidades reais do território.');
  }
  if (db.prepare('SELECT COUNT(*) AS count FROM edicts').get().count === 0) {
    const insert = db.prepare('INSERT INTO edicts (title, type, deadline, status, description) VALUES (?, ?, ?, ?, ?)');
    insert.run('Bolsa de Iniciação Científica - Pesquisa GEX', 'Pesquisa', '15 Nov 2026', 'Aberto', 'Oportunidade para investigar qualidade, evolução e uso de sistemas de informação aplicados à extensão universitária.');
    insert.run('Monitoria Voluntária - Back-end Python', 'Ensino', '20 Nov 2026', 'Aberto', 'Participe de encontros práticos sobre APIs, testes e boas decisões de arquitetura para quem está começando.');
    insert.run('Bolsa de Extensão - Apoio Tecnológico Comunitário', 'Extensão', '05 Dez 2026', 'Em breve', 'Uma frente de trabalho dedicada a criar soluções digitais próximas das demandas da comunidade.');
  }
  if (db.prepare('SELECT COUNT(*) AS count FROM events').get().count === 0) {
    db.prepare('INSERT INTO events (title, description, date, location, image, url) VALUES (?, ?, ?, ?, ?, ?)').run(
      'Encontro NERDS: tecnologia e impacto social',
      'Roda de conversa sobre projetos de extensão e oportunidades para estudantes.',
      '2026-12-10T18:00',
      'UFC Campus Russas',
      '',
      ''
    );
  }
  if (db.prepare('SELECT COUNT(*) AS count FROM prototypes').get().count === 0) {
    const insert = db.prepare('INSERT INTO prototypes (title, summary, description, status, stack, image, url) VALUES (?, ?, ?, ?, ?, ?, ?)');
    insert.run('GEX em movimento', 'Uma nova forma de acompanhar projetos de extensão em um só lugar.', 'Protótipo de uma experiência para visualizar equipes, ações e resultados da extensão universitária com mais clareza.', 'Em produção', JSON.stringify(['Produto', 'Dados', 'UX']), 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=1200', '');
    insert.run('Mapa do Vale', 'Conectando desafios locais a pessoas dispostas a construir.', 'Um mapa colaborativo para registrar desafios tecnológicos de escolas, projetos sociais e instituições da região.', 'Em pesquisa', JSON.stringify(['Mapas', 'Comunidade', 'Web']), 'https://images.unsplash.com/photo-1524666041070-9c876415a7b4?auto=format&fit=crop&q=80&w=1200', '');
    insert.run('Nerdinho Copilot', 'Uma camada de inteligência para tornar o aprendizado mais próximo.', 'Experimentos de IA para orientar estudantes por cursos, oportunidades e próximos passos de aprendizagem.', 'Laboratório', JSON.stringify(['IA', 'Educação', 'Conversas']), 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200', '');
  }
  if (db.prepare('SELECT COUNT(*) AS count FROM members').get().count === 0) {
    const names = [
      'Alan Victor Soares Vieira', 'Ana Letícia', 'Antonio Guilherme Gomes Barbosa', 'Antônio Sidney', 'Arthur',
      'Caio Rebouças da Costa', 'Caio Rian Pereira dos Santos', 'Cauan Halison Arantes de Oliveira', 'David',
      'Emílio', 'Erik Oliveira Maia', 'Ernesto', 'Gabriela Lima Silva', 'Gabriela Sousa de Oliveira',
      'Guilherme Henrique Alves Pinto', 'Gustavo Gabriel Rocha e Silva', 'João Emanuel Leite Fortaleza',
      'João Gabriel Frota de Moura Santos', 'Joel', 'José Ednardo Dantas Neto', 'Kauê Borges',
      'Lucas de Araujo Ferreira Maia', 'Lucas Rodrigues', 'Luis Rajzer', 'Marcos Davi Sena Pinheiro',
      'Marcus Linhares', 'Mateus', 'Matheus de Assis Oliveira', 'Miguel Alves de Sousa',
      'Miquéias Santiago de Almeida', 'Pedro Gabriel Quadros de Jesus', 'Pedro Henrique Zacarias dos Santos',
      'Romeu Rôsso', 'Thiago Celestino de Albuquerque', 'Thiago Viana Bezerra', 'Wallison Gomes Martins',
      'YAGO THAYSON DE SOUSA'
    ];
    const insert = db.prepare('INSERT INTO members (name, role) VALUES (?, ?)');
    for (const name of names) insert.run(name, 'Membro NERDS');
  }
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(process.env.ADMIN_EMAIL);
    if (!existing) {
      const passwordHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 12);
      db.prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)').run(
        process.env.ADMIN_NAME || 'Administrador NERDS',
        process.env.ADMIN_EMAIL,
        passwordHash,
        'admin'
      );
    } else {
      db.prepare('UPDATE users SET role = ? WHERE id = ?').run('admin', existing.id);
    }
  }
});

seed();
