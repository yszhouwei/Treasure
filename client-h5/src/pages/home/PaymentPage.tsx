import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { OrdersService } from '../../services/orders.service';
import { PaymentPluginsService, type PaymentPlugin } from '../../services/payment-plugins.service';
import { useAuth } from '../../context/AuthContext';
import PaymentProcessModal from '../../components/PaymentProcessModal';
import './PaymentPage.css';

interface PaymentPageProps {
  order: {
    orderNo: string;
    productName: string;
    quantity: number;
    amount: number;
    groupType: string;
    orderId?: number;
    groupSize?: number;
    currentMembers?: number;
  };
  onBack: () => void;
  onSuccess: () => void;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ order, onBack, onSuccess }) => {
  const { t } = useTranslation();
  const { user, refreshUser } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availablePlugins, setAvailablePlugins] = useState<PaymentPlugin[]>([]);
  const [loadingPlugins, setLoadingPlugins] = useState(true);
  const [paymentProcessVisible, setPaymentProcessVisible] = useState(false);
  const [paymentProcessData, setPaymentProcessData] = useState<any>(null);

  // 确保余额是数字类型
  const userBalance = typeof user?.balance === 'number' ? user.balance : (typeof user?.balance === 'string' ? parseFloat(user.balance) || 0 : 0);

  // 加载可用的支付插件
  useEffect(() => {
    const loadPlugins = async () => {
      try {
        setLoadingPlugins(true);
        console.log('🔄 开始加载支付插件...');
        
        // 先尝试不传地区参数，获取所有已启用的插件
        let plugins = await PaymentPluginsService.getAvailablePlugins();
        console.log('📦 获取到所有插件:', plugins);
        
        // 如果传了地区参数但没有结果，再尝试不传参数
        if (plugins.length === 0) {
          console.log('⚠️ 未获取到插件，尝试不传地区参数...');
          plugins = await PaymentPluginsService.getAvailablePlugins();
        }
        
        console.log('✅ 最终获取到插件数量:', plugins.length, plugins);
        setAvailablePlugins(plugins);
        
        // 默认选择第一个插件
        if (plugins.length > 0) {
          setSelectedMethod(plugins[0].plugin_code);
          console.log('✅ 默认选择支付方式:', plugins[0].plugin_code);
        } else {
          console.warn('⚠️ 没有可用的支付插件');
          setError('暂无可用的支付方式，请联系客服');
        }
      } catch (err: any) {
        console.error('❌ 加载支付插件失败:', err);
        console.error('错误详情:', {
          message: err.message,
          status: err.status,
          data: err.data,
          response: err.response,
        });
        setError(`加载支付方式失败: ${err.message || '网络错误，请稍后重试'}`);
        // 如果加载失败，不设置默认支付方式，让用户知道有问题
      } finally {
        setLoadingPlugins(false);
      }
    };

    loadPlugins();
  }, []);

  // 获取支付方式显示信息
  const getPaymentMethodInfo = (plugin: PaymentPlugin) => {
    const methodMap: Record<string, { icon: string; color: string }> = {
      'wechat_pay': { icon: '💬', color: '#07C160' },
      'alipay': { icon: '💰', color: '#1677FF' },
      'bank_transfer': { icon: '🏦', color: '#722ED1' },
      'paypal': { icon: '💳', color: '#0070BA' },
      'stripe': { icon: '💳', color: '#635BFF' },
      'usdt_trc20': { icon: '₮', color: '#26A17B' },
      'usdt_erc20': { icon: '₮', color: '#26A17B' },
      'usdt_bep20': { icon: '₮', color: '#26A17B' },
    };
    
    return methodMap[plugin.plugin_code] || { icon: '💳', color: '#1890FF' };
  };

  // 构建支付方式列表（包含余额支付）
  const orderAmount = Number(order.amount) || 0;
  const paymentMethods = [
    ...availablePlugins.map(plugin => {
      const info = getPaymentMethodInfo(plugin);
      const fee = PaymentPluginsService.calculateFee(plugin, orderAmount);
      return {
        id: plugin.plugin_code,
        name: plugin.plugin_name,
        icon: info.icon,
        color: info.color,
        plugin,
        fee,
        totalAmount: orderAmount + fee,
      };
    }),
    // 余额支付
    { 
      id: 'balance', 
      name: t('payment.balance'), 
      icon: '👛', 
      color: '#D4A574', 
      balance: userBalance,
      fee: 0,
      totalAmount: orderAmount,
    }
  ];

  const handlePay = async () => {
    if (!agreeTerms) {
      setError(t('payment.pleaseAgreeTerms') || '请同意支付协议');
      return;
    }

    if (!order.orderId) {
      setError('订单ID不存在');
      return;
    }

    // 检查余额支付时余额是否充足
    const orderAmount = Number(order.amount) || 0;
    if (selectedMethod === 'balance') {
      if (userBalance < orderAmount) {
        setError(t('payment.insufficientBalance') || `余额不足，当前余额：¥${userBalance.toFixed(2)}，需要支付：¥${orderAmount.toFixed(2)}`);
        return;
      }
    }

    setIsPaying(true);
    setError(null);

    try {
      // 调用支付API
      // 如果选择的是余额支付，直接使用balance
      // 否则使用插件代码
      const paymentMethod = selectedMethod === 'balance' ? 'balance' : selectedMethod;

      console.log('💳 提交支付请求:', { orderId: order.orderId, paymentMethod });
      const paymentResult = await OrdersService.payOrder(order.orderId, paymentMethod);
      console.log('💳 支付API响应:', paymentResult);

      // 根据支付类型处理
      if (paymentResult.payment_type === 'balance') {
        // 余额支付：直接成功
        // 刷新用户数据（更新余额等）
        if (refreshUser) {
          await refreshUser();
        }
        // 支付成功，跳转到成功页面
        onSuccess();
      } else {
        // 第三方支付：显示支付处理界面
        console.log('💳 设置支付处理数据:', paymentResult);
        setPaymentProcessData(paymentResult);
        setPaymentProcessVisible(true);
        setIsPaying(false);
        console.log('💳 支付处理模态框状态:', { visible: true, data: paymentResult });
      }
    } catch (err: any) {
      console.error('❌ 支付失败:', err);
      // 提供更详细的错误信息
      const errorMessage = err.message || err.data?.message || '支付失败，请重试';
      setError(errorMessage);
      setIsPaying(false);
    }
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
        <h1>{t('payment.title') || '结算'}</h1>
      </div>

      <div className="payment-content">
        {/* 支付金额 */}
        <div className="payment-amount-card">
          <div className="amount-label">{t('payment.paymentAmount')}</div>
          <div className="amount-value">
            ¥{(() => {
              const amount = Number(order.amount) || 0;
              if (selectedMethod && selectedMethod !== 'balance') {
                const selectedPlugin = availablePlugins.find(p => p.plugin_code === selectedMethod);
                if (selectedPlugin) {
                  const fee = PaymentPluginsService.calculateFee(selectedPlugin, amount);
                  return (amount + fee).toFixed(2);
                }
              }
              return amount.toFixed(2);
            })()}
          </div>
          {selectedMethod && selectedMethod !== 'balance' && (() => {
            const amount = Number(order.amount) || 0;
            const selectedPlugin = availablePlugins.find(p => p.plugin_code === selectedMethod);
            if (selectedPlugin) {
              const fee = PaymentPluginsService.calculateFee(selectedPlugin, amount);
              if (fee > 0) {
                return (
                  <div className="amount-note" style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                    含手续费 ¥{fee.toFixed(2)}
                  </div>
                );
              }
            }
            return null;
          })()}
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
          {loadingPlugins ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
              加载支付方式中...
            </div>
          ) : paymentMethods.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#ff4d4f' }}>
              {error || '暂无可用的支付方式，请联系客服'}
              <div style={{ marginTop: '10px', fontSize: '12px', color: '#999' }}>
                请确保后台已安装并启用支付插件
              </div>
            </div>
          ) : (
            <div className="payment-methods-list">
              {paymentMethods.map((method) => {
                const isSelected = selectedMethod === method.id;
                const isBalance = method.id === 'balance';
                const showFee = !isBalance && method.fee > 0;
                
                return (
                  <div
                    key={method.id}
                    className={`payment-method-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    <div className="method-left">
                      <div className="method-icon" style={{ backgroundColor: `${method.color}20` }}>
                        <span style={{ color: method.color }}>{method.icon}</span>
                      </div>
                      <div className="method-info">
                        <h4>{method.name}</h4>
                        {isBalance && typeof method.balance === 'number' && (
                          <span className="balance-amount">
                            {t('payment.availableBalance')}: ¥{method.balance.toFixed(2)}
                          </span>
                        )}
                        {showFee && (
                          <span className="fee-info" style={{ fontSize: '12px', color: '#999' }}>
                            手续费: ¥{method.fee.toFixed(2)}
                          </span>
                        )}
                        {isSelected && showFee && (
                          <span className="total-amount" style={{ fontSize: '13px', color: method.color, fontWeight: 'bold' }}>
                            实付: ¥{method.totalAmount.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="method-radio">
                      {isSelected && <div className="radio-dot" />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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

      {/* 支付处理模态框 */}
      <PaymentProcessModal
        visible={paymentProcessVisible}
        paymentData={paymentProcessData}
        onClose={() => {
          setPaymentProcessVisible(false);
          setPaymentProcessData(null);
        }}
        onSuccess={() => {
          setPaymentProcessVisible(false);
          setPaymentProcessData(null);
          if (refreshUser) {
            refreshUser();
          }
          onSuccess();
        }}
      />
    </div>
  );
};

export default PaymentPage;

