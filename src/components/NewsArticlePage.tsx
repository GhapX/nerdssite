import { useEffect, useState } from 'react';
import { AlertCircle, ArrowLeft, CalendarDays, Newspaper } from 'lucide-react';
import { fetchActionNewsById } from '../services/news';
import type { ActionNews } from '../services/news';

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Data não informada'
    : new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(date);
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

export default function NewsArticlePage({ newsId }: { newsId: string }) {
  const [news, setNews] = useState<ActionNews | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');

    fetchActionNewsById(newsId, controller.signal)
      .then(setNews)
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setError(requestError instanceof Error ? requestError.message : 'Não foi possível carregar esta notícia.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [newsId]);

  if (loading) {
    return <p className="mx-auto max-w-4xl px-4 py-20 text-sm text-slate-400" role="status">Carregando notícia...</p>;
  }

  if (error || !news) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8" role="alert">
        <a href="/#noticias" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200"><ArrowLeft size={16} /> Voltar às notícias</a>
        <p className="mt-8 flex items-center gap-3 rounded-xl border border-rose-400/25 bg-rose-400/5 p-5 text-sm text-rose-200"><AlertCircle size={18} />{error || 'A notícia solicitada não foi encontrada.'}</p>
      </section>
    );
  }

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <a href="/#noticias" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition-colors hover:text-cyan-200"><ArrowLeft size={16} /> Voltar às notícias</a>

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/80">
        <div className="relative aspect-[16/9] overflow-hidden bg-slate-800">
          {news.imagemUrl ? (
            <img src={news.imagemUrl} alt={news.descricaoImagem || news.titulo} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-cyan-300/70"><Newspaper size={44} strokeWidth={1.4} /></div>
          )}
        </div>

        <div className="p-6 sm:p-10">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400">
            <span className="inline-flex items-center gap-2"><CalendarDays size={15} />{formatDate(news.dataPublicacao)}</span>
            {news.autorPublicacaoNome && <span>{news.autorPublicacaoNome}</span>}
            {news.acaoSigla && <span className="rounded-md border border-cyan-300/20 bg-cyan-300/10 px-2 py-1 text-xs font-bold text-cyan-200">{news.acaoSigla}</span>}
          </div>
          <h1 className="font-display mt-5 text-3xl font-bold leading-tight text-white sm:text-4xl">{news.titulo}</h1>
          {news.fonte && <p className="mt-3 text-sm text-slate-400">Fonte: {news.fonte}</p>}
          <div className="news-article__content mt-8 whitespace-pre-line border-t border-white/10 pt-7 text-base leading-8 text-slate-300">
            {plainTextFromHtml(news.texto)}
          </div>

          {news.palavrasChaves?.length ? (
            <div className="mt-8 flex flex-wrap gap-2 border-t border-white/10 pt-6">
              {news.palavrasChaves.map(keyword => <span key={keyword} className="stack-tag">{keyword}</span>)}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}