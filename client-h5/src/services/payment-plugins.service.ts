import { ApiClient } from './api.client';
import { API_ENDPOINTS } from '../config/api.config';

export interface PaymentPlugin {
  id: number;
  plugin_code: string;
  plugin_name: string;
  plugin_type: 'domestic' | 'overseas' | 'crypto';
  description?: string;
  icon_url?: string;
  version: string;
  status: number; // 0-未安装，1-已安装，2-已启用
  supported_regions?: string[];
  supported_currencies?: string[];
  min_amount: number;
  max_amount?: number;
  fee_rate: number;
  fee_fixed: number;
}

export class PaymentPluginsService {
  /**
   * 获取可用的支付插件列表
   * @param region 地区代码（如：CN, US等）
   * @param currency 货币代码（如：CNY, USD等）
   */
  static async getAvailablePlugins(region?: string, currency?: string): Promise<PaymentPlugin[]> {
    try {
      const params = new URLSearchParams();
      if (region) params.append('region', region);
      if (currency) params.append('currency', currency);
      const url = params.toString() 
        ? `${API_ENDPOINTS.PAYMENT_PLUGINS.ENABLED}?${params.toString()}`
        : API_ENDPOINTS.PAYMENT_PLUGINS.ENABLED;
      
      console.log('📡 请求支付插件API:', url);
      const response = await ApiClient.get<PaymentPlugin[]>(url);
      console.log('📥 支付插件API响应:', response);
      
      // 确保返回的是数组
      if (Array.isArray(response)) {
        return response;
      } else if (response && typeof response === 'object' && 'data' in response) {
        // 如果返回的是包装对象，提取data字段
        return Array.isArray(response.data) ? response.data : [];
      } else {
        console.warn('⚠️ 支付插件API返回格式异常:', response);
        return [];
      }
    } catch (error: any) {
      console.error('❌ 获取支付插件失败:', error);
      throw error;
    }
  }

  /**
   * 计算支付手续费
   */
  static calculateFee(plugin: PaymentPlugin, amount: number): number {
    const amountNum = Number(amount) || 0;
    const feeRate = Number(plugin.fee_rate) || 0;
    const feeFixed = Number(plugin.fee_fixed) || 0;
    const rateFee = amountNum * feeRate;
    return rateFee + feeFixed;
  }

  /**
   * 计算实际支付金额（含手续费）
   */
  static calculateTotalAmount(plugin: PaymentPlugin, amount: number): number {
    return amount + this.calculateFee(plugin, amount);
  }
}

