import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import RechargePage from './profile/RechargePage';
import WithdrawPage from './profile/WithdrawPage';
import InvitePage from './profile/InvitePage';
import ProfileEditPage from './profile/ProfileEditPage';
import SecurityPage from './profile/SecurityPage';
import AddressPage from './profile/AddressPage';
import MessagesPage from './profile/MessagesPage';
import SettingsPage from './profile/SettingsPage';
import CustomerServicePage from './profile/CustomerServicePage';
import HelpCenterPage from './profile/HelpCenterPage';
import TimelineDetailPage from './profile/TimelineDetailPage';
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
  email?: string;
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

type ProfileDataset = {
  hero: ProfileHero;
  actions: ProfileAction[];
  sections: ProfileSections;
};

type PageState =
  | { type: 'recharge' }
  | { type: 'withdraw' }
  | { type: 'invite' }
  | { type: 'profileEdit' }
  | { type: 'security' }
  | { type: 'address' }
  | { type: 'messages' }
  | { type: 'settings' }
  | { type: 'customerService' }
  | { type: 'helpCenter' }
  | { type: 'timelineDetail'; payload: ProfileSectionItem };

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

const ProfileSkeleton: React.FC = () => (
  <div className="profile-skeleton">
    <div className="profile-skeleton-hero skeleton-shimmer" />
    <div className="profile-skeleton-grid">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="profile-skeleton-card skeleton-shimmer" />
      ))}
    </div>
    <div className="profile-skeleton-list">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="profile-skeleton-item skeleton-shimmer" />
      ))}
    </div>
  </div>
);

