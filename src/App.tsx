import React, { useEffect, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, BookOpenCheck, Briefcase, Calendar, CheckCircle2, Clock3, Zap, Brain, Bot, ExternalLink, FileCheck2, FlaskConical, Handshake, Home, Layers3, Lightbulb, Menu, MessageSquare, Search, Send, ChevronRight, X, User, Instagram, Database, Code, GraduationCap, MapPin, Newspaper, Network, Rocket, Sparkles, Target, Terminal, Workflow } from 'lucide-react';
import { ArrowDownRight, ArrowUpRight, Bell, BookOpenCheck, Briefcase, Calendar, CheckCircle2, Clock3, Zap, Brain, Bot, ExternalLink, FileCheck2, FlaskConical, Handshake, Home, Layers3, Lightbulb, Menu, MessageSquare, Search, Send, ChevronRight, X, User, Instagram, Database, Code, GraduationCap, MapPin, Newspaper, Network, Rocket, Sparkles, Target, Terminal, Workflow } from 'lucide-react';
import { MOCK_ARTICLES, MOCK_COURSES, MOCK_EDICTS, MOCK_EVENTS, MOCK_MEMBERS, MOCK_PROTOTYPES } from './data/mockData';
import { requestGemini } from './services/gemini';
import type { GeminiMessage, Prototype } from './types';
import { authApi, contentApi, proposalApi, type AuthUser } from './services/api';
import AdminPanel from './components/AdminPanel';
import nerdsLogo from './assets/ners-logo.svg';
import './styles.css';

const PageIntro = ({ eyebrow, title, description, icon: Icon }: { eyebrow: string; title: string; description: string; icon: typeof Newspaper }) => (
  <header className="section-intro">
    <div className="section-intro__glow" />
    <div className="relative z-10 max-w-3xl">
      <p className="eyebrow"><Icon size={15} /> {eyebrow}</p>
      <h1 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight mt-4">{title}</h1>
      <p className="mt-5 text-base sm:text-lg leading-relaxed text-slate-300">{description}</p>
    </div>
  </header>
);

const DetailView = ({ eyebrow, title, image, metadata, content, onBack, action }: { eyebrow: string; title: string; image?: string; metadata: string; content: string; onBack: () => void; action?: { label: string; href: string } }) => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-in fade-in">
    <button type="button" onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300"><ChevronRight size={17} className="rotate-180" /> Voltar para a lista</button>
    <article className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-800/80 shadow-2xl">
      {image && <img loading="lazy" src={image} alt="" className="h-56 w-full object-cover sm:h-72" />}
      <div className="p-6 sm:p-10">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="font-display mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">{title}</h1>
        <p className="mt-4 border-b border-slate-700 pb-6 text-sm text-slate-400">{metadata}</p>
        <div className="prose-nerds mt-8 whitespace-pre-wrap text-base leading-8 text-slate-300">{content || 'Este conteúdo será publicado em breve.'}</div>
        {action && action.href !== '#' && <a href={action.href} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-bold text-slate-950 transition-colors hover:bg-cyan-400">{action.label} <ArrowUpRight size={17} /></a>}
      </div>
    </article>
  </div>
);

