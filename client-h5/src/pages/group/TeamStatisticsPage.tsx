import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';
import './TeamStatisticsPage.css';

interface StatData {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
}

const TeamStatisticsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<StatData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟数据，后续替换为真实API调用
    setTimeout(() => {
      setStats([
        { label: t('group.management.stats.totalRevenue') || '总营收', value: '¥125,680', change: '+12.5%', trend: 'up' },
        { label: t('group.management.stats.totalOrders') || '总订单数', value: '1,234', change: '+8.3%', trend: 'up' },
        { label: t('group.management.stats.activeMembers') || '活跃成员', value: '156', change: '+5.2%', trend: 'up' },
        { label: t('group.management.stats.completionRate') || '成团率', value: '92.5%', change: '+2.1%', trend: 'up' },
        { label: t('group.management.stats.avgOrderValue') || '客单价', value: '¥1,018', change: '-1.2%', trend: 'down' },
        { label: t('group.management.stats.repeatRate') || '复购率', value: '68.3%', change: '+3.5%', trend: 'up' },
      ]);
      setLoading(false);
    }, 500);
  }, [t]);

  return (
    <div className="team-statistics-container">
      <Header onBack={onBack} title={t('group.management.stats.title') || '数据统计'} />
      <div className="team-statistics-content">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>{t('common.loading') || '加载中...'}</p>
          </div>
        ) : (
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value">{stat.value}</div>
                {stat.change && (
                  <div className={`stat-change ${stat.trend}`}>
                    {stat.trend === 'up' ? '↑' : '↓'} {stat.change}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="stats-chart-section">
          <h2>{t('group.management.stats.trendTitle') || '趋势分析'}</h2>
          <div className="chart-placeholder">
            <p>{t('group.management.stats.chartPlaceholder') || '图表数据加载中...'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamStatisticsPage;

