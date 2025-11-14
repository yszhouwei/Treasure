import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import GroupOverview from './group/GroupOverview';
import MetricDetail from './group/MetricDetail';
import UpcomingDetail from './group/UpcomingDetail';
import ActiveDetail from './group/ActiveDetail';
import EngagementPage from './group/EngagementPage';
import { TeamsService, type TeamOverview } from '../services/teams.service';
import { useAuth } from '../context/AuthContext';
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

type PageState =
  | { type: 'overview' }
  | { type: 'engagement' }
  | { type: 'metric'; payload: TeamMetric }
  | { type: 'upcoming'; payload: GroupItem }
  | { type: 'active'; payload: GroupItem };

const Group: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  const [activePage, setActivePage] = useState<PageState | null>(null);
  const [teamOverview, setTeamOverview] = useState<TeamOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取团队数据
  useEffect(() => {
    const fetchTeamData = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const overview = await TeamsService.getMyTeamOverview();
        setTeamOverview(overview);
      } catch (err: any) {
        console.error('获取团队数据失败:', err);
        setError(err.message || '获取团队数据失败');
        // 如果用户不是团队长，使用默认数据
        if (err.status === 404) {
          setTeamOverview(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [isAuthenticated]);

  // 转换API数据为页面需要的格式
  const metrics: TeamMetric[] = teamOverview ? [
    {
      label: t('group.metrics.0.label') || '团队人数',
      value: teamOverview.team.total_members?.toString() || '0',
      change: `+${teamOverview.team.active_members || 0} 活跃`
    },
    {
      label: t('group.metrics.1.label') || '总销售额',
      value: `¥${(teamOverview.team.total_sales || 0).toLocaleString('zh-CN')}`,
      change: `+${Math.floor((teamOverview.team.total_sales || 0) / 100)}% 本周`
    },
    {
      label: t('group.metrics.2.label') || '总订单数',
      value: (teamOverview.team.total_orders || 0).toString(),
      change: `+${Math.floor((teamOverview.team.total_orders || 0) / 10)} 本周`
    }
  ] : (t('group.metrics', { returnObjects: true }) as TeamMetric[]);

  const upcoming: GroupItem[] = teamOverview?.upcomingGroups?.map((group: any, index: number) => ({
    id: `#GRP${group.id || index}`,
    title: group.product?.name || group.title || `团购活动 ${index + 1}`,
    status: t('group.upcomingDetail.statusPending') || '待排期',
    progress: 0,
    participants: `${group.target_count || 0}人目标 · 已确认${group.current_count || 0}人`,
    remaining: group.start_time ? `剩余${Math.ceil((new Date(group.start_time).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}天` : '待定'
  })) || (t('group.upcoming', { returnObjects: true }) as GroupItem[]);

  const active: GroupItem[] = teamOverview?.activeGroups?.map((group: any, index: number) => {
    const progress = group.target_count > 0 
      ? Math.floor((group.current_count || 0) / group.target_count * 100)
      : 0;
    return {
      id: `#GRP${group.id || index}`,
      title: group.product?.name || group.title || `团购活动 ${index + 1}`,
      status: t('group.activeDetail.statusActive') || '进行中',
      progress,
      participants: `已参团${group.current_count || 0}/${group.target_count || 0}`,
      remaining: group.end_time ? `距离结束${Math.ceil((new Date(group.end_time).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}天` : '进行中'
    };
  }) || (t('group.active', { returnObjects: true }) as GroupItem[]);

  // Render sub-pages
  if (activePage) {
    switch (activePage.type) {
      case 'overview':
        return <GroupOverview onBack={() => setActivePage(null)} />;
      case 'engagement':
        return <EngagementPage onBack={() => setActivePage(null)} />;
      case 'metric':
        return (
          <MetricDetail
            metric={activePage.payload}
            onBack={() => setActivePage(null)}
          />
        );
      case 'upcoming':
        return (
          <UpcomingDetail
            item={activePage.payload}
            onBack={() => setActivePage(null)}
          />
        );
      case 'active':
        return (
          <ActiveDetail
            item={activePage.payload}
            onBack={() => setActivePage(null)}
          />
        );
    }
  }

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
            <div className="group-hero-card" onClick={() => setActivePage({ type: 'overview' })}>
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
              <article
                key={metric.label}
                className="group-metric-card"
                onClick={() => setActivePage({ type: 'metric', payload: metric })}
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
            {upcoming.length > 0 ? upcoming.map((item) => (
              <article key={item.id} className="group-card upcoming" onClick={() => setActivePage({ type: 'upcoming', payload: item })}>
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
                      setActivePage({ type: 'upcoming', payload: item });
                    }}
                  >
                    {t('group.actions.arrange')}
                  </button>
                </div>
              </article>
            )) : (
              <div style={{ padding: '40px', textAlign: 'center', color: '#8c8c8c' }}>
                {t('common.noData') || '暂无待启动的团购'}
              </div>
            )}
          </div>
        </section>

        <section className="group-section">
          <div className="group-section-header">
            <h2>{t('group.sections.active')}</h2>
            <span>{t('group.sections.activeSubtitle')}</span>
          </div>
          <div className="group-list">
            {active.length > 0 ? active.map((item) => (
              <article key={item.id} className="group-card" onClick={() => setActivePage({ type: 'active', payload: item })}>
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
                      setActivePage({ type: 'active', payload: item });
                    }}
                  >
                    {t('group.actions.manage')}
                  </button>
                </div>
              </article>
            )) : (
              <div style={{ padding: '40px', textAlign: 'center', color: '#8c8c8c' }}>
                {t('common.noData') || '暂无进行中的团购'}
              </div>
            )}
          </div>
        </section>

        <section className="group-section group-progress-card">
          <div className="group-progress-panel">
            <div>
              <h2>{t('group.progress.label')}</h2>
              <p>{t('group.sheet.progress.subtitle')}</p>
            </div>
            <button onClick={() => setActivePage({ type: 'engagement' })}>{t('group.sheet.progress.button')}</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Group;
