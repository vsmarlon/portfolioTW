import { useCallback, type ReactNode } from 'react';
import './Resume.css';
import en from '../locales/resume-en.json';
import ptBR from '../locales/resume-pt-BR.json';
import { resumeFacts, type ResumeLocale } from '../data/resume';
import ExternalMark from './ExternalMark';

type ResumeCopy = typeof en;

const copies: Record<ResumeLocale, ResumeCopy> = { en, 'pt-BR': ptBR };

type ResumeProps = {
  locale: ResumeLocale;
};

const ResumeSection = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="resume__section">
    <h2>{title}</h2>
    {children}
  </section>
);

const Resume = ({ locale }: ResumeProps) => {
  const copy = copies[locale];
  const pdfName = `Marlon-Vargas-${locale}.pdf`;
  const rootRef = useCallback((node: HTMLElement | null) => {
    if (!node) return;

    const previousLang = document.documentElement.lang;
    const previousTitle = document.title;
    document.documentElement.lang = locale;
    document.title = copy.meta.title;

    return () => {
      document.documentElement.lang = previousLang;
      document.title = previousTitle;
    };
  }, [copy.meta.title, locale]);

  return (
    <main ref={rootRef} className="resume" data-testid="resume-ready" lang={locale}>
      <nav className="resume__toolbar" aria-label={copy.toolbar.ariaLabel}>
        <a href={`/cv/${locale === 'en' ? 'pt-BR' : 'en'}`}>
          {copy.toolbar.switchLanguage}
        </a>
        <button type="button" onClick={() => window.print()}>{copy.toolbar.print}</button>
        <a href={`/cv/${pdfName}`} target="_blank" rel="noopener noreferrer">
          {copy.toolbar.viewPdf} <ExternalMark />
        </a>
      </nav>

      <header className="resume__header">
        <div>
          <p className="resume__eyebrow">{copy.meta.role}</p>
          <h1>{resumeFacts.name}</h1>
        </div>
        <address className="resume__contact">
          <a href={`tel:${resumeFacts.phone.replace(/ /g, '')}`}>{resumeFacts.phone}</a>
          <a href={`mailto:${resumeFacts.email}`}>{resumeFacts.email}</a>
          <span>{copy.meta.location}</span>
          <a href={resumeFacts.github} target="_blank" rel="noopener noreferrer">{copy.labels.github}: vsmarlon <ExternalMark /></a>
          <a href={resumeFacts.linkedin} target="_blank" rel="noopener noreferrer">{copy.labels.linkedin}: marlon-vargas <ExternalMark /></a>
          <a href={resumeFacts.portfolio} target="_blank" rel="noopener noreferrer">{copy.labels.portfolio}: portfolio-tw-theta <ExternalMark /></a>
        </address>
      </header>

      <ResumeSection title={copy.sections.summary}>
        <p>{copy.summary}</p>
      </ResumeSection>

      <ResumeSection title={copy.sections.experience}>
        <div className="resume__entry">
          <div className="resume__entry-heading">
            <h3>{copy.experience.title} · {resumeFacts.company}</h3>
            <p>{copy.experience.period}</p>
          </div>
          <ul>{copy.experience.items.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </ResumeSection>

      <ResumeSection title={copy.sections.projects}>
        <div className="resume__projects">
          {copy.projects.map((project) => (
            <div className="resume__entry" key={project.name}>
              <div className="resume__entry-heading">
                <h3>{project.name}</h3>
                {project.period && <p>{project.period}</p>}
              </div>
              <p><strong>{copy.labels.technologies}:</strong> {project.technologies}</p>
              <ul>{project.description.map((item) => <li key={item}>{item}</li>)}</ul>
              <a href={project.link} target="_blank" rel="noopener noreferrer">
                {project.link.replace('https://github.com/', 'github.com/')} <ExternalMark />
              </a>
            </div>
          ))}
        </div>
      </ResumeSection>

      <ResumeSection title={copy.sections.education}>
        <div className="resume__entry">
          <div className="resume__entry-heading">
            <h3>{copy.meta.education}</h3>
            <p>{copy.education.period}</p>
          </div>
          <p>{resumeFacts.university}</p>
          <p>{copy.labels.expected}: {copy.education.expected}</p>
        </div>
      </ResumeSection>

      <ResumeSection title={copy.sections.skills}>
        <p><strong>{copy.labels.languages}:</strong> {copy.skills.languages}</p>
        <p><strong>{copy.labels.technologies}:</strong> {copy.skills.technologies}</p>
        <p><strong>{copy.labels.tools}:</strong> {copy.skills.tools}</p>
      </ResumeSection>
    </main>
  );
};

export default Resume;
