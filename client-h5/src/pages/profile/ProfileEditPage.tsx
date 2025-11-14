import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';
import './ProfileEditPage.css';

interface User {
  name?: string;
  email?: string;
}

interface ProfileEditPageProps {
  onBack: () => void;
  user: User | null | undefined;
}

const ProfileEditPage: React.FC<ProfileEditPageProps> = ({ onBack, user }) => {
  const { t } = useTranslation();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('138****8888');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState('');

  const handleSave = () => {
    alert(t('profile.profileEdit.saveSuccess'));
  };

  return (
    <div className="profile-edit-page-container">
      <Header onBack={onBack} title={t('profile.profileEdit.title')} />
      
      <div className="profile-edit-page-content">
        <section className="profile-edit-avatar-section">
          <div className="profile-edit-avatar-wrapper">
            <div className="profile-edit-avatar">{name?.[0] || 'U'}</div>
            <button className="profile-edit-avatar-btn">{t('profile.profileEdit.changeAvatar')}</button>
          </div>
        </section>

        <section className="profile-edit-form-section">
          <div className="profile-edit-form-group">
            <label htmlFor="name" className="profile-edit-label">{t('profile.profileEdit.name')}</label>
            <input
              id="name"
              type="text"
              className="profile-edit-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('profile.profileEdit.namePlaceholder')}
            />
          </div>

          <div className="profile-edit-form-group">
            <label htmlFor="email" className="profile-edit-label">{t('profile.profileEdit.email')}</label>
            <input
              id="email"
              type="email"
              className="profile-edit-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('profile.profileEdit.emailPlaceholder')}
            />
          </div>

          <div className="profile-edit-form-group">
            <label htmlFor="phone" className="profile-edit-label">{t('profile.profileEdit.phone')}</label>
            <div className="profile-edit-input-with-btn">
              <input
                id="phone"
                type="tel"
                className="profile-edit-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled
              />
              <button className="profile-edit-verify-btn">{t('profile.profileEdit.verify')}</button>
            </div>
          </div>

          <div className="profile-edit-form-group">
            <label className="profile-edit-label">{t('profile.profileEdit.gender')}</label>
            <div className="profile-edit-gender-btns">
              <button
                className={`profile-edit-gender-btn ${gender === 'male' ? 'active' : ''}`}
                onClick={() => setGender('male')}
              >
                👨 {t('profile.profileEdit.male')}
              </button>
              <button
                className={`profile-edit-gender-btn ${gender === 'female' ? 'active' : ''}`}
                onClick={() => setGender('female')}
              >
                👩 {t('profile.profileEdit.female')}
              </button>
              <button
                className={`profile-edit-gender-btn ${gender === 'other' ? 'active' : ''}`}
                onClick={() => setGender('other')}
              >
                🧑 {t('profile.profileEdit.other')}
              </button>
            </div>
          </div>

          <div className="profile-edit-form-group">
            <label htmlFor="bio" className="profile-edit-label">{t('profile.profileEdit.bio')}</label>
            <textarea
              id="bio"
              className="profile-edit-textarea"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={t('profile.profileEdit.bioPlaceholder')}
              rows={4}
            />
            <div className="profile-edit-char-count">{bio.length} / 200</div>
          </div>
        </section>

        <button className="profile-edit-save-btn" onClick={handleSave}>
          {t('profile.profileEdit.save')}
        </button>
      </div>
    </div>
  );
};

export default ProfileEditPage;

