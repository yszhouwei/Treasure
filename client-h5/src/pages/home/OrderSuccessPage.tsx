import React from 'react';
import { useTranslation } from 'react-i18next';
import './OrderSuccessPage.css';

interface OrderSuccessPageProps {
  order: {
    orderNo: string;
    productName: string;
    amount: number;
    groupSize: number;
    currentMembers: number;
    estimatedTime: string;
  };
  onViewOrder: () => void;
  onBackHome: () => void;
  onInviteFriends: () => void;
  onViewLottery?: () => void;
}

const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ 
  order, 
  onViewOrder, 
  onBackHome, 
  onInviteFriends,
  onViewLottery
}) => {
  const { t } = useTranslation();

  const progress = (order.currentMembers / order.groupSize) * 100;
  const remaining = order.groupSize - order.currentMembers;

  return (
    <div className="order-success-page">
      <div className="success-content">
        {/* 成功图标 */}
        <div className="success-icon-wrapper">
          <div className="success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="22 4 12 14.01 9 11.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="success-particles">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="particle" style={{ '--i': i } as React.CSSProperties} />
            ))}
          </div>
        </div>

        {/* 标题 */}
        <h1 className="success-title">{t('orderSuccess.title')}</h1>
        <p className="success-subtitle">{t('orderSuccess.subtitle')}</p>

        {/* 订单卡片 */}
        <div className="order-success-card">
          <div className="order-card-header">
            <span className="order-label">{t('orderSuccess.orderNumber')}</span>
            <span className="order-number">{order.orderNo}</span>
          </div>
          
          <div className="order-divider" />
          
          <div className="order-details-grid">
            <div className="order-detail-item">
              <span className="detail-label">{t('orderSuccess.product')}</span>
              <span className="detail-value">{order.productName}</span>
            </div>
            <div className="order-detail-item">
              <span className="detail-label">{t('orderSuccess.amount')}</span>
              <span className="detail-value amount">¥{order.amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* 团购进度 */}
        <div className="group-progress-card">
          <div className="progress-header">
            <h3>{t('orderSuccess.groupProgress')}</h3>
            <span className="progress-members">
              {order.currentMembers}/{order.groupSize} {t('orderSuccess.members')}
            </span>
          </div>
          
          <div className="progress-bar-wrapper">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="progress-percentage">{Math.round(progress)}%</span>
          </div>

          {remaining > 0 ? (
            <div className="progress-status waiting">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>
                {t('orderSuccess.stillNeed', { count: remaining })}
              </span>
            </div>
          ) : (
            <>
              <div className="progress-status success">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <span>{t('orderSuccess.groupComplete')}</span>
              </div>
              {onViewLottery && (
                <button 
                  className="lottery-btn"
                  onClick={onViewLottery}
                  style={{
                    marginTop: '16px',
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #D4A574 0%, #B8860B 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '24px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(212, 165, 116, 0.4)'
                  }}
                >
                  🎁 {t('orderSuccess.viewLottery') || '查看开奖'}
                </button>
              )}
            </>
          )}

          <div className="estimated-time">
            <span className="time-icon">⏰</span>
            <span>{t('orderSuccess.estimatedTime')}: {order.estimatedTime}</span>
          </div>
        </div>

        {/* 邀请好友 */}
        {remaining > 0 && (
          <div className="invite-card">
            <div className="invite-header">
              <div className="invite-icon">🎁</div>
              <div className="invite-text">
                <h4>{t('orderSuccess.inviteTitle')}</h4>
                <p>{t('orderSuccess.inviteDesc')}</p>
              </div>
            </div>
            <button className="invite-btn" onClick={onInviteFriends}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                <polyline points="16 6 12 2 8 6"/>
                <line x1="12" y1="2" x2="12" y2="15"/>
              </svg>
              {t('orderSuccess.shareWithFriends')}
            </button>
          </div>
        )}

        {/* 提示信息 */}
        <div className="tips-card">
          <h4>{t('orderSuccess.tips')}</h4>
          <ul>
            <li>{t('orderSuccess.tip1')}</li>
            <li>{t('orderSuccess.tip2')}</li>
            <li>{t('orderSuccess.tip3')}</li>
          </ul>
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="success-footer">
        <button className="view-order-btn" onClick={onViewOrder}>
          {t('orderSuccess.viewOrder')}
        </button>
        <button className="back-home-btn" onClick={onBackHome}>
          {t('orderSuccess.backHome')}
        </button>
      </div>
    </div>
  );
};

export default OrderSuccessPage;

