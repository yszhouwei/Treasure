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

export interface GroupOrder {
  product_id: number;
  product_name: string;
  product_image?: string;
  orders: Order[];
  total_participants: number;
  total_amount: number;
  status: 'active' | 'completed' | 'cancelled';
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

  // 支付订单
  static async payOrder(orderId: number, paymentMethod: string): Promise<Order> {
    return ApiClient.post<Order>(API_ENDPOINTS.ORDERS.PAY(orderId), {
      payment_method: paymentMethod
    });
  }

  // 取消订单
  static async cancelOrder(orderId: number): Promise<Order> {
    return ApiClient.post<Order>(`${API_ENDPOINTS.ORDERS.GET_BY_ID(orderId)}/cancel`, {});
  }

  // 获取用户参与的团购列表（已支付的订单，按商品分组）
  static async getMyGroupOrders(): Promise<GroupOrder[]> {
    const orders = await this.getOrders(1); // 获取已支付的订单
    // 按 product_id 分组
    const groupMap = new Map<number, GroupOrder>();
    
    orders.forEach(order => {
      if (!order.product_id) return;
      
      if (!groupMap.has(order.product_id)) {
        groupMap.set(order.product_id, {
          product_id: order.product_id,
          product_name: order.product_name,
          product_image: order.product_image,
          orders: [],
          total_participants: 0,
          total_amount: 0,
          status: 'active', // 默认进行中
        });
      }
      
      const group = groupMap.get(order.product_id)!;
      group.orders.push(order);
      group.total_participants += order.quantity;
      group.total_amount += parseFloat(String(order.actual_amount || 0));
    });
    
    return Array.from(groupMap.values());
  }
}
