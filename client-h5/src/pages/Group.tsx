import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import GroupOverview from './group/GroupOverview';
import MetricDetail from './group/MetricDetail';
import UpcomingDetail from './group/UpcomingDetail';
import ActiveDetail from './group/ActiveDetail';
import EngagementPage from './group/EngagementPage';
import MyGroupDetail from './group/MyGroupDetail';
import InviteMembersPage from './group/InviteMembersPage';
import SelectGroupTypePage from '../pages/home/SelectGroupTypePage';
import CreateGroupPage from '../pages/home/CreateGroupPage';
import ApplicationSuccessPage from '../pages/home/ApplicationSuccessPage';
import TeamMembersPage from './group/TeamMembersPage';
import TeamStatisticsPage from './group/TeamStatisticsPage';
import TeamSettingsPage from './group/TeamSettingsPage';
import { TeamsService, type TeamOverview } from '../services/teams.service';
import { OrdersService, type GroupOrder } from '../services/orders.service';
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
  | { type: 'active'; payload: GroupItem }
  | { type: 'myGroupDetail'; payload: GroupOrder }
  | { type: 'inviteMembers' }
  | { type: 'selectGroupType' }
  | { type: 'createGroup'; payload: { groupType: { id: number; name: string; color: string; icon: string; size?: number } } }
  | { type: 'applicationSuccess'; payload: { application: any } }
  | { type: 'teamMembers' }
  | { type: 'teamStatistics' }
  | { type: 'teamSettings' };

