import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import StatDetail from './treasure/StatDetail';
import MissionDetail from './treasure/MissionDetail';
import OrderDetail from './treasure/OrderDetail';
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

type PageState =
  | { type: 'stat'; payload: StatItem; index: number }
  | { type: 'mission'; payload: MissionItem; index: number }
  | { type: 'order'; payload: OrderItem }
  | null;

const Treasure: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const stats = t('treasure.stats', { returnObjects: true }) as StatItem[];
  const missions = t('treasure.missions', { returnObjects: true }) as MissionItem[];
  const orders = t('treasure.orders', { returnObjects: true }) as OrderItem[];

  const [activePage, setActivePage] = useState<PageState>(null);

  // 构建完整的头像URL
  const getAvatarUrl = (url: string | null | undefined) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    // 确保URL以 / 开头
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}${path}`;
  };

  const avatarUrl = user?.avatar ? getAvatarUrl(user.avatar) : null;
  const avatarInitial = useMemo(() => {
    if (!user?.name) return 'TX';
    return user.name.trim().substring(0, 2).toUpperCase();
  }, [user?.name]);

  // 渲染子页面
  if (activePage) {
    switch (activePage.type) {
      case 'stat':
        return (
          <StatDetail
            stat={activePage.payload}
            onBack={() => setActivePage(null)}
          />
        );
      case 'mission':
        return (
          <MissionDetail
            mission={activePage.payload}
            onBack={() => setActivePage(null)}
            onStart={() => alert(t('treasure.sheet.mission.cta'))}
          />
        );
      case 'order':
        return (
          <OrderDetail
            order={activePage.payload}
            onBack={() => setActivePage(null)}
            onContact={() => alert('联系客服')}
          />
        );
    }
  }


  return (
    <div className="treasure-container">
      <Header />
      <div className="treasure-content">
        <section className="treasure-hero">
          <div className="treasure-hero-overlay">
            <div className="treasure-hero-top">
              <div className={`treasure-avatar ${avatarUrl ? 'has-avatar' : ''}`}>
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="treasure-avatar-image"
                    onError={(e) => {
                      // 如果图片加载失败，隐藏图片，显示占位符
                      const target = e.target as HTMLImageElement;
                      if (target) {
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.classList.remove('has-avatar');
                          const placeholder = document.createElement('span');
                          placeholder.textContent = avatarInitial;
                          parent.appendChild(placeholder);
                        }
                      }
                    }}
                  />
                ) : (
                  <span>{avatarInitial}</span>
                )}
              </div>
              <div className="treasure-hero-info">
                <h1>{t('treasure.hero.title')}</h1>
                <p>{t('treasure.hero.subtitle')}</p>
                <span className="treasure-hero-badge">{t('treasure.hero.badge')}</span>
              </div>
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
            {stats.map((stat, index) => (
              <article
                key={stat.label}
                className="treasure-stat-card"
                  onClick={() => setActivePage({ type: 'stat', payload: stat, index })}
              >
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
            {missions.map((mission, index) => (
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
                  <button onClick={(e) => {
                    e.stopPropagation();
                    setActivePage({ type: 'mission', payload: mission, index });
                  }}>
                    {t('treasure.actions.view')}
                  </button>
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
              <article
                key={order.id}
                className="treasure-order-card"
                  onClick={() => setActivePage({ type: 'order', payload: order })}
              >
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
