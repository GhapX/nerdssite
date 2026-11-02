import { useMemo, useState } from 'react';
import { HeartHandshake, Users } from 'lucide-react';
import { ALUMNI_MEMBERS } from '../data/alumni';

export default function AlumniSection() {
  const [selectedYear, setSelectedYear] = useState('todos');
  const availableYears = Array.from(new Set(ALUMNI_MEMBERS.flatMap(member =>
    member.period?.split(', ').map(period => period.slice(0, 4)) ?? []
  ))).sort();
  const visibleMembers = useMemo(() => selectedYear === 'todos'
    ? ALUMNI_MEMBERS
    : ALUMNI_MEMBERS.filter(member => member.period?.split(', ').some(period => period.startsWith(selectedYear))),
  [selectedYear]);

  return (
    <section id="ex-integrantes" className="min-h-[65vh] scroll-mt-24 border-t border-white/5 bg-slate-950/35">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <a href="/#integrantes" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition-colors hover:text-cyan-200">← Voltar aos integrantes atuais</a>
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow"><HeartHandshake size={15} /> Nossa história</p>
            <h1 className="font-display mt-4 text-3xl font-bold text-white sm:text-5xl">Ex-integrantes do NERDS.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">Cada pessoa que passou pelo projeto deixou sua contribuição. Esta página reúne quem ajudou a construir a história do NERDS desde 2023.</p>
          </div>
          <p className="inline-flex items-center gap-2 text-sm text-slate-400"><Users size={16} className="text-cyan-300" />{visibleMembers.length} pessoas</p>
        </div>

        {availableYears.length > 0 && (
          <nav aria-label="Filtrar ex-integrantes por ano" className="mt-8 flex flex-wrap gap-2">
            {['todos', ...availableYears].map(year => (
              <button
                key={year}
                type="button"
                aria-pressed={selectedYear === year}
                onClick={() => setSelectedYear(year)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  selectedYear === year
                    ? 'border-cyan-300 bg-cyan-300 text-slate-950'
                    : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-cyan-300 hover:text-cyan-200'
                }`}
              >
                {year === 'todos' ? 'Todos' : year}
              </button>
            ))}
          </nav>
        )}

        {visibleMembers.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
            {visibleMembers.map(member => (
              <article key={member.id} className="soft-card flex min-h-48 flex-col items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/70 p-4 text-center">
                <img src={member.image} alt="" loading="lazy" decoding="async" className="h-16 w-16 rounded-full border border-white/10 object-cover" />
                <h3 className="mt-4 text-sm font-bold leading-5 text-white">{member.name}</h3>
                <p className="mt-1 text-xs text-slate-400">{member.role}</p>
                {member.period && <p className="mt-2 text-xs text-cyan-200">Período: {member.period}</p>}
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-8 rounded-xl border border-dashed border-slate-700 p-8 text-center text-sm text-slate-400">As fotos dos membros anteriores serão adicionadas em breve.</p>
        )}
      </div>
    </section>
  );
}