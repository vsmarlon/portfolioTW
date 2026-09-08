import { Link } from 'react-router-dom';
import { projectsData } from '../data/projects';
import { useScrollReveal } from '../hooks/useScrollReveal';
import ExternalMark from './ExternalMark';

const freebayStack = ['React + Flutter', 'NestJS / domínio', 'PostgreSQL / Stripe', 'Socket.IO'];

const Projects = () => {
  const reveal = useScrollReveal();
  const supportingProjects = projectsData.filter((project) => project.title !== 'Freebay');
  return (
    <section id="projects" className="content-section">
      <div className="editorial-container">
        <div ref={reveal} className="reveal section-heading"><p className="eyebrow">Evidência de trabalho</p><h2>Projetos que mostram decisões.</h2><p>Do produto flagship aos experimentos de dados, cada projeto é uma oportunidade de tornar o raciocínio técnico visível.</p></div>
        <article ref={reveal} className="reveal freebay-flagship card-interactive mt-10 grid gap-8 border-[3px] border-stone-900 bg-[#fffdf8] p-5 dark:border-stone-100 dark:bg-[#131110] md:grid-cols-[1.15fr_0.85fr] md:p-8">
           <div className="flex min-h-64 flex-col justify-between border-b-2 border-stone-900/20 p-6 dark:border-stone-100/20 md:border-b-0 md:border-r"><div><p className="eyebrow">Flagship · comércio social</p><h3 className="mt-4 font-display text-4xl font-black text-stone-900 dark:text-stone-100">Freebay</h3><p className="mt-4 max-w-xl leading-7 text-stone-700 dark:text-stone-300">Produto full stack que combina descoberta de listagens, relações sociais, pagamentos e notificações em uma jornada coerente.</p><div className="mt-5 flex flex-wrap gap-2">{['React', 'Flutter', 'NestJS', 'PostgreSQL'].map((tool) => <span key={tool} className="border border-stone-900/20 px-2 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:border-stone-100/20 dark:text-stone-300">{tool}</span>)}</div></div><Link to="/projects/freebay" className="focus-ring mt-8 inline-flex w-fit items-center gap-2 border-2 border-stone-900 bg-stone-900 px-4 py-3 text-sm font-bold text-[#faf6ef] transition-all duration-200 hover:bg-[#a1006b] hover:border-[#73004c] dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-[#ec7cc3] dark:hover:border-[#ec7cc3]">Ler estudo de caso →</Link></div>
           <div className="flex items-center justify-center p-6"><div className="grid w-full max-w-sm gap-2 font-mono text-xs uppercase tracking-[0.16em] text-stone-800 dark:text-stone-200">{freebayStack.map((item, index) => <span key={item} className="freebay-stack-item border-2 border-stone-900/20 bg-white/60 p-3 dark:border-stone-100/20 dark:bg-white/[0.03]" style={{ marginLeft: `${index * 2}rem` }}>{item}</span>)}</div></div>
        </article>
         <div className="mt-10 grid gap-4">
           {supportingProjects.map((project, index) => <div key={project.title} ref={reveal} className="reveal" style={{ transitionDelay: `${Math.min(index, 4) * 80}ms` }}><a href={project.url} target="_blank" rel="noopener noreferrer" className="card-interactive focus-ring grid gap-4 border-2 border-stone-900/20 bg-[#fffdf8]/60 p-5 dark:border-stone-100/20 dark:bg-white/[0.02] md:grid-cols-[1fr_auto] md:items-center"><div><p className="eyebrow">{project.eyebrow}</p><h3 className="mt-2 text-xl font-bold text-stone-900 dark:text-stone-100">{project.title}</h3><p className="mt-2 max-w-3xl text-sm leading-6 text-stone-700 dark:text-stone-300">{project.description}</p>{project.details ? <ul className="mt-3 space-y-1.5">{project.details.slice(0, 2).map((detail) => <li key={detail} className="text-xs leading-5 text-stone-600 dark:text-stone-400">· {detail}</li>)}</ul> : null}</div><span className="inline-flex items-center gap-1.5 font-mono text-xs text-stone-600 dark:text-stone-400">{project.tools.join(' · ')}{project.url.startsWith('http') ? <ExternalMark /> : null}</span></a></div>)}
        </div>
      </div>
    </section>
  );
};

export default Projects;