const Group: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  const [activePage, setActivePage] = useState<PageState | null>(null);
  const [teamOverview, setTeamOverview] = useState<TeamOverview | null>(null);
  const [myGroupOrders, setMyGroupOrders] = useState<GroupOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMyGroups, setLoadingMyGroups] = useState(false);
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
        console.log('团队概览数据:', overview);
        console.log('待启动团购:', overview?.upcomingGroups);
        console.log('进行中团购:', overview?.activeGroups);
        setTeamOverview(overview);
      } catch (err: any) {
        // 如果用户不是团队长（404），这是正常情况，静默处理
        if (err.status === 404) {
          setTeamOverview(null);
          setError(null); // 不显示错误信息
        } else {
          // 其他错误才显示
          console.error('获取团队数据失败:', err);
          setError(err.message || '获取团队数据失败');
          setTeamOverview(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [isAuthenticated]);

  // 获取用户参与的团购列表
  useEffect(() => {
    const fetchMyGroupOrders = async () => {
      if (!isAuthenticated) {
        return;
      }

      setLoadingMyGroups(true);
      try {
        const groups = await OrdersService.getMyGroupOrders();
        setMyGroupOrders(groups);
      } catch (err: any) {
        console.error('获取我的团购列表失败:', err);
      } finally {
        setLoadingMyGroups(false);
      }
    };

    fetchMyGroupOrders();
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

  const upcoming: GroupItem[] = (teamOverview?.upcomingGroups && teamOverview.upcomingGroups.length > 0)
    ? teamOverview.upcomingGroups.map((group: any, index: number) => {
        const groupId = group.id || (index + 1);
        const productName = group.product?.name || group.product_name || group.title || `团购活动 ${index + 1}`;
        const targetCount = group.target_count || group.target_members || 0;
        const currentCount = group.current_count || group.current_members || 0;
        return {
          id: `#GRP${String(groupId).padStart(4, '0')}`,
          title: productName,
          status: t('group.upcomingDetail.statusPending') || '待排期',
          progress: 0,
          participants: `${targetCount}人目标 · 已确认${currentCount}人`,
          remaining: group.start_time ? `剩余${Math.ceil((new Date(group.start_time).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}天` : '待定'
        };
      })
    : (t('group.upcoming', { returnObjects: true }) as GroupItem[] || []);

  const active: GroupItem[] = (teamOverview?.activeGroups && teamOverview.activeGroups.length > 0)
    ? teamOverview.activeGroups.map((group: any, index: number) => {
        const groupId = group.id || (index + 1);
        const productName = group.product?.name || group.product_name || group.title || `团购活动 ${index + 1}`;
        const targetCount = group.target_count || group.target_members || 0;
        const currentCount = group.current_count || group.current_members || 0;
        const progress = targetCount > 0 
          ? Math.floor((currentCount / targetCount) * 100)
          : 0;
        return {
          id: `#GRP${String(groupId).padStart(4, '0')}`,
          title: productName,
          status: t('group.activeDetail.statusActive') || '进行中',
          progress,
          participants: `已参团 ${currentCount}/${targetCount}`,
          remaining: group.end_time ? `距离结束${Math.ceil((new Date(group.end_time).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}天` : '进行中'
        };
      })
    : (t('group.active', { returnObjects: true }) as GroupItem[] || []);

  // Render sub-pages
  if (activePage) {
    switch (activePage.type) {
      case 'overview':
        return (
          <GroupOverview
            onBack={() => setActivePage(null)}
            onNavigate={(page) => {
              if (page === 'members') {
                setActivePage({ type: 'teamMembers' });
              } else if (page === 'statistics') {
                setActivePage({ type: 'teamStatistics' });
              } else if (page === 'settings') {
                setActivePage({ type: 'teamSettings' });
              }
            }}
          />
        );
      case 'teamMembers':
        return <TeamMembersPage onBack={() => setActivePage({ type: 'overview' })} />;
      case 'teamStatistics':
        return <TeamStatisticsPage onBack={() => setActivePage({ type: 'overview' })} />;
      case 'teamSettings':
        return <TeamSettingsPage onBack={() => setActivePage({ type: 'overview' })} />;
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
      case 'myGroupDetail':
        return (
          <MyGroupDetail
            groupOrder={activePage.payload}
            onBack={() => setActivePage(null)}
          />
        );
      case 'inviteMembers':
        return (
          <InviteMembersPage
            onBack={() => setActivePage(null)}
          />
        );
      case 'selectGroupType':
        return (
          <SelectGroupTypePage
            groupTypes={[
              { id: 1, name: t('groupType.group10'), color: '#52c41a', icon: '👥', size: 10 },
              { id: 2, name: t('groupType.group20'), color: '#1890ff', icon: '🏆', size: 20 },
              { id: 3, name: t('groupType.group50'), color: '#722ed1', icon: '🎯', size: 50 },
              { id: 4, name: t('groupType.group100'), color: '#ff4d4f', icon: '👑', size: 100 },
            ]}
            onBack={() => setActivePage(null)}
            onSelect={(groupType) => {
              // 直接导航到创建团购页面
              setActivePage({
                type: 'createGroup',
                payload: { groupType }
              });
            }}
          />
        );
      case 'createGroup':
        return (
          <CreateGroupPage
            groupType={{
              id: activePage.payload.groupType.id,
              name: activePage.payload.groupType.name,
              color: activePage.payload.groupType.color,
              size: activePage.payload.groupType.size || parseInt(activePage.payload.groupType.name.match(/\d+/)?.[0] || '10')
            }}
            onBack={() => {
              // 返回到选择团购类型页面
              setActivePage({ type: 'selectGroupType' });
            }}
            onConfirm={(applicationData) => {
              // 提交申请后跳转到申请成功页面
              setActivePage({
                type: 'applicationSuccess',
                payload: {
                  application: {
                    groupType: activePage.payload.groupType.name,
                    productName: applicationData?.productName,
                    applicationNo: `APP${Date.now().toString().slice(-8)}`
                  }
                }
              });
            }}
          />
        );
      case 'applicationSuccess':
        return (
          <ApplicationSuccessPage
            application={activePage.payload.application}
            onBack={() => setActivePage(null)}
            onViewStatus={() => {
              // 返回到我的团购主页面
              setActivePage(null);
            }}
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
              <span 
                className="group-hero-tag"
                onClick={() => setActivePage({ type: 'overview' })}
                style={{ cursor: 'pointer' }}
              >
                {t('group.hero.tag')}
              </span>
            </div>
            <p>{t('group.hero.subtitle')}</p>
            <div className="group-hero-actions">
              <button onClick={() => setActivePage({ type: 'selectGroupType' })}>
                {t('group.actions.create') || '创建活动'}
              </button>
              <button 
                className="outline"
                onClick={() => setActivePage({ type: 'inviteMembers' })}
              >
                {t('group.actions.invite') || '邀请成员'}
              </button>
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
              <article key={item.id} className="group-card upcoming">
                <div className="group-card-main">
                  <div className="group-card-content">
                    <span className="group-card-id">{item.id}</span>
                    <h3>{item.title}</h3>
                    <div className="group-card-meta">
                      <span>{item.participants}</span>
                      <span>{item.remaining}</span>
                    </div>
                  </div>
                </div>
                <div className="group-card-right">
                  <span className="group-status upcoming-status">{item.status}</span>
                  <button
                    className="group-action-btn arrange-btn"
                    onClick={(event) => {
                      event.stopPropagation();
                      setActivePage({ type: 'upcoming', payload: item });
                    }}
                  >
                    {t('group.actions.arrange') || '安排排期'}
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
              <article key={item.id} className="group-card">
                <div className="group-card-main">
                  <div className="group-card-content">
                    <span className="group-card-id">{item.id}</span>
                    <h3>{item.title || '团购活动'}</h3>
                    <div className="group-progress">
                      <div className="group-progress-bar">
                        <div className="group-progress-inner" style={{ width: `${item.progress || 0}%` }} />
                      </div>
                      <span className="group-progress-text">{item.progress || 0}%</span>
                    </div>
                    <div className="group-card-meta">
                      <span>{item.participants || '暂无数据'}</span>
                      <span>{item.remaining || ''}</span>
                    </div>
                  </div>
                </div>
                <div className="group-card-right">
                  <span className="group-status active-status">{item.status}</span>
                  <button
                    className="group-action-btn manage-btn"
                    onClick={(event) => {
                      event.stopPropagation();
                      setActivePage({ type: 'active', payload: item });
                    }}
                  >
                    {t('group.actions.manage') || '管理'}
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

        {/* 用户参与的团购列表 */}
        <section className="group-section">
          <div className="group-section-header">
            <h2>{t('group.sections.myGroups') || '我参与的团购'}</h2>
            <span>{t('group.sections.myGroupsSubtitle') || '查看您参与的所有团购活动'}</span>
          </div>
          <div className="group-list">
            {loadingMyGroups ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#8c8c8c' }}>
                {t('common.loading') || '加载中...'}
              </div>
            ) : myGroupOrders.length > 0 ? (
              myGroupOrders.map((groupOrder) => (
                <article
                  key={groupOrder.product_id}
                  className="group-card"
                  onClick={() => setActivePage({ type: 'myGroupDetail', payload: groupOrder })}
                >
                  <div className="group-card-main">
                    {groupOrder.product_image && (
                      <img
                        src={groupOrder.product_image}
                        alt={groupOrder.product_name}
                        className="group-product-image"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target) target.style.display = 'none';
                        }}
                      />
                    )}
                    <div className="group-card-content">
                      <h3>{groupOrder.product_name}</h3>
                      <div className="group-card-meta">
                        <span>{t('group.myGroups.participants', { count: groupOrder.total_participants }) || `${groupOrder.total_participants}人参与`}</span>
                        <span>{t('group.myGroups.totalAmount', { amount: groupOrder.total_amount.toFixed(2) }) || `¥${groupOrder.total_amount.toFixed(2)}`}</span>
                      </div>
                    </div>
                  </div>
                  <div className="group-card-right">
                    <span className={`group-status ${groupOrder.status === 'completed' ? 'completed-status' : 'active-status'}`}>
                      {groupOrder.status === 'completed' 
                        ? (t('group.myGroups.statusCompleted') || '已完成')
                        : (t('group.myGroups.statusActive') || '进行中')}
                    </span>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        setActivePage({ type: 'myGroupDetail', payload: groupOrder });
                      }}
                    >
                      {t('group.actions.view') || '查看详情'}
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: '#8c8c8c' }}>
                {t('group.myGroups.empty') || '您还没有参与任何团购'}
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
