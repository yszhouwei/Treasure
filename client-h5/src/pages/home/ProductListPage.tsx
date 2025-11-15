import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ProductsService, type Product as ApiProduct } from '../../services/products.service';
import { parsePrice } from '../../utils/dataTransform';
import './ProductListPage.css';

interface ProductListPageProps {
  groupType: {
    id: number;
    name: string;
    color: string;
    icon: string;
    size?: number;
  };
  onBack: () => void;
  onProductClick: (product: any) => void;
}

type DisplayProduct = {
  id: number;
  name: string;
  price: number;
  participants?: number;
  total?: number;
  status: string;
  statusColor: string;
  tag: string;
  tagColor: string;
  desc?: string;
  description?: string;
  imageUrl?: string;
  backgroundColor?: string;
};

const ProductListPage: React.FC<ProductListPageProps> = ({ 
  groupType, 
  onBack, 
  onProductClick 
}) => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取对应团购类型的商品
  useEffect(() => {
    const fetchProducts = async () => {
      if (!groupType.size) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const apiProducts = await ProductsService.getProductsByGroupSize(groupType.size);
        
        // 转换为显示格式
        const displayProducts: DisplayProduct[] = apiProducts.map((product: ApiProduct) => {
          const price = parsePrice(product.group_price);
          const participants = Math.floor(Math.random() * groupType.size!) + 1;
          const total = groupType.size!;
          const isTight = participants >= total * 0.8;
          
          return {
            id: product.id,
            name: product.name,
            price: price,
            participants,
            total,
            status: isTight ? t('product.statusTight') || '即将成团' : t('product.statusAvailable') || '可参与',
            statusColor: isTight ? '#ff4d4f' : '#52c41a',
            tag: groupType.name,
            tagColor: groupType.color,
            desc: product.description || '',
            description: product.description || '',
            imageUrl: product.image_url || ProductsService.parseImages(product.images)[0],
            backgroundColor: '#2c1810'
          };
        });
        
        setProducts(displayProducts);
      } catch (err: any) {
        console.error('获取商品失败:', err);
        setError(err.message || '获取商品失败');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [groupType.size, t]);

  return (
    <div className="product-list-page">
      {/* 头部 */}
      <div className="product-list-header" style={{ background: `linear-gradient(135deg, ${groupType.color}, ${groupType.color}dd)` }}>
        <button className="back-btn-white" onClick={onBack} aria-label="返回">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="header-content">
          <div className="header-icon" style={{ background: `rgba(255, 255, 255, 0.25)` }}>
            <span style={{ fontSize: '32px' }}>{groupType.icon}</span>
          </div>
          <div className="header-text">
            <h1>{groupType.name} {t('productList.title') || '团购商品'}</h1>
            <p>{t('productList.subtitle') || '选择商品参与团购'}</p>
          </div>
        </div>
      </div>

      {/* 商品列表 */}
      <div className="product-list-content">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>{t('common.loading') || '加载中...'}</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h3>{t('common.error') || '加载失败'}</h3>
            <p>{error}</p>
            <button 
              className="retry-btn"
              onClick={() => window.location.reload()}
            >
              {t('common.retry') || '重试'}
            </button>
          </div>
        ) : products.length > 0 ? (
          <div className="product-list-grid">
            {products.map((product) => (
              <div
                key={product.id}
                className="product-list-card"
                onClick={() => onProductClick(product)}
              >
                <div
                  className="product-list-image"
                  style={{
                    backgroundImage: product.imageUrl ? `url(${product.imageUrl})` : undefined,
                    backgroundColor: product.backgroundColor || '#2c1810'
                  }}
                >
                  <span className="product-list-tag" style={{ backgroundColor: product.tagColor }}>
                    {product.tag}
                  </span>
                </div>
                <div className="product-list-info">
                  <h3 className="product-list-name">{product.name}</h3>
                  {product.participants !== undefined && product.total !== undefined && (
                    <div className="product-list-stats">
                      <span className="participants-count">
                        {product.participants}/{product.total}人
                      </span>
                      <span className="product-status" style={{ color: product.statusColor }}>
                        {product.status}
                      </span>
                    </div>
                  )}
                  <div className="product-list-footer">
                    <span className="product-list-price">¥{product.price.toFixed(2)}</span>
                    <button className="product-list-btn">
                      {t('common.join') || '参与'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>{t('productList.emptyTitle') || '暂无商品'}</h3>
            <p>{t('productList.emptyDesc') || '该类型暂无团购商品，请查看其他类型'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListPage;

