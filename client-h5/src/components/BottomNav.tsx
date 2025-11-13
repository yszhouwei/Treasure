import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './BottomNav.css';

const BottomNav: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('home');

  const navItems = [
    {
      id: 'home',
      label: t('nav.home'),
      icon: (active: boolean) => (
        <svg viewBox="0 0 24 24" fill={active ? '#D4A574' : 'none'} stroke={active ? '#D4A574' : 'currentColor'}>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      )
    },
    {
      id: 'discover',
      label: t('nav.discover'),
      icon: (active: boolean) => (
        <svg viewBox="0 0 24 24" fill="none" stroke={active ? '#D4A574' : 'currentColor'}>
          <circle cx="12" cy="12" r="10"/>
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={active ? '#D4A574' : 'none'}/>
        </svg>
      )
    },
    {
      id: 'treasure',
      label: t('nav.treasure'),
      icon: (active: boolean) => (
        <svg viewBox="0 0 24 24" fill="none" stroke={active ? '#D4A574' : 'currentColor'}>
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
      )
    },
    {
      id: 'group',
      label: t('nav.group'),
      icon: (active: boolean) => (
        <svg viewBox="0 0 24 24" fill="none" stroke={active ? '#D4A574' : 'currentColor'}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      )
    },
    {
      id: 'profile',
      label: t('nav.profile'),
      icon: (active: boolean) => (
        <svg viewBox="0 0 24 24" fill="none" stroke={active ? '#D4A574' : 'currentColor'}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      )
    }
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map(item => (
        <button
          key={item.id}
          className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
          onClick={() => setActiveTab(item.id)}
        >
          <div className="nav-icon">
            {item.icon(activeTab === item.id)}
          </div>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;

