import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';
import { UsersService } from '../../services/users.service';
import { useAuth } from '../../context/AuthContext';
import './ProfileEditPage.css';

interface User {
  name?: string;
  email?: string;
  avatar?: string;
}

interface ProfileEditPageProps {
  onBack: () => void;
  user: User | null | undefined;
}

const ProfileEditPage: React.FC<ProfileEditPageProps> = ({ onBack, user }) => {
  const { t } = useTranslation();
  const { refreshUser, user: authUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 构建完整的头像URL
  const getAvatarUrl = (url: string | null | undefined) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}${url}`;
  };

  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    getAvatarUrl(user?.avatar || authUser?.avatar)
  );

  // 处理头像选择
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // 处理头像文件选择
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      setError(t('profile.profileEdit.avatarTypeError') || '请选择图片文件');
      return;
    }

    // 验证文件大小（最大5MB）
    if (file.size > 5 * 1024 * 1024) {
      setError(t('profile.profileEdit.avatarSizeError') || '图片大小不能超过5MB');
      return;
    }

    // 预览图片
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // 上传头像
    setUploadingAvatar(true);
    setError(null);

    try {
      const result = await UsersService.uploadAvatar(file);
      
      // 构建完整的头像URL
      const avatarUrl = result.url.startsWith('http') 
        ? result.url 
        : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}${result.url}`;
      
      // 更新预览
      setAvatarPreview(avatarUrl);

      // 刷新用户信息（头像URL已经在后端更新）
      if (refreshUser) {
        await refreshUser();
      }

      // 清除文件输入
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      console.error('上传头像失败:', err);
      const errorMessage = err.message || err.data?.message || err.data?.error || '上传头像失败，请重试';
      setError(errorMessage);
      alert(errorMessage); // 显示错误提示
      // 恢复原来的头像
      setAvatarPreview(getAvatarUrl(user?.avatar || authUser?.avatar));
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await UsersService.updateProfile({
        nickname: name,
        email: email || undefined,
        phone: phone || undefined,
        bio: bio || undefined,
        gender: gender || undefined,
        avatar: avatarPreview || undefined,
      });

      // 刷新用户信息
      if (refreshUser) {
        await refreshUser();
      }

      alert(t('profile.profileEdit.saveSuccess') || '保存成功');
      onBack();
    } catch (err: any) {
      console.error('保存用户信息失败:', err);
      // 处理验证错误消息（可能是数组格式）
      let errorMessage = '保存失败，请重试';
      if (err.data?.message) {
        if (Array.isArray(err.data.message)) {
          errorMessage = err.data.message.join(', ');
        } else {
          errorMessage = err.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      alert(errorMessage); // 显示错误提示
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-edit-page-container">
      <Header onBack={onBack} title={t('profile.profileEdit.title')} />
      
      <div className="profile-edit-page-content">
        <section className="profile-edit-avatar-section">
          <div className="profile-edit-avatar-wrapper">
            <div 
              className={`profile-edit-avatar ${uploadingAvatar ? 'uploading' : ''}`}
              onClick={handleAvatarClick}
              style={avatarPreview ? {
                backgroundImage: `url(${avatarPreview})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              } : {}}
            >
              {!avatarPreview && (name?.[0] || 'U')}
              {uploadingAvatar && (
                <div className="avatar-uploading-overlay">
                  <div className="avatar-uploading-spinner"></div>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: 'none' }}
            />
            <button 
              className="profile-edit-avatar-btn"
              onClick={handleAvatarClick}
              disabled={uploadingAvatar}
            >
              {uploadingAvatar 
                ? (t('profile.profileEdit.uploading') || '上传中...') 
                : t('profile.profileEdit.changeAvatar')}
            </button>
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

        {/* 错误提示 */}
        {error && (
          <div style={{ 
            padding: '12px 16px', 
            margin: '16px 0', 
            background: '#fff2f0', 
            border: '1px solid #ffccc7', 
            borderRadius: '8px', 
            color: '#ff4d4f',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <button 
          className="profile-edit-save-btn" 
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? (t('common.loading') || '保存中...') : t('profile.profileEdit.save')}
        </button>
      </div>
    </div>
  );
};

export default ProfileEditPage;

