import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import FreebayArchitectureDiagram from './freebay/FreebayArchitectureDiagram';

import { useLocale } from '../contexts/LocaleContext';

const EngineeringSystems = () => {
  const reveal = useScrollReveal();
  const { t } = useLocale();

  return (
    <section id="systems" className="content-section">
      <div ref={reveal} className="reveal editorial-container">
        <div className="section-heading">
           <p className="eyebrow">{t('systems.eyebrow')}</p>
           <h2>{t('systems.title')}</h2>
           <p>{t('systems.description')}</p>
        </div>
        <FreebayArchitectureDiagram />
        <p className="mt-4 font-mono text-xs leading-6 text-stone-600 dark:text-stone-400">
          O pulso percorre as arestas na ordem dos casos de uso: cliente → NestJS → domínio → persistência e integrações. Cada fluxo pode ser isolado no estudo de caso.
           <Link to="/projects/freebay" className="focus-ring ml-2 font-bold text-[#73004c] underline underline-offset-4 dark:text-fuchsia-200">{t('systems.caseStudy')}</Link>
        </p>
        <div className="mt-8 grid gap-4 border-t-2 border-stone-900/20 pt-6 dark:border-stone-100/20 md:grid-cols-3">
           <p className="card-interactive border-2 border-stone-900/15 p-5 dark:border-stone-100/15"><strong>{t('systems.interfaces')}:</strong> {t('systems.interfacesText')}</p>
           <p className="card-interactive border-2 border-stone-900/15 p-5 dark:border-stone-100/15"><strong>{t('systems.domain')}:</strong> {t('systems.domainText')}</p>
           <p className="card-interactive border-2 border-stone-900/15 p-5 dark:border-stone-100/15"><strong>{t('systems.data')}:</strong> {t('systems.dataText')}</p>
        </div>
      </div>
    </section>
  );
};

export default EngineeringSystems;
