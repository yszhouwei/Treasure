import { ApiClient } from './api.client';
import { API_ENDPOINTS } from '../config/api.config';

export interface RechargeDto {
  amount: number;
  payment_method: string;
}

export interface WithdrawDto {
  amount: number;
  account: string;
  account_type: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  amount?: number;
  transaction_id?: string;
}

export class PaymentsService {
  // 充值
  static async recharge(data: RechargeDto): Promise<PaymentResponse> {
    return ApiClient.post<PaymentResponse>(API_ENDPOINTS.PAYMENTS.RECHARGE, data);
  }

  // 提现
  static async withdraw(data: WithdrawDto): Promise<PaymentResponse> {
    return ApiClient.post<PaymentResponse>(API_ENDPOINTS.PAYMENTS.WITHDRAW, data);
  }
}

