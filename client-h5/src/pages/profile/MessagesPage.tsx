import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';
import './MessagesPage.css';

interface MessagesPageProps {
  onBack: () => void;
}

const MessagesPage: React.FC<MessagesPageProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'all' | 'system' | 'order' | 'promo'>('all');

  const messages = [
    { id: 1, type: 'system', title: t('profile.messages.msg1Title'), content: t('profile.messages.msg1Content'), time: '10:28', unread: true },
    { id: 2, type: 'order', title: t('profile.messages.msg2Title'), content: t('profile.messages.msg2Content'), time: '09:15', unread: true },
    { id: 3, type: 'promo', title: t('profile.messages.msg3Title'), content: t('profile.messages.msg3Content'), time: 'Yesterday', unread: false },
    { id: 4, type: 'system', title: t('profile.messages.msg4Title'), content: t('profile.messages.msg4Content'), time: 'Nov 12', unread: false },
  ];

  const filteredMessages = activeTab === 'all' ? messages : messages.filter(m => m.type === activeTab);

  return (
    <div className="messages-page-container">
      <Header onBack={onBack} title={t('profile.messages.title')} />
      
      <div className="messages-page-content">
        <div className="messages-tabs">
          <button className={`messages-tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
            {t('profile.messages.all')}
          </button>
          <button className={`messages-tab ${activeTab === 'system' ? 'active' : ''}`} onClick={() => setActiveTab('system')}>
            {t('profile.messages.system')}
          </button>
          <button className={`messages-tab ${activeTab === 'order' ? 'active' : ''}`} onClick={() => setActiveTab('order')}>
            {t('profile.messages.order')}
          </button>
          <button className={`messages-tab ${activeTab === 'promo' ? 'active' : ''}`} onClick={() => setActiveTab('promo')}>
            {t('profile.messages.promo')}
          </button>
        </div>

        <div className="messages-list">
          {filteredMessages.map((msg) => (
            <div key={msg.id} className={`message-card ${msg.unread ? 'unread' : ''}`}>
              {msg.unread && <div className="message-unread-dot"></div>}
              
              <div className="message-icon">
                {msg.type === 'system' && '🔔'}
                {msg.type === 'order' && '📦'}
                {msg.type === 'promo' && '🎁'}
              </div>
              
              <div className="message-content">
                <div className="message-header">
                  <span className="message-title">{msg.title}</span>
                  <span className="message-time">{msg.time}</span>
                </div>
                <div className="message-text">{msg.content}</div>
              </div>
            </div>
          ))}
        </div>

        {filteredMessages.length === 0 && (
          <div className="messages-empty">
            <div className="messages-empty-icon">📭</div>
            <div className="messages-empty-text">{t('profile.messages.empty')}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;

