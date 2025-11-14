import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';
import './TimelineDetailPage.css';

interface TimelineItem {
  id: string;
  icon?: string;
  title: string;
  desc: string;
  meta?: string;
  status?: string;
  cta?: string;
}

interface TimelineDetailPageProps {
  onBack: () => void;
  item: TimelineItem;
}

const TimelineDetailPage: React.FC<TimelineDetailPageProps> = ({ onBack, item }) => {
  const { t } = useTranslation();

  const relatedActions = [
    { id: 1, icon: '📄', label: t('profile.timelineDetail.viewOrder'), action: 'view-order' },
    { id: 2, icon: '💬', label: t('profile.timelineDetail.contactSupport'), action: 'contact' },
    { id: 3, icon: '📱', label: t('profile.timelineDetail.share'), action: 'share' },
  ];

  const timeline = [
    { time: '10:28', event: item.title, status: 'completed' },
    { time: '10:15', event: t('profile.timelineDetail.event1'), status: 'completed' },
    { time: '10:00', event: t('profile.timelineDetail.event2'), status: 'completed' },
    { time: '09:45', event: t('profile.timelineDetail.event3'), status: 'completed' },
  ];

  return (
    <div className="timeline-detail-page-container">
      <Header onBack={onBack} title={t('profile.timelineDetail.title')} />
      
      <div className="timeline-detail-page-content">
        <section className="timeline-detail-hero">
          <div className="timeline-detail-icon">
            {item.icon || '📋'}
          </div>
          <h1 className="timeline-detail-title">{item.title}</h1>
          <p className="timeline-detail-desc">{item.desc}</p>
          
          {item.meta && (
            <div className="timeline-detail-meta">{item.meta}</div>
          )}
          
          {item.status && (
            <div className="timeline-detail-status-badge">{item.status}</div>
          )}
        </section>

        <section className="timeline-detail-actions-section">
          <h2 className="timeline-detail-section-title">{t('profile.timelineDetail.actionsTitle')}</h2>
          
          <div className="timeline-detail-actions-grid">
            {relatedActions.map((action) => (
              <button key={action.id} className="timeline-detail-action-btn">
                <span className="timeline-detail-action-icon">{action.icon}</span>
                <span className="timeline-detail-action-label">{action.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="timeline-detail-timeline-section">
          <h2 className="timeline-detail-section-title">{t('profile.timelineDetail.timelineTitle')}</h2>
          
          <div className="timeline-detail-timeline-list">
            {timeline.map((item, index) => (
              <div key={index} className="timeline-detail-timeline-item">
                <div className="timeline-detail-timeline-dot"></div>
                <div className="timeline-detail-timeline-content">
                  <div className="timeline-detail-timeline-time">{item.time}</div>
                  <div className="timeline-detail-timeline-event">{item.event}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TimelineDetailPage;

