import React from 'react';
import { useTranslation } from 'react-i18next';
import './TrendingDetail.css';

interface TrendingDetailProps {
  trending: {
    title: string;
    category: string;
    desc: string;
    heat: string;
    time: string;
  };
  onBack: () => void;
  onSubscribe?: () => void;
}

const TrendingDetail: React.FC<TrendingDetailProps> = ({ trending, onBack, onSubscribe }) => {
  const { t } = useTranslation();

  return (
    <div className="trending-detail-page">
      {/* 头部 */}
      <div className="trending-detail-header">
        <button className="back-btn-white" onClick={onBack} aria-label="返回">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="trending-hero">
          <div className="trending-badge">{trending.category}</div>
          <h1>{trending.title}</h1>
          <div className="trending-meta">
            <span className="trending-heat">{trending.heat}</span>
            <span className="trending-divider">·</span>
            <span className="trending-time">{trending.time}</span>
          </div>
        </div>
      </div>

      {/* 内容 */}
      <div className="trending-detail-content">
        {/* 活动概览 */}
        <section className="trending-card">
          <h2>{t('discover.sheet.trending.title', { title: '' }).replace('：', '')}</h2>
          <div className="trending-description">
            <p>{trending.desc}</p>
          </div>

          {/* 活动亮点 */}
          <div className="highlights-grid">
            <div className="highlight-item">
              <div className="highlight-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <h4>精选展品</h4>
              <p>严格筛选的珍稀藏品，每件都有官方鉴定证书</p>
            </div>
            <div className="highlight-item">
              <div className="highlight-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M17 21v-2a4 0 0 0-4-4H5a4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h4>专家导览</h4>
              <p>专业讲解员全程陪同，深度解读每件藏品背后的故事</p>
            </div>
            <div className="highlight-item">
              <div className="highlight-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <h4>限时专享</h4>
              <p>仅限本周，名额有限，先到先得</p>
            </div>
          </div>
        </section>

        {/* 活动详情 */}
        <section className="trending-card">
          <h2>活动详情</h2>
          <div className="info-list">
            <div className="info-item">
              <div className="info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <div className="info-content">
                <h4>活动时间</h4>
                <p>2025年11月20日 - 11月25日</p>
                <p className="info-hint">每日10:00-18:00开放</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div className="info-content">
                <h4>活动地点</h4>
                <p>北京市朝阳区艺术中心</p>
                <p className="info-hint">地铁10号线 · 艺术区站B口</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 21v-2a4 0 0 0-4-4H8a4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div className="info-content">
                <h4>参与人数</h4>
                <p>限额 200 人</p>
                <p className="info-hint">已有 158 人报名</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <div className="info-content">
                <h4>参与费用</h4>
                <p>¥ 188 / 人</p>
                <p className="info-hint">包含门票、导览、茶点</p>
              </div>
            </div>
          </div>
        </section>

        {/* 参与须知 */}
        <section className="trending-card">
          <h2>参与须知</h2>
          <div className="notice-list">
            <div className="notice-item">
              <span className="notice-number">1</span>
              <p>请提前15分钟到达现场签到，凭报名信息入场</p>
            </div>
            <div className="notice-item">
              <span className="notice-number">2</span>
              <p>展品禁止触摸，拍照请关闭闪光灯</p>
            </div>
            <div className="notice-item">
              <span className="notice-number">3</span>
              <p>建议穿着舒适的鞋履，全程约需2-3小时</p>
            </div>
            <div className="notice-item">
              <span className="notice-number">4</span>
              <p>如需取消报名，请至少提前24小时通知</p>
            </div>
          </div>
        </section>
      </div>

      {/* 底部操作栏 */}
      <div className="trending-detail-footer">
        <div className="footer-info">
          <div className="footer-label">活动费用</div>
          <div className="footer-price">¥ 188</div>
        </div>
        <button 
          className="subscribe-btn"
          onClick={() => {
            if (onSubscribe) onSubscribe();
            else alert(t('discover.sheet.trending.cta'));
          }}
        >
          {t('discover.sheet.trending.cta')}
        </button>
      </div>
    </div>
  );
};

export default TrendingDetail;

