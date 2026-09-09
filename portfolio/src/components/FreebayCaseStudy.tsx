import BackLink from './BackLink';
import FreebayArchitectureDiagram, { type FreebayFlowId } from './FreebayArchitectureDiagram';
import ReadingShell from './ReadingShell';
import SectionTimeline from './SectionTimeline';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useState, type ReactNode } from 'react';
import { useRouteScrollRoot } from '../hooks/useRouteScrollRoot';
import { useReadingSection } from '../hooks/useReadingSection';
import { useLocale } from '../contexts/LocaleContext';
import ReadingNavigation from './ReadingNavigation';
import Icon from './Icon';

const FLOWS: { id: FreebayFlowId; key: string }[] = [
  { id: 'descoberta', key: 'discovery' },
  { id: 'conversa', key: 'conversation' },
  { id: 'compra', key: 'purchase' },
];

const STUDY_SECTIONS: [string, string][] = [
  ['resumo', 'summary'], ['contexto', 'context'], ['papel', 'role'], ['requisitos', 'requirements'],
  ['arquitetura', 'architecture'], ['decisoes', 'decisions'], ['seguranca', 'security'], ['verificacao', 'verification'], ['limites', 'limits'],
];

const STATUS_TAG: Record<'implementado' | 'hardening' | 'planejado', string> = {
  implementado: 'border-emerald-800/40 bg-emerald-700/10 text-emerald-900 dark:border-emerald-200/40 dark:bg-emerald-200/10 dark:text-emerald-200',
  hardening: 'border-amber-800/40 bg-amber-600/10 text-amber-900 dark:border-amber-200/40 dark:bg-amber-200/10 dark:text-amber-200',
  planejado: 'border-[#a1006b]/40 bg-[#a1006b]/10 text-[#73004c] dark:border-fuchsia-200/40 dark:bg-fuchsia-200/10 dark:text-fuchsia-200',
};

const StatusTag = ({ status, children }: { status: keyof typeof STATUS_TAG; children: ReactNode }) => (
  <span className={`inline-block border px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider ${STATUS_TAG[status]}`}>
    {children}
  </span>
);

const sectionClassName = 'reveal mt-12 scroll-mt-28 border-t-2 border-stone-900/15 pt-10 dark:border-stone-100/15';

