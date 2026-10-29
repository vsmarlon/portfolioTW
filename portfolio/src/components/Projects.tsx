import { Link } from 'react-router-dom';
import { projectsData } from '../data/projects';
import { useScrollReveal } from '../hooks/useScrollReveal';
import ExternalMark from './ExternalMark';
import Icon from './Icon';
import { useLocale } from '../contexts/LocaleContext';

const freebayProject = projectsData[0];
const supportingProjects = projectsData.slice(1);
const freebayStack = ['React + Flutter', 'NestJS', 'PostgreSQL + Stripe', 'Socket.IO'];

const Projects = () => {
  const reveal = useScrollReveal();
  const { t } = useLocale();

  return (
    <section id="projects" className="content-section">
      <div className="editorial-container">
        <div ref={reveal} className="reveal flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="section-heading">
            <p className="eyebrow">{t('projects.eyebrow')}</p>
            <h2>{t('projects.title')}</h2>
            <p>{t('projects.description')}</p>
          </div>
          <p className="w-fit border border-stone-900/20 bg-[#fffdf8]/75 px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-stone-600 dark:border-stone-100/20 dark:bg-white/[0.04] dark:text-stone-300">
            {projectsData.length} {t('projects.selected')}
          </p>
        </div>

        <article
          ref={reveal}
          className="reveal featured-project mt-10 grid gap-4 border-[3px] border-stone-900 bg-[#fffdf8]/90 p-4 dark:border-stone-100 dark:bg-[#131110]/90 md:grid-cols-[1fr_18rem] md:items-stretch md:p-6"
        >
          <div className="flex flex-col p-4 md:border-r md:border-stone-900/20 md:p-6 md:pr-10 dark:md:border-stone-100/20">
            <div>
              <p className="eyebrow">{t('projects.featured')}</p>
              <h3 className="mt-4 font-display text-4xl font-black text-stone-900 dark:text-stone-100">
                Freebay
              </h3>
              <p className="mt-4 max-w-xl leading-7 text-stone-700 dark:text-stone-300">
                {t('projects.flagshipDescription')}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {freebayProject.tools.map((tool) => (
                  <span
                    key={tool}
                    className="border border-stone-900/20 px-2 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:border-stone-100/20 dark:text-stone-300"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={freebayProject.caseStudyUrl ?? '/projects/freebay'}
                className="focus-ring inline-flex items-center gap-2 border-2 border-stone-900 bg-stone-900 px-4 py-3 text-sm font-bold text-[#faf6ef] transition-colors duration-200 hover:border-[#73004c] hover:bg-[#a1006b] dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900 dark:hover:border-[#ec7cc3] dark:hover:bg-[#ec7cc3]"
              >
                {t('projects.caseStudy')} <Icon name="arrow-right" />
              </Link>
              <a
                href={freebayProject.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex items-center gap-2 border-2 border-stone-900/25 px-4 py-3 text-sm font-bold text-stone-800 transition-colors duration-200 hover:border-[#a1006b] hover:text-[#73004c] dark:border-stone-100/25 dark:text-stone-100 dark:hover:border-fuchsia-200 dark:hover:text-fuchsia-200"
              >
                <Icon name="github" /> {t('projects.code')} <ExternalMark label={t('externalLink')} />
              </a>
            </div>

            <div className="mt-6 grid w-full gap-2 font-mono text-xs uppercase tracking-[0.12em] text-stone-800 sm:grid-cols-2 dark:text-stone-200">
              {freebayStack.map((item) => (
                <span
                  key={item}
                  className="border border-stone-900/20 bg-white/60 p-3 dark:border-stone-100/20 dark:bg-white/[0.03]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center border-t border-stone-900/20 p-5 dark:border-stone-100/20 md:border-t-0">
            <img
              data-testid="freebay-flagship-media"
              className="h-auto w-[250px] rounded-sm border border-stone-900/20 dark:border-stone-100/20"
              src={freebayProject.image}
              width="500"
              height="996"
              loading="lazy"
              decoding="async"
              alt={t('projects.freebayPreview')}
            />
          </div>
        </article>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {supportingProjects.map((project, index) => (
            <article
              key={project.title}
              ref={reveal}
              className="reveal project-card card-interactive flex min-h-full flex-col overflow-hidden border-2 border-stone-900/20 bg-[#fffdf8]/75 dark:border-stone-100/20 dark:bg-[#171413]/80"
              style={{ transitionDelay: `${Math.min(index, 4) * 70}ms` }}
            >
              {project.image ? (
                <div className="project-card-image-wrap">
                  <img
                    src={project.image}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <span aria-hidden="true">{project.visual}</span>
                </div>
              ) : (
                <div className="project-card-visual" data-tone={project.tone} aria-hidden="true">
                  <span>{project.visual}</span>
                  <i />
                </div>
              )}

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <p className="eyebrow">{t(project.eyebrow)}</p>
                <h3 className="mt-3 font-display text-2xl font-black text-stone-900 dark:text-stone-100">
                  {project.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-stone-700 dark:text-stone-300">
                  {t(project.description)}
                </p>

                {project.details ? (
                  <ul className="mt-4 space-y-2 border-l-2 border-[#a1006b]/30 pl-4 dark:border-fuchsia-200/30">
                    {project.details.map((detail) => (
                      <li key={detail} className="text-xs leading-5 text-stone-600 dark:text-stone-400">
                        {t(detail)}
                      </li>
                    ))}
                  </ul>
                ) : null}

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tools.map((tool) => (
                    <span key={tool} className="border border-stone-900/15 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-stone-600 dark:border-stone-100/15 dark:text-stone-300">
                      {tool}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex flex-wrap gap-3 pt-6">
                  {project.articleUrl ? (
                    <Link
                      to={project.articleUrl}
                      className="focus-ring inline-flex items-center gap-2 text-sm font-bold text-[#73004c] underline decoration-[#a1006b]/30 underline-offset-4 hover:decoration-[#a1006b] dark:text-fuchsia-200"
                    >
                      <Icon name="article" /> {t('blog.readArticle')}
                    </Link>
                  ) : null}
                  <a
                    href={project.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring inline-flex items-center gap-2 text-sm font-bold text-[#73004c] underline decoration-[#a1006b]/30 underline-offset-4 hover:decoration-[#a1006b] dark:text-fuchsia-200"
                  >
                    <Icon name="github" /> {t('projects.code')} <ExternalMark label={t('externalLink')} />
                  </a>
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focus-ring inline-flex items-center gap-2 text-sm font-bold text-stone-700 underline decoration-stone-500/30 underline-offset-4 hover:text-[#73004c] hover:decoration-[#a1006b] dark:text-stone-200 dark:hover:text-fuchsia-200"
                    >
                      {t('projects.live')} <ExternalMark label={t('externalLink')} />
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
