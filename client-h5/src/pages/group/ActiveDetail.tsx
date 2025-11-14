import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';
import './ActiveDetail.css';

interface GroupItem {
  id: string;
  title: string;
  status: string;
  progress: number;
  participants: string;
  remaining: string;
}

interface ActiveDetailProps {
  item: GroupItem;
  onBack: () => void;
}

const ActiveDetail: React.FC<ActiveDetailProps> = ({ item, onBack }) => {
  const { t } = useTranslation();

  // Mock member avatars
  const members = [
    { id: 1, name: t('group.activeDetail.member1'), avatar: '👤', role: t('group.activeDetail.leader') },
    { id: 2, name: t('group.activeDetail.member2'), avatar: '👤', role: t('group.activeDetail.member') },
    { id: 3, name: t('group.activeDetail.member3'), avatar: '👤', role: t('group.activeDetail.member') },
    { id: 4, name: t('group.activeDetail.member4'), avatar: '👤', role: t('group.activeDetail.member') },
  ];

  // Mock activity log
  const activities = [
    { time: t('group.activeDetail.activity1Time'), action: t('group.activeDetail.activity1') },
    { time: t('group.activeDetail.activity2Time'), action: t('group.activeDetail.activity2') },
    { time: t('group.activeDetail.activity3Time'), action: t('group.activeDetail.activity3') },
  ];

  return (
    <div className="active-detail-container">
      <Header onBack={onBack} title={t('group.sheet.active.title')} />
      <div className="active-detail-content">
        {/* Group Info Card */}
        <section className="active-info-card">
          <div className="active-header">
            <div className="active-icon">🎯</div>
            <div>
              <h1>{item.title}</h1>
              <span className="active-badge">{item.status}</span>
            </div>
          </div>
          
          {/* Progress Section */}
          <div className="active-progress-section">
            <div className="progress-header">
              <span>{t('group.activeDetail.progressLabel')}</span>
              <strong>{item.progress}%</strong>
            </div>
            <div className="progress-bar-large">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${item.progress}%` }}
              />
            </div>
          </div>

          <div className="active-meta">
            <div className="meta-item">
              <span className="meta-label">{t('group.activeDetail.idLabel')}</span>
              <strong>{item.id}</strong>
            </div>
            <div className="meta-item">
              <span className="meta-label">{t('group.activeDetail.participantsLabel')}</span>
              <strong>{item.participants}</strong>
            </div>
            <div className="meta-item">
              <span className="meta-label">{t('group.activeDetail.remainingLabel')}</span>
              <strong>{item.remaining}</strong>
            </div>
          </div>
        </section>

        {/* Description */}
        <section className="active-section">
          <h2>{t('group.activeDetail.descTitle')}</h2>
          <div className="active-desc-card">
            <p>{t('group.sheet.active.desc')}</p>
          </div>
        </section>

        {/* Members List */}
        <section className="active-section">
          <h2>{t('group.activeDetail.membersTitle')}</h2>
          <div className="members-list">
            {members.map((member) => (
              <div key={member.id} className="member-card">
                <div className="member-avatar">{member.avatar}</div>
                <div className="member-info">
                  <strong>{member.name}</strong>
                  <span>{member.role}</span>
                </div>
                <button className="member-action-btn">
                  {t('group.activeDetail.contact')}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Activity Log */}
        <section className="active-section">
          <h2>{t('group.activeDetail.activityTitle')}</h2>
          <div className="activity-timeline">
            {activities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-dot" />
                <div className="activity-content">
                  <span className="activity-time">{activity.time}</span>
                  <p>{activity.action}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="active-section">
          <div className="quick-actions">
            <button className="quick-action-btn">
              <span>💬</span>
              {t('group.activeDetail.chat')}
            </button>
            <button className="quick-action-btn">
              <span>📊</span>
              {t('group.activeDetail.report')}
            </button>
            <button className="quick-action-btn">
              <span>⚙️</span>
              {t('group.activeDetail.settings')}
            </button>
          </div>
        </section>

        {/* Action Button */}
        <div className="active-actions">
          <button className="active-primary-btn">{t('group.sheet.active.cta')}</button>
        </div>
      </div>
    </div>
  );
};

export default ActiveDetail;

