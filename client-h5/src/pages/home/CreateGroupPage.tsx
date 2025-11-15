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
  onConfirm: (data?: { productName?: string }) => void;
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
        <h1>{t('createGroup.title') || '申请开团'}</h1>
        <div style={{ width: 40 }} />
      </div>

      <div className="create-group-content">
        {/* 团购类型卡片 */}
        <div className="selected-type-card" style={{ backgroundColor: `${groupType.color}15` }}>
          <div className="type-badge" style={{ backgroundColor: groupType.color }}>
            {groupType.name}
          </div>
          <div className="type-info">
            <p>{t('createGroup.typeDescription') || '邀请好友加入省更多'}</p>
            <p className="type-hint">{t('createGroup.typeHint') || '审核通过后即可发起此规模的团购活动'}</p>
          </div>
        </div>

        {/* 选择商品 */}
        <div className="section-card">
          <div className="section-header">
            <h3>{t('createGroup.selectProduct') || '选择商品'}</h3>
            <span className="required-badge">{t('common.required') || '必填'}</span>
          </div>
          <p className="section-hint">{t('createGroup.selectProductHint') || '请选择您想要发起团购的商品（可选，审核通过后可修改）'}</p>
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
            <h3>{t('createGroup.duration') || '团购时长'}</h3>
            <span className="hint-text">{t('createGroup.durationHint') || '推荐 24-48小时'}</span>
          </div>
          <p className="section-hint">{t('createGroup.durationDesc') || '团购活动持续时间，审核通过后可在后台调整'}</p>
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
            <h3>{t('createGroup.settings') || '团购设置'}</h3>
          </div>
          <p className="section-hint">{t('createGroup.settingsHint') || '审核通过后可在后台修改这些设置'}</p>
          <div className="setting-options">
            <div className="setting-item">
              <div className="setting-info">
                <h4>{t('createGroup.publicGroup') || '公开团购'}</h4>
                <p>{t('createGroup.publicGroupDesc') || '其他人可搜索并加入你的团购'}</p>
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

        {/* 团长权益说明 */}
        <div className="rewards-preview">
          <div className="rewards-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <h3>{t('createGroup.leaderRewards') || '团长权益'}</h3>
          </div>
          <p className="rewards-hint">{t('createGroup.leaderRewardsHint') || '审核通过成为团长后，您将享受以下专属权益'}</p>
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
          <h4>{t('createGroup.rules') || '团购规则'}</h4>
          <p className="rules-hint">{t('createGroup.rulesHint') || '请仔细阅读以下规则，确保您了解团购流程'}</p>
          <ul>
            <li>{t('createGroup.rule1') || '团长先付款，成团后一起发货'}</li>
            <li>{t('createGroup.rule2') || '团购过期自动退款，3-5个工作日'}</li>
            <li>{t('createGroup.rule3') || '团长获得额外积分和优惠券奖励'}</li>
            <li>{t('createGroup.rule4') || '成功后不支持单独退款，仅全团退款'}</li>
          </ul>
        </div>
      </div>

      {/* 底部确认栏 */}
      <div className="create-group-footer">
        <div className="footer-info">
          <span className="footer-label">{t('createGroup.depositRequired') || '申请说明'}</span>
          <span className="footer-desc">{t('createGroup.depositDesc') || '提交申请后，平台将在1-3个工作日内完成审核'}</span>
        </div>
        <button 
          className="confirm-create-btn" 
          onClick={() => {
            const productName = availableProducts.find(p => p.id === selectedProduct)?.name;
            onConfirm({ productName });
          }}
          disabled={!selectedProduct}
        >
          {t('createGroup.confirmCreate') || '提交申请'}
        </button>
      </div>
    </div>
  );
};

export default CreateGroupPage;

