import type { Member, Project } from '../types';
import marcosViniciusPhoto from '../assets/Fotos Membros Antigos/Marcos-Vinicius.jpeg';
import gexImage from '../assets/gex.jpg';

export const PROJECTS: Project[] = [
  {
    id: 1,
    slug: 'sistema-gex',
    title: 'Sistema GEX',
    description: 'Plataforma de apoio à gestão e ao acompanhamento das ações de extensão universitária da UFC.',
    stack: ['Engenharia de Software', 'Extensão'],
    image: gexImage,
    url: 'https://gex.ufc.br/'
  }
];

const MEMBER_NAMES = [
  'Alan Victor Soares Vieira', 'Ana Letícia', 'Antonio Guilherme Gomes Barbosa', 'Antônio Sidney', 'Arthur',
  'Caio Rebouças da Costa', 'Caio Rian Pereira dos Santos', 'Cauan Halison Arantes de Oliveira', 'David',
  'Emílio', 'Erik Oliveira Maia', 'Ernesto', 'Gabriela Lima Silva', 'Gabriela Sousa de Oliveira',
  'Guilherme Henrique Alves Pinto', 'Gustavo Gabriel Rocha e Silva', 'João Emanuel Leite Fortaleza',
  'João Gabriel Frota de Moura Santos', 'Joel', 'José Ednardo Dantas Neto', 'Kauê Borges',
  'Lucas de Araujo Ferreira Maia', 'Lucas Rodrigues', 'Luis Rajzer', 'Marcos Davi Sena Pinheiro', 'Marcos Vinicius',
  'Marcus Linhares', 'Mateus', 'Matheus de Assis Oliveira', 'Miguel Alves de Sousa',
  'Miquéias Santiago de Almeida', 'Pedro Gabriel Quadros de Jesus', 'Pedro Henrique Zacarias dos Santos',
  'Romeu Rôsso', 'Thiago Celestino de Albuquerque', 'Thiago Viana Bezerra', 'Wallison Gomes Martins',
  'YAGO THAYSON DE SOUSA'
];

const normalizeName = (name: string) => name
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase('pt-BR')
  .replace(/[^a-z0-9]/g, '');

const memberPhotos = import.meta.glob<string>('../assets/Fotos - Time NERDS 2026.2/*', {
  eager: true,
  query: '?url',
  import: 'default'
});

const photoNameByMemberName: Record<string, string> = {
  [normalizeName('Gabriela Lima Silva')]: normalizeName('Gabriel Lima Silva'),
  [normalizeName('João Emanuel Leite Fortaleza')]: normalizeName('João Emanoel Leite Fortaleza'),
  [normalizeName('Luis Rajzer')]: normalizeName('Luis Raizer'),
  [normalizeName('Romeu Rôsso')]: normalizeName('Romeu Róseo Araújo'),
  [normalizeName('Wallison Gomes Martins')]: normalizeName('Wallison Breno Gomes Martins')
};

const photoUrlByName = new Map(
  Object.entries(memberPhotos).map(([path, url]) => {
    const filename = path.split('/').pop() ?? '';
    const name = filename.replace(/\.[^.]+$/, '').split(' - ')[0];
    return [normalizeName(name), url];
  })
);
photoUrlByName.set(normalizeName('Marcos Vinicius'), marcosViniciusPhoto);

const memberRoleByName: Record<string, string> = {
  [normalizeName('Marcos Vinicius')]: 'Coordenador do projeto'
};

export const MEMBERS: Member[] = MEMBER_NAMES.map((name, index) => {
  const photoName = photoNameByMemberName[normalizeName(name)] ?? normalizeName(name);
  const normalizedName = normalizeName(name);

  return {
    id: index + 1,
    name,
    role: memberRoleByName[normalizedName] ?? 'Integrante NERDS',
    image: photoUrlByName.get(photoName)
  };
});
