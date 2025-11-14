import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';
import './WithdrawPage.css';

interface WithdrawPageProps {
  onBack: () => void;
}

const WithdrawPage: React.FC<WithdrawPageProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState<string>('');
  const [selectedAccount, setSelectedAccount] = useState<string>('');

  const availableBalance = 58920;
  const minWithdraw = 100;
  const maxWithdraw = availableBalance;
  const fee = 2; // 2% fee

  const accounts = [
    { id: 'wechat', name: t('profile.withdraw.wechat'), icon: '💚', number: 'wx***123' },
    { id: 'alipay', name: t('profile.withdraw.alipay'), icon: '💙', number: 'ali***456' },
    { id: 'bank', name: t('profile.withdraw.bank'), icon: '🏦', number: '****1234' },
  ];

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value);
    }
  };

  const handleQuickAmount = (percentage: number) => {
    const quickAmount = Math.floor(availableBalance * percentage);
    setAmount(quickAmount.toString());
  };

  const getWithdrawAmount = () => {
    return amount ? Number.parseFloat(amount) : 0;
  };

  const getFeeAmount = () => {
    const withdrawAmount = getWithdrawAmount();
    return Math.ceil(withdrawAmount * (fee / 100));
  };

  const getActualAmount = () => {
    return getWithdrawAmount() - getFeeAmount();
  };

  const handleWithdraw = () => {
    const withdrawAmount = getWithdrawAmount();
    
    if (withdrawAmount < minWithdraw) {
      alert(t('profile.withdraw.minError', { min: minWithdraw }));
      return;
    }
    
    if (withdrawAmount > maxWithdraw) {
      alert(t('profile.withdraw.maxError'));
      return;
    }
    
    if (!selectedAccount) {
      alert(t('profile.withdraw.accountError'));
      return;
    }
    
    alert(`${t('profile.withdraw.success')}: ¥${withdrawAmount}`);
  };

  const withdrawAmount = getWithdrawAmount();
  const feeAmount = getFeeAmount();
  const actualAmount = getActualAmount();

  return (
    <div className="withdraw-page-container">
      <Header onBack={onBack} title={t('profile.withdraw.title')} />
      
      <div className="withdraw-page-content">
        <section className="withdraw-balance-card">
          <div className="withdraw-balance-label">{t('profile.withdraw.availableBalance')}</div>
          <div className="withdraw-balance-value">¥ {availableBalance.toLocaleString()}</div>
          <div className="withdraw-balance-hint">{t('profile.withdraw.balanceHint')}</div>
        </section>

        <section className="withdraw-amount-section">
          <h2 className="withdraw-section-title">{t('profile.withdraw.withdrawAmount')}</h2>
          
          <div className="withdraw-amount-input-wrapper">
            <span className="withdraw-input-prefix">¥</span>
            <input
              type="text"
              className="withdraw-amount-input"
              placeholder={t('profile.withdraw.amountPlaceholder', { min: minWithdraw })}
              value={amount}
              onChange={handleAmountChange}
            />
            <button className="withdraw-all-btn" onClick={() => handleQuickAmount(1)}>
              {t('profile.withdraw.withdrawAll')}
            </button>
          </div>

          <div className="withdraw-quick-btns">
            <button onClick={() => handleQuickAmount(0.25)}>25%</button>
            <button onClick={() => handleQuickAmount(0.5)}>50%</button>
            <button onClick={() => handleQuickAmount(0.75)}>75%</button>
          </div>

          <div className="withdraw-limit-hint">
            {t('profile.withdraw.limitHint', { min: minWithdraw, max: maxWithdraw.toLocaleString() })}
          </div>
        </section>

        <section className="withdraw-account-section">
          <h2 className="withdraw-section-title">{t('profile.withdraw.selectAccount')}</h2>
          
          <div className="withdraw-accounts">
            {accounts.map((account) => (
              <button
                key={account.id}
                className={`withdraw-account-btn ${selectedAccount === account.id ? 'active' : ''}`}
                onClick={() => setSelectedAccount(account.id)}
              >
                <div className="withdraw-account-left">
                  <span className="withdraw-account-icon">{account.icon}</span>
                  <div className="withdraw-account-info">
                    <div className="withdraw-account-name">{account.name}</div>
                    <div className="withdraw-account-number">{account.number}</div>
                  </div>
                </div>
                <span className="withdraw-account-check">✓</span>
              </button>
            ))}
          </div>

          <button className="withdraw-add-account-btn">
            <span>➕</span>
            {t('profile.withdraw.addAccount')}
          </button>
        </section>

        <section className="withdraw-summary-section">
          <div className="withdraw-summary-row">
            <span className="withdraw-summary-label">{t('profile.withdraw.withdrawAmount')}</span>
            <span className="withdraw-summary-value">¥ {withdrawAmount.toFixed(2)}</span>
          </div>
          <div className="withdraw-summary-row">
            <span className="withdraw-summary-label">
              {t('profile.withdraw.fee', { fee })}
            </span>
            <span className="withdraw-summary-fee">-¥ {feeAmount.toFixed(2)}</span>
          </div>
          <div className="withdraw-summary-divider"></div>
          <div className="withdraw-summary-row withdraw-summary-total">
            <span className="withdraw-summary-label">{t('profile.withdraw.actualReceive')}</span>
            <span className="withdraw-summary-value">¥ {actualAmount.toFixed(2)}</span>
          </div>
        </section>

        <button
          className="withdraw-submit-btn"
          onClick={handleWithdraw}
          disabled={withdrawAmount < minWithdraw || !selectedAccount}
        >
          {t('profile.withdraw.submit')}
        </button>

        <div className="withdraw-tips">
          <div className="withdraw-tips-title">{t('profile.withdraw.tipsTitle')}</div>
          <ul className="withdraw-tips-list">
            <li>{t('profile.withdraw.tip1')}</li>
            <li>{t('profile.withdraw.tip2')}</li>
            <li>{t('profile.withdraw.tip3')}</li>
          </ul>
        </div>

        <section className="withdraw-history-section">
          <h2 className="withdraw-section-title">{t('profile.withdraw.recentHistory')}</h2>
          
          <div className="withdraw-history-list">
            <div className="withdraw-history-item">
              <div className="withdraw-history-left">
                <div className="withdraw-history-title">{t('profile.withdraw.historyItem1')}</div>
                <div className="withdraw-history-date">2025-11-13 15:30</div>
              </div>
              <div className="withdraw-history-right">
                <div className="withdraw-history-amount">-¥ 5,000</div>
                <div className="withdraw-history-status success">{t('profile.withdraw.statusSuccess')}</div>
              </div>
            </div>
            <div className="withdraw-history-item">
              <div className="withdraw-history-left">
                <div className="withdraw-history-title">{t('profile.withdraw.historyItem2')}</div>
                <div className="withdraw-history-date">2025-11-10 09:15</div>
              </div>
              <div className="withdraw-history-right">
                <div className="withdraw-history-amount">-¥ 10,000</div>
                <div className="withdraw-history-status success">{t('profile.withdraw.statusSuccess')}</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default WithdrawPage;

