import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';
import { OrdersService, type GroupOrder } from '../../services/orders.service';
import { LotteryService } from '../../services/lottery.service';
import { ProductsService } from '../../services/products.service';
import type { Product } from '../../services/products.service';
import './MyGroupDetail.css';

interface MyGroupDetailProps {
  groupOrder: GroupOrder;
  onBack: () => void;
}

const MyGroupDetail: React.FC<MyGroupDetailProps> = ({ groupOrder, onBack }) => {
  const { t } = useTranslation();
  const [product, setProduct] = useState<Product | null>(null);
  const [lotteryResult, setLotteryResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 获取商品详情
        const productData = await ProductsService.getProductById(groupOrder.product_id);
        setProduct(productData);

        // 尝试获取开奖结果（基于商品ID）
        try {
          // 注意：这里需要根据实际的后端API调整
          // 如果后端支持按商品ID获取开奖结果，使用这个
          const result = await LotteryService.getLotteryResult(groupOrder.product_id);
          setLotteryResult(result);
        } catch (err: any) {
          // 如果还没有开奖（404），这是正常的
          if (err.status !== 404) {
            console.error('获取开奖结果失败:', err);
          }
        }
      } catch (error) {
        console.error('获取数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [groupOrder.product_id]);

  const getProductImage = () => {
    if (product?.image_url) return product.image_url;
    if (product?.images) {
      try {
        const images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
        if (Array.isArray(images) && images.length > 0) {
          return images[0];
        }
      } catch (e) {
        // 忽略解析错误
      }
    }
    return groupOrder.product_image || '/images/product-placeholder.svg';
  };

  const isWinner = lotteryResult?.winners?.some((w: any) => 
    groupOrder.orders.some(order => order.user_id === w.user_id)
  );

  const myOrders = groupOrder.orders;
  const totalMyAmount = myOrders.reduce((sum, order) => sum + parseFloat(String(order.actual_amount || 0)), 0);

  return (
    <div className="my-group-detail-container">
      <Header onBack={onBack} title={t('group.myGroups.detailTitle') || '团购详情'} />
      <div className="my-group-detail-content">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>{t('common.loading') || '加载中...'}</p>
          </div>
        ) : (
          <>
            {/* 商品信息 */}
            <section className="detail-product-section">
              <div className="product-image-wrapper">
                <img src={getProductImage()} alt={product?.name || groupOrder.product_name} />
              </div>
              <div className="product-info">
                <h1>{product?.name || groupOrder.product_name}</h1>
                {product?.description && (
                  <p className="product-description">{product.description}</p>
                )}
                <div className="product-price">
                  <span className="price-label">{t('group.myGroups.groupPrice') || '团购价'}</span>
                  <strong>¥{product?.group_price ? parseFloat(String(product.group_price)).toFixed(2) : '0.00'}</strong>
                </div>
              </div>
            </section>

            {/* 团购进度 */}
            <section className="detail-progress-section">
              <h2>{t('group.myGroups.progress') || '团购进度'}</h2>
              <div className="progress-info">
                <div className="progress-stats">
                  <div className="stat-item">
                    <span className="stat-label">{t('group.myGroups.totalParticipants') || '总参与人数'}</span>
                    <strong>{groupOrder.total_participants}</strong>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">{t('group.myGroups.myOrders') || '我的订单数'}</span>
                    <strong>{myOrders.length}</strong>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">{t('group.myGroups.myAmount') || '我的支付金额'}</span>
                    <strong>¥{totalMyAmount.toFixed(2)}</strong>
                  </div>
                </div>
              </div>
            </section>

            {/* 开奖结果 */}
            {lotteryResult && (
              <section className="detail-lottery-section">
                <h2>{t('group.myGroups.lotteryResult') || '开奖结果'}</h2>
                <div className={`lottery-result-card ${isWinner ? 'winner' : ''}`}>
                  {isWinner ? (
                    <>
                      <div className="winner-badge">🎉 {t('group.myGroups.youWon') || '恭喜中奖！'}</div>
                      <p>{t('group.myGroups.winnerDesc') || '您已中奖，商品将尽快发货'}</p>
                    </>
                  ) : (
                    <>
                      <div className="lottery-info">
                        <p>{t('group.myGroups.notWinner') || '很遗憾，本次未中奖'}</p>
                        {lotteryResult.dividends && lotteryResult.dividends.length > 0 && (
                          <div className="dividend-info">
                            <span>{t('group.myGroups.dividend') || '分红金额'}: ¥{lotteryResult.dividends[0]?.amount?.toFixed(2) || '0.00'}</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  <div className="winners-list">
                    <h3>{t('group.myGroups.winners') || '中奖名单'}</h3>
                    <ul>
                      {lotteryResult.winners?.map((winner: any, index: number) => (
                        <li key={index}>
                          {winner.user_name || `用户${winner.user_id}`}
                          {winner.user_id === myOrders[0]?.user_id && <span className="you-badge">（您）</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            )}

            {/* 我的订单 */}
            <section className="detail-orders-section">
              <h2>{t('group.myGroups.myOrders') || '我的订单'}</h2>
              <div className="orders-list">
                {myOrders.map((order) => (
                  <div key={order.id} className="order-item">
                    <div className="order-info">
                      <span className="order-no">{t('group.myGroups.orderNo') || '订单号'}: {order.order_no}</span>
                      <span className="order-amount">¥{parseFloat(String(order.actual_amount || 0)).toFixed(2)}</span>
                    </div>
                    <div className="order-meta">
                      <span className={`order-status status-${order.status}`}>
                        {order.status === 1 
                          ? (t('order.status.paid') || '已支付')
                          : order.status === 2
                          ? (t('order.status.shipped') || '已发货')
                          : order.status === 3
                          ? (t('order.status.completed') || '已完成')
                          : (t('order.status.pending') || '待支付')}
                      </span>
                      <span className="order-time">
                        {new Date(order.created_at).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                    <button
                      className="view-order-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        // 导航到订单详情
                        window.dispatchEvent(new CustomEvent('navigate-to-order', { detail: { orderId: order.id } }));
                      }}
                    >
                      {t('group.myGroups.viewOrder') || '查看订单'}
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* 分享邀请 */}
            {!lotteryResult && (
              <section className="detail-share-section">
                <h2>{t('group.myGroups.inviteFriends') || '邀请好友'}</h2>
                <p>{t('group.myGroups.inviteDesc') || '邀请好友一起参团，更快成团！'}</p>
                <button
                  className="share-btn"
                  onClick={async () => {
                    try {
                      // 构建分享链接（包含商品ID和团购信息）
                      const shareUrl = `${window.location.origin}/#/group/${groupOrder.product_id}`;
                      const shareText = t('group.myGroups.shareText', { productName: groupOrder.product_name }) || `快来和我一起参团购买 ${groupOrder.product_name}！`;
                      
                      // 优先使用 Web Share API（如果支持）
                      if (navigator.share) {
                        try {
                          await navigator.share({
                            title: groupOrder.product_name,
                            text: shareText,
                            url: shareUrl,
                          });
                          return;
                        } catch (err: any) {
                          // 用户取消分享，不显示错误
                          if (err.name !== 'AbortError') {
                            console.error('分享失败:', err);
                          } else {
                            return; // 用户取消，直接返回
                          }
                        }
                      }
                      
                      // 降级方案：复制链接到剪贴板
                      if (navigator.clipboard && navigator.clipboard.writeText) {
                        try {
                          await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
                          alert(t('group.myGroups.linkCopied') || '链接已复制到剪贴板');
                        } catch (clipboardErr) {
                          // 如果复制失败，使用传统方法
                          const textArea = document.createElement('textarea');
                          textArea.value = `${shareText}\n${shareUrl}`;
                          textArea.style.position = 'fixed';
                          textArea.style.opacity = '0';
                          document.body.appendChild(textArea);
                          textArea.select();
                          try {
                            document.execCommand('copy');
                            alert(t('group.myGroups.linkCopied') || '链接已复制到剪贴板');
                          } catch (execErr) {
                            alert(t('group.myGroups.shareFailed') || '分享失败，请手动复制链接');
                          }
                          document.body.removeChild(textArea);
                        }
                      } else {
                        // 最后的降级方案：显示链接让用户手动复制
                        const message = `${shareText}\n${shareUrl}\n\n请手动复制以上链接`;
                        if (window.confirm(message + '\n\n点击确定后，链接将显示在控制台')) {
                          console.log('分享链接:', shareUrl);
                          console.log('分享文本:', shareText);
                        }
                      }
                    } catch (error) {
                      console.error('分享功能出错:', error);
                      alert(t('group.myGroups.shareFailed') || '分享失败，请稍后重试');
                    }
                  }}
                >
                  {t('group.myGroups.share') || '分享给好友'}
                </button>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyGroupDetail;