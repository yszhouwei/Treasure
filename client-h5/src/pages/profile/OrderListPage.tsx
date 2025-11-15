import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { OrdersService, type Order } from '../../services/orders.service';
import { useAuth } from '../../context/AuthContext';
import { parsePrice } from '../../utils/dataTransform';
import './OrderListPage.css';

interface OrderListPageProps {
  onBack: () => void;
  onOrderClick?: (order: Order) => void;
  onPay?: (order: Order) => void;
  onCancel?: (order: Order) => void;
}

const OrderListPage: React.FC<OrderListPageProps> = ({ onBack, onOrderClick, onPay, onCancel }) => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<number | undefined>(undefined);

  // 订单状态映射
  const statusMap: Record<number, { label: string; color: string }> = {
    0: { label: t('order.status.pending') || '待支付', color: '#ff9500' },
    1: { label: t('order.status.paid') || '已支付', color: '#52c41a' },
    2: { label: t('order.status.shipped') || '已发货', color: '#1677FF' },
    3: { label: t('order.status.completed') || '已完成', color: '#52c41a' },
    4: { label: t('order.status.cancelled') || '已取消', color: '#8c8c8c' },
    5: { label: t('order.status.refunded') || '已退款', color: '#ff4d4f' },
  };

  // 获取订单列表
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const orderList = await OrdersService.getOrders(selectedStatus);
        setOrders(orderList);
      } catch (err: any) {
        console.error('获取订单列表失败:', err);
        setError(err.message || '获取订单列表失败');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, selectedStatus]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}-${day} ${hours}:${minutes}`;
  };

  const statusTabs = [
    { value: undefined, label: t('order.all') || '全部' },
    { value: 0, label: t('order.status.pending') || '待支付' },
    { value: 1, label: t('order.status.paid') || '已支付' },
    { value: 2, label: t('order.status.shipped') || '已发货' },
    { value: 3, label: t('order.status.completed') || '已完成' },
  ];

  return (
    <div className="order-list-page">
      {/* 头部 */}
      <div className="order-list-header">
        <button className="back-btn" onClick={onBack} aria-label="返回">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1>{t('order.list.title') || '我的订单'}</h1>
        <div style={{ width: 40 }} />
      </div>

      {/* 状态筛选 */}
      <div className="order-status-tabs">
        {statusTabs.map((tab) => (
          <button
            key={tab.value ?? 'all'}
            className={`status-tab ${selectedStatus === tab.value ? 'active' : ''}`}
            onClick={() => setSelectedStatus(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 订单列表 */}
      <div className="order-list-content">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>{t('common.loading') || '加载中...'}</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h3>{t('common.error') || '加载失败'}</h3>
            <p>{error}</p>
            <button 
              className="retry-btn"
              onClick={() => window.location.reload()}
            >
              {t('common.retry') || '重试'}
            </button>
          </div>
        ) : orders.length > 0 ? (
          <div className="order-list">
            {orders.map((order) => {
              const status = statusMap[order.status] || { label: '未知', color: '#8c8c8c' };
              return (
                <div
                  key={order.id}
                  className="order-item"
                  onClick={() => onOrderClick?.(order)}
                >
                  <div className="order-header">
                    <div className="order-info">
                      <span className="order-no">{t('order.orderNo') || '订单号'}: {order.order_no}</span>
                      <span className="order-time">{formatDate(order.created_at)}</span>
                    </div>
                    <span className="order-status" style={{ color: status.color }}>
                      {status.label}
                    </span>
                  </div>

                  <div className="order-body">
                    <div
                      className="order-product-image"
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
                    <div className="order-product-info">
                      <h4 className="product-name">{order.product_name}</h4>
                      <p className="product-spec">
                        {t('order.quantity') || '数量'}: {order.quantity}
                      </p>
                    </div>
                    <div className="order-amount">
                      <span className="amount-label">{t('order.totalAmount') || '合计'}</span>
                      <span className="amount-value">¥{parsePrice(order.actual_amount).toFixed(2)}</span>
                    </div>
                  </div>

                  {order.status === 0 && (
                    <div className="order-footer">
                      <button
                        className="order-action-btn secondary"
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (onCancel) {
                            onCancel(order);
                          } else {
                            // 如果没有传递回调，直接调用API
                            if (window.confirm(t('order.confirmCancel') || '确定要取消这个订单吗？')) {
                              try {
                                await OrdersService.cancelOrder(order.id);
                                // 重新加载订单列表
                                const updatedOrders = await OrdersService.getOrders(selectedStatus);
                                setOrders(updatedOrders);
                              } catch (error: any) {
                                alert(error.message || t('order.cancelFailed') || '取消订单失败');
                              }
                            }
                          }
                        }}
                      >
                        {t('order.cancel') || '取消订单'}
                      </button>
                      <button
                        className="order-action-btn primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onPay) {
                            onPay(order);
                          } else if (onOrderClick) {
                            // 如果没有支付回调，跳转到订单详情页
                            onOrderClick(order);
                          }
                        }}
                      >
                        {t('order.pay') || '去支付'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>{t('order.list.empty') || '暂无订单'}</h3>
            <p>{t('order.list.emptyDesc') || '您还没有任何订单，快去选购吧'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderListPage;

