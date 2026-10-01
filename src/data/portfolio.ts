import type { Member, Project } from '../types';

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Sistema GEX',
    description: 'Plataforma de apoio à gestão e ao acompanhamento das ações de extensão universitária da UFC.',
    stack: ['Engenharia de Software', 'Extensão'],
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 2,
    title: 'Mapa do Vale',
    description: 'Iniciativa para aproximar desafios da região do Vale do Jaguaribe de pessoas interessadas em construir soluções.',
    stack: ['Comunidade', 'Tecnologia'],
    image: 'https://images.unsplash.com/photo-1524666041070-9c876415a7b4?auto=format&fit=crop&q=80&w=1200'
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

export const MEMBERS: Member[] = MEMBER_NAMES.map((name, index) => ({
  id: index + 1,
  name,
  role: 'Integrante NERDS'
}));
