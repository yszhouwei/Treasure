import React from 'react';
import { useTranslation } from 'react-i18next';
import './SelectGroupTypePage.css';

interface GroupTypeItem {
  id: number;
  name: string;
  color: string;
  icon: string;
  size?: number;
}

interface SelectGroupTypePageProps {
  groupTypes: GroupTypeItem[];
  onBack: () => void;
  onSelect: (groupType: GroupTypeItem) => void;
}

const SelectGroupTypePage: React.FC<SelectGroupTypePageProps> = ({ groupTypes, onBack, onSelect }) => {
  const { t } = useTranslation();

  const getGroupTypeInfo = (size?: number) => {
    const actualSize = size || 10;
    switch (actualSize) {
      case 10:
        return {
          title: t('groupType.group10') || '10人团',
          desc: t('groupType.group10Desc') || '适合小规模团购，成团速度快',
          benefits: [
            t('groupType.benefit1') || '成团门槛低，容易达成',
            t('groupType.benefit2') || '审核通过后即可开团',
            t('groupType.benefit3') || '适合新手团长'
          ]
        };
      case 20:
        return {
          title: t('groupType.group20') || '20人团',
          desc: t('groupType.group20Desc') || '中等规模，性价比高',
          benefits: [
            t('groupType.benefit1') || '成团门槛适中',
            t('groupType.benefit2') || '审核通过后即可开团',
            t('groupType.benefit3') || '适合有一定经验的团长'
          ]
        };
      case 50:
        return {
          title: t('groupType.group50') || '50人团',
          desc: t('groupType.group50Desc') || '大规模团购，收益更高',
          benefits: [
            t('groupType.benefit1') || '成团后收益更丰厚',
            t('groupType.benefit2') || '审核通过后即可开团',
            t('groupType.benefit3') || '适合经验丰富的团长'
          ]
        };
      case 100:
        return {
          title: t('groupType.group100') || '100人团',
          desc: t('groupType.group100Desc') || '超大规模，最大收益',
          benefits: [
            t('groupType.benefit1') || '成团后收益最大化',
            t('groupType.benefit2') || '审核通过后即可开团',
            t('groupType.benefit3') || '适合资深团长'
          ]
        };
      default:
        return {
          title: `${actualSize}人团`,
          desc: '选择适合的团购规模',
          benefits: []
        };
    }
  };

  return (
    <div className="select-group-type-page">
      {/* 头部 */}
      <div className="select-type-header">
        <button className="back-btn" onClick={onBack} aria-label="返回">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1>{t('selectGroupType.title') || '选择团购类型'}</h1>
        <div style={{ width: 40 }} />
      </div>

      <div className="select-type-content">
        {/* 说明卡片 */}
        <div className="info-card">
          <div className="info-icon">👑</div>
          <h2>{t('selectGroupType.subtitle') || '选择适合的团购规模'}</h2>
          <p>{t('selectGroupType.description') || '不同规模的团购有不同的成团要求和收益，请根据您的实际情况选择'}</p>
        </div>

        {/* 团购类型列表 */}
        <div className="group-types-list">
          {groupTypes.map((type) => {
            const info = getGroupTypeInfo(type.size || 10);
            return (
              <div
                key={type.id}
                className="group-type-card"
                onClick={() => onSelect(type)}
              >
                <div className="type-card-header" style={{ backgroundColor: `${type.color}15` }}>
                  <div className="type-badge-large" style={{ backgroundColor: type.color }}>
                    {type.name}
                  </div>
                  <div className="type-icon-large" style={{ color: type.color }}>
                    {type.icon}
                  </div>
                </div>
                <div className="type-card-body">
                  <h3>{info.title}</h3>
                  <p className="type-desc">{info.desc}</p>
                  <div className="type-benefits">
                    {info.benefits.map((benefit, index) => (
                      <div key={index} className="benefit-item">
                        <span className="benefit-icon">✓</span>
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="type-card-footer">
                  <span className="select-hint">{t('selectGroupType.clickToSelect') || '点击选择'}</span>
                  <span className="arrow-icon">→</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 温馨提示 */}
        <div className="tips-card">
          <h4>{t('selectGroupType.tipsTitle') || '温馨提示'}</h4>
          <ul>
            <li>{t('selectGroupType.tip1') || '提交申请后，平台将在1-3个工作日内完成审核'}</li>
            <li>{t('selectGroupType.tip2') || '审核通过后，您即可发起对应规模的团购活动'}</li>
            <li>{t('selectGroupType.tip3') || '不同规模的团购有不同的收益分配规则'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SelectGroupTypePage;

