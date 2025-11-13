import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import cnFlag from '../assets/flags/cn.svg';
import usFlag from '../assets/flags/us.svg';
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
  password: string;
  confirmPassword: string;
  forgotPassword: string;
  ctaLogin: string;
  ctaRegister: string;
  switchToRegister: string;
  switchToLogin: string;
  agreement: string;
  features: AuthFeature[];
}

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const searchOverlay = t('searchOverlay', { returnObjects: true }) as SearchOverlayContent;
  const authContent = t('auth', { returnObjects: true }) as AuthContent;

  const currentLanguage = i18n.language;
  const isZh = currentLanguage === 'zh-CN';

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
    setShowLangMenu(false);
  };

  useEffect(() => {
    const initialHistory = (i18n.t('searchOverlay.historyItems', { returnObjects: true }) as string[]) || [];
    setSearchHistory(initialHistory);
  }, [i18n.language]);

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

  const handleSearchTrigger = (term: string) => {
    const value = term.trim();
    if (!value) return;
    setSearchHistory((prev) => {
      const next = [value, ...prev.filter((item) => item !== value)];
      return next.slice(0, 6);
    });
    setSearchQuery('');
    setShowSearch(false);
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSearchTrigger(searchQuery);
  };

  const handleAuthSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowAuth(false);
    setAuthMode('login');
  };

  const hotWords = searchOverlay.hotWords || [];
  const trends = searchOverlay.trendItems || [];

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
            className="icon-btn user-btn"
            onClick={() => {
              setAuthMode('login');
              setShowAuth(true);
            }}
            aria-label={t('header.user')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
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
                <button type="button" className="link-btn" onClick={() => setSearchHistory([])}>
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
        <div className="auth-backdrop" onClick={() => setShowAuth(false)} />
        <div className="auth-sheet" onClick={(e) => e.stopPropagation()}>
          <div className="auth-drag-handle" />
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

          <form className="auth-form" onSubmit={handleAuthSubmit}>
            <label className="auth-field">
              <span>{authContent.email}</span>
              <input type="email" placeholder="name@example.com" required />
            </label>
            <label className="auth-field">
              <span>{authContent.password}</span>
              <input type="password" placeholder="••••••••" required />
            </label>
            {authMode === 'register' && (
              <label className="auth-field">
                <span>{authContent.confirmPassword}</span>
                <input type="password" placeholder="••••••••" required />
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
            onClick={() => setAuthMode((mode) => (mode === 'login' ? 'register' : 'login'))}
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
        </div>
      </div>
    </>
  );
};

export default Header;

