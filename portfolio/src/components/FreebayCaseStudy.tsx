import BackLink from './BackLink';
import FreebayArchitectureDiagram, { type FreebayFlowId } from './FreebayArchitectureDiagram';
import ReadingShell from './ReadingShell';
import SectionTimeline from './SectionTimeline';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useState } from 'react';

const FLOWS: { id: FreebayFlowId; label: string; title: string; description: string; steps: string[] }[] = [
  {
    id: 'descoberta',
    label: 'Descoberta',
    title: 'Descobrir sem perder o contexto',
    description: 'Feed, busca e listagens passam pelos mesmos contratos do backend. O cliente não decide regra de visibilidade ou preço.',
    steps: ['Cliente pede feed/busca', 'NestJS valida e consulta Listings', 'PostgreSQL retorna projeção consistente', 'Cliente renderiza sem regra local'],
  },
  {
    id: 'conversa',
    label: 'Conversa',
    title: 'Conversar com identidade e histórico',
    description: 'Chat carrega contexto do produto e das pessoas. Socket.IO notifica; o estado canônico continua no domínio.',
    steps: ['Cliente abre conversa do anúncio', 'Auth/Social resolve identidade e relação', 'Mensagens persistem com paginação', 'Socket.IO avisa em tempo real'],
  },
  {
    id: 'compra',
    label: 'Compra',
    title: 'Comprar com transação explicável',
    description: 'Carrinho, pedido, pagamento e entrega são estados separados. Stripe fica isolado como integração; payout e reembolso exigem hardening antes de produção.',
    steps: ['Carrinho vira pedido com grupos por vendedor', 'Pagamento único com rastreio por pedido', 'Entrega libera repasse; disputa congela', 'Reembolso reverte e revoga acesso digital'],
  },
];

const STUDY_SECTIONS: [string, string][] = [
  ['resumo', 'Resumo'],
  ['contexto', 'Contexto'],
  ['papel', 'Papel'],
  ['requisitos', 'Requisitos'],
  ['arquitetura', 'Arquitetura'],
  ['decisoes', 'Decisões'],
  ['seguranca', 'Segurança'],
  ['verificacao', 'Verificação'],
  ['limites', 'Limites'],
];

const STATUS_TAG: Record<'implementado' | 'hardening' | 'planejado', string> = {
  implementado: 'border-emerald-800/40 bg-emerald-700/10 text-emerald-900 dark:border-emerald-200/40 dark:bg-emerald-200/10 dark:text-emerald-200',
  hardening: 'border-amber-800/40 bg-amber-600/10 text-amber-900 dark:border-amber-200/40 dark:bg-amber-200/10 dark:text-amber-200',
  planejado: 'border-[#a1006b]/40 bg-[#a1006b]/10 text-[#73004c] dark:border-fuchsia-200/40 dark:bg-fuchsia-200/10 dark:text-fuchsia-200',
};

const StatusTag = ({ status, children }: { status: keyof typeof STATUS_TAG; children: string }) => (
  <span className={`inline-block border px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider ${STATUS_TAG[status]}`}>
    {status}{children ? ` · ${children}` : ''}
  </span>
);

const sectionClassName = 'reveal mt-12 scroll-mt-28 border-t-2 border-stone-900/15 pt-10 dark:border-stone-100/15';

