import { useEffect, useState } from 'react';
import { AlertCircle, ArrowUpRight, CalendarDays, ChevronLeft, ChevronRight, Newspaper } from 'lucide-react';
import { fetchActionNews } from '../services/news';
import type { ActionNewsPage } from '../services/news';

const PAGE_SIZE = 6;

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Data não informada'
    : new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
};

const excerptFromHtml = (html: string) => {
  const text = new DOMParser().parseFromString(html, 'text/html').body.textContent ?? '';
  return text.replace(/\s+/g, ' ').trim();
};

export default function NewsSection() {
  const [page, setPage] = useState<ActionNewsPage | null>(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [retryKey, setRetryKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');

    fetchActionNews(pageNumber, PAGE_SIZE, controller.signal)
      .then(setPage)
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setError(requestError instanceof Error ? requestError.message : 'Não foi possível carregar as notícias.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [pageNumber, retryKey]);

  return (
    <section id="noticias" className="scroll-mt-24 border-y border-white/5 bg-slate-950/35">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow"><Newspaper size={15} /> Notícias</p>
            <h2 className="font-display mt-4 text-3xl font-bold text-white sm:text-5xl">Novidades da ação.</h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400">Acompanhe as notícias, atividades e atualizações publicadas pelo NERDS.</p>
          </div>
          {page && !loading && <p className="text-sm text-slate-400">{page.totalElements.toLocaleString('pt-BR')} notícias</p>}
        </div>

        {loading ? (
          <p className="mt-10 rounded-xl border border-slate-800 bg-slate-900/70 p-6 text-sm text-slate-400" role="status">Carregando notícias...</p>
        ) : error ? (
          <div className="mt-10 flex flex-col gap-4 rounded-xl border border-rose-400/25 bg-rose-400/5 p-6 sm:flex-row sm:items-center sm:justify-between" role="alert">
            <p className="flex items-center gap-3 text-sm text-rose-200"><AlertCircle size={18} />{error}</p>
            <button type="button" onClick={() => setRetryKey(value => value + 1)} className="inline-flex items-center gap-2 self-start rounded-lg border border-rose-300/30 px-4 py-2 text-sm font-semibold text-rose-100 transition-colors hover:bg-rose-300/10 sm:self-auto">
              Tentar novamente
            </button>
          </div>
        ) : page?.empty ? (
          <p className="mt-10 rounded-xl border border-dashed border-slate-700 p-8 text-center text-sm text-slate-400">Ainda não há notícias publicadas para esta ação.</p>
        ) : (
          <>
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {page?.content.map(news => {
                const excerpt = excerptFromHtml(news.texto);

                return (
                  <a
                    key={news.id}
                    aria-label={`Ler notícia: ${news.titulo}`}
                    href={`/noticias/${encodeURIComponent(news.id)}`}
                    className="soft-card flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/80 text-left outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-slate-800">
                      {news.imagemUrl ? (
                        <img src={news.imagemUrl} alt={news.descricaoImagem || news.titulo} loading="lazy" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-cyan-300/70"><Newspaper size={36} strokeWidth={1.4} /></div>
                      )}
                      {news.acaoSigla && <span className="absolute left-4 top-4 rounded-md border border-white/15 bg-slate-950/80 px-2.5 py-1 text-xs font-bold text-cyan-200 backdrop-blur">{news.acaoSigla}</span>}
                    </div>

                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} />{formatDate(news.dataPublicacao)}</span>
                        {news.autorPublicacaoNome && <span>{news.autorPublicacaoNome}</span>}
                      </div>
                      <h3 className="mt-4 text-xl font-bold leading-7 text-white">{news.titulo}</h3>
                      {excerpt && <p className="news-card__excerpt mt-3 text-sm leading-6 text-slate-300">{excerpt}</p>}

                      {news.palavrasChaves?.length ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {news.palavrasChaves.map(keyword => <span key={keyword} className="stack-tag">{keyword}</span>)}
                        </div>
                      ) : null}

                      <span className="mt-auto inline-flex items-center gap-2 border-t border-white/10 pt-4 text-sm font-bold text-cyan-300">
                        Ler notícia <ArrowUpRight size={16} />
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>

            {page && page.totalPages > 1 && (
              <nav aria-label="Paginação das notícias" className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-400">Página {page.number + 1} de {page.totalPages}</p>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setPageNumber(value => Math.max(0, value - 1))} disabled={page.first} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:border-cyan-300 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-40">
                    <ChevronLeft size={16} /> Anterior
                  </button>
                  <button type="button" onClick={() => setPageNumber(value => value + 1)} disabled={page.last} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:border-cyan-300 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-40">
                    Próxima <ChevronRight size={16} />
                  </button>
                </div>
              </nav>
            )}
          </>
        )}
      </div>
    </section>
  );
}