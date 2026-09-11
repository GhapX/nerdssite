import React, { useEffect, useState } from 'react';
import { Bold, BarChart3, BookOpen, CalendarDays, FileText, FlaskConical, Handshake, ImagePlus, Italic, List, Pencil, Plus, Save, Sparkles, Trash2, Type, Users, X } from 'lucide-react';
import { contentApi, type AdminRecord, type AdminResource } from '../services/api';

type Field = { key: string; label: string; type?: 'text' | 'url' | 'number' | 'textarea'; editor?: boolean };
type ResourceConfig = { label: string; fields: Field[] };

const CONFIG: Record<AdminResource, ResourceConfig> = {
  courses: {
    label: 'Cursos',
    fields: [
      { key: 'title', label: 'Título' }, { key: 'category', label: 'Categoria' },
      { key: 'progress', label: 'Progresso (%)', type: 'number' },
      { key: 'image', label: 'URL da foto', type: 'url' }, { key: 'signupUrl', label: 'Link de inscrição', type: 'url' },
      { key: 'description', label: 'Sobre o curso', type: 'textarea', editor: true }
    ]
  },
  articles: {
    label: 'Blog',
    fields: [
      { key: 'title', label: 'Título' }, { key: 'tags', label: 'Tags (separadas por vírgula)' },
      { key: 'date', label: 'Data' }, { key: 'readTime', label: 'Tempo de leitura' },
      { key: 'image', label: 'URL da foto', type: 'url' }, { key: 'url', label: 'Link do artigo', type: 'url' },
      { key: 'content', label: 'Conteúdo', type: 'textarea', editor: true }
    ]
  },
  edicts: {
    label: 'Editais',
    fields: [
      { key: 'title', label: 'Título' }, { key: 'type', label: 'Tipo' }, { key: 'deadline', label: 'Prazo' },
      { key: 'status', label: 'Status' }, { key: 'formUrl', label: 'Link do formulário', type: 'url' },
      { key: 'description', label: 'Sobre o edital', type: 'textarea', editor: true }
    ]
  },
  events: {
    label: 'Eventos',
    fields: [
      { key: 'title', label: 'Título' }, { key: 'date', label: 'Data e hora' },
      { key: 'location', label: 'Local' }, { key: 'image', label: 'URL da foto', type: 'url' },
      { key: 'url', label: 'Link do evento', type: 'url' }, { key: 'description', label: 'Descrição', type: 'textarea', editor: true }
    ]
  },
  members: {
    label: 'Membros',
    fields: [
      { key: 'name', label: 'Nome' }, { key: 'role', label: 'Função' }, { key: 'image', label: 'URL da foto', type: 'url' }
    ]
  },
  proposals: {
    label: 'Propostas',
    fields: [
      { key: 'name', label: 'Nome' }, { key: 'email', label: 'E-mail' },
      { key: 'institution', label: 'Instituição' }, { key: 'status', label: 'Status' },
      { key: 'challenge', label: 'Desafio', type: 'textarea', editor: true },
      { key: 'context', label: 'Contexto', type: 'textarea', editor: true },
      { key: 'desiredImpact', label: 'Impacto desejado', type: 'textarea', editor: true }
    ]
  },
  prototypes: {
    label: 'Protótipos',
    fields: [
      { key: 'title', label: 'Título' }, { key: 'summary', label: 'Resumo' }, { key: 'status', label: 'Status' },
      { key: 'stack', label: 'Stack (separada por vírgula)' }, { key: 'image', label: 'URL da foto', type: 'url' },
      { key: 'url', label: 'Link do protótipo', type: 'url' }, { key: 'description', label: 'Descrição', type: 'textarea', editor: true }
    ]
  }
};

const ICONS: Record<AdminResource, typeof BookOpen> = {
  courses: BookOpen,
  articles: FileText,
  edicts: FileText,
  events: CalendarDays,
  members: Users,
  proposals: Handshake
  ,prototypes: FlaskConical
};

const emptyForm = (resource: AdminResource): AdminRecord =>
  Object.fromEntries(CONFIG[resource].fields.map(field => [field.key, field.key === 'tags' ? [] : '']));

