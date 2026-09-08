import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import FreebayArchitectureDiagram from './FreebayArchitectureDiagram';

const EngineeringSystems = () => {
  const reveal = useScrollReveal();

  return (
    <section id="systems" className="content-section">
      <div ref={reveal} className="reveal editorial-container">
        <div className="section-heading">
          <p className="eyebrow">Sistemas de Engenharia</p>
          <h2>Arquitetura que explica o produto.</h2>
          <p>Conecto clientes web e mobile a serviços bem delimitados, dados consistentes e integrações que permanecem legíveis quando o produto cresce.</p>
        </div>
        <FreebayArchitectureDiagram />
        <p className="mt-4 font-mono text-xs leading-6 text-stone-600 dark:text-stone-400">
          O pulso percorre as arestas na ordem dos casos de uso: cliente → NestJS → domínio → persistência e integrações. Cada fluxo pode ser isolado no estudo de caso.
          <Link to="/projects/freebay" className="focus-ring ml-2 font-bold text-[#73004c] underline underline-offset-4 dark:text-fuchsia-200">Abrir estudo de caso →</Link>
        </p>
        <div className="mt-8 grid gap-4 border-t-2 border-stone-900/20 pt-6 dark:border-stone-100/20 md:grid-cols-3">
          <p className="card-interactive border-2 border-stone-900/15 p-5 dark:border-stone-100/15"><strong>Interfaces:</strong> React/TypeScript e Flutter compartilham contratos claros com o backend.</p>
          <p className="card-interactive border-2 border-stone-900/15 p-5 dark:border-stone-100/15"><strong>Domínio:</strong> NestJS organiza autenticação, social commerce e regras de listagem.</p>
          <p className="card-interactive border-2 border-stone-900/15 p-5 dark:border-stone-100/15"><strong>Dados:</strong> PostgreSQL, Oracle e eventos são escolhidos pelo tipo de consistência exigida.</p>
        </div>
      </div>
    </section>
  );
};

export default EngineeringSystems;
