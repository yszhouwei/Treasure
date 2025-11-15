import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { OrdersService, type Order } from '../../services/orders.service';
import { parsePrice } from '../../utils/dataTransform';
import './OrderDetailPage.css';

interface OrderDetailPageProps {
  orderId: number;
  onBack: () => void;
  onPay?: (order: Order) => void;
  onCancel?: (order: Order) => void;
  onContact?: () => void;
}

const OrderDetailPage: React.FC<OrderDetailPageProps> = ({
  orderId,
  onBack,
  onPay,
  onCancel,
  onContact
}) => {
  const { t } = useTranslation();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 订单状态映射
  const statusMap: Record<number, { label: string; color: string; desc: string }> = {
    0: { 
      label: t('order.status.pending') || '待支付', 
      color: '#ff9500',
      desc: t('orderDetail.statusPendingDesc') || '订单已创建，请尽快完成支付'
    },
    1: { 
      label: t('order.status.paid') || '已支付', 
      color: '#52c41a',
      desc: t('orderDetail.statusPaidDesc') || '支付成功，等待成团'
    },
    2: { 
      label: t('order.status.shipped') || '已发货', 
      color: '#1677FF',
      desc: t('orderDetail.statusShippedDesc') || '商品已发货，请注意查收'
    },
    3: { 
      label: t('order.status.completed') || '已完成', 
      color: '#52c41a',
      desc: t('orderDetail.statusCompletedDesc') || '订单已完成，感谢您的支持'
    },
    4: { 
      label: t('order.status.cancelled') || '已取消', 
      color: '#8c8c8c',
      desc: t('orderDetail.statusCancelledDesc') || '订单已取消'
    },
    5: { 
      label: t('order.status.refunded') || '已退款', 
      color: '#ff4d4f',
      desc: t('orderDetail.statusRefundedDesc') || '订单已退款，退款将原路返回'
    },
  };

  // 获取订单详情
  useEffect(() => {
    const fetchOrderDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const orderData = await OrdersService.getOrderById(orderId);
        setOrder(orderData);
      } catch (err: any) {
        console.error('获取订单详情失败:', err);
        setError(err.message || '获取订单详情失败');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetail();
    }
  }, [orderId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const parseShippingAddress = (addressStr?: string) => {
    if (!addressStr) return null;
    try {
      return JSON.parse(addressStr);
    } catch {
      return { address: addressStr };
    }
  };

  const handlePay = () => {
    if (order && onPay) {
      onPay(order);
    }
  };

  const handleCancel = () => {
    if (order && onCancel) {
      if (window.confirm(t('orderDetail.confirmCancel') || '确定要取消订单吗？')) {
        onCancel(order);
      }
    }
  };

  if (loading) {
    return (
      <div className="order-detail-page">
        <div className="order-detail-header">
          <button className="back-btn" onClick={onBack} aria-label="返回">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1>{t('orderDetail.title') || '订单详情'}</h1>
          <div style={{ width: 40 }} />
        </div>
        <div className="loading-state">
          <div className="loading-spinner" />
          <p>{t('common.loading') || '加载中...'}</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-detail-page">
        <div className="order-detail-header">
          <button className="back-btn" onClick={onBack} aria-label="返回">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1>{t('orderDetail.title') || '订单详情'}</h1>
          <div style={{ width: 40 }} />
        </div>
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>{t('common.error') || '加载失败'}</h3>
          <p>{error || '订单不存在'}</p>
          <button className="retry-btn" onClick={onBack}>
            {t('common.back') || '返回'}
          </button>
        </div>
      </div>
    );
  }

  const status = statusMap[order.status] || { label: '未知', color: '#8c8c8c', desc: '' };
  const shippingAddress = parseShippingAddress(order.shipping_address);
  const paymentMethodMap: Record<string, string> = {
    'wechat': t('payment.wechatPay') || '微信支付',
    'alipay': t('payment.alipay') || '支付宝',
    'balance': t('payment.balance') || '余额支付',
  };

  return (
    <div className="order-detail-page">
      {/* 头部 */}
      <div className="order-detail-header">
        <button className="back-btn" onClick={onBack} aria-label="返回">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1>{t('orderDetail.title') || '订单详情'}</h1>
        <div style={{ width: 40 }} />
      </div>

      {/* 内容 */}
      <div className="order-detail-content">
        {/* 订单状态 */}
        <section className={`order-status-card status-${order.status}`}>
          <div className="status-icon">
            {order.status === 3 ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            ) : order.status === 4 || order.status === 5 ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            )}
          </div>
          <div className="status-content">
            <h2 style={{ color: status.color }}>{status.label}</h2>
            <p>{status.desc}</p>
          </div>
        </section>

        {/* 商品信息 */}
        <section className="order-card">
          <h2>{t('orderDetail.productInfo') || '商品信息'}</h2>
          <div className="product-info">
            <div
              className="product-image"
              style={{
                backgroundImage: order.product_image ? `url(${order.product_image})` : undefined,
                backgroundColor: '#f0f0f0'
              }}
            >
              {!order.product_image && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              )}
            </div>
            <div className="product-details">
              <h3>{order.product_name}</h3>
              <p>{t('orderDetail.spec') || '规格'}: {t('orderDetail.defaultSpec') || '默认规格'}</p>
              <p>{t('order.quantity') || '数量'}: {order.quantity}</p>
            </div>
            <div className="product-price">
              ¥{parsePrice(order.unit_price).toFixed(2)}
            </div>
          </div>
        </section>

        {/* 订单信息 */}
        <section className="order-card">
          <h2>{t('orderDetail.orderInfo') || '订单信息'}</h2>
          <div className="order-info-list">
            <div className="order-info-item">
              <span className="info-label">{t('order.orderNo') || '订单号'}</span>
              <span className="info-value">{order.order_no}</span>
            </div>
            <div className="order-info-item">
              <span className="info-label">{t('orderDetail.orderTime') || '下单时间'}</span>
              <span className="info-value">{formatDate(order.created_at)}</span>
            </div>
            {order.payment_method && (
              <div className="order-info-item">
                <span className="info-label">{t('orderDetail.paymentMethod') || '支付方式'}</span>
                <span className="info-value">{paymentMethodMap[order.payment_method] || order.payment_method}</span>
              </div>
            )}
            {order.payment_time && (
              <div className="order-info-item">
                <span className="info-label">{t('orderDetail.paymentTime') || '支付时间'}</span>
                <span className="info-value">{formatDate(order.payment_time)}</span>
              </div>
            )}
            {order.shipping_company && (
              <div className="order-info-item">
                <span className="info-label">{t('orderDetail.shippingCompany') || '物流公司'}</span>
                <span className="info-value">{order.shipping_company}</span>
              </div>
            )}
            {order.shipping_no && (
              <div className="order-info-item">
                <span className="info-label">{t('orderDetail.shippingNo') || '物流单号'}</span>
                <span className="info-value">{order.shipping_no}</span>
              </div>
            )}
            {order.shipping_time && (
              <div className="order-info-item">
                <span className="info-label">{t('orderDetail.shippingTime') || '发货时间'}</span>
                <span className="info-value">{formatDate(order.shipping_time)}</span>
              </div>
            )}
            {order.completed_time && (
              <div className="order-info-item">
                <span className="info-label">{t('orderDetail.completedTime') || '完成时间'}</span>
                <span className="info-value">{formatDate(order.completed_time)}</span>
              </div>
            )}
          </div>
        </section>

        {/* 物流信息 */}
        {order.status >= 2 && order.shipping_no && (
          <section className="order-card">
            <h2>{t('orderDetail.logistics') || '物流信息'}</h2>
            <div className="logistics-info">
              <div className="logistics-header">
                <div className="logistics-company">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="1" y="3" width="15" height="13"/>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                    <circle cx="5.5" cy="18.5" r="2.5"/>
                    <circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                  <div>
                    <h4>{order.shipping_company || t('orderDetail.defaultShipping') || '顺丰速运'}</h4>
                    <p>{t('orderDetail.shippingNo') || '运单号'}: {order.shipping_no}</p>
                  </div>
                </div>
                <button className="track-btn">
                  {t('orderDetail.trackLogistics') || '查看物流'}
                </button>
              </div>
              
              {order.status === 3 && (
                <div className="logistics-timeline">
                  <div className="timeline-item active">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <h5>{t('orderDetail.signed') || '已签收'}</h5>
                      <p>{t('orderDetail.signedDesc') || '您的快件已由本人签收，感谢使用'}</p>
                      {order.completed_time && (
                        <span className="timeline-time">{formatDate(order.completed_time)}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 收货地址 */}
        {shippingAddress && (
          <section className="order-card">
            <h2>{t('orderDetail.shippingAddress') || '收货地址'}</h2>
            <div className="address-info">
              <div className="address-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div className="address-details">
                {shippingAddress.name && <h4>{shippingAddress.name}</h4>}
                {shippingAddress.phone && <p>{shippingAddress.phone}</p>}
                <p>{shippingAddress.address || shippingAddress}</p>
              </div>
            </div>
          </section>
        )}

        {/* 费用明细 */}
        <section className="order-card">
          <h2>{t('orderDetail.feeDetails') || '费用明细'}</h2>
          <div className="fee-list">
            <div className="fee-item">
              <span>{t('orderDetail.productAmount') || '商品金额'}</span>
              <span>¥{parsePrice(order.total_amount).toFixed(2)}</span>
            </div>
            <div className="fee-item">
              <span>{t('orderDetail.shippingFee') || '运费'}</span>
              <span className="free">{t('orderDetail.freeShipping') || '免运费'}</span>
            </div>
            {parsePrice(order.discount_amount) > 0 && (
              <div className="fee-item">
                <span>{t('orderDetail.discount') || '优惠'}</span>
                <span className="discount">-¥{parsePrice(order.discount_amount).toFixed(2)}</span>
              </div>
            )}
            <div className="fee-item total">
              <span>{t('orderDetail.actualAmount') || '实付金额'}</span>
              <span className="amount">¥{parsePrice(order.actual_amount).toFixed(2)}</span>
            </div>
          </div>
        </section>

        {/* 备注 */}
        {order.remark && (
          <section className="order-card">
            <h2>{t('orderDetail.remark') || '备注'}</h2>
            <p className="remark-text">{order.remark}</p>
          </section>
        )}
      </div>

      {/* 底部操作栏 */}
      <div className="order-detail-footer">
        {order.status === 0 && (
          <>
            <button 
              className="footer-btn secondary"
              onClick={handleCancel}
            >
              {t('order.cancel') || '取消订单'}
            </button>
            <button 
              className="footer-btn primary"
              onClick={handlePay}
            >
              {t('order.pay') || '去支付'}
            </button>
          </>
        )}
        {order.status === 1 && (
          <button 
            className="footer-btn secondary"
            onClick={onContact}
          >
            {t('orderDetail.contactService') || '联系客服'}
          </button>
        )}
        {order.status === 2 && (
          <>
            <button 
              className="footer-btn secondary"
              onClick={onContact}
            >
              {t('orderDetail.contactService') || '联系客服'}
            </button>
            <button className="footer-btn primary">
              {t('orderDetail.urgeShipping') || '催促发货'}
            </button>
          </>
        )}
        {order.status === 3 && (
          <>
            <button className="footer-btn secondary">
              {t('orderDetail.deleteOrder') || '删除订单'}
            </button>
            <button className="footer-btn primary">
              {t('orderDetail.buyAgain') || '再次购买'}
            </button>
          </>
        )}
        {(order.status === 4 || order.status === 5) && (
          <button className="footer-btn primary">
            {t('orderDetail.buyAgain') || '再次购买'}
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPage;

