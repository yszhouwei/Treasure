import React from 'react';
import { useTranslation } from 'react-i18next';
import './StoryDetail.css';

interface StoryDetailProps {
  story: {
    author: string;
    title: string;
    summary: string;
  };
  onBack: () => void;
  onComment?: () => void;
}

const StoryDetail: React.FC<StoryDetailProps> = ({ story, onBack, onComment }) => {
  const { t } = useTranslation();

  return (
    <div className="story-detail-page">
      {/* 头部 */}
      <div className="story-detail-header">
        <button className="back-btn-white" onClick={onBack} aria-label="返回">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="story-hero">
          <div className="story-badge">📖 发现者故事</div>
          <h1>{story.title}</h1>
          <div className="story-author-info">
            <div className="story-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div className="story-author-meta">
              <h3>{story.author}</h3>
              <p>发布于 2025-11-10 · 阅读 1.2K</p>
            </div>
          </div>
        </div>
      </div>

      {/* 内容 */}
      <div className="story-detail-content">
        {/* 故事摘要 */}
        <section className="story-card">
          <div className="story-summary">
            <p className="story-lead">{story.summary}</p>
          </div>
        </section>

        {/* 故事正文 */}
        <section className="story-card">
          <h2>故事经过</h2>
          <div className="story-body">
            <h3>一、起因：偶然的相遇</h3>
            <p>那天阳光正好，我漫步在威尼斯的小巷中。转过一个拐角，眼前突然出现了一家不起眼的小店，门口挂着精致的玻璃装饰。好奇心驱使我走了进去，没想到这一步，改变了我对艺术品的所有认知。</p>

            <div className="story-quote">
              "真正的宝藏，往往藏在最不起眼的角落。"
            </div>

            <h3>二、发现：玻璃岛的秘密</h3>
            <p>店主是一位慈祥的老人，得知我对琉璃感兴趣后，他热情地邀请我参观他在玻璃岛（Murano）的工坊。第二天一早，我乘坐水上巴士来到了这个传奇的小岛。</p>

            <p>工坊里，匠人们正在用千年传承的技艺，将普通的玻璃原料转化为艺术品。炽热的熔炉、飞舞的火焰、匠人娴熟的手法，每一个细节都让我震撼。</p>

            <div className="story-images">
              <div className="story-image-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                <span>工坊全景</span>
              </div>
              <div className="story-image-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                <span>匠人制作中</span>
              </div>
            </div>

            <h3>三、收获：独一无二的宝箱</h3>
            <p>在工坊的一个角落，我看到了它——一个手工制作的琉璃宝箱。蓝色的底色如同大海，金色的纹路像是阳光洒在水面上的波光。老匠人告诉我，这是他花了一个月时间完成的作品，世界上只此一件。</p>

            <p>那一刻，我毫不犹豫地决定将它带回家。不仅因为它的美，更因为它背后承载的匠心和文化。</p>

            <div className="story-highlight">
              <div className="highlight-icon">✨</div>
              <div className="highlight-content">
                <h4>寻宝心得</h4>
                <p>真正的寻宝，不是寻找昂贵的物品，而是发现那些承载着故事、文化和情感的独特宝藏。每一件藏品，都应该有它的故事。</p>
              </div>
            </div>
          </div>
        </section>

        {/* 作者介绍 */}
        <section className="story-card">
          <h2>关于作者</h2>
          <div className="author-profile">
            <div className="author-avatar-large">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h3>{story.author}</h3>
            <p className="author-bio">资深艺术品收藏家，专注于欧洲手工艺品收藏，已在全球 15 个国家寻宝。热爱分享寻宝经验，帮助更多人发现生活中的美好。</p>
            <div className="author-stats">
              <div className="stat-item">
                <span className="stat-value">28</span>
                <span className="stat-label">发表故事</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">5.6K</span>
                <span className="stat-label">获得点赞</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">1.2K</span>
                <span className="stat-label">关注者</span>
              </div>
            </div>
            <button className="follow-btn">+ 关注作者</button>
          </div>
        </section>

        {/* 相关故事 */}
        <section className="story-card">
          <h2>相关故事</h2>
          <div className="related-stories">
            <div className="related-story-item">
              <div className="related-story-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
              </div>
              <div className="related-story-content">
                <h4>巴黎跳蚤市场的古董发现</h4>
                <p>Lena · 上海 · 阅读 892</p>
              </div>
            </div>

            <div className="related-story-item">
              <div className="related-story-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
              </div>
              <div className="related-story-content">
                <h4>京都匠人的银器传承</h4>
                <p>Lena · 上海 · 阅读 1.1K</p>
              </div>
            </div>
          </div>
        </section>

        {/* 评论区 */}
        <section className="story-card">
          <h2>精彩评论 (23)</h2>
          <div className="comments-list">
            <div className="comment-item">
              <div className="comment-avatar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div className="comment-content">
                <h4>张三 · 北京</h4>
                <p>太棒了！看完这个故事，我也想去威尼斯寻宝了。那个琉璃宝箱一定超级美！</p>
                <div className="comment-meta">
                  <span>2天前</span>
                  <button className="like-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                    </svg>
                    12
                  </button>
                </div>
              </div>
            </div>

            <div className="comment-item">
              <div className="comment-avatar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div className="comment-content">
                <h4>李四 · 上海</h4>
                <p>作为一个玻璃艺术爱好者，看到这篇文章真的很感动。期待楼主分享更多寻宝故事！</p>
                <div className="comment-meta">
                  <span>3天前</span>
                  <button className="like-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                    </svg>
                    8
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 底部操作栏 */}
      <div className="story-detail-footer">
        <button className="action-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
          </svg>
          <span>256</span>
        </button>
        <button className="action-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
          <span>收藏</span>
        </button>
        <button 
          className="comment-btn"
          onClick={() => {
            if (onComment) onComment();
            else alert(t('discover.sheet.story.cta'));
          }}
        >
          {t('discover.sheet.story.cta')}
        </button>
      </div>
    </div>
  );
};

export default StoryDetail;

