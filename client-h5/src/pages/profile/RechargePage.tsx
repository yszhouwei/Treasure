import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';
import { PaymentsService } from '../../services/payments.service';
import { PaymentPluginsService, type PaymentPlugin } from '../../services/payment-plugins.service';
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
  const [availablePlugins, setAvailablePlugins] = useState<PaymentPlugin[]>([]);
  const [loadingPlugins, setLoadingPlugins] = useState(true);

  const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

  // 加载可用的支付插件（用于充值）
  useEffect(() => {
    const loadPlugins = async () => {
      try {
        setLoadingPlugins(true);
        // 根据用户地区获取可用插件
        const plugins = await PaymentPluginsService.getAvailablePlugins('CN', 'CNY');
        setAvailablePlugins(plugins);
        
        // 默认选择第一个插件
        if (plugins.length > 0) {
          setSelectedPayment(plugins[0].plugin_code);
        }
      } catch (err: any) {
        console.error('加载支付插件失败:', err);
        // 如果加载失败，使用默认支付方式
        setSelectedPayment('wechat_pay');
      } finally {
        setLoadingPlugins(false);
      }
    };

    loadPlugins();
  }, []);

  // 获取支付方式显示信息
  const getPaymentMethodInfo = (plugin: PaymentPlugin) => {
    const methodMap: Record<string, { icon: string; name: string }> = {
      'wechat_pay': { icon: '💚', name: t('profile.recharge.wechat') || '微信支付' },
      'alipay': { icon: '💙', name: t('profile.recharge.alipay') || '支付宝' },
      'bank_transfer': { icon: '🏦', name: '银行转账' },
      'paypal': { icon: '💳', name: 'PayPal' },
      'stripe': { icon: '💳', name: 'Stripe' },
      'usdt_trc20': { icon: '₮', name: 'USDT (TRC20)' },
      'usdt_erc20': { icon: '₮', name: 'USDT (ERC20)' },
      'usdt_bep20': { icon: '₮', name: 'USDT (BEP20)' },
    };
    
    return methodMap[plugin.plugin_code] || { icon: '💳', name: plugin.plugin_name };
  };

  // 构建支付方式列表
  const paymentMethods = availablePlugins.map(plugin => {
    const info = getPaymentMethodInfo(plugin);
    return {
      id: plugin.plugin_code,
      name: info.name,
      icon: info.icon,
      plugin,
    };
  });

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
          
          {loadingPlugins ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
              加载支付方式中...
            </div>
          ) : (
            <div className="recharge-payment-methods">
              {paymentMethods.map((method) => {
                const selectedPlugin = method.plugin;
                const fee = selectedPlugin ? PaymentPluginsService.calculateFee(selectedPlugin, currentAmount) : 0;
                const showFee = fee > 0;
                
                return (
                  <button
                    key={method.id}
                    className={`recharge-payment-btn ${selectedPayment === method.id ? 'active' : ''}`}
                    onClick={() => setSelectedPayment(method.id)}
                  >
                    <span className="recharge-payment-icon">{method.icon}</span>
                    <div className="recharge-payment-info">
                      <span className="recharge-payment-name">{method.name}</span>
                      {showFee && selectedPayment === method.id && (
                        <span className="recharge-payment-fee" style={{ fontSize: '12px', color: '#999' }}>
                          手续费: ¥{fee.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <span className="recharge-payment-check">✓</span>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <section className="recharge-summary-section">
          <div className="recharge-summary-row">
            <span className="recharge-summary-label">{t('profile.recharge.rechargeAmount')}</span>
            <span className="recharge-summary-value">¥ {currentAmount}</span>
          </div>
          {(() => {
            const selectedPlugin = availablePlugins.find(p => p.plugin_code === selectedPayment);
            const fee = selectedPlugin ? PaymentPluginsService.calculateFee(selectedPlugin, currentAmount) : 0;
            if (fee > 0) {
              return (
                <div className="recharge-summary-row">
                  <span className="recharge-summary-label">手续费</span>
                  <span className="recharge-summary-fee">-¥ {fee.toFixed(2)}</span>
                </div>
              );
            }
            return null;
          })()}
          <div className="recharge-summary-row">
            <span className="recharge-summary-label">{t('profile.recharge.bonus')}</span>
            <span className="recharge-summary-bonus">+¥ {Math.floor(currentAmount * 0.02)}</span>
          </div>
          <div className="recharge-summary-divider"></div>
          <div className="recharge-summary-row recharge-summary-total">
            <span className="recharge-summary-label">{t('profile.recharge.totalReceive')}</span>
            <span className="recharge-summary-value">
              ¥ {(() => {
                const selectedPlugin = availablePlugins.find(p => p.plugin_code === selectedPayment);
                const fee = selectedPlugin ? PaymentPluginsService.calculateFee(selectedPlugin, currentAmount) : 0;
                return (currentAmount - fee + Math.floor(currentAmount * 0.02)).toFixed(2);
              })()}
            </span>
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

