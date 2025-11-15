import React, { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import ProductDetail from './home/ProductDetail';
import GroupTypeDetail from './home/GroupTypeDetail';
import CampaignPage from './home/CampaignPage';
import JoinGroupPage from './home/JoinGroupPage';
import CreateGroupPage from './home/CreateGroupPage';
import SelectGroupTypePage from './home/SelectGroupTypePage';
import ApplicationSuccessPage from './home/ApplicationSuccessPage';
import ProductListPage from './home/ProductListPage';
import PaymentPage from './home/PaymentPage';
import OrderSuccessPage from './home/OrderSuccessPage';
import LotteryPage from './home/LotteryPage';
import { ProductsService, type Product as ApiProduct } from '../services/products.service';
import { BannersService } from '../services/banners.service';
import { parsePrice, formatPrice } from '../utils/dataTransform';
import { getTranslatedProductName } from '../utils/productTranslations';
import './Home.css';

type GroupTypeItem = {
  id: number;
  name: string;
  color: string;
  icon: string;
  size?: number;
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
  imageUrl?: string;
  backgroundColor?: string;
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
  imageUrl?: string;
  backgroundColor?: string;
};

type PageState =
  | { type: 'banner' }
  | { type: 'promo' }
  | { type: 'groupType'; payload: GroupTypeItem }
  | { type: 'hotProduct'; payload: HotProduct }
  | { type: 'aiProduct'; payload: AiProduct }
  | { type: 'joinGroup'; payload: { product: HotProduct | AiProduct; groupSize: number } }
  | { type: 'selectGroupType' }
  | { type: 'productList'; payload: { groupType: GroupTypeItem } }
  | { type: 'createGroup'; payload: { groupType: GroupTypeItem } }
  | { type: 'applicationSuccess'; payload: { application: any } }
  | { type: 'payment'; payload: { order: any } }
  | { type: 'orderSuccess'; payload: { order: any } }
  | { type: 'lottery'; payload: { groupId: number; productName: string } }
  | null;

const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [activePage, setActivePage] = useState<PageState>(null);
  const [pageHistory, setPageHistory] = useState<PageState[]>([]); // 页面历史记录
  const [hotProducts, setHotProducts] = useState<HotProduct[]>([]);
  const [aiProducts, setAiProducts] = useState<AiProduct[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productDetail, setProductDetail] = useState<ApiProduct | null>(null);
  const [productDetailLoading, setProductDetailLoading] = useState(false);

  // 导航到新页面（带历史记录）
  const navigateToPage = (page: PageState) => {
    if (activePage) {
      setPageHistory(prev => [...prev, activePage]);
    }
    setActivePage(page);
  };

  // 返回上一页
  const goBack = () => {
    if (pageHistory.length > 0) {
      const previousPage = pageHistory[pageHistory.length - 1];
      setPageHistory(prev => prev.slice(0, -1));
      setActivePage(previousPage);
    } else {
      setActivePage(null);
    }
  };

  const groupTypes: GroupTypeItem[] = useMemo(() => (
    [
      { id: 1, name: t('groupType.group10'), color: '#52c41a', icon: '👥', size: 10 },
      { id: 2, name: t('groupType.group20'), color: '#1890ff', icon: '🏆', size: 20 },
      { id: 3, name: t('groupType.group50'), color: '#722ed1', icon: '🎯', size: 50 },
      { id: 4, name: t('groupType.group100'), color: '#ff4d4f', icon: '👑', size: 100 }
    ]
  ), [t]);

  // 将API商品转换为HotProduct格式
  const convertToHotProduct = (product: ApiProduct): HotProduct => {
    const participants = Math.floor(Math.random() * 50) + 10; // 模拟参与人数
    const total = 10; // 默认10人团，后续可以从团购信息获取
    const isTight = participants >= total * 0.8;
    
    // 确保价格是数字类型
    const price = parsePrice(product.group_price);
    
    return {
      id: product.id,
      name: getTranslatedProductName(product.id, product.name, i18n.language),
      price: price,
      participants,
      total,
      status: isTight ? t('product.statusTight') : t('product.statusAvailable'),
      statusColor: isTight ? '#ff4d4f' : '#52c41a',
      tag: t('tags.group10'),
      tagColor: '#52c41a',
      desc: product.description || '',
      imageUrl: product.image_url || ProductsService.parseImages(product.images)[0] || '/images/product-watch.svg',
      backgroundColor: '#2c1810'
    };
  };

  // 将API商品转换为AiProduct格式
  const convertToAiProduct = (product: ApiProduct): AiProduct => {
    const isTight = product.stock < 10;
    
    // 确保价格是数字类型
    const price = parsePrice(product.group_price);
    const translatedName = getTranslatedProductName(product.id, product.name, i18n.language);
    
    return {
      id: product.id,
      name: translatedName,
      price: price,
      status: isTight ? t('product.statusTight') : t('product.statusAvailable'),
      statusColor: isTight ? '#ff4d4f' : '#52c41a',
      tag: product.is_recommend ? t('tags.hotRecommend') : t('tags.aiSelected'),
      tagColor: product.is_recommend ? '#ff4d4f' : '#1890ff',
      description: product.description || t('product.viewed', { name: translatedName }),
      imageUrl: product.image_url || ProductsService.parseImages(product.images)[0] || '/images/product-camera.svg',
      backgroundColor: '#2c2c2c'
    };
  };

  // 获取商品数据
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 并行获取热门商品、推荐商品和轮播图
        const [hotData, recommendData, bannersData] = await Promise.all([
          ProductsService.getHotProducts(),
          ProductsService.getRecommendProducts(),
          BannersService.getBanners().catch(() => []) // 轮播图失败不影响主流程
        ]);

        // 转换热门商品
        const hot = hotData.map(convertToHotProduct);
        setHotProducts(hot);

        // 转换推荐商品
        const recommend = recommendData.map(convertToAiProduct);
        setAiProducts(recommend);

        // 设置轮播图
        setBanners(bannersData);
      } catch (err: any) {
        console.error('获取商品数据失败:', err);
        setError(err.message || '获取数据失败');
        // 如果API失败，使用空数组，页面会显示空状态
        setHotProducts([]);
        setAiProducts([]);
        setBanners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t, i18n.language]);

  // 获取商品详情
  useEffect(() => {
    const fetchProductDetail = async () => {
      if (activePage && (activePage.type === 'hotProduct' || activePage.type === 'aiProduct')) {
        const productId = activePage.payload.id;
        if (!productDetail || productDetail.id !== productId) {
          setProductDetailLoading(true);
          try {
            const detail = await ProductsService.getProductById(productId);
            setProductDetail(detail);
          } catch (err) {
            console.error('获取商品详情失败:', err);
            setProductDetail(null);
          } finally {
            setProductDetailLoading(false);
          }
        }
      } else {
        // 离开商品详情页时清空数据
        setProductDetail(null);
      }
    };

    fetchProductDetail();
  }, [activePage]);

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
            onBack={goBack}
            onAction={() => {
              // 对于"立即夺宝"，应该跳转到团购类型选择，然后选择商品参与团购
              // 这里直接跳转到第一个团购类型的商品列表，让用户选择商品
              if (groupTypes.length > 0) {
                navigateToPage({
                  type: 'productList',
                  payload: { groupType: groupTypes[0] } // 默认10人团
                });
              } else {
                // 如果没有团购类型，跳转到选择页面
                navigateToPage({ type: 'selectGroupType' });
              }
            }}
            onProductClick={(productId: number) => {
              // 从热门商品或推荐商品中查找
              const product = [...hotProducts, ...aiProducts].find(p => p.id === productId);
              if (product) {
                // 获取商品详情
                ProductsService.getProductById(productId).then((detail) => {
                  const displayProduct = hotProducts.find(p => p.id === productId) 
                    ? convertToHotProduct(detail)
                    : convertToAiProduct(detail);
                  // 默认使用10人团，用户可以在参团页面看到其他选项
                  navigateToPage({
                    type: 'joinGroup',
                    payload: { 
                      product: displayProduct, 
                      groupSize: 10 
                    }
                  });
                }).catch((err) => {
                  console.error('获取商品详情失败:', err);
                  // 如果获取失败，使用已有数据
                  navigateToPage({
                    type: 'joinGroup',
                    payload: { 
                      product, 
                      groupSize: 10 
                    }
                  });
                });
              }
            }}
            hotProducts={hotProducts}
            aiProducts={aiProducts}
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
            onBack={goBack}
            onAction={() => {
              // 跳转到选择团购类型页面
              navigateToPage({ type: 'selectGroupType' });
            }}
          />
        );
      case 'groupType':
        return (
          <GroupTypeDetail
            groupType={activePage.payload}
            onBack={goBack}
            onViewProducts={() => {
              // 跳转到该类型的商品列表页面
              navigateToPage({
                type: 'productList',
                payload: { groupType: activePage.payload }
              });
            }}
          />
        );
      case 'productList': {
        // 使用 ProductListPage 组件，它会自己获取对应类型的商品
        return (
          <ProductListPage
            groupType={activePage.payload.groupType}
            onBack={goBack}
            onProductClick={(product) => {
              // 判断是热门商品还是AI推荐商品
              const isHotProduct = hotProducts.some(p => p.id === product.id);
              navigateToPage({
                type: isHotProduct ? 'hotProduct' : 'aiProduct',
                payload: product
              });
            }}
          />
        );
      }
      case 'hotProduct':
      case 'aiProduct': {
        const currentProduct = productDetail && productDetail.id === activePage.payload.id
          ? productDetail
          : null;

        const images = currentProduct 
          ? ProductsService.parseImages(currentProduct.images)
          : (activePage.payload.imageUrl ? [activePage.payload.imageUrl] : []);

        return (
          <ProductDetail
            product={{
              id: activePage.payload.id,
              name: currentProduct 
                ? getTranslatedProductName(currentProduct.id, currentProduct.name, i18n.language)
                : getTranslatedProductName(activePage.payload.id, activePage.payload.name, i18n.language),
              price: currentProduct ? parsePrice(currentProduct.group_price) : activePage.payload.price,
              originalPrice: currentProduct ? parsePrice(currentProduct.original_price) : (activePage.payload.price * 1.5),
              participants: activePage.type === 'hotProduct' ? activePage.payload.participants : undefined,
              total: activePage.type === 'hotProduct' ? activePage.payload.total : undefined,
              status: activePage.payload.status,
              tag: activePage.payload.tag,
              description: currentProduct?.description || (activePage.type === 'hotProduct' ? activePage.payload.desc : activePage.payload.description),
              images: images.length > 0 ? images : undefined
            }}
            onBack={() => {
              setActivePage(null);
              setProductDetail(null);
            }}
            onJoin={() => {
              setActivePage({
                type: 'joinGroup',
                payload: {
                  product: activePage.payload,
                  groupSize: activePage.type === 'hotProduct' ? activePage.payload.total : 10
                }
              });
            }}
            loading={productDetailLoading}
          />
        );
      }
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
              timeLeft: '23:45:12',
              imageUrl: activePage.payload.product.imageUrl
            }}
            onBack={goBack}
            onConfirm={(orderData) => {
              setActivePage({
                type: 'payment',
                payload: {
                  order: {
                    orderNo: orderData.orderNo,
                    productName: orderData.productName,
                    quantity: orderData.quantity,
                    amount: orderData.amount,
                    groupType: orderData.groupType,
                    orderId: orderData.id,
                    groupSize: orderData.groupSize,
                    currentMembers: orderData.currentMembers
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
              size: activePage.payload.groupType.size || parseInt(activePage.payload.groupType.name.match(/\d+/)?.[0] || '10')
            }}
            onBack={() => {
              // 返回到选择团购类型页面
              setActivePage({ type: 'selectGroupType' });
            }}
            onConfirm={(applicationData) => {
              // 提交申请后跳转到申请成功页面
              setActivePage({
                type: 'applicationSuccess',
                payload: {
                  application: {
                    groupType: activePage.payload.groupType.name,
                    productName: applicationData?.productName,
                    applicationNo: `APP${Date.now().toString().slice(-8)}`
                  }
                }
              });
            }}
          />
        );
      case 'applicationSuccess':
        return (
          <ApplicationSuccessPage
            application={activePage.payload.application}
            onBack={goBack}
            onViewStatus={() => {
              // 触发自定义事件，通知 App 组件切换到"我的团购"页面
              window.dispatchEvent(new CustomEvent('switchTab', { detail: 'group' }));
              setActivePage(null);
            }}
          />
        );
      case 'selectGroupType':
        return (
          <SelectGroupTypePage
            groupTypes={groupTypes}
            onBack={goBack}
            onSelect={(groupType) => {
              setActivePage({
                type: 'createGroup',
                payload: { groupType }
              });
            }}
          />
        );
      case 'payment':
        return (
          <PaymentPage
            order={activePage.payload.order}
            onBack={goBack}
            onSuccess={() => {
              // 从支付页面的订单数据中获取团购信息
              const groupSize = parseInt(activePage.payload.order.groupType.match(/\d+/)?.[0] || '10');
              setActivePage({
                type: 'orderSuccess',
                payload: {
                  order: {
                    orderNo: activePage.payload.order.orderNo,
                    productName: activePage.payload.order.productName,
                    amount: activePage.payload.order.amount,
                    groupSize: groupSize,
                    currentMembers: activePage.payload.order.currentMembers || 1,
                    estimatedTime: t('orderSuccess.estimatedTimeValue') || '48小时内'
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
              // 触发自定义事件，切换到"我的"页面，然后打开订单列表
              window.dispatchEvent(new CustomEvent('switchTab', { detail: 'profile' }));
              // 延迟一下，确保页面切换完成后再打开订单列表
              setTimeout(() => {
                window.dispatchEvent(new CustomEvent('openOrderList'));
              }, 100);
              setActivePage(null);
            }}
            onBackHome={() => setActivePage(null)}
            onInviteFriends={() => {
              // TODO: 打开分享面板
              alert(t('orderSuccess.shareMessage'));
            }}
            onViewLottery={() => {
              // 跳转到开奖页面（需要groupId，这里暂时使用模拟值）
              const groupId = 1; // TODO: 从订单中获取真实的groupId
              setActivePage({
                type: 'lottery',
                payload: {
                  groupId: groupId,
                  productName: activePage.payload.order.productName
                }
              });
            }}
          />
        );
      case 'lottery':
        return (
          <LotteryPage
            groupId={activePage.payload.groupId}
            productName={activePage.payload.productName}
            onBack={goBack}
            onViewResult={() => {
              // TODO: 查看详细结果
              setActivePage(null);
            }}
          />
        );
    }
  }

  return (
    <div className="home-container">
      <Header />

      <div className="home-content">
        {/* 加载状态 */}
        {loading && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#8c8c8c' }}>
            {t('common.loading') || '加载中...'}
          </div>
        )}

        {/* 错误提示 */}
        {error && !loading && (
          <div style={{ padding: '20px', textAlign: 'center', color: '#ff4d4f' }}>
            {error}
            <br />
            <button 
              onClick={() => window.location.reload()} 
              style={{ marginTop: '10px', padding: '8px 16px', background: '#1890ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              {t('common.retry') || 'Retry'}
            </button>
          </div>
        )}

        {/* 轮播Banner区域 */}
        {!loading && (
          <section className="banner-section">
            {banners.length > 0 ? (
              banners.map((banner, index) => (
                <div 
                  key={banner.id || index}
                  className="banner-content" 
                  style={{ 
                    backgroundImage: banner.image_url ? `url(${banner.image_url})` : 'url(/images/banner-bg.svg)', 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    if (banner.link_url) {
                      if (banner.link_type === 'product') {
                        // TODO: 实现商品详情跳转
                        // const productId = banner.link_url.split('/').pop();
                        navigateToPage({ type: 'banner' });
                      } else {
                        navigateToPage({ type: 'banner' });
                      }
                    } else {
                      navigateToPage({ type: 'banner' });
                    }
                  }}
                >
                  <div className="banner-badge">{t('banner.limitedTime')}</div>
                  <div className="banner-overlay">
                    <h1 className="banner-title">{banner.title || t('banner.title')}</h1>
                    <p className="banner-subtitle">{t('banner.subtitle')}</p>
                    <button className="banner-btn" onClick={(e) => { e.stopPropagation(); navigateToPage({ type: 'banner' }); }}>
                      <span className="btn-icon">⊕</span>
                      <span>{t('banner.action')}</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="banner-content" style={{ backgroundImage: 'url(/images/banner-bg.svg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="banner-badge">{t('banner.limitedTime')}</div>
                <div className="banner-overlay">
                  <h1 className="banner-title">{t('banner.title')}</h1>
                  <p className="banner-subtitle">{t('banner.subtitle')}</p>
                  <button className="banner-btn" onClick={() => navigateToPage({ type: 'banner' })}>
                    <span className="btn-icon">⊕</span>
                    <span>{t('banner.action')}</span>
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* 招募团长卡片 */}
        <section className="promo-card">
          <div className="promo-content">
            <div className="promo-text">
              <h3 className="promo-title">{t('promo.title')}</h3>
              <p className="promo-desc">{t('promo.description')}{t('promo.subtitle')}</p>
              <p className="promo-subtitle"></p>
            </div>
            <button className="promo-btn" onClick={() => navigateToPage({ type: 'promo' })}>
              <span className="btn-icon">👑</span>
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
                onClick={() => navigateToPage({ type: 'groupType', payload: type })}
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
        {!loading && (
          <section className="hot-section">
            <div className="section-header">
              <h2 className="section-title">{t('section.hotGroup')}</h2>
              <a href="#more" className="section-more">
                {t('common.more')} <span className="arrow">›</span>
              </a>
            </div>
            {hotProducts.length > 0 ? (
              <div className="product-grid">
                {hotProducts.map((product) => (
                  <div
                    key={product.id}
                    className="product-card"
                    onClick={() => navigateToPage({ type: 'hotProduct', payload: product })}
                  >
                <div
                  className="product-image"
                  style={{
                    backgroundImage: product.imageUrl ? `url(${product.imageUrl})` : undefined,
                    backgroundColor: product.backgroundColor || (product.id === 1 ? '#2c1810' : '#1a5757')
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
                    <span className="product-price">{formatPrice(product.price, i18n.language)}</span>
                  </div>
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
                ))}
              </div>
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: '#8c8c8c' }}>
                {t('home.noHotProducts') || t('common.noData') || 'No hot products'}
              </div>
            )}
          </section>
        )}

        {/* AI推荐 */}
        {!loading && (
          <section className="ai-section">
            <div className="section-header">
              <h2 className="section-title">{t('section.aiRecommend')}</h2>
              <button 
                className="refresh-btn" 
                onClick={async () => {
                  // 刷新推荐商品
                  try {
                    const recommendData = await ProductsService.getRecommendProducts();
                    const recommend = recommendData.map(convertToAiProduct);
                    setAiProducts(recommend);
                  } catch (err) {
                    console.error('刷新失败:', err);
                  }
                }}
              >
                <span className="refresh-icon">⟳</span>
                <span>{t('common.refresh')}</span>
              </button>
            </div>
            {aiProducts.length > 0 ? (
              <div className="ai-product-list">
                {aiProducts.map((product) => (
                  <div
                    key={product.id}
                    className="ai-product-card"
                    onClick={() => navigateToPage({ type: 'aiProduct', payload: product })}
                  >
                <div
                  className="ai-product-image"
                  style={{
                    backgroundImage: product.imageUrl ? `url(${product.imageUrl})` : undefined,
                    backgroundColor: product.backgroundColor || (product.id === 1 ? '#2c2c2c' : '#1a1a1a')
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
                      <span>{product.description}</span>
                    </div>
                  )}
                  <div className="ai-product-status" style={{ color: product.statusColor }}>
                    {product.status}
                  </div>
                  <div className="ai-product-footer">
                    <span className="ai-product-price">{formatPrice(product.price, i18n.language)}</span>
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
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: '#8c8c8c' }}>
                {t('home.noRecommendProducts') || t('common.noData') || 'No recommended products'}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default Home;
