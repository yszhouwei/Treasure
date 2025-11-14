import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';
import './GroupOverview.css';

interface GroupOverviewProps {
  onBack: () => void;
}

const GroupOverview: React.FC<GroupOverviewProps> = ({ onBack }) => {
  const { t } = useTranslation();

  return (
    <div className="group-overview-container">
      <Header onBack={onBack} title={t('group.sheet.hero.title')} />
      <div className="group-overview-content">
        {/* Hero Section */}
        <section className="overview-hero">
          <div className="overview-hero-icon">👥</div>
          <h1>{t('group.hero.title')}</h1>
          <p>{t('group.hero.subtitle')}</p>
        </section>

        {/* Team Information */}
        <section className="overview-section">
          <h2>{t('group.sheet.hero.teamInfo')}</h2>
          <div className="overview-info-grid">
            <div className="overview-info-card">
              <span className="info-label">{t('group.hero.leader')}</span>
              <strong>{t('group.hero.leaderName')}</strong>
            </div>
            <div className="overview-info-card">
              <span className="info-label">{t('group.hero.schedule')}</span>
              <strong>{t('group.hero.scheduleValue')}</strong>
            </div>
            <div className="overview-info-card">
              <span className="info-label">{t('group.hero.region')}</span>
              <strong>{t('group.hero.regionValue')}</strong>
            </div>
          </div>
        </section>

        {/* Description */}
        <section className="overview-section">
          <h2>{t('group.sheet.hero.aboutTitle')}</h2>
          <div className="overview-desc-card">
            <p>{t('group.sheet.hero.desc')}</p>
          </div>
        </section>

        {/* Features */}
        <section className="overview-section">
          <h2>{t('group.sheet.hero.featuresTitle')}</h2>
          <div className="overview-features">
            <div className="feature-item">
              <div className="feature-icon">🎯</div>
              <div className="feature-content">
                <h3>{t('group.sheet.hero.feature1Title')}</h3>
                <p>{t('group.sheet.hero.feature1Desc')}</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💡</div>
              <div className="feature-content">
                <h3>{t('group.sheet.hero.feature2Title')}</h3>
                <p>{t('group.sheet.hero.feature2Desc')}</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🏆</div>
              <div className="feature-content">
                <h3>{t('group.sheet.hero.feature3Title')}</h3>
                <p>{t('group.sheet.hero.feature3Desc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Action Button */}
        <div className="overview-actions">
          <button className="overview-primary-btn">{t('group.sheet.hero.cta')}</button>
        </div>
      </div>
    </div>
  );
};

export default GroupOverview;
