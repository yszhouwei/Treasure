import React, { useState, useRef, useEffect } from 'react';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [fetching, setFetching] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 构建完整的头像URL
  const getAvatarUrl = (url: string | null | undefined) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    // 确保URL以 / 开头
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}${path}`;
  };

  // 初始化表单数据
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // 加载用户数据 - 只在组件挂载时执行一次
  useEffect(() => {
    let isMounted = true;
    
    const loadUserData = async () => {
      setFetching(true);
      try {
        // 使用 UsersService 直接获取最新数据
        const userData = await UsersService.getProfile();
        console.log('从后端获取的用户数据:', userData);
        
        if (!isMounted) return;
        
        // 更新表单数据
        setName(userData.nickname || userData.username || '');
        setEmail(userData.email || '');
        setPhone(userData.phone || '');
        setBio(userData.bio || '');
        
        // 转换性别：1=male, 2=female, 0=other
        if (userData.gender !== undefined && userData.gender !== null) {
          const genderValue = typeof userData.gender === 'string' ? parseInt(userData.gender, 10) : userData.gender;
          if (!isNaN(genderValue as number)) {
            const genderMap: Record<number, string> = {
              1: 'male',
              2: 'female',
              0: 'other',
            };
            setGender(genderMap[genderValue as number] || '');
          }
        }
        
        // 更新头像
        if (userData.avatar) {
          const currentAvatar = getAvatarUrl(userData.avatar);
          console.log('原始头像路径:', userData.avatar);
          console.log('构建后的头像URL:', currentAvatar);
          setAvatarPreview(currentAvatar);
          
          // 测试图片是否可以加载
          const img = new Image();
          img.onload = () => {
            console.log('头像图片加载成功:', currentAvatar);
          };
          img.onerror = () => {
            console.error('头像图片加载失败:', currentAvatar);
          };
          img.src = currentAvatar;
        } else {
          console.log('用户没有头像');
          setAvatarPreview(null);
        }
        
        // 同时刷新 AuthContext 中的用户数据（但不等待，避免循环）
        if (refreshUser) {
          refreshUser().catch(err => console.error('刷新用户数据失败:', err));
        }
      } catch (error) {
        console.error('加载用户数据失败:', error);
        if (!isMounted) return;
        
        // 如果获取失败，使用已有的用户数据
        const latestUser = authUser || user;
        if (latestUser) {
          setName(latestUser.name || '');
          setEmail(latestUser.email || '');
          setPhone(latestUser.phone || '');
          const currentAvatar = getAvatarUrl(latestUser.avatar);
          setAvatarPreview(currentAvatar);
        }
      } finally {
        if (isMounted) {
          setFetching(false);
        }
      }
    };

    loadUserData();
    
    return () => {
      isMounted = false;
    };
  }, []); // 只在组件挂载时执行一次

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
      
      // 后端已经保存了相对路径，这里保存相对路径用于后续保存操作
      // 但预览需要完整URL
      const avatarUrl = result.url.startsWith('http') 
        ? result.url 
        : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}${result.url}`;
      
      // 更新预览（使用完整URL）
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
      // 如果avatarPreview是完整URL，需要转换为相对路径
      let avatarPath = avatarPreview;
      if (avatarPreview && avatarPreview.startsWith('http')) {
        // 提取相对路径
        const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
        if (avatarPreview.startsWith(apiBase)) {
          avatarPath = avatarPreview.replace(apiBase, '');
        }
      }
      
      const updateData: any = {};
      if (name) updateData.nickname = name;
      if (email) updateData.email = email;
      if (phone) updateData.phone = phone;
      if (bio) updateData.bio = bio;
      if (gender) updateData.gender = gender;
      if (avatarPath) updateData.avatar = avatarPath;

      console.log('保存用户信息:', updateData);
      const updatedUser = await UsersService.updateProfile(updateData);
      console.log('保存成功，返回的用户信息:', updatedUser);

      // 刷新用户信息
      if (refreshUser) {
        await refreshUser();
        // 等待一下，确保用户信息已更新
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      alert(t('profile.profileEdit.saveSuccess') || '保存成功');
      onBack();
    } catch (err: any) {
      console.error('保存用户信息失败:', err);
      console.error('错误详情:', JSON.stringify(err, null, 2));
      
      // 处理验证错误消息（可能是数组格式）
      let errorMessage = '保存失败，请重试';
      
      // 尝试从不同位置获取错误消息
      if (err.data?.message) {
        if (Array.isArray(err.data.message)) {
          // 如果是数组，提取所有错误消息
          errorMessage = err.data.message.map((msg: any) => {
            if (typeof msg === 'string') return msg;
            if (msg?.constraints) {
              return Object.values(msg.constraints).join(', ');
            }
            return JSON.stringify(msg);
          }).join(', ');
        } else if (typeof err.data.message === 'string') {
          errorMessage = err.data.message;
        } else if (err.data.message?.message) {
          errorMessage = err.data.message.message;
        }
      } else if (err.message) {
        if (Array.isArray(err.message)) {
          errorMessage = err.message.join(', ');
        } else {
          errorMessage = err.message;
        }
      }
      
      console.error('最终错误消息:', errorMessage);
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
              className={`profile-edit-avatar ${uploadingAvatar ? 'uploading' : ''} ${avatarPreview ? 'has-avatar' : ''}`}
              onClick={handleAvatarClick}
              style={avatarPreview ? {
                backgroundImage: `url("${avatarPreview}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              } : {}}
            >
              {!avatarPreview && (name?.[0]?.toUpperCase() || 'U')}
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
                placeholder={t('profile.profileEdit.phonePlaceholder') || '输入你的手机号'}
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

