import { HeartHandshake, Users } from 'lucide-react';
import { ALUMNI_MEMBERS } from '../data/alumni';

export default function AlumniSection() {
  return (
    <section id="membros-anteriores" className="scroll-mt-24 border-t border-white/5 bg-slate-950/35">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow"><HeartHandshake size={15} /> Nossa história</p>
            <h2 className="font-display mt-4 text-3xl font-bold text-white sm:text-5xl">Quem ajudou a construir o NERDS.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">Cada pessoa que passou pelo projeto deixou sua contribuição. Este espaço guarda com carinho a memória de quem dedicou tempo, ideias e trabalho ao NERDS.</p>
          </div>
          <p className="inline-flex items-center gap-2 text-sm text-slate-400"><Users size={16} className="text-cyan-300" />{ALUMNI_MEMBERS.length} pessoas</p>
        </div>

        {ALUMNI_MEMBERS.length > 0 ? (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
            {ALUMNI_MEMBERS.map(member => (
              <article key={member.id} className="soft-card flex min-h-48 flex-col items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/70 p-4 text-center">
                <img src={member.image} alt="" loading="lazy" className="h-16 w-16 rounded-full border border-white/10 object-cover" />
                <h3 className="mt-4 text-sm font-bold leading-5 text-white">{member.name}</h3>
                <p className="mt-1 text-xs text-slate-400">{member.role}</p>
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