import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import ProductDetail from './home/ProductDetail';
import GroupTypeDetail from './home/GroupTypeDetail';
import CampaignPage from './home/CampaignPage';
import JoinGroupPage from './home/JoinGroupPage';
import CreateGroupPage from './home/CreateGroupPage';
import PaymentPage from './home/PaymentPage';
import OrderSuccessPage from './home/OrderSuccessPage';
import './Home.css';

type GroupTypeItem = {
  id: number;
  name: string;
  color: string;
  icon: string;
};

type HotProduct = {
  id: number;
  name: string;
  price: number;
  participants: number;
  total: number;
  status: string;
  statusColor: string;
  tag: string;
  tagColor: string;
  desc: string;
};

type AiProduct = {
  id: number;
  name: string;
  price: number;
  status: string;
  statusColor: string;
  tag: string;
  tagColor: string;
  description: string;
};

type PageState =
  | { type: 'banner' }
  | { type: 'promo' }
  | { type: 'groupType'; payload: GroupTypeItem }
  | { type: 'hotProduct'; payload: HotProduct }
  | { type: 'aiProduct'; payload: AiProduct }
  | { type: 'joinGroup'; payload: { product: HotProduct | AiProduct; groupSize: number } }
  | { type: 'createGroup'; payload: { groupType: GroupTypeItem } }
  | { type: 'payment'; payload: { order: any } }
  | { type: 'orderSuccess'; payload: { order: any } }
  | null;

