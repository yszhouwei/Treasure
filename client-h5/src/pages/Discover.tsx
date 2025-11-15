import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import TrendingDetail from './discover/TrendingDetail';
import InsightDetail from './discover/InsightDetail';
import StoryDetail from './discover/StoryDetail';
import TagListPage from './discover/TagListPage';
import SearchPage from './discover/SearchPage';
import './Discover.css';

type TrendingItem = {
  title: string;
  category: string;
  desc: string;
  heat: string;
  time: string;
};

type InsightItem = {
  title: string;
  desc: string;
  items: string[];
};

type StoryItem = {
  author: string;
  title: string;
  summary: string;
};

type PageState =
  | { type: 'trending'; payload: TrendingItem; index: number }
  | { type: 'insight'; payload: InsightItem; index: number }
  | { type: 'story'; payload: StoryItem; index: number }
  | { type: 'tag'; payload: string }
  | { type: 'search'; query?: string }
  | null;

const Discover: React.FC = () => {
  const { t } = useTranslation();

  const tags = t('discover.tags', { returnObjects: true }) as string[];
  const trending = t('discover.trending', { returnObjects: true }) as TrendingItem[];
  const insights = t('discover.insights', { returnObjects: true }) as InsightItem[];
  const stories = t('discover.stories', { returnObjects: true }) as StoryItem[];

  const [searchQuery, setSearchQuery] = useState('');
  const [activePage, setActivePage] = useState<PageState>(null);
  const [pageHistory, setPageHistory] = useState<PageState[]>([]); // 页面历史记录

  // 导航到新页面（带历史记录）
  const navigateToPage = (page: PageState) => {
    if (activePage) {
      setPageHistory(prev => [...prev, activePage]);
    }
    setActivePage(page);
  };

  // 返回上一页
  const goBack = () => {
    if (pageHistory.length > 0) {
      const previousPage = pageHistory[pageHistory.length - 1];
      setPageHistory(prev => prev.slice(0, -1));
      setActivePage(previousPage);
    } else {
      setActivePage(null);
    }
  };

  // 处理子页面之间的导航
  const handleSubPageItemClick = (item: any, type: 'trending' | 'insight' | 'story') => {
    const index = type === 'trending' 
      ? trending.findIndex(t => t.title === item.title)
      : type === 'insight'
      ? insights.findIndex(i => i.title === item.title)
      : stories.findIndex(s => s.title === item.title);

    navigateToPage({ type, payload: item, index });
  };

  // 渲染子页面
  if (activePage) {
    switch (activePage.type) {
      case 'trending':
        return (
          <TrendingDetail
            trending={activePage.payload}
            onBack={goBack}
            onSubscribe={() => {
              // TODO: 实现订阅功能，对接后端API
              alert(t('discover.sheet.trending.cta') || '订阅成功');
            }}
          />
        );
      case 'insight':
        return (
          <InsightDetail
            insight={activePage.payload}
            onBack={goBack}
            onSave={() => {
              // TODO: 实现收藏功能，对接后端API
              alert(t('discover.sheet.insight.cta') || '已保存到收藏');
            }}
          />
        );
      case 'story':
        return (
          <StoryDetail
            story={activePage.payload}
            onBack={goBack}
            onComment={() => {
              // TODO: 实现评论功能，对接后端API
              alert(t('discover.sheet.story.cta') || '评论功能开发中');
            }}
          />
        );
      case 'tag':
        return (
          <TagListPage
            tag={activePage.payload}
            onBack={goBack}
            onItemClick={handleSubPageItemClick}
            onTagClick={(tag) => {
              // 点击相关标签，跳转到该标签页
              navigateToPage({ type: 'tag', payload: tag });
            }}
          />
        );
      case 'search':
        return (
          <SearchPage
            initialQuery={activePage.query}
            onBack={goBack}
            onItemClick={handleSubPageItemClick}
          />
        );
    }
  }

  return (
    <div className="discover-container">
      <Header />

      <div className="discover-content">
        <section className="discover-hero">
          <div className="discover-hero-overlay">
            <h1 className="discover-hero-title">{t('discover.hero.title')}</h1>
            <p className="discover-hero-subtitle">{t('discover.hero.subtitle')}</p>
            <div className="discover-search">
              <span className="discover-search-icon">🔍</span>
              <input
                className="discover-search-input"
                placeholder={t('discover.hero.searchPlaceholder')}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    navigateToPage({ type: 'search', query: searchQuery });
                  }
                }}
              />
              <button className="discover-search-btn" onClick={() => navigateToPage({ type: 'search', query: searchQuery })}>
                {t('common.search')}
              </button>
            </div>
            <div className="discover-tags">
              {tags.map((tag) => (
                <button key={tag} className="discover-tag" onClick={() => navigateToPage({ type: 'tag', payload: tag })}>
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="discover-section">
          <div className="discover-section-header">
            <h2>{t('discover.sections.trending')}</h2>
            <span className="discover-section-subtitle">{t('discover.sections.trendingSubtitle')}</span>
          </div>
          <div className="discover-trending-grid">
            {trending.map((item, index) => (
              <article
                key={item.title}
                className="discover-trending-card"
                onClick={() => navigateToPage({ type: 'trending', payload: item, index })}
              >
                <div className="discover-trending-header">
                  <span className="discover-trending-tag">{item.category}</span>
                  <span className="discover-trending-heat">{item.heat}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <footer>
                  <span>{item.time}</span>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      navigateToPage({ type: 'trending', payload: item, index });
                    }}
                  >
                    {t('common.more')}
                  </button>
                </footer>
              </article>
            ))}
          </div>
        </section>

        <section className="discover-section">
          <div className="discover-section-header">
            <h2>{t('discover.sections.insights')}</h2>
            <span className="discover-section-subtitle">{t('discover.sections.insightsSubtitle')}</span>
          </div>
          <div className="discover-insights-list">
            {insights.map((insight, index) => (
              <article
                key={insight.title}
                className="discover-insight-card"
                onClick={() => navigateToPage({ type: 'insight', payload: insight, index })}
              >
                <div className="discover-insight-header">
                  <div className="discover-insight-icon">💡</div>
                  <div>
                    <h3>{insight.title}</h3>
                    <p>{insight.desc}</p>
                  </div>
                </div>
                <ul>
                  {insight.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <button
                  className="discover-link-btn"
                  onClick={(event) => {
                    event.stopPropagation();
                    navigateToPage({ type: 'insight', payload: insight, index });
                  }}
                >
                  {t('common.more')}
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="discover-section">
          <div className="discover-section-header">
            <h2>{t('discover.sections.stories')}</h2>
            <span className="discover-section-subtitle">{t('discover.sections.storiesSubtitle')}</span>
          </div>
          <div className="discover-stories">
            {stories.map((story, index) => (
              <article
                key={story.title}
                className="discover-story-card"
                onClick={() => navigateToPage({ type: 'story', payload: story, index })}
              >
                <header>
                  <span className="discover-story-author">{story.author}</span>
                  <h3>{story.title}</h3>
                </header>
                <p>{story.summary}</p>
                <button
                  className="discover-link-btn"
                  onClick={(event) => {
                    event.stopPropagation();
                    navigateToPage({ type: 'story', payload: story, index });
                  }}
                >
                  {t('common.more')}
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Discover;