const LegacyHomeView = () => {
  const [aiGoal, setAiGoal] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAiGoal = async () => {
    if (!aiGoal.trim()) return;
    setIsAiLoading(true);
    setAiResponse("Conectando aos servidores do NERDS...");
    try {
      const response = await requestGemini([{
        role: 'user',
        text: `Atue como um professor/mentor do projeto universitário NERDS da UFC. Responda a este aluno: "${aiGoal}". Seja entusiasmado, breve (máximo 2 linhas) e diga como o núcleo pode ajudá-lo através de Engenharia de Software, Ciência de Dados ou Extensão Universitária.`
      }]);
      setAiResponse(response);
    } catch (error) {
      setAiResponse(error instanceof Error ? error.message : "Não foi possível obter uma resposta da IA.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in space-y-16 pb-16">
      <div className="relative overflow-hidden bg-slate-900 border-b border-slate-800">
        <div className="hero-grid absolute inset-0 pointer-events-none" />
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-cyan-400 text-xs sm:text-sm font-bold uppercase tracking-[.28em] mb-5 animate-in">NERDS · UFC RUSSAS</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white tracking-tight mb-6">
              Núcleo Especializado em <span className="text-cyan-400">Reengenharia e Desenvolvimento</span> de Software
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 leading-relaxed">
              Projeto de extensão e pesquisa da UFC - Campus Russas. Investigamos e aplicamos tecnologias inovadoras em Engenharia de Software e Ciência de Dados para modernizar sistemas públicos e promover o desenvolvimento tecnológico do Vale do Jaguaribe e do Ceará.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                type="button"
                onClick={() => document.getElementById('acoes-nerds')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-full transition-colors flex items-center justify-center gap-2"
              >
                Conheça Nossas Ações <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20 mb-16">
        <div className="glass rounded-2xl p-6 md:p-8 border border-cyan-500/30 shadow-2xl shadow-cyan-900/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <Brain className="text-cyan-400 w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Descubra sua Trilha no NERDS</h3>
              <p className="text-sm text-slate-400">O que você quer construir ou pesquisar hoje?</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
               type="text"
               value={aiGoal}
               onChange={(e) => setAiGoal(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleAiGoal()}
               placeholder="Ex: Quero criar um app de impacto social para minha cidade..."
               className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={handleAiGoal}
              disabled={isAiLoading}
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-lg transition-colors flex items-center gap-2 justify-center disabled:opacity-70"
            >
              <Zap size={18} /> {isAiLoading ? 'Pensando...' : 'Descobrir'}
            </button>
          </div>
          {aiResponse && (
            <div className="mt-6 p-4 bg-slate-900/80 rounded-xl border-l-4 border-cyan-500 text-cyan-50/90 text-sm md:text-base leading-relaxed animate-in slide-in-from-top-2">
              {aiResponse}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {}
        <section id="acoes-nerds">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">O que o NERDS faz?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Integramos extensão, ensino e pesquisa para promover impacto social e acadêmico através da tecnologia.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="soft-card bg-slate-800 rounded-xl p-8 border border-slate-700 hover:border-cyan-500/50 transition-all">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-6">
                <Code className="text-cyan-400 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Pesquisa e Desenvolvimento</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Investiga tecnologias inovadoras em software e engenharia de sistemas, promovendo investigação aplicada e geração de conhecimento técnico e científico.</p>
            </div>
            <div className="soft-card bg-slate-800 rounded-xl p-8 border border-slate-700 hover:border-cyan-500/50 transition-all">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-6">
                <Database className="text-cyan-400 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Modernização de Sistemas</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Aplica ciência de dados e engenharia de software para reengenharia de sistemas legados, modernizando sistemas públicos de informação e auxiliando na tomada de decisões.</p>
            </div>
            <div className="soft-card bg-slate-800 rounded-xl p-8 border border-slate-700 hover:border-cyan-500/50 transition-all">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-6">
                <GraduationCap className="text-cyan-400 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Formação Prática</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Insere estudantes de Engenharia de Software e Ciência da Computação em desafios reais de mercado (metodologias ágeis, nuvem), fortalecendo a formação profissional.</p>
            </div>
          </div>
        </section>

        {}
        <section className="bg-slate-800/50 rounded-3xl border border-slate-700 overflow-hidden flex flex-col lg:flex-row">
          <div className="p-8 lg:p-12 lg:w-1/2 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs font-bold uppercase tracking-wide mb-6 w-max">
              <Target size={14} /> Case de Sucesso
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Sistema GEX & Parceria PREX</h2>
            <p className="text-slate-300 mb-6 leading-relaxed">
              O principal destaque do NERDS é o desenvolvimento do <strong>sistema GEX</strong> para a Pró-Reitoria de Extensão (PREX) da UFC. A plataforma permite acompanhar de forma integrada e em tempo real as ações de extensão da universidade, auxiliando coordenadores na gestão de equipes.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <div className="mt-1 bg-cyan-500/20 p-1 rounded-full"><ChevronRight size={12} className="text-cyan-400"/></div>
                Desenvolvimento iterativo e incremental (fases Alfa e Beta).
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <div className="mt-1 bg-cyan-500/20 p-1 rounded-full"><ChevronRight size={12} className="text-cyan-400"/></div>
                Impacto direto na eficiência e transparência da UFC.
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <div className="mt-1 bg-cyan-500/20 p-1 rounded-full"><ChevronRight size={12} className="text-cyan-400"/></div>
                Aprendizagem baseada em projetos reais para os alunos.
              </li>
            </ul>
          </div>
          <div className="lg:w-1/2 bg-slate-900 p-8 flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-900/0 to-slate-900/0"></div>
             <div className="relative w-full max-w-md glass rounded-2xl border border-slate-700 shadow-2xl p-6">
               <div className="flex justify-between items-center mb-6">
                 <div className="text-white font-bold text-lg">GEX Dashboard</div>
                 <div className="text-cyan-400 text-sm font-medium">Reengenharia em Ação</div>
               </div>
               <div className="space-y-4">
                 <div className="h-2 bg-slate-700 rounded-full w-3/4"></div>
                 <div className="h-2 bg-slate-700 rounded-full w-1/2"></div>
                 <div className="grid grid-cols-2 gap-4 mt-6">
                   <div className="h-24 bg-slate-700/50 rounded-lg border border-slate-600"></div>
                   <div className="h-24 bg-slate-700/50 rounded-lg border border-slate-600"></div>
                 </div>
               </div>
             </div>
          </div>
        </section>

        {}
        <section className="bg-slate-800/30 border border-slate-700 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <h2 className="text-3xl font-bold text-white mb-10 relative z-10">O NERDS em Números</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
            <div className="flex flex-col items-center">
              <div className="text-4xl sm:text-5xl font-extrabold text-cyan-400 mb-2">37</div>
              <div className="text-slate-300 font-medium uppercase tracking-wider text-sm">Membros Ativos</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl sm:text-5xl font-extrabold text-cyan-400 mb-2">+10</div>
              <div className="text-slate-300 font-medium uppercase tracking-wider text-sm">Projetos</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl sm:text-5xl font-extrabold text-cyan-400 mb-2">3</div>
              <div className="text-slate-300 font-medium uppercase tracking-wider text-sm">Pilares</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl sm:text-5xl font-extrabold text-cyan-400 mb-2">100%</div>
              <div className="text-slate-300 font-medium uppercase tracking-wider text-sm">Impacto Social</div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

const HomeView = () => {
  const [aiGoal, setAiGoal] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeLens, setActiveLens] = useState<'pesquisa' | 'extensao' | 'formacao'>('pesquisa');
  const handleAiGoal = async () => {
    if (!aiGoal.trim()) return;
    setIsAiLoading(true);
    setAiResponse('Conectando ao laboratório NERDS...');
    try {
      const response = await requestGemini([{
        role: 'user',
        text: `Atue como mentor do NERDS da UFC Russas. Para este desafio de um aluno: "${aiGoal}", responda em no máximo 2 linhas com uma direção prática e indique um pilar entre pesquisa, extensão ou formação.`
      }]);
      setAiResponse(response);
    } catch (error) {
      setAiResponse(error instanceof Error ? error.message : 'Não foi possível conectar ao laboratório.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const lenses = {
    pesquisa: { icon: Network, label: 'Pesquisa', title: 'Perguntas difíceis viram conhecimento', text: 'Investigamos tecnologias e métodos para entender sistemas, dados e os problemas que ainda não têm resposta pronta.', metric: '12 frentes ativas' },
    extensao: { icon: Workflow, label: 'Extensão', title: 'Tecnologia que encontra território', text: 'Construímos com pessoas e instituições, aproximando software de necessidades concretas do Vale do Jaguaribe.', metric: '08 parceiros próximos' },
    formacao: { icon: GraduationCap, label: 'Formação', title: 'Aprender fazendo deixa marca', text: 'Cada projeto vira repertório: decisões de arquitetura, colaboração, comunicação e confiança para o próximo desafio.', metric: '37 mentes em movimento' }
  };
  const active = lenses[activeLens];
  const ActiveIcon = active.icon;

  return <div className="home-experience animate-in fade-in pb-16">
    <section className="home-hero relative overflow-hidden">
      <div className="hero-grid absolute inset-0 pointer-events-none" />
      <div className="scanline pointer-events-none" />
      <div className="home-hero__orb home-hero__orb--one" />
      <div className="home-hero__orb home-hero__orb--two" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 sm:pt-20 sm:pb-24 lg:pt-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
          <div className="relative z-10">
            <p className="eyebrow reveal-up"><span className="status-dot" /> NERDS · UFC RUSSAS · SINAL AO VIVO</p>
            <h1 className="font-display reveal-up reveal-delay-1 mt-6 text-5xl font-bold leading-[.98] tracking-tight text-white sm:text-7xl">Ideias que <span className="text-cyan-300 text-glow">ganham sistema.</span></h1>
            <p className="reveal-up reveal-delay-2 mt-7 max-w-xl text-lg leading-relaxed text-slate-300 sm:text-xl">Um núcleo universitário para pesquisar, construir e compartilhar tecnologia com impacto real. Entre no laboratório.</p>
            <div className="reveal-up reveal-delay-3 mt-9 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => document.getElementById('laboratorio')?.scrollIntoView({ behavior: 'smooth' })} className="magnetic-button group flex items-center justify-center gap-3 rounded-xl bg-cyan-400 px-6 py-3.5 font-bold text-slate-950 shadow-[0_0_32px_rgba(34,211,238,.22)] transition-all hover:bg-cyan-300"><Rocket size={18} /> Entrar no laboratório <ArrowDownRight size={18} className="transition-transform group-hover:translate-y-1" /></button>
              <button type="button" onClick={() => document.getElementById('manifesto')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center justify-center gap-2 rounded-xl border border-slate-600 px-6 py-3.5 font-semibold text-slate-200 transition-colors hover:border-cyan-400 hover:text-cyan-300">Ver o que nos move <ArrowUpRight size={17} /></button>
            </div>
          </div>
          <div className="relative z-10 reveal-up reveal-delay-2">
            <div className="constellation-card" aria-label="Constelação visual das frentes do NERDS">
              <div className="constellation-orbit constellation-orbit--outer" /><div className="constellation-orbit constellation-orbit--inner" />
              <div className="constellation-node constellation-node--research">Pesquisa</div><div className="constellation-node constellation-node--extension">Extensão</div><div className="constellation-node constellation-node--formation">Formação</div>
              <div className="constellation-core"><img src={nerdsLogo} alt="Logo NERDS UFC" className="constellation-logo" /></div>
              <div className="constellation-caption"><Sparkles size={15} /> Pessoas, ideias e impacto em órbita</div>
            </div>
          </div>
        </div>
        <div className="reveal-up reveal-delay-3 mt-16 flex items-center gap-4 overflow-hidden border-y border-white/10 py-4 text-xs font-bold uppercase tracking-[.2em] text-slate-500"><span className="shrink-0 text-cyan-300">Construímos com</span><span className="tech-marquee">Python <b>·</b> TypeScript <b>·</b> Dados <b>·</b> Produto <b>·</b> Comunidade <b>·</b> Python <b>·</b> TypeScript <b>·</b> Dados</span></div>
      </div>
    </section>

    <section id="manifesto" className="max-w-7xl mx-auto px-4 pt-20 sm:px-6 lg:px-8 lg:pt-28">
      <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow"><Sparkles size={15} /> O núcleo em três frequências</p><h2 className="font-display mt-4 max-w-2xl text-3xl font-bold text-white sm:text-5xl">Não é só tecnologia. É a forma como ela se conecta.</h2></div><p className="max-w-xs text-sm leading-6 text-slate-400">Escolha uma lente e veja como o NERDS transforma curiosidade em movimento.</p></div>
      <div className="grid gap-5 lg:grid-cols-[.72fr_1.28fr]">
        <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">{(Object.keys(lenses) as Array<keyof typeof lenses>).map(key => { const LensIcon = lenses[key].icon; return <button type="button" key={key} onClick={() => setActiveLens(key)} className={`lens-button ${activeLens === key ? 'is-active' : ''}`}><LensIcon size={19} /><span>{lenses[key].label}</span><ChevronRight size={17} className="ml-auto" /></button>; })}</div>
        <div className="lens-stage relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-slate-800/70 p-7 sm:p-10"><div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" /><div className="relative"><div className="mb-12 flex items-center justify-between"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-300"><ActiveIcon size={27} /></div><span className="rounded-full border border-cyan-400/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-300">{active.metric}</span></div><h3 className="font-display max-w-lg text-3xl font-bold text-white sm:text-4xl">{active.title}</h3><p className="mt-5 max-w-xl text-base leading-7 text-slate-300">{active.text}</p><div className="mt-10 flex items-center gap-3 text-sm font-bold text-cyan-300"><span className="h-px w-10 bg-cyan-300" /> NERDS / 2026 <ArrowUpRight size={16} /></div></div></div>
      </div>
    </section>

    <section id="laboratorio" className="max-w-7xl mx-auto px-4 pt-20 sm:px-6 lg:px-8 lg:pt-28">
      <div className="lab-panel relative overflow-hidden rounded-3xl border border-indigo-400/20 p-6 sm:p-10"><div className="absolute inset-0 lab-noise pointer-events-none" /><div className="relative grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><div><p className="eyebrow"><Bot size={15} /> Laboratório de ideias</p><h2 className="font-display mt-4 text-3xl font-bold text-white sm:text-5xl">Chegue com um problema. Saia com um primeiro passo.</h2><p className="mt-5 leading-7 text-slate-300">O NERDINHO ajuda a conectar sua pergunta aos projetos, cursos e pessoas certas do núcleo.</p></div><div className="rounded-2xl border border-white/10 bg-slate-950/65 p-4 sm:p-5"><div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500"><Terminal size={15} className="text-cyan-300" /> nerds://ideia</div><div className="flex flex-wrap gap-2 pb-4">{['Quero pesquisar dados', 'Tenho um projeto social', 'Quero aprender APIs'].map(prompt => <button type="button" key={prompt} onClick={() => setAiGoal(prompt)} className="rounded-full border border-slate-700 px-3 py-1.5 text-xs text-slate-300 transition-colors hover:border-cyan-400 hover:text-cyan-300">{prompt}</button>)}</div><div className="flex flex-col gap-3 sm:flex-row"><input value={aiGoal} onChange={event => setAiGoal(event.target.value)} onKeyDown={event => event.key === 'Enter' && handleAiGoal()} placeholder="Descreva sua ideia..." className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400" /><button type="button" onClick={handleAiGoal} disabled={isAiLoading} className="flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 transition-colors hover:bg-cyan-300 disabled:opacity-60"><Lightbulb size={17} /> {isAiLoading ? 'Processando' : 'Acionar'}</button></div>{aiResponse && <div className="mt-4 rounded-xl border-l-2 border-cyan-400 bg-cyan-400/10 p-4 text-sm leading-6 text-cyan-100">{aiResponse}</div>}</div></div></div>
    </section>

    <section className="max-w-7xl mx-auto grid gap-5 px-4 pt-20 sm:px-6 md:grid-cols-3 lg:px-8 lg:pt-28"><div className="impact-card impact-card--cyan"><Layers3 size={22} /><strong>+10</strong><span>projetos que atravessam a universidade</span></div><div className="impact-card impact-card--violet"><Database size={22} /><strong>37</strong><span>pessoas aprendendo em rede</span></div><div className="impact-card impact-card--lime"><Rocket size={22} /><strong>100%</strong><span>vontade de fazer a diferença</span></div></section>
  </div>;
};

const CoursesView = () => {
  const [courses, setCourses] = useState<typeof MOCK_COURSES>(MOCK_COURSES);
  const [selectedCourse, setSelectedCourse] = useState<typeof MOCK_COURSES[number] | null>(null);
  const [aiQuery, setAiQuery] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  useEffect(() => { contentApi.list<typeof MOCK_COURSES[number]>('courses').then(setCourses).catch(() => undefined); }, []);

  if (selectedCourse) return <DetailView eyebrow={selectedCourse.category} title={selectedCourse.title} image={selectedCourse.image} metadata={`${selectedCourse.progress}% de progresso sugerido · Trilha NERDS`} content={selectedCourse.description || 'Esta trilha foi criada para apresentar conceitos essenciais e orientar você na construção de projetos práticos.'} onBack={() => setSelectedCourse(null)} action={selectedCourse.signupUrl ? { label: 'Inscrever-se no curso', href: selectedCourse.signupUrl } : undefined} />;

  const handleRecommend = async () => {
    if (!aiQuery.trim()) return;
    setIsAiLoading(true);
    setRecommendation("Analisando suas preferências...");
    try {
      const response = await requestGemini([{
        role: 'user',
        text: `Com base no interesse "${aiQuery}", qual destes cursos do NERDS você recomenda? Cursos: ${courses.map(c => c.title).join(', ')}. Seja amigável e direto, responda em no máximo 2 frases curtas.`
      }]);
      setRecommendation(response);
    } catch (error) {
      setRecommendation(error instanceof Error ? error.message : "Não foi possível obter uma recomendação.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-in fade-in">
      <PageIntro icon={BookOpenCheck} eyebrow="Aprendizado aplicado" title="Cursos para construir com confiança" description="Trilhas práticas para transformar curiosidade em projetos. Escolha um ponto de partida, avance no seu ritmo e compartilhe o que você criar com a comunidade." />
      
      <div className="glass rounded-2xl p-6 sm:p-8 my-8 border border-cyan-500/20">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="text-cyan-400" />
          <h2 className="text-xl font-bold text-white">Encontre sua próxima trilha</h2>
        </div>
        <p className="text-slate-300 mb-4">Diga o que você quer aprender, e nossa IA encontrará o curso ideal.</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <input 
            type="text" 
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRecommend()}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
            placeholder="Ex: Quero aprender a criar APIs..."
          />
            <button onClick={handleRecommend} disabled={isAiLoading} className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-lg transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
              <ArrowUpRight size={17} />
            {isAiLoading ? 'Buscando...' : 'Recomendar'}
          </button>
        </div>
        {recommendation && (
          <div className="mt-4 p-4 bg-slate-900/50 rounded-lg border border-cyan-500/30 text-cyan-100">
            {recommendation}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course.id} className="soft-card bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-cyan-500/50 transition-colors">
            <div className="overflow-hidden"><img loading="lazy" src={course.image} alt={course.title} className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105" /></div>
            <div className="p-6">
              <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider">{course.category}</span>
              <h3 className="text-xl font-bold text-white mt-2 mb-4">{course.title}</h3>
              <button type="button" onClick={() => setSelectedCourse(course)} className="flex items-center justify-center gap-2 text-center w-full px-4 py-2 bg-slate-700 hover:bg-cyan-500 hover:text-slate-950 text-white rounded-lg transition-colors font-medium">
                Acessar curso <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BlogView = () => {
  const [articles, setArticles] = useState<typeof MOCK_ARTICLES>(MOCK_ARTICLES);
  const [selectedArticle, setSelectedArticle] = useState<typeof MOCK_ARTICLES[number] | null>(null);
  const [summaries, setSummaries] = useState<Record<number, string>>({});
  useEffect(() => { contentApi.list<typeof MOCK_ARTICLES[number]>('articles').then(setArticles).catch(() => undefined); }, []);

  if (selectedArticle) return <DetailView eyebrow="Caderno NERDS" title={selectedArticle.title} image={selectedArticle.image} metadata={`${selectedArticle.date} · ${selectedArticle.readTime} de leitura · ${selectedArticle.tags.join(' · ')}`} content={selectedArticle.content || 'Este artigo está sendo preparado pela equipe NERDS.'} onBack={() => setSelectedArticle(null)} action={selectedArticle.url ? { label: 'Abrir referência', href: selectedArticle.url } : undefined} />;

  const generateSummary = async (article: typeof MOCK_ARTICLES[number]) => {
    setSummaries(prev => ({...prev, [article.id]: 'Gerando resumo inteligente...' }));
    try {
      const response = await requestGemini([{
        role: 'user',
        text: `Gere um resumo instigante e super curto (máximo 2 linhas) para um artigo intitulado "${article.title}" com as tags ${article.tags.join(', ')}.`
      }]);
      setSummaries(prev => ({...prev, [article.id]: response}));
    } catch (error) {
       setSummaries(prev => ({...prev, [article.id]: error instanceof Error ? error.message : "Não foi possível resumir o artigo."}));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-in fade-in">
      <PageIntro icon={Newspaper} eyebrow="Caderno NERDS" title="Ideias que continuam depois do código" description="Relatos, aprendizados e provocações de quem pesquisa, ensina e constrói tecnologia com os pés no mundo real." />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map(article => (
          <article key={article.id} className="soft-card bg-slate-800 rounded-2xl p-6 border border-slate-700 flex flex-col">
            {article.image && <img loading="lazy" src={article.image} alt="" className="w-full h-40 object-cover rounded-lg mb-4" />}
            <div className="flex gap-2 mb-4">
              {article.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-slate-700 text-cyan-400 text-xs rounded-md">{tag}</span>
              ))}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{article.title}</h3>
            <p className="text-slate-400 text-sm mb-6 flex items-center gap-2"><Clock3 size={15} /> {article.date} <span className="text-slate-600">·</span> {article.readTime} de leitura</p>
            <p className="text-slate-300 text-sm mb-4 line-clamp-3">{article.content || 'Uma leitura breve sobre como tecnologia, colaboração e impacto social se encontram no dia a dia do NERDS.'}</p>
            
            {summaries[article.id] ? (
              <div className="mt-auto mb-4 p-3 bg-slate-900 rounded-lg text-sm text-cyan-200 border border-cyan-500/20">
                {summaries[article.id]}
              </div>
            ) : (
              <button onClick={() => generateSummary(article)} className="mt-auto mb-4 flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300">
                <Zap size={16} /> Resumo com IA
              </button>
            )}
            
            <button type="button" onClick={() => setSelectedArticle(article)} className="block text-center w-full mt-auto px-4 py-2 border border-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium">Ler notícia</button>
          </article>
        ))}
      </div>
    </div>
  );
};

const EdictsView = () => {
  const [edicts, setEdicts] = useState<typeof MOCK_EDICTS>(MOCK_EDICTS);
  const [selectedEdict, setSelectedEdict] = useState<typeof MOCK_EDICTS[number] | null>(null);
  const [idea, setIdea] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  useEffect(() => { contentApi.list<typeof MOCK_EDICTS[number]>('edicts').then(setEdicts).catch(() => undefined); }, []);

  if (selectedEdict) return <DetailView eyebrow={`${selectedEdict.type} · ${selectedEdict.status}`} title={selectedEdict.title} metadata={`Prazo de inscrição: ${selectedEdict.deadline}`} content={selectedEdict.description || 'Os detalhes deste edital serão publicados em breve.'} onBack={() => setSelectedEdict(null)} action={selectedEdict.formUrl ? { label: 'Acessar formulário', href: selectedEdict.formUrl } : undefined} />;

  const generateIdea = async () => {
    if (!idea.trim()) return;
    setIsAiLoading(true);
    setSuggestion("Realizando brainstorming de ideias...");
    try {
      const response = await requestGemini([{
        role: 'user',
        text: `Com base nestes interesses: "${idea}", sugira uma ideia de projeto universitário criativo focado em Engenharia de Software ou Inovação Social. Dê um título e uma breve descrição (2 linhas no máximo).`
      }]);
      setSuggestion(response);
    } catch (error) {
      setSuggestion(error instanceof Error ? error.message : 'Não foi possível gerar a ideia.');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-in fade-in">
      <PageIntro icon={FileCheck2} eyebrow="Oportunidades em movimento" title="Editais para fazer parte" description="Bolsas, monitorias e projetos que conectam formação acadêmica com problemas reais. Leia os detalhes e encontre uma oportunidade que combine com você." />
      
      <div className="glass rounded-2xl p-6 sm:p-8 my-8 border border-amber-400/20">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="text-cyan-400" />
          <h2 className="text-xl font-bold text-white">Gerador de Ideias (Ideathon AI)</h2>
        </div>
        <p className="text-slate-300 mb-4">Sem ideias para submeter? Descreva seus interesses e a IA sugere um projeto!</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <input 
            type="text" 
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && generateIdea()}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
            placeholder="Ex: Gosto de desenvolvimento web e educação infantil..."
          />
           <button onClick={generateIdea} disabled={isAiLoading} className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-lg transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
             <Zap size={17} />
             {isAiLoading ? 'Gerando...' : 'Gerar Ideia'}
          </button>
        </div>
        {suggestion && (
          <div className="mt-4 p-4 bg-slate-900/50 rounded-lg border border-cyan-500/30 text-cyan-100 font-medium">
            {suggestion}
          </div>
        )}
      </div>

      <div className="grid gap-4">
        {edicts.map(edict => (
          <article key={edict.id} className="soft-card bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2 py-1 text-xs font-bold rounded-md ${edict.status === 'Aberto' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {edict.status}
                </span>
                <span className="text-cyan-400 text-sm font-medium">{edict.type}</span>
              </div>
              <h3 className="text-lg font-bold text-white">{edict.title}</h3>
              <p className="text-slate-400 text-sm flex items-center gap-2 mt-2"><Clock3 size={15} /> Inscrições até {edict.deadline}</p>
              {edict.description && <p className="text-slate-300 text-sm mt-2 max-w-2xl">{edict.description}</p>}
            </div>
            <button type="button" onClick={() => setSelectedEdict(edict)} className="flex items-center gap-2 px-5 py-2.5 bg-slate-700 hover:bg-cyan-500 hover:text-slate-950 text-white rounded-lg transition-colors font-medium whitespace-nowrap">Ver oportunidade <ArrowUpRight size={16} /></button>
          </article>
        ))}
      </div>
    </div>
  );
};

const EventsView = () => {
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<typeof MOCK_EVENTS[number] | null>(null);
  useEffect(() => { contentApi.list<typeof events[number]>('events').then(setEvents).catch(() => undefined); }, []);
  if (selectedEvent) return <DetailView eyebrow="Agenda da comunidade" title={selectedEvent.title} image={selectedEvent.image} metadata={`${new Date(selectedEvent.date).toLocaleString('pt-BR')} · ${selectedEvent.location}`} content={selectedEvent.description} onBack={() => setSelectedEvent(null)} action={selectedEvent.url ? { label: 'Mais informações', href: selectedEvent.url } : undefined} />;
  return (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-in fade-in">
    <PageIntro icon={Calendar} eyebrow="Agenda da comunidade" title="Encontros que viram projeto" description="Oficinas, rodas de conversa e momentos para aprender junto. Chegue com uma pergunta e saia com vontade de construir." />
    {events.length === 0 ? <div className="flex flex-col items-center justify-center p-12 bg-slate-800 rounded-xl border border-slate-700 mt-8">
      <Calendar className="text-cyan-500 w-16 h-16 mb-4 opacity-50" /><h3 className="text-xl font-bold text-white mb-2">Nenhum evento próximo</h3><p className="text-slate-400">Novos eventos serão divulgados em breve.</p>
    </div> : <div className="grid md:grid-cols-2 gap-6 mt-8">{events.map(event => <article key={event.id} className="soft-card bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
      {event.image && <img loading="lazy" src={event.image} alt="" className="w-full h-52 object-cover" />}
      <div className="p-6"><p className="text-cyan-400 text-sm flex items-center gap-2"><Calendar size={15} /> {new Date(event.date).toLocaleString('pt-BR')} </p><p className="text-slate-500 text-sm flex items-center gap-2 mt-2"><MapPin size={15} /> {event.location}</p><h3 className="text-xl font-bold text-white mt-4">{event.title}</h3><p className="text-slate-400 mt-3 leading-relaxed">{event.description}</p><button type="button" onClick={() => setSelectedEvent(event)} className="inline-flex items-center gap-2 mt-5 text-cyan-400">Ver detalhes <ArrowUpRight size={16} /></button></div>
    </article>)}</div>}
  </div>
)};

const BuildWithNerdsView = () => {
  const [form, setForm] = useState({ name: '', email: '', institution: '', challenge: '', context: '', desiredImpact: '' });
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const update = (key: keyof typeof form, value: string) => setForm(current => ({ ...current, [key]: value }));
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await proposalApi.create(form);
      setSubmitted(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Não foi possível enviar sua proposta.');
    } finally {
      setSaving(false);
    }
  };

  return <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 animate-in fade-in">
    <PageIntro icon={Handshake} eyebrow="Construção aberta" title="Traga um desafio. A gente constrói junto." description="O NERDS conecta problemas reais a estudantes, pesquisadores e parceiros dispostos a experimentar soluções com impacto." />
    <div className="mt-8 grid gap-6 lg:grid-cols-[.7fr_1.3fr]">
      <aside className="build-story rounded-3xl border border-cyan-400/20 p-6 sm:p-8"><p className="eyebrow"><Sparkles size={15} /> Do desafio ao protótipo</p><h2 className="mt-4 font-display text-3xl font-bold text-white">Uma boa pergunta já é começo de projeto.</h2><div className="mt-8 space-y-5">{[['01', 'Escuta', 'Entendemos o contexto antes de escolher a tecnologia.'], ['02', 'Encontro', 'Conectamos sua necessidade às pessoas certas do núcleo.'], ['03', 'Experimento', 'Criamos um primeiro protótipo e aprendemos com ele.']].map(([number, title, text]) => <div key={number} className="flex gap-4"><span className="font-display text-sm font-bold text-cyan-300">{number}</span><div><h3 className="font-bold text-white">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-400">{text}</p></div></div>)}</div></aside>
      <section className="rounded-3xl border border-slate-700 bg-slate-800/75 p-6 shadow-2xl sm:p-8">{submitted ? <div className="flex min-h-[28rem] flex-col items-center justify-center text-center"><div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-lime-400/15 text-lime-300"><CheckCircle2 size={32} /></div><h2 className="font-display text-3xl font-bold text-white">Desafio recebido.</h2><p className="mt-4 max-w-md leading-7 text-slate-300">A equipe do NERDS vai ler sua proposta e encontrar o melhor próximo passo. Obrigado por querer construir algo que importa.</p><button type="button" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', institution: '', challenge: '', context: '', desiredImpact: '' }); }} className="mt-8 text-sm font-bold text-cyan-300 hover:text-cyan-200">Enviar outra proposta</button></div> : <form onSubmit={submit} className="space-y-4"><div className="flex items-center justify-between"><div><p className="eyebrow"><Send size={15} /> Nova proposta</p><h2 className="mt-2 font-display text-2xl font-bold text-white">Conte o que você quer transformar</h2></div><span className="text-xs text-slate-500">leva 3 min</span></div><div className="grid gap-4 sm:grid-cols-2"><input required value={form.name} onChange={event => update('name', event.target.value)} placeholder="Seu nome" className="field-input" /><input required type="email" value={form.email} onChange={event => update('email', event.target.value)} placeholder="Seu e-mail" className="field-input" /><input required value={form.institution} onChange={event => update('institution', event.target.value)} placeholder="Instituição ou comunidade" className="field-input sm:col-span-2" /></div><textarea required value={form.challenge} onChange={event => update('challenge', event.target.value)} placeholder="Qual desafio você gostaria de resolver?" className="field-input min-h-28 resize-y" /><textarea value={form.context} onChange={event => update('context', event.target.value)} placeholder="O que já existe hoje? (opcional)" className="field-input min-h-24 resize-y" /><textarea value={form.desiredImpact} onChange={event => update('desiredImpact', event.target.value)} placeholder="Que mudança você gostaria de ver? (opcional)" className="field-input min-h-24 resize-y" />{error && <p role="alert" className="text-sm text-red-300">{error}</p>}<button disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3.5 font-bold text-slate-950 transition-colors hover:bg-cyan-300 disabled:opacity-60"><Send size={17} /> {saving ? 'Enviando proposta...' : 'Enviar desafio ao NERDS'}</button></form>}</section>
    </div>
  </div>;
};

const PrototypeLabView = () => {
  const [prototypes, setPrototypes] = useState(MOCK_PROTOTYPES);
  const [selected, setSelected] = useState<Prototype | null>(null);
  const [filter, setFilter] = useState('Todos');
  const filters = ['Todos', 'Em produção', 'Em pesquisa', 'Laboratório'];
  useEffect(() => { contentApi.list<Prototype>('prototypes').then(setPrototypes).catch(() => undefined); }, []);
  const visible = prototypes.filter(prototype => filter === 'Todos' || prototype.status === filter);
  if (selected) return <DetailView eyebrow={`Laboratório · ${selected.status}`} title={selected.title} image={selected.image} metadata={selected.stack.join(' · ')} content={`${selected.summary}\n\n${selected.description}`} onBack={() => setSelected(null)} action={selected.url ? { label: 'Abrir protótipo', href: selected.url } : undefined} />;
  return <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 animate-in fade-in"><PageIntro icon={FlaskConical} eyebrow="Laboratório público" title="Veja as ideias antes de virarem produto" description="Protótipos, experimentos e sistemas em construção. Um retrato honesto de como o NERDS aprende fazendo." /><div className="mt-8 flex flex-wrap gap-2">{filters.map(item => <button type="button" key={item} onClick={() => setFilter(item)} className={`filter-chip ${filter === item ? 'is-active' : ''}`}>{item}</button>)}</div><div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{visible.map(prototype => <article key={prototype.id} className="prototype-card soft-card"><img src={prototype.image} alt="" /><div className="p-5"><div className="flex items-center justify-between gap-3"><span className="status-label">{prototype.status}</span><span className="text-xs text-slate-500">#{String(prototype.id).padStart(2, '0')}</span></div><h2 className="mt-4 font-display text-2xl font-bold text-white">{prototype.title}</h2><p className="mt-3 text-sm leading-6 text-slate-400">{prototype.summary}</p><div className="mt-5 flex flex-wrap gap-2">{prototype.stack.map(item => <span key={item} className="stack-tag">{item}</span>)}</div><button type="button" onClick={() => setSelected(prototype)} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-cyan-300 hover:text-cyan-200">Explorar projeto <ArrowUpRight size={16} /></button></div></article>)}</div></div>;
};

const OpportunitiesView = () => {
  const [courses, setCourses] = useState(MOCK_COURSES);
  const [edicts, setEdicts] = useState(MOCK_EDICTS);
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [selected, setSelected] = useState<{ title: string; kind: string; description: string; meta: string; image?: string; href?: string } | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('Todos');
  useEffect(() => { contentApi.list<typeof MOCK_COURSES[number]>('courses').then(setCourses).catch(() => undefined); contentApi.list<typeof MOCK_EDICTS[number]>('edicts').then(setEdicts).catch(() => undefined); contentApi.list<typeof MOCK_EVENTS[number]>('events').then(setEvents).catch(() => undefined); }, []);
  const opportunities = [...courses.map(item => ({ id: `course-${item.id}`, kind: 'Curso', title: item.title, description: item.description || 'Uma trilha prática para aprender construindo.', meta: item.category, image: item.image, href: item.signupUrl, icon: BookOpenCheck })), ...edicts.map(item => ({ id: `edict-${item.id}`, kind: 'Edital', title: item.title, description: item.description || 'Uma oportunidade para fazer parte de uma frente do NERDS.', meta: `Até ${item.deadline}`, href: item.formUrl, icon: FileCheck2 })), ...events.map(item => ({ id: `event-${item.id}`, kind: 'Evento', title: item.title, description: item.description, meta: item.location, image: item.image, href: item.url, icon: Calendar }))];
  const visible = opportunities.filter(item => (filter === 'Todos' || item.kind === filter) && `${item.title} ${item.description} ${item.meta}`.toLowerCase().includes(query.toLowerCase()));
  if (selected) return <DetailView eyebrow={`Central · ${selected.kind}`} title={selected.title} image={selected.image} metadata={selected.meta} content={selected.description} onBack={() => setSelected(null)} action={selected.href ? { label: `Abrir ${selected.kind.toLowerCase()}`, href: selected.href } : undefined} />;
  return <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 animate-in fade-in"><PageIntro icon={Briefcase} eyebrow="Central de oportunidades" title="Seu próximo passo começa aqui" description="Cursos, editais e eventos reunidos em uma só visão para você encontrar onde entrar, aprender e contribuir." /><div className="opportunity-toolbar mt-8"><div className="relative flex-1"><Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar por tema, área ou palavra-chave" className="field-input pl-11" /></div><div className="flex flex-wrap gap-2">{['Todos', 'Curso', 'Edital', 'Evento'].map(item => <button type="button" key={item} onClick={() => setFilter(item)} className={`filter-chip ${filter === item ? 'is-active' : ''}`}>{item}</button>)}</div></div><div className="mt-8 grid gap-4 lg:grid-cols-2">{visible.map(item => { const OpportunityIcon = item.icon; return <button type="button" key={item.id} onClick={() => setSelected(item)} className="opportunity-card w-full text-left"><div className="opportunity-card__icon"><OpportunityIcon size={21} /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="eyebrow">{item.kind}</span><span className="text-xs text-slate-500">{item.meta}</span></div><h2 className="mt-2 font-display text-xl font-bold text-white">{item.title}</h2><p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">{item.description}</p><span className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-cyan-300">Ver detalhes <ArrowUpRight size={14} /></span></div><span className="shrink-0 text-cyan-300"><ExternalLink size={18} /></span></button>; })}</div>{!visible.length && <div className="mt-8 rounded-2xl border border-dashed border-slate-700 p-10 text-center text-slate-400">Nenhuma oportunidade encontrada para esta busca.</div>}</div>;
};

const MembersView = () => {
  const [members, setMembers] = useState(MOCK_MEMBERS);
  useEffect(() => { contentApi.list<typeof MOCK_MEMBERS[number]>('members').then(setMembers).catch(() => undefined); }, []);
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white mb-4">Nossa Equipe</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Conheça as mentes brilhantes por trás do NERDS. Estudantes, pesquisadores e professores dedicados à inovação, tecnologia e impacto social.
        </p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {members.map(member => (
          <div key={member.id} className="soft-card bg-slate-800/80 border border-slate-700 rounded-2xl p-5 flex flex-col items-center text-center hover:bg-slate-800 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(0,180,216,0.1)] transition-all group">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-700 flex items-center justify-center text-white text-lg sm:text-xl font-bold mb-4 shadow-inner group-hover:bg-cyan-500 group-hover:text-slate-900 transition-colors overflow-hidden">
              {member.image ? <img src={member.image} alt="" className="w-full h-full object-cover" /> : getInitials(member.name)}
            </div>
            <h3 className="text-white font-bold text-xs sm:text-sm mb-1 leading-tight line-clamp-2">{member.name}</h3>
            <p className="text-cyan-400/80 text-[10px] sm:text-xs mt-auto pt-2">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const FloatingAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<GeminiMessage[]>([
    { role: 'model', text: 'Olá! Sou o NERDINHO. Como posso te ajudar na plataforma hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if(!input.trim()) return;
    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsLoading(true);

    try {
      const aiText = await requestGemini(
        [...messages, { role: 'user', text: userText }],
        "Você é o NERDINHO, o mascote e assistente virtual inteligente do NERDS (Núcleo Especializado em Reengenharia e Desenvolvimento de Software) da UFC - Campus Russas. Você é amigável, fala sobre tecnologia de forma descomplicada, ajuda alunos a achar cursos ou editais. Responda em português, de forma concisa e útil (evite textos gigantes)."
      );
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'model',
        text: error instanceof Error ? error.message : "Não foi possível alcançar o servidor."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="floating-ai fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-slate-800 border border-slate-700 shadow-2xl rounded-2xl w-[90vw] sm:w-96 overflow-hidden flex flex-col h-[400px] animate-in slide-in-from-bottom-5">
          <div className="bg-slate-900 p-4 border-b border-slate-700 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img src={nerdsLogo} alt="Logo NERDS UFC" className="nerds-logo nerds-logo--chat" />
              <h3 className="text-white font-bold">NERDINHO AI</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-cyan-500 text-slate-900 rounded-br-sm' : 'bg-slate-700 text-white rounded-bl-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-2xl text-sm bg-slate-700 text-slate-400 rounded-bl-sm flex gap-1 items-center">
                   <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                   <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-slate-700 bg-slate-900 flex gap-2">
            <input 
              type="text" 
              value={input}
              disabled={isLoading}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isLoading ? "Nerdinho está digitando..." : "Pergunte algo..."}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 disabled:opacity-50"
            />
            <button onClick={handleSend} disabled={isLoading} className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 p-2 rounded-lg transition-colors disabled:opacity-50">
              <MessageSquare size={18} />
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,180,216,0.4)] transition-transform hover:scale-110"
        >
          <img src={nerdsLogo} alt="Abrir Nerdinho" className="nerds-logo nerds-logo--floating" />
        </button>
      )}
    </div>
  );
};

const GlobalSearch = ({ query, onQueryChange, onSelect, onClose }: { query: string; onQueryChange: (value: string) => void; onSelect: (id: string) => void; onClose: () => void }) => {
  const items = [
    ['home', 'Início', 'Conheça o NERDS e seus projetos'], ['courses', 'Cursos', 'Aprendizado aplicado'], ['blog', 'Blog', 'Artigos e aprendizados'],
    ['edicts', 'Editais', 'Bolsas e oportunidades'], ['events', 'Eventos', 'Agenda da comunidade'], ['build', 'Construir com o NERDS', 'Envie um desafio'],
    ['lab', 'Laboratório', 'Protótipos públicos'], ['opportunities', 'Central de oportunidades', 'Cursos, editais e eventos']
  ];
  const matches = items.filter(([, title, description]) => `${title} ${description}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="search-overlay" role="dialog" aria-label="Busca global"><div className="search-overlay__panel"><div className="flex items-center gap-3 border-b border-slate-700 p-4"><Search size={20} className="text-cyan-300" /><input autoFocus value={query} onChange={event => onQueryChange(event.target.value)} onKeyDown={event => event.key === 'Escape' && onClose()} placeholder="Buscar no NERDS..." className="min-w-0 flex-1 bg-transparent text-white outline-none" /><button type="button" onClick={onClose} aria-label="Fechar busca"><X size={19} /></button></div><div className="max-h-[60vh] overflow-y-auto p-2">{matches.map(([id, title, description]) => <button type="button" key={id} onClick={() => onSelect(id)} className="search-result"><span className="search-result__icon"><ArrowUpRight size={16} /></span><span><strong>{title}</strong><small>{description}</small></span></button>)}{!matches.length && <p className="p-8 text-center text-sm text-slate-500">Nenhum resultado encontrado.</p>}</div></div></div>;
};

const LoginModal = ({ onClose, onAuthenticated }: { onClose: () => void; onAuthenticated: (user: AuthUser) => void }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = mode === 'login'
        ? await authApi.login(email, password)
        : await authApi.register(name, email, password);
      onAuthenticated(result.user);
      onClose();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Não foi possível concluir o acesso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <form onSubmit={submit} className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">{mode === 'login' ? 'Entrar na plataforma' : 'Criar conta'}</h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
        </div>
        {mode === 'register' && (
          <input required minLength={2} value={name} onChange={event => setName(event.target.value)} placeholder="Nome completo" className="w-full mb-3 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" />
        )}
        <input required type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="E-mail" className="w-full mb-3 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" />
        <input required minLength={8} type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Senha (mínimo 8 caracteres)" className="w-full mb-4 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" />
        {error && <p className="mb-4 text-sm text-red-300">{error}</p>}
        <button disabled={loading} className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-slate-900 font-bold rounded-lg px-4 py-3">
          {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Cadastrar'}
        </button>
        <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }} className="w-full mt-4 text-sm text-cyan-400 hover:text-cyan-300">
          {mode === 'login' ? 'Ainda não tenho uma conta' : 'Já tenho uma conta'}
        </button>
      </form>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    authApi.me().then(result => setUser(result.user)).catch(() => setUser(null)).finally(() => setIsSessionLoading(false));
    Promise.all([contentApi.list<typeof MOCK_EDICTS[number]>('edicts'), contentApi.list<typeof MOCK_EVENTS[number]>('events')])
      .then(([edicts, events]) => setNotificationCount(edicts.filter(item => item.status === 'Aberto').length + events.filter(item => new Date(item.date) >= new Date()).length))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  const renderView = () => {
    switch (activeTab) {
      case 'home': return <HomeView />;
      case 'courses': return <CoursesView />;
      case 'blog': return <BlogView />;
      case 'edicts': return <EdictsView />;
      case 'events': return <EventsView />;
      case 'build': return <BuildWithNerdsView />;
      case 'lab': return <PrototypeLabView />;
      case 'opportunities': return <OpportunitiesView />;
      case 'members': return <MembersView />;
      case 'admin': return user?.role === 'admin' ? <AdminPanel /> : <HomeView />;
      default: return <HomeView />;
    }
  };

  const navItems = [
    { id: 'home', label: 'Início' },
    { id: 'courses', label: 'Cursos' },
    { id: 'blog', label: 'Blog' },
    { id: 'edicts', label: 'Editais' },
    { id: 'events', label: 'Eventos' },
    { id: 'build', label: 'Construir' },
    { id: 'lab', label: 'Laboratório' },
    { id: 'opportunities', label: 'Oportunidades' },
    { id: 'members', label: 'Membros' },
    ...(user?.role === 'admin' ? [{ id: 'admin', label: 'Painel admin' }] : [])
  ];
  const mobileNavItems = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'courses', label: 'Cursos', icon: BookOpenCheck },
    { id: 'opportunities', label: 'Central', icon: Briefcase },
    { id: 'build', label: 'Construir', icon: Handshake },
    { id: 'lab', label: 'Lab', icon: FlaskConical }
  ];
  const goTo = (tab: string) => { setActiveTab(tab); setIsSearchOpen(false); setSearchQuery(''); setIsMobileMenuOpen(false); };

  return (
    <div className="site-shell min-h-screen bg-slate-900 font-sans text-slate-200">
      <nav className="site-nav glass sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            <div className="flex items-center gap-8">
              <div className="site-brand group flex-shrink-0 cursor-pointer" onClick={() => setActiveTab('home')}>
                <img src={nerdsLogo} alt="Logo NERDS UFC" className="site-brand__mark site-brand__logo pulse-ring" />
                <span className="site-brand__name">NERDS<span>&lt;\UFC&gt;</span></span>
              </div>
              
              <div className="hidden xl:block">
                <div className="nav-links">
                  {navItems.map((item) => (
                    <button 
                      key={item.id}
                      onClick={() => setActiveTab(item.id)} 
                      className={`nav-link ${activeTab === item.id ? 'is-active' : ''}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setIsSearchOpen(true)} className="nav-search hidden sm:flex" aria-label="Buscar no NERDS"><Search size={16} /><span>Buscar</span><kbd>Ctrl K</kbd></button>
              <div className="relative hidden sm:block"><button type="button" onClick={() => setIsNotificationsOpen(value => !value)} className="nav-icon-button" aria-label="Novidades"><Bell size={17} />{notificationCount > 0 && <span className="notification-badge">{notificationCount > 9 ? '9+' : notificationCount}</span>}</button>{isNotificationsOpen && <div className="notification-popover"><p className="eyebrow">Novidades</p><strong>{notificationCount ? `${notificationCount} oportunidades esperando por você` : 'Tudo em dia'}</strong><button type="button" onClick={() => { setIsNotificationsOpen(false); setActiveTab('opportunities'); }}>Abrir central <ArrowUpRight size={14} /></button></div>}</div>
              <button onClick={() => user ? logout() : setIsLoginOpen(true)} disabled={isSessionLoading} className="nav-session hidden sm:flex items-center gap-2 disabled:opacity-50">
                <User size={17} /> {isSessionLoading ? 'Verificando...' : user ? `Sair · ${user.name.split(' ')[0]}` : 'Entrar'}
              </button>
              <div className="xl:hidden flex items-center">
                <button aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="nav-menu-button">
                  {isMobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
                </button>
              </div>
            </div>

          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="nav-mobile-panel xl:hidden">
            <div className="nav-mobile-panel__inner px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button type="button" onClick={() => { setIsSearchOpen(true); setIsMobileMenuOpen(false); }} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-base font-medium text-cyan-300 hover:bg-slate-800"><Search size={17} /> Buscar no NERDS</button>
              {navItems.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => goTo(item.id)} 
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${activeTab === item.id ? 'bg-slate-800 text-cyan-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                >
                  {item.label}
                </button>
              ))}
              <button onClick={() => user ? logout() : setIsLoginOpen(true)} disabled={isSessionLoading} className="flex w-full text-left px-3 py-2 mt-4 border-t border-slate-800 text-base font-medium text-slate-300 items-center gap-2 disabled:opacity-50">
                <User size={18} /> {isSessionLoading ? 'Verificando sessão...' : user ? `Sair (${user.name.split(' ')[0]})` : 'Entrar'}
              </button>
            </div>
          </div>
        )}
      </nav>

      {isSearchOpen && <GlobalSearch query={searchQuery} onQueryChange={setSearchQuery} onSelect={goTo} onClose={() => { setIsSearchOpen(false); setSearchQuery(''); }} />}

      <main className="min-h-[calc(100vh-64px)] pb-20 md:pb-0">
        {renderView()}
      </main>

      <div className="mobile-dock md:hidden">
        {mobileNavItems.map(item => { const NavIcon = item.icon; return <button type="button" key={item.id} onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }} className={activeTab === item.id ? 'is-active' : ''}><NavIcon size={18} /><span>{item.label}</span></button>; })}
      </div>

      <footer className="bg-slate-900 border-t border-slate-800 py-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
              <img src={nerdsLogo} alt="Logo NERDS UFC" className="footer-logo" />
              <span className="text-white font-bold tracking-wider">NERDS<span className="text-cyan-500 text-xs ml-1">&lt;\UFC&gt;</span></span>
            </div>
            <p className="text-slate-500 text-sm max-w-sm">
              Núcleo Especializado em Reengenharia e Desenvolvimento de Software.<br/>
              Universidade Federal do Ceará - Campus Russas.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <a href="https://www.instagram.com/nerds.ufc/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-cyan-500 hover:text-slate-900 text-slate-400 rounded-full transition-all group border border-slate-700 hover:border-cyan-500">
              <Instagram size={18} />
              <span className="text-sm font-medium">@nerds.ufc</span>
            </a>
          </div>
        </div>
      </footer>

      <FloatingAI />
      {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} onAuthenticated={(authenticatedUser) => { setUser(authenticatedUser); if (authenticatedUser.role === 'admin') setActiveTab('admin'); }} />}
    </div>
  );
}