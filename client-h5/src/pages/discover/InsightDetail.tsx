import React from 'react';
import { useTranslation } from 'react-i18next';
import './InsightDetail.css';

interface InsightDetailProps {
  insight: {
    title: string;
    desc: string;
    items: string[];
  };
  onBack: () => void;
  onSave?: () => void;
}

const InsightDetail: React.FC<InsightDetailProps> = ({ insight, onBack, onSave }) => {
  const { t } = useTranslation();

  return (
    <div className="insight-detail-page">
      {/* 头部 */}
      <div className="insight-detail-header">
        <button className="back-btn-white" onClick={onBack} aria-label="返回">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="insight-hero">
          <div className="insight-badge">💡 灵感清单</div>
          <h1>{insight.title}</h1>
          <p className="insight-subtitle">{insight.desc}</p>
        </div>
      </div>

      {/* 内容 */}
      <div className="insight-detail-content">
        {/* 清单项目 */}
        <section className="insight-card">
          <h2>清单内容</h2>
          <div className="checklist">
            {insight.items.map((item, index) => (
              <div key={index} className="checklist-item">
                <div className="checklist-checkbox">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div className="checklist-content">
                  <h4>{item}</h4>
                  <p>点击查看详细指南和推荐资源</p>
                </div>
                <button className="checklist-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 推荐资源 */}
        <section className="insight-card">
          <h2>推荐资源</h2>
          <div className="resource-list">
            <div className="resource-item">
              <div className="resource-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
              </div>
              <div className="resource-content">
                <h4>寻宝入门手册</h4>
                <p>全面的寻宝基础知识和实操技巧</p>
                <span className="resource-tag">PDF · 2.5MB</span>
              </div>
            </div>

            <div className="resource-item">
              <div className="resource-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polygon points="23 7 16 12 23 17 23 7"/>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
              </div>
              <div className="resource-content">
                <h4>装备选购视频教程</h4>
                <p>专业讲解如何选择合适的寻宝装备</p>
                <span className="resource-tag">视频 · 15:32</span>
              </div>
            </div>

            <div className="resource-item">
              <div className="resource-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div className="resource-content">
                <h4>寻宝社群推荐</h4>
                <p>加入活跃的寻宝爱好者交流社区</p>
                <span className="resource-tag">社群 · 5000+ 成员</span>
              </div>
            </div>
          </div>
        </section>

        {/* 相关灵感 */}
        <section className="insight-card">
          <h2>相关灵感</h2>
          <div className="related-grid">
            <div className="related-item">
              <div className="related-image">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                  <polygon points="10 8 16 12 10 16 10 8"/>
                </svg>
              </div>
              <h4>进阶寻宝技巧</h4>
              <p>12个清单项</p>
            </div>

            <div className="related-item">
              <div className="related-image">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
              </div>
              <h4>全球寻宝地图</h4>
              <p>8个清单项</p>
            </div>
          </div>
        </section>

        {/* 使用建议 */}
        <section className="insight-card">
          <h2>使用建议</h2>
          <div className="tips-list">
            <div className="tip-item">
              <span className="tip-icon">📌</span>
              <p>将清单保存到个人收藏，随时查看和更新进度</p>
            </div>
            <div className="tip-item">
              <span className="tip-icon">✨</span>
              <p>按照清单顺序逐项完成，循序渐进更有效</p>
            </div>
            <div className="tip-item">
              <span className="tip-icon">💬</span>
              <p>在社区分享你的清单进度，与其他寻宝者交流</p>
            </div>
          </div>
        </section>
      </div>

      {/* 底部操作栏 */}
      <div className="insight-detail-footer">
        <button 
          className="save-btn"
          onClick={() => {
            if (onSave) onSave();
            else alert(t('discover.sheet.insight.cta'));
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
          {t('discover.sheet.insight.cta')}
        </button>
        <button className="share-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="18" cy="5" r="3"/>
            <circle cx="6" cy="12" r="3"/>
            <circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
          分享清单
        </button>
      </div>
    </div>
  );
};

export default InsightDetail;

