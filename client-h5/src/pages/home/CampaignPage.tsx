import React from 'react';
import { useTranslation } from 'react-i18next';
import './CampaignPage.css';

interface CampaignPageProps {
  campaign: {
    type: 'banner' | 'promo';
    title: string;
    subtitle?: string;
    description?: string;
  };
  onBack: () => void;
  onAction?: () => void;
}

const CampaignPage: React.FC<CampaignPageProps> = ({ campaign, onBack, onAction }) => {
  const { t } = useTranslation();

  return (
    <div className="campaign-page">
      {/* 头部 */}
      <div className={`campaign-header ${campaign.type}`}>
        <button className="back-btn-white" onClick={onBack} aria-label="返回">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="campaign-hero">
          <div className="campaign-badge">{campaign.type === 'banner' ? t('campaign.limitedTime') : t('campaign.newUser') || '招募团长'}</div>
          <h1>{campaign.title}</h1>
          {campaign.subtitle && <p className="campaign-subtitle">{campaign.subtitle}</p>}
        </div>
      </div>

      {/* 内容 */}
      <div className="campaign-content">
        {/* 活动详情 */}
        <section className="campaign-card">
          <h2>{t('campaign.detailsTitle')}</h2>
          <div className="campaign-description">
            <p>{campaign.description || t('campaign.defaultDescription')}</p>
          </div>

          {/* 活动亮点 */}
          <div className="highlights-grid">
            <div className="highlight-item">
              <div className="highlight-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <h4>{t('campaign.highlight1Title')}</h4>
              <p>{t('campaign.highlight1Desc')}</p>
            </div>

            <div className="highlight-item">
              <div className="highlight-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <h4>{t('campaign.highlight2Title')}</h4>
              <p>{t('campaign.highlight2Desc')}</p>
            </div>

            <div className="highlight-item">
              <div className="highlight-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                </svg>
              </div>
              <h4>{t('campaign.highlight3Title')}</h4>
              <p>{t('campaign.highlight3Desc')}</p>
            </div>
          </div>
        </section>

        {/* 活动规则 */}
        <section className="campaign-card">
          <h2>{t('campaign.rulesTitle')}</h2>
          <div className="rules-timeline">
            <div className="timeline-item">
              <div className="timeline-marker">1</div>
              <div className="timeline-content">
                <h4>{t('campaign.step1Title')}</h4>
                <p>{t('campaign.step1Desc')}</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-marker">2</div>
              <div className="timeline-content">
                <h4>{t('campaign.step2Title')}</h4>
                <p>{t('campaign.step2Desc')}</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-marker">3</div>
              <div className="timeline-content">
                <h4>{t('campaign.step3Title')}</h4>
                <p>{t('campaign.step3Desc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 推荐商品 */}
        <section className="campaign-card">
          <h2>{t('campaign.recommendedTitle')}</h2>
          <div className="recommended-products">
            {[
              { id: 1, key: 'antiqueWatch', image: 'watch', price: 188 },
              { id: 2, key: 'rareStamps', image: 'stamps', price: 99 },
              { id: 3, key: 'vintageCamera', image: 'camera', price: 850 }
            ].map((product) => (
              <div key={product.id} className="product-mini-card">
                <div className="product-mini-image" style={{
                  backgroundImage: `url(/images/product-${product.image}.svg)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}>
                  <span className="product-mini-tag">{t('campaign.hot')}</span>
                </div>
                <h4 className="product-mini-title">{t(`products.${product.key}`)}</h4>
                <div className="product-mini-footer">
                  <span className="product-mini-price">¥{product.price.toFixed(2)}</span>
                  <button className="product-mini-btn">{t('campaign.view')}</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 注意事项 */}
        <section className="campaign-card">
          <h2>{t('campaign.noticeTitle')}</h2>
          <div className="notice-list">
            <div className="notice-item">
              <span className="notice-dot">•</span>
              <p>{t('campaign.notice1')}</p>
            </div>
            <div className="notice-item">
              <span className="notice-dot">•</span>
              <p>{t('campaign.notice2')}</p>
            </div>
            <div className="notice-item">
              <span className="notice-dot">•</span>
              <p>{t('campaign.notice3')}</p>
            </div>
          </div>
        </section>
      </div>

      {/* 底部按钮 */}
      <div className="campaign-footer">
        <button className="campaign-action-btn" onClick={onAction}>
          {campaign.type === 'banner' ? t('campaign.joinNow') : t('campaign.startGroup')}
        </button>
      </div>
    </div>
  );
};

export default CampaignPage;

