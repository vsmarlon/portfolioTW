import { timelineItems, skills, currentFocus } from '../data/about';
import { useScrollReveal } from '../hooks/useScrollReveal';
import ExternalMark from './ExternalMark';
import Icon from './Icon';

const focusColumnClassName =
  'py-5 first:pt-0 last:pb-0 md:px-0 md:py-0';

const About = () => {
  const reveal = useScrollReveal();

  return (
    <section id="about" className="content-section">
      <div ref={reveal} className="reveal container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-4 text-stone-900 dark:text-stone-100">
            Sobre <span className="text-[#a1006b] dark:text-fuchsia-200">Mim</span>
          </h2>
          <p className="text-stone-600 dark:text-stone-300 max-w-2xl mx-auto">
            Conheça minha jornada, habilidades e o que me motiva a criar soluções digitais.
          </p>
        </div>

        <div className="grid grid-cols-1 overflow-hidden border-[3px] border-stone-900 bg-[#fffdf8] dark:border-stone-100 dark:bg-[#131110]">
          <div
            ref={reveal}
             className="reveal-right card-interactive border-b-[3px] border-stone-900 p-8 dark:border-stone-100 lg:border-r-[3px]"
            style={{ transitionDelay: '100ms' }}
          >
            <h3 className="mb-6 text-2xl font-semibold text-stone-900 dark:text-stone-100">Minha Jornada</h3>
            <p className="mb-4 text-lg leading-relaxed text-stone-700 dark:text-stone-300">
              Sou Marlon, Desenvolvedor Full Stack. Trabalho entre React e TypeScript no cliente e NestJS, PostgreSQL e Oracle no backend, com atenção a contratos, dados e manutenção.
            </p>
            <p className="mb-8 text-lg leading-relaxed text-stone-700 dark:text-stone-300">
              Gosto de transformar requisitos em sistemas explicáveis: interfaces úteis, limites de domínio claros e integrações que não escondem suas decisões.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="/newest.pdf"
                download
                className="focus-ring inline-flex items-center gap-2 border-2 border-stone-900 bg-stone-900 px-6 py-3 font-bold text-[#faf6ef] transition-all duration-200 hover:bg-[#a1006b] hover:border-[#73004c] dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-[#ec7cc3]"
              >
                <Icon name="download" /> Baixar Currículo
              </a>
              <a
                href="https://github.com/vsmarlon"
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex items-center gap-2 border-2 border-stone-900 bg-transparent px-6 py-3 font-bold text-stone-900 transition-all duration-200 hover:border-[#a1006b] hover:text-[#a1006b] dark:border-stone-100 dark:text-stone-100 dark:hover:border-fuchsia-200 dark:hover:text-fuchsia-200"
              >
                <Icon name="github" /> GitHub <ExternalMark />
              </a>
            </div>
          </div>

           <div className="card-interactive border-b-[3px] border-stone-900 p-8 dark:border-stone-100">
            <h3 data-testid="about-experience" className="mb-8 text-2xl font-semibold text-stone-900 dark:text-stone-100">
              Experiência & Educação
            </h3>

            <div className="relative">
              <div className="absolute left-[7px] top-2 bottom-2 w-[3px] bg-stone-900/20 dark:bg-stone-100/20"></div>

              {timelineItems.map((item, index) => (
                <div key={index} className="relative mb-6 pl-12 last:mb-0">
                  <div
                    className={`absolute left-0 top-1.5 h-4 w-4 border-2 border-stone-900 dark:border-stone-100 ${
                      item.type === 'work'
                        ? 'bg-[#a1006b]'
                        : item.type === 'education'
                          ? 'bg-stone-900 dark:bg-stone-100'
                          : 'bg-[#73004c]'
                    }`}
                  ></div>

                   <div className="card-interactive border-2 border-stone-900/15 p-6 dark:border-stone-100/15">
                    <span className="mb-2 block font-mono text-sm font-bold tracking-wider text-[#73004c] uppercase dark:text-fuchsia-200">
                      {item.period}
                    </span>
                    <h4 className="mb-1 text-xl font-bold text-stone-900 dark:text-stone-100">{item.title}</h4>
                    <p className="mb-2 text-sm text-stone-600 dark:text-stone-400">
                      <Icon
                        name="map-pin"
                        className="mr-1 inline text-stone-600 dark:text-stone-300"
                      />
                      {item.location}
                    </p>
                    <p className="text-stone-700 dark:text-stone-300">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

           <div className="card-interactive border-stone-900 p-8 dark:border-stone-100 lg:border-r-[3px]">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 pr-0 sm:pr-4">
                <p className="font-mono text-xs font-semibold tracking-[0.22em] text-[#73004c] uppercase dark:text-fuchsia-200">
                  Agora
                </p>
                <h3
                  data-testid="about-current-focus"
                  className="mt-2 text-2xl font-semibold leading-tight text-stone-900 dark:text-stone-100"
                >
                  Construindo e aprendendo
                </h3>
              </div>
              <div className="shrink-0 border-2 border-stone-900 bg-[#a1006b]/10 px-4 py-2 font-mono text-xs font-bold tracking-[0.18em] text-[#73004c] uppercase dark:border-stone-100/30 dark:bg-white/[0.04] dark:text-fuchsia-200">
                Em progresso
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 border-t-2 border-stone-900/20 dark:border-stone-100/20 md:grid-cols-2">
              <div className="border-b-2 border-stone-900/15 py-4 md:border-r-2 md:pr-6 dark:border-stone-100/15">
                <h4 className="font-mono text-sm font-bold tracking-[0.18em] text-stone-600 uppercase dark:text-stone-300">
                  Construindo
                </h4>
              </div>
              <div className="border-b-2 border-stone-900/15 py-4 md:pl-6 dark:border-stone-100/15">
                <h4 className="font-mono text-sm font-bold tracking-[0.18em] text-stone-600 uppercase dark:text-stone-300">
                  Aprendendo
                </h4>
              </div>

              <div className={`${focusColumnClassName} md:border-r-2 md:border-stone-900/15 md:pr-6 md:pt-5 dark:md:border-stone-100/15`}>
                <div className="space-y-3">
                  {currentFocus.building.map((item) => (
                    <div key={item} className="flex gap-3 text-sm leading-6 text-stone-800 dark:text-stone-200">
                      <span className="mt-2 h-2 w-2 shrink-0 bg-[#a1006b]"></span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${focusColumnClassName} md:pl-6 md:pt-5`}>
                <div className="space-y-3">
                  {currentFocus.learning.map((item) => (
                    <div key={item} className="flex gap-3 text-sm leading-6 text-stone-800 dark:text-stone-200">
                      <span className="mt-2 h-2 w-2 shrink-0 bg-[#a1006b]"></span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

           <div className="card-interactive p-8">
            <h3 data-testid="about-skills" className="mb-6 text-2xl font-semibold leading-tight text-stone-900 dark:text-stone-100">
              Habilidades
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {skills.map((skillGroup) => (
                <div
                  key={skillGroup.category}
                  className="card-interactive border-2 border-stone-900/20 p-5 dark:border-stone-100/20"
                >
                  <h4 className="mb-3 flex min-h-10 items-center gap-3 font-mono text-sm font-bold tracking-wider text-[#73004c] uppercase dark:text-fuchsia-200">
                    <span className="flex h-10 w-10 items-center justify-center border-2 border-stone-900 bg-stone-900/[0.04] text-lg dark:border-stone-100/30 dark:bg-white/[0.04]">
                      <Icon name={skillGroup.icon} />
                    </span>
                    <span>{skillGroup.category}</span>
                  </h4>
                  <div className="flex flex-wrap content-start gap-2">
                    {skillGroup.items.map((skill) => (
                      <span
                        key={skill}
                        className="border border-stone-900/20 bg-white/70 px-3 py-1.5 text-sm font-medium text-stone-800 dark:border-stone-100/20 dark:bg-white/[0.04] dark:text-stone-200"
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
