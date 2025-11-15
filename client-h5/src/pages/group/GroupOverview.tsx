import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';
import './GroupOverview.css';

interface GroupOverviewProps {
  onBack: () => void;
  onNavigate?: (page: 'members' | 'statistics' | 'settings') => void;
}

const GroupOverview: React.FC<GroupOverviewProps> = ({ onBack, onNavigate }) => {
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
          <h2>{t('group.sheet.hero.teamInfo') || t('group.hero.teamInfo') || '团队信息'}</h2>
          <div className="overview-info-grid">
            <div className="overview-info-card" onClick={() => onNavigate?.('members')} style={{ cursor: 'pointer' }}>
              <span className="info-label">{t('group.hero.leader') || '团长'}</span>
              <strong>{t('group.hero.leaderName') || 'Crystal · 团长'}</strong>
            </div>
            <div className="overview-info-card" onClick={() => onNavigate?.('statistics')} style={{ cursor: 'pointer' }}>
              <span className="info-label">{t('group.hero.schedule') || '今日排期'}</span>
              <strong>{t('group.hero.scheduleValue') || '4场正在进行'}</strong>
            </div>
            <div className="overview-info-card" onClick={() => onNavigate?.('settings')} style={{ cursor: 'pointer' }}>
              <span className="info-label">{t('group.hero.region') || '覆盖区域'}</span>
              <strong>{t('group.hero.regionValue') || '中国 · 东南亚'}</strong>
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

        {/* Action Buttons */}
        <div className="overview-actions">
          <button 
            className="overview-primary-btn"
            onClick={() => onNavigate?.('members')}
          >
            {t('group.management.members.title') || '成员管理'}
          </button>
          <div className="overview-secondary-actions">
            <button 
              className="overview-secondary-btn"
              onClick={() => onNavigate?.('statistics')}
            >
              {t('group.management.stats.title') || '数据统计'}
            </button>
            <button 
              className="overview-secondary-btn"
              onClick={() => onNavigate?.('settings')}
            >
              {t('group.management.settings.title') || '团队设置'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupOverview;
