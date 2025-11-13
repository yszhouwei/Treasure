import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import './Treasure.css';

type StatItem = {
  label: string;
  value: string;
  trend: string;
};

type MissionItem = {
  title: string;
  desc: string;
  progress: number;
  reward: string;
};

type OrderItem = {
  id: string;
  title: string;
  status: string;
  amount: string;
  time: string;
};

const Treasure: React.FC = () => {
  const { t } = useTranslation();

  const stats = t('treasure.stats', { returnObjects: true }) as StatItem[];
  const missions = t('treasure.missions', { returnObjects: true }) as MissionItem[];
  const orders = t('treasure.orders', { returnObjects: true }) as OrderItem[];

  return (
    <div className="treasure-container">
      <Header />
      <div className="treasure-content">
        <section className="treasure-hero">
          <div className="treasure-hero-overlay">
            <div className="treasure-hero-top">
              <div className="treasure-avatar">TX</div>
              <div className="treasure-hero-info">
                <h1>{t('treasure.hero.title')}</h1>
                <p>{t('treasure.hero.subtitle')}</p>
                <span className="treasure-hero-badge">{t('treasure.hero.badge')}</span>
              </div>
            </div>
            <div className="treasure-balance">
              <div>
                <span className="treasure-balance-label">{t('treasure.hero.balanceLabel')}</span>
                <strong>{t('treasure.hero.balanceValue')}</strong>
              </div>
              <button>{t('treasure.hero.recharge')}</button>
            </div>
            <div className="treasure-progress">
              <div className="treasure-progress-head">
                <span>{t('treasure.progress.label')}</span>
                <span>{t('treasure.progress.percent')}</span>
              </div>
              <div className="treasure-progress-bar">
                <div className="treasure-progress-inner" />
              </div>
              <p>{t('treasure.progress.desc')}</p>
            </div>
          </div>
        </section>

        <section className="treasure-section">
          <div className="treasure-section-header">
            <h2>{t('treasure.sections.stats')}</h2>
            <span>{t('treasure.sections.statsSubtitle')}</span>
          </div>
          <div className="treasure-stats-grid">
            {stats.map((stat) => (
              <article key={stat.label} className="treasure-stat-card">
                <div className="treasure-stat-icon">★</div>
                <div className="treasure-stat-content">
                  <span className="treasure-stat-label">{stat.label}</span>
                  <strong>{stat.value}</strong>
                  <span className="treasure-stat-trend">{stat.trend}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="treasure-section">
          <div className="treasure-section-header">
            <h2>{t('treasure.sections.missions')}</h2>
            <span>{t('treasure.sections.missionsSubtitle')}</span>
          </div>
          <div className="treasure-mission-list">
            {missions.map((mission) => (
              <article key={mission.title} className="treasure-mission-card">
                <div className="treasure-mission-left">
                  <h3>{mission.title}</h3>
                  <p>{mission.desc}</p>
                  <div className="treasure-mission-progress">
                    <div className="treasure-mission-progress-bar">
                      <div
                        className="treasure-mission-progress-inner"
                        style={{ width: `${mission.progress}%` }}
                      />
                    </div>
                    <span>{mission.progress}%</span>
                  </div>
                </div>
                <div className="treasure-mission-right">
                  <span className="treasure-mission-reward">{mission.reward}</span>
                  <button>{t('treasure.actions.view')}</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="treasure-section">
          <div className="treasure-section-header">
            <h2>{t('treasure.sections.orders')}</h2>
            <span>{t('treasure.sections.ordersSubtitle')}</span>
          </div>
          <div className="treasure-order-list">
            {orders.map((order) => (
              <article key={order.id} className="treasure-order-card">
                <div>
                  <span className="treasure-order-id">{order.id}</span>
                  <h3>{order.title}</h3>
                </div>
                <div className="treasure-order-meta">
                  <span className={`treasure-order-status ${order.status.includes(t('treasure.orderStatus.completed')) ? 'success' : ''}`}>
                    {order.status}
                  </span>
                  <strong>{order.amount}</strong>
                  <span>{order.time}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Treasure;
