import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import DetailSheet from '../components/DetailSheet';
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

type SheetState =
  | { type: 'trending'; payload: TrendingItem; index: number }
  | { type: 'insight'; payload: InsightItem; index: number }
  | { type: 'story'; payload: StoryItem; index: number }
  | { type: 'tag'; payload: string }
  | { type: 'search'; query: string; results: TrendingItem[]; suggestions: string[] };

const Discover: React.FC = () => {
  const { t } = useTranslation();

  const tags = t('discover.tags', { returnObjects: true }) as string[];
  const trending = t('discover.trending', { returnObjects: true }) as TrendingItem[];
  const insights = t('discover.insights', { returnObjects: true }) as InsightItem[];
  const stories = t('discover.stories', { returnObjects: true }) as StoryItem[];

  const [searchQuery, setSearchQuery] = useState('');
  const [activeSheet, setActiveSheet] = useState<SheetState | null>(null);

  const sheetTitle = useMemo(() => {
    if (!activeSheet) return '';

    switch (activeSheet.type) {
      case 'trending':
        return t('discover.sheet.trending.title', { title: activeSheet.payload.title });
      case 'insight':
        return t('discover.sheet.insight.title', { title: activeSheet.payload.title });
      case 'story':
        return t('discover.sheet.story.title', { title: activeSheet.payload.title });
      case 'tag':
        return t('discover.sheet.tag.title', { tag: activeSheet.payload });
      case 'search':
        return t('discover.sheet.search.title', { query: activeSheet.query });
      default:
        return '';
    }
  }, [activeSheet, t]);

  const sheetCta = useMemo(() => {
    if (!activeSheet) return '';

    switch (activeSheet.type) {
      case 'trending':
        return t('discover.sheet.trending.cta');
      case 'insight':
        return t('discover.sheet.insight.cta');
      case 'story':
        return t('discover.sheet.story.cta');
      case 'tag':
        return t('discover.sheet.tag.cta');
      case 'search':
        return t('discover.sheet.search.cta');
      default:
        return '';
    }
  }, [activeSheet, t]);

  const sheetContent = useMemo(() => {
    if (!activeSheet) return null;

    switch (activeSheet.type) {
      case 'trending': {
        const item = activeSheet.payload;
        return (
          <>
            <h4>{item.title}</h4>
            <p>{item.desc}</p>
            <span className="detail-sheet-status">{`${item.category} · ${item.heat}`}</span>
            <span className="detail-sheet-meta">{item.time}</span>
            <span className="detail-sheet-meta">{t('discover.sheet.trending.meta')}</span>
          </>
        );
      }
      case 'insight': {
        const item = activeSheet.payload;
        return (
          <>
            <h4>{item.title}</h4>
            <p>{item.desc}</p>
            <ul className="detail-sheet-list">
              {item.items.map((listItem) => (
                <li key={listItem}>{listItem}</li>
              ))}
            </ul>
            <span className="detail-sheet-meta">{t('discover.sheet.insight.meta')}</span>
          </>
        );
      }
      case 'story': {
        const item = activeSheet.payload;
        return (
          <>
            <h4>{item.title}</h4>
            <span className="detail-sheet-status">{item.author}</span>
            <p>{item.summary}</p>
            <span className="detail-sheet-meta">{t('discover.sheet.story.meta')}</span>
          </>
        );
      }
      case 'tag': {
        const tag = activeSheet.payload;
        return (
          <>
            <h4>#{tag}</h4>
            <p>{t('discover.sheet.tag.desc', { tag })}</p>
            <span className="detail-sheet-meta">{t('discover.sheet.tag.meta')}</span>
          </>
        );
      }
      case 'search': {
        const { query, results, suggestions } = activeSheet;
        return (
          <>
            <h4>{t('discover.sheet.search.query', { query })}</h4>
            {results.length ? (
              <ul className="detail-sheet-list">
                {results.map((item) => (
                  <li key={item.title}>{item.title}</li>
                ))}
              </ul>
            ) : (
              <span className="detail-sheet-meta">{t('discover.sheet.search.empty')}</span>
            )}
            {suggestions.length > 0 && (
              <div className="detail-sheet-chip-group">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    className="detail-sheet-chip"
                    onClick={() => setActiveSheet({ type: 'tag', payload: suggestion })}
                  >
                    #{suggestion}
                  </button>
                ))}
              </div>
            )}
            <span className="detail-sheet-meta">{t('discover.sheet.search.meta')}</span>
          </>
        );
      }
      default:
        return null;
    }
  }, [activeSheet, t]);

  const sheetRoute = useMemo(() => {
    if (!activeSheet) return undefined;

    switch (activeSheet.type) {
      case 'trending':
        return `/discover/trending/${activeSheet.index}`;
      case 'insight':
        return `/discover/insight/${activeSheet.index}`;
      case 'story':
        return `/discover/story/${activeSheet.index}`;
      case 'tag':
        return `/discover/tag/${encodeURIComponent(activeSheet.payload)}`;
      case 'search':
        return `/discover/search/${encodeURIComponent(activeSheet.query)}`;
      default:
        return undefined;
    }
  }, [activeSheet]);

  const openSearchSheet = (query: string) => {
    const normalized = query.trim();
    const finalQuery = normalized || t('discover.sheet.search.default');
    const lower = finalQuery.toLowerCase();
    const resultTrending = trending.filter((item) => item.title.toLowerCase().includes(lower) || item.category.toLowerCase().includes(lower)).slice(0, 3);
    const suggestionTags = tags.filter((tag) => tag.toLowerCase().includes(lower)).slice(0, 4);
    setActiveSheet({ type: 'search', query: finalQuery, results: resultTrending, suggestions: suggestionTags });
  };

  const closeSheet = () => setActiveSheet(null);

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
                    openSearchSheet(searchQuery);
                  }
                }}
              />
              <button className="discover-search-btn" onClick={() => openSearchSheet(searchQuery)}>
                {t('common.search')}
              </button>
            </div>
            <div className="discover-tags">
              {tags.map((tag) => (
                <button key={tag} className="discover-tag" onClick={() => setActiveSheet({ type: 'tag', payload: tag })}>
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
                onClick={() => setActiveSheet({ type: 'trending', payload: item, index })}
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
                      setActiveSheet({ type: 'trending', payload: item, index });
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
                onClick={() => setActiveSheet({ type: 'insight', payload: insight, index })}
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
                    setActiveSheet({ type: 'insight', payload: insight, index });
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
                onClick={() => setActiveSheet({ type: 'story', payload: story, index })}
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
                    setActiveSheet({ type: 'story', payload: story, index });
                  }}
                >
                  {t('common.more')}
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>

      {activeSheet && (
        <DetailSheet
          open={Boolean(activeSheet)}
          title={sheetTitle}
          onClose={closeSheet}
          ctaLabel={sheetCta || undefined}
          closeLabel={t('discover.sheet.close')}
          to={sheetRoute}
        >
          {sheetContent}
        </DetailSheet>
      )}
    </div>
  );
};

export default Discover;
