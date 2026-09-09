import FreebayArchitectureDiagram, { type FreebayFlowId } from './FreebayArchitectureDiagram';

import { useLocale } from '../../contexts/LocaleContext';

export const FLOWS: { id: FreebayFlowId; key: string }[] = [
  { id: 'descoberta', key: 'discovery' },
  { id: 'conversa', key: 'conversation' },
  { id: 'compra', key: 'purchase' },
];

export interface FreebayFlowExplorerProps {
  activeFlow: FreebayFlowId;
  onSelectFlow: (id: FreebayFlowId) => void;
}

export const FreebayFlowExplorer = ({ activeFlow, onSelectFlow }: FreebayFlowExplorerProps) => {
  const { t } = useLocale();
  const flow = FLOWS.find((item) => item.id === activeFlow) ?? FLOWS[0];

  return (
    <div>
      <p className="eyebrow mt-8">{t('freebay.explorer')}</p>
      <h3 className="mt-2 text-lg font-bold text-stone-900 dark:text-stone-100">
        {t('freebay.followFlow')}
      </h3>
      <p className="mt-2 text-sm leading-7">{t('freebay.chooseFlow')}</p>
      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label={t('freebay.flowGroup')}>
        {FLOWS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectFlow(item.id)}
            aria-pressed={activeFlow === item.id}
            className="freebay-flow-button focus-ring border-2 border-stone-900 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-stone-900 transition-colors duration-200 dark:border-stone-100 dark:text-stone-100"
          >
            {t(`freebayExtra.flows.${item.key}.label`)}
          </button>
        ))}
      </div>
      <div className="mt-6 border-2 border-stone-900/20 p-5 dark:border-stone-100/20">
        <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
          {t(`freebayExtra.flows.${flow.key}.title`)}
        </h3>
        <p className="mt-2 text-sm leading-7">{t(`freebayExtra.flows.${flow.key}.description`)}</p>
        <ol className="mt-4 space-y-2">
          {Array.from({ length: 4 }, (_, index) => (
            <li key={index} className="flex gap-3 text-sm leading-6">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-stone-900/30 font-mono text-xs font-bold text-[#73004c] dark:border-stone-100/30 dark:text-fuchsia-200">
                {index + 1}
              </span>
              <span>{t(`freebayExtra.flows.${flow.key}.steps.${index}`)}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-6">
        <FreebayArchitectureDiagram activeFlow={activeFlow} />
      </div>
      <p className="mt-4 font-mono text-xs leading-6 text-stone-600 dark:text-stone-400">
        {t('freebay.altText')}{' '}
        {Array.from({ length: 4 }, (_, index) =>
          t(`freebayExtra.flows.${flow.key}.steps.${index}`),
        ).join(' → ')}
        .
      </p>
    </div>
  );
};

export default FreebayFlowExplorer;
