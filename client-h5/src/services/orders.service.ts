import { ApiClient } from './api.client';
import { API_ENDPOINTS } from '../config/api.config';

export interface Order {
  id: number;
  order_no: string;
  user_id: number;
  team_id?: number;
  product_id: number;
  product_name: string;
  product_image?: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  discount_amount: number;
  actual_amount: number;
  status: number; // 0-待支付，1-已支付，2-已发货，3-已完成，4-已取消，5-已退款
  payment_method?: string;
  payment_time?: string;
  shipping_address?: string;
  shipping_company?: string;
  shipping_no?: string;
  shipping_time?: string;
  completed_time?: string;
  remark?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderDto {
  product_id: number;
  quantity: number;
  team_id?: number;
  shipping_address?: any;
}

export class OrdersService {
  // 获取订单列表
  static async getOrders(status?: number): Promise<Order[]> {
    return ApiClient.get<Order[]>(API_ENDPOINTS.ORDERS.LIST, {
      params: status !== undefined ? { status } : undefined,
    });
  }

  // 获取订单详情
  static async getOrderById(id: number): Promise<Order> {
    return ApiClient.get<Order>(API_ENDPOINTS.ORDERS.GET_BY_ID(id));
  }

  // 创建订单
  static async createOrder(data: CreateOrderDto): Promise<Order> {
    return ApiClient.post<Order>(API_ENDPOINTS.ORDERS.CREATE, data);
  }
}

