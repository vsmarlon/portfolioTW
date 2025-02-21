import { timelineItems, skills, currentFocus } from '../data/about';
import { useScrollReveal } from '../hooks/useScrollReveal';
import Icon from './Icon';

const focusColumnClassName =
  'py-5 first:pt-0 last:pb-0 md:px-0 md:py-0';

const skillGroupCellClassName =
  'flex h-full flex-col justify-start py-6';

const About = () => {
  const reveal = useScrollReveal();

  return (
    <section id="sobre" className="py-24 relative">
      <div ref={reveal} className="reveal container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
            Sobre <span className="text-cyan-400">Mim</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Conheça minha jornada, habilidades e o que me motiva a criar soluções digitais.
          </p>
        </div>

        <div className="grid grid-cols-1 overflow-hidden border-4 border-black dark:border-white lg:grid-cols-2">
          <div
            ref={reveal}
            className="reveal-right border-b-4 border-black bg-zinc-100/80 p-8 dark:border-white dark:bg-slate-900/80 lg:border-r-4"
            style={{ transitionDelay: '100ms' }}
          >
            <h3 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">Minha Jornada</h3>
            <p className="mb-4 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              Sou Marlon, um desenvolvedor front-end apaixonado por criar interfaces dinâmicas,
              minimalistas, bonitas e responsivas. Com experiência em HTML, CSS, Tailwind e JavaScript,
              busco sempre melhorar a experiência do usuário e inovar em cada projeto.
            </p>
            <p className="mb-8 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              Atualmente estou focado em aprimorar minhas habilidades full-stack,
              aprender novas linguagens, frameworks e construir projetos que resolvam problemas reais.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="/newest.pdf"
                download
                className="inline-flex items-center gap-2 border-2 border-black bg-cyan-400 px-6 py-3 font-bold text-black transition-all duration-200 hover:bg-black hover:text-cyan-400 dark:text-black"
              >
                <Icon name="download" /> Baixar Currículo
              </a>
              <a
                href="https://github.com/vsmarlon"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border-2 border-black bg-white px-6 py-3 font-bold text-slate-700 transition-all duration-200 hover:bg-black hover:text-white dark:border-white dark:bg-black dark:text-white dark:hover:bg-white dark:hover:text-black"
              >
                <Icon name="github" /> GitHub
              </a>
            </div>
          </div>

          <div className="border-b-4 border-black bg-zinc-100/80 p-8 dark:border-white dark:bg-slate-900/80">
            <h3 data-testid="about-experience" className="mb-8 text-2xl font-semibold text-slate-900 dark:text-white">
              Experiência & Educação
            </h3>

            <div className="relative">
              <div className="absolute left-[7px] top-2 bottom-2 w-1 bg-gradient-to-b from-cyan-400 to-blue-500"></div>

              {timelineItems.map((item, index) => (
                <div key={index} className="relative mb-6 pl-12 last:mb-0">
                  <div
                    className={`absolute left-0 top-1.5 h-4 w-4 border-4 border-zinc-200 dark:border-slate-900 ${
                      item.type === 'work'
                        ? 'bg-cyan-400'
                        : item.type === 'education'
                          ? 'bg-blue-500'
                          : 'bg-purple-500'
                    }`}
                  ></div>

                  <div className="border-2 border-transparent bg-zinc-100/80 p-6 transition-colors duration-200 hover:border-cyan-400 dark:bg-white/5 dark:hover:border-cyan-400">
                    <span className="mb-2 block text-sm font-bold tracking-wider text-cyan-600 uppercase dark:text-cyan-400">
                      {item.period}
                    </span>
                    <h4 className="mb-1 text-xl font-bold text-slate-900 dark:text-white">{item.title}</h4>
                    <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                      <Icon
                        name="map-pin"
                        className={`mr-1 inline ${
                          item.type === 'work'
                            ? 'text-cyan-400'
                            : item.type === 'education'
                              ? 'text-blue-500'
                              : 'text-purple-500'
                        }`}
                      />
                      {item.location}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-black bg-zinc-100/80 p-8 dark:border-white dark:bg-slate-900/80 lg:border-r-4">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 pr-0 sm:pr-4">
                <p className="text-xs font-semibold tracking-[0.22em] text-cyan-600 uppercase dark:text-cyan-400">
                  Agora
                </p>
                <h3
                  data-testid="about-current-focus"
                  className="mt-2 text-2xl font-semibold leading-tight text-slate-900 dark:text-white"
                >
                  Construindo e aprendendo
                </h3>
              </div>
              <div className="shrink-0 border-2 border-cyan-400/30 bg-cyan-400/15 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-cyan-600 uppercase dark:text-cyan-400">
                Em progresso
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2">
              <div className="border-b border-black/5 py-4 md:border-r md:pr-6 dark:border-white/10">
                <h4 className="text-sm font-bold tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400">
                  Construindo
                </h4>
              </div>
              <div className="border-b border-black/5 py-4 md:pl-6 dark:border-white/10">
                <h4 className="text-sm font-bold tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400">
                  Aprendendo
                </h4>
              </div>

              <div className={`${focusColumnClassName} md:border-r md:border-black/5 md:pr-6 md:pt-5 dark:md:border-white/10`}>
                <div className="space-y-3">
                  {currentFocus.building.map((item) => (
                    <div key={item} className="flex gap-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
                      <span className="mt-2 h-2 w-2 shrink-0 bg-cyan-400"></span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${focusColumnClassName} md:pl-6 md:pt-5`}>
                <div className="space-y-3">
                  {currentFocus.learning.map((item) => (
                    <div key={item} className="flex gap-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
                      <span className="mt-2 h-2 w-2 shrink-0 bg-cyan-400"></span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-100/80 p-8 dark:bg-slate-900/80">
            <h3 data-testid="about-skills" className="mb-6 text-2xl font-semibold leading-tight text-slate-900 dark:text-white">
              Habilidades
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 sm:items-stretch">
              {skills.map((skillGroup, index) => (
                <div
                  key={skillGroup.category}
                  className={`${skillGroupCellClassName} ${
                    index < skills.length - 1 ? 'border-b border-black/5 dark:border-white/10' : ''
                  } ${
                    index < 2 ? 'sm:border-b sm:border-black/5 sm:dark:border-white/10' : 'sm:border-b-0'
                  } ${index % 2 === 0 ? 'sm:pr-6' : 'sm:pl-6'} ${
                    index % 2 === 0 ? 'sm:border-r sm:border-black/5 sm:dark:border-white/10' : ''
                  } ${index >= 2 ? 'sm:pt-6' : 'sm:pb-6'} ${index < 2 ? 'sm:pt-0' : ''} ${
                    index % 2 !== 0 ? 'sm:pr-0' : 'sm:pl-0'
                  }`}
                >
                  <h4 className="mb-3 flex min-h-10 items-center gap-3 text-sm font-bold tracking-wider text-cyan-600 uppercase dark:text-cyan-400">
                    <span className="flex h-10 w-10 items-center justify-center border-2 border-cyan-400/20 bg-cyan-400/10 text-lg dark:border-cyan-400/20 dark:bg-cyan-400/12">
                      <Icon name={skillGroup.icon} />
                    </span>
                    <span>{skillGroup.category}</span>
                  </h4>
                  <div className="flex flex-wrap content-start gap-2.5">
                    {skillGroup.items.map((skill, i) => (
                      <span
                        key={skill}
                        className="border border-black/5 bg-zinc-300 px-3 py-1.5 text-sm font-medium text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-300"
                        style={{ transitionDelay: `${i * 50}ms` }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
