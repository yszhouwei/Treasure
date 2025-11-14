import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';
import './UpcomingDetail.css';

interface GroupItem {
  id: string;
  title: string;
  status: string;
  progress: number;
  participants: string;
  remaining: string;
}

interface UpcomingDetailProps {
  item: GroupItem;
  onBack: () => void;
}

const UpcomingDetail: React.FC<UpcomingDetailProps> = ({ item, onBack }) => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Mock date options
  const dateOptions = [
    t('group.upcomingDetail.date1'),
    t('group.upcomingDetail.date2'),
    t('group.upcomingDetail.date3'),
    t('group.upcomingDetail.date4'),
  ];

  const timeOptions = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'
  ];

  return (
    <div className="upcoming-detail-container">
      <Header onBack={onBack} title={t('group.sheet.upcoming.title')} />
      <div className="upcoming-detail-content">
        {/* Group Info Card */}
        <section className="upcoming-info-card">
          <div className="upcoming-header">
            <div className="upcoming-icon">📅</div>
            <div>
              <h1>{item.title}</h1>
              <span className="upcoming-badge">{item.status}</span>
            </div>
          </div>
          <div className="upcoming-meta">
            <div className="meta-item">
              <span className="meta-label">{t('group.upcomingDetail.idLabel')}</span>
              <strong>{item.id}</strong>
            </div>
            <div className="meta-item">
              <span className="meta-label">{t('group.upcomingDetail.participantsLabel')}</span>
              <strong>{item.participants}</strong>
            </div>
            <div className="meta-item">
              <span className="meta-label">{t('group.upcomingDetail.remainingLabel')}</span>
              <strong>{item.remaining}</strong>
            </div>
          </div>
        </section>

        {/* Description */}
        <section className="upcoming-section">
          <h2>{t('group.upcomingDetail.descTitle')}</h2>
          <div className="upcoming-desc-card">
            <p>{t('group.sheet.upcoming.desc')}</p>
          </div>
        </section>

        {/* Schedule Selection */}
        <section className="upcoming-section">
          <h2>{t('group.upcomingDetail.scheduleTitle')}</h2>
          
          {/* Date Selection */}
          <div className="schedule-group">
            <label>{t('group.upcomingDetail.dateLabel')}</label>
            <div className="option-grid">
              {dateOptions.map((date) => (
                <button
                  key={date}
                  className={`option-btn ${selectedDate === date ? 'selected' : ''}`}
                  onClick={() => setSelectedDate(date)}
                >
                  {date}
                </button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          <div className="schedule-group">
            <label>{t('group.upcomingDetail.timeLabel')}</label>
            <div className="option-grid">
              {timeOptions.map((time) => (
                <button
                  key={time}
                  className={`option-btn ${selectedTime === time ? 'selected' : ''}`}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Tips */}
        <section className="upcoming-section">
          <div className="upcoming-tips">
            <div className="tip-icon">💡</div>
            <div>
              <h3>{t('group.upcomingDetail.tipsTitle')}</h3>
              <ul>
                <li>{t('group.upcomingDetail.tip1')}</li>
                <li>{t('group.upcomingDetail.tip2')}</li>
                <li>{t('group.upcomingDetail.tip3')}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Action Button */}
        <div className="upcoming-actions">
          <button 
            className="upcoming-primary-btn"
            disabled={!selectedDate || !selectedTime}
          >
            {t('group.sheet.upcoming.cta')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpcomingDetail;