const Home: React.FC = () => {
  const { t } = useTranslation();
  const [activePage, setActivePage] = useState<PageState>(null);

  const groupTypes: GroupTypeItem[] = useMemo(() => (
    [
      { id: 1, name: t('groupType.group10'), color: '#52c41a', icon: '👥' },
      { id: 2, name: t('groupType.group20'), color: '#1890ff', icon: '🏆' },
      { id: 3, name: t('groupType.group50'), color: '#722ed1', icon: '🎯' },
      { id: 4, name: t('groupType.group100'), color: '#ff4d4f', icon: '👑' }
    ]
  ), [t]);

  const hotProducts: HotProduct[] = useMemo(() => (
    [
      {
        id: 1,
        name: t('products.antiqueWatch'),
        price: 188.0,
        participants: 58,
        total: 10,
        status: t('product.statusTight'),
        statusColor: '#ff4d4f',
        tag: t('tags.group10'),
        tagColor: '#52c41a',
        desc: t('home.sheet.hotProduct.descWatch')
      },
      {
        id: 2,
        name: t('products.rareStamps'),
        price: 99.0,
        participants: 12,
        total: 20,
        status: t('product.statusAvailable'),
        statusColor: '#52c41a',
        tag: t('tags.group20'),
        tagColor: '#1890ff',
        desc: t('home.sheet.hotProduct.descStamps')
      }
    ]
  ), [t]);

  const aiProducts: AiProduct[] = useMemo(() => (
    [
      {
        id: 1,
        name: t('products.vintageCamera'),
        price: 850.0,
        status: t('product.statusTight'),
        statusColor: '#ff4d4f',
        tag: t('tags.hotRecommend'),
        tagColor: '#ff4d4f',
        description: t('product.viewed', { name: t('products.vintageCamera') })
      },
      {
        id: 2,
        name: t('products.mechanicalKeyboard'),
        price: 499.0,
        status: t('product.statusAvailable'),
        statusColor: '#52c41a',
        tag: t('tags.aiSelected'),
        tagColor: '#1890ff',
        description: t('home.sheet.aiProduct.descKeyboard')
      }
    ]
  ), [t]);

  // 渲染子页面
  if (activePage) {
    switch (activePage.type) {
      case 'banner':
        return (
          <CampaignPage
            campaign={{
              type: 'banner',
              title: t('banner.title'),
              subtitle: t('banner.subtitle'),
              description: t('campaign.bannerDescription')
            }}
            onBack={() => setActivePage(null)}
            onAction={() => {
              // 选择第一个热门产品加入团购
              const product = hotProducts[0];
              setActivePage({
                type: 'joinGroup',
                payload: { product, groupSize: 10 }
              });
            }}
          />
        );
      case 'promo':
        return (
          <CampaignPage
            campaign={{
              type: 'promo',
              title: t('promo.title'),
              subtitle: t('promo.description'),
              description: t('campaign.promoDescription')
            }}
            onBack={() => setActivePage(null)}
            onAction={() => {
              // 跳转到创建团购
              setActivePage({
                type: 'createGroup',
                payload: { groupType: groupTypes[0] }
              });
            }}
          />
        );
      case 'groupType':
        return (
          <GroupTypeDetail
            groupType={activePage.payload}
            onBack={() => setActivePage(null)}
          />
        );
      case 'hotProduct':
        return (
          <ProductDetail
            product={{
              ...activePage.payload,
              originalPrice: activePage.payload.price * 1.5,
              description: activePage.payload.desc
            }}
            onBack={() => setActivePage(null)}
            onJoin={() => {
              setActivePage({
                type: 'joinGroup',
                payload: {
                  product: activePage.payload,
                  groupSize: activePage.payload.total
                }
              });
            }}
          />
        );
      case 'aiProduct':
        return (
          <ProductDetail
            product={{
              ...activePage.payload,
              originalPrice: activePage.payload.price * 1.8,
              participants: undefined,
              total: undefined
            }}
            onBack={() => setActivePage(null)}
            onJoin={() => {
              setActivePage({
                type: 'joinGroup',
                payload: {
                  product: activePage.payload,
                  groupSize: 10
                }
              });
            }}
          />
        );
      case 'joinGroup':
        return (
          <JoinGroupPage
            product={{
              id: activePage.payload.product.id,
              name: activePage.payload.product.name,
              price: activePage.payload.product.price,
              originalPrice: activePage.payload.product.price * 1.5,
              groupSize: activePage.payload.groupSize,
              currentMembers: Math.floor(Math.random() * activePage.payload.groupSize),
              timeLeft: '23:45:12'
            }}
            onBack={() => setActivePage(null)}
            onConfirm={() => {
              const orderNo = `TG${Date.now().toString().slice(-8)}`;
              setActivePage({
                type: 'payment',
                payload: {
                  order: {
                    orderNo,
                    productName: activePage.payload.product.name,
                    quantity: 1,
                    amount: activePage.payload.product.price,
                    groupType: `${activePage.payload.groupSize}人团`
                  }
                }
              });
            }}
          />
        );
      case 'createGroup':
        return (
          <CreateGroupPage
            groupType={{
              id: activePage.payload.groupType.id,
              name: activePage.payload.groupType.name,
              color: activePage.payload.groupType.color,
              size: parseInt(activePage.payload.groupType.name.match(/\d+/)?.[0] || '10')
            }}
            onBack={() => setActivePage(null)}
            onConfirm={() => {
              const orderNo = `TG${Date.now().toString().slice(-8)}`;
              setActivePage({
                type: 'payment',
                payload: {
                  order: {
                    orderNo,
                    productName: '自选商品',
                    quantity: 1,
                    amount: 188,
                    groupType: activePage.payload.groupType.name
                  }
                }
              });
            }}
          />
        );
      case 'payment':
        return (
          <PaymentPage
            order={activePage.payload.order}
            onBack={() => setActivePage(null)}
            onSuccess={() => {
              setActivePage({
                type: 'orderSuccess',
                payload: {
                  order: {
                    orderNo: activePage.payload.order.orderNo,
                    productName: activePage.payload.order.productName,
                    amount: activePage.payload.order.amount,
                    groupSize: parseInt(activePage.payload.order.groupType.match(/\d+/)?.[0] || '10'),
                    currentMembers: 1,
                    estimatedTime: '48小时内'
                  }
                }
              });
            }}
          />
        );
      case 'orderSuccess':
        return (
          <OrderSuccessPage
            order={activePage.payload.order}
            onViewOrder={() => {
              // TODO: 跳转到订单详情
              setActivePage(null);
            }}
            onBackHome={() => setActivePage(null)}
            onInviteFriends={() => {
              // TODO: 打开分享面板
              alert(t('orderSuccess.shareMessage'));
            }}
          />
        );
    }
  }

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
              <button className="banner-btn" onClick={() => setActivePage({ type: 'banner' })}>
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
            <button className="promo-btn" onClick={() => setActivePage({ type: 'promo' })}>
              <span className="btn-icon">👥+</span>
              <span>{t('promo.action')}</span>
            </button>
          </div>
        </section>

        {/* 团购类型选择 */}
        <section className="group-types">
          <div className="group-grid">
            {groupTypes.map((type) => (
              <button
                key={type.id}
                className="group-type-item"
                style={{ backgroundColor: `${type.color}15` }}
                onClick={() => setActivePage({ type: 'groupType', payload: type })}
              >
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
            {hotProducts.map((product) => (
              <div
                key={product.id}
                className="product-card"
                onClick={() => setActivePage({ type: 'hotProduct', payload: product })}
              >
                <div
                  className="product-image"
                  style={{
                    backgroundImage: `url(/images/${product.id === 1 ? 'product-watch' : 'product-stamps'}.svg)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
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
                    <button
                      className="join-btn"
                      onClick={(event) => {
                        event.stopPropagation();
                        setActivePage({ type: 'hotProduct', payload: product });
                      }}
                    >
                      {t('common.join')}
                    </button>
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
            <button className="refresh-btn" onClick={() => setActivePage({ type: 'aiProduct', payload: aiProducts[0] })}>
              <span className="refresh-icon">⟳</span>
              <span>{t('common.refresh')}</span>
            </button>
          </div>
          <div className="ai-product-list">
            {aiProducts.map((product) => (
              <div
                key={product.id}
                className="ai-product-card"
                onClick={() => setActivePage({ type: 'aiProduct', payload: product })}
              >
                <div
                  className="ai-product-image"
                  style={{
                    backgroundImage: `url(/images/${product.id === 1 ? 'product-camera' : 'product-keyboard'}.svg)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
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
                    <button
                      className="ai-join-btn"
                      onClick={(event) => {
                        event.stopPropagation();
                        setActivePage({ type: 'aiProduct', payload: product });
                      }}
                    >
                      {t('common.join')}
                    </button>
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
