import { ApiClient } from './api.client';
import { API_ENDPOINTS } from '../config/api.config';

export interface LotteryRecord {
  id: number;
  group_id: number;
  product_id: number;
  winner_count: number;
  lottery_time: string | null;
  lottery_method: string | null;
  status: number;
  winners?: {
    id: number;
    username: string;
    nickname?: string;
  }[];
  product?: {
    id: number;
    name: string;
  };
}

export interface Dividend {
  id: number;
  lottery_id: number;
  user_id: number;
  order_id: number;
  amount: number;
  dividend_type: string;
  status: number;
  paid_at: string | null;
}

export interface LotteryResult {
  lottery: LotteryRecord;
  winners: {
    id: number;
    username: string;
    nickname?: string;
  }[];
  dividends: Dividend[];
}

export class LotteryService {
  // 开奖
  static async drawLottery(groupId: number): Promise<LotteryResult> {
    return ApiClient.post<LotteryResult>(API_ENDPOINTS.LOTTERY.DRAW(groupId));
  }

  // 获取开奖结果
  static async getLotteryResult(groupId: number): Promise<LotteryResult> {
    return ApiClient.get<LotteryResult>(API_ENDPOINTS.LOTTERY.RESULT(groupId));
  }

  // 获取我的开奖记录
  static async getMyLotteryRecords(): Promise<{
    wins: LotteryRecord[];
    dividends: Dividend[];
  }> {
    return ApiClient.get(API_ENDPOINTS.LOTTERY.MY_RECORDS);
  }
}

