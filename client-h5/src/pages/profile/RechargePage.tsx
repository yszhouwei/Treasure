import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';
import { PaymentsService } from '../../services/payments.service';
import { useAuth } from '../../context/AuthContext';
import './RechargePage.css';

interface RechargePageProps {
  onBack: () => void;
  onSuccess?: () => void;
}

const RechargePage: React.FC<RechargePageProps> = ({ onBack, onSuccess }) => {
  const { t } = useTranslation();
  const { user, refreshUser } = useAuth();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const quickAmounts = [100, 200, 500, 1000, 2000, 5000];
  const paymentMethods = [
    { id: 'wechat', name: t('profile.recharge.wechat'), icon: '💚' },
    { id: 'alipay', name: t('profile.recharge.alipay'), icon: '💙' },
    { id: 'card', name: t('profile.recharge.card'), icon: '💳' },
  ];

  const handleAmountClick = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setCustomAmount(value);
      setSelectedAmount(null);
    }
  };

  const getCurrentAmount = () => {
    if (customAmount) return Number.parseInt(customAmount, 10);
    if (selectedAmount) return selectedAmount;
    return 0;
  };

  const handleRecharge = async () => {
    const amount = getCurrentAmount();
    if (amount <= 0) {
      setError(t('profile.recharge.amountError') || '请输入有效金额');
      return;
    }
    if (!selectedPayment) {
      setError(t('profile.recharge.paymentError') || '请选择支付方式');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await PaymentsService.recharge({
        amount: amount,
        payment_method: selectedPayment
      });

      // 刷新用户数据
      if (refreshUser) {
        await refreshUser();
      }

      // 成功提示
      alert(`${t('profile.recharge.success') || '充值成功'}: ¥${amount}`);
      
      // 调用成功回调
      if (onSuccess) {
        onSuccess();
      } else {
        onBack();
      }
    } catch (err: any) {
      console.error('充值失败:', err);
      setError(err.message || err.data?.message || '充值失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const currentAmount = getCurrentAmount();

  return (
    <div className="recharge-page-container">
      <Header onBack={onBack} title={t('profile.recharge.title')} />
      
      <div className="recharge-page-content">
        <section className="recharge-balance-card">
          <div className="recharge-balance-label">{t('profile.recharge.currentBalance')}</div>
          <div className="recharge-balance-value">¥ {user?.balance?.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</div>
          <div className="recharge-balance-hint">{t('profile.recharge.balanceHint')}</div>
        </section>

        <section className="recharge-amount-section">
          <h2 className="recharge-section-title">{t('profile.recharge.selectAmount')}</h2>
          
          <div className="recharge-quick-amounts">
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                className={`recharge-amount-btn ${selectedAmount === amount ? 'active' : ''}`}
                onClick={() => handleAmountClick(amount)}
              >
                <span className="recharge-amount-symbol">¥</span>
                <span className="recharge-amount-number">{amount}</span>
              </button>
            ))}
          </div>

          <div className="recharge-custom-amount">
            <label htmlFor="customAmount" className="recharge-custom-label">
              {t('profile.recharge.customAmount')}
            </label>
            <div className="recharge-custom-input-wrapper">
              <span className="recharge-input-prefix">¥</span>
              <input
                id="customAmount"
                type="text"
                className="recharge-custom-input"
                placeholder={t('profile.recharge.customPlaceholder')}
                value={customAmount}
                onChange={handleCustomAmountChange}
              />
            </div>
          </div>
        </section>

        <section className="recharge-payment-section">
          <h2 className="recharge-section-title">{t('profile.recharge.selectPayment')}</h2>
          
          <div className="recharge-payment-methods">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                className={`recharge-payment-btn ${selectedPayment === method.id ? 'active' : ''}`}
                onClick={() => setSelectedPayment(method.id)}
              >
                <span className="recharge-payment-icon">{method.icon}</span>
                <span className="recharge-payment-name">{method.name}</span>
                <span className="recharge-payment-check">✓</span>
              </button>
            ))}
          </div>
        </section>

        <section className="recharge-summary-section">
          <div className="recharge-summary-row">
            <span className="recharge-summary-label">{t('profile.recharge.rechargeAmount')}</span>
            <span className="recharge-summary-value">¥ {currentAmount}</span>
          </div>
          <div className="recharge-summary-row">
            <span className="recharge-summary-label">{t('profile.recharge.bonus')}</span>
            <span className="recharge-summary-bonus">+¥ {Math.floor(currentAmount * 0.02)}</span>
          </div>
          <div className="recharge-summary-divider"></div>
          <div className="recharge-summary-row recharge-summary-total">
            <span className="recharge-summary-label">{t('profile.recharge.totalReceive')}</span>
            <span className="recharge-summary-value">¥ {currentAmount + Math.floor(currentAmount * 0.02)}</span>
          </div>
        </section>

        {/* 错误提示 */}
        {error && (
          <div style={{ 
            padding: '12px 16px', 
            margin: '16px 0', 
            background: '#fff2f0', 
            border: '1px solid #ffccc7', 
            borderRadius: '8px', 
            color: '#ff4d4f',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <button
          className="recharge-submit-btn"
          onClick={handleRecharge}
          disabled={currentAmount <= 0 || !selectedPayment || loading}
        >
          {loading ? (t('common.loading') || '充值中...') : t('profile.recharge.submit')}
        </button>

        <div className="recharge-tips">
          <div className="recharge-tips-title">{t('profile.recharge.tipsTitle')}</div>
          <ul className="recharge-tips-list">
            <li>{t('profile.recharge.tip1')}</li>
            <li>{t('profile.recharge.tip2')}</li>
            <li>{t('profile.recharge.tip3')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RechargePage;

