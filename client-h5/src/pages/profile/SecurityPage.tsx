import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';
import './SecurityPage.css';

interface SecurityPageProps {
  onBack: () => void;
}

const SecurityPage: React.FC<SecurityPageProps> = ({ onBack }) => {
  const { t } = useTranslation();

  const securityItems = [
    { id: 'password', icon: '🔐', title: t('profile.security.password'), desc: t('profile.security.passwordDesc'), status: t('profile.security.strong') },
    { id: 'twoFactor', icon: '📱', title: t('profile.security.twoFactor'), desc: t('profile.security.twoFactorDesc'), status: t('profile.security.enabled') },
    { id: 'email', icon: '📧', title: t('profile.security.emailVerify'), desc: t('profile.security.emailDesc'), status: t('profile.security.verified') },
    { id: 'phone', icon: '📞', title: t('profile.security.phoneVerify'), desc: t('profile.security.phoneDesc'), status: t('profile.security.verified') },
  ];

  const loginHistory = [
    { device: 'iPhone 15 Pro', location: t('profile.security.location1'), time: '2025-11-14 10:28', current: true },
    { device: 'Chrome (Windows)', location: t('profile.security.location2'), time: '2025-11-13 15:30', current: false },
    { device: 'Safari (Mac)', location: t('profile.security.location3'), time: '2025-11-12 09:15', current: false },
  ];

  return (
    <div className="security-page-container">
      <Header onBack={onBack} title={t('profile.security.title')} />
      
      <div className="security-page-content">
        <section className="security-status-card">
          <div className="security-status-icon">🛡️</div>
          <div className="security-status-content">
            <h2 className="security-status-title">{t('profile.security.statusTitle')}</h2>
            <p className="security-status-subtitle">{t('profile.security.statusDesc')}</p>
            <div className="security-score">
              <div className="security-score-label">{t('profile.security.securityScore')}</div>
              <div className="security-score-value">95</div>
            </div>
          </div>
        </section>

        <section className="security-items-section">
          <h2 className="security-section-title">{t('profile.security.settingsTitle')}</h2>
          
          <div className="security-items-list">
            {securityItems.map((item) => (
              <div key={item.id} className="security-item">
                <div className="security-item-left">
                  <span className="security-item-icon">{item.icon}</span>
                  <div className="security-item-info">
                    <div className="security-item-title">{item.title}</div>
                    <div className="security-item-desc">{item.desc}</div>
                  </div>
                </div>
                <div className="security-item-right">
                  <span className="security-item-status">{item.status}</span>
                  <span className="security-item-arrow">›</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="security-history-section">
          <h2 className="security-section-title">{t('profile.security.loginHistory')}</h2>
          
          <div className="security-history-list">
            {loginHistory.map((record, index) => (
              <div key={index} className="security-history-item">
                <div className="security-history-left">
                  <div className="security-history-device">{record.device}</div>
                  <div className="security-history-location">{record.location}</div>
                  <div className="security-history-time">{record.time}</div>
                </div>
                {record.current && (
                  <div className="security-history-badge">{t('profile.security.currentDevice')}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SecurityPage;

