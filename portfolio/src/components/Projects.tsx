import { Link } from 'react-router-dom';
import { projectsData } from '../data/projects';
import { useScrollReveal } from '../hooks/useScrollReveal';
import ExternalMark from './ExternalMark';
import { useLocale } from '../contexts/LocaleContext';

const freebayProject = projectsData[0];
const supportingProjects = projectsData.slice(1);
const freebayStack = ['React + Flutter', 'NestJS / domínio', 'PostgreSQL / pagamentos', 'Socket.IO'];

const Projects = () => {
  const reveal = useScrollReveal();
  const { t } = useLocale();

  return (
    <section id="projects" className="content-section">
      <div className="editorial-container">
        <div ref={reveal} className="reveal section-heading">
          <p className="eyebrow">{t('projects.eyebrow')}</p>
          <h2>{t('projects.title')}</h2>
          <p>{t('projects.description')}</p>
        </div>

        <article
          ref={reveal}
          className="reveal freebay-flagship card-interactive mt-10 grid gap-8 border-[3px] border-stone-900 bg-[#fffdf8] p-5 dark:border-stone-100 dark:bg-[#131110] md:grid-cols-[1fr_18rem] md:items-start md:p-8"
        >
          <div className="flex flex-col border-b-2 border-stone-900/20 p-6 dark:border-stone-100/20 md:border-b-0 md:border-r">
            <div>
              <p className="eyebrow">{t('projects.flagship')}</p>
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
            <Link
              to="/projects/freebay"
              className="focus-ring mt-8 inline-flex w-fit items-center gap-2 border-2 border-stone-900 bg-stone-900 px-4 py-3 text-sm font-bold text-[#faf6ef] transition-all duration-200 hover:bg-[#a1006b] hover:border-[#73004c] dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-[#ec7cc3] dark:hover:border-[#ec7cc3]"
            >
              {t('projects.caseStudy')}
            </Link>
            <div className="mt-6 grid w-full gap-2 font-mono text-xs uppercase tracking-[0.16em] text-stone-800 dark:text-stone-200">
              {freebayStack.map((item) => (
                <span
                  key={item}
                  className="freebay-stack-item border-2 border-stone-900/20 bg-white/60 p-3 dark:border-stone-100/20 dark:bg-white/[0.03]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-start justify-center p-6">
            <picture>
              <source media="(prefers-reduced-motion: reduce)" srcSet={freebayProject.image} />
              <img
                src="/freebay-login.gif"
                alt="Tela de autenticação do aplicativo Freebay"
                className="h-auto w-[250px] rounded-sm border border-stone-900/20 dark:border-stone-100/20"
                loading="lazy"
              />
            </picture>
          </div>
        </article>

        <div className="mt-10 grid gap-4">
          {supportingProjects.map((project, index) => (
            <div
              key={project.title}
              ref={reveal}
              className="reveal"
              style={{ transitionDelay: `${Math.min(index, 4) * 80}ms` }}
            >
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card-interactive focus-ring grid gap-4 border-2 border-stone-900/20 bg-[#fffdf8]/60 p-5 dark:border-stone-100/20 dark:bg-white/[0.02] md:grid-cols-[1fr_auto] md:items-center"
              >
                <div>
                  <p className="eyebrow">{t(project.eyebrow)}</p>
                  <h3 className="mt-2 text-xl font-bold text-stone-900 dark:text-stone-100">
                    {project.title}
                    {project.url.startsWith('http') ? (
                      <>
                        {' '}
                        <ExternalMark />
                      </>
                    ) : null}
                  </h3>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-700 dark:text-stone-300">
                    {t(project.description)}
                  </p>
                  {project.details ? (
                    <ul className="mt-3 space-y-1.5">
                      {project.details.slice(0, 2).map((detail) => (
                        <li
                          key={detail}
                          className="text-xs leading-5 text-stone-600 dark:text-stone-400"
                        >
                          · {t(detail)}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <div className="hidden md:flex md:flex-col md:items-end md:gap-3">
                  <img
                    src={project.image}
                    alt={`${project.title} preview`}
                    className="h-24 w-36 rounded-sm object-cover border border-stone-900/15 dark:border-stone-100/15"
                    loading="lazy"
                  />
                  <span className="font-mono text-xs text-stone-600 dark:text-stone-400">
                    {project.tools.join(' · ')}
                  </span>
                </div>
                <span className="font-mono text-xs text-stone-600 dark:text-stone-400 md:hidden">
                  {project.tools.join(' · ')}
                </span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
