import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';
import { TeamsService } from '../../services/teams.service';
import type { TeamSettings } from '../../services/teams.service';
import './TeamSettingsPage.css';

const TeamSettingsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<TeamSettings>({
    teamName: '',
    description: '',
    region: '',
    autoApprove: true,
    notificationEnabled: true,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 加载团队设置
  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await TeamsService.getTeamSettings();
        setSettings(data);
      } catch (err: any) {
        console.error('加载团队设置失败:', err);
        // 如果获取失败，可能是首次设置或用户不是团队长
        if (err.status === 403) {
          setError(err.message || '您不是团队长，无法访问团队设置');
        } else if (err.status !== 404) {
          setError(err.message || '加载设置失败');
        }
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      // 验证必填字段
      if (!settings.teamName.trim()) {
        setError(t('group.management.settings.teamNameRequired') || '团队名称不能为空');
        setSaving(false);
        return;
      }

      console.log('准备保存团队设置:', settings);
      const result = await TeamsService.updateTeamSettings(settings);
      console.log('保存成功，返回结果:', result);
      
      // 更新本地状态为服务器返回的数据
      if (result) {
        setSettings(result);
      }
      
      setSuccessMessage(t('group.management.settings.saveSuccess') || '设置已保存');
      
      // 3秒后清除成功消息
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: any) {
      console.error('保存团队设置失败:', err);
      console.error('错误详情:', {
        message: err.message,
        status: err.status,
        data: err.data,
        stack: err.stack
      });
      
      // 提供更详细的错误信息
      let errorMessage = '保存设置失败，请重试';
      if (err.status === 401) {
        errorMessage = '未授权，请重新登录';
      } else if (err.status === 403) {
        errorMessage = err.message || '您不是团队长，无法修改团队设置';
      } else if (err.status === 404) {
        errorMessage = '团队设置接口不存在，请联系管理员';
      } else if (err.status === 400) {
        // 验证错误
        errorMessage = err.message || '输入数据格式不正确，请检查后重试';
      } else if (err.status === 500) {
        errorMessage = '服务器错误，请稍后重试';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="team-settings-container">
      <Header onBack={onBack} title={t('group.management.settings.title') || '团队设置'} />
      <div className="team-settings-content">
        {/* 错误提示 */}
        {error && (
          <div className="error-message" style={{ 
            padding: '12px', 
            marginBottom: '16px', 
            backgroundColor: '#fff2f0', 
            border: '1px solid #ffccc7', 
            borderRadius: '4px', 
            color: '#ff4d4f' 
          }}>
            {error}
          </div>
        )}

        {/* 成功提示 */}
        {successMessage && (
          <div className="success-message" style={{ 
            padding: '12px', 
            marginBottom: '16px', 
            backgroundColor: '#f6ffed', 
            border: '1px solid #b7eb8f', 
            borderRadius: '4px', 
            color: '#52c41a' 
          }}>
            {successMessage}
          </div>
        )}

        {/* 加载状态 */}
        {loading && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#8c8c8c' }}>
            {t('common.loading') || '加载中...'}
          </div>
        )}

        {!loading && (
          <>
            <div className="settings-section">
              <h2>{t('group.management.settings.basicInfo') || '基本信息'}</h2>
              <div className="setting-item">
                <label>{t('group.management.settings.teamName') || '团队名称'}</label>
                <input
                  type="text"
                  value={settings.teamName}
                  onChange={(e) => setSettings({ ...settings, teamName: e.target.value })}
                  placeholder={t('group.management.settings.teamNamePlaceholder') || '请输入团队名称'}
                />
              </div>
              <div className="setting-item">
                <label>{t('group.management.settings.description') || '团队描述'}</label>
                <textarea
                  value={settings.description}
                  onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                  placeholder={t('group.management.settings.descriptionPlaceholder') || '请输入团队描述'}
                  rows={4}
                />
              </div>
              <div className="setting-item">
                <label>{t('group.management.settings.region') || '覆盖区域'}</label>
                <input
                  type="text"
                  value={settings.region}
                  onChange={(e) => setSettings({ ...settings, region: e.target.value })}
                  placeholder={t('group.management.settings.regionPlaceholder') || '请输入覆盖区域'}
                />
              </div>
            </div>

            <div className="settings-section">
              <h2>{t('group.management.settings.preferences') || '偏好设置'}</h2>
              <div className="setting-item switch-item">
                <div className="switch-label">
                  <span>{t('group.management.settings.autoApprove') || '自动审核成员'}</span>
                  <span className="switch-desc">{t('group.management.settings.autoApproveDesc') || '开启后，新成员加入将自动通过审核'}</span>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings.autoApprove}
                    onChange={(e) => setSettings({ ...settings, autoApprove: e.target.checked })}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="setting-item switch-item">
                <div className="switch-label">
                  <span>{t('group.management.settings.notification') || '消息通知'}</span>
                  <span className="switch-desc">{t('group.management.settings.notificationDesc') || '接收团队相关消息推送'}</span>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings.notificationEnabled}
                    onChange={(e) => setSettings({ ...settings, notificationEnabled: e.target.checked })}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            <div className="settings-actions">
              <button 
                className="save-btn" 
                onClick={handleSave}
                disabled={saving}
                style={{ opacity: saving ? 0.6 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}
              >
                {saving ? (t('common.saving') || '保存中...') : (t('common.save') || '保存')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TeamSettingsPage;

