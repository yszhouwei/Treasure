import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
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

const Discover: React.FC = () => {
  const { t } = useTranslation();

  const tags = t('discover.tags', { returnObjects: true }) as string[];
  const trending = t('discover.trending', { returnObjects: true }) as TrendingItem[];
  const insights = t('discover.insights', { returnObjects: true }) as InsightItem[];
  const stories = t('discover.stories', { returnObjects: true }) as StoryItem[];

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
              />
              <button className="discover-search-btn">{t('common.search')}</button>
            </div>
            <div className="discover-tags">
              {tags.map((tag) => (
                <button key={tag} className="discover-tag">
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
            {trending.map((item) => (
              <article key={item.title} className="discover-trending-card">
                <div className="discover-trending-header">
                  <span className="discover-trending-tag">{item.category}</span>
                  <span className="discover-trending-heat">{item.heat}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <footer>
                  <span>{item.time}</span>
                  <button>{t('common.more')}</button>
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
            {insights.map((insight) => (
              <article key={insight.title} className="discover-insight-card">
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
                <button className="discover-link-btn">{t('common.more')}</button>
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
            {stories.map((story) => (
              <article key={story.title} className="discover-story-card">
                <header>
                  <span className="discover-story-author">{story.author}</span>
                  <h3>{story.title}</h3>
                </header>
                <p>{story.summary}</p>
                <button className="discover-link-btn">{t('common.more')}</button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Discover;
