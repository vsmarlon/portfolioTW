import { useId, type CSSProperties } from 'react';

export type FreebayFlowId = 'descoberta' | 'conversa' | 'compra';

const nodes = [
  { id: 'clients', x: 20, y: 100, w: 150, label: 'React + Flutter', sub: 'clientes' },
  { id: 'nestjs', x: 235, y: 100, w: 150, label: 'NestJS', sub: 'serviços' },
  { id: 'auth', x: 450, y: 28, w: 155, label: 'Auth / Social', sub: 'identidade e relações' },
  { id: 'listings', x: 450, y: 100, w: 155, label: 'Listings', sub: 'produto e descoberta' },
  { id: 'db', x: 450, y: 172, w: 155, label: 'PostgreSQL', sub: 'persistência' },
  { id: 'stripe', x: 670, y: 64, w: 145, label: 'Stripe', sub: 'pagamentos' },
  { id: 'socket', x: 670, y: 152, w: 145, label: 'Socket.IO', sub: 'notificações' },
];

const FLOW_NODES: Record<FreebayFlowId, string[]> = {
  descoberta: ['clients', 'nestjs', 'listings', 'db'],
  conversa: ['clients', 'nestjs', 'auth', 'db', 'socket'],
  compra: ['clients', 'nestjs', 'listings', 'db', 'stripe', 'socket'],
};

const FLOW_PATHS = [
  { d: 'M170 128H235', flows: ['descoberta', 'conversa', 'compra'] as FreebayFlowId[] },
  { d: 'M385 128H450', flows: ['descoberta', 'compra'] as FreebayFlowId[] },
  { d: 'M385 128H430V56H450', flows: ['conversa'] as FreebayFlowId[] },
  { d: 'M385 128H430V200H450', flows: ['descoberta', 'conversa', 'compra'] as FreebayFlowId[] },
  { d: 'M385 100H430V92H670', flows: ['compra'] as FreebayFlowId[] },
  { d: 'M605 128H640V180H670', flows: ['conversa', 'compra'] as FreebayFlowId[] },
];

const FreebayArchitectureDiagram = ({ activeFlow = null }: { activeFlow?: FreebayFlowId | null }) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');

  return (
  <figure className="architecture-frame card-interactive" aria-labelledby={`architecture-title-${uid}`} aria-describedby={`architecture-description-${uid}`}>
    <svg viewBox="0 0 835 250" role="img" focusable="false">
      <title id={`architecture-title-${uid}`}>Arquitetura do Freebay</title>
      <desc id={`architecture-description-${uid}`}>Clientes React e Flutter passam pelo NestJS, que direciona o fluxo para autenticação, listagens, PostgreSQL, Stripe e Socket.IO.</desc>
      <defs>
        <marker id={`architecture-arrow-${uid}`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0 0L8 4L0 8Z" fill="#a78bfa" />
        </marker>
      </defs>
      <g className="architecture-paths" aria-hidden="true">
        {FLOW_PATHS.map((path, index) => (
          <path
            key={path.d}
            d={path.d}
            markerEnd={`url(#architecture-arrow-${uid})`}
            className={activeFlow && !path.flows.includes(activeFlow) ? 'is-dim' : undefined}
            style={{ '--i': index } as CSSProperties}
          />
        ))}
      </g>
      {nodes.map((node, index) => {
        const isActive = !activeFlow || FLOW_NODES[activeFlow].includes(node.id);
        return (
        <g key={node.label} transform={`translate(${node.x} ${node.y})`} className="architecture-node-group" style={{ '--i': index } as CSSProperties}>
          <rect width={node.w} height="56" className={`architecture-node${isActive ? ' is-active' : ' is-dim'}`} />
          <text x="16" y="23" className="architecture-label">{node.label}</text>
          <text x="16" y="41" className="architecture-sub">{node.sub}</text>
        </g>
        );
      })}
    </svg>
  </figure>
  );
};

export default FreebayArchitectureDiagram;
