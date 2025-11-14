import React, { useState } from 'react';
import './StatDetail.css';

interface StatDetailProps {
  stat: {
    label: string;
    value: string;
    trend: string;
  };
  onBack: () => void;
}

const StatDetail: React.FC<StatDetailProps> = ({ stat, onBack }) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  // 模拟图表数据
  const chartData = {
    week: [
      { day: '周一', value: 120 },
      { day: '周二', value: 180 },
      { day: '周三', value: 150 },
      { day: '周四', value: 220 },
      { day: '周五', value: 280 },
      { day: '周六', value: 350 },
      { day: '周日', value: 300 }
    ],
    month: [
      { day: '第1周', value: 850 },
      { day: '第2周', value: 1200 },
      { day: '第3周', value: 980 },
      { day: '第4周', value: 1450 }
    ],
    year: [
      { day: '1月', value: 3200 },
      { day: '2月', value: 2800 },
      { day: '3月', value: 3500 },
      { day: '4月', value: 4200 },
      { day: '5月', value: 3800 },
      { day: '6月', value: 4500 },
      { day: '7月', value: 5200 },
      { day: '8月', value: 4800 },
      { day: '9月', value: 5500 },
      { day: '10月', value: 6200 },
      { day: '11月', value: 5800 },
      { day: '12月', value: 6500 }
    ]
  };

  const currentData = chartData[timeRange];
  const maxValue = Math.max(...currentData.map(d => d.value));

  return (
    <div className="stat-detail-page">
      {/* 头部 */}
      <div className="stat-detail-header">
        <button className="back-btn-white" onClick={onBack} aria-label="返回">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="stat-hero">
          <div className="stat-label">{stat.label}</div>
          <h1 className="stat-value">{stat.value}</h1>
          <div className="stat-trend">{stat.trend}</div>
        </div>
      </div>

      {/* 内容 */}
      <div className="stat-detail-content">
        {/* 时间范围选择 */}
        <section className="stat-card">
          <div className="time-range-tabs">
            <button 
              className={`time-tab ${timeRange === 'week' ? 'active' : ''}`}
              onClick={() => setTimeRange('week')}
            >
              本周
            </button>
            <button 
              className={`time-tab ${timeRange === 'month' ? 'active' : ''}`}
              onClick={() => setTimeRange('month')}
            >
              本月
            </button>
            <button 
              className={`time-tab ${timeRange === 'year' ? 'active' : ''}`}
              onClick={() => setTimeRange('year')}
            >
              本年
            </button>
          </div>
        </section>

        {/* 图表 */}
        <section className="stat-card">
          <h2>趋势图表</h2>
          <div className="chart-container">
            <div className="chart">
              {currentData.map((item, index) => (
                <div key={index} className="chart-bar-wrapper">
                  <div className="chart-bar">
                    <div 
                      className="chart-bar-fill"
                      style={{ height: `${(item.value / maxValue) * 100}%` }}
                    >
                      <span className="chart-value">{item.value}</span>
                    </div>
                  </div>
                  <span className="chart-label">{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 统计摘要 */}
        <section className="stat-card">
          <h2>统计摘要</h2>
          <div className="summary-grid">
            <div className="summary-item">
              <div className="summary-icon average">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="12" y1="20" x2="12" y2="10"/>
                  <line x1="18" y1="20" x2="18" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="16"/>
                </svg>
              </div>
              <div className="summary-content">
                <span className="summary-label">平均值</span>
                <span className="summary-value">
                  {Math.round(currentData.reduce((sum, d) => sum + d.value, 0) / currentData.length)}
                </span>
              </div>
            </div>

            <div className="summary-item">
              <div className="summary-icon max">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                  <polyline points="17 6 23 6 23 12"/>
                </svg>
              </div>
              <div className="summary-content">
                <span className="summary-label">最高值</span>
                <span className="summary-value">{maxValue}</span>
              </div>
            </div>

            <div className="summary-item">
              <div className="summary-icon min">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
                  <polyline points="17 18 23 18 23 12"/>
                </svg>
              </div>
              <div className="summary-content">
                <span className="summary-label">最低值</span>
                <span className="summary-value">{Math.min(...currentData.map(d => d.value))}</span>
              </div>
            </div>

            <div className="summary-item">
              <div className="summary-icon total">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <div className="summary-content">
                <span className="summary-label">总计</span>
                <span className="summary-value">
                  {currentData.reduce((sum, d) => sum + d.value, 0)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 详细数据 */}
        <section className="stat-card">
          <h2>详细数据</h2>
          <div className="data-table">
            <div className="table-header">
              <span>时间</span>
              <span>数值</span>
              <span>占比</span>
            </div>
            {currentData.map((item, index) => {
              const total = currentData.reduce((sum, d) => sum + d.value, 0);
              const percentage = ((item.value / total) * 100).toFixed(1);
              
              return (
                <div key={index} className="table-row">
                  <span>{item.day}</span>
                  <span className="data-value">{item.value}</span>
                  <span className="data-percentage">{percentage}%</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* 数据说明 */}
        <section className="stat-card info-card">
          <h2>数据说明</h2>
          <div className="info-list">
            <div className="info-item">
              <span className="info-icon">📊</span>
              <p>数据每日凌晨更新，反映前一日的实际情况</p>
            </div>
            <div className="info-item">
              <span className="info-icon">⏰</span>
              <p>统计时间为自然日 00:00 - 23:59</p>
            </div>
            <div className="info-item">
              <span className="info-icon">💡</span>
              <p>如有疑问，请联系客服查询详情</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StatDetail;

