import { MEMBERS } from './portfolio';

export interface AlumniMember {
  id: string;
  name: string;
  role: string;
  image: string;
}

const normalizeName = (name: string) => name
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase('pt-BR')
  .replace(/[^a-z0-9]/g, '');

const currentMemberNames = new Set(MEMBERS.map(member => normalizeName(member.name)));
const currentMemberPhotoAliases = new Set([
  'Erik',
  'Gabriel Lima Silva',
  'João Emanoel Leite Fortaleza',
  'José Ednaldo',
  'Luis Raizer',
  'Pedro Henrique',
  'Romeu Róseo Araújo',
  'Thiago Celestino',
  'Thiago Viana',
  'Wallison Breno Gomes Martins'
].map(normalizeName));
const canonicalNameByAlias: Record<string, string> = {
  [normalizeName('Antonio Deodato')]: 'Antonio Rodrigues Deodato'
};

const alumniPhotos = import.meta.glob<string>('../assets/Fotos Membros Antigos/*', {
  eager: true,
  query: '?url',
  import: 'default'
});

const alumniByName = new Map<string, Omit<AlumniMember, 'id'>>();

for (const [path, image] of Object.entries(alumniPhotos)) {
  const filename = path.split('/').pop() ?? '';
  const baseName = filename.replace(/\.[^.]+$/, '');
  const [rawName, ...roleParts] = baseName.split(' - ');
  const normalizedRawName = normalizeName(rawName.replace(/[-_]+/g, ' '));
  const canonicalName = canonicalNameByAlias[normalizedRawName] ?? rawName.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
  const nameKey = normalizeName(canonicalName);

  if (currentMemberNames.has(nameKey) || currentMemberPhotoAliases.has(normalizedRawName)) {
    continue;
  }

  const role = roleParts.join(' - ').trim();
  const existing = alumniByName.get(nameKey);
  if (!existing || (!existing.role && role)) {
    alumniByName.set(nameKey, { name: canonicalName, role, image });
  }
}

export const ALUMNI_MEMBERS: AlumniMember[] = Array.from(alumniByName, ([id, member]) => ({
  id,
  ...member,
  role: member.role || 'Ex-integrante NERDS'
})).sort((left, right) => left.name.localeCompare(right.name, 'pt-BR'));