const FreebayCaseStudy = () => {
  const reveal = useScrollReveal();
  const routeRootRef = useRouteScrollRoot();
  const { activeId, articleRef } = useReadingSection();
  const { t } = useLocale();
  const [activeFlow, setActiveFlow] = useState<FreebayFlowId>('descoberta');
  const flow = FLOWS.find((item) => item.id === activeFlow) ?? FLOWS[0];
  const sections = STUDY_SECTIONS.map(([id, key]) => ({ id, label: t(`freebay.sections.${key}`), depth: 2 }));

  return (
   <main ref={routeRootRef} className="reading-page min-h-screen">
    <SectionTimeline key="freebay-case-study" />
    <div className="w-full px-3 py-10 sm:px-4 lg:px-6">
       <BackLink to="/#projects">{t('freebay.back')}</BackLink>

      <header className="mx-1 border-b-2 border-stone-900/20 pb-8 dark:border-stone-100/20 sm:mx-0">
         <p className="eyebrow inline-flex items-center gap-2"><Icon name="mobile" />{t('freebay.eyebrow')}</p>
        <h1 className="mt-3 font-display text-3xl font-black tracking-tight text-stone-900 dark:text-stone-100 md:text-5xl">
          Freebay
        </h1>
        <p className="mt-3 max-w-3xl text-xl leading-9 text-stone-700 dark:text-stone-300">
           {t('freebay.lead')}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
           <span className="border-2 border-stone-900 bg-stone-900 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-[#faf6ef] dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900">{t('freebay.marketplace')}</span>
          <span className="border border-stone-900/25 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-stone-700 dark:border-stone-100/25 dark:text-stone-300">React · Flutter · NestJS · PostgreSQL</span>
           <span className="border border-[#a1006b]/40 bg-[#a1006b]/10 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-[#73004c] dark:border-fuchsia-200/40 dark:text-fuchsia-200">{t('freebay.noTransaction')}</span>
        </div>
      </header>

       <div className="mt-6 border-2 border-stone-900/25 bg-[#fffdf8] lg:hidden dark:border-stone-100/25 dark:bg-[#131110]">
        <ReadingNavigation sections={sections} activeId={activeId} label={t('freebay.inStudy')} />
      </div>

      <ReadingShell
        sidebarTestId="case-sidebar"
        resizerTestId="case-sidebar-resizer"
        sidebar={
          <div className="border-2 border-stone-900/25 bg-[#fffdf8] dark:border-stone-100/25 dark:bg-[#131110]">
            <details className="sidebar-accordion" open>
              <summary><span className="inline-flex items-center gap-2"><Icon name="server" />{t('freebay.techSheet')}</span></summary>
              <dl className="accordion-body space-y-3 text-sm">
                 <div><dt className="font-mono text-[11px] uppercase tracking-wider text-stone-500 dark:text-stone-400">{t('freebay.roleLabel')}</dt><dd className="mt-1 font-semibold text-stone-900 dark:text-stone-100">{t('freebay.roleValue')}</dd></div>
                 <div><dt className="font-mono text-[11px] uppercase tracking-wider text-stone-500 dark:text-stone-400">{t('freebay.stackLabel')}</dt><dd className="mt-1 font-semibold text-stone-900 dark:text-stone-100">React, Flutter, NestJS, PostgreSQL, Stripe, Socket.IO</dd></div>
                 <div><dt className="font-mono text-[11px] uppercase tracking-wider text-stone-500 dark:text-stone-400">{t('freebay.stateLabel')}</dt><dd className="mt-1 leading-6 text-stone-700 dark:text-stone-300">{t('freebay.stateValue')}</dd></div>
              </dl>
            </details>
            <ReadingNavigation sections={sections} activeId={activeId} label={t('freebay.inStudy')} />
          </div>
        }
      >
        <article
          ref={articleRef}
          data-blog-article
          data-testid="case-article"
          className="min-w-0 flex-1 border-[3px] border-stone-900 bg-[#fffdf8] p-6 dark:border-stone-100 dark:bg-[#131110] md:p-10"
        >
          <section ref={reveal} id="resumo" className="reveal scroll-mt-28 leading-8 text-stone-700 dark:text-stone-300">
             <p className="eyebrow">1 · {t('freebay.sections.summary')}</p>
             <h2 className="mt-2">{t('freebay.summaryTitle')}</h2>
             <p className="mt-4">{t('freebay.summaryText')}</p>
          </section>

          <section ref={reveal} id="contexto" className={sectionClassName}>
            <div className="leading-8 text-stone-700 dark:text-stone-300">
             <p className="eyebrow">2 · {t('freebay.sections.context')}</p>
             <h2 className="mt-2">{t('freebay.contextTitle')}</h2>
             <p className="mt-4">{t('freebay.contextText')}</p>
            </div>
          </section>

          <section ref={reveal} id="papel" className={sectionClassName}>
            <div className="leading-8 text-stone-700 dark:text-stone-300">
             <p className="eyebrow">3 · {t('freebay.sections.role')}</p>
             <h2 className="mt-2">{t('freebay.roleTitle')}</h2>
            <ul className="mt-4 list-disc space-y-3 pl-5">
                <li>{t('freebayExtra.responsibilities.product')}</li><li>{t('freebayExtra.responsibilities.backend')}</li><li>{t('freebayExtra.responsibilities.clients')}</li><li>{t('freebayExtra.responsibilities.data')}</li>
            </ul>
            </div>
          </section>

          <section ref={reveal} id="requisitos" className={sectionClassName}>
            <div className="leading-8 text-stone-700 dark:text-stone-300">
             <p className="eyebrow">4 · {t('freebay.sections.requirements')}</p>
             <h2 className="mt-2">{t('freebay.requirementsTitle')}</h2>
            <div className="article-table-wrap mt-6">
              <table className="article-table">
                 <thead><tr><th scope="col">{t('freebayLabels.capacity')}</th><th scope="col">{t('freebayLabels.state')}</th></tr></thead>
                 <tbody>
                   <tr><td>{t('freebayLabels.requirement1')}</td><td><StatusTag status="implementado">{t('freebayLabels.statusImplemented')} · {t('freebayLabels.statusBase')}</StatusTag></td></tr>
                   <tr><td>{t('freebayLabels.requirement2')}</td><td><StatusTag status="implementado">{t('freebayLabels.statusImplemented')} · {t('freebayLabels.statusBase')}</StatusTag></td></tr>
                   <tr><td>{t('freebayLabels.requirement3')}</td><td><StatusTag status="implementado">{t('freebayLabels.statusImplemented')} · {t('freebayLabels.statusBase')}</StatusTag></td></tr>
                   <tr><td>{t('freebayLabels.requirement4')}</td><td><StatusTag status="hardening">{t('freebayLabels.statusHardening')} · {t('freebayLabels.statusConsistency')}</StatusTag></td></tr>
                   <tr><td>{t('freebayLabels.requirement5')}</td><td><StatusTag status="hardening">{t('freebayLabels.statusHardening')} · {t('freebayLabels.statusLedger')}</StatusTag></td></tr>
                   <tr><td>{t('freebayLabels.requirement6')}</td><td><StatusTag status="hardening">{t('freebayLabels.statusHardening')} · {t('freebayLabels.statusIdempotency')}</StatusTag></td></tr>
                   <tr><td>{t('freebayLabels.requirement7')}</td><td><StatusTag status="hardening">{t('freebayLabels.statusHardening')} · {t('freebayLabels.statusAuthorization')}</StatusTag></td></tr>
                   <tr><td>{t('freebayLabels.requirement8')}</td><td><StatusTag status="planejado">{t('freebayLabels.statusPlanned')} · {t('freebayLabels.statusContract')}</StatusTag></td></tr>
                 </tbody>
               </table>
             </div>
             <p className="mt-4 text-sm leading-7">{t('freebayLabels.nonFunctional')}</p>
            </div>
          </section>

          <section ref={reveal} id="arquitetura" className={sectionClassName}>
            <div className="leading-8 text-stone-700 dark:text-stone-300">
             <p className="eyebrow">5 · {t('freebay.sections.architecture')}</p>
             <h2 className="mt-2">{t('freebay.architectureTitle')}</h2>
             <p className="mt-4 text-sm leading-7">{t('freebay.architectureText')}</p>
             <p className="eyebrow mt-8">{t('freebay.explorer')}</p>
             <h3 className="mt-2 text-lg font-bold text-stone-900 dark:text-stone-100">{t('freebay.followFlow')}</h3>
             <p className="mt-2 text-sm leading-7">{t('freebay.chooseFlow')}</p>
             <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label={t('freebay.flowGroup')}>
              {FLOWS.map((item) => (
                <button key={item.id} type="button" onClick={() => setActiveFlow(item.id)} aria-pressed={activeFlow === item.id} className="freebay-flow-button focus-ring border-2 border-stone-900 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-stone-900 transition-colors duration-200 dark:border-stone-100 dark:text-stone-100">
                    {t(`freebayExtra.flows.${item.key}.label`)}
                </button>
              ))}
            </div>
            <div className="mt-6 border-2 border-stone-900/20 p-5 dark:border-stone-100/20">
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">{t(`freebayExtra.flows.${flow.key}.title`)}</h3>
                <p className="mt-2 text-sm leading-7">{t(`freebayExtra.flows.${flow.key}.description`)}</p>
              <ol className="mt-4 space-y-2">
                 {Array.from({ length: 4 }, (_, index) => (
                    <li key={index} className="flex gap-3 text-sm leading-6"><span className="flex h-6 w-6 shrink-0 items-center justify-center border border-stone-900/30 font-mono text-xs font-bold text-[#73004c] dark:border-stone-100/30 dark:text-fuchsia-200">{index + 1}</span><span>{t(`freebayExtra.flows.${flow.key}.steps.${index}`)}</span></li>
                ))}
              </ol>
            </div>
            <div className="mt-6"><FreebayArchitectureDiagram activeFlow={activeFlow} /></div>
              <p className="mt-4 font-mono text-xs leading-6 text-stone-600 dark:text-stone-400">{t('freebay.altText')} {Array.from({ length: 4 }, (_, index) => t(`freebayExtra.flows.${flow.key}.steps.${index}`)).join(' → ')}.</p>
            </div>
          </section>

          <section ref={reveal} id="decisoes" className={sectionClassName}>
            <div className="leading-8 text-stone-700 dark:text-stone-300">
             <p className="eyebrow">6 · {t('freebay.sections.decisions')}</p>
             <h2 className="mt-2">{t('freebayLabels.decisionsTitle')}</h2>
            <div className="article-table-wrap mt-6">
              <table className="article-table">
                 <thead><tr><th scope="col">{t('freebayLabels.decision')}</th><th scope="col">{t('freebayLabels.alternative')}</th><th scope="col">{t('freebayLabels.justification')}</th></tr></thead>
                <tbody>
                   <tr><td>{t('freebayLabels.decision1')}</td><td>{t('freebayLabels.alternative1')}</td><td>{t('freebayLabels.justification1')}</td></tr>
                   <tr><td>{t('freebayLabels.decision2')}</td><td>{t('freebayLabels.alternative2')}</td><td>{t('freebayLabels.justification2')}</td></tr>
                   <tr><td>{t('freebayLabels.decision3')}</td><td>{t('freebayLabels.alternative3')}</td><td>{t('freebayLabels.justification3')}</td></tr>
                   <tr><td>{t('freebayLabels.decision4')}</td><td>{t('freebayLabels.alternative4')}</td><td>{t('freebayLabels.justification4')}</td></tr>
                   <tr><td>{t('freebayLabels.decision5')}</td><td>{t('freebayLabels.alternative5')}</td><td>{t('freebayLabels.justification5')}</td></tr>
                </tbody>
              </table>
            </div>
            </div>
          </section>

          <section ref={reveal} id="seguranca" className={sectionClassName}>
            <div className="leading-8 text-stone-700 dark:text-stone-300">
             <p className="eyebrow">7 · {t('freebay.sections.security')}</p>
             <h2 className="mt-2">{t('freebayLabels.securityTitle')}</h2>
            <ul className="mt-4 list-disc space-y-3 pl-5">
               <li>{t('freebayLabels.security1')}</li>
               <li>{t('freebayLabels.security2')}</li>
               <li>{t('freebayLabels.security3')}</li>
               <li>{t('freebayLabels.security4')}</li>
            </ul>
            </div>
          </section>

          <section ref={reveal} id="verificacao" className={sectionClassName}>
            <div className="leading-8 text-stone-700 dark:text-stone-300">
             <p className="eyebrow">8 · {t('freebay.sections.verification')}</p>
             <h2 className="mt-2">{t('freebayLabels.verificationTitle')}</h2>
            <ul className="mt-4 list-disc space-y-3 pl-5">
               <li>{t('freebayLabels.verification1')}</li>
               <li>{t('freebayLabels.verification2')}</li>
               <li>{t('freebayLabels.verification3')}</li>
               <li>{t('freebayLabels.verification4')}</li>
               <li>{t('freebayLabels.verification5')}</li>
            </ul>
            </div>
          </section>

          <section ref={reveal} id="limites" className={sectionClassName}>
            <div className="leading-8 text-stone-700 dark:text-stone-300">
             <p className="eyebrow">9 · {t('freebay.sections.limits')}</p>
             <h2 className="mt-2">{t('freebayLabels.limitsTitle')}</h2>
             <p className="mt-4">{t('freebayLabels.limitsText')}</p>
            </div>
          </section>

          <section ref={reveal} className={sectionClassName}>
            <div className="leading-8 text-stone-700 dark:text-stone-300">
             <p className="eyebrow">{t('freebayLabels.resultTitle')}</p>
             <h2 className="mt-2">{t('freebayLabels.resultTitle')}</h2>
             <p className="mt-4">{t('freebayLabels.resultText')}</p>
            </div>
          </section>
        </article>
      </ReadingShell>
    </div>
  </main>
  );
};

export default FreebayCaseStudy;
