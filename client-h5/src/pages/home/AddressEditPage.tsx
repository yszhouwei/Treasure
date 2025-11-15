import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './AddressEditPage.css';

export interface Address {
  id: number;
  name: string;
  phone: string;
  address: string;
  isDefault?: boolean;
}

interface AddressEditPageProps {
  address?: Address | null; // null表示新增，有值表示编辑
  onSave: (address: Omit<Address, 'id'>) => void;
  onCancel: () => void;
}

const AddressEditPage: React.FC<AddressEditPageProps> = ({ address, onSave, onCancel }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: address?.name || '',
    phone: address?.phone || '',
    address: address?.address || '',
    isDefault: address?.isDefault || false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('addressEdit.nameRequired') || '请输入收货人姓名';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = t('addressEdit.phoneRequired') || '请输入手机号码';
    } else if (!/^1[3-9]\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = t('addressEdit.phoneInvalid') || '请输入正确的手机号码';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = t('addressEdit.addressRequired') || '请输入详细地址';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        name: formData.name.trim(),
        phone: formData.phone.trim().replace(/\s/g, ''),
        address: formData.address.trim(),
        isDefault: formData.isDefault
      });
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 11);
    setFormData({ ...formData, phone: value });
    if (errors.phone) {
      setErrors({ ...errors, phone: '' });
    }
  };

  return (
    <div className="address-edit-page">
      <div className="address-edit-header">
        <button className="back-btn" onClick={onCancel} aria-label="返回">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1>{address ? (t('addressEdit.editTitle') || '编辑地址') : (t('addressEdit.addTitle') || '添加地址')}</h1>
        <div style={{ width: 40 }} />
      </div>

      <form className="address-edit-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">
            {t('addressEdit.recipientName') || '收货人姓名'} <span className="required">*</span>
          </label>
          <input
            type="text"
            className={`form-input ${errors.name ? 'error' : ''}`}
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              if (errors.name) {
                setErrors({ ...errors, name: '' });
              }
            }}
            placeholder={t('addressEdit.namePlaceholder') || '请输入收货人姓名'}
            maxLength={20}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">
            {t('addressEdit.phone') || '手机号码'} <span className="required">*</span>
          </label>
          <input
            type="tel"
            className={`form-input ${errors.phone ? 'error' : ''}`}
            value={formData.phone}
            onChange={handlePhoneChange}
            placeholder={t('addressEdit.phonePlaceholder') || '请输入手机号码'}
            maxLength={11}
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">
            {t('addressEdit.detailAddress') || '详细地址'} <span className="required">*</span>
          </label>
          <textarea
            className={`form-textarea ${errors.address ? 'error' : ''}`}
            value={formData.address}
            onChange={(e) => {
              setFormData({ ...formData, address: e.target.value });
              if (errors.address) {
                setErrors({ ...errors, address: '' });
              }
            }}
            placeholder={t('addressEdit.addressPlaceholder') || '请输入详细地址，如街道、门牌号等'}
            rows={4}
            maxLength={200}
          />
          {errors.address && <span className="error-message">{errors.address}</span>}
        </div>

        <div className="form-group">
          <label className="form-checkbox">
            <input
              type="checkbox"
              checked={formData.isDefault}
              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
            />
            <span>{t('addressEdit.setAsDefault') || '设为默认地址'}</span>
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onCancel}>
            {t('common.cancel') || '取消'}
          </button>
          <button type="submit" className="save-btn">
            {t('common.save') || '保存'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressEditPage;

