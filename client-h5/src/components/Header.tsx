import React, { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import cnFlag from '../assets/flags/cn.svg';
import usFlag from '../assets/flags/us.svg';
import { useAuth } from '../context/AuthContext';
import './Header.css';

interface SearchTrendItem {
  title: string;
  desc: string;
}

interface SearchOverlayContent {
  title: string;
  placeholder: string;
  history: string;
  clear: string;
  popular: string;
  trendTitle: string;
  historyItems?: string[];
  hotWords?: string[];
  trendItems?: SearchTrendItem[];
}

interface AuthFeature {
  title: string;
  desc: string;
}

interface AuthContent {
  tabs: {
    login: string;
    register: string;
  };
  loginTitle: string;
  loginSubtitle: string;
  registerTitle: string;
  registerSubtitle: string;
  email: string;
  name?: string;
  password: string;
  confirmPassword: string;
  forgotPassword: string;
  ctaLogin: string;
  ctaRegister: string;
  switchToRegister: string;
  switchToLogin: string;
  agreement: string;
  passwordMismatch?: string;
  successLogin?: string;
  successRegister?: string;
  loggedInTitle?: string;
  loggedInSubtitle?: string;
  loggedInHint?: string;
  manageAccount?: string;
  logout?: string;
  features: AuthFeature[];
}

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const {
    isAuthenticated,
    user,
    showAuth,
    authMode,
    setAuthMode,
    openAuth,
    closeAuth,
    login,
    logout
  } = useAuth();

  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [authEmail, setAuthEmail] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirm, setAuthConfirm] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const searchOverlay = t('searchOverlay', { returnObjects: true }) as SearchOverlayContent;
  const authContent = t('auth', { returnObjects: true }) as AuthContent;

  const currentLanguage = i18n.language;
  const historyStorageKey = useMemo(() => `treasure-search-history-${currentLanguage}`, [currentLanguage]);
  const isZh = currentLanguage === 'zh-CN';

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
    setShowLangMenu(false);
  };

  useEffect(() => {
    const stored = localStorage.getItem(historyStorageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as string[];
        setSearchHistory(parsed);
        return;
      } catch (error) {
        console.warn('Failed to parse search history', error);
      }
    }
    if (searchOverlay.historyItems?.length) {
      setSearchHistory(searchOverlay.historyItems.slice(0, 6));
    } else {
      setSearchHistory([]);
    }
  }, [historyStorageKey, searchOverlay.historyItems]);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      const timer = window.setTimeout(() => searchInputRef.current?.focus(), 120);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [showSearch]);

  useEffect(() => {
    document.body.style.overflow = showSearch || showAuth ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [showSearch, showAuth]);

  useEffect(() => {
    if (!showAuth) {
      setAuthError(null);
      setAuthPassword('');
      setAuthConfirm('');
      setAuthMode('login');
      setAuthEmail(isAuthenticated ? user?.email ?? '' : '');
      setAuthName(isAuthenticated ? user?.name ?? '' : '');
    }
  }, [showAuth, isAuthenticated, user, setAuthMode]);

  const persistHistory = (next: string[]) => {
    setSearchHistory(next);
    localStorage.setItem(historyStorageKey, JSON.stringify(next));
  };

  const handleSearchTrigger = (term: string) => {
    const value = term.trim();
    if (!value) return;
    persistHistory([value, ...searchHistory.filter((item) => item !== value)].slice(0, 6));
    setSearchQuery('');
    setShowSearch(false);
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSearchTrigger(searchQuery);
  };

  const handleAuthSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError(null);

    if (!authEmail.trim()) {
      setAuthError(authContent.email);
      return;
    }

    if (authMode === 'register') {
      if (!authName.trim()) {
        setAuthError(authContent.name || 'Name');
        return;
      }
      if (authPassword !== authConfirm) {
        setAuthError(authContent.passwordMismatch || 'Passwords do not match');
        return;
      }
    }

    login({ email: authEmail, name: authName });
  };

  const handleLogout = () => {
    logout();
    setAuthError(null);
  };

  const hotWords = searchOverlay.hotWords || [];
  const trends = searchOverlay.trendItems || [];

  const avatarInitial = useMemo(() => {
    if (!user?.name) return 'U';
    return user.name.trim().charAt(0).toUpperCase();
  }, [user?.name]);

  return (
    <>
      <header className="app-header">
        <div className="header-left">
          <div
            className="language-selector"
            onClick={() => setShowLangMenu(!showLangMenu)}
          >
            <img
              src={isZh ? cnFlag : usFlag}
              alt={isZh ? 'CN' : 'US'}
              className="flag-icon-large"
            />

            {showLangMenu && (
              <div className="language-menu" onClick={(e) => e.stopPropagation()}>
                <div
                  className={`language-option ${isZh ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    changeLanguage('zh-CN');
                  }}
                >
                  <img src={cnFlag} alt="CN" className="flag-icon" />
                  <span>中文</span>
                </div>
                <div
                  className={`language-option ${!isZh ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    changeLanguage('en-US');
                  }}
                >
                  <img src={usFlag} alt="US" className="flag-icon" />
                  <span>English</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="header-center">
          <svg className="logo-icon" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#D4A574" />
            <path d="M2 17L12 22L22 17" stroke="#D4A574" strokeWidth="2" />
            <path d="M2 12L12 17L22 12" stroke="#D4A574" strokeWidth="2" />
          </svg>
          <span className="logo-text">TreasureX</span>
        </div>

        <div className="header-right">
          <button className="icon-btn search-btn" onClick={() => setShowSearch(true)} aria-label={t('header.search')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
          <button
            className={`icon-btn user-btn ${isAuthenticated ? 'logged-in' : ''}`}
            onClick={() => openAuth('login')}
            aria-label={t('header.user')}
          >
            {isAuthenticated ? (
              <span
                className="user-avatar-initial"
                style={{ background: user?.avatarColor || '#3d8361' }}
              >
                {avatarInitial}
              </span>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            )}
          </button>
        </div>
      </header>

      <div className={`search-overlay ${showSearch ? 'open' : ''}`} aria-hidden={!showSearch}>
        <div className="search-overlay-backdrop" onClick={() => setShowSearch(false)} />
        <div className="search-overlay-body" onClick={(e) => e.stopPropagation()}>
          <div className="search-overlay-header">
            <h2>{searchOverlay.title}</h2>
            <button className="overlay-close-btn" onClick={() => setShowSearch(false)} aria-label="close search">
              <svg viewBox="0 0 24 24" stroke="currentColor" fill="none">
                <line x1="5" y1="5" x2="19" y2="19" />
                <line x1="19" y1="5" x2="5" y2="19" />
              </svg>
            </button>
          </div>
          <form className="search-form" onSubmit={handleSearchSubmit}>
            <span className="search-input-icon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </span>
            <input
              ref={searchInputRef}
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={searchOverlay.placeholder}
            />
            <button type="submit" className="search-submit-btn">GO</button>
          </form>

          {searchHistory.length > 0 && (
            <div className="search-section">
              <div className="search-section-head">
                <span>{searchOverlay.history}</span>
                <button type="button" className="link-btn" onClick={() => persistHistory([])}>
                  {searchOverlay.clear}
                </button>
              </div>
              <div className="search-chips">
                {searchHistory.map((item) => (
                  <button key={item} type="button" onClick={() => handleSearchTrigger(item)}>
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {hotWords.length > 0 && (
            <div className="search-section">
              <div className="search-section-head">
                <span>{searchOverlay.popular}</span>
              </div>
              <div className="search-chips">
                {hotWords.map((word) => (
                  <button key={word} type="button" onClick={() => handleSearchTrigger(word)}>
                    {word}
                  </button>
                ))}
              </div>
            </div>
          )}

          {trends.length > 0 && (
            <div className="search-section">
              <div className="search-section-head">
                <span>{searchOverlay.trendTitle}</span>
              </div>
              <div className="search-trend-list">
                {trends.map((item) => (
                  <button key={item.title} type="button" className="search-trend-item" onClick={() => handleSearchTrigger(item.title)}>
                    <div className="search-trend-main">
                      <span className="trend-title">{item.title}</span>
                      <span className="trend-desc">{item.desc}</span>
                    </div>
                    <span className="trend-action" aria-hidden>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="9 6 15 12 9 18" />
                      </svg>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={`auth-overlay ${showAuth ? 'open' : ''}`} aria-hidden={!showAuth}>
        <div className="auth-backdrop" onClick={closeAuth} />
        <div className="auth-sheet" onClick={(e) => e.stopPropagation()}>
          <div className="auth-drag-handle" />

          {isAuthenticated ? (
            <div className="auth-account-pane">
              <div className="auth-account-header">
                <span
                  className="auth-account-avatar"
                  style={{ background: user?.avatarColor || '#3d8361' }}
                >
                  {avatarInitial}
                </span>
                <div className="auth-account-meta">
                  <h2>{t('auth.loggedInTitle', { name: user?.name || 'Explorer' })}</h2>
                  <p>{user?.email}</p>
                  {authContent.loggedInSubtitle && <span>{authContent.loggedInSubtitle}</span>}
                </div>
              </div>
              <div className="auth-account-actions">
                <button
                  type="button"
                  className="auth-account-btn primary"
                  onClick={() => closeAuth()}
                >
                  {authContent.manageAccount || 'Manage account'}
                </button>
                <button
                  type="button"
                  className="auth-account-btn"
                  onClick={handleLogout}
                >
                  {authContent.logout || 'Log out'}
                </button>
              </div>
              {authContent.loggedInHint && <p className="auth-account-hint">{authContent.loggedInHint}</p>}
            </div>
          ) : (
            <>
              <div className="auth-tabs">
                <button
                  type="button"
                  className={authMode === 'login' ? 'active' : ''}
                  onClick={() => setAuthMode('login')}
                >
                  {authContent.tabs.login}
                </button>
                <button
                  type="button"
                  className={authMode === 'register' ? 'active' : ''}
                  onClick={() => setAuthMode('register')}
                >
                  {authContent.tabs.register}
                </button>
              </div>

              <div className="auth-heading">
                <h2>{authMode === 'login' ? authContent.loginTitle : authContent.registerTitle}</h2>
                <p>{authMode === 'login' ? authContent.loginSubtitle : authContent.registerSubtitle}</p>
              </div>

              {authError && <div className="auth-message error">{authError}</div>}

              <form className="auth-form" onSubmit={handleAuthSubmit}>
                <label className="auth-field">
                  <span>{authContent.email}</span>
                  <input
                    type="email"
                    value={authEmail}
                    onChange={(event) => setAuthEmail(event.target.value)}
                    placeholder="name@example.com"
                    required
                  />
                </label>

                {authMode === 'register' && (
                  <label className="auth-field">
                    <span>{authContent.name || 'Name'}</span>
                    <input
                      type="text"
                      value={authName}
                      onChange={(event) => setAuthName(event.target.value)}
                      placeholder="Charlotte"
                      required
                    />
                  </label>
                )}

                <label className="auth-field">
                  <span>{authContent.password}</span>
                  <input
                    type="password"
                    value={authPassword}
                    onChange={(event) => setAuthPassword(event.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </label>

                {authMode === 'register' && (
                  <label className="auth-field">
                    <span>{authContent.confirmPassword}</span>
                    <input
                      type="password"
                      value={authConfirm}
                      onChange={(event) => setAuthConfirm(event.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </label>
                )}

                {authMode === 'login' && (
                  <div className="auth-form-extra">
                    <button type="button" className="link-btn">
                      {authContent.forgotPassword}
                    </button>
                  </div>
                )}

                <button type="submit" className="auth-submit-btn">
                  {authMode === 'login' ? authContent.ctaLogin : authContent.ctaRegister}
                </button>
              </form>

              <button
                type="button"
                className="auth-switch-btn"
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
              >
                {authMode === 'login' ? authContent.switchToRegister : authContent.switchToLogin}
              </button>

              {authMode === 'register' && (
                <p className="auth-agreement">{authContent.agreement}</p>
              )}

              <div className="auth-feature-list">
                {authContent.features.map((feature) => (
                  <div key={feature.title} className="auth-feature-item">
                    <div className="feature-check" aria-hidden>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="5 12 10 17 19 8" />
                      </svg>
                    </div>
                    <div className="feature-text">
                      <span className="feature-title">{feature.title}</span>
                      <span className="feature-desc">{feature.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;

