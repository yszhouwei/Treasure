import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';
import './SettingsPage.css';

interface SettingsPageProps {
  onBack: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
  const { t, i18n } = useTranslation();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="settings-page-container">
      <Header onBack={onBack} title={t('profile.settings.title')} />
      
      <div className="settings-page-content">
        <section className="settings-section">
          <h2 className="settings-section-title">{t('profile.settings.general')}</h2>
          
          <div className="settings-item">
            <div className="settings-item-left">
              <span className="settings-item-icon">🌍</span>
              <span className="settings-item-label">{t('profile.settings.language')}</span>
            </div>
            <div className="settings-item-right">
              <select className="settings-select" value={i18n.language} onChange={(e) => handleLanguageChange(e.target.value)}>
                <option value="zh-CN">简体中文</option>
                <option value="en-US">English</option>
              </select>
            </div>
          </div>

          <div className="settings-item">
            <div className="settings-item-left">
              <span className="settings-item-icon">🌙</span>
              <span className="settings-item-label">{t('profile.settings.darkMode')}</span>
            </div>
            <div className="settings-item-right">
              <label className="settings-switch">
                <input type="checkbox" />
                <span className="settings-slider"></span>
              </label>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <h2 className="settings-section-title">{t('profile.settings.notifications')}</h2>
          
          <div className="settings-item">
            <div className="settings-item-left">
              <span className="settings-item-icon">📱</span>
              <span className="settings-item-label">{t('profile.settings.pushNotifications')}</span>
            </div>
            <div className="settings-item-right">
              <label className="settings-switch">
                <input type="checkbox" checked={pushEnabled} onChange={(e) => setPushEnabled(e.target.checked)} />
                <span className="settings-slider"></span>
              </label>
            </div>
          </div>

          <div className="settings-item">
            <div className="settings-item-left">
              <span className="settings-item-icon">📧</span>
              <span className="settings-item-label">{t('profile.settings.emailNotifications')}</span>
            </div>
            <div className="settings-item-right">
              <label className="settings-switch">
                <input type="checkbox" checked={emailEnabled} onChange={(e) => setEmailEnabled(e.target.checked)} />
                <span className="settings-slider"></span>
              </label>
            </div>
          </div>

          <div className="settings-item">
            <div className="settings-item-left">
              <span className="settings-item-icon">🔔</span>
              <span className="settings-item-label">{t('profile.settings.soundEffects')}</span>
            </div>
            <div className="settings-item-right">
              <label className="settings-switch">
                <input type="checkbox" checked={soundEnabled} onChange={(e) => setSoundEnabled(e.target.checked)} />
                <span className="settings-slider"></span>
              </label>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <h2 className="settings-section-title">{t('profile.settings.privacy')}</h2>
          
          <div className="settings-item">
            <div className="settings-item-left">
              <span className="settings-item-icon">👁️</span>
              <span className="settings-item-label">{t('profile.settings.profileVisibility')}</span>
            </div>
            <div className="settings-item-right">
              <select className="settings-select">
                <option>{t('profile.settings.public')}</option>
                <option>{t('profile.settings.friends')}</option>
                <option>{t('profile.settings.private')}</option>
              </select>
            </div>
          </div>

          <div className="settings-item">
            <div className="settings-item-left">
              <span className="settings-item-icon">📊</span>
              <span className="settings-item-label">{t('profile.settings.dataCollection')}</span>
            </div>
            <div className="settings-item-right">
              <label className="settings-switch">
                <input type="checkbox" defaultChecked />
                <span className="settings-slider"></span>
              </label>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <h2 className="settings-section-title">{t('profile.settings.about')}</h2>
          
          <div className="settings-item">
            <div className="settings-item-left">
              <span className="settings-item-icon">ℹ️</span>
              <span className="settings-item-label">{t('profile.settings.version')}</span>
            </div>
            <div className="settings-item-right">
              <span className="settings-value">v1.0.0</span>
            </div>
          </div>

          <div className="settings-item">
            <div className="settings-item-left">
              <span className="settings-item-icon">📄</span>
              <span className="settings-item-label">{t('profile.settings.terms')}</span>
            </div>
            <div className="settings-item-right">
              <span className="settings-arrow">›</span>
            </div>
          </div>

          <div className="settings-item">
            <div className="settings-item-left">
              <span className="settings-item-icon">🔒</span>
              <span className="settings-item-label">{t('profile.settings.privacy')}</span>
            </div>
            <div className="settings-item-right">
              <span className="settings-arrow">›</span>
            </div>
          </div>
        </section>

        <button className="settings-clear-cache-btn">{t('profile.settings.clearCache')}</button>
      </div>
    </div>
  );
};

export default SettingsPage;

