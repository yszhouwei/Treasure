import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';
import './TeamSettingsPage.css';

const TeamSettingsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState({
    teamName: '我的团队',
    description: '这是一个优秀的团队',
    region: '中国',
    autoApprove: true,
    notificationEnabled: true,
  });

  const handleSave = () => {
    // 保存设置逻辑
    alert(t('group.management.settings.saveSuccess') || '设置已保存');
  };

  return (
    <div className="team-settings-container">
      <Header onBack={onBack} title={t('group.management.settings.title') || '团队设置'} />
      <div className="team-settings-content">
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
          <button className="save-btn" onClick={handleSave}>
            {t('common.save') || '保存'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamSettingsPage;

