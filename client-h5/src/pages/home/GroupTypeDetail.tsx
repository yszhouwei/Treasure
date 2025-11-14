import React from 'react';
import { useTranslation } from 'react-i18next';
import './GroupTypeDetail.css';

interface GroupTypeDetailProps {
  groupType: {
    id: number;
    name: string;
    color: string;
    icon: string;
  };
  onBack: () => void;
}

const GroupTypeDetail: React.FC<GroupTypeDetailProps> = ({ groupType, onBack }) => {
  const { t } = useTranslation();

  return (
    <div className="group-type-detail-page">
      {/* 头部 */}
      <div className="group-type-header" style={{ background: `linear-gradient(135deg, ${groupType.color}, ${groupType.color}dd)` }}>
        <button className="back-btn-white" onClick={onBack} aria-label="返回">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="group-type-hero">
          <div className="group-type-icon-large" style={{ background: `rgba(255, 255, 255, 0.25)` }}>
            <span style={{ fontSize: '48px' }}>{groupType.icon}</span>
          </div>
          <h1>{groupType.name}</h1>
          <p>{t('groupTypeDetail.subtitle', { type: groupType.name })}</p>
        </div>
      </div>

      {/* 内容 */}
      <div className="group-type-content">
        {/* 规则说明 */}
        <section className="detail-card">
          <h2>{t('groupTypeDetail.rulesTitle')}</h2>
          <div className="rules-grid">
            <div className="rule-card">
              <div className="rule-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <h3>{t('groupTypeDetail.rule1Title')}</h3>
              <p>{t('groupTypeDetail.rule1Desc', { type: groupType.name })}</p>
            </div>

            <div className="rule-card">
              <div className="rule-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3>{t('groupTypeDetail.rule2Title')}</h3>
              <p>{t('groupTypeDetail.rule2Desc', { type: groupType.name })}</p>
            </div>

            <div className="rule-card">
              <div className="rule-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h3>{t('groupTypeDetail.rule3Title')}</h3>
              <p>{t('groupTypeDetail.rule3Desc')}</p>
            </div>

            <div className="rule-card">
              <div className="rule-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <h3>{t('groupTypeDetail.rule4Title')}</h3>
              <p>{t('groupTypeDetail.rule4Desc')}</p>
            </div>
          </div>
        </section>

        {/* 优势特点 */}
        <section className="detail-card">
          <h2>{t('groupTypeDetail.advantagesTitle')}</h2>
          <div className="advantages-list">
            <div className="advantage-item">
              <span className="advantage-badge">✓</span>
              <div>
                <h4>{t('groupTypeDetail.advantage1Title')}</h4>
                <p>{t('groupTypeDetail.advantage1Desc')}</p>
              </div>
            </div>
            <div className="advantage-item">
              <span className="advantage-badge">✓</span>
              <div>
                <h4>{t('groupTypeDetail.advantage2Title')}</h4>
                <p>{t('groupTypeDetail.advantage2Desc')}</p>
              </div>
            </div>
            <div className="advantage-item">
              <span className="advantage-badge">✓</span>
              <div>
                <h4>{t('groupTypeDetail.advantage3Title')}</h4>
                <p>{t('groupTypeDetail.advantage3Desc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 常见问题 */}
        <section className="detail-card">
          <h2>{t('groupTypeDetail.faqTitle')}</h2>
          <div className="faq-list">
            <details className="faq-item">
              <summary>{t('groupTypeDetail.faq1Question')}</summary>
              <p>{t('groupTypeDetail.faq1Answer')}</p>
            </details>
            <details className="faq-item">
              <summary>{t('groupTypeDetail.faq2Question')}</summary>
              <p>{t('groupTypeDetail.faq2Answer')}</p>
            </details>
            <details className="faq-item">
              <summary>{t('groupTypeDetail.faq3Question')}</summary>
              <p>{t('groupTypeDetail.faq3Answer')}</p>
            </details>
          </div>
        </section>

        {/* 底部按钮 */}
        <div className="group-type-footer">
          <button className="start-group-btn" style={{ background: `linear-gradient(135deg, ${groupType.color}, ${groupType.color}dd)` }}>
            {t('groupTypeDetail.startGroup')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupTypeDetail;