const FreebayCaseStudy = () => {
  const reveal = useScrollReveal();
  const [activeFlow, setActiveFlow] = useState<FreebayFlowId>('descoberta');
  const flow = FLOWS.find((item) => item.id === activeFlow) ?? FLOWS[0];

  return (
  <main className="min-h-screen pt-20">
    <SectionTimeline key="freebay-case-study" />
    <div className="w-full px-3 py-10 sm:px-4 lg:px-6">
      <BackLink to="/#projects">Voltar aos projetos</BackLink>

      <header className="mx-1 border-b-2 border-stone-900/20 pb-8 dark:border-stone-100/20 sm:mx-0">
        <p className="eyebrow">Estudo de caso · produto flagship</p>
        <h1 className="mt-3 font-display text-3xl font-black tracking-tight text-stone-900 dark:text-stone-100 md:text-5xl">
          Freebay
        </h1>
        <p className="mt-3 max-w-3xl text-xl leading-9 text-stone-700 dark:text-stone-300">
          Uma experiência de comércio social pensada para aproximar descoberta, relacionamento e transação em um mesmo sistema.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="border-2 border-stone-900 bg-stone-900 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-[#faf6ef] dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900">Marketplace C2C</span>
          <span className="border border-stone-900/25 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-stone-700 dark:border-stone-100/25 dark:text-stone-300">React · Flutter · NestJS · PostgreSQL</span>
          <span className="border border-[#a1006b]/40 bg-[#a1006b]/10 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-[#73004c] dark:border-fuchsia-200/40 dark:text-fuchsia-200">Demonstração sem transação real</span>
        </div>
      </header>

      <nav aria-label="Neste estudo" className="mt-6 lg:hidden">
        <div className="flex flex-wrap gap-2">
          {STUDY_SECTIONS.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="focus-ring border border-stone-900/25 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-stone-700 dark:border-stone-100/25 dark:text-stone-300">
              {label}
            </a>
          ))}
        </div>
      </nav>

      <ReadingShell
        sidebarTestId="case-sidebar"
        resizerTestId="case-sidebar-resizer"
        sidebar={
          <div className="border-2 border-stone-900/25 bg-[#fffdf8] dark:border-stone-100/25 dark:bg-[#131110]">
            <div className="border-b border-stone-900/15 p-5 dark:border-stone-100/15">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[#73004c] dark:text-fuchsia-200">
                Ficha técnica
              </p>
              <dl className="mt-4 space-y-3 text-sm">
                <div><dt className="font-mono text-[11px] uppercase tracking-wider text-stone-500 dark:text-stone-400">Papel</dt><dd className="mt-1 font-semibold text-stone-900 dark:text-stone-100">Full Stack · arquitetura e produto</dd></div>
                <div><dt className="font-mono text-[11px] uppercase tracking-wider text-stone-500 dark:text-stone-400">Stack</dt><dd className="mt-1 font-semibold text-stone-900 dark:text-stone-100">React, Flutter, NestJS, PostgreSQL, Stripe, Socket.IO</dd></div>
                <div><dt className="font-mono text-[11px] uppercase tracking-wider text-stone-500 dark:text-stone-400">Estado</dt><dd className="mt-1 leading-6 text-stone-700 dark:text-stone-300">Base implementada. Pagamentos e mídia em hardening. Web planejada.</dd></div>
              </dl>
            </div>
            <nav aria-label="Neste estudo" className="p-5">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
                Neste estudo
              </p>
              <ul className="mt-3 space-y-1 font-mono text-xs uppercase tracking-wider">
                {STUDY_SECTIONS.map(([id, label], index) => (
                  <li key={id}>
                    <a href={`#${id}`} className="focus-ring block px-3 py-2 text-stone-600 hover:bg-[#a1006b]/10 hover:text-[#a1006b] dark:text-stone-300 dark:hover:bg-fuchsia-200/10 dark:hover:text-fuchsia-200">
                      {index + 1}. {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        }
      >
        <article
          data-blog-article
          data-testid="case-article"
          className="min-w-0 flex-1 border-[3px] border-stone-900 bg-[#fffdf8] p-6 dark:border-stone-100 dark:bg-[#131110] md:p-10"
        >
          <section ref={reveal} id="resumo" className="reveal scroll-mt-28 leading-8 text-stone-700 dark:text-stone-300">
            <p className="eyebrow">1 · Resumo</p>
            <h2 className="mt-2">O problema em uma página</h2>
            <p className="mt-4">Marketplaces classificam anúncios; redes sociais classificam pessoas. O Freebay une os dois. A descoberta parte do contexto social (quem vende, quem comprou, quem recomenda) e termina em uma transação rastreável, sem que o comprador perca o fio da conversa. O desafio de engenharia é sustentar essa jornada com fronteiras simples: clientes finos, domínio autoritativo no backend e integrações isoladas.</p>
          </section>

          <section ref={reveal} id="contexto" className={sectionClassName}>
            <div className="leading-8 text-stone-700 dark:text-stone-300">
            <p className="eyebrow">2 · Contexto e problema</p>
            <h2 className="mt-2">Por que comércio social é difícil</h2>
            <p className="mt-4">Em um classificado tradicional, a transação é pontual e o contexto se perde no chat. Em uma rede social, há contexto de sobra e nenhuma transação confiável. O Freebay trata descoberta, relacionamento e transação como um único sistema: o anúncio carrega vendedor, histórico e reputação; a conversa carrega o anúncio; o pedido carrega a conversa. Cada passagem de contexto elimina uma decisão ambígua, e cada decisão ambígua eliminada é uma disputa a menos.</p>
            </div>
          </section>

          <section ref={reveal} id="papel" className={sectionClassName}>
            <div className="leading-8 text-stone-700 dark:text-stone-300">
            <p className="eyebrow">3 · Papel e responsabilidades</p>
            <h2 className="mt-2">Atuação full stack</h2>
            <ul className="mt-4 list-disc space-y-3 pl-5">
              <li><strong>Arquitetura do produto:</strong> definição de fronteiras entre clientes, serviços de domínio e integrações externas.</li>
              <li><strong>Backend NestJS:</strong> modelagem de domínio, casos de uso, validação, autenticação e orquestração de pagamentos e notificações.</li>
              <li><strong>Clientes React e Flutter:</strong> contratos compartilhados com o backend, sem duplicar regra de negócio na interface.</li>
              <li><strong>Dados:</strong> esquema relacional no PostgreSQL, com ownership explícito por agregado.</li>
            </ul>
            </div>
          </section>

          <section ref={reveal} id="requisitos" className={sectionClassName}>
            <div className="leading-8 text-stone-700 dark:text-stone-300">
            <p className="eyebrow">4 · Requisitos</p>
            <h2 className="mt-2">Escopo funcional e técnico</h2>
            <div className="article-table-wrap mt-6">
              <table className="article-table">
                <thead><tr><th scope="col">Capacidade</th><th scope="col">Estado</th></tr></thead>
                <tbody>
                  <tr><td>Catálogo, busca e detalhe de anúncios</td><td><StatusTag status="implementado">base</StatusTag></td></tr>
                  <tr><td>Perfis, seguir e sinais sociais</td><td><StatusTag status="implementado">base</StatusTag></td></tr>
                  <tr><td>Chat com contexto do anúncio</td><td><StatusTag status="implementado">base</StatusTag></td></tr>
                  <tr><td>Carrinho e pedidos multivendedor</td><td><StatusTag status="hardening">consistência</StatusTag></td></tr>
                  <tr><td>Checkout com Stripe Connect</td><td><StatusTag status="hardening">ledger</StatusTag></td></tr>
                  <tr><td>Payouts, reembolsos e disputas</td><td><StatusTag status="hardening">idempotência</StatusTag></td></tr>
                  <tr><td>Mídia privada e entrega digital</td><td><StatusTag status="hardening">autorização</StatusTag></td></tr>
                  <tr><td>Marketplace web completo</td><td><StatusTag status="planejado">contrato definido</StatusTag></td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm leading-7">Requisitos não funcionais: autorização por recurso, webhooks idempotentes, transições de dinheiro registradas em ledger imutável, e nenhuma capacidade marcada como pronta antes de teste de concorrência e replay.</p>
            </div>
          </section>

          <section ref={reveal} id="arquitetura" className={sectionClassName}>
            <div className="leading-8 text-stone-700 dark:text-stone-300">
            <p className="eyebrow">5 · Arquitetura</p>
            <h2 className="mt-2">Fronteiras que explicam o produto</h2>
            <p className="mt-4 text-sm leading-7">A arquitetura separa clientes, serviços de domínio e integrações externas. Isso deixa autenticação, listagens, pagamentos e notificações evoluírem sem transformar a interface em dona das regras.</p>
            <p className="eyebrow mt-8">Explorador interativo</p>
            <h3 className="mt-2 text-lg font-bold text-stone-900 dark:text-stone-100">Siga um fluxo no diagrama</h3>
            <p className="mt-2 text-sm leading-7">Escolha descoberta, conversa ou compra. O diagrama destaca os componentes envolvidos e o passo a passo mostra quem decide cada regra.</p>
            <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Fluxos do Freebay">
              {FLOWS.map((item) => (
                <button key={item.id} type="button" onClick={() => setActiveFlow(item.id)} aria-pressed={activeFlow === item.id} className="freebay-flow-button focus-ring border-2 border-stone-900 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-stone-900 transition-colors duration-200 dark:border-stone-100 dark:text-stone-100">
                  {item.label}
                </button>
              ))}
            </div>
            <div className="mt-6 border-2 border-stone-900/20 p-5 dark:border-stone-100/20">
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">{flow.title}</h3>
              <p className="mt-2 text-sm leading-7">{flow.description}</p>
              <ol className="mt-4 space-y-2">
                {flow.steps.map((step, index) => (
                  <li key={step} className="flex gap-3 text-sm leading-6"><span className="flex h-6 w-6 shrink-0 items-center justify-center border border-stone-900/30 font-mono text-xs font-bold text-[#73004c] dark:border-stone-100/30 dark:text-fuchsia-200">{index + 1}</span><span>{step}</span></li>
                ))}
              </ol>
            </div>
            <div className="mt-6"><FreebayArchitectureDiagram activeFlow={activeFlow} /></div>
            <p className="mt-4 font-mono text-xs leading-6 text-stone-600 dark:text-stone-400">Texto alternativo: {flow.steps.join(' → ')}. Conteúdo integral disponível acima sem depender de cor ou hover.</p>
            </div>
          </section>

          <section ref={reveal} id="decisoes" className={sectionClassName}>
            <div className="leading-8 text-stone-700 dark:text-stone-300">
            <p className="eyebrow">6 · Decisões e trade-offs</p>
            <h2 className="mt-2">Escolhas registradas, não preferências</h2>
            <div className="article-table-wrap mt-6">
              <table className="article-table">
                <thead><tr><th scope="col">Decisão</th><th scope="col">Alternativa</th><th scope="col">Justificativa</th></tr></thead>
                <tbody>
                  <tr><td>Monolito modular NestJS</td><td>Microsserviços por domínio</td><td>Transações e consistência locais enquanto o domínio ainda se move; extração quando uma fronteira estabilizar.</td></tr>
                  <tr><td>PostgreSQL relacional</td><td>Modelo documental flexível</td><td>Pedidos, pagamentos e entitlements exigem invariantes e integridade referencial auditável.</td></tr>
                  <tr><td>Stripe Connect isolado</td><td>Split embutido no checkout</td><td>Repasse, disputa e reembolso têm ciclo de vida próprio e não podem travar a compra.</td></tr>
                  <tr><td>Socket.IO para realtime</td><td>Polling periódico</td><td>Chat e notificações pedem latência baixa; o estado canônico permanece persistido no domínio.</td></tr>
                  <tr><td>Contratos compartilhados</td><td>Lógica espelhada nos clientes</td><td>React e Flutter consomem as mesmas regras do backend; divergência vira bug de dinheiro.</td></tr>
                </tbody>
              </table>
            </div>
            </div>
          </section>

          <section ref={reveal} id="seguranca" className={sectionClassName}>
            <div className="leading-8 text-stone-700 dark:text-stone-300">
            <p className="eyebrow">7 · Segurança</p>
            <h2 className="mt-2">Confiança como requisito</h2>
            <ul className="mt-4 list-disc space-y-3 pl-5">
              <li>Validação de entrada por DTO em todas as fronteiras HTTP; backend é autoridade sobre preço, estoque e estado do pedido.</li>
              <li>Autorização por recurso: vendedor, comprador e mediador enxergam apenas o que o seu papel permite.</li>
              <li>Webhooks do provedor de pagamento verificados por assinatura e processados com idempotência.</li>
              <li>Mídia paga servida por endpoint com autorização; a janela de tolerância atual está documentada como item de hardening rumo a URLs assinadas de uso único.</li>
            </ul>
            </div>
          </section>

          <section ref={reveal} id="verificacao" className={sectionClassName}>
            <div className="leading-8 text-stone-700 dark:text-stone-300">
            <p className="eyebrow">8 · Verificação</p>
            <h2 className="mt-2">Critérios antes de produção</h2>
            <ul className="mt-4 list-disc space-y-3 pl-5">
              <li>Checkout multivendedor com um pagamento do comprador e pedidos independentes por vendedor, sem reserva órfã.</li>
              <li>Replay de webhooks sem débito ou crédito duplicado.</li>
              <li>Consumo concorrente de credenciais de uso único com exatamente um vencedor.</li>
              <li>Reembolso que reverte repasse e revoga acesso digital correspondente.</li>
              <li>Nenhum ativo pago acessível por enumeração pública de URLs.</li>
            </ul>
            </div>
          </section>

          <section ref={reveal} id="limites" className={sectionClassName}>
            <div className="leading-8 text-stone-700 dark:text-stone-300">
            <p className="eyebrow">9 · Limites e próximos passos</p>
            <h2 className="mt-2">O que este estudo não afirma</h2>
            <p className="mt-4">Não há métricas de produção, porque não há produção: payouts, disputas e mídia de uso único seguem em hardening, o cliente web está em construção e os domínios ainda serão adquiridos. Os próximos passos, nesta ordem e sem atalhos: concluir o ledger financeiro com testes de concorrência, fechar a autorização de mídia privada, construir o marketplace web sobre os mesmos contratos e só então publicar.</p>
            </div>
          </section>

          <section ref={reveal} className={sectionClassName}>
            <div className="leading-8 text-stone-700 dark:text-stone-300">
            <p className="eyebrow">Resultado</p>
            <h2 className="mt-2">Base apresentável, promessa contida</h2>
            <p className="mt-4">O principal resultado é uma base full stack apresentável: o produto pode ser lido pela experiência e também pela estrutura que a torna possível, sem métricas inventadas ou promessas além da evidência.</p>
            </div>
          </section>
        </article>
      </ReadingShell>
    </div>
  </main>
  );
};

export default FreebayCaseStudy;
