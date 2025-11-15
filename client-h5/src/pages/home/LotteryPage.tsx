import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LotteryService, type LotteryResult } from '../../services/lottery.service';
import { useAuth } from '../../context/AuthContext';
import './LotteryPage.css';

interface LotteryPageProps {
  groupId: number;
  productName: string;
  onBack: () => void;
  onViewResult?: () => void;
}

const LotteryPage: React.FC<LotteryPageProps> = ({ groupId, productName, onBack, onViewResult }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [lotteryResult, setLotteryResult] = useState<LotteryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // 检查是否已开奖
  useEffect(() => {
    const checkLotteryResult = async () => {
      try {
        const result = await LotteryService.getLotteryResult(groupId);
        if (result.lottery.status === 1) {
          setLotteryResult(result);
          setShowResult(true);
        }
      } catch (err: any) {
        // 如果未开奖，忽略错误
        if (err.status !== 404) {
          console.error('获取开奖结果失败:', err);
        }
      }
    };

    checkLotteryResult();
  }, [groupId]);

  const handleDrawLottery = async () => {
    setIsDrawing(true);
    setError(null);

    try {
      const result = await LotteryService.drawLottery(groupId);
      setLotteryResult(result);
      setShowResult(true);
    } catch (err: any) {
      console.error('开奖失败:', err);
      setError(err.message || err.data?.message || '开奖失败，请重试');
    } finally {
      setIsDrawing(false);
    }
  };

  const isWinner = lotteryResult?.winners.some(w => w.id === user?.id) || false;
  const userDividend = lotteryResult?.dividends.find(d => d.user_id === user?.id);

  return (
    <div className="lottery-page">
      <div className="lottery-header">
        <button className="back-btn" onClick={onBack} aria-label="返回">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1>{t('lottery.title') || '开奖结果'}</h1>
        <div style={{ width: 40 }} />
      </div>

      <div className="lottery-content">
        {!showResult ? (
          <>
            {/* 开奖前 */}
            <div className="lottery-before-card">
              <div className="lottery-icon-wrapper">
                <div className="lottery-icon">🎁</div>
              </div>
              <h2>{t('lottery.beforeTitle') || '团购已完成，准备开奖'}</h2>
              <p className="lottery-product-name">{productName}</p>
              <p className="lottery-desc">{t('lottery.beforeDesc') || '点击下方按钮开始开奖，系统将随机抽取中奖者'}</p>
              
              {error && (
                <div className="lottery-error">
                  {error}
                </div>
              )}

              <button 
                className="lottery-draw-btn"
                onClick={handleDrawLottery}
                disabled={isDrawing}
              >
                {isDrawing ? (t('lottery.drawing') || '开奖中...') : (t('lottery.drawNow') || '立即开奖')}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* 开奖结果 */}
            <div className="lottery-result-card">
              <div className={`lottery-result-icon ${isWinner ? 'winner' : ''}`}>
                {isWinner ? '🎉' : '🎁'}
              </div>
              
              <h2 className={isWinner ? 'winner-title' : ''}>
                {isWinner 
                  ? (t('lottery.youWon') || '恭喜您中奖！')
                  : (t('lottery.resultTitle') || '开奖结果')
                }
              </h2>

              <div className="lottery-winner-info">
                <div className="winner-label">
                  {lotteryResult?.winners.length === 1 
                    ? (t('lottery.winner') || '中奖者')
                    : (t('lottery.winners') || `中奖者（${lotteryResult?.winners.length}人）`)
                  }
                </div>
                <div className="winners-list">
                  {lotteryResult?.winners.map((winner, index) => (
                    <div key={winner.id} className="winner-item">
                      <span className="winner-name">
                        {winner.nickname || winner.username}
                      </span>
                      {isWinner && winner.id === user?.id && (
                        <span className="winner-badge">（您）</span>
                      )}
                    </div>
                  ))}
                </div>
                {lotteryResult?.lottery.lottery_time && (
                  <div className="lottery-time">
                    {t('lottery.time') || '开奖时间'}: {new Date(lotteryResult.lottery.lottery_time).toLocaleString('zh-CN')}
                  </div>
                )}
              </div>

              {/* 分红信息：只有未中奖者才显示分红 */}
              {!isWinner && userDividend && (
                <div className="dividend-info">
                  <div className="dividend-label">{t('lottery.dividend') || '您的分红'}</div>
                  <div className="dividend-amount">¥{userDividend.amount.toFixed(2)}</div>
                  <div className="dividend-status">
                    {userDividend.status === 1 
                      ? (t('lottery.dividendPaid') || '已发放')
                      : (t('lottery.dividendPending') || '待发放')
                    }
                  </div>
                </div>
              )}

              {/* 中奖者提示：中奖者只获得商品，不分红 */}
              {isWinner && (
                <div className="winner-dividend-notice">
                  <p>{t('lottery.winnerNoDividend') || '恭喜您中奖！您将获得商品，不参与分红'}</p>
                </div>
              )}

              {/* 中奖者特殊提示 */}
              {isWinner && (
                <div className="winner-notice">
                  <p>{t('lottery.winnerNotice') || '恭喜您获得商品！请尽快填写收货地址'}</p>
                </div>
              )}
            </div>

            {/* 分红列表 */}
            {lotteryResult?.dividends && lotteryResult.dividends.length > 0 && (
              <div className="dividend-list-card">
                <h3>{t('lottery.dividendList') || '分红详情'}</h3>
                <div className="dividend-list">
                  {lotteryResult.dividends.slice(0, 5).map((dividend) => (
                    <div key={dividend.id} className="dividend-item">
                      <span className="dividend-user">
                        {dividend.user_id === user?.id ? (t('lottery.you') || '您') : `用户${dividend.user_id}`}
                      </span>
                      <span className="dividend-amount-item">¥{dividend.amount.toFixed(2)}</span>
                    </div>
                  ))}
                  {lotteryResult.dividends.length > 5 && (
                    <div className="dividend-more">
                      {t('lottery.moreDividends', { count: lotteryResult.dividends.length - 5 }) || `还有${lotteryResult.dividends.length - 5}位参与者获得分红`}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* 底部按钮 */}
      <div className="lottery-footer">
        {showResult && (
          <button className="lottery-view-detail-btn" onClick={onViewResult || onBack}>
            {t('lottery.viewDetail') || '查看详情'}
          </button>
        )}
        <button className="lottery-back-btn" onClick={onBack}>
          {t('lottery.back') || '返回'}
        </button>
      </div>
    </div>
  );
};

export default LotteryPage;

