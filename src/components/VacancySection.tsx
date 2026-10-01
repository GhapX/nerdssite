import { useEffect, useState } from 'react';
import { AlertCircle, ArrowUpRight, BriefcaseBusiness, CalendarDays, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { fetchActionVacancies, publicVacancyUrl } from '../services/vacancies';
import type { ActionVacancyPage } from '../services/vacancies';

const PAGE_SIZE = 6;

const formatDate = (value: string | null) => {
  if (!value) return 'Data não informada';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Data não informada'
    : new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
};

const excerptFromHtml = (html: string | null) => {
  if (!html) return '';
  const text = new DOMParser().parseFromString(html, 'text/html').body.textContent ?? '';
  return text.replace(/\s+/g, ' ').trim();
};

export default function VacancySection() {
  const [page, setPage] = useState<ActionVacancyPage | null>(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [retryKey, setRetryKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');

    fetchActionVacancies(pageNumber, PAGE_SIZE, controller.signal)
      .then(setPage)
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setError(requestError instanceof Error ? requestError.message : 'Não foi possível carregar as vagas.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [pageNumber, retryKey]);

  return (
    <section id="vagas" className="scroll-mt-24 border-y border-white/5">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow"><BriefcaseBusiness size={15} /> Oportunidades</p>
            <h2 className="font-display mt-4 text-3xl font-bold text-white sm:text-5xl">Vagas da ação.</h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400">Bolsas, estágios e outras oportunidades vinculadas ao NERDS.</p>
          </div>
          {page && !loading && <p className="text-sm text-slate-400">{page.totalElements.toLocaleString('pt-BR')} vagas</p>}
        </div>

        {loading ? (
          <p className="mt-10 rounded-xl border border-slate-800 bg-slate-900/70 p-6 text-sm text-slate-400" role="status">Carregando vagas...</p>
        ) : error ? (
          <div className="mt-10 flex flex-col gap-4 rounded-xl border border-rose-400/25 bg-rose-400/5 p-6 sm:flex-row sm:items-center sm:justify-between" role="alert">
            <p className="flex items-center gap-3 text-sm text-rose-200"><AlertCircle size={18} />{error}</p>
            <button type="button" onClick={() => setRetryKey(value => value + 1)} className="inline-flex items-center gap-2 self-start rounded-lg border border-rose-300/30 px-4 py-2 text-sm font-semibold text-rose-100 transition-colors hover:bg-rose-300/10 sm:self-auto">
              Tentar novamente
            </button>
          </div>
        ) : page?.empty ? (
          <p className="mt-10 rounded-xl border border-dashed border-slate-700 p-8 text-center text-sm text-slate-400">Nenhuma vaga publicada para esta ação.</p>
        ) : (
          <>
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {page?.content.map(vacancy => {
                const summary = excerptFromHtml(vacancy.textoInformativo);
                const editalUrl = publicVacancyUrl(vacancy.linkEdital);
                const applicationUrl = publicVacancyUrl(vacancy.linkInscricao);
                const sharedActionUrl = editalUrl && editalUrl === applicationUrl ? editalUrl : null;
                const isClosed = vacancy.status?.toLocaleUpperCase('pt-BR').includes('ENCERR');
                const image = vacancy.imagemUrl || vacancy.acaoImagemUrl;

                return (
                  <article key={vacancy.id} className="soft-card flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/80">
                    <a href={`/vagas/${encodeURIComponent(vacancy.id)}`} aria-label={`Ver detalhes da vaga: ${vacancy.titulo}`} className="flex flex-1 flex-col text-left outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-inset">
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-800">
                        {image ? (
                          <img src={image} alt={vacancy.descricaoImagem || vacancy.titulo} loading="lazy" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-cyan-300/70"><BriefcaseBusiness size={36} strokeWidth={1.4} /></div>
                        )}
                        {vacancy.status && <span className={`absolute left-4 top-4 rounded-md border px-2.5 py-1 text-xs font-bold backdrop-blur ${isClosed ? 'border-slate-400/20 bg-slate-950/80 text-slate-300' : 'border-lime-300/20 bg-slate-950/80 text-lime-200'}`}>{vacancy.status}</span>}
                      </div>

                      <div className="flex w-full flex-1 flex-col p-5 sm:p-6">
                        <h3 className="text-xl font-bold leading-7 text-white">{vacancy.titulo}</h3>
                        <div className="mt-3 flex flex-col gap-2 text-xs text-slate-400">
                          <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} />{formatDate(vacancy.dataInicioInscricao)} até {formatDate(vacancy.dataFimInscricao)}</span>
                          {vacancy.localVaga && <span className="inline-flex items-center gap-1.5"><MapPin size={14} />{vacancy.localVaga}</span>}
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {vacancy.isBolsistaRemunerado && <span className="stack-tag">Bolsa remunerada</span>}
                          {vacancy.isEstagiario && <span className="stack-tag">Estágio</span>}
                          {vacancy.tags?.map(tag => <span key={tag} className="stack-tag">{tag}</span>)}
                        </div>

                        {summary && <p className="vacancy-card__excerpt mt-4 text-sm leading-6 text-slate-300">{summary}</p>}
                        <span className="mt-auto inline-flex items-center gap-2 border-t border-white/10 pt-4 text-sm font-bold text-cyan-300">Ver detalhes <ArrowUpRight size={15} /></span>
                      </div>
                    </a>

                    {(sharedActionUrl || editalUrl || applicationUrl) && (
                      <div className="flex flex-wrap gap-3 border-t border-white/10 px-5 pb-5 sm:px-6 sm:pb-6">
                        {sharedActionUrl ? (
                          <a href={sharedActionUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-cyan-300 hover:text-cyan-200">Acessar oportunidade <ArrowUpRight size={15} /></a>
                        ) : (
                          <>
                            {editalUrl && <a href={editalUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-cyan-300 hover:text-cyan-200">Ver edital <ArrowUpRight size={15} /></a>}
                            {applicationUrl && <a href={applicationUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-cyan-300 hover:text-cyan-200">Inscrever-se <ArrowUpRight size={15} /></a>}
                          </>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

            {page && page.totalPages > 1 && (
              <nav aria-label="Paginação das vagas" className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
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