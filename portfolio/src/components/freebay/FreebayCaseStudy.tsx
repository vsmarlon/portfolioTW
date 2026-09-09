import BackLink from '../BackLink';
import ReadingShell from '../ReadingShell';
import SectionTimeline from '../SectionTimeline';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useState } from 'react';
import { useRouteScrollRoot } from '../../hooks/useRouteScrollRoot';
import { useReadingSection } from '../../hooks/useReadingSection';
import { useLocale } from '../../contexts/LocaleContext';
import ReadingNavigation from '../ReadingNavigation';
import Icon from '../Icon';
import FreebayFlowExplorer from './FreebayFlowExplorer';
import FreebayRequirementsTable from './FreebayRequirementsTable';
import FreebayDecisionsTable from './FreebayDecisionsTable';
import type { FreebayFlowId } from './FreebayArchitectureDiagram';
import type { Locale } from '../../contexts/LocaleContext';


const STUDY_SECTIONS: [string, string][] = [
  ['resumo', 'summary'],
  ['contexto', 'context'],
  ['papel', 'role'],
  ['requisitos', 'requirements'],
  ['arquitetura', 'architecture'],
  ['decisoes', 'decisions'],
  ['seguranca', 'security'],
  ['verificacao', 'verification'],
  ['limites', 'limits'],
];

const sectionClassName =
  'reveal mt-12 scroll-mt-28 border-t-2 border-stone-900/15 pt-10 dark:border-stone-100/15';

const architectureAnalysis: Record<Locale, {
  title: string;
  layers: string;
  errors: string;
  data: string;
  realtime: string;
  evidenceTitle: string;
  evidenceLead: string;
  videoCaption: string;
  images: { src: string; alt: string; caption: string }[];
}> = {
  'pt-BR': {
    title: 'Análise das decisões arquiteturais',
    layers: 'O projeto usa módulos verticais para manter regras, endpoints e persistência da mesma área no mesmo lugar. No backend, controllers cuidam do HTTP, casos de uso aplicam as regras e repositórios separam o domínio do Prisma. No Flutter, cada feature também é dividida entre dados, domínio e apresentação. Assim, uma regra de pedido não acaba escondida em uma tela ou em um controller.',
    errors: 'Os casos de uso retornam Either<AppError, Output>. Falhas previstas, como saldo insuficiente ou pedido inválido, não são tratadas como erros inesperados do servidor. Interceptadores convertem esse resultado para HTTP e o filtro global mantém o mesmo formato de resposta em toda a API.',
    data: 'PostgreSQL foi escolhido porque usuários, anúncios, pedidos, carteiras e disputas formam um grafo relacional sujeito a invariantes. Valores monetários são representados como inteiros em centavos, evitando ambiguidades de ponto flutuante. Operações de pagamento permanecem atrás de adapters: AbacatePay atende o fluxo PIX e PagBank o repasse, enquanto chaves de idempotência e webhooks protegem a transição entre o estado externo e o ledger interno.',
    realtime: 'Socket.IO reduz a latência percebida em conversas e notificações, mas não constitui a fonte de verdade. As mensagens são persistidas, os participantes são autorizados no servidor e a reconexão deve reconciliar o estado durável. Essa combinação impede que uma conexão transitória determine, sozinha, a existência de uma mensagem ou a situação financeira de um pedido.',
    evidenceTitle: 'Evidências da implementação',
    evidenceLead: 'Estas telas mostram o que já pode ser executado no aplicativo: login, feed, catálogo, detalhe do produto e perfil. Elas registram o estado atual do trabalho, sem representar métricas ou uso em produção.',
    videoCaption: 'Gravação da tela de login no aplicativo Android, sem edição da interface.',
    images: [
      { src: '/freebay-feed-ui.webp', alt: 'Feed social do Freebay', caption: 'Feed: descoberta de anúncios vinculada ao contexto social.' },
      { src: '/freebay-explore-ui.webp', alt: 'Catálogo de produtos do Freebay', caption: 'Explorar: leitura paginada e apresentação consistente de preço.' },
      { src: '/freebay-product-ui.webp', alt: 'Detalhe de produto do Freebay', caption: 'Produto: custódia explicitada antes da intenção de compra.' },
      { src: '/freebay-profile-ui.webp', alt: 'Perfil de vendedor do Freebay', caption: 'Perfil: identidade, reputação e grafo social no mesmo contexto.' },
    ],
  },
  en: {
    title: 'Analysis of architectural decisions',
    layers: 'The project uses vertical modules to keep each area’s rules, endpoints, and persistence together. In the backend, controllers handle HTTP, use cases apply business rules, and repositories separate the domain from Prisma. Flutter features follow the same data, domain, and presentation split. This keeps order rules out of screens and controllers.',
    errors: 'Use cases return Either<AppError, Output>. Expected failures, such as insufficient funds or an invalid order, are not treated as unexpected server errors. Interceptors map the result to HTTP, while the global filter keeps one response format across the API.',
    data: 'PostgreSQL was selected because users, listings, orders, wallets, and disputes form a relational graph governed by invariants. Monetary values are integer cents, avoiding floating-point ambiguity. Payment operations remain behind adapters: AbacatePay serves the PIX flow and PagBank handles payouts, while idempotency keys and webhooks protect transitions between external state and the internal ledger.',
    realtime: 'Socket.IO reduces perceived latency in conversations and notifications, but it is not the source of truth. Messages are persisted, participants are authorized on the server, and reconnection must reconcile durable state. This combination prevents a transient connection from determining, by itself, whether a message exists or the financial status of an order.',
    evidenceTitle: 'Implementation evidence',
    evidenceLead: 'These screens show what can already be run in the application: login, feed, catalog, product detail, and profile. They record the current state of the work, not production metrics or usage.',
    videoCaption: 'Screen recording of the login page running in the Android application, with no interface edits.',
    images: [
      { src: '/freebay-feed-ui.webp', alt: 'Freebay social feed', caption: 'Feed: listing discovery linked to social context.' },
      { src: '/freebay-explore-ui.webp', alt: 'Freebay product catalog', caption: 'Explore: paginated reading and consistent price presentation.' },
      { src: '/freebay-product-ui.webp', alt: 'Freebay product detail', caption: 'Product: escrow made explicit before purchase intent.' },
      { src: '/freebay-profile-ui.webp', alt: 'Freebay seller profile', caption: 'Profile: identity, reputation, and social graph in one context.' },
    ],
  },
};

