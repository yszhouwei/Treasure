import React, { useState } from 'react';
import './RechargePage.css';

interface RechargePageProps {
  currentBalance: string;
  onBack: () => void;
  onSuccess?: (amount: number) => void;
}

const RechargePage: React.FC<RechargePageProps> = ({ currentBalance, onBack, onSuccess }) => {
  const [amount, setAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'wechat' | 'alipay' | 'bank'>('wechat');
  const [agreed, setAgreed] = useState(false);

  // 预设充值金额
  const presetAmounts = [50, 100, 200, 500, 1000, 2000];

  const handleAmountSelect = (value: number) => {
    setAmount(value);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setCustomAmount(value);
      setAmount(numValue);
    } else if (value === '') {
      setCustomAmount('');
      setAmount(0);
    }
  };

  const handleSubmit = () => {
    if (amount <= 0) {
      alert('请输入充值金额');
      return;
    }
    if (!agreed) {
      alert('请先阅读并同意充值协议');
      return;
    }

    // 模拟支付处理
    setTimeout(() => {
      alert(`充值成功！金额：¥${amount}`);
      if (onSuccess) {
        onSuccess(amount);
      }
      onBack();
    }, 1000);
  };

  return (
    <div className="recharge-page">
      {/* 头部 */}
      <div className="recharge-header">
        <button className="back-btn" onClick={onBack} aria-label="返回">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1>账户充值</h1>
      </div>

      {/* 内容 */}
      <div className="recharge-content">
        {/* 当前余额 */}
        <section className="recharge-card balance-card">
          <div className="balance-info">
            <span className="balance-label">当前余额</span>
            <span className="balance-value">{currentBalance}</span>
          </div>
        </section>

        {/* 充值金额选择 */}
        <section className="recharge-card">
          <h2>选择充值金额</h2>
          <div className="amount-grid">
            {presetAmounts.map((value) => (
              <button
                key={value}
                className={`amount-btn ${amount === value && !customAmount ? 'active' : ''}`}
                onClick={() => handleAmountSelect(value)}
              >
                <span className="amount-value">¥{value}</span>
              </button>
            ))}
          </div>

          {/* 自定义金额 */}
          <div className="custom-amount">
            <label>自定义金额</label>
            <div className="custom-amount-input-wrapper">
              <span className="currency-symbol">¥</span>
              <input
                type="number"
                className="custom-amount-input"
                placeholder="请输入金额"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
            <p className="amount-hint">单笔充值金额不低于 ¥10，不超过 ¥50,000</p>
          </div>
        </section>

        {/* 支付方式 */}
        <section className="recharge-card">
          <h2>选择支付方式</h2>
          <div className="payment-methods">
            <div
              className={`payment-method ${paymentMethod === 'wechat' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('wechat')}
            >
              <div className="payment-icon wechat">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <div className="payment-info">
                <h4>微信支付</h4>
                <p>推荐使用，安全快捷</p>
              </div>
              <div className="payment-radio">
                {paymentMethod === 'wechat' && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </div>
            </div>

            <div
              className={`payment-method ${paymentMethod === 'alipay' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('alipay')}
            >
              <div className="payment-icon alipay">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
              </div>
              <div className="payment-info">
                <h4>支付宝</h4>
                <p>便捷支付，即时到账</p>
              </div>
              <div className="payment-radio">
                {paymentMethod === 'alipay' && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </div>
            </div>

            <div
              className={`payment-method ${paymentMethod === 'bank' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('bank')}
            >
              <div className="payment-icon bank">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <div className="payment-info">
                <h4>银行卡</h4>
                <p>支持各大银行储蓄卡</p>
              </div>
              <div className="payment-radio">
                {paymentMethod === 'bank' && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 充值说明 */}
        <section className="recharge-card info-card">
          <h2>充值说明</h2>
          <div className="info-list">
            <div className="info-item">
              <span className="info-icon">⚡</span>
              <p>充值实时到账，无需等待</p>
            </div>
            <div className="info-item">
              <span className="info-icon">🔒</span>
              <p>支付全程加密，资金安全有保障</p>
            </div>
            <div className="info-item">
              <span className="info-icon">💰</span>
              <p>充值金额可用于参与团购、支付订单</p>
            </div>
            <div className="info-item">
              <span className="info-icon">📞</span>
              <p>如有疑问，请联系客服 400-123-4567</p>
            </div>
          </div>
        </section>

        {/* 协议 */}
        <div className="agreement">
          <label className="agreement-checkbox">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span className="checkbox-icon">
              {agreed && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </span>
            <span className="agreement-text">
              我已阅读并同意 <a href="#agreement">《充值服务协议》</a>
            </span>
          </label>
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="recharge-footer">
        <div className="footer-info">
          <div className="footer-label">充值金额</div>
          <div className="footer-amount">¥ {amount.toFixed(2)}</div>
        </div>
        <button 
          className={`recharge-submit-btn ${amount > 0 && agreed ? '' : 'disabled'}`}
          onClick={handleSubmit}
          disabled={amount <= 0 || !agreed}
        >
          立即充值
        </button>
      </div>
    </div>
  );
};

export default RechargePage;

