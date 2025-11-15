import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import { TeamsService } from '../../services/teams.service';
import './InviteMembersPage.css';

interface InviteMembersPageProps {
  onBack: () => void;
}

const InviteMembersPage: React.FC<InviteMembersPageProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [teamId, setTeamId] = useState<number | null>(null);
  const [inviteLink, setInviteLink] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchTeamInfo = async () => {
      try {
        const overview = await TeamsService.getMyTeamOverview();
        if (overview?.team?.id) {
          setTeamId(overview.team.id);
          // 生成邀请链接和邀请码
          const baseUrl = window.location.origin;
          const link = `${baseUrl}/invite?team=${overview.team.id}&code=${overview.team.id}`;
          setInviteLink(link);
          setInviteCode(`TEAM${overview.team.id.toString().padStart(6, '0')}`);
        }
      } catch (error) {
        console.error('获取团队信息失败:', error);
        // 如果用户不是团队长，生成通用邀请链接
        const baseUrl = window.location.origin;
        setInviteLink(`${baseUrl}/register?ref=${user?.id || ''}`);
        setInviteCode(`USER${user?.id || '000000'}`);
      }
    };

    fetchTeamInfo();
  }, [user]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      alert(t('group.invite.copyFailed') || '复制失败，请手动复制');
    });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      alert(t('group.invite.copyFailed') || '复制失败，请手动复制');
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: t('group.invite.shareTitle') || '邀请您加入我的团购团队',
        text: t('group.invite.shareText') || '快来加入我的团购团队，一起享受优惠！',
        url: inviteLink,
      }).catch(() => {
        // 用户取消分享
      });
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="invite-members-container">
      <Header onBack={onBack} title={t('group.invite.title') || '邀请成员'} />
      <div className="invite-members-content">
        <section className="invite-hero">
          <div className="invite-hero-content">
            <div className="invite-icon-wrapper">
              <div className="invite-icon">👥</div>
            </div>
            <div className="invite-hero-text">
              <h1>{t('group.invite.heroTitle') || '邀请好友加入团队'}</h1>
              <p>{t('group.invite.heroDesc') || '分享邀请链接或邀请码，邀请好友一起参与团购'}</p>
            </div>
          </div>
        </section>

        {/* 邀请链接 */}
        <section className="invite-section">
          <h2>{t('group.invite.linkTitle') || '邀请链接'}</h2>
          <div className="invite-link-card">
            <div className="invite-link-display">
              <button
                className={`copy-btn copy-btn-left ${copied ? 'copied' : ''}`}
                onClick={handleCopyLink}
              >
                {copied ? (t('group.invite.copied') || '已复制') : (t('group.invite.copy') || '复制')}
              </button>
              <input
                type="text"
                value={inviteLink}
                readOnly
                className="invite-link-input"
              />
            </div>
            <p className="invite-hint">{t('group.invite.linkHint') || '分享此链接给好友，好友点击链接即可加入'}</p>
          </div>
        </section>

        {/* 邀请码 */}
        <section className="invite-section">
          <h2>{t('group.invite.codeTitle') || '邀请码'}</h2>
          <div className="invite-code-card">
            <div className="invite-code-display">
              <span className="invite-code-text">{inviteCode || 'USER4'}</span>
            </div>
            <button
              className={`copy-btn copy-btn-full ${copied ? 'copied' : ''}`}
              onClick={handleCopyCode}
            >
              {copied ? (t('group.invite.copied') || '已复制') : (t('group.invite.copy') || '复制')}
            </button>
            <p className="invite-hint" style={{ marginTop: '12px' }}>
              {t('group.invite.codeHint') || '好友注册时输入此邀请码即可加入您的团队'}
            </p>
          </div>
        </section>

        {/* 分享按钮 */}
        <section className="invite-section">
          <button className="share-invite-btn" onClick={handleShare}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            {t('group.invite.share') || '分享邀请'}
          </button>
        </section>

        {/* 邀请统计 */}
        <section className="invite-stats">
          <h2>{t('group.invite.statsTitle') || '邀请统计'}</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">{t('group.invite.totalInvites') || '累计邀请'}</span>
              <strong className="stat-value">0</strong>
            </div>
            <div className="stat-item">
              <span className="stat-label">{t('group.invite.activeMembers') || '活跃成员'}</span>
              <strong className="stat-value">0</strong>
            </div>
            <div className="stat-item">
              <span className="stat-label">{t('group.invite.totalRewards') || '累计奖励'}</span>
              <strong className="stat-value">¥0</strong>
            </div>
          </div>
        </section>

        {/* 邀请说明 */}
        <section className="invite-tips">
          <h3>{t('group.invite.tipsTitle') || '邀请说明'}</h3>
          <ul>
            <li>{t('group.invite.tip1') || '好友通过您的邀请链接注册并完成首次购买，您将获得奖励'}</li>
            <li>{t('group.invite.tip2') || '邀请的好友越多，您获得的奖励越多'}</li>
            <li>{t('group.invite.tip3') || '奖励将在好友完成首次购买后自动发放到您的账户'}</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default InviteMembersPage;

