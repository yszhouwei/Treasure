import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import DetailSheet from '../components/DetailSheet';
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

type SheetState =
  | { type: 'balance' }
  | { type: 'stat'; payload: StatItem; index: number }
  | { type: 'mission'; payload: MissionItem; index: number }
  | { type: 'order'; payload: OrderItem };

const Treasure: React.FC = () => {
  const { t } = useTranslation();

  const stats = t('treasure.stats', { returnObjects: true }) as StatItem[];
  const missions = t('treasure.missions', { returnObjects: true }) as MissionItem[];
  const orders = t('treasure.orders', { returnObjects: true }) as OrderItem[];

  const [activeSheet, setActiveSheet] = useState<SheetState | null>(null);

  const sheetTitle = useMemo(() => {
    if (!activeSheet) return '';

    switch (activeSheet.type) {
      case 'balance':
        return t('treasure.sheet.balance.title');
      case 'stat':
        return t('treasure.sheet.stat.title', { label: activeSheet.payload.label });
      case 'mission':
        return t('treasure.sheet.mission.title');
      case 'order':
        return t('treasure.sheet.order.title');
      default:
        return '';
    }
  }, [activeSheet, t]);

  const sheetRoute = useMemo(() => {
    if (!activeSheet) return undefined;

    switch (activeSheet.type) {
      case 'balance':
        return '/treasure/balance';
      case 'stat':
        return `/treasure/stat/${activeSheet.index}`;
      case 'mission':
        return `/treasure/mission/${activeSheet.index}`;
      case 'order':
        return `/treasure/order/${encodeURIComponent(activeSheet.payload.id.replace('#', ''))}`;
      default:
        return undefined;
    }
  }, [activeSheet]);

  const sheetCta = useMemo(() => {
    if (!activeSheet) return '';

    switch (activeSheet.type) {
      case 'balance':
        return t('treasure.sheet.balance.cta');
      case 'stat':
        return t('treasure.sheet.stat.cta');
      case 'mission':
        return t('treasure.sheet.mission.cta');
      case 'order':
        return t('treasure.sheet.order.cta');
      default:
        return '';
    }
  }, [activeSheet, t]);

  const sheetContent = useMemo(() => {
    if (!activeSheet) return null;

    switch (activeSheet.type) {
      case 'balance':
        return (
          <>
            <h4>{t('treasure.hero.balanceLabel')}</h4>
            <p>{t('treasure.sheet.balance.desc', { amount: t('treasure.hero.balanceValue') })}</p>
            <span className="detail-sheet-meta">{t('treasure.sheet.balance.meta')}</span>
            <span className="detail-sheet-status">{t('treasure.sheet.balance.status')}</span>
          </>
        );
      case 'stat': {
        const stat = activeSheet.payload;
        return (
          <>
            <h4>{stat.label}</h4>
            <p>{t('treasure.sheet.stat.desc', { label: stat.label, value: stat.value })}</p>
            <span className="detail-sheet-status">{stat.trend}</span>
            <span className="detail-sheet-meta">{t('treasure.sheet.stat.meta')}</span>
          </>
        );
      }
      case 'mission': {
        const mission = activeSheet.payload;
        return (
          <>
            <h4>{mission.title}</h4>
            <p>{mission.desc}</p>
            <span className="detail-sheet-status">{t('treasure.sheet.mission.progress', { progress: mission.progress })}</span>
            <span className="detail-sheet-meta">{t('treasure.sheet.mission.reward', { reward: mission.reward })}</span>
          </>
        );
      }
      case 'order': {
        const order = activeSheet.payload;
        return (
          <>
            <h4>{order.title}</h4>
            <span className="detail-sheet-status">{t('treasure.sheet.order.status', { status: order.status })}</span>
            <span className="detail-sheet-meta">{t('treasure.sheet.order.amount', { amount: order.amount })}</span>
            <span className="detail-sheet-meta">{t('treasure.sheet.order.time', { time: order.time })}</span>
            <span className="detail-sheet-meta">{t('treasure.sheet.order.id', { id: order.id })}</span>
          </>
        );
      }
      default:
        return null;
    }
  }, [activeSheet, t]);

  const closeSheet = () => setActiveSheet(null);

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
              <button onClick={() => setActiveSheet({ type: 'balance' })}>{t('treasure.hero.recharge')}</button>
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
                onClick={() => setActiveSheet({ type: 'stat', payload: stat, index })}
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
                  <button onClick={() => setActiveSheet({ type: 'mission', payload: mission, index })}>
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
                onClick={() => setActiveSheet({ type: 'order', payload: order })}
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

      {activeSheet && (
        <DetailSheet
          open={Boolean(activeSheet)}
          title={sheetTitle}
          onClose={closeSheet}
          ctaLabel={sheetCta || undefined}
          closeLabel={t('treasure.sheet.close')}
          to={sheetRoute}
        >
          {sheetContent}
        </DetailSheet>
      )}
    </div>
  );
};

export default Treasure;