const FreebayCaseStudy = () => {
  const reveal = useScrollReveal();
  const routeRootRef = useRouteScrollRoot();
  const { activeId, articleRef } = useReadingSection();
  const { locale, t } = useLocale();
  const analysis = architectureAnalysis[locale];
  const [activeFlow, setActiveFlow] = useState<FreebayFlowId>('descoberta');
  const sections = STUDY_SECTIONS.map(([id, key]) => ({
    id,
    label: t(`freebay.sections.${key}`),
    depth: 2,
  }));

  return (
    <main ref={routeRootRef} className="reading-page min-h-screen">
      <SectionTimeline key="freebay-case-study" />
      <div className="w-full px-3 py-10 sm:px-4 lg:px-6">
        <BackLink to="/#projects">{t('freebay.back')}</BackLink>

        <header className="mx-1 border-b-2 border-stone-900/20 pb-8 dark:border-stone-100/20 sm:mx-0">
          <p className="eyebrow inline-flex items-center gap-2">
            <Icon name="mobile" />
            {t('freebay.eyebrow')}
          </p>
          <h1 className="mt-3 font-display text-3xl font-black tracking-tight text-stone-900 dark:text-stone-100 md:text-5xl">
            Freebay
          </h1>
          <p className="mt-3 max-w-3xl text-xl leading-9 text-stone-700 dark:text-stone-300">
            {t('freebay.lead')}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="border-2 border-stone-900 bg-stone-900 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-[#faf6ef] dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900">
              {t('freebay.marketplace')}
            </span>
            <span className="border border-stone-900/25 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-stone-700 dark:border-stone-100/25 dark:text-stone-300">
              React · Flutter · NestJS · PostgreSQL
            </span>
            <span className="border border-[#a1006b]/40 bg-[#a1006b]/10 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-[#73004c] dark:border-fuchsia-200/40 dark:text-fuchsia-200">
              {t('freebay.noTransaction')}
            </span>
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
                <summary>
                  <span className="inline-flex items-center gap-2">
                    <Icon name="server" />
                    {t('freebay.techSheet')}
                  </span>
                </summary>
                <dl className="accordion-body space-y-3 text-sm">
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      {t('freebay.roleLabel')}
                    </dt>
                    <dd className="mt-1 font-semibold text-stone-900 dark:text-stone-100">
                      {t('freebay.roleValue')}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      {t('freebay.stackLabel')}
                    </dt>
                    <dd className="mt-1 font-semibold text-stone-900 dark:text-stone-100">
                      React, Flutter, NestJS, PostgreSQL, Stripe, Socket.IO
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      {t('freebay.stateLabel')}
                    </dt>
                    <dd className="mt-1 leading-6 text-stone-700 dark:text-stone-300">
                      {t('freebay.stateValue')}
                    </dd>
                  </div>
                </dl>
              </details>
              <ReadingNavigation
                sections={sections}
                activeId={activeId}
                label={t('freebay.inStudy')}
              />
            </div>
          }
        >
          <article
            ref={articleRef}
            data-blog-article
            data-testid="case-article"
            className="min-w-0 flex-1 border-[3px] border-stone-900 bg-[#fffdf8] p-6 dark:border-stone-100 dark:bg-[#131110] md:p-10"
          >
            <section
              ref={reveal}
              id="resumo"
              className="reveal scroll-mt-28 leading-8 text-stone-700 dark:text-stone-300"
            >
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
                  <li>{t('freebayExtra.responsibilities.product')}</li>
                  <li>{t('freebayExtra.responsibilities.backend')}</li>
                  <li>{t('freebayExtra.responsibilities.clients')}</li>
                  <li>{t('freebayExtra.responsibilities.data')}</li>
                </ul>
              </div>
            </section>

            <section ref={reveal} id="requisitos" className={sectionClassName}>
              <div className="leading-8 text-stone-700 dark:text-stone-300">
                <p className="eyebrow">4 · {t('freebay.sections.requirements')}</p>
                <h2 className="mt-2">{t('freebay.requirementsTitle')}</h2>
                <FreebayRequirementsTable />
              </div>
            </section>

            <section ref={reveal} id="arquitetura" className={sectionClassName}>
              <div className="leading-8 text-stone-700 dark:text-stone-300">
                <p className="eyebrow">5 · {t('freebay.sections.architecture')}</p>
                <h2 className="mt-2">{t('freebay.architectureTitle')}</h2>
                <p className="mt-4 text-sm leading-7">{t('freebay.architectureText')}</p>
                <FreebayFlowExplorer activeFlow={activeFlow} onSelectFlow={setActiveFlow} />
                <h3 className="mt-10 text-2xl font-bold text-stone-900 dark:text-stone-100">
                  {analysis.title}
                </h3>
                <div className="mt-4 space-y-4 text-sm leading-7">
                  <p>{analysis.layers}</p>
                  <p>{analysis.errors}</p>
                  <p>{analysis.data}</p>
                  <p>{analysis.realtime}</p>
                </div>
                <h3 className="mt-10 text-2xl font-bold text-stone-900 dark:text-stone-100">
                  {analysis.evidenceTitle}
                </h3>
                <p className="mt-4 text-sm leading-7">{analysis.evidenceLead}</p>
                <figure className="mx-auto mt-6 w-full max-w-sm border-2 border-stone-900/20 p-3 dark:border-stone-100/20">
                  <video
                    className="aspect-[50/99] w-full bg-black object-cover"
                    autoPlay
                    controls
                    loop
                    muted
                    playsInline
                    poster="/freebay-login.webp"
                    preload="metadata"
                    aria-label={analysis.videoCaption}
                  >
                    <source src="/freebay-login.mp4" type="video/mp4" />
                  </video>
                  <figcaption className="mt-3 font-mono text-xs leading-5 text-stone-600 dark:text-stone-400">
                    {analysis.videoCaption}
                  </figcaption>
                </figure>
                <div
                  className="mt-6 grid auto-cols-[82%] snap-x snap-mandatory grid-flow-col gap-5 overflow-x-auto pb-3 touch-pan-x sm:auto-cols-[47%] lg:auto-cols-auto lg:snap-none lg:grid-flow-row lg:grid-cols-4 lg:overflow-visible lg:pb-0"
                  role="region"
                  aria-label={analysis.evidenceTitle}
                >
                  {analysis.images.map((image) => (
                    <figure key={image.src} className="snap-center border-2 border-stone-900/20 p-3 dark:border-stone-100/20">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="h-auto w-full"
                        loading="lazy"
                      />
                      <figcaption className="mt-3 font-mono text-xs leading-5 text-stone-600 dark:text-stone-400">
                        {image.caption}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </section>

            <section ref={reveal} id="decisoes" className={sectionClassName}>
              <div className="leading-8 text-stone-700 dark:text-stone-300">
                <p className="eyebrow">6 · {t('freebay.sections.decisions')}</p>
                <h2 className="mt-2">{t('freebayLabels.decisionsTitle')}</h2>
                <FreebayDecisionsTable />
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
