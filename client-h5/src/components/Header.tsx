import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import cnFlag from '../assets/flags/cn.svg';
import usFlag from '../assets/flags/us.svg';
import './Header.css';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [showLangMenu, setShowLangMenu] = useState(false);
  
  const currentLanguage = i18n.language;
  const isZh = currentLanguage === 'zh-CN';
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
    setShowLangMenu(false);
  };

  return (
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
            <div
              className="language-menu"
              onClick={(e) => e.stopPropagation()}
            >
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
          <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#D4A574"/>
          <path d="M2 17L12 22L22 17" stroke="#D4A574" strokeWidth="2"/>
          <path d="M2 12L12 17L22 12" stroke="#D4A574" strokeWidth="2"/>
        </svg>
        <span className="logo-text">TreasureX</span>
      </div>
      
      <div className="header-right">
        <button className="icon-btn search-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
        </button>
        <button className="icon-btn user-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;

