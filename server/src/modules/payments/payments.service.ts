import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  async recharge(userId: number, createPaymentDto: CreatePaymentDto) {
    // TODO: 实现充值逻辑
    return {
      success: true,
      message: '充值成功',
      amount: createPaymentDto.amount,
    };
  }

  async withdraw(userId: number, createPaymentDto: CreatePaymentDto) {
    // TODO: 实现提现逻辑
    return {
      success: true,
      message: '提现申请已提交',
      amount: createPaymentDto.amount,
    };
  }
}

