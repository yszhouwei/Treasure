import React from 'react';
import { useTranslation } from 'react-i18next';
import './MissionDetail.css';

interface MissionDetailProps {
  mission: {
    title: string;
    desc: string;
    progress: number;
    reward: string;
  };
  onBack: () => void;
  onStart?: () => void;
}

const MissionDetail: React.FC<MissionDetailProps> = ({ mission, onBack, onStart }) => {
  const { t } = useTranslation();

  // 任务步骤
  const steps = [
    { id: 1, title: '邀请好友注册', desc: '分享邀请链接给好友', completed: true },
    { id: 2, title: '好友完成首单', desc: '好友成功参与第一次团购', completed: true },
    { id: 3, title: '达成邀请目标', desc: '成功邀请5位好友', completed: false },
  ];

  const completedSteps = steps.filter(s => s.completed).length;

  return (
    <div className="mission-detail-page">
      {/* 头部 */}
      <div className="mission-detail-header">
        <button className="back-btn-white" onClick={onBack} aria-label="返回">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="mission-hero">
          <div className="mission-badge">🎯 成长任务</div>
          <h1>{mission.title}</h1>
          <p className="mission-subtitle">{mission.desc}</p>
        </div>
      </div>

      {/* 内容 */}
      <div className="mission-detail-content">
        {/* 任务进度 */}
        <section className="mission-card">
          <h2>任务进度</h2>
          <div className="progress-overview">
            <div className="progress-circle">
              <svg className="progress-ring" width="120" height="120">
                <circle
                  className="progress-ring-background"
                  cx="60"
                  cy="60"
                  r="52"
                />
                <circle
                  className="progress-ring-progress"
                  cx="60"
                  cy="60"
                  r="52"
                  style={{
                    strokeDasharray: `${2 * Math.PI * 52}`,
                    strokeDashoffset: `${2 * Math.PI * 52 * (1 - mission.progress / 100)}`
                  }}
                />
              </svg>
              <div className="progress-text">
                <span className="progress-percent">{mission.progress}%</span>
                <span className="progress-label">完成度</span>
              </div>
            </div>
            <div className="progress-stats">
              <div className="progress-stat-item">
                <span className="progress-stat-value">{completedSteps}</span>
                <span className="progress-stat-label">已完成步骤</span>
              </div>
              <div className="progress-stat-item">
                <span className="progress-stat-value">{steps.length - completedSteps}</span>
                <span className="progress-stat-label">剩余步骤</span>
              </div>
            </div>
          </div>
        </section>

        {/* 任务步骤 */}
        <section className="mission-card">
          <h2>任务步骤</h2>
          <div className="mission-steps">
            {steps.map((step, index) => (
              <div key={step.id} className={`mission-step ${step.completed ? 'completed' : ''}`}>
                <div className="step-marker">
                  {step.completed ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="step-content">
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                  {step.completed && (
                    <span className="step-completed-badge">✓ 已完成</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 任务奖励 */}
        <section className="mission-card reward-card">
          <h2>任务奖励</h2>
          <div className="reward-content">
            <div className="reward-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="8" r="7"/>
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
              </svg>
            </div>
            <div className="reward-info">
              <h3>{mission.reward}</h3>
              <p>完成任务后自动发放到账户</p>
            </div>
          </div>
          <div className="reward-extras">
            <div className="extra-item">
              <span className="extra-icon">🎁</span>
              <span>额外赠送神秘礼包</span>
            </div>
            <div className="extra-item">
              <span className="extra-icon">⭐</span>
              <span>获得专属成就徽章</span>
            </div>
          </div>
        </section>

        {/* 任务规则 */}
        <section className="mission-card">
          <h2>任务规则</h2>
          <div className="rules-list">
            <div className="rule-item">
              <span className="rule-number">1</span>
              <p>任务需要在有效期内完成，逾期将自动失效</p>
            </div>
            <div className="rule-item">
              <span className="rule-number">2</span>
              <p>邀请的好友必须是新注册用户，且完成实名认证</p>
            </div>
            <div className="rule-item">
              <span className="rule-number">3</span>
              <p>好友首单金额需满¥50才算完成邀请</p>
            </div>
            <div className="rule-item">
              <span className="rule-number">4</span>
              <p>任务奖励将在完成后24小时内发放</p>
            </div>
          </div>
        </section>

        {/* 进度里程碑 */}
        <section className="mission-card">
          <h2>进度里程碑</h2>
          <div className="milestones">
            <div className="milestone-item achieved">
              <div className="milestone-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <div className="milestone-content">
                <h4>20% 进度</h4>
                <p>解锁基础奖励：+10积分</p>
              </div>
            </div>

            <div className="milestone-item achieved">
              <div className="milestone-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <div className="milestone-content">
                <h4>50% 进度</h4>
                <p>解锁进阶奖励：+50积分</p>
              </div>
            </div>

            <div className="milestone-item">
              <div className="milestone-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                </svg>
              </div>
              <div className="milestone-content">
                <h4>100% 进度</h4>
                <p>解锁终极奖励：{mission.reward}</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 底部操作栏 */}
      <div className="mission-detail-footer">
        {mission.progress < 100 ? (
          <button 
            className="mission-action-btn"
            onClick={() => {
              if (onStart) onStart();
              else alert(t('treasure.sheet.mission.cta'));
            }}
          >
            {mission.progress === 0 ? '开始任务' : '继续完成'}
          </button>
        ) : (
          <button className="mission-action-btn completed" disabled>
            任务已完成
          </button>
        )}
      </div>
    </div>
  );
};

export default MissionDetail;

