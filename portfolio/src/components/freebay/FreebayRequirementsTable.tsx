import type { ReactNode } from 'react';
import { useLocale } from '../../contexts/LocaleContext';

const STATUS_TAG: Record<'implementado' | 'hardening' | 'planejado', string> = {
  implementado:
    'border-emerald-800/40 bg-emerald-700/10 text-emerald-900 dark:border-emerald-200/40 dark:bg-emerald-200/10 dark:text-emerald-200',
  hardening:
    'border-amber-800/40 bg-amber-600/10 text-amber-900 dark:border-amber-200/40 dark:bg-amber-200/10 dark:text-amber-200',
  planejado:
    'border-[#a1006b]/40 bg-[#a1006b]/10 text-[#73004c] dark:border-fuchsia-200/40 dark:bg-fuchsia-200/10 dark:text-fuchsia-200',
};

export const StatusTag = ({
  status,
  children,
}: {
  status: keyof typeof STATUS_TAG;
  children: ReactNode;
}) => (
  <span
    className={`inline-block border px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider ${STATUS_TAG[status]}`}
  >
    {children}
  </span>
);

export const FreebayRequirementsTable = () => {
  const { t } = useLocale();

  return (
    <div>
      <div className="article-table-wrap mt-6">
        <table className="article-table">
          <thead>
            <tr>
              <th scope="col">{t('freebayLabels.capacity')}</th>
              <th scope="col">{t('freebayLabels.state')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{t('freebayLabels.requirement1')}</td>
              <td>
                <StatusTag status="implementado">
                  {t('freebayLabels.statusImplemented')} · {t('freebayLabels.statusBase')}
                </StatusTag>
              </td>
            </tr>
            <tr>
              <td>{t('freebayLabels.requirement2')}</td>
              <td>
                <StatusTag status="implementado">
                  {t('freebayLabels.statusImplemented')} · {t('freebayLabels.statusBase')}
                </StatusTag>
              </td>
            </tr>
            <tr>
              <td>{t('freebayLabels.requirement3')}</td>
              <td>
                <StatusTag status="implementado">
                  {t('freebayLabels.statusImplemented')} · {t('freebayLabels.statusBase')}
                </StatusTag>
              </td>
            </tr>
            <tr>
              <td>{t('freebayLabels.requirement4')}</td>
              <td>
                <StatusTag status="hardening">
                  {t('freebayLabels.statusHardening')} · {t('freebayLabels.statusConsistency')}
                </StatusTag>
              </td>
            </tr>
            <tr>
              <td>{t('freebayLabels.requirement5')}</td>
              <td>
                <StatusTag status="hardening">
                  {t('freebayLabels.statusHardening')} · {t('freebayLabels.statusLedger')}
                </StatusTag>
              </td>
            </tr>
            <tr>
              <td>{t('freebayLabels.requirement6')}</td>
              <td>
                <StatusTag status="hardening">
                  {t('freebayLabels.statusHardening')} · {t('freebayLabels.statusIdempotency')}
                </StatusTag>
              </td>
            </tr>
            <tr>
              <td>{t('freebayLabels.requirement7')}</td>
              <td>
                <StatusTag status="hardening">
                  {t('freebayLabels.statusHardening')} · {t('freebayLabels.statusAuthorization')}
                </StatusTag>
              </td>
            </tr>
            <tr>
              <td>{t('freebayLabels.requirement8')}</td>
              <td>
                <StatusTag status="planejado">
                  {t('freebayLabels.statusPlanned')} · {t('freebayLabels.statusContract')}
                </StatusTag>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm leading-7">{t('freebayLabels.nonFunctional')}</p>
    </div>
  );
};

export default FreebayRequirementsTable;
