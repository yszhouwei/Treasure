import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import DetailSheet from '../components/DetailSheet';
import metricsBg from '../assets/illustrations/group-metrics-bg.svg';
import './Group.css';

type TeamMetric = {
  label: string;
  value: string;
  change: string;
};

type GroupItem = {
  id: string;
  title: string;
  status: string;
  progress: number;
  participants: string;
  remaining: string;
};

type SheetState =
  | { type: 'hero' }
  | { type: 'progress' }
  | { type: 'metric'; payload: TeamMetric; index: number }
  | { type: 'upcoming'; payload: GroupItem }
  | { type: 'active'; payload: GroupItem };

const Group: React.FC = () => {
  const { t } = useTranslation();

  const metrics = t('group.metrics', { returnObjects: true }) as TeamMetric[];
  const upcoming = t('group.upcoming', { returnObjects: true }) as GroupItem[];
  const active = t('group.active', { returnObjects: true }) as GroupItem[];

  const [activeSheet, setActiveSheet] = useState<SheetState | null>(null);

  const sheetTitle = useMemo(() => {
    if (!activeSheet) return '';

    switch (activeSheet.type) {
      case 'hero':
        return t('group.sheet.hero.title');
      case 'progress':
        return t('group.sheet.progress.title');
      case 'metric':
        return t('group.sheet.metric.title', { label: activeSheet.payload.label });
      case 'upcoming':
        return t('group.sheet.upcoming.title');
      case 'active':
        return t('group.sheet.active.title');
      default:
        return '';
    }
  }, [activeSheet, t]);

  const sheetCta = useMemo(() => {
    if (!activeSheet) return '';

    switch (activeSheet.type) {
      case 'hero':
        return t('group.sheet.hero.cta');
      case 'progress':
        return t('group.sheet.progress.cta');
      case 'metric':
        return t('group.sheet.metric.cta');
      case 'upcoming':
        return t('group.sheet.upcoming.cta');
      case 'active':
        return t('group.sheet.active.cta');
      default:
        return '';
    }
  }, [activeSheet, t]);

  const sheetContent = useMemo(() => {
    if (!activeSheet) return null;

    switch (activeSheet.type) {
      case 'hero':
        return (
          <>
            <h4>{t('group.hero.leader')}</h4>
            <p>{t('group.sheet.hero.desc')}</p>
            <span className="detail-sheet-meta">{t('group.sheet.hero.schedule', { schedule: t('group.hero.scheduleValue') })}</span>
            <span className="detail-sheet-status">{t('group.sheet.hero.region', { region: t('group.hero.regionValue') })}</span>
          </>
        );
      case 'progress':
        return (
          <>
            <h4>{t('group.progress.label')}</h4>
            <p>{t('group.sheet.progress.desc', { percent: t('group.progress.percent') })}</p>
            <span className="detail-sheet-meta">{t('group.sheet.progress.hint')}</span>
          </>
        );
      case 'metric': {
        const metric = activeSheet.payload;
        return (
          <>
            <h4>{metric.label}</h4>
            <p>{t('group.sheet.metric.desc', { value: metric.value })}</p>
            <span className="detail-sheet-status">{metric.change}</span>
            <span className="detail-sheet-meta">{t('group.sheet.metric.meta')}</span>
          </>
        );
      }
      case 'upcoming': {
        const item = activeSheet.payload;
        return (
          <>
            <h4>{item.title}</h4>
            <p>{t('group.sheet.upcoming.desc')}</p>
            <span className="detail-sheet-status">{item.status}</span>
            <span className="detail-sheet-meta">{item.participants}</span>
            <span className="detail-sheet-meta">{item.remaining}</span>
          </>
        );
      }
      case 'active': {
        const item = activeSheet.payload;
        return (
          <>
            <h4>{item.title}</h4>
            <p>{t('group.sheet.active.desc')}</p>
            <span className="detail-sheet-status">{item.status}</span>
            <span className="detail-sheet-meta">{t('group.sheet.active.progress', { progress: item.progress })}</span>
            <span className="detail-sheet-meta">{item.participants}</span>
            <span className="detail-sheet-meta">{item.remaining}</span>
          </>
        );
      }
      default:
        return null;
    }
  }, [activeSheet, t]);

  const sheetRoute = useMemo(() => {
    if (!activeSheet) return undefined;

    switch (activeSheet.type) {
      case 'hero':
        return '/group/overview';
      case 'progress':
        return '/group/engagement';
      case 'metric':
        return `/group/metric/${activeSheet.index}`;
      case 'upcoming':
        return `/group/upcoming/${encodeURIComponent(activeSheet.payload.id)}`;
      case 'active':
        return `/group/active/${encodeURIComponent(activeSheet.payload.id)}`;
      default:
        return undefined;
    }
  }, [activeSheet]);

  const closeSheet = () => setActiveSheet(null);

  return (
    <div className="group-container">
      <Header />
      <div className="group-content">
        <section className="group-hero">
          <div className="group-hero-overlay">
            <div className="group-hero-header">
              <h1>{t('group.hero.title')}</h1>
              <span className="group-hero-tag">{t('group.hero.tag')}</span>
            </div>
            <p>{t('group.hero.subtitle')}</p>
            <div className="group-hero-actions">
              <button>{t('group.actions.create')}</button>
              <button className="outline">{t('group.actions.invite')}</button>
            </div>
            <div className="group-hero-card" onClick={() => setActiveSheet({ type: 'hero' })}>
              <div>
                <span>{t('group.hero.leader')}</span>
                <strong>{t('group.hero.leaderName')}</strong>
              </div>
              <div>
                <span>{t('group.hero.schedule')}</span>
                <strong>{t('group.hero.scheduleValue')}</strong>
              </div>
              <div>
                <span>{t('group.hero.region')}</span>
                <strong>{t('group.hero.regionValue')}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="group-section">
          <div className="group-section-header">
            <h2>{t('group.sections.metrics')}</h2>
            <span>{t('group.sections.metricsSubtitle')}</span>
          </div>
          <div className="group-metrics-grid">
            <img src={metricsBg} alt="decor" className="group-metrics-decoration" />
            {metrics.map((metric, index) => (
              <article
                key={metric.label}
                className="group-metric-card"
                onClick={() => setActiveSheet({ type: 'metric', payload: metric, index })}
              >
                <span className="group-metric-label">{metric.label}</span>
                <strong>{metric.value}</strong>
                <span className={`group-metric-change ${metric.change.startsWith('+') ? 'positive' : ''}`}>
                  {metric.change}
                </span>
              </article>
            ))}
          </div>
        </section>

        <section className="group-section">
          <div className="group-section-header">
            <h2>{t('group.sections.upcoming')}</h2>
            <span>{t('group.sections.upcomingSubtitle')}</span>
          </div>
          <div className="group-list">
            {upcoming.map((item) => (
              <article key={item.id} className="group-card upcoming" onClick={() => setActiveSheet({ type: 'upcoming', payload: item })}>
                <div className="group-card-main">
                  <span className="group-card-id">{item.id}</span>
                  <h3>{item.title}</h3>
                  <div className="group-card-meta">
                    <span>{item.participants}</span>
                    <span>{item.remaining}</span>
                  </div>
                </div>
                <div className="group-card-right">
                  <span className="group-status upcoming-status">{item.status}</span>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      setActiveSheet({ type: 'upcoming', payload: item });
                    }}
                  >
                    {t('group.actions.arrange')}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="group-section">
          <div className="group-section-header">
            <h2>{t('group.sections.active')}</h2>
            <span>{t('group.sections.activeSubtitle')}</span>
          </div>
          <div className="group-list">
            {active.map((item) => (
              <article key={item.id} className="group-card" onClick={() => setActiveSheet({ type: 'active', payload: item })}>
                <div className="group-card-main">
                  <span className="group-card-id">{item.id}</span>
                  <h3>{item.title}</h3>
                  <div className="group-progress">
                    <div className="group-progress-bar">
                      <div className="group-progress-inner" style={{ width: `${item.progress}%` }} />
                    </div>
                    <span>{item.progress}%</span>
                  </div>
                  <div className="group-card-meta">
                    <span>{item.participants}</span>
                    <span>{item.remaining}</span>
                  </div>
                </div>
                <div className="group-card-right">
                  <span className="group-status active-status">{item.status}</span>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      setActiveSheet({ type: 'active', payload: item });
                    }}
                  >
                    {t('group.actions.manage')}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="group-section group-progress-card">
          <div className="group-progress-panel">
            <div>
              <h2>{t('group.progress.label')}</h2>
              <p>{t('group.sheet.progress.subtitle')}</p>
            </div>
            <button onClick={() => setActiveSheet({ type: 'progress' })}>{t('group.sheet.progress.button')}</button>
          </div>
        </section>
      </div>

      {activeSheet && (
        <DetailSheet
          open={Boolean(activeSheet)}
          title={sheetTitle}
          onClose={() => setActiveSheet(null)}
          ctaLabel={sheetCta || undefined}
          closeLabel={t('group.sheet.close')}
          to={sheetRoute}
        >
          {sheetContent}
        </DetailSheet>
      )}
    </div>
  );
};

export default Group;
