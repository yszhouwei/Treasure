import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';
import './AddressPage.css';

interface AddressPageProps {
  onBack: () => void;
}

const AddressPage: React.FC<AddressPageProps> = ({ onBack }) => {
  const { t } = useTranslation();

  const addresses = [
    { id: 1, name: 'Charlotte', phone: '138****8888', address: t('profile.address.address1'), isDefault: true },
    { id: 2, name: 'John', phone: '139****9999', address: t('profile.address.address2'), isDefault: false },
    { id: 3, name: 'Sarah', phone: '136****6666', address: t('profile.address.address3'), isDefault: false },
  ];

  return (
    <div className="address-page-container">
      <Header onBack={onBack} title={t('profile.address.title')} />
      
      <div className="address-page-content">
        <div className="address-list">
          {addresses.map((addr) => (
            <div key={addr.id} className="address-card">
              {addr.isDefault && <div className="address-default-badge">{t('profile.address.default')}</div>}
              
              <div className="address-info">
                <div className="address-header">
                  <span className="address-name">{addr.name}</span>
                  <span className="address-phone">{addr.phone}</span>
                </div>
                <div className="address-detail">{addr.address}</div>
              </div>
              
              <div className="address-actions">
                <button className="address-edit-btn">{t('profile.address.edit')}</button>
                {!addr.isDefault && (
                  <button className="address-default-btn">{t('profile.address.setDefault')}</button>
                )}
                {!addr.isDefault && (
                  <button className="address-delete-btn">{t('profile.address.delete')}</button>
                )}
              </div>
            </div>
          ))}
        </div>

        <button className="address-add-btn">
          <span>➕</span>
          {t('profile.address.addNew')}
        </button>
      </div>
    </div>
  );
};

export default AddressPage;

