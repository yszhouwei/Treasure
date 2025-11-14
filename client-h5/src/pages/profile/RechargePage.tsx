import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';
import './RechargePage.css';

interface RechargePageProps {
  onBack: () => void;
}

const RechargePage: React.FC<RechargePageProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<string>('');

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

  const handleRecharge = () => {
    const amount = getCurrentAmount();
    if (amount <= 0) {
      alert(t('profile.recharge.amountError'));
      return;
    }
    if (!selectedPayment) {
      alert(t('profile.recharge.paymentError'));
      return;
    }
    alert(`${t('profile.recharge.success')}: ¥${amount}`);
  };

  const currentAmount = getCurrentAmount();

  return (
    <div className="recharge-page-container">
      <Header onBack={onBack} title={t('profile.recharge.title')} />
      
      <div className="recharge-page-content">
        <section className="recharge-balance-card">
          <div className="recharge-balance-label">{t('profile.recharge.currentBalance')}</div>
          <div className="recharge-balance-value">¥ 58,920</div>
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

        <button
          className="recharge-submit-btn"
          onClick={handleRecharge}
          disabled={currentAmount <= 0 || !selectedPayment}
        >
          {t('profile.recharge.submit')}
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

