import { projectsData } from '../data/projects';
import { useScrollReveal } from '../hooks/useScrollReveal';
import Icon from './Icon';
import SurfaceCard from './ui/SurfaceCard';
import TagChip from './ui/TagChip';

const Projects = () => {
  const reveal = useScrollReveal();

  const getCardLayout = (isSpotlight?: boolean) => {
    return isSpotlight ? 'md:col-span-2 md:row-span-2' : 'md:col-span-1';
  };

  return (
    <section id="projects" className="relative py-24">
      <div ref={reveal} className="reveal container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white md:text-5xl">
            Meus <span className="text-cyan-400">Projetos</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Uma seleção de aplicações que desenvolvi para resolver problemas e aprofundar repertório técnico.
          </p>
        </div>

        <div className="grid auto-rows-[minmax(280px,auto)] grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projectsData.map((project, index) => (
            <SurfaceCard
              key={project.title}
              variant={project.featured ? 'strong' : 'default'}
              ref={reveal}
              className={`reveal group relative flex h-full flex-col overflow-hidden border-3 border-black dark:border-white bg-white dark:bg-black transition-colors duration-200 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black ${getCardLayout(project.spotlight)}`}
              style={{ transitionDelay: `${(index + 1) * 100}ms` }}
            >
              {project.featured && (
                <div className="absolute right-4 top-4 z-10 border-2 border-black dark:border-white bg-cyan-400 px-3 py-1 text-xs font-bold text-black">
                  Destaque
                </div>
              )}

              <div
                className={`relative overflow-hidden border-b-2 border-black dark:border-white ${project.spotlight ? 'aspect-[16/10] md:min-h-[320px] md:flex-1' : 'aspect-video'}`}
              >
                <div className="absolute inset-0 z-10 flex items-end justify-between gap-3 bg-gradient-to-t from-black/60 via-black/10 to-transparent p-5">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
                      {project.eyebrow}
                    </p>
                    <p className="mt-2 max-w-xs text-sm text-white/85">
                      {project.tools.slice(0, 2).join(' / ')}
                    </p>
                  </div>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border-2 border-black bg-white px-4 py-2 text-sm font-bold text-black transition-colors duration-200 hover:bg-black hover:text-white"
                  >
                    Ver Projeto <Icon name="external-link" />
                  </a>
                </div>

                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  width={640}
                  height={360}
                  className="h-full w-full object-cover transition-transform duration-200 ease-out group-hover:scale-110"
                />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-black/60 dark:text-white/60 group-hover:text-white dark:group-hover:text-black">
                      {project.spotlight ? 'Experiência principal' : 'Exploração'}
                    </p>
                    <h3 className="text-xl font-bold text-black dark:text-white transition-colors group-hover:text-white dark:group-hover:text-black">
                      {project.title}
                    </h3>
                  </div>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-black dark:text-white transition-colors group-hover:text-white dark:group-hover:text-black hover:text-cyan-400"
                    aria-label={`Abrir ${project.title} em nova aba`}
                  >
                    <Icon name="external-link" />
                  </a>
                </div>

                <p className="mt-3 text-sm font-medium uppercase tracking-[0.16em] text-black dark:text-cyan-400 group-hover:text-white dark:group-hover:text-black">
                  {project.focus}
                </p>

                <p className="mb-4 mt-4 flex-grow text-sm leading-relaxed text-black/80 dark:text-white/80 group-hover:text-white/90 dark:group-hover:text-black/90">
                  {project.description}
                </p>

                {project.details && (
                  <div className="mb-5 space-y-3 border-2 border-black dark:border-white bg-white/90 dark:bg-black/90 p-4 text-black dark:text-white group-hover:bg-black group-hover:border-white group-hover:text-white dark:group-hover:bg-white dark:group-hover:border-black dark:group-hover:text-black">
                    {project.details.map((item) => (
                      <div key={item} className="flex gap-3 text-sm leading-6">
                        <span className="mt-2 h-2 w-2 shrink-0 bg-cyan-400"></span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-auto grid gap-4 border-t-2 border-black dark:border-white pt-4 md:grid-cols-[1fr_auto] md:items-end">
                  <div className="flex flex-wrap gap-2">
                    {project.tools.map((tool) => (
                      <TagChip
                        key={tool}
                        className="border-2 border-cyan-400 bg-cyan-400/20 text-black dark:text-cyan-400 group-hover:border-white group-hover:bg-white group-hover:text-black dark:group-hover:border-black dark:group-hover:bg-black dark:group-hover:text-white"
                      >
                        {tool}
                      </TagChip>
                    ))}
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/60 dark:text-white/60 group-hover:text-white dark:group-hover:text-black">
                      Link
                    </p>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-black dark:text-white transition-colors group-hover:text-white dark:group-hover:text-black hover:text-cyan-400"
                    >
                      Abrir projeto
                      <Icon name="external-link" />
                    </a>
                  </div>
                </div>
              </div>
            </SurfaceCard>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="https://github.com/vsmarlon"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-3 border-black dark:border-white bg-white dark:bg-black px-6 py-3 font-bold text-black dark:text-white transition-colors duration-200 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
          >
            <Icon name="github" className="text-lg" />
            Ver mais no GitHub
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;