const Profile: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user, openAuth, logout } = useAuth();

  const heroTranslation = useMemo(
    () => t('profile.hero', { returnObjects: true }) as ProfileHero,
    [i18n.language]
  );
  const actionsTranslation = useMemo(
    () => t('profile.actions', { returnObjects: true }) as ProfileAction[],
    [i18n.language]
  );
  const sectionsTranslation = useMemo(
    () => t('profile.sections', { returnObjects: true }) as ProfileSections,
    [i18n.language]
  );

  const [loading, setLoading] = useState<boolean>(Boolean(isAuthenticated));
  const [profileData, setProfileData] = useState<ProfileDataset | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activePage, setActivePage] = useState<PageState | null>(null);
  const refreshTimerRef = useRef<number>();

  const cloneSections = useCallback((sections: ProfileSections): ProfileSections => {
    const result: ProfileSections = {};
    Object.entries(sections).forEach(([key, value]) => {
      result[key] = {
        title: value.title,
        subtitle: value.subtitle,
        layout: value.layout,
        items: value.items.map((item) => ({ ...item }))
      };
    });
    return result;
  }, []);

  const buildProfileDataset = useCallback((): ProfileDataset => {
    const hero: ProfileHero = {
      ...heroTranslation,
      name: user?.name || heroTranslation.name,
      email: user?.email,
      stats: heroTranslation.stats?.map((stat) => ({ ...stat })) || []
    };

    const actions = actionsTranslation.map((action) => ({ ...action }));
    const sections = cloneSections(sectionsTranslation);

    return { hero, actions, sections };
  }, [heroTranslation, actionsTranslation, sectionsTranslation, user?.name, user?.email, cloneSections]);

  useEffect(() => {
    if (!isAuthenticated) {
      setProfileData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = window.setTimeout(() => {
      setProfileData(buildProfileDataset());
      setLoading(false);
    }, 480);

    return () => window.clearTimeout(timer);
  }, [isAuthenticated, buildProfileDataset, i18n.language]);

  useEffect(() => () => {
    if (refreshTimerRef.current) {
      window.clearTimeout(refreshTimerRef.current);
    }
  }, []);

  const handleRefresh = () => {
    if (!isAuthenticated) {
      openAuth('login');
      return;
    }
    setRefreshing(true);
    if (refreshTimerRef.current) {
      window.clearTimeout(refreshTimerRef.current);
    }
    refreshTimerRef.current = window.setTimeout(() => {
      const updated = buildProfileDataset();
      // Simulate slight progress change for visual feedback
      updated.hero.progressPercent = `${Math.min(99, Number.parseInt(updated.hero.progressPercent, 10) + 1) || 86}%`;
      setProfileData(updated);
      setRefreshing(false);
    }, 520);
  };

  const handleActionClick = (actionId: string) => {
    switch (actionId) {
      case 'recharge':
        setActivePage({ type: 'recharge' });
        break;
      case 'withdraw':
        setActivePage({ type: 'withdraw' });
        break;
      case 'invite':
        setActivePage({ type: 'invite' });
        break;
      case 'profile':
        setActivePage({ type: 'profileEdit' });
        break;
      default:
        break;
    }
  };

  const handleItemClick = (itemId: string, item?: ProfileSectionItem) => {
    switch (itemId) {
      case 'security':
        setActivePage({ type: 'security' });
        break;
      case 'address':
        setActivePage({ type: 'address' });
        break;
      case 'messages':
        setActivePage({ type: 'messages' });
        break;
      case 'settings':
        setActivePage({ type: 'settings' });
        break;
      case 'cs':
        setActivePage({ type: 'customerService' });
        break;
      case 'faq':
        setActivePage({ type: 'helpCenter' });
        break;
      default:
        if (item && itemId.startsWith('timeline')) {
          setActivePage({ type: 'timelineDetail', payload: item });
        }
        break;
    }
  };

  // Page navigation
  if (activePage) {
    const onBack = () => setActivePage(null);
    
    switch (activePage.type) {
      case 'recharge':
        return <RechargePage onBack={onBack} />;
      case 'withdraw':
        return <WithdrawPage onBack={onBack} />;
      case 'invite':
        return <InvitePage onBack={onBack} />;
      case 'profileEdit':
        return <ProfileEditPage onBack={onBack} user={user} />;
      case 'security':
        return <SecurityPage onBack={onBack} />;
      case 'address':
        return <AddressPage onBack={onBack} />;
      case 'messages':
        return <MessagesPage onBack={onBack} />;
      case 'settings':
        return <SettingsPage onBack={onBack} />;
      case 'customerService':
        return <CustomerServicePage onBack={onBack} />;
      case 'helpCenter':
        return <HelpCenterPage onBack={onBack} />;
      case 'timelineDetail':
        return <TimelineDetailPage onBack={onBack} item={activePage.payload} />;
    }
  }

  return (
    <div className="profile-container">
      <Header />
      <div className="profile-content">
        {!isAuthenticated ? (
          <div className="profile-empty-card">
            <div className="profile-empty-icon" aria-hidden>
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor">
                <path d="M24 6l15 9v18l-15 9-15-9V15l15-9z" strokeWidth="2" strokeLinejoin="round" />
                <path d="M24 21v9" strokeWidth="2" strokeLinecap="round" />
                <circle cx="24" cy="17" r="2" fill="currentColor" />
              </svg>
            </div>
            <h2>{t('profile.emptyTitle')}</h2>
            <p>{t('profile.emptySubtitle')}</p>
            <button className="profile-empty-btn" onClick={() => openAuth('login')}>
              {t('profile.emptyAction')}
            </button>
          </div>
        ) : loading || !profileData ? (
          <ProfileSkeleton />
        ) : (
          <>
            <section className="profile-hero">
              <div className="profile-hero-overlay">
                <div className="profile-hero-top">
                  <div className="profile-hero-header">
                    <div className="profile-avatar">{profileData.hero.name?.[0] || 'U'}</div>
                    <div className="profile-hero-info">
                      <span className="profile-hero-greeting">{profileData.hero.greeting}</span>
                      <h1>{profileData.hero.name}</h1>
                      {profileData.hero.email && <span className="profile-hero-email">{profileData.hero.email}</span>}
                    </div>
                  </div>
                  <span className="profile-hero-badge">{profileData.hero.badge}</span>
                </div>

                <p className="profile-hero-subtitle">{profileData.hero.subtitle}</p>

                <div className="profile-hero-toolbar">
                  <button
                    className={`profile-refresh-btn ${refreshing ? 'loading' : ''}`}
                    onClick={handleRefresh}
                    disabled={refreshing}
                  >
                    {refreshing ? t('profile.refreshing') : t('profile.refresh')}
                  </button>
                  <button className="profile-logout-btn" onClick={logout}>
                    {t('profile.logout')}
                  </button>
                </div>

                <div className="profile-hero-progress">
                  <div className="profile-progress-header">
                    <span className="profile-progress-label">{profileData.hero.progressLabel}</span>
                    <span className="profile-progress-value">{profileData.hero.progressValue}</span>
                  </div>
                  <div className="profile-progress-bar">
                    <div className="profile-progress-inner" style={{ width: profileData.hero.progressPercent }} />
                  </div>
                  <div className="profile-progress-meta">
                    <span className="profile-level-tag">{profileData.hero.level}</span>
                    <span className="profile-progress-hint">{profileData.hero.progressHint}</span>
                  </div>
                </div>

                <div className="profile-stats-grid">
                  {profileData.hero.stats?.map((stat) => (
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
                {profileData.actions.map((action) => (
                  <button
                    key={action.id}
                    className="profile-action-card"
                    onClick={() => handleActionClick(action.id)}
                  >
                    <span className="profile-action-icon" aria-hidden>
                      {action.icon}
                    </span>
                    <span className="profile-action-label">{action.label}</span>
                    <span className="profile-action-desc">{action.desc}</span>
                  </button>
                ))}
              </div>
            </section>

            {Object.entries(profileData.sections).map(([key, section]) => (
              <section key={key} className={`profile-section profile-section-${section.layout}`}>
                <div className="profile-section-header">
                  <h2>{section.title}</h2>
                  <span>{section.subtitle}</span>
                </div>

                {section.layout === 'grid' && (
                  <div className="profile-grid">
                    {section.items.map((item) => (
                      <div key={item.id} className="profile-grid-item" onClick={() => handleItemClick(item.id, item)}>
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
                      <div key={item.id} className="profile-timeline-item" onClick={() => handleItemClick(item.id, item)}>
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
                        {item.cta && (
                          <button className="profile-support-cta" onClick={() => handleItemClick(item.id, item)}>
                            {item.cta}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
