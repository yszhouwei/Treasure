import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './ProductDetail.css';

interface ProductDetailProps {
  product: {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    participants?: number;
    total?: number;
    status: string;
    tag: string;
    description?: string;
    images?: string[];
  };
  onBack: () => void;
  onJoin?: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onJoin }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'detail' | 'rules' | 'comments'>('detail');

  return (
    <div className="product-detail-page">
      {/* 头部导航 */}
      <div className="product-detail-header">
        <button className="back-btn" onClick={onBack} aria-label="返回">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1>{t('productDetail.title')}</h1>
        <button className="share-btn" aria-label="分享">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="18" cy="5" r="3"/>
            <circle cx="6" cy="12" r="3"/>
            <circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
        </button>
      </div>

      {/* 商品主图 */}
      <div className="product-main-image">
        <div 
          className="product-image-wrapper"
          style={{ 
            backgroundImage: product.images?.[0] 
              ? `url(${product.images[0]})` 
              : `url(/images/product-${product.id === 1 ? 'watch' : product.id === 2 ? 'stamps' : product.id === 3 ? 'camera' : 'keyboard'}.svg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <span className="product-tag-badge">{product.tag}</span>
          <span className="product-status-badge">{product.status}</span>
        </div>
        {product.images && product.images.length > 1 && (
          <div className="image-indicators">
            {product.images.map((_, index) => (
              <span key={index} className={index === 0 ? 'active' : ''} />
            ))}
          </div>
        )}
      </div>

      {/* 商品信息 */}
      <div className="product-info-section">
        <div className="product-title-row">
          <h2>{product.name}</h2>
        </div>
        
        <div className="product-price-row">
          <div className="price-group">
            <span className="label">{t('productDetail.groupPrice')}</span>
            <strong className="current-price">¥{product.price.toFixed(2)}</strong>
            {product.originalPrice && (
              <span className="original-price">¥{product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          {product.participants !== undefined && (
            <div className="participants-info">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <span>{t('productDetail.participants', { count: product.participants })}</span>
            </div>
          )}
        </div>

        {product.description && (
          <p className="product-brief">{product.description}</p>
        )}
      </div>

      {/* 团购进度 */}
      {product.participants !== undefined && product.total !== undefined && (
        <div className="group-progress-section">
          <div className="progress-header">
            <span>{t('productDetail.progress')}</span>
            <span className="progress-text">
              {product.participants}/{product.total}
            </span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(product.participants / product.total) * 100}%` }}
            />
          </div>
          <p className="progress-hint">{t('productDetail.progressHint', { remaining: product.total - product.participants })}</p>
        </div>
      )}

      {/* 标签页导航 */}
      <div className="detail-tabs">
        <button 
          className={activeTab === 'detail' ? 'active' : ''}
          onClick={() => setActiveTab('detail')}
        >
          {t('productDetail.tabs.detail')}
        </button>
        <button 
          className={activeTab === 'rules' ? 'active' : ''}
          onClick={() => setActiveTab('rules')}
        >
          {t('productDetail.tabs.rules')}
        </button>
        <button 
          className={activeTab === 'comments' ? 'active' : ''}
          onClick={() => setActiveTab('comments')}
        >
          {t('productDetail.tabs.comments')}
        </button>
      </div>

      {/* 标签页内容 */}
      <div className="detail-content">
        {activeTab === 'detail' && (
          <div className="detail-tab-panel">
            <section className="detail-section">
              <h3>{t('productDetail.specifications')}</h3>
              <div className="spec-list">
                <div className="spec-item">
                  <span className="spec-label">{t('productDetail.brand')}</span>
                  <span className="spec-value">TreasureX</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">{t('productDetail.condition')}</span>
                  <span className="spec-value">{t('productDetail.brandNew')}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">{t('productDetail.warranty')}</span>
                  <span className="spec-value">{t('productDetail.warranty1Year')}</span>
                </div>
              </div>
            </section>

            <section className="detail-section">
              <h3>{t('productDetail.description')}</h3>
              <p>{product.description || t('productDetail.defaultDescription')}</p>
            </section>

            <section className="detail-section">
              <h3>{t('productDetail.highlights')}</h3>
              <ul className="highlights-list">
                <li>{t('productDetail.highlight1')}</li>
                <li>{t('productDetail.highlight2')}</li>
                <li>{t('productDetail.highlight3')}</li>
              </ul>
            </section>
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="detail-tab-panel">
            <section className="detail-section">
              <h3>{t('productDetail.groupRules')}</h3>
              <div className="rules-list">
                <div className="rule-item">
                  <div className="rule-icon">1</div>
                  <div className="rule-content">
                    <h4>{t('productDetail.rule1Title')}</h4>
                    <p>{t('productDetail.rule1Desc')}</p>
                  </div>
                </div>
                <div className="rule-item">
                  <div className="rule-icon">2</div>
                  <div className="rule-content">
                    <h4>{t('productDetail.rule2Title')}</h4>
                    <p>{t('productDetail.rule2Desc')}</p>
                  </div>
                </div>
                <div className="rule-item">
                  <div className="rule-icon">3</div>
                  <div className="rule-content">
                    <h4>{t('productDetail.rule3Title')}</h4>
                    <p>{t('productDetail.rule3Desc')}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="detail-tab-panel">
            <div className="comments-empty">
              <svg viewBox="0 0 64 64" fill="none" stroke="currentColor">
                <circle cx="32" cy="32" r="28" strokeWidth="2"/>
                <path d="M20 28h24M20 36h16" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p>{t('productDetail.noComments')}</p>
            </div>
          </div>
        )}
      </div>

      {/* 底部操作栏 */}
      <div className="product-detail-footer">
        <button className="icon-action-btn" aria-label="收藏">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
        <button className="icon-action-btn" aria-label="客服">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
        <button 
          className="join-group-btn"
          onClick={() => onJoin?.()}
        >
          {t('productDetail.joinGroup')}
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;

