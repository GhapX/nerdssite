import { useEffect, useRef, useState } from 'react';
import { AlertCircle, ArrowUpRight, CalendarDays, ChevronLeft, ChevronRight, Newspaper, X } from 'lucide-react';
import { fetchActionNews } from '../services/news';
import type { ActionNews, ActionNewsPage } from '../services/news';

const PAGE_SIZE = 6;

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Data não informada'
    : new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
};

const plainTextFromHtml = (html: string) => {
  const body = new DOMParser().parseFromString(html, 'text/html').body;
  body.querySelectorAll('br').forEach(element => element.replaceWith('\n'));
  body.querySelectorAll('li').forEach(element => element.prepend('• '));
  body.querySelectorAll('p, li, h1, h2, h3, blockquote').forEach(element => element.append('\n'));

  return (body.textContent ?? '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

const excerptFromHtml = (html: string) => plainTextFromHtml(html).replace(/\s+/g, ' ').trim();

function NewsDetail({ news, onClose }: { news: ActionNews; onClose: () => void }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const content = plainTextFromHtml(news.texto);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 p-4 backdrop-blur-sm sm:p-8" role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="news-dialog-title"
        tabIndex={-1}
        onClick={event => event.stopPropagation()}
        onKeyDown={event => { if (event.key === 'Escape') onClose(); }}
        className="relative mx-auto my-4 w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl sm:my-8"
      >
        <div className="relative aspect-[16/9] overflow-hidden bg-slate-800">
          {news.imagemUrl ? (
            <img src={news.imagemUrl} alt={news.descricaoImagem || news.titulo} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-cyan-300/70"><Newspaper size={44} strokeWidth={1.4} /></div>
          )}
          <button ref={closeButtonRef} type="button" onClick={onClose} aria-label="Fechar notícia" className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-slate-950/80 text-white backdrop-blur transition-colors hover:bg-slate-800">
            <X size={19} />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-400">
            <span className="inline-flex items-center gap-2"><CalendarDays size={15} />{formatDate(news.dataPublicacao)}</span>
            {news.autorPublicacaoNome && <span>{news.autorPublicacaoNome}</span>}
            {news.acaoSigla && <span className="rounded-md border border-cyan-300/20 bg-cyan-300/10 px-2 py-1 text-xs font-bold text-cyan-200">{news.acaoSigla}</span>}
          </div>
          <h2 id="news-dialog-title" className="font-display mt-4 text-2xl font-bold leading-tight text-white sm:text-3xl">{news.titulo}</h2>
          {content && <p className="mt-6 whitespace-pre-line text-base leading-7 text-slate-300">{content}</p>}
          {news.palavrasChaves?.length ? (
            <div className="mt-7 flex flex-wrap gap-2 border-t border-white/10 pt-5">
              {news.palavrasChaves.map(keyword => <span key={keyword} className="stack-tag">{keyword}</span>)}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function NewsSection() {
  const [page, setPage] = useState<ActionNewsPage | null>(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [retryKey, setRetryKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedNews, setSelectedNews] = useState<ActionNews | null>(null);

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
                  <article
                    key={news.id}
                    role="button"
                    tabIndex={0}
                    aria-haspopup="dialog"
                    aria-label={`Ler notícia: ${news.titulo}`}
                    onClick={() => setSelectedNews(news)}
                    onKeyDown={event => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setSelectedNews(news);
                      }
                    }}
                    className="soft-card flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/80 text-left outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
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
                  </article>
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
      {selectedNews && <NewsDetail news={selectedNews} onClose={() => setSelectedNews(null)} />}
    </section>
  );
}