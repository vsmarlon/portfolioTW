import { Link } from 'react-router-dom';
import { heroFacts } from '../data/home';
import { useNavigateToSection } from '../hooks/useNavigateToSection';
import { useScrollReveal } from '../hooks/useScrollReveal';
import Icon from './Icon';
import { useLocale } from '../contexts/LocaleContext';
import { resumeLinks } from '../data/resumeLinks';
import ExternalMark from './ExternalMark';

const Home = () => {
  const navigateToSection = useNavigateToSection();
  const reveal = useScrollReveal();
  const { t, locale } = useLocale();

  return (
    <section id="home" className="flex min-h-dvh flex-col justify-center px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div ref={reveal} className="reveal editorial-container w-full">
        <p className="eyebrow">{t('home.eyebrow')}</p>
        <h1 className="mt-6 max-w-5xl font-display text-4xl font-black leading-[0.95] tracking-tight text-stone-900 dark:text-stone-100 sm:text-6xl lg:text-8xl">
          {t('home.title')}
        </h1>
        <p className="mt-8 max-w-3xl text-xl leading-9 text-stone-800 dark:text-stone-200 sm:text-2xl">
          {t('home.lead')}
        </p>
        <p className="mt-5 max-w-2xl leading-8 text-stone-600 dark:text-stone-300">
          {t('home.description')}
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <Link
            data-testid="home-cta-projects"
            to="/#projects"
            onClick={(event) => navigateToSection(event, '/#projects')}
            className="focus-ring inline-flex items-center gap-2 border-2 border-stone-900 bg-[#a1006b] px-5 py-3 font-bold text-[#fff7fb] transition-all duration-200 hover:bg-stone-900 dark:border-stone-100 dark:bg-[#ec7cc3] dark:text-[#1c0a14] dark:hover:bg-stone-100"
          >
            {t('home.projects')} <Icon name="arrow-right" />
          </Link>
          <a
            href={resumeLinks[locale]}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex items-center gap-2 border-2 border-stone-900/25 px-5 py-3 font-semibold text-stone-900 transition-all duration-200 hover:border-[#a1006b] hover:text-[#a1006b] dark:border-stone-100/25 dark:text-stone-100 dark:hover:border-fuchsia-200 dark:hover:text-fuchsia-200"
          >
            {t('home.resume')} <ExternalMark />
          </a>
          <Link
            data-testid="home-cta-contact"
            to="/#contact"
            onClick={(event) => navigateToSection(event, '/#contact')}
            className="focus-ring inline-flex items-center gap-2 border-2 border-stone-900/25 px-5 py-3 font-semibold text-stone-900 transition-all duration-200 hover:border-[#a1006b] hover:text-[#a1006b] dark:border-stone-100/25 dark:text-stone-100 dark:hover:border-fuchsia-200 dark:hover:text-fuchsia-200"
          >
            {t('home.contact')}
          </Link>
        </div>

        <div className="mt-14 grid max-w-4xl border-y-2 border-stone-900/20 dark:border-stone-100/20 sm:grid-cols-3">
          {heroFacts.map((fact) => (
            <div
              key={fact.label}
              className="card-interactive border-b border-stone-900/15 py-4 last:border-0 dark:border-stone-100/15 sm:border-b-0 sm:border-r sm:px-5 sm:first:pl-0 sm:last:border-0"
            >
              <strong className="block text-sm text-stone-900 dark:text-stone-100">{fact.value}</strong>
              <span className="mt-1 block font-mono text-xs uppercase tracking-[0.16em] text-stone-600 dark:text-stone-400">
                {t(`home.facts.${fact.label}`)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
