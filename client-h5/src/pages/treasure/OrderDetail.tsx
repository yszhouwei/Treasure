import React from 'react';
import { useTranslation } from 'react-i18next';
import './OrderDetail.css';

interface OrderDetailProps {
  order: {
    id: string;
    title: string;
    status: string;
    amount: string;
    time: string;
  };
  onBack: () => void;
  onContact?: () => void;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ order, onBack, onContact }) => {
  const { t } = useTranslation();

  const isCompleted = order.status === t('treasure.orderStatus.completed') || order.status === '已完成';

  return (
    <div className="order-detail-page">
      {/* 头部 */}
      <div className="order-detail-header">
        <button className="back-btn-white" onClick={onBack} aria-label="返回">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1>订单详情</h1>
      </div>

      {/* 内容 */}
      <div className="order-detail-content">
        {/* 订单状态 */}
        <section className={`order-status-card ${isCompleted ? 'completed' : 'pending'}`}>
          <div className="status-icon">
            {isCompleted ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            )}
          </div>
          <div className="status-content">
            <h2>{order.status}</h2>
            <p>{isCompleted ? '您的订单已完成，感谢您的支持' : '订单正在处理中，请耐心等待'}</p>
          </div>
        </section>

        {/* 商品信息 */}
        <section className="order-card">
          <h2>商品信息</h2>
          <div className="product-info">
            <div className="product-image">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <div className="product-details">
              <h3>{order.title}</h3>
              <p>规格：默认规格</p>
              <p>数量：1</p>
            </div>
            <div className="product-price">{order.amount}</div>
          </div>
        </section>

        {/* 订单信息 */}
        <section className="order-card">
          <h2>订单信息</h2>
          <div className="order-info-list">
            <div className="order-info-item">
              <span className="info-label">订单编号</span>
              <span className="info-value">{order.id}</span>
            </div>
            <div className="order-info-item">
              <span className="info-label">下单时间</span>
              <span className="info-value">{order.time}</span>
            </div>
            <div className="order-info-item">
              <span className="info-label">支付方式</span>
              <span className="info-value">在线支付</span>
            </div>
            <div className="order-info-item">
              <span className="info-label">配送方式</span>
              <span className="info-value">顺丰速运</span>
            </div>
          </div>
        </section>

        {/* 物流信息 */}
        {isCompleted && (
          <section className="order-card">
            <h2>物流信息</h2>
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
                    <h4>顺丰速运</h4>
                    <p>运单号：SF1234567890</p>
                  </div>
                </div>
                <button className="track-btn">查看物流</button>
              </div>
              
              <div className="logistics-timeline">
                <div className="timeline-item active">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h5>已签收</h5>
                    <p>您的快件已由本人签收，感谢使用顺丰</p>
                    <span className="timeline-time">{order.time}</span>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h5>派送中</h5>
                    <p>快递员正在为您派件，请保持电话畅通</p>
                    <span className="timeline-time">2025-11-09 08:20</span>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h5>运输中</h5>
                    <p>您的快件已到达【北京朝阳区】</p>
                    <span className="timeline-time">2025-11-08 15:30</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 收货地址 */}
        <section className="order-card">
          <h2>收货地址</h2>
          <div className="address-info">
            <div className="address-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div className="address-details">
              <h4>张三</h4>
              <p>138****8888</p>
              <p>北京市朝阳区建国路88号 SOHO现代城 A座 1001室</p>
            </div>
          </div>
        </section>

        {/* 费用明细 */}
        <section className="order-card">
          <h2>费用明细</h2>
          <div className="fee-list">
            <div className="fee-item">
              <span>商品金额</span>
              <span>{order.amount}</span>
            </div>
            <div className="fee-item">
              <span>运费</span>
              <span className="free">免运费</span>
            </div>
            <div className="fee-item">
              <span>优惠券</span>
              <span className="discount">-¥ 0.00</span>
            </div>
            <div className="fee-item total">
              <span>实付金额</span>
              <span className="amount">{order.amount}</span>
            </div>
          </div>
        </section>
      </div>

      {/* 底部操作栏 */}
      <div className="order-detail-footer">
        {!isCompleted && (
          <>
            <button 
              className="footer-btn secondary"
              onClick={() => {
                if (onContact) onContact();
                else alert('联系客服');
              }}
            >
              联系客服
            </button>
            <button className="footer-btn primary">
              催促发货
            </button>
          </>
        )}
        {isCompleted && (
          <>
            <button className="footer-btn secondary">
              删除订单
            </button>
            <button className="footer-btn primary">
              再次购买
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;

