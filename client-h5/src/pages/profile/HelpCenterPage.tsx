import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';
import './HelpCenterPage.css';

interface HelpCenterPageProps {
  onBack: () => void;
}

const HelpCenterPage: React.FC<HelpCenterPageProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const categories = [
    { id: 1, icon: '🛍️', title: t('profile.helpCenter.cat1'), count: '12' },
    { id: 2, icon: '💰', title: t('profile.helpCenter.cat2'), count: '8' },
    { id: 3, icon: '👥', title: t('profile.helpCenter.cat3'), count: '6' },
    { id: 4, icon: '⚙️', title: t('profile.helpCenter.cat4'), count: '10' },
  ];

  const faqs = [
    { id: 1, question: t('profile.helpCenter.faq1Q'), answer: t('profile.helpCenter.faq1A') },
    { id: 2, question: t('profile.helpCenter.faq2Q'), answer: t('profile.helpCenter.faq2A') },
    { id: 3, question: t('profile.helpCenter.faq3Q'), answer: t('profile.helpCenter.faq3A') },
    { id: 4, question: t('profile.helpCenter.faq4Q'), answer: t('profile.helpCenter.faq4A') },
  ];

  return (
    <div className="help-center-page-container">
      <Header onBack={onBack} title={t('profile.helpCenter.title')} />
      
      <div className="help-center-page-content">
        <div className="help-center-search">
          <input
            type="text"
            className="help-center-search-input"
            placeholder={t('profile.helpCenter.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="help-center-search-icon">🔍</span>
        </div>

        <section className="help-center-categories">
          <h2 className="help-center-section-title">{t('profile.helpCenter.categoriesTitle')}</h2>
          
          <div className="help-center-category-grid">
            {categories.map((cat) => (
              <button key={cat.id} className="help-center-category-btn">
                <span className="help-center-category-icon">{cat.icon}</span>
                <span className="help-center-category-title">{cat.title}</span>
                <span className="help-center-category-count">{cat.count}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="help-center-faq">
          <h2 className="help-center-section-title">{t('profile.helpCenter.faqTitle')}</h2>
          
          <div className="help-center-faq-list">
            {faqs.map((faq) => (
              <div key={faq.id} className="help-center-faq-item">
                <button
                  className="help-center-faq-question"
                  onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                >
                  <span className="help-center-faq-q-text">{faq.question}</span>
                  <span className={`help-center-faq-arrow ${expandedId === faq.id ? 'expanded' : ''}`}>›</span>
                </button>
                {expandedId === faq.id && (
                  <div className="help-center-faq-answer">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="help-center-contact">
          <div className="help-center-contact-content">
            <div className="help-center-contact-icon">💬</div>
            <div className="help-center-contact-text">
              <div className="help-center-contact-title">{t('profile.helpCenter.contactTitle')}</div>
              <div className="help-center-contact-desc">{t('profile.helpCenter.contactDesc')}</div>
            </div>
            <button className="help-center-contact-btn">{t('profile.helpCenter.contactBtn')}</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HelpCenterPage;

