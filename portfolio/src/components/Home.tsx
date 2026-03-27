import { Link } from 'react-router-dom';
import { technologies } from '../data/hero';
import {
  heroDescription,
  heroEyebrow,
  heroFacts,
  heroLead,
  heroNameLetters,
} from '../data/home';
import { socialLinks } from '../data/contact';
import { useNavigateToSection } from '../hooks/useNavigateToSection';
import { useScrollReveal } from '../hooks/useScrollReveal';
import Icon from './Icon';
import TechIcon from './TechIcon';

const Home = () => {
  const handleNavClick = useNavigateToSection();
  const reveal = useScrollReveal();

  return (
    <section id="home" className="flex min-h-screen flex-col overflow-hidden px-4 pt-20 md:px-8 lg:px-16">
      <div className="flex flex-1 flex-col items-center justify-center">
        {/* Hero Container - Brutalist Solid Block */}
        <div
          ref={reveal}
          className="reveal relative mx-auto w-full max-w-5xl overflow-hidden border-4 border-black dark:border-cyan-400 bg-cyan-400 dark:bg-slate-900 px-6 py-10 text-center sm:px-10 md:px-14 md:py-14"
        >
          <div data-testid="home-availability-badge" className="relative z-10 mb-6 inline-block border-2 border-black dark:border-cyan-400 bg-black/10 dark:bg-cyan-400/20 px-4 py-1.5 text-sm font-medium tracking-wide text-black dark:text-cyan-400">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-green-500"></span>
            Disponível para novos projetos
          </div>

          <div className="mb-3 flex justify-center">
            <p className="relative z-10 inline-flex max-w-[34rem] items-center justify-center border-2 border-black dark:border-white bg-white/80 dark:bg-black/80 px-5 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-black dark:text-white">
              <span className="relative z-10">{heroEyebrow}</span>
            </p>
          </div>

          <h1 data-testid="home-hero-name" className="mb-6 text-4xl font-bold leading-[0.95] text-black dark:text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Olá, eu sou o <br className="sm:hidden" />
            <span className="mt-2 inline-flex flex-wrap justify-center gap-x-1.5 gap-y-1">
              {heroNameLetters.map((letter, index) => (
                <span
                  key={`${letter}-${index}`}
                  className="hero-name-letter hero-name-gradient font-display bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]"
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  {letter}
                </span>
              ))}
            </span>
          </h1>

          <p
            ref={reveal}
            className="reveal text-black dark:text-white mx-auto mb-4 max-w-3xl text-lg font-semibold sm:text-xl md:text-2xl"
            style={{ transitionDelay: '100ms' }}
          >
            {heroLead}
          </p>

          <p
            ref={reveal}
            className="reveal text-black dark:text-slate-300 mx-auto mb-10 max-w-2xl text-base leading-8 font-medium sm:text-lg"
            style={{ transitionDelay: '150ms' }}
          >
            {heroDescription}
          </p>

          <div
            ref={reveal}
            className="reveal mt-4 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6"
            style={{ transitionDelay: '200ms' }}
          >
            <Link
              data-testid="home-cta-projects"
              to="/#projects"
              onClick={(e) => handleNavClick(e, '/#projects')}
              className="group relative inline-flex items-center justify-center border-3 border-black dark:border-white bg-black dark:bg-white px-8 py-3.5 text-base font-bold text-white dark:text-black transition-all duration-200 hover:bg-cyan-400 hover:text-black"
            >
              <span>Ver Projetos</span>
              <Icon name="arrow-right" className="ml-2 text-[1.05rem] transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <Link
              data-testid="home-cta-contact"
              to="/#contact"
              onClick={(e) => handleNavClick(e, '/#contact')}
              className="border-3 border-black dark:border-white bg-white dark:bg-black px-8 py-3.5 font-medium text-black dark:text-white transition-all duration-200 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
            >
              Entrar em Contato
            </Link>
          </div>

          <div
            ref={reveal}
            className="reveal mx-auto mt-10 grid w-full max-w-3xl gap-3 sm:grid-cols-3"
            style={{ transitionDelay: '260ms' }}
          >
            {heroFacts.map((fact) => (
              <div key={fact.label} className="border-2 border-black dark:border-white bg-white/90 dark:bg-black/90 px-4 py-4 text-left">
                <div className="text-lg font-bold text-slate-900 dark:text-white">{fact.value}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  {fact.label}
                </div>
              </div>
            ))}
          </div>

          <div
            ref={reveal}
            className="reveal mt-12 flex items-center justify-center gap-6"
            style={{ transitionDelay: '300ms' }}
          >
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-black dark:text-white transition-colors duration-200 hover:text-cyan-400 dark:hover:text-cyan-400"
              >
                <Icon name={link.icon} className="text-xl" />
                <span className="text-sm font-medium">{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center pb-8">
        <div className="py-4">
          <Link
            to="/#sobre"
            onClick={(e) => handleNavClick(e, '/#sobre')}
            className="text-slate-400 transition-colors hover:text-cyan-400 dark:text-slate-600"
            aria-label="Rolar para baixo"
          >
            <Icon name="chevron-down" className="text-2xl" />
          </Link>
        </div>

        <div ref={reveal} className="reveal-fade w-full max-w-6xl" style={{ transitionDelay: '300ms' }}>
          <h3 data-testid="home-tech-section" className="mb-8 text-center text-sm font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Tecnologias que domino
          </h3>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {technologies.map((tech) => (
              <div
                key={tech.name}
                className="group relative flex items-center gap-3 border-2 border-black dark:border-white bg-zinc-100/80 dark:bg-slate-900/80 px-4 py-4 text-left transition-colors duration-200 hover:border-cyan-400 dark:hover:border-cyan-400"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-black/10 dark:border-white/20 bg-white/90 dark:bg-black/90 p-1.5">
                  <TechIcon name={tech.icon} label={tech.name} className="h-full w-full object-contain" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 md:text-base">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;

