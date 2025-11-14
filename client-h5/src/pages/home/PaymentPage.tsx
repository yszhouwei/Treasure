import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './PaymentPage.css';

interface PaymentPageProps {
  order: {
    orderNo: string;
    productName: string;
    quantity: number;
    amount: number;
    groupType: string;
  };
  onBack: () => void;
  onSuccess: () => void;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ order, onBack, onSuccess }) => {
  const { t } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState<string>('wechat');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const paymentMethods = [
    { id: 'wechat', name: t('payment.wechatPay'), icon: '💬', color: '#07C160' },
    { id: 'alipay', name: t('payment.alipay'), icon: '💰', color: '#1677FF' },
    { id: 'balance', name: t('payment.balance'), icon: '👛', color: '#D4A574', balance: 1250.00 }
  ];

  const handlePay = () => {
    if (!agreeTerms) {
      alert(t('payment.pleaseAgreeTerms'));
      return;
    }
    setIsPaying(true);
    // 模拟支付过程
    setTimeout(() => {
      setIsPaying(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="payment-page">
      {/* 头部 */}
      <div className="payment-header">
        <button className="back-btn" onClick={onBack} aria-label="返回">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1>{t('payment.title')}</h1>
        <div style={{ width: 40 }} />
      </div>

      <div className="payment-content">
        {/* 支付金额 */}
        <div className="payment-amount-card">
          <div className="amount-label">{t('payment.paymentAmount')}</div>
          <div className="amount-value">¥{order.amount.toFixed(2)}</div>
          <div className="amount-note">{t('payment.securePayment')}</div>
        </div>

        {/* 订单信息 */}
        <div className="order-info-card">
          <div className="order-info-header">
            <h3>{t('payment.orderInfo')}</h3>
            <span className="order-no">#{order.orderNo}</span>
          </div>
          <div className="order-info-rows">
            <div className="info-row">
              <span className="info-label">{t('payment.product')}</span>
              <span className="info-value">{order.productName}</span>
            </div>
            <div className="info-row">
              <span className="info-label">{t('payment.quantity')}</span>
              <span className="info-value">×{order.quantity}</span>
            </div>
            <div className="info-row">
              <span className="info-label">{t('payment.groupType')}</span>
              <span className="info-value">{order.groupType}</span>
            </div>
          </div>
        </div>

        {/* 支付方式 */}
        <div className="payment-methods-card">
          <h3>{t('payment.paymentMethod')}</h3>
          <div className="payment-methods-list">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`payment-method-item ${selectedMethod === method.id ? 'selected' : ''}`}
                onClick={() => setSelectedMethod(method.id)}
              >
                <div className="method-left">
                  <div className="method-icon" style={{ backgroundColor: `${method.color}20` }}>
                    <span style={{ color: method.color }}>{method.icon}</span>
                  </div>
                  <div className="method-info">
                    <h4>{method.name}</h4>
                    {method.id === 'balance' && method.balance !== undefined && (
                      <span className="balance-amount">
                        {t('payment.availableBalance')}: ¥{method.balance.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="method-radio">
                  {selectedMethod === method.id && <div className="radio-dot" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 优惠信息 */}
        <div className="discount-card">
          <div className="discount-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
              <line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
            <span>{t('payment.couponAvailable')}</span>
          </div>
          <button className="select-coupon-btn">
            {t('payment.selectCoupon')} →
          </button>
        </div>

        {/* 支付说明 */}
        <div className="payment-notice">
          <h4>{t('payment.paymentNotice')}</h4>
          <ul>
            <li>{t('payment.notice1')}</li>
            <li>{t('payment.notice2')}</li>
            <li>{t('payment.notice3')}</li>
          </ul>
        </div>
      </div>

      {/* 底部支付栏 */}
      <div className="payment-footer">
        <label className="terms-checkbox">
          <input 
            type="checkbox" 
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
          />
          <span>
            {t('payment.agreeToTerms')}
            <a href="#terms" onClick={(e) => e.preventDefault()}>《{t('payment.terms')}》</a>
          </span>
        </label>
        <button 
          className="pay-now-btn" 
          onClick={handlePay}
          disabled={isPaying || !agreeTerms}
        >
          {isPaying ? t('payment.processing') : t('payment.payNow')}
        </button>
      </div>

      {/* 支付处理中遮罩 */}
      {isPaying && (
        <div className="payment-loading-overlay">
          <div className="payment-loading-content">
            <div className="loading-spinner" />
            <p>{t('payment.processingPayment')}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;

