import type { Member, Project } from '../types';
import gexImage from '../assets/gex.webp';

export const PROJECTS: Project[] = [
  {
    id: 1,
    slug: 'gex-web',
    title: 'GEX Web',
    description: 'Sistema web para apoiar a gestão e o acompanhamento das ações de extensão universitária da UFC, em parceria com a PREX.',
    stack: ['Aplicação web', 'Extensão', 'PREX'],
    image: gexImage,
    url: 'https://gex.ufc.br/'
  },
  {
    id: 2,
    slug: 'gex-app',
    title: 'GEX App',
    description: 'Aplicativo do GEX desenvolvido pelo NERDS em parceria com a PREX, como uma frente própria do portfólio.',
    stack: ['Aplicativo', 'Extensão', 'PREX'],
    image: gexImage
  }
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

const memberNameByPhotoAlias: Record<string, string> = {
  [normalizeName('Arthur')]: 'Arthur Levi Frota Coelho',
  [normalizeName('Carlos Roberto Carvalho Araujo Junior')]: 'Carlos Roberto Carvalho Araujo Junior',
  [normalizeName('David Ferreira da Silva')]: 'David Ferreira da Silva',
  [normalizeName('Emilio')]: 'Emilio de Aquino Calvet',
  [normalizeName('Emylli Haika Santiago Torres')]: 'Emylli Haika Santiago Torres',
  [normalizeName('Italo Crispim Rodrigues')]: 'Italo Crispim Rodrigues',
  [normalizeName('Iuri Vinicius Goncalves Teixeira')]: 'Iuri Vinicius Goncalves Teixeira',
  [normalizeName('Marcos Vinicius')]: 'Marcos Vinicius de Andrade Lima',
  [normalizeName('Marcus Linhares')]: 'Marcus Vinicius Linhares de Lima',
  [normalizeName('Arthur Levi Frota Coelho')]: 'Arthur Levi Frota Coelho',
  [normalizeName('Emilio de Aquino Calvet')]: 'Emilio de Aquino Calvet',
  [normalizeName('Pedro Henrique Carvalho')]: 'Pedro Henrique Ribeiro Carvalho',
  [normalizeName('Pedro Henrique Ribeiro Carvalho')]: 'Pedro Henrique Ribeiro Carvalho',
  [normalizeName('Victor Ruan Rocha Rodrigues')]: 'Victor Ruan Rocha Rodrigues',
  [normalizeName('Vitoria Crispim')]: 'Vitoria Crispim',
  [normalizeName('Yago Thayson de Sousa')]: 'Yago Thayson de Sousa'
};

const membersByName = new Map<string, Member>();

for (const [path, image] of Object.entries(memberPhotos)) {
  const filename = path.split('/').pop() ?? '';
  const baseName = filename.replace(/\.[^.]+$/, '');
  const [rawName, ...roleParts] = baseName.split(' - ');
  const cleanedName = rawName
    .replace(/[-_](?:M[IÍ]DIAS|Backend)$/i, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const normalizedName = normalizeName(cleanedName);
  const name = memberNameByPhotoAlias[normalizedName] ?? cleanedName;
  const key = normalizeName(name);

  if (!membersByName.has(key)) {
    membersByName.set(key, {
      id: membersByName.size + 1,
      name,
      role: key === normalizeName('Marcos Vinicius de Andrade Lima')
        ? 'Coordenador do projeto'
        : roleParts.join(' - ').trim() || 'Integrante NERDS',
      image
    });
  }
}

export const MEMBERS: Member[] = Array.from(membersByName.values());
export const CURRENT_MEMBER_NAME_ALIASES = [
  'Arthur',
  'Emílio',
  'Erik',
  'Marcus Vinicius',
  'Marcus Linhares',
  'Emilio de Aquino Calvet',
  'José Ednaldo',
  'Pedro Henrique',
  'Thiago-Celestino',
  'Thiago-Viana',
  'Marcos-Vinicius'
];
