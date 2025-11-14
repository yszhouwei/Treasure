import React from 'react';
import { useTranslation } from 'react-i18next';
import './ActiveGroupDetail.css';

interface ActiveGroupDetailProps {
  id?: string;
}

const ActiveGroupDetail: React.FC<ActiveGroupDetailProps> = ({ id = 'GRP2389' }) => {
  const { t } = useTranslation();

  return (
    <div className="active-group-page">
      <div className="active-group-header">
        <button className="back-btn" onClick={() => window.history.back()}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1>{t('group.active.detail', '进行中')}</h1>
        <div style={{ width: '40px' }} />
      </div>

      <div className="active-group-content">
        <section className="active-info">
          <div className="active-badge">进行中</div>
          <h2>夏季清凉团购</h2>
          <p className="active-id">团购编号: {id}</p>
          
          <div className="active-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '65%' }} />
            </div>
            <span className="progress-text">65%</span>
          </div>
        </section>

        <section className="active-details">
          <h3>{t('group.active.details', '团购详情')}</h3>
          <div className="detail-list">
            <div className="detail-row">
              <span className="detail-label">开始时间</span>
              <span className="detail-value">2024-03-15 10:00</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">当前参与</span>
              <span className="detail-value">65人</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">目标人数</span>
              <span className="detail-value">100人</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">剩余时间</span>
              <span className="detail-value">3天12小时</span>
            </div>
          </div>
        </section>

        <section className="active-members">
          <h3>{t('group.active.members', '参与成员')}</h3>
          <div className="members-list">
            <div className="member-item">
              <div className="member-avatar">👤</div>
              <div className="member-info">
                <span className="member-name">张三</span>
                <span className="member-time">2小时前加入</span>
              </div>
            </div>
            <div className="member-item">
              <div className="member-avatar">👤</div>
              <div className="member-info">
                <span className="member-name">李四</span>
                <span className="member-time">5小时前加入</span>
              </div>
            </div>
            <div className="member-item">
              <div className="member-avatar">👤</div>
              <div className="member-info">
                <span className="member-name">王五</span>
                <span className="member-time">1天前加入</span>
              </div>
            </div>
          </div>
        </section>

        <section className="active-actions">
          <button className="action-btn primary">{t('group.actions.manage', '管理')}</button>
          <button className="action-btn secondary">{t('group.actions.share', '分享')}</button>
        </section>
      </div>
    </div>
  );
};

export default ActiveGroupDetail;
