import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './CreateGroupPage.css';

interface CreateGroupPageProps {
  groupType: {
    id: number;
    name: string;
    color: string;
    size: number;
  };
  onBack: () => void;
  onConfirm: () => void;
}

const CreateGroupPage: React.FC<CreateGroupPageProps> = ({ groupType, onBack, onConfirm }) => {
  const { t } = useTranslation();
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [duration, setDuration] = useState(24);
  const [isPublic, setIsPublic] = useState(true);

  const availableProducts = [
    { id: 1, name: t('products.antiqueWatch'), price: 188, image: '⌚' },
    { id: 2, name: t('products.rareStamps'), price: 99, image: '📮' },
    { id: 3, name: t('products.vintageCamera'), price: 850, image: '📷' },
    { id: 4, name: t('products.mechanicalKeyboard'), price: 499, image: '⌨️' }
  ];

  const durations = [
    { value: 12, label: '12小时' },
    { value: 24, label: '24小时' },
    { value: 48, label: '48小时' },
    { value: 72, label: '72小时' }
  ];

  return (
    <div className="create-group-page">
      {/* 头部 */}
      <div className="create-group-header">
        <button className="back-btn" onClick={onBack} aria-label="返回">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1>{t('createGroup.title')}</h1>
        <div style={{ width: 40 }} />
      </div>

      <div className="create-group-content">
        {/* 团购类型卡片 */}
        <div className="selected-type-card" style={{ backgroundColor: `${groupType.color}15` }}>
          <div className="type-badge" style={{ backgroundColor: groupType.color }}>
            {groupType.name}
          </div>
          <div className="type-info">
            <h3>{t('createGroup.groupSize', { size: groupType.size })}</h3>
            <p>{t('createGroup.typeDescription')}</p>
          </div>
        </div>

        {/* 选择商品 */}
        <div className="section-card">
          <div className="section-header">
            <h3>{t('createGroup.selectProduct')}</h3>
            <span className="required-badge">{t('common.required')}</span>
          </div>
          <div className="product-select-grid">
            {availableProducts.map((product) => (
              <div
                key={product.id}
                className={`product-select-item ${selectedProduct === product.id ? 'selected' : ''}`}
                onClick={() => setSelectedProduct(product.id)}
              >
                <div className="product-select-image">{product.image}</div>
                <div className="product-select-info">
                  <h4>{product.name}</h4>
                  <span className="product-select-price">¥{product.price}</span>
                </div>
                {selectedProduct === product.id && (
                  <div className="selected-check">✓</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 团购时长 */}
        <div className="section-card">
          <div className="section-header">
            <h3>{t('createGroup.duration')}</h3>
            <span className="hint-text">{t('createGroup.durationHint')}</span>
          </div>
          <div className="duration-options">
            {durations.map((item) => (
              <button
                key={item.value}
                className={`duration-option ${duration === item.value ? 'selected' : ''}`}
                onClick={() => setDuration(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* 团购设置 */}
        <div className="section-card">
          <div className="section-header">
            <h3>{t('createGroup.settings')}</h3>
          </div>
          <div className="setting-options">
            <div className="setting-item">
              <div className="setting-info">
                <h4>{t('createGroup.publicGroup')}</h4>
                <p>{t('createGroup.publicGroupDesc')}</p>
              </div>
              <button 
                className={`toggle-switch ${isPublic ? 'active' : ''}`}
                onClick={() => setIsPublic(!isPublic)}
              >
                <div className="toggle-thumb" />
              </button>
            </div>
          </div>
        </div>

        {/* 奖励预览 */}
        <div className="rewards-preview">
          <div className="rewards-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <h3>{t('createGroup.leaderRewards')}</h3>
          </div>
          <div className="rewards-list">
            <div className="reward-item">
              <span className="reward-icon">🎁</span>
              <div className="reward-info">
                <h4>{t('createGroup.extraDiscount')}</h4>
                <p>{t('createGroup.extraDiscountDesc')}</p>
              </div>
            </div>
            <div className="reward-item">
              <span className="reward-icon">⭐</span>
              <div className="reward-info">
                <h4>{t('createGroup.bonusPoints')}</h4>
                <p>{t('createGroup.bonusPointsDesc')}</p>
              </div>
            </div>
            <div className="reward-item">
              <span className="reward-icon">🏆</span>
              <div className="reward-info">
                <h4>{t('createGroup.prioritySupport')}</h4>
                <p>{t('createGroup.prioritySupportDesc')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 规则说明 */}
        <div className="rules-card">
          <h4>{t('createGroup.rules')}</h4>
          <ul>
            <li>{t('createGroup.rule1')}</li>
            <li>{t('createGroup.rule2')}</li>
            <li>{t('createGroup.rule3')}</li>
            <li>{t('createGroup.rule4')}</li>
          </ul>
        </div>
      </div>

      {/* 底部确认栏 */}
      <div className="create-group-footer">
        <div className="footer-info">
          <span className="footer-label">{t('createGroup.depositRequired')}</span>
          <span className="footer-amount">
            {selectedProduct ? `¥${availableProducts.find(p => p.id === selectedProduct)?.price || 0}` : '--'}
          </span>
        </div>
        <button 
          className="confirm-create-btn" 
          onClick={onConfirm}
          disabled={!selectedProduct}
        >
          {t('createGroup.confirmCreate')}
        </button>
      </div>
    </div>
  );
};

export default CreateGroupPage;

