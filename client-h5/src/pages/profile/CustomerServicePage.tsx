import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';
import './CustomerServicePage.css';

interface CustomerServicePageProps {
  onBack: () => void;
}

const CustomerServicePage: React.FC<CustomerServicePageProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');

  const quickReplies = [
    t('profile.customerService.quick1'),
    t('profile.customerService.quick2'),
    t('profile.customerService.quick3'),
    t('profile.customerService.quick4'),
  ];

  const chatMessages = [
    { id: 1, type: 'received', text: t('profile.customerService.welcome'), time: '10:28' },
    { id: 2, type: 'sent', text: t('profile.customerService.userMsg1'), time: '10:29' },
    { id: 3, type: 'received', text: t('profile.customerService.response1'), time: '10:30' },
  ];

  return (
    <div className="customer-service-page-container">
      <Header onBack={onBack} title={t('profile.customerService.title')} />
      
      <div className="customer-service-page-content">
        <div className="customer-service-status">
          <div className="customer-service-avatar">👩‍💼</div>
          <div className="customer-service-info">
            <div className="customer-service-name">{t('profile.customerService.agentName')}</div>
            <div className="customer-service-online">● {t('profile.customerService.online')}</div>
          </div>
        </div>

        <div className="customer-service-chat">
          {chatMessages.map((msg) => (
            <div key={msg.id} className={`chat-message ${msg.type}`}>
              <div className="chat-bubble">
                <div className="chat-text">{msg.text}</div>
                <div className="chat-time">{msg.time}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="customer-service-quick">
          <div className="quick-replies-label">{t('profile.customerService.quickReplies')}</div>
          <div className="quick-replies-list">
            {quickReplies.map((reply, index) => (
              <button key={index} className="quick-reply-btn" onClick={() => setMessage(reply)}>
                {reply}
              </button>
            ))}
          </div>
        </div>

        <div className="customer-service-input-wrapper">
          <input
            type="text"
            className="customer-service-input"
            placeholder={t('profile.customerService.inputPlaceholder')}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="customer-service-send-btn">
            {t('profile.customerService.send')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerServicePage;

