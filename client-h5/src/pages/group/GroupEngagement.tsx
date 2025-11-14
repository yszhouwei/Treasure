import React from 'react';
import { useTranslation } from 'react-i18next';
import './GroupEngagement.css';

const GroupEngagement: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="group-engagement-page">
      <div className="group-engagement-header">
        <button className="back-btn" onClick={() => window.history.back()}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1>{t('group.engagement.title', '参与度')}</h1>
        <div style={{ width: '40px' }} />
      </div>

      <div className="group-engagement-content">
        <section className="engagement-progress">
          <h2>{t('group.progress.label', '团购进度')}</h2>
          <div className="progress-circle">
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="#f0f0f0" strokeWidth="8"/>
              <circle cx="60" cy="60" r="54" fill="none" stroke="#D4A574" strokeWidth="8"
                strokeDasharray="339.292" strokeDashoffset="101.788" 
                transform="rotate(-90 60 60)" strokeLinecap="round"/>
            </svg>
            <div className="progress-text">
              <strong>70%</strong>
              <span>{t('group.engagement.complete', '完成')}</span>
            </div>
          </div>
          <p className="progress-desc">{t('group.engagement.progressDesc', '当前团购进度良好，继续保持！')}</p>
        </section>

        <section className="engagement-stats">
          <h2>{t('group.engagement.stats', '参与统计')}</h2>
          <div className="stats-list">
            <div className="stat-item">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <span className="stat-label">{t('group.engagement.participants', '参与人数')}</span>
                <strong className="stat-value">156人</strong>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">📈</div>
              <div className="stat-info">
                <span className="stat-label">{t('group.engagement.growth', '增长率')}</span>
                <strong className="stat-value positive">+12%</strong>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">⭐</div>
              <div className="stat-info">
                <span className="stat-label">{t('group.engagement.active', '活跃度')}</span>
                <strong className="stat-value">85%</strong>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default GroupEngagement;
