import { useLocale } from '../../contexts/LocaleContext';

export const FreebayDecisionsTable = () => {
  const { t } = useLocale();

  return (
    <div className="article-table-wrap mt-6">
      <table className="article-table">
        <thead>
          <tr>
            <th scope="col">{t('freebayLabels.decision')}</th>
            <th scope="col">{t('freebayLabels.alternative')}</th>
            <th scope="col">{t('freebayLabels.justification')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{t('freebayLabels.decision1')}</td>
            <td>{t('freebayLabels.alternative1')}</td>
            <td>{t('freebayLabels.justification1')}</td>
          </tr>
          <tr>
            <td>{t('freebayLabels.decision2')}</td>
            <td>{t('freebayLabels.alternative2')}</td>
            <td>{t('freebayLabels.justification2')}</td>
          </tr>
          <tr>
            <td>{t('freebayLabels.decision3')}</td>
            <td>{t('freebayLabels.alternative3')}</td>
            <td>{t('freebayLabels.justification3')}</td>
          </tr>
          <tr>
            <td>{t('freebayLabels.decision4')}</td>
            <td>{t('freebayLabels.alternative4')}</td>
            <td>{t('freebayLabels.justification4')}</td>
          </tr>
          <tr>
            <td>{t('freebayLabels.decision5')}</td>
            <td>{t('freebayLabels.alternative5')}</td>
            <td>{t('freebayLabels.justification5')}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default FreebayDecisionsTable;
