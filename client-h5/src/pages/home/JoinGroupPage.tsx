import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './JoinGroupPage.css';

interface JoinGroupPageProps {
  product: {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    groupSize: number;
    currentMembers: number;
    timeLeft: string;
  };
  onBack: () => void;
  onConfirm: () => void;
}

const JoinGroupPage: React.FC<JoinGroupPageProps> = ({ product, onBack, onConfirm }) => {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(0);

  const addresses = [
    { id: 0, name: '张三', phone: '138****8888', address: '北京市朝阳区xxx街道xxx号' },
    { id: 1, name: '李四', phone: '139****9999', address: '上海市浦东新区xxx路xxx号' }
  ];

  const savings = ((product.originalPrice || product.price * 1.5) - product.price) * quantity;
  const total = product.price * quantity;

  return (
    <div className="join-group-page">
      {/* 头部 */}
      <div className="join-group-header">
        <button className="back-btn" onClick={onBack} aria-label="返回">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="join-group-title">{t('joinGroup.title')}</h1>
      </div>

      <div className="join-group-content">
        {/* 团购信息卡片 */}
        <div className="group-info-card">
          <div className="group-info-header">
            <div className="group-badge">{t('joinGroup.groupBuying')}</div>
            <div className="time-left">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>{product.timeLeft}</span>
            </div>
          </div>
          
          <div className="group-progress-info">
            <div className="members-display">
              {[...Array(Math.min(product.groupSize, 6))].map((_, index) => (
                <div 
                  key={index} 
                  className={`member-slot ${index < product.currentMembers ? 'filled' : ''}`}
                >
                  {index < product.currentMembers ? '👤' : '?'}
                </div>
              ))}
              {product.groupSize > 6 && (
                <div className="member-slot more">
                  +{product.groupSize - 6}
                </div>
              )}
            </div>
            <p className="progress-text">
              {t('joinGroup.progressText', { 
                current: product.currentMembers, 
                total: product.groupSize 
              })}
            </p>
          </div>
        </div>

        {/* 商品信息 */}
        <div className="product-summary-card">
          <h3>{t('joinGroup.productInfo')}</h3>
          <div className="product-summary-content">
            <div className="product-summary-image" />
            <div className="product-summary-details">
              <h4>{product.name}</h4>
              <div className="price-row">
                <span className="group-price">¥{product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="original-price">¥{product.originalPrice.toFixed(2)}</span>
                )}
              </div>
              <div className="quantity-selector">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>
          </div>
        </div>

        {/* 收货地址 */}
        <div className="address-card">
          <h3>{t('joinGroup.shippingAddress')}</h3>
          <div className="address-list">
            {addresses.map((addr) => (
              <div 
                key={addr.id}
                className={`address-item ${selectedAddress === addr.id ? 'selected' : ''}`}
                onClick={() => setSelectedAddress(addr.id)}
              >
                <div className="address-radio">
                  {selectedAddress === addr.id && <div className="radio-dot" />}
                </div>
                <div className="address-details">
                  <div className="address-header">
                    <span className="recipient-name">{addr.name}</span>
                    <span className="recipient-phone">{addr.phone}</span>
                  </div>
                  <p className="address-text">{addr.address}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="add-address-btn">
            + {t('joinGroup.addNewAddress')}
          </button>
        </div>

        {/* 价格明细 */}
        <div className="price-detail-card">
          <h3>{t('joinGroup.priceBreakdown')}</h3>
          <div className="price-rows">
            <div className="price-row-item">
              <span>{t('joinGroup.subtotal')}</span>
              <span>¥{total.toFixed(2)}</span>
            </div>
            <div className="price-row-item">
              <span>{t('joinGroup.shipping')}</span>
              <span className="free">{t('joinGroup.freeShipping')}</span>
            </div>
            <div className="price-row-item savings">
              <span>{t('joinGroup.youSave')}</span>
              <span>-¥{savings.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* 团购规则提示 */}
        <div className="rules-notice">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          <p>{t('joinGroup.rulesNotice')}</p>
        </div>
      </div>

      {/* 底部确认栏 */}
      <div className="join-group-footer">
        <div className="footer-price">
          <span className="footer-label">{t('joinGroup.total')}</span>
          <div className="footer-amount">
            <span className="amount">¥{total.toFixed(2)}</span>
            <span className="savings-badge">{t('joinGroup.save')} ¥{savings.toFixed(2)}</span>
          </div>
        </div>
        <button className="confirm-join-btn" onClick={onConfirm}>
          {t('joinGroup.confirmJoin')}
        </button>
      </div>
    </div>
  );
};

export default JoinGroupPage;

