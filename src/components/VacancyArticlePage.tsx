import { useEffect, useState } from 'react';
import { AlertCircle, ArrowLeft, ArrowUpRight, BriefcaseBusiness, CalendarDays, MapPin } from 'lucide-react';
import { fetchActionVacancyById, publicVacancyUrl } from '../services/vacancies';
import type { ActionVacancy } from '../services/vacancies';

const formatDate = (value: string | null) => {
  if (!value) return 'Data não informada';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Data não informada'
    : new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(date);
};

const plainTextFromHtml = (html: string | null) => {
  if (!html) return '';
  const body = new DOMParser().parseFromString(html, 'text/html').body;
  body.querySelectorAll('br').forEach(element => element.replaceWith('\n'));
  body.querySelectorAll('li').forEach(element => element.prepend('• '));
  body.querySelectorAll('p, li, h1, h2, h3, blockquote').forEach(element => element.append('\n'));

  return (body.textContent ?? '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

export default function VacancyArticlePage({ vacancyId }: { vacancyId: string }) {
  const [vacancy, setVacancy] = useState<ActionVacancy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');

    fetchActionVacancyById(vacancyId, controller.signal)
      .then(setVacancy)
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setError(requestError instanceof Error ? requestError.message : 'Não foi possível carregar esta vaga.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [vacancyId]);

  if (loading) {
    return <p className="mx-auto max-w-4xl px-4 py-20 text-sm text-slate-400" role="status">Carregando vaga...</p>;
  }

  if (error || !vacancy) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8" role="alert">
        <a href="/#vagas" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200"><ArrowLeft size={16} /> Voltar às vagas</a>
        <p className="mt-8 flex items-center gap-3 rounded-xl border border-rose-400/25 bg-rose-400/5 p-5 text-sm text-rose-200"><AlertCircle size={18} />{error || 'A vaga solicitada não foi encontrada.'}</p>
      </section>
    );
  }

  const editalUrl = publicVacancyUrl(vacancy.linkEdital);
  const applicationUrl = publicVacancyUrl(vacancy.linkInscricao);
  const sharedActionUrl = editalUrl && editalUrl === applicationUrl ? editalUrl : null;
  const isClosed = vacancy.status?.toLocaleUpperCase('pt-BR').includes('ENCERR');
  const image = vacancy.imagemUrl || vacancy.acaoImagemUrl;
  const information = plainTextFromHtml(vacancy.textoInformativo);
  const actionDescription = plainTextFromHtml(vacancy.textoDescricaoAcao ?? null);

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <a href="/#vagas" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition-colors hover:text-cyan-200"><ArrowLeft size={16} /> Voltar às vagas</a>

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/80">
        <div className="relative aspect-[16/9] overflow-hidden bg-slate-800">
          {image ? (
            <img src={image} alt={vacancy.descricaoImagem || vacancy.titulo} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-cyan-300/70"><BriefcaseBusiness size={44} strokeWidth={1.4} /></div>
          )}
          {vacancy.status && <span className={`absolute left-4 top-4 rounded-md border px-2.5 py-1 text-xs font-bold backdrop-blur ${isClosed ? 'border-slate-400/20 bg-slate-950/80 text-slate-300' : 'border-lime-300/20 bg-slate-950/80 text-lime-200'}`}>{vacancy.status}</span>}
        </div>

        <div className="p-6 sm:p-10">
          <h1 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl">{vacancy.titulo}</h1>
          <div className="mt-5 flex flex-col gap-2 text-sm text-slate-400">
            <span className="inline-flex items-center gap-2"><CalendarDays size={15} />Inscrições: {formatDate(vacancy.dataInicioInscricao)} até {formatDate(vacancy.dataFimInscricao)}</span>
            {vacancy.localVaga && <span className="inline-flex items-center gap-2"><MapPin size={15} />{vacancy.localVaga}</span>}
            {vacancy.autorNome && <span>{vacancy.autorNome}</span>}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {vacancy.isBolsistaRemunerado && <span className="stack-tag">Bolsa remunerada</span>}
            {vacancy.isEstagiario && <span className="stack-tag">Estágio</span>}
            {vacancy.tags?.map(tag => <span key={tag} className="stack-tag">{tag}</span>)}
          </div>

          {information && <p className="mt-8 whitespace-pre-line border-t border-white/10 pt-7 text-base leading-8 text-slate-300">{information}</p>}
          {actionDescription && <p className="mt-7 whitespace-pre-line border-t border-white/10 pt-6 text-sm leading-7 text-slate-400">{actionDescription}</p>}

          {(sharedActionUrl || editalUrl || applicationUrl) && (
            <div className="mt-8 flex flex-wrap gap-4 border-t border-white/10 pt-6">
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
        </div>
      </div>
    </article>
  );
}