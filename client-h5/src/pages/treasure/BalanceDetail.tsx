import React, { useState } from 'react';
import RechargePage from './RechargePage';
import './BalanceDetail.css';

interface BalanceDetailProps {
  balance: {
    amount: string;
    currency: string;
  };
  onBack: () => void;
  onRecharge?: () => void;
  onWithdraw?: () => void;
}

const BalanceDetail: React.FC<BalanceDetailProps> = ({ balance, onBack, onRecharge, onWithdraw }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'income' | 'expense'>('all');
  const [showRechargePage, setShowRechargePage] = useState(false);

  // 如果显示充值页面，则渲染充值页面
  if (showRechargePage) {
    return (
      <RechargePage
        currentBalance={balance.amount}
        onBack={() => setShowRechargePage(false)}
        onSuccess={(amount) => {
          console.log('充值成功:', amount);
          if (onRecharge) onRecharge();
        }}
      />
    );
  }

  // 模拟交易记录
  const transactions = [
    {
      id: 'T001',
      type: 'income',
      title: '团购返现',
      amount: '+¥ 88.00',
      time: '2025-11-12 14:30',
      status: '已到账'
    },
    {
      id: 'T002',
      type: 'income',
      title: '任务奖励',
      amount: '+¥ 50.00',
      time: '2025-11-11 10:20',
      status: '已到账'
    },
    {
      id: 'T003',
      type: 'expense',
      title: '参与团购',
      amount: '-¥ 188.00',
      time: '2025-11-10 16:45',
      status: '支付成功'
    },
    {
      id: 'T004',
      type: 'income',
      title: '充值',
      amount: '+¥ 500.00',
      time: '2025-11-10 09:00',
      status: '已到账'
    },
    {
      id: 'T005',
      type: 'expense',
      title: '提现',
      amount: '-¥ 200.00',
      time: '2025-11-09 19:30',
      status: '处理中'
    }
  ];

  const filteredTransactions = transactions.filter(t => {
    if (activeTab === 'all') return true;
    return t.type === activeTab;
  });

  return (
    <div className="balance-detail-page">
      {/* 头部 */}
      <div className="balance-detail-header">
        <button className="back-btn-white" onClick={onBack} aria-label="返回">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="balance-hero">
          <div className="balance-label">账户余额</div>
          <h1 className="balance-amount">{balance.amount}</h1>
          <div className="balance-actions">
            <button 
              className="balance-action-btn recharge"
              onClick={() => setShowRechargePage(true)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <polyline points="19 12 12 19 5 12"/>
              </svg>
              充值
            </button>
            <button 
              className="balance-action-btn withdraw"
              onClick={() => {
                if (onWithdraw) onWithdraw();
                else alert('提现功能');
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="12" y1="19" x2="12" y2="5"/>
                <polyline points="5 12 12 5 19 12"/>
              </svg>
              提现
            </button>
          </div>
        </div>
      </div>

      {/* 内容 */}
      <div className="balance-detail-content">
        {/* 账户信息 */}
        <section className="balance-card">
          <h2>账户信息</h2>
          <div className="account-info-grid">
            <div className="account-info-item">
              <span className="info-label">绑定手机</span>
              <span className="info-value">138****8888</span>
            </div>
            <div className="account-info-item">
              <span className="info-label">绑定银行卡</span>
              <span className="info-value">招商银行（尾号 1234）</span>
            </div>
            <div className="account-info-item">
              <span className="info-label">账户状态</span>
              <span className="info-value status-active">正常</span>
            </div>
            <div className="account-info-item">
              <span className="info-label">安全等级</span>
              <span className="info-value status-high">高</span>
            </div>
          </div>
        </section>

        {/* 资产统计 */}
        <section className="balance-card">
          <h2>资产统计</h2>
          <div className="asset-stats">
            <div className="asset-stat-item">
              <div className="asset-stat-icon income">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                  <polyline points="17 6 23 6 23 12"/>
                </svg>
              </div>
              <div className="asset-stat-content">
                <span className="asset-stat-label">本月收入</span>
                <span className="asset-stat-value income">+¥ 1,250.00</span>
              </div>
            </div>

            <div className="asset-stat-item">
              <div className="asset-stat-icon expense">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
                  <polyline points="17 18 23 18 23 12"/>
                </svg>
              </div>
              <div className="asset-stat-content">
                <span className="asset-stat-label">本月支出</span>
                <span className="asset-stat-value expense">-¥ 568.00</span>
              </div>
            </div>

            <div className="asset-stat-item">
              <div className="asset-stat-icon balance">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <div className="asset-stat-content">
                <span className="asset-stat-label">当前余额</span>
                <span className="asset-stat-value balance">{balance.amount}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 交易记录 */}
        <section className="balance-card">
          <div className="section-header">
            <h2>交易记录</h2>
            <span className="record-count">{filteredTransactions.length} 条</span>
          </div>

          {/* 标签页 */}
          <div className="transaction-tabs">
            <button 
              className={`transaction-tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              全部
            </button>
            <button 
              className={`transaction-tab ${activeTab === 'income' ? 'active' : ''}`}
              onClick={() => setActiveTab('income')}
            >
              收入
            </button>
            <button 
              className={`transaction-tab ${activeTab === 'expense' ? 'active' : ''}`}
              onClick={() => setActiveTab('expense')}
            >
              支出
            </button>
          </div>

          {/* 交易列表 */}
          <div className="transaction-list">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="transaction-item">
                <div className={`transaction-icon ${transaction.type}`}>
                  {transaction.type === 'income' ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <line x1="12" y1="19" x2="12" y2="5"/>
                      <polyline points="5 12 12 5 19 12"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <line x1="12" y1="5" x2="12" y2="19"/>
                      <polyline points="19 12 12 19 5 12"/>
                    </svg>
                  )}
                </div>
                <div className="transaction-content">
                  <h4>{transaction.title}</h4>
                  <p>{transaction.time}</p>
                </div>
                <div className="transaction-right">
                  <span className={`transaction-amount ${transaction.type}`}>
                    {transaction.amount}
                  </span>
                  <span className="transaction-status">{transaction.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 提示信息 */}
        <section className="balance-card tips-card">
          <h2>温馨提示</h2>
          <div className="tips-list">
            <div className="tip-item">
              <span className="tip-icon">💡</span>
              <p>提现到账时间为 T+1 工作日，节假日顺延</p>
            </div>
            <div className="tip-item">
              <span className="tip-icon">🔒</span>
              <p>账户资金受平台保障，请放心使用</p>
            </div>
            <div className="tip-item">
              <span className="tip-icon">📞</span>
              <p>如有疑问，请联系客服 400-123-4567</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BalanceDetail;

