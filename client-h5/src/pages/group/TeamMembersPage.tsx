import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';
import './TeamMembersPage.css';

interface TeamMember {
  id: number;
  name: string;
  avatar?: string;
  joinDate: string;
  totalOrders: number;
  totalAmount: number;
  status: 'active' | 'inactive';
}

const TeamMembersPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { t } = useTranslation();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟数据，后续替换为真实API调用
    setTimeout(() => {
      setMembers([
        {
          id: 1,
          name: '张三',
          joinDate: '2024-01-15',
          totalOrders: 12,
          totalAmount: 3600,
          status: 'active',
        },
        {
          id: 2,
          name: '李四',
          joinDate: '2024-02-20',
          totalOrders: 8,
          totalAmount: 2400,
          status: 'active',
        },
        {
          id: 3,
          name: '王五',
          joinDate: '2024-03-10',
          totalOrders: 5,
          totalAmount: 1500,
          status: 'active',
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="team-members-container">
      <Header onBack={onBack} title={t('group.management.members.title') || '团队成员'} />
      <div className="team-members-content">
        <div className="members-header">
          <div className="members-stats">
            <div className="stat-item">
              <span className="stat-label">{t('group.management.members.total') || '总成员数'}</span>
              <strong>{members.length}</strong>
            </div>
            <div className="stat-item">
              <span className="stat-label">{t('group.management.members.active') || '活跃成员'}</span>
              <strong>{members.filter(m => m.status === 'active').length}</strong>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>{t('common.loading') || '加载中...'}</p>
          </div>
        ) : (
          <div className="members-list">
            {members.length > 0 ? (
              members.map((member) => (
                <div key={member.id} className="member-card">
                  <div className="member-avatar">
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.name} />
                    ) : (
                      <span>{member.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="member-info">
                    <h3>{member.name}</h3>
                    <p className="member-meta">
                      {t('group.management.members.joinDate') || '加入时间'}: {member.joinDate}
                    </p>
                    <div className="member-stats">
                      <span>
                        {t('group.management.members.orders') || '订单数'}: {member.totalOrders}
                      </span>
                      <span>
                        {t('group.management.members.amount') || '总金额'}: ¥{member.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="member-status">
                    <span className={`status-badge ${member.status}`}>
                      {member.status === 'active'
                        ? (t('group.management.members.statusActive') || '活跃')
                        : (t('group.management.members.statusInactive') || '非活跃')}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>{t('group.management.members.empty') || '暂无团队成员'}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamMembersPage;

