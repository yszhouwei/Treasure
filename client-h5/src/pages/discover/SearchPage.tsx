import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import './SearchPage.css';

interface SearchPageProps {
  initialQuery?: string;
  onBack: () => void;
  onItemClick?: (item: any, type: 'trending' | 'insight' | 'story') => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ initialQuery = '', onBack, onItemClick }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<'all' | 'trending' | 'insights' | 'stories'>('all');

  // 模拟搜索结果
  const searchResults = useMemo(() => {
    if (!query) return { trending: [], insights: [], stories: [] };

    return {
      trending: [
        {
          title: `${query}精品展`,
          category: query,
          desc: `精选${query}相关的珍稀藏品展览`,
          heat: '热度 95%',
          time: '剩余 3 天'
        },
        {
          title: `${query}鉴赏会`,
          category: query,
          desc: `专家带你深入了解${query}的魅力`,
          heat: '热度 88%',
          time: '剩余 5 天'
        }
      ],
      insights: [
        {
          title: `${query}入门指南`,
          desc: `从零开始学习${query}的基础知识`,
          items: ['基础知识', '鉴别技巧', '投资建议']
        },
        {
          title: `${query}收藏路线`,
          desc: `打造属于你的${query}收藏之旅`,
          items: ['市场调研', '渠道开拓', '风险控制']
        }
      ],
      stories: [
        {
          author: '张三 · 北京',
          title: `我的${query}收藏经历`,
          summary: `分享我在${query}领域多年的收藏心得和难忘经历`
        },
        {
          author: '李四 · 上海',
          title: `${query}寻宝之旅`,
          summary: `记录我环游世界寻找${query}珍品的故事`
        }
      ]
    };
  }, [query]);

  const filteredResults = useMemo(() => {
    if (activeTab === 'all') return searchResults;
    if (activeTab === 'trending') return { trending: searchResults.trending, insights: [], stories: [] };
    if (activeTab === 'insights') return { trending: [], insights: searchResults.insights, stories: [] };
    if (activeTab === 'stories') return { trending: [], insights: [], stories: searchResults.stories };
    return searchResults;
  }, [activeTab, searchResults]);

  const totalCount = searchResults.trending.length + searchResults.insights.length + searchResults.stories.length;

  return (
    <div className="search-page">
      {/* 头部 */}
      <div className="search-page-header">
        <button className="back-btn" onClick={onBack} aria-label="返回">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="search-input-wrapper">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchOverlay.placeholder')}
            autoFocus
          />
          {query && (
            <button className="clear-btn" onClick={() => setQuery('')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="5" y1="5" x2="19" y2="19"/>
                <line x1="19" y1="5" x2="5" y2="19"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* 搜索结果 */}
      {query ? (
        <div className="search-page-content">
          {/* 结果统计 */}
          <div className="search-stats">
            <h2>搜索结果</h2>
            <span className="result-count">找到 {totalCount} 条相关内容</span>
          </div>

          {/* 标签页 */}
          <div className="search-tabs">
            <button 
              className={`search-tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              全部 ({totalCount})
            </button>
            <button 
              className={`search-tab ${activeTab === 'trending' ? 'active' : ''}`}
              onClick={() => setActiveTab('trending')}
            >
              活动 ({searchResults.trending.length})
            </button>
            <button 
              className={`search-tab ${activeTab === 'insights' ? 'active' : ''}`}
              onClick={() => setActiveTab('insights')}
            >
              灵感 ({searchResults.insights.length})
            </button>
            <button 
              className={`search-tab ${activeTab === 'stories' ? 'active' : ''}`}
              onClick={() => setActiveTab('stories')}
            >
              故事 ({searchResults.stories.length})
            </button>
          </div>

          {/* 搜索结果列表 */}
          <div className="search-results">
            {/* 热门活动 */}
            {filteredResults.trending.length > 0 && (
              <section className="result-section">
                <h3 className="result-section-title">热门活动</h3>
                <div className="trending-list">
                  {filteredResults.trending.map((item, index) => (
                    <div 
                      key={index} 
                      className="trending-result-item"
                      onClick={() => onItemClick && onItemClick(item, 'trending')}
                    >
                      <div className="trending-result-badge">{item.category}</div>
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                      <div className="trending-result-meta">
                        <span className="trending-heat">{item.heat}</span>
                        <span>·</span>
                        <span>{item.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 灵感清单 */}
            {filteredResults.insights.length > 0 && (
              <section className="result-section">
                <h3 className="result-section-title">灵感清单</h3>
                <div className="insights-list">
                  {filteredResults.insights.map((item, index) => (
                    <div 
                      key={index} 
                      className="insight-result-item"
                      onClick={() => onItemClick && onItemClick(item, 'insight')}
                    >
                      <div className="insight-result-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M9 11l3 3L22 4"/>
                          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                        </svg>
                      </div>
                      <div className="insight-result-content">
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                        <div className="insight-result-tags">
                          {item.items.map((tag, tagIndex) => (
                            <span key={tagIndex} className="insight-tag">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 发现者故事 */}
            {filteredResults.stories.length > 0 && (
              <section className="result-section">
                <h3 className="result-section-title">发现者故事</h3>
                <div className="stories-list">
                  {filteredResults.stories.map((item, index) => (
                    <div 
                      key={index} 
                      className="story-result-item"
                      onClick={() => onItemClick && onItemClick(item, 'story')}
                    >
                      <div className="story-result-avatar">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                      </div>
                      <div className="story-result-content">
                        <span className="story-result-author">{item.author}</span>
                        <h4>{item.title}</h4>
                        <p>{item.summary}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      ) : (
        /* 空状态 */
        <div className="search-empty">
          <div className="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
          <h3>搜索宝藏灵感</h3>
          <p>输入关键词，发现精彩内容</p>
          
          {/* 热门搜索 */}
          <div className="hot-searches">
            <h4>热门搜索</h4>
            <div className="hot-search-tags">
              {(t('searchOverlay.hotWords', { returnObjects: true }) as string[]).map((word, index) => (
                <button 
                  key={index} 
                  className="hot-search-tag"
                  onClick={() => setQuery(word)}
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;

