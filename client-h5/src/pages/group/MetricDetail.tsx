import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';
import './MetricDetail.css';

interface TeamMetric {
  label: string;
  value: string;
  change: string;
}

interface MetricDetailProps {
  metric: TeamMetric;
  onBack: () => void;
}

const MetricDetail: React.FC<MetricDetailProps> = ({ metric, onBack }) => {
  const { t } = useTranslation();

  // Mock historical data
  const historicalData = [
    { period: t('group.metricDetail.period1'), value: '245' },
    { period: t('group.metricDetail.period2'), value: '328' },
    { period: t('group.metricDetail.period3'), value: '412' },
    { period: t('group.metricDetail.period4'), value: metric.value },
  ];

  const isPositive = metric.change.startsWith('+');

  return (
    <div className="metric-detail-container">
      <Header onBack={onBack} title={metric.label} />
      <div className="metric-detail-content">
        {/* Current Value Card */}
        <section className="metric-value-card">
          <div className="metric-icon">📊</div>
          <div className="metric-value-main">
            <span className="metric-label">{metric.label}</span>
            <strong className="metric-value">{metric.value}</strong>
            <span className={`metric-change ${isPositive ? 'positive' : 'negative'}`}>
              {metric.change}
            </span>
          </div>
        </section>

        {/* Description */}
        <section className="metric-section">
          <h2>{t('group.sheet.metric.descTitle')}</h2>
          <div className="metric-desc-card">
            <p>{t('group.sheet.metric.desc', { value: metric.value })}</p>
            <p className="metric-meta">{t('group.sheet.metric.meta')}</p>
          </div>
        </section>

        {/* Historical Trend */}
        <section className="metric-section">
          <h2>{t('group.metricDetail.trendTitle')}</h2>
          <div className="metric-trend-card">
            {historicalData.map((data, idx) => (
              <div key={idx} className="trend-item">
                <span className="trend-period">{data.period}</span>
                <div className="trend-bar-container">
                  <div
                    className="trend-bar"
                    style={{
                      width: `${(parseInt(data.value) / parseInt(metric.value)) * 100}%`
                    }}
                  />
                </div>
                <strong className="trend-value">{data.value}</strong>
              </div>
            ))}
          </div>
        </section>

        {/* Insights */}
        <section className="metric-section">
          <h2>{t('group.metricDetail.insightsTitle')}</h2>
          <div className="metric-insights">
            <div className="insight-item">
              <div className="insight-icon">💡</div>
              <p>{t('group.metricDetail.insight1')}</p>
            </div>
            <div className="insight-item">
              <div className="insight-icon">🎯</div>
              <p>{t('group.metricDetail.insight2')}</p>
            </div>
            <div className="insight-item">
              <div className="insight-icon">📈</div>
              <p>{t('group.metricDetail.insight3')}</p>
            </div>
          </div>
        </section>

        {/* Action Button */}
        <div className="metric-actions">
          <button className="metric-primary-btn">{t('group.sheet.metric.cta')}</button>
        </div>
      </div>
    </div>
  );
};

export default MetricDetail;
