import type { Article, Course, Edict, Event, Member, Prototype } from '../types';

export const MOCK_COURSES: Course[] = [
  {
    id: 1,
    title: 'Back-end com Python & FastAPI',
    category: 'Desenvolvimento',
    progress: 0,
    image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bfce8?auto=format&fit=crop&q=80&w=800',
    description: 'Uma trilha prática para criar APIs modernas com Python e FastAPI, passando por rotas, validação, autenticação e publicação de serviços confiáveis.'
  },
  {
    id: 2,
    title: 'Java POO',
    category: 'Desenvolvimento',
    progress: 45,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
    description: 'Aprenda os fundamentos da programação orientada a objetos em Java construindo soluções organizadas, testáveis e fáceis de evoluir.'
  }
];

export const MOCK_ARTICLES: Article[] = [
  { id: 1, title: 'Metodologias Ágeis na Prática', tags: ['Scrum', 'Gestão'], date: '10 Out 2026', readTime: '5 min', content: 'Como transformar reuniões, entregas e aprendizado contínuo em um ritmo de desenvolvimento que faça sentido para equipes universitárias.' },
  { id: 2, title: 'Inovação Social com Tecnologia', tags: ['Extensão', 'Social'], date: '12 Out 2026', readTime: '8 min', content: 'Projetar para pessoas exige escuta, protótipos simples e tecnologia capaz de responder às necessidades reais do território.' }
];

export const MOCK_EDICTS: Edict[] = [
  { id: 1, title: 'Bolsa de Iniciação Científica - Pesquisa GEX', type: 'Pesquisa', deadline: '15 Nov 2026', status: 'Aberto', description: 'Oportunidade para investigar qualidade, evolução e uso de sistemas de informação aplicados à extensão universitária.' },
  { id: 2, title: 'Monitoria Voluntária - Back-end Python', type: 'Ensino', deadline: '20 Nov 2026', status: 'Aberto', description: 'Participe de encontros práticos sobre APIs, testes e boas decisões de arquitetura para quem está começando.' },
  { id: 3, title: 'Bolsa de Extensão - Apoio Tecnológico Comunitário', type: 'Extensão', deadline: '05 Dez 2026', status: 'Em breve', description: 'Uma frente de trabalho dedicada a criar soluções digitais próximas das demandas da comunidade.' }
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 1,
    title: 'Encontro NERDS: tecnologia e impacto social',
    description: 'Uma conversa aberta sobre projetos de extensão, oportunidades para estudantes e como transformar problemas locais em bons desafios de software.',
    date: '2026-12-10T18:00',
    location: 'UFC Campus Russas',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200',
    url: ''
  },
  {
    id: 2,
    title: 'Oficina: sua primeira API com FastAPI',
    description: 'Uma tarde mão na massa para entender rotas, dados e autenticação construindo uma API pequena do zero.',
    date: '2026-12-17T14:00',
    location: 'Laboratório de Computação 02',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200',
    url: ''
  }
];

export const MOCK_PROTOTYPES: Prototype[] = [
  {
    id: 1,
    title: 'GEX em movimento',
    summary: 'Uma nova forma de acompanhar projetos de extensão em um só lugar.',
    description: 'Protótipo de uma experiência para visualizar equipes, ações e resultados da extensão universitária com mais clareza.',
    status: 'Em produção',
    stack: ['Produto', 'Dados', 'UX'],
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=1200',
    url: ''
  },
  {
    id: 2,
    title: 'Mapa do Vale',
    summary: 'Conectando desafios locais a pessoas dispostas a construir.',
    description: 'Um mapa colaborativo para registrar desafios tecnológicos de escolas, projetos sociais e instituições da região.',
    status: 'Em pesquisa',
    stack: ['Mapas', 'Comunidade', 'Web'],
    image: 'https://images.unsplash.com/photo-1524666041070-9c876415a7b4?auto=format&fit=crop&q=80&w=1200',
    url: ''
  },
  {
    id: 3,
    title: 'Nerdinho Copilot',
    summary: 'Uma camada de inteligência para tornar o aprendizado mais próximo.',
    description: 'Experimentos de IA para orientar estudantes por cursos, oportunidades e próximos passos de aprendizagem.',
    status: 'Laboratório',
    stack: ['IA', 'Educação', 'Conversas'],
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200',
    url: ''
  }
];

const MEMBER_NAMES = [
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

export const MOCK_MEMBERS: Member[] = MEMBER_NAMES.map((name, index) => ({
  id: index + 1,
  name,
  role: 'Membro NERDS'
}));
