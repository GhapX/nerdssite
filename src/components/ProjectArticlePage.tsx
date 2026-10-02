import { ArrowLeft, ArrowUpRight, BookOpen, FlaskConical, Handshake, Target } from 'lucide-react';
import { PROJECTS } from '../data/portfolio';

const projectArticle = {
  introduction: 'O projeto de extensão Núcleo Especializado em Reengenharia e Desenvolvimento de Software (NERDS), realizado no Campus Russas da Universidade Federal do Ceará, investiga e aplica tecnologias inovadoras na área de software. Com Engenharia de Software e Ciência de Dados, busca modernizar sistemas públicos, apoiar decisões baseadas em dados e promover o desenvolvimento tecnológico do Vale do Jaguaribe e do Ceará.',
  partnership: 'Entre suas iniciativas estão a reengenharia de sistemas legados e o desenvolvimento de novos softwares. Em parceria com a Pró-Reitoria de Extensão (PREX), o NERDS desenvolve o sistema GEX, que permitirá acompanhar de forma integrada e em tempo real as ações de extensão da UFC e apoiar coordenadores na gestão de equipes e participantes da comunidade.',
  pillars: [
    {
      title: 'Extensão',
      icon: Handshake,
      text: 'Atende demandas de instituições públicas e do terceiro setor com soluções que aprimoram a eficiência, a transparência e a qualidade dos serviços à comunidade. Também compartilha conhecimento em seminários temáticos, minicursos e palestras.'
    },
    {
      title: 'Ensino',
      icon: BookOpen,
      text: 'Oferece aos estudantes de graduação experiência prática em metodologias ágeis, desenvolvimento em nuvem, Ciência de Dados e Engenharia de Software, aproximando a formação profissional das necessidades reais da sociedade.'
    },
    {
      title: 'Pesquisa',
      icon: FlaskConical,
      text: 'Promove investigação aplicada em tecnologias inovadoras, geração de conhecimento técnico e científico e produção de relatórios e publicações relacionados às soluções desenvolvidas.'
    }
  ],
  methodology: 'A metodologia combina desenvolvimento iterativo e incremental: planejamento, implementação, testes alfa e beta, entrega da versão final do GEX e acompanhamento contínuo de feedbacks. Os estudantes participam de todas as etapas por meio da aprendizagem baseada em projetos. Paralelamente, os Seminários Temáticos do NERDS e outras ações de disseminação compartilham o conhecimento com a comunidade acadêmica e externa.',
  outcomes: [
    'Entrega da versão final do sistema GEX e melhoria da gestão das ações de extensão da UFC.',
    'Ampliação da formação prática e da qualificação profissional dos estudantes.',
    'Maior interação entre a universidade e a comunidade regional.',
    'Produção de conhecimento científico e técnico para fortalecer a extensão universitária e o desenvolvimento social e tecnológico da região.'
  ]
};

export default function ProjectArticlePage({ slug }: { slug: string }) {
  const project = PROJECTS.find(item => item.slug === slug);

  if (!project) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <a href="/#portfolio" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200"><ArrowLeft size={16} /> Voltar ao portfólio</a>
        <p className="mt-8 text-slate-400">Projeto não encontrado.</p>
      </section>
    );
  }

  return (
    <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <a href="/#portfolio" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition-colors hover:text-cyan-200"><ArrowLeft size={16} /> Voltar ao portfólio</a>

      <header className="mt-8 max-w-4xl">
        <p className="eyebrow"><span className="status-dot" /> UFC · CAMPUS RUSSAS · PROJETO DE EXTENSÃO</p>
        <h1 className="font-display mt-5 text-3xl font-bold leading-tight text-white sm:text-5xl">{project.title}</h1>
        <p className="mt-6 text-lg leading-8 text-slate-300">{projectArticle.introduction}</p>
        {project.url && (
          <a href={project.url} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition-colors hover:bg-cyan-300">
            Acessar o Sistema GEX <ArrowUpRight size={16} />
          </a>
        )}
      </header>

      <figure className="mt-10 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
        <img src={project.image} alt="Sistema GEX, plataforma de gestão das ações de extensão da UFC" className="aspect-video w-full object-cover" />
        <figcaption className="border-t border-white/10 px-5 py-3 text-xs text-slate-400">Sistema de gestão das ações de extensão da Universidade Federal do Ceará.</figcaption>
      </figure>

      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-16">
        <div className="min-w-0">
          <section>
            <h2 className="font-display text-2xl font-bold text-white">Uma parceria para fortalecer a extensão</h2>
            <p className="mt-4 text-base leading-8 text-slate-300">{projectArticle.partnership}</p>
          </section>

          <section className="mt-12 border-t border-white/10 pt-9">
            <h2 className="font-display text-2xl font-bold text-white">Extensão, ensino e pesquisa</h2>
            <div className="mt-7 space-y-7">
              {projectArticle.pillars.map(pillar => {
                const PillarIcon = pillar.icon;
                return (
                  <section key={pillar.title} className="border-l-2 border-cyan-300/40 pl-5">
                    <h3 className="inline-flex items-center gap-2 text-lg font-bold text-white"><PillarIcon size={18} className="text-cyan-300" />{pillar.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-300">{pillar.text}</p>
                  </section>
                );
              })}
            </div>
          </section>

          <section className="mt-12 border-t border-white/10 pt-9">
            <h2 className="font-display inline-flex items-center gap-3 text-2xl font-bold text-white"><Target size={21} className="text-cyan-300" />Metodologia</h2>
            <p className="mt-4 text-base leading-8 text-slate-300">{projectArticle.methodology}</p>
          </section>

          <section className="mt-12 border-t border-white/10 pt-9">
            <h2 className="font-display text-2xl font-bold text-white">Resultados esperados</h2>
            <ul className="mt-5 space-y-3">
              {projectArticle.outcomes.map(outcome => (
                <li key={outcome} className="flex gap-3 text-sm leading-7 text-slate-300"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-lime-300" />{outcome}</li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="h-fit border-t border-white/10 pt-5 lg:sticky lg:top-28 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <p className="eyebrow">NERDS · UFC</p>
          <p className="mt-3 text-sm leading-6 text-slate-400">Núcleo Especializado em Reengenharia e Desenvolvimento de Software, no Campus Russas da Universidade Federal do Ceará.</p>
          {project.url && <a href={project.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-cyan-300 hover:text-cyan-200">gex.ufc.br <ArrowUpRight size={15} /></a>}
        </aside>
      </div>
    </article>
  );
}