const normalize = (resource: AdminResource, data: AdminRecord): AdminRecord => ({
  ...data,
  ...(resource === 'articles' && typeof data.tags === 'string'
    ? { tags: data.tags.split(',').map(tag => tag.trim()).filter(Boolean) }
    : {}),
  ...(resource === 'prototypes' && typeof data.stack === 'string'
    ? { stack: data.stack.split(',').map(item => item.trim()).filter(Boolean) }
    : {})
});

function TextEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const insert = (prefix: string, suffix = '') => {
    const textarea = document.activeElement as HTMLTextAreaElement | null;
    if (!textarea || textarea.tagName !== 'TEXTAREA') {
      onChange(`${value}${value ? '\n' : ''}${prefix}${suffix}`);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end) || 'texto';
    const nextValue = `${value.slice(0, start)}${prefix}${selected}${suffix}${value.slice(end)}`;
    onChange(nextValue);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    });
  };

  return <div className="mt-1 overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
    <div className="flex items-center gap-1 border-b border-slate-700 bg-slate-950/70 p-2">
      <button type="button" title="Título" onClick={() => insert('## ', '')} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"><Type size={16} /></button>
      <button type="button" title="Negrito" onClick={() => insert('**', '**')} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"><Bold size={16} /></button>
      <button type="button" title="Itálico" onClick={() => insert('_', '_')} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"><Italic size={16} /></button>
      <button type="button" title="Lista" onClick={() => insert('- ', '')} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"><List size={16} /></button>
      <span className="ml-auto px-2 text-[10px] uppercase tracking-wider text-slate-500">Editor de conteúdo</span>
    </div>
    <textarea value={value} onChange={event => onChange(event.target.value)} className="min-h-36 w-full resize-y bg-transparent px-3 py-3 text-sm leading-6 text-white outline-none" placeholder="Escreva o conteúdo desta página..." />
  </div>;
}

