import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { OrdersService, type CreateOrderDto } from '../../services/orders.service';
import { useAuth } from '../../context/AuthContext';
import AddressEditPage, { type Address } from './AddressEditPage';
import './JoinGroupPage.css';

interface JoinGroupPageProps {
  product: {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    groupSize: number;
    currentMembers: number;
    timeLeft: string;
    imageUrl?: string;
  };
  onBack: () => void;
  onConfirm: (order: any) => void;
}

const JoinGroupPage: React.FC<JoinGroupPageProps> = ({ product, onBack, onConfirm }) => {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddressEdit, setShowAddressEdit] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // 从localStorage加载地址
  useEffect(() => {
    if (isAuthenticated && user) {
      const savedAddresses = localStorage.getItem(`addresses_${user.id}`);
      if (savedAddresses) {
        try {
          const parsed = JSON.parse(savedAddresses);
          setAddresses(parsed);
          // 设置默认地址为选中
          const defaultAddr = parsed.find((addr: Address) => addr.isDefault);
          if (defaultAddr) {
            setSelectedAddress(defaultAddr.id);
          } else if (parsed.length > 0) {
            setSelectedAddress(parsed[0].id);
          }
        } catch (e) {
          console.error('加载地址失败:', e);
        }
      } else {
        // 如果没有保存的地址，使用默认地址
        const defaultAddresses: Address[] = [
          { id: Date.now(), name: '张三', phone: '138****8888', address: '北京市朝阳区xxx街道xxx号', isDefault: true },
          { id: Date.now() + 1, name: '李四', phone: '139****9999', address: '上海市浦东新区xxx路xxx号', isDefault: false }
        ];
        setAddresses(defaultAddresses);
        setSelectedAddress(defaultAddresses[0].id);
        saveAddresses(defaultAddresses);
      }
    }
  }, [isAuthenticated, user]);

  // 保存地址到localStorage
  const saveAddresses = (newAddresses: Address[]) => {
    if (user) {
      localStorage.setItem(`addresses_${user.id}`, JSON.stringify(newAddresses));
    }
  };

  // 处理添加地址
  const handleAddAddress = () => {
    setEditingAddress(null);
    setShowAddressEdit(true);
  };

  // 处理编辑地址
  const handleEditAddress = (address: Address, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingAddress(address);
    setShowAddressEdit(true);
  };

  // 处理删除地址
  const handleDeleteAddress = (addressId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(t('addressEdit.confirmDelete') || '确定要删除这个地址吗？')) {
      const newAddresses = addresses.filter(addr => addr.id !== addressId);
      // 如果删除的是默认地址，设置第一个为默认
      const deletedAddr = addresses.find(addr => addr.id === addressId);
      if (deletedAddr?.isDefault && newAddresses.length > 0) {
        newAddresses[0].isDefault = true;
      }
      setAddresses(newAddresses);
      saveAddresses(newAddresses);
      // 如果删除的是选中的地址，重新选择
      if (selectedAddress === addressId) {
        setSelectedAddress(newAddresses.length > 0 ? newAddresses[0].id : null);
      }
    }
  };

  // 处理保存地址
  const handleSaveAddress = (addressData: Omit<Address, 'id'>) => {
    if (editingAddress) {
      // 编辑模式
      const newAddresses = addresses.map(addr => {
        if (addr.id === editingAddress.id) {
          // 如果设置为默认，取消其他默认
          if (addressData.isDefault) {
            return { ...addressData, id: addr.id };
          }
          return { ...addressData, id: addr.id, isDefault: addr.isDefault };
        }
        // 如果新地址设为默认，取消其他默认
        if (addressData.isDefault && addr.isDefault) {
          return { ...addr, isDefault: false };
        }
        return addr;
      });
      // 如果设置为默认，取消其他默认
      if (addressData.isDefault) {
        newAddresses.forEach(addr => {
          if (addr.id !== editingAddress.id) {
            addr.isDefault = false;
          }
        });
      }
      setAddresses(newAddresses);
      saveAddresses(newAddresses);
      if (addressData.isDefault || selectedAddress === editingAddress.id) {
        setSelectedAddress(editingAddress.id);
      }
    } else {
      // 新增模式
      const newAddress: Address = {
        ...addressData,
        id: Date.now()
      };
      // 如果设置为默认，取消其他默认
      if (addressData.isDefault) {
        const newAddresses = addresses.map(addr => ({ ...addr, isDefault: false }));
        newAddresses.unshift(newAddress);
        setAddresses(newAddresses);
        saveAddresses(newAddresses);
        setSelectedAddress(newAddress.id);
      } else {
        const newAddresses = [...addresses, newAddress];
        setAddresses(newAddresses);
        saveAddresses(newAddresses);
        if (addresses.length === 0) {
          setSelectedAddress(newAddress.id);
        }
      }
    }
    setShowAddressEdit(false);
    setEditingAddress(null);
  };

  const savings = ((product.originalPrice || product.price * 1.5) - product.price) * quantity;
  const total = product.price * quantity;

  const handleConfirm = async () => {
    if (!isAuthenticated) {
      setError('请先登录');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 检查是否选择了地址
      if (selectedAddress === null) {
        setError(t('joinGroup.selectAddress') || '请选择收货地址');
        return;
      }

      const selectedAddr = addresses.find(addr => addr.id === selectedAddress);
      if (!selectedAddr) {
        setError(t('joinGroup.selectAddress') || '请选择收货地址');
        return;
      }

      // 创建订单
      const orderData: CreateOrderDto = {
        product_id: product.id,
        quantity: quantity,
        shipping_address: {
          name: selectedAddr.name,
          phone: selectedAddr.phone,
          address: selectedAddr.address
        }
      };

      const order = await OrdersService.createOrder(orderData);

      // 调用父组件的onConfirm，传递订单数据
      onConfirm({
        id: order.id,
        orderNo: order.order_no,
        productName: order.product_name,
        quantity: order.quantity,
        amount: order.actual_amount,
        groupType: `${product.groupSize}人团`,
        groupSize: product.groupSize,
        currentMembers: product.currentMembers + 1 // 当前用户参团后，人数+1
      });
    } catch (err: any) {
      console.error('创建订单失败:', err);
      setError(err.message || err.data?.message || '创建订单失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 如果显示地址编辑页面
  if (showAddressEdit) {
    return (
      <AddressEditPage
        address={editingAddress}
        onSave={handleSaveAddress}
        onCancel={() => {
          setShowAddressEdit(false);
          setEditingAddress(null);
        }}
      />
    );
  }

  return (
    <div className="join-group-page">
      {/* 头部 */}
      <div className="join-group-header">
        <button className="back-btn" onClick={onBack} aria-label="返回">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="join-group-title">{t('joinGroup.title')}</h1>
      </div>

      <div className="join-group-content">
        {/* 团购信息卡片 */}
        <div className="group-info-card">
          <div className="group-info-header">
            <div className="group-badge">{t('joinGroup.groupBuying')}</div>
            <div className="time-left">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>{product.timeLeft}</span>
            </div>
          </div>
          
          <div className="group-progress-info">
            <div className="members-display">
              {[...Array(Math.min(product.groupSize, 6))].map((_, index) => (
                <div 
                  key={index} 
                  className={`member-slot ${index < product.currentMembers ? 'filled' : ''}`}
                >
                  {index < product.currentMembers ? '👤' : '?'}
                </div>
              ))}
              {product.groupSize > 6 && (
                <div className="member-slot more">
                  +{product.groupSize - 6}
                </div>
              )}
            </div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill"
                style={{ 
                  width: `${Math.min((product.currentMembers / product.groupSize) * 100, 100)}%` 
                }}
              />
            </div>
            <p className="progress-text">
              {t('joinGroup.progressText', { 
                current: product.currentMembers, 
                total: product.groupSize 
              })}
            </p>
          </div>
        </div>

        {/* 商品信息 */}
        <div className="product-summary-card">
          <h3>{t('joinGroup.productInfo')}</h3>
          <div className="product-summary-content">
            <div 
              className="product-summary-image"
              style={{
                backgroundImage: product.imageUrl ? `url(${product.imageUrl})` : undefined,
                backgroundColor: product.imageUrl ? 'transparent' : '#f0f0f0'
              }}
            >
              {!product.imageUrl && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              )}
            </div>
            <div className="product-summary-details">
              <h4>{product.name}</h4>
              <div className="price-row">
                <span className="group-price">¥{product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="original-price">¥{product.originalPrice.toFixed(2)}</span>
                )}
              </div>
              <div className="quantity-selector">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>
          </div>
        </div>

        {/* 收货地址 */}
        <div className="address-card">
          <h3>{t('joinGroup.shippingAddress')}</h3>
          {addresses.length > 0 ? (
            <div className="address-list">
              {addresses.map((addr) => (
                <div 
                  key={addr.id}
                  className={`address-item ${selectedAddress === addr.id ? 'selected' : ''}`}
                  onClick={() => setSelectedAddress(addr.id)}
                >
                  <div className="address-radio">
                    {selectedAddress === addr.id && <div className="radio-dot" />}
                  </div>
                  <div className="address-details">
                    <div className="address-header">
                      <span className="recipient-name">{addr.name}</span>
                      <span className="recipient-phone">{addr.phone}</span>
                      {addr.isDefault && (
                        <span className="default-badge">{t('addressEdit.default') || '默认'}</span>
                      )}
                    </div>
                    <p className="address-text">{addr.address}</p>
                  </div>
                  <div className="address-actions" onClick={(e) => e.stopPropagation()}>
                    <button 
                      className="address-edit-action"
                      onClick={(e) => handleEditAddress(addr, e)}
                      title={t('addressEdit.edit') || '编辑'}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button 
                      className="address-delete-action"
                      onClick={(e) => handleDeleteAddress(addr.id, e)}
                      title={t('addressEdit.delete') || '删除'}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="address-empty">
              <p>{t('addressEdit.noAddress') || '暂无收货地址'}</p>
            </div>
          )}
          <button className="add-address-btn" onClick={handleAddAddress}>
            + {t('joinGroup.addNewAddress')}
          </button>
        </div>

        {/* 价格明细 */}
        <div className="price-detail-card">
          <h3>{t('joinGroup.priceBreakdown')}</h3>
          <div className="price-rows">
            <div className="price-row-item">
              <span>{t('joinGroup.subtotal')}</span>
              <span>¥{total.toFixed(2)}</span>
            </div>
            <div className="price-row-item">
              <span>{t('joinGroup.shipping')}</span>
              <span className="free">{t('joinGroup.freeShipping')}</span>
            </div>
            <div className="price-row-item savings">
              <span>{t('joinGroup.youSave')}</span>
              <span>-¥{savings.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* 团购规则提示 */}
        <div className="rules-notice">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          <p>{t('joinGroup.rulesNotice')}</p>
        </div>

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
      </div>

      {/* 底部确认栏 */}
      <div className="join-group-footer">
        <div className="footer-price">
          <span className="footer-label">{t('joinGroup.total')}</span>
          <div className="footer-amount">
            <span className="amount">¥{total.toFixed(2)}</span>
            <span className="savings-badge">{t('joinGroup.save')} ¥{savings.toFixed(2)}</span>
          </div>
        </div>
        <button 
          className="confirm-join-btn" 
          onClick={handleConfirm}
          disabled={loading || !isAuthenticated}
        >
          {loading ? (t('common.loading') || '创建订单中...') : t('joinGroup.confirmJoin')}
        </button>
      </div>
    </div>
  );
};

export default JoinGroupPage;

