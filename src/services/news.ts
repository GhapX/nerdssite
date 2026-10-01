export interface ActionNews {
  id: string;
  titulo: string;
  texto: string;
  dataPublicacao: string;
  fonte: string | null;
  numeroVisualizacoes: number | null;
  numeroCurtidas: number | null;
  numeroCompartilhamentos: number | null;
  autorPublicacaoNome: string | null;
  acaoSigla: string | null;
  imagemUrl: string | null;
  descricaoImagem: string | null;
  palavrasChaves: string[] | null;
}

export interface ActionNewsPage {
  content: ActionNews[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export const ACTION_ID = '6f1b3d2b-8d27-4ec9-bd9c-b816f7db81c1';
const NEWS_ENDPOINT = 'https://gex.dev.nerds.cloudns.be/api/noticia';

export async function fetchActionNews(page: number, size: number, signal: AbortSignal): Promise<ActionNewsPage> {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  const response = await fetch(`${NEWS_ENDPOINT}/acao/${ACTION_ID}?${params}`, { signal });

  if (!response.ok) {
    throw new Error(`A API respondeu com erro ${response.status}.`);
  }

  const result = await response.json() as ActionNewsPage;
  if (!Array.isArray(result.content)) {
    throw new Error('A resposta da API não contém uma lista de notícias.');
  }

  return result;
}

export async function fetchActionNewsById(id: string, signal: AbortSignal): Promise<ActionNews> {
  const response = await fetch(`${NEWS_ENDPOINT}/${encodeURIComponent(id)}`, { signal });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('A notícia solicitada não foi encontrada.');
    }
    throw new Error(`A API respondeu com erro ${response.status}.`);
  }

  const result = await response.json() as ActionNews;
  if (!result || result.id !== id) {
    throw new Error('A API não retornou a notícia solicitada.');
  }

  return result;
}