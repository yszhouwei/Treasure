import { ApiClient } from './api.client';
import { API_ENDPOINTS } from '../config/api.config';

export interface Product {
  id: number;
  name: string;
  description?: string;
  category_id?: number;
  image_url?: string;
  images?: string; // JSON字符串
  original_price: number | string; // 可能是字符串（从数据库DECIMAL类型）
  group_price: number | string; // 可能是字符串（从数据库DECIMAL类型）
  stock: number;
  sales_count: number;
  view_count: number;
  status: number;
  is_hot: number;
  is_recommend: number;
  sort_order: number;
  specifications?: string;
  warranty?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductListParams {
  page?: number;
  limit?: number;
  category_id?: number;
  is_hot?: number;
  is_recommend?: number;
}

export class ProductsService {
  // 获取商品列表
  static async getProducts(params?: ProductListParams): Promise<ProductListResponse> {
    return ApiClient.get<ProductListResponse>(API_ENDPOINTS.PRODUCTS.LIST, { params });
  }

  // 获取热门商品
  static async getHotProducts(): Promise<Product[]> {
    return ApiClient.get<Product[]>(API_ENDPOINTS.PRODUCTS.HOT);
  }

  // 获取推荐商品
  static async getRecommendProducts(): Promise<Product[]> {
    return ApiClient.get<Product[]>(API_ENDPOINTS.PRODUCTS.RECOMMEND);
  }

  // 获取商品详情
  static async getProductById(id: number): Promise<Product> {
    return ApiClient.get<Product>(API_ENDPOINTS.PRODUCTS.GET_BY_ID(id));
  }

  // 解析商品图片数组
  static parseImages(images?: string): string[] {
    if (!images) return [];
    try {
      return JSON.parse(images);
    } catch {
      return [];
    }
  }
}

