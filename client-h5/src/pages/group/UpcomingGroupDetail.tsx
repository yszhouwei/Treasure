import React from 'react';
import { useTranslation } from 'react-i18next';
import './UpcomingGroupDetail.css';

interface UpcomingGroupDetailProps {
  id?: string;
}

const UpcomingGroupDetail: React.FC<UpcomingGroupDetailProps> = ({ id = 'GRP2401' }) => {
  const { t } = useTranslation();

  return (
    <div className="upcoming-group-page">
      <div className="upcoming-group-header">
        <button className="back-btn" onClick={() => window.history.back()}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1>{t('group.upcoming.detail', '即将开始')}</h1>
        <div style={{ width: '40px' }} />
      </div>

      <div className="upcoming-group-content">
        <section className="upcoming-info">
          <div className="upcoming-badge">即将开始</div>
          <h2>春季特惠团购</h2>
          <p className="upcoming-id">团购编号: {id}</p>
        </section>

        <section className="upcoming-details">
          <h3>{t('group.upcoming.details', '团购详情')}</h3>
          <div className="detail-list">
            <div className="detail-row">
              <span className="detail-label">开始时间</span>
              <span className="detail-value">2024-04-01 10:00</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">预计参与</span>
              <span className="detail-value">50人</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">剩余名额</span>
              <span className="detail-value">12人</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">团购类型</span>
              <span className="detail-value">10人团</span>
            </div>
          </div>
        </section>

        <section className="upcoming-actions">
          <button className="action-btn primary">{t('group.actions.arrange', '安排')}</button>
          <button className="action-btn secondary">{t('group.actions.notify', '通知成员')}</button>
        </section>
      </div>
    </div>
  );
};

export default UpcomingGroupDetail;
