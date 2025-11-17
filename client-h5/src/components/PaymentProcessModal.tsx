import React, { useEffect, useState } from 'react';
import './PaymentProcessModal.css';

interface PaymentProcessModalProps {
  visible: boolean;
  paymentData: {
    payment_type: string;
    payment_no: string;
    amount: number;
    message: string;
    crypto_address?: string;
    crypto_amount?: number;
    network?: string;
    pay_url?: string;
    pay_params?: any;
  } | null;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentProcessModal: React.FC<PaymentProcessModalProps> = ({
  visible,
  paymentData,
  onClose,
  onSuccess,
}) => {
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (visible && paymentData) {
      // 如果是余额支付，不需要显示
      if (paymentData.payment_type === 'balance') {
        onSuccess();
        return;
      }

      // 对于其他支付方式，可以启动轮询检查支付状态
      // 这里暂时不实现，等待后续集成支付回调
    }
  }, [visible, paymentData]);

  if (!visible) {
    return null;
  }

  if (!paymentData) {
    console.warn('⚠️ PaymentProcessModal: paymentData 为空');
    return (
      <div className="payment-process-modal-overlay" onClick={onClose}>
        <div className="payment-process-modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="payment-process-modal-close" onClick={onClose}>×</button>
          <div className="payment-process-content">
            <p>支付数据加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (paymentData.payment_type === 'balance') {
    return null;
  }

  console.log('🔔 PaymentProcessModal 渲染内容:', { payment_type: paymentData.payment_type, paymentData });

  const renderPaymentContent = () => {
    switch (paymentData.payment_type) {
      case 'wechat':
        return (
          <div className="payment-process-content">
            <div className="payment-process-icon">💬</div>
            <h3>微信支付</h3>
            <p>{paymentData.message}</p>
            {paymentData.pay_params?.qr_code ? (
              <div className="payment-qr-code">
                <img src={paymentData.pay_params.qr_code} alt="支付二维码" />
                <p>请使用微信扫码支付</p>
              </div>
            ) : (
              <div className="payment-placeholder">
                <p>正在生成支付二维码...</p>
                <p style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
                  支付单号：{paymentData.payment_no}
                </p>
              </div>
            )}
          </div>
        );

      case 'alipay':
        return (
          <div className="payment-process-content">
            <div className="payment-process-icon">💰</div>
            <h3>支付宝支付</h3>
            <p>{paymentData.message}</p>
            {paymentData.pay_url ? (
              <div className="payment-action">
                <a href={paymentData.pay_url} target="_blank" rel="noopener noreferrer">
                  <button className="payment-jump-btn">跳转到支付宝支付</button>
                </a>
              </div>
            ) : (
              <div className="payment-placeholder">
                <p>正在跳转到支付宝...</p>
                <p style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
                  支付单号：{paymentData.payment_no}
                </p>
              </div>
            )}
          </div>
        );

      case 'crypto':
        return (
          <div className="payment-process-content">
            <div className="payment-process-icon">₮</div>
            <h3>USDT 支付 ({paymentData.network})</h3>
            <p>{paymentData.message}</p>
            <div className="payment-crypto-info">
              <div className="crypto-address-section">
                <label>支付地址：</label>
                <div className="crypto-address-box">
                  <code>{paymentData.crypto_address}</code>
                  <button
                    className="copy-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(paymentData.crypto_address || '');
                      alert('地址已复制');
                    }}
                  >
                    复制
                  </button>
                </div>
              </div>
              <div className="crypto-amount-section">
                <label>支付金额：</label>
                <div className="crypto-amount-box">
                  <strong>{paymentData.crypto_amount} USDT</strong>
                </div>
              </div>
              <div className="crypto-warning">
                <p>⚠️ 请确保使用 {paymentData.network} 网络转账</p>
                <p>⚠️ 转账金额必须完全一致</p>
                <p>⚠️ 转账完成后，系统将自动确认</p>
              </div>
            </div>
          </div>
        );

      case 'online':
        return (
          <div className="payment-process-content">
            <div className="payment-process-icon">💳</div>
            <h3>{paymentData.payment_type === 'paypal' ? 'PayPal' : 'Stripe'} 支付</h3>
            <p>{paymentData.message}</p>
            {paymentData.pay_url ? (
              <div className="payment-action">
                <a href={paymentData.pay_url} target="_blank" rel="noopener noreferrer">
                  <button className="payment-jump-btn">跳转到支付页面</button>
                </a>
              </div>
            ) : (
              <div className="payment-placeholder">
                <p>正在跳转到支付页面...</p>
                <p style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
                  支付单号：{paymentData.payment_no}
                </p>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="payment-process-content">
            <div className="payment-process-icon">💳</div>
            <h3>支付处理中</h3>
            <p>{paymentData.message}</p>
            <p style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
              支付单号：{paymentData.payment_no}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="payment-process-modal-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) {
        // 点击遮罩层不关闭，需要点击关闭按钮
      }
    }}>
      <div className="payment-process-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="payment-process-modal-close" onClick={onClose}>×</button>
        {renderPaymentContent()}
      </div>
    </div>
  );
};

export default PaymentProcessModal;

