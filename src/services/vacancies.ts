import { ACTION_ID } from './news';

export interface ActionVacancy {
  id: string;
  titulo: string;
  dataInicioInscricao: string | null;
  dataFimInscricao: string | null;
  localVaga: string | null;
  tags: string[] | null;
  textoInformativo: string | null;
  linkEdital: string | null;
  linkInscricao: string | null;
  imagemUrl: string | null;
  acaoImagemUrl: string | null;
  descricaoImagem: string | null;
  autorNome: string | null;
  status: string | null;
  isBolsistaRemunerado: boolean;
  isEstagiario: boolean;
}

export interface ActionVacancyPage {
  content: ActionVacancy[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

const VACANCY_ENDPOINT = 'https://gex.dev.nerds.cloudns.be/api/vaga/filtro';

export async function fetchActionVacancies(page: number, size: number, signal: AbortSignal): Promise<ActionVacancyPage> {
  const params = new URLSearchParams({ page: String(page), size: String(size), acaoId: ACTION_ID });
  const response = await fetch(`${VACANCY_ENDPOINT}?${params}`, { signal });

  if (!response.ok) {
    throw new Error(`A API respondeu com erro ${response.status}.`);
  }

  const result = await response.json() as ActionVacancyPage;
  if (!Array.isArray(result.content)) {
    throw new Error('A resposta da API não contém uma lista de vagas.');
  }

  return result;
}