import { CURRENT_MEMBER_NAME_ALIASES, MEMBERS } from './portfolio';

export interface AlumniMember {
  id: string;
  name: string;
  role: string;
  image: string;
  period?: string;
}

const normalizeName = (name: string) => name
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase('pt-BR')
  .replace(/[^a-z0-9]/g, '');

const currentMemberNames = new Set(MEMBERS.map(member => normalizeName(member.name)));
const currentMemberPhotoAliases = new Set(CURRENT_MEMBER_NAME_ALIASES.map(normalizeName));
const canonicalNameByAlias: Record<string, string> = {
  [normalizeName('Alan Victor')]: 'Alan Victor Soares Vieira',
  [normalizeName('Antonio Deodato')]: 'Antonio Rodrigues Deodato',
  [normalizeName('Cauan Halison')]: 'Cauan Halison Arantes de Oliveira',
  [normalizeName('Deo')]: 'Antonio Rodrigues Deodato',
  [normalizeName('Deo2')]: 'Deoclecio',
  [normalizeName('Emilio')]: 'Emílio',
  [normalizeName('Evelyn')]: 'Evelyn de Sena Cavalcante',
  [normalizeName('Gustavo')]: 'Gustavo Gabriel Rocha e Silva',
  [normalizeName('Heloisa')]: 'Heloísa Éven Feitoza Ricardino',
  [normalizeName('Marcos Vinicius')]: 'Marcos Vinicius de Andrade Lima',
  [normalizeName('Marcus Linhares')]: 'Marcus Vinicius Linhares de Lima',
  [normalizeName('Marcus Vinicius')]: 'Marcus Vinicius Linhares de Lima',
  [normalizeName('Milena')]: 'Milena de Santiago Maia Costa',
  [normalizeName('Miqueias')]: 'Miquéias Santiago de Almeida',
  [normalizeName('Prof Marcos Vinicius')]: 'Marcos Vinicius de Andrade Lima',
  [normalizeName('Samuel')]: 'Samuel Deolino',
  [normalizeName('Yuri Banco Back')]: 'Yuri'
};

const alumniPhotos = import.meta.glob<string>('../assets/Fotos Membros Antigos/*', {
  eager: true,
  query: '?url',
  import: 'default'
});
const historicalTeamPhotos = import.meta.glob<string>('../assets/Fotos - Time NERDS */*', {
  eager: true,
  query: '?url',
  import: 'default'
});

const alumniByName = new Map<string, Omit<AlumniMember, 'id'>>();

const addAlumniPhoto = (path: string, image: string, period?: string) => {
  const filename = path.split('/').pop() ?? '';
  const baseName = filename.replace(/\.[^.]+$/, '');
  const [rawName, ...roleParts] = baseName.split(' - ');
  if (/^screenshot(?:_|$)/i.test(rawName.trim()) || /^time(?:\s+nerds)?$/i.test(rawName.trim())) {
    return;
  }

  const normalizedRawName = normalizeName(rawName.replace(/[-_]+/g, ' '));
  const canonicalName = canonicalNameByAlias[normalizedRawName] ?? rawName.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
  const nameKey = normalizeName(canonicalName);

  if (currentMemberNames.has(nameKey) || currentMemberPhotoAliases.has(normalizedRawName)) {
    return;
  }

  const role = roleParts.join(' - ').trim();
  const existing = alumniByName.get(nameKey);
  const periods = new Set([...(existing?.period?.split(', ') ?? []), ...(period ? [period] : [])]);
  if (!existing || (!existing.role && role)) {
    alumniByName.set(nameKey, {
      name: canonicalName,
      role: role || existing?.role || '',
      image: existing?.image ?? image,
      period: periods.size ? Array.from(periods).sort().join(', ') : undefined
    });
  } else if (periods.size) {
    alumniByName.set(nameKey, { ...existing, period: Array.from(periods).sort().join(', ') });
  }
};

for (const [path, image] of Object.entries(alumniPhotos)) {
  addAlumniPhoto(path, image);
}

for (const [path, image] of Object.entries(historicalTeamPhotos)) {
  const folder = path.split('/').slice(-2, -1)[0] ?? '';
  if (!folder.startsWith('Fotos - Time NERDS ') || folder === 'Fotos - Time NERDS 2026.2') {
    continue;
  }
  addAlumniPhoto(path, image, folder.replace('Fotos - Time NERDS ', ''));
}

export const ALUMNI_MEMBERS: AlumniMember[] = Array.from(alumniByName, ([id, member]) => ({
  id,
  ...member,
  role: member.role || 'Ex-integrante NERDS'
})).sort((left, right) => left.name.localeCompare(right.name, 'pt-BR'));