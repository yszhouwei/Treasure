import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';
import './EngagementPage.css';

interface EngagementPageProps {
  onBack: () => void;
}

const EngagementPage: React.FC<EngagementPageProps> = ({ onBack }) => {
  const { t } = useTranslation();

  // Mock engagement data
  const engagementData = {
    overall: '78%',
    weekly: [
      { week: t('group.engagement.week1'), score: 65 },
      { week: t('group.engagement.week2'), score: 72 },
      { week: t('group.engagement.week3'), score: 75 },
      { week: t('group.engagement.week4'), score: 78 },
    ],
    metrics: [
      { label: t('group.engagement.activeMembers'), value: '24/30', icon: '👥' },
      { label: t('group.engagement.avgSession'), value: '45min', icon: '⏱️' },
      { label: t('group.engagement.completionRate'), value: '85%', icon: '✅' },
      { label: t('group.engagement.satisfaction'), value: '4.6/5', icon: '⭐' },
    ],
    topMembers: [
      { rank: 1, name: t('group.engagement.member1'), score: '98%', avatar: '🥇' },
      { rank: 2, name: t('group.engagement.member2'), score: '95%', avatar: '🥈' },
      { rank: 3, name: t('group.engagement.member3'), score: '92%', avatar: '🥉' },
    ],
  };

  return (
    <div className="engagement-container">
      <Header onBack={onBack} title={t('group.sheet.progress.title')} />
      <div className="engagement-content">
        {/* Overall Score Card */}
        <section className="engagement-hero">
          <div className="engagement-score-circle">
            <svg viewBox="0 0 100 100" className="progress-ring">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#f0f0f0"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#52c41a"
                strokeWidth="8"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * 78) / 100}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="score-text">
              <strong>{engagementData.overall}</strong>
              <span>{t('group.engagement.overallLabel')}</span>
            </div>
          </div>
          <p>{t('group.sheet.progress.desc', { percent: engagementData.overall })}</p>
        </section>

        {/* Weekly Trend */}
        <section className="engagement-section">
          <h2>{t('group.engagement.trendTitle')}</h2>
          <div className="trend-chart">
            {engagementData.weekly.map((data, index) => (
              <div key={index} className="trend-bar-item">
                <div className="trend-bar-wrapper">
                  <div 
                    className="trend-bar-inner"
                    style={{ height: `${data.score}%` }}
                  >
                    <span className="trend-value">{data.score}%</span>
                  </div>
                </div>
                <span className="trend-label">{data.week}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Engagement Metrics */}
        <section className="engagement-section">
          <h2>{t('group.engagement.metricsTitle')}</h2>
          <div className="metrics-grid">
            {engagementData.metrics.map((metric, index) => (
              <div key={index} className="engagement-metric-card">
                <div className="metric-icon">{metric.icon}</div>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Top Members */}
        <section className="engagement-section">
          <h2>{t('group.engagement.topMembersTitle')}</h2>
          <div className="top-members-list">
            {engagementData.topMembers.map((member) => (
              <div key={member.rank} className="top-member-card">
                <div className="member-rank-badge">{member.avatar}</div>
                <div className="member-details">
                  <strong>{member.name}</strong>
                  <span>{t('group.engagement.engagementLabel')}: {member.score}</span>
                </div>
                <div className="member-score">{member.score}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Insights */}
        <section className="engagement-section">
          <h2>{t('group.engagement.insightsTitle')}</h2>
          <div className="insights-list">
            <div className="insight-card positive">
              <div className="insight-icon">📈</div>
              <p>{t('group.engagement.insight1')}</p>
            </div>
            <div className="insight-card neutral">
              <div className="insight-icon">💡</div>
              <p>{t('group.engagement.insight2')}</p>
            </div>
            <div className="insight-card info">
              <div className="insight-icon">🎯</div>
              <p>{t('group.engagement.insight3')}</p>
            </div>
          </div>
        </section>

        {/* Action Button */}
        <div className="engagement-actions">
          <button className="engagement-primary-btn">{t('group.sheet.progress.cta')}</button>
        </div>
      </div>
    </div>
  );
};

export default EngagementPage;

