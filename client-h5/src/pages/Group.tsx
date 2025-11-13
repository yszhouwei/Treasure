import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
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

const Group: React.FC = () => {
  const { t } = useTranslation();

  const metrics = t('group.metrics', { returnObjects: true }) as TeamMetric[];
  const upcoming = t('group.upcoming', { returnObjects: true }) as GroupItem[];
  const active = t('group.active', { returnObjects: true }) as GroupItem[];

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
            <div className="group-hero-card">
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
            {metrics.map((metric) => (
              <article key={metric.label} className="group-metric-card">
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
              <article key={item.id} className="group-card upcoming">
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
                  <button>{t('group.actions.arrange')}</button>
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
              <article key={item.id} className="group-card">
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
                  <button>{t('group.actions.manage')}</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Group;
