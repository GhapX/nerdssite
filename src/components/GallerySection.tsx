import { Images } from 'lucide-react';

interface GalleryPhoto {
  path: string;
  image: string;
  eventName: string;
  subfolder: string;
}

const galleryPhotos = Object.entries(import.meta.glob<string>('../assets/eventos/**/*', {
  eager: true,
  query: '?url',
  import: 'default'
}))
  .filter(([path]) => /\.(avif|gif|jpe?g|png|webp)$/i.test(path))
  .map(([path, image]) => {
    const relativePath = path.replace('../assets/eventos/', '');
    const [eventFolder, ...remainingPath] = relativePath.split('/');
    const subfolder = remainingPath.slice(0, -1).join(' / ');
    const eventName = eventFolder.replace(/^Fotos\s*-\s*/i, '').replace(/\s+/g, ' ').trim();

    return {
      path,
      image,
      eventName,
      subfolder: subfolder.replace(/\s+/g, ' ').trim()
    };
  })
  .sort((left, right) => left.path.localeCompare(right.path, 'pt-BR'));

const galleryEvents = Array.from(
  galleryPhotos.reduce((events, photo) => {
    let event = events.get(photo.eventName);
    if (!event) {
      event = { name: photo.eventName, groups: new Map<string, GalleryPhoto[]>() };
      events.set(photo.eventName, event);
    }

    const group = photo.subfolder || photo.eventName;
    const photos = event.groups.get(group) ?? [];
    photos.push(photo);
    event.groups.set(group, photos);
    return events;
  }, new Map<string, { name: string; groups: Map<string, GalleryPhoto[]> }>())
    .values()
);

export default function GallerySection() {
  return (
    <section className="min-h-[65vh] border-t border-white/5 bg-slate-950/35">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <a href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition-colors hover:text-cyan-200">← Voltar ao início</a>
        <header className="mt-8 max-w-3xl">
          <p className="eyebrow"><Images size={15} /> Nossa história em imagens</p>
          <h1 className="font-display mt-4 text-3xl font-bold text-white sm:text-5xl">Galeria do NERDS.</h1>
          <p className="mt-4 text-sm leading-7 text-slate-400">Registros de projetos, encontros e momentos da nossa comunidade.</p>
          {galleryPhotos.length > 0 && <p className="mt-3 text-sm text-cyan-200">{galleryPhotos.length} fotos</p>}
        </header>

        {galleryPhotos.length > 0 ? (
          <div className="mt-10 space-y-12">
            {galleryEvents.map(event => (
              <section key={event.name} aria-labelledby={`gallery-${event.name}`}>
                <header className="mb-5 flex flex-wrap items-baseline justify-between gap-2 border-b border-white/10 pb-3">
                  <h2 id={`gallery-${event.name}`} className="font-display text-2xl font-bold text-white">{event.name}</h2>
                  <p className="text-sm text-slate-400">
                    {Array.from(event.groups.values()).reduce((count, photos) => count + photos.length, 0)} fotos
                  </p>
                </header>
                <div className="space-y-8">
                  {Array.from(event.groups, ([groupName, photos]) => (
                    <div key={groupName}>
                      {groupName !== event.name && <h3 className="mb-4 text-sm font-semibold text-cyan-200">{groupName}</h3>}
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                        {photos.map(photo => (
                          <figure key={photo.path} className="soft-card overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/70">
                            <img src={photo.image} alt={`Registro de ${event.name}`} loading="lazy" decoding="async" className="aspect-square w-full object-cover" />
                          </figure>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="mt-10 flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 px-6 py-12 text-center">
            <Images size={32} className="text-cyan-300" />
            <h2 className="mt-4 text-lg font-bold text-white">As fotos chegam em breve</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">Adicione fotos às pastas de eventos em <code className="text-cyan-200">src/assets/eventos/</code> para exibi-las aqui.</p>
          </div>
        )}
      </div>
    </section>
  );
}