export default function AdminPanel() {
  const [resource, setResource] = useState<AdminResource>('courses');
  const [items, setItems] = useState<AdminRecord[]>([]);
  const [form, setForm] = useState<AdminRecord>(emptyForm('courses'));
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await (resource === 'proposals'
        ? contentApi.adminList<AdminRecord>(resource)
        : contentApi.list<AdminRecord>(resource)));
      setError('');
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Não foi possível carregar os dados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [resource]);

  const startEdit = (item: AdminRecord) => {
    setEditingId(Number(item.id));
    setForm({ ...item, tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '', stack: Array.isArray(item.stack) ? item.stack.join(', ') : item.stack || '' });
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const data = normalize(resource, form);
      if (editingId) await contentApi.update(resource, editingId, data);
      else await contentApi.create(resource, data);
      setForm(emptyForm(resource));
      setEditingId(null);
      await load();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Não foi possível salvar.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!window.confirm('Excluir este registro?')) return;
    try {
      await contentApi.remove(resource, id);
      await load();
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : 'Não foi possível excluir.');
    }
  };

  const config = CONFIG[resource];
  const Icon = ICONS[resource];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-in">
      <header className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/15 via-slate-800 to-indigo-500/10 p-6 sm:p-8 mb-6">
        <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-[.2em] mb-3"><Sparkles size={14} /> Workspace NERDS</div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">Painel de controle</h1>
            <p className="text-slate-300 mt-2 max-w-xl">Publique, organize e acompanhe todo o conteúdo da plataforma em um só lugar.</p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-slate-950/30 px-4 py-3 border border-white/10"><BarChart3 className="text-cyan-300" /><div><p className="text-2xl font-bold text-white">{items.length}</p><p className="text-xs text-slate-400">{config.label.toLowerCase()} ativos</p></div></div>
        </div>
      </header>
      <div className="grid lg:grid-cols-[220px_1fr] gap-6 items-start">
        <aside className="lg:sticky lg:top-24">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 px-3 mb-2">Conteúdo</p>
          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-1 gap-2">
            {(Object.keys(CONFIG) as AdminResource[]).map(key => {
              const ResourceIcon = ICONS[key];
              return <button key={key} onClick={() => { setResource(key); setForm(emptyForm(key)); setEditingId(null); }}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-left font-medium transition-all ${resource === key ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                <ResourceIcon size={17} /> <span className="text-sm">{CONFIG[key].label}</span>
              </button>;
            })}
          </div>
        </aside>
        <section className="min-w-0">
          <div className="flex items-center justify-between mb-4"><div><p className="text-sm text-cyan-400 font-medium">Gerenciar conteúdo</p><h2 className="font-display text-2xl font-bold text-white flex items-center gap-2"><Icon size={21} /> {config.label}</h2></div><span className="text-xs text-slate-500">{loading ? 'Carregando...' : `${items.length} registro(s)`}</span></div>
          {error && <div role="alert" className="mb-5 flex items-start gap-3 rounded-xl border border-red-400/30 bg-red-950/30 px-4 py-3 text-sm text-red-200"><span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-400" />{error}</div>}
          <div className="grid xl:grid-cols-[minmax(300px,.8fr)_1.2fr] gap-5">
          <form onSubmit={save} className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 sm:p-6 space-y-3 shadow-xl shadow-black/10">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold text-white">{editingId ? 'Editar registro' : 'Novo registro'}</h3>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm(resource)); }} className="text-slate-400 hover:text-white"><X size={18} /></button>}
          </div>
          {config.fields.map(field => (
            <label key={field.key} className="block text-sm text-slate-300">
              {field.label}
              {field.type === 'textarea'
                ? field.editor
                  ? <TextEditor value={String(form[field.key] ?? '')} onChange={value => setForm({ ...form, [field.key]: value })} />
                  : <textarea value={String(form[field.key] ?? '')} onChange={event => setForm({ ...form, [field.key]: event.target.value })} className="mt-1 w-full min-h-24 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white" />
                : <input required={['title', 'name', 'category', 'type', 'date', 'deadline', 'role'].includes(field.key)} type={field.type || 'text'} value={Array.isArray(form[field.key]) ? form[field.key].join(', ') : String(form[field.key] ?? '')} onChange={event => setForm({ ...form, [field.key]: field.type === 'number' ? Number(event.target.value) : event.target.value })} className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white" />}
            </label>
          ))}
          {error && <p className="text-sm text-red-300">{error}</p>}
          <button disabled={saving} className="w-full flex justify-center items-center gap-2 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-60 text-slate-950 font-bold rounded-xl px-4 py-3 transition-all hover:shadow-lg hover:shadow-cyan-500/20">
            {editingId ? <Save size={18} /> : <Plus size={18} />} {saving ? 'Salvando...' : editingId ? 'Salvar alterações' : 'Adicionar'}
          </button>
        </form>
        <div className="space-y-3 max-h-[680px] overflow-y-auto pr-1">
          {loading && <div className="space-y-3">{[1, 2, 3].map(item => <div key={item} className="h-20 rounded-2xl border border-slate-700 bg-slate-800/70 skeleton" />)}</div>}
          {!loading && items.map(item => (
            <div key={String(item.id)} className="soft-card bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex justify-between gap-4">
              <div className="min-w-0 flex items-center gap-3">{item.image ? <img src={String(item.image)} alt="" className="h-12 w-12 rounded-xl object-cover border border-white/10" /> : <div className="h-12 w-12 rounded-xl bg-slate-900 flex items-center justify-center text-slate-500"><ImagePlus size={18} /></div>}<div className="min-w-0"><h3 className="text-white font-bold truncate">{String(item.title || item.name)}</h3><p className="text-slate-400 text-sm truncate">{String(item.category || item.role || item.type || item.date || '')}</p></div></div>
              <div className="flex gap-2 shrink-0"><button aria-label="Editar" onClick={() => startEdit(item)} className="p-2 text-cyan-400 hover:bg-slate-700 rounded-lg"><Pencil size={17} /></button><button aria-label="Excluir" onClick={() => remove(Number(item.id))} className="p-2 text-red-400 hover:bg-slate-700 rounded-lg"><Trash2 size={17} /></button></div>
            </div>
          ))}
          {!loading && !items.length && <div className="rounded-2xl border border-dashed border-slate-700 p-10 text-center text-slate-500">Nenhum registro ainda. Crie o primeiro ao lado.</div>}
        </div>
        </div>
        </section>
      </div>
    </div>
  );
}
