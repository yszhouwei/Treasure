import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import './Profile.css';

type ProfileHero = {
  greeting: string;
  name: string;
  subtitle: string;
  badge: string;
  level: string;
  progressLabel: string;
  progressValue: string;
  progressPercent: string;
  progressHint: string;
  stats: Array<{
    label: string;
    value: string;
    change: string;
  }>;
};

type ProfileAction = {
  id: string;
  icon?: string;
  label: string;
  desc: string;
};

type ProfileSectionItem = {
  id: string;
  icon?: string;
  title: string;
  desc: string;
  meta?: string;
  status?: string;
  cta?: string;
};

type ProfileSection = {
  title: string;
  subtitle: string;
  layout: 'list' | 'grid' | 'card';
  items: ProfileSectionItem[];
};

type ProfileSections = Record<string, ProfileSection>;

const renderIcon = (icon?: string) => {
  if (!icon) {
    return null;
  }

  const emojiRegex = /\p{Extended_Pictographic}/u;
  if (emojiRegex.test(icon)) {
    return <span className="profile-emoji">{icon}</span>;
  }

  switch (icon) {
    case 'shield':
      return (
        <svg viewBox="0 0 24 24" className="profile-svg-icon" aria-hidden>
          <path d="M12 3l7 3v6c0 4.97-3.134 9.14-7 10-3.866-.86-7-5.03-7-10V6l7-3z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case 'location':
      return (
        <svg viewBox="0 0 24 24" className="profile-svg-icon" aria-hidden>
          <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="12" cy="9" r="2.5" fill="currentColor" />
        </svg>
      );
    case 'bell':
      return (
        <svg viewBox="0 0 24 24" className="profile-svg-icon" aria-hidden>
          <path d="M18 16v-5a6 6 0 1 0-12 0v5l-1.5 2h15z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M9 20a3 3 0 0 0 6 0" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case 'settings':
      return (
        <svg viewBox="0 0 24 24" className="profile-svg-icon" aria-hidden>
          <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c0 .69.4 1.31 1.02 1.59.32.15.67.24 1.01.24H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return <span className="profile-icon-text">{icon.slice(0, 1).toUpperCase()}</span>;
  }
};

const Profile: React.FC = () => {
  const { t } = useTranslation();

  const hero = t('profile.hero', { returnObjects: true }) as ProfileHero;
  const actions = t('profile.actions', { returnObjects: true }) as ProfileAction[];
  const sections = t('profile.sections', { returnObjects: true }) as ProfileSections;

  return (
    <div className="profile-container">
      <Header />
      <div className="profile-content">
        <section className="profile-hero">
          <div className="profile-hero-overlay">
            <div className="profile-hero-header">
              <div className="profile-avatar">{hero.name?.[0] || 'U'}</div>
              <div className="profile-hero-info">
                <span className="profile-hero-greeting">{hero.greeting}</span>
                <h1>{hero.name}</h1>
                <p>{hero.subtitle}</p>
              </div>
              <span className="profile-hero-badge">{hero.badge}</span>
            </div>

            <div className="profile-hero-progress">
              <div className="profile-progress-header">
                <span className="profile-progress-label">{hero.progressLabel}</span>
                <span className="profile-progress-value">{hero.progressValue}</span>
              </div>
              <div className="profile-progress-bar">
                <div className="profile-progress-inner" style={{ width: hero.progressPercent }} />
              </div>
              <div className="profile-progress-meta">
                <span className="profile-level-tag">{hero.level}</span>
                <span className="profile-progress-hint">{hero.progressHint}</span>
              </div>
            </div>

            <div className="profile-stats-grid">
              {hero.stats?.map((stat) => (
                <article key={stat.label} className="profile-stat-card">
                  <span className="profile-stat-label">{stat.label}</span>
                  <strong className="profile-stat-value">{stat.value}</strong>
                  <span className="profile-stat-change">{stat.change}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="profile-actions">
          <div className="profile-action-grid">
            {actions.map((action) => (
              <button key={action.id} className="profile-action-card">
                <span className="profile-action-icon" aria-hidden>
                  {action.icon}
                </span>
                <span className="profile-action-label">{action.label}</span>
                <span className="profile-action-desc">{action.desc}</span>
              </button>
            ))}
          </div>
        </section>

        {Object.entries(sections).map(([key, section]) => (
          <section key={key} className={`profile-section profile-section-${section.layout}`}>
            <div className="profile-section-header">
              <h2>{section.title}</h2>
              <span>{section.subtitle}</span>
            </div>

            {section.layout === 'grid' && (
              <div className="profile-grid">
                {section.items.map((item) => (
                  <div key={item.id} className="profile-grid-item">
                    <div className={`profile-grid-icon ${item.icon ? `icon-${item.icon}` : ''}`}>
                      {renderIcon(item.icon)}
                    </div>
                    <div className="profile-grid-text">
                      <span className="profile-grid-title">{item.title}</span>
                      <span className="profile-grid-desc">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.layout === 'list' && (
              <div className="profile-timeline">
                {section.items.map((item, idx) => (
                  <div key={item.id} className="profile-timeline-item">
                    <div className="profile-timeline-marker" data-index={idx + 1} />
                    <div className="profile-timeline-content">
                      <div className="profile-timeline-head">
                        <span className="profile-timeline-meta">{item.meta}</span>
                        {item.status && <span className="profile-timeline-status">{item.status}</span>}
                      </div>
                      <h3>{item.title}</h3>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.layout === 'card' && (
              <div className="profile-support-list">
                {section.items.map((item) => (
                  <div key={item.id} className="profile-support-card">
                    <div className="profile-support-left">
                      <div className="profile-support-icon">{renderIcon(item.icon)}</div>
                      <div className="profile-support-text">
                        <h3>{item.title}</h3>
                        <p>{item.desc}</p>
                      </div>
                    </div>
                    {item.cta && <button className="profile-support-cta">{item.cta}</button>}
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
};

export default Profile;
