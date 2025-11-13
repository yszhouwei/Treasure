import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import './Home.css';

const Home: React.FC = () => {
  const { t } = useTranslation();
  
  // 团购类型数据
  const groupTypes = [
    { id: 1, name: t('groupType.group10'), color: '#52c41a', icon: '👥' },
    { id: 2, name: t('groupType.group20'), color: '#1890ff', icon: '🏆' },
    { id: 3, name: t('groupType.group50'), color: '#722ed1', icon: '🎯' },
    { id: 4, name: t('groupType.group100'), color: '#ff4d4f', icon: '👑' }
  ];

  // 热门团购商品
  const hotProducts = [
    {
      id: 1,
      name: t('products.antiqueWatch'),
      price: 188.00,
      participants: 58,
      total: 10,
      status: t('product.statusTight'),
      statusColor: '#ff4d4f',
      tag: t('tags.group10'),
      tagColor: '#52c41a'
    },
    {
      id: 2,
      name: t('products.rareStamps'),
      price: 99.00,
      participants: 12,
      total: 20,
      status: t('product.statusAvailable'),
      statusColor: '#52c41a',
      tag: t('tags.group20'),
      tagColor: '#1890ff'
    }
  ];

  // AI推荐商品
  const aiProducts = [
    {
      id: 1,
      name: t('products.vintageCamera'),
      price: 850.00,
      status: t('product.statusTight'),
      statusColor: '#ff4d4f',
      tag: t('tags.hotRecommend'),
      tagColor: '#ff4d4f',
      description: t('product.viewed', { name: '复古相机' })
    },
    {
      id: 2,
      name: t('products.mechanicalKeyboard'),
      price: 499.00,
      status: t('product.statusAvailable'),
      statusColor: '#52c41a',
      tag: t('tags.aiSelected'),
      tagColor: '#1890ff',
      description: ''
    }
  ];

  return (
    <div className="home-container">
      <Header />
      
      <div className="home-content">
        {/* 轮播Banner区域 */}
        <section className="banner-section">
          <div className="banner-content" style={{ backgroundImage: 'url(/images/banner-bg.svg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="banner-badge">{t('banner.limitedTime')}</div>
            <div className="banner-overlay">
              <h1 className="banner-title">{t('banner.title')}</h1>
              <p className="banner-subtitle">{t('banner.subtitle')}</p>
              <button className="banner-btn">
                <span className="btn-icon">⊕</span>
                <span>{t('banner.action')}</span>
              </button>
            </div>
          </div>
        </section>

        {/* 新人优惠卡片 */}
        <section className="promo-card">
          <div className="promo-content">
            <div className="promo-text">
              <h3 className="promo-title">{t('promo.title')}</h3>
              <p className="promo-desc">{t('promo.description')}</p>
            </div>
            <button className="promo-btn">
              <span className="btn-icon">👥+</span>
              <span>{t('promo.action')}</span>
            </button>
          </div>
        </section>

        {/* 团购类型选择 */}
        <section className="group-types">
          <div className="group-grid">
            {groupTypes.map(type => (
              <button key={type.id} className="group-type-item" style={{ backgroundColor: `${type.color}15` }}>
                <div className="group-icon" style={{ backgroundColor: `${type.color}25` }}>
                  <span style={{ color: type.color }}>{type.icon}</span>
                </div>
                <span className="group-name" style={{ color: type.color }}>{type.name}</span>
              </button>
            ))}
          </div>
          <div className="group-rules">
            <a href="#rules">{t('groupType.rules')}</a>
          </div>
        </section>

        {/* 热门团购 */}
        <section className="hot-section">
          <div className="section-header">
            <h2 className="section-title">{t('section.hotGroup')}</h2>
            <a href="#more" className="section-more">
              {t('common.more')} <span className="arrow">›</span>
            </a>
          </div>
          <div className="product-grid">
            {hotProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image" style={{ 
                  backgroundImage: `url(/images/${product.id === 1 ? 'product-watch' : 'product-stamps'}.svg)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}>
                  <span className="product-tag" style={{ backgroundColor: product.tagColor }}>
                    {product.tag}
                  </span>
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-stats">
                    <span className="participants-count">
                      {t('product.participants', { count: product.participants })}
                    </span>
                  </div>
                  <div className="product-status" style={{ color: product.statusColor }}>
                    {product.status}
                  </div>
                  <div className="product-footer">
                    <span className="product-price">¥{product.price.toFixed(2)}</span>
                    <button className="join-btn">{t('common.join')}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI推荐 */}
        <section className="ai-section">
          <div className="section-header">
            <h2 className="section-title">{t('section.aiRecommend')}</h2>
            <button className="refresh-btn">
              <span className="refresh-icon">⟳</span>
              <span>{t('common.refresh')}</span>
            </button>
          </div>
          <div className="ai-product-list">
            {aiProducts.map(product => (
              <div key={product.id} className="ai-product-card">
                <div className="ai-product-image" style={{ 
                  backgroundImage: `url(/images/${product.id === 1 ? 'product-camera' : 'product-keyboard'}.svg)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}>
                  <span className="ai-product-tag" style={{ backgroundColor: product.tagColor }}>
                    {product.tag}
                  </span>
                </div>
                <div className="ai-product-info">
                  <h3 className="ai-product-name">{product.name}</h3>
                  {product.description && (
                    <div className="ai-product-desc">
                      <span className="info-icon">ⓘ</span>
                      <span>{product.description}</span>
                    </div>
                  )}
                  <div className="ai-product-status" style={{ color: product.statusColor }}>
                    {product.status}
                  </div>
                  <div className="ai-product-footer">
                    <span className="ai-product-price">¥{product.price.toFixed(2)}</span>
                    <button className="ai-join-btn">{t('common.join')}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
