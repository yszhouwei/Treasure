import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import './TagListPage.css';

interface TagListPageProps {
  tag: string;
  onBack: () => void;
  onItemClick?: (item: any, type: 'trending' | 'insight' | 'story') => void;
}

const TagListPage: React.FC<TagListPageProps> = ({ tag, onBack, onItemClick }) => {
  const { t } = useTranslation();

  // 根据标签模拟相关内容
  const relatedContent = useMemo(() => {
    return {
      trending: [
        {
          title: `${tag}主题展`,
          category: tag,
          desc: `精选${tag}相关的珍稀藏品展览`,
          heat: '热度 95%',
          time: '剩余 3 天'
        },
        {
          title: `${tag}鉴赏活动`,
          category: tag,
          desc: `专家带你深入了解${tag}的魅力`,
          heat: '热度 88%',
          time: '剩余 5 天'
        }
      ],
      insights: [
        {
          title: `${tag}入门指南`,
          desc: `从零开始学习${tag}的基础知识`,
          items: ['基础知识', '鉴别技巧', '投资建议']
        },
        {
          title: `${tag}收藏路线`,
          desc: `打造属于你的${tag}收藏之旅`,
          items: ['市场调研', '渠道开拓', '风险控制']
        }
      ],
      stories: [
        {
          author: '张三 · 北京',
          title: `我的${tag}收藏经历`,
          summary: `分享我在${tag}领域多年的收藏心得和难忘经历`
        },
        {
          author: '李四 · 上海',
          title: `${tag}寻宝之旅`,
          summary: `记录我环游世界寻找${tag}珍品的故事`
        }
      ]
    };
  }, [tag]);

  return (
    <div className="tag-list-page">
      {/* 头部 */}
      <div className="tag-list-header">
        <button className="back-btn-white" onClick={onBack} aria-label="返回">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="tag-hero">
          <h1>#{tag}</h1>
          <p className="tag-description">{t('discover.sheet.tag.desc', { tag })}</p>
          <button className="follow-tag-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
            {t('discover.sheet.tag.cta')}
          </button>
        </div>
      </div>

      {/* 内容 */}
      <div className="tag-list-content">
        {/* 热门活动 */}
        <section className="tag-section">
          <div className="section-header">
            <h2>热门活动</h2>
            <span className="section-count">{relatedContent.trending.length} 项</span>
          </div>
          <div className="trending-grid">
            {relatedContent.trending.map((item, index) => (
              <div 
                key={index} 
                className="trending-card"
                onClick={() => onItemClick && onItemClick(item, 'trending')}
              >
                <div className="trending-card-badge">{item.category}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <div className="trending-card-meta">
                  <span className="trending-heat">{item.heat}</span>
                  <span className="trending-divider">·</span>
                  <span className="trending-time">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 灵感清单 */}
        <section className="tag-section">
          <div className="section-header">
            <h2>灵感清单</h2>
            <span className="section-count">{relatedContent.insights.length} 份</span>
          </div>
          <div className="insights-grid">
            {relatedContent.insights.map((item, index) => (
              <div 
                key={index} 
                className="insight-card"
                onClick={() => onItemClick && onItemClick(item, 'insight')}
              >
                <div className="insight-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9 11l3 3L22 4"/>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                  </svg>
                </div>
                <div className="insight-content">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <div className="insight-items">
                    {item.items.map((subItem, subIndex) => (
                      <span key={subIndex} className="insight-tag">{subItem}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 发现者故事 */}
        <section className="tag-section">
          <div className="section-header">
            <h2>发现者故事</h2>
            <span className="section-count">{relatedContent.stories.length} 篇</span>
          </div>
          <div className="stories-grid">
            {relatedContent.stories.map((item, index) => (
              <div 
                key={index} 
                className="story-card"
                onClick={() => onItemClick && onItemClick(item, 'story')}
              >
                <div className="story-card-avatar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div className="story-card-content">
                  <span className="story-author">{item.author}</span>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <div className="story-card-meta">
                    <span>阅读 {Math.floor(Math.random() * 2000 + 500)}</span>
                    <span>·</span>
                    <span>点赞 {Math.floor(Math.random() * 200 + 50)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 相关标签 */}
        <section className="tag-section">
          <div className="section-header">
            <h2>相关标签</h2>
          </div>
          <div className="related-tags">
            <button className="related-tag-btn">#国际好物</button>
            <button className="related-tag-btn">#古董文玩</button>
            <button className="related-tag-btn">#科技数码</button>
            <button className="related-tag-btn">#艺术收藏</button>
            <button className="related-tag-btn">#限时活动</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TagListPage;

