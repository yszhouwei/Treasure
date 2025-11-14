import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';
import './InvitePage.css';

interface InvitePageProps {
  onBack: () => void;
}

const InvitePage: React.FC<InvitePageProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const inviteCode = 'TBX2025';
  const inviteLink = 'https://treasure.com/invite/TBX2025';

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      alert(t('profile.invite.linkCopied'));
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = (platform: string) => {
    alert(`${t('profile.invite.shareVia')} ${platform}`);
  };

  return (
    <div className="invite-page-container">
      <Header onBack={onBack} title={t('profile.invite.title')} />
      
      <div className="invite-page-content">
        <section className="invite-hero-card">
          <div className="invite-hero-icon">🎁</div>
          <h2 className="invite-hero-title">{t('profile.invite.heroTitle')}</h2>
          <p className="invite-hero-subtitle">{t('profile.invite.heroSubtitle')}</p>
          
          <div className="invite-rewards">
            <div className="invite-reward-item">
              <div className="invite-reward-icon">💰</div>
              <div className="invite-reward-value">¥50</div>
              <div className="invite-reward-label">{t('profile.invite.rewardYou')}</div>
            </div>
            <div className="invite-reward-divider">+</div>
            <div className="invite-reward-item">
              <div className="invite-reward-icon">🎉</div>
              <div className="invite-reward-value">¥50</div>
              <div className="invite-reward-label">{t('profile.invite.rewardFriend')}</div>
            </div>
          </div>
        </section>

        <section className="invite-code-section">
          <h2 className="invite-section-title">{t('profile.invite.inviteCode')}</h2>
          
          <div className="invite-code-card">
            <div className="invite-code-display">
              <span className="invite-code-label">{t('profile.invite.codeLabel')}</span>
              <span className="invite-code-value">{inviteCode}</span>
            </div>
            <button className="invite-copy-btn" onClick={handleCopyCode}>
              {copied ? t('profile.invite.copied') : t('profile.invite.copy')}
            </button>
          </div>

          <div className="invite-link-card">
            <div className="invite-link-display">
              <span className="invite-link-label">{t('profile.invite.linkLabel')}</span>
              <span className="invite-link-value">{inviteLink}</span>
            </div>
            <button className="invite-copy-btn" onClick={handleCopyLink}>
              {t('profile.invite.copyLink')}
            </button>
          </div>
        </section>

        <section className="invite-share-section">
          <h2 className="invite-section-title">{t('profile.invite.shareTitle')}</h2>
          
          <div className="invite-share-btns">
            <button className="invite-share-btn wechat" onClick={() => handleShare('WeChat')}>
              <span className="invite-share-icon">💬</span>
              <span className="invite-share-name">WeChat</span>
            </button>
            <button className="invite-share-btn moments" onClick={() => handleShare('Moments')}>
              <span className="invite-share-icon">🔄</span>
              <span className="invite-share-name">Moments</span>
            </button>
            <button className="invite-share-btn qq" onClick={() => handleShare('QQ')}>
              <span className="invite-share-icon">🐧</span>
              <span className="invite-share-name">QQ</span>
            </button>
            <button className="invite-share-btn weibo" onClick={() => handleShare('Weibo')}>
              <span className="invite-share-icon">📱</span>
              <span className="invite-share-name">Weibo</span>
            </button>
          </div>
        </section>

        <section className="invite-stats-section">
          <h2 className="invite-section-title">{t('profile.invite.statsTitle')}</h2>
          
          <div className="invite-stats-grid">
            <div className="invite-stat-card">
              <div className="invite-stat-value">12</div>
              <div className="invite-stat-label">{t('profile.invite.totalInvites')}</div>
            </div>
            <div className="invite-stat-card">
              <div className="invite-stat-value">8</div>
              <div className="invite-stat-label">{t('profile.invite.registered')}</div>
            </div>
            <div className="invite-stat-card">
              <div className="invite-stat-value">¥400</div>
              <div className="invite-stat-label">{t('profile.invite.totalRewards')}</div>
            </div>
          </div>
        </section>

        <section className="invite-history-section">
          <h2 className="invite-section-title">{t('profile.invite.historyTitle')}</h2>
          
          <div className="invite-history-list">
            <div className="invite-history-item">
              <div className="invite-history-left">
                <div className="invite-history-avatar">A</div>
                <div className="invite-history-info">
                  <div className="invite-history-name">{t('profile.invite.friend1')}</div>
                  <div className="invite-history-date">2025-11-12 14:30</div>
                </div>
              </div>
              <div className="invite-history-right">
                <div className="invite-history-reward">+¥50</div>
                <div className="invite-history-status success">{t('profile.invite.statusSuccess')}</div>
              </div>
            </div>
            <div className="invite-history-item">
              <div className="invite-history-left">
                <div className="invite-history-avatar">B</div>
                <div className="invite-history-info">
                  <div className="invite-history-name">{t('profile.invite.friend2')}</div>
                  <div className="invite-history-date">2025-11-10 09:15</div>
                </div>
              </div>
              <div className="invite-history-right">
                <div className="invite-history-reward">+¥50</div>
                <div className="invite-history-status success">{t('profile.invite.statusSuccess')}</div>
              </div>
            </div>
            <div className="invite-history-item">
              <div className="invite-history-left">
                <div className="invite-history-avatar">C</div>
                <div className="invite-history-info">
                  <div className="invite-history-name">{t('profile.invite.friend3')}</div>
                  <div className="invite-history-date">2025-11-08 16:45</div>
                </div>
              </div>
              <div className="invite-history-right">
                <div className="invite-history-reward">+¥0</div>
                <div className="invite-history-status pending">{t('profile.invite.statusPending')}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="invite-rules-section">
          <h2 className="invite-section-title">{t('profile.invite.rulesTitle')}</h2>
          
          <div className="invite-rules-content">
            <ul className="invite-rules-list">
              <li>{t('profile.invite.rule1')}</li>
              <li>{t('profile.invite.rule2')}</li>
              <li>{t('profile.invite.rule3')}</li>
              <li>{t('profile.invite.rule4')}</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default InvitePage;

