import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUpRight, FlaskConical, Instagram, Search, Users } from 'lucide-react';
import { MEMBERS, PROJECTS } from './data/portfolio';
import AlumniSection from './components/AlumniSection';
import NewsArticlePage from './components/NewsArticlePage';
import NewsSection from './components/NewsSection';
import ProjectArticlePage from './components/ProjectArticlePage';
import VacancyArticlePage from './components/VacancyArticlePage';
import VacancySection from './components/VacancySection';
import nerdsLogo from './assets/NerdsLogo.png';
import './styles.css';

const navigation = [
  { href: '#projeto', label: 'O projeto' },
  { href: '#noticias', label: 'Notícias' },
  { href: '#vagas', label: 'Vagas' },
  { href: '#portfolio', label: 'Portfólio' },
  { href: '#integrantes', label: 'Integrantes' },
  { href: '#membros-anteriores', label: 'Membros anteriores' }
];

const initials = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase();

export default function App() {
  const [memberSearch, setMemberSearch] = useState('');
  const newsRoute = window.location.pathname.match(/^\/noticias\/([^/]+)\/?$/);
  const vacancyRoute = window.location.pathname.match(/^\/vagas\/([^/]+)\/?$/);
  const projectRoute = window.location.pathname.match(/^\/projetos\/([^/]+)\/?$/);
  const newsId = newsRoute ? decodeURIComponent(newsRoute[1]) : null;
  const vacancyId = vacancyRoute ? decodeURIComponent(vacancyRoute[1]) : null;
  const projectSlug = projectRoute ? decodeURIComponent(projectRoute[1]) : null;
  const isDetailPage = Boolean(newsId || vacancyId || projectSlug);
  const visibleMembers = useMemo(() => {
    const term = memberSearch.trim().toLocaleLowerCase('pt-BR');
    if (!term) return MEMBERS;
    return MEMBERS.filter(member => member.name.toLocaleLowerCase('pt-BR').includes(term));
  }, [memberSearch]);

  return (
    <div className="site-shell min-h-screen text-slate-200">
      <header className="site-nav sticky top-0 z-40 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8">
          <a href={isDetailPage ? '/' : '#inicio'} className="site-brand flex shrink-0 items-center gap-3" aria-label="NERDS — início">
            <img src={nerdsLogo} alt="" className="site-brand__logo h-10 w-10 rounded-xl" />
            <span className="site-brand__name font-display text-lg font-bold text-white">NERDS<span className="ml-1 text-cyan-400">&lt;UFC&gt;</span></span>
          </a>
          <nav aria-label="Navegação principal" className="flex items-center gap-1 overflow-x-auto">
            {navigation.map(item => (
              <a key={item.href} href={isDetailPage ? `/${item.href}` : item.href} className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-cyan-300 sm:px-4">
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main>
        {newsId ? <NewsArticlePage newsId={newsId} /> : vacancyId ? <VacancyArticlePage vacancyId={vacancyId} /> : projectSlug ? <ProjectArticlePage slug={projectSlug} /> : <>
        <section id="inicio" className="home-hero relative isolate overflow-hidden">
          <div className="hero-grid pointer-events-none absolute inset-0" />
          <div className="home-hero__orb home-hero__orb--one" />
          <div className="home-hero__orb home-hero__orb--two" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.15fr_.85fr] lg:px-8">
            <div>
              <p className="eyebrow"><span className="status-dot" /> UFC · CAMPUS RUSSAS</p>
              <h1 className="font-display mt-6 text-5xl font-bold leading-[1.02] tracking-tight text-white sm:text-7xl">
                Tecnologia que <span className="text-cyan-300 text-glow">gera impacto.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
                Somos o Núcleo Especializado em Reengenharia e Desenvolvimento de Software: estudantes e pesquisadores trabalhando em projetos de tecnologia, ensino e extensão.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a href="#portfolio" className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 transition-colors hover:bg-cyan-300">
                  Conheça os projetos <ArrowDown size={17} />
                </a>
                <a href="#integrantes" className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-5 py-3 font-semibold text-white transition-colors hover:border-cyan-400 hover:text-cyan-300">
                  <Users size={17} /> Nossa equipe
                </a>
              </div>
            </div>
            <div className="constellation-card mx-auto w-full max-w-md" aria-label="Pesquisa, extensão e formação conectadas pelo NERDS">
              <div className="constellation-orbit constellation-orbit--outer" />
              <div className="constellation-orbit constellation-orbit--inner" />
              <span className="constellation-node constellation-node--research">Pesquisa</span>
              <span className="constellation-node constellation-node--extension">Extensão</span>
              <span className="constellation-node constellation-node--formation">Formação</span>
              <div className="constellation-core"><img src={nerdsLogo} alt="NERDS UFC" className="constellation-logo" /></div>
              <p className="constellation-caption">Universidade Federal do Ceará · Campus Russas</p>
            </div>
          </div>
        </section>

        <section id="projeto" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <p className="eyebrow"><FlaskConical size={15} /> O projeto</p>
            <h2 className="font-display mt-4 text-3xl font-bold text-white sm:text-5xl">Aprender, pesquisar e construir em conjunto.</h2>
            <p className="mt-6 text-base leading-8 text-slate-300 sm:text-lg">
              O NERDS é um projeto universitário da UFC — Campus Russas. Aplicamos Engenharia de Software e Ciência de Dados em desafios reais, aproximando universidade, setor público e comunidade.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { number: '01', title: 'Pesquisa', text: 'Investigamos métodos e tecnologias para compreender sistemas e resolver problemas.' },
              { number: '02', title: 'Desenvolvimento', text: 'Projetamos e construímos software com atenção às pessoas que vão utilizá-lo.' },
              { number: '03', title: 'Formação', text: 'Aprendemos na prática, colaborando em projetos e compartilhando conhecimento.' }
            ].map(item => (
              <article key={item.number} className="soft-card rounded-2xl border border-slate-700 bg-slate-800/70 p-6">
                <span className="font-display text-sm font-bold text-cyan-300">{item.number}</span>
                <h3 className="mt-4 text-xl font-bold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <NewsSection />
        <VacancySection />

        <section id="portfolio" className="scroll-mt-24 border-y border-white/5 bg-slate-950/35">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow"><FlaskConical size={15} /> Portfólio</p>
                <h2 className="font-display mt-4 text-3xl font-bold text-white sm:text-5xl">Projetos em destaque.</h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-slate-400">Soluções e ideias desenvolvidas pelo núcleo em parceria com a universidade e a comunidade.</p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {PROJECTS.map((project, index) => (
                <article key={project.id} className="project-card soft-card overflow-hidden rounded-3xl border border-slate-700 bg-slate-800/80">
                  <a href={`/projetos/${project.slug}`} className="group block h-full">
                    <div className="relative h-56 overflow-hidden bg-slate-900 sm:h-64">
                      <img src={project.image} alt={project.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <span className="absolute left-5 top-5 rounded-full border border-white/15 bg-slate-950/75 px-3 py-1 text-xs font-bold text-cyan-200 backdrop-blur">
                        Projeto {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="p-6 sm:p-8">
                      <div className="flex flex-wrap gap-2">
                        {project.stack.map(tag => <span key={tag} className="stack-tag">{tag}</span>)}
                      </div>
                      <h3 className="font-display mt-5 text-2xl font-bold text-white">{project.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-300">{project.description}</p>
                      <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-cyan-300 group-hover:text-cyan-200">
                        Conhecer o projeto <ArrowUpRight size={16} />
                      </span>
                    </div>
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="integrantes" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow"><Users size={15} /> Integrantes</p>
              <h2 className="font-display mt-4 text-3xl font-bold text-white sm:text-5xl">As pessoas por trás dos projetos.</h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400">Estudantes e pesquisadores da UFC — Campus Russas, construindo conhecimento e tecnologia em equipe.</p>
            </div>
            <label className="flex w-full items-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 sm:max-w-xs">
              <Search size={18} className="shrink-0 text-slate-500" />
              <span className="sr-only">Buscar integrante pelo nome</span>
              <input value={memberSearch} onChange={event => setMemberSearch(event.target.value)} placeholder="Buscar integrante..." className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500" />
            </label>
          </div>
          {visibleMembers.length > 0 ? (
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
              {visibleMembers.map(member => (
                <article key={member.id} className="soft-card flex min-h-40 flex-col items-center justify-center rounded-2xl border border-slate-700 bg-slate-800/70 p-4 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-400/10 font-display text-lg font-bold text-cyan-200">
                    {member.image ? <img src={member.image} alt="" className="h-full w-full rounded-full object-cover" /> : initials(member.name)}
                  </div>
                  <h3 className="mt-4 text-sm font-bold leading-5 text-white">{member.name}</h3>
                  <p className="mt-1 text-xs text-slate-400">{member.role}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-8 rounded-2xl border border-dashed border-slate-700 p-8 text-center text-sm text-slate-400">Nenhum integrante encontrado com esse nome.</p>
          )}
        </section>
        <AlumniSection />
        </>}
      </main>

      <footer className="border-t border-white/10 bg-slate-950/65">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <img src={nerdsLogo} alt="" className="h-9 w-9 rounded-lg" />
            <div>
              <p className="font-display font-bold text-white">NERDS · UFC Russas</p>
              <p className="text-xs text-slate-500">Núcleo Especializado em Reengenharia e Desenvolvimento de Software</p>
            </div>
          </div>
          <a href="https://www.instagram.com/nerds.ufc/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 self-start rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-cyan-400 hover:text-cyan-300 md:self-auto">
            <Instagram size={17} /> @nerds.ufc <ArrowUpRight size={14} />
          </a>
        </div>
      </footer>
    </div>
  );
}
