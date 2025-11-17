import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../../entities/payment.entity';
import { User } from '../../entities/user.entity';
import { Order } from '../../entities/order.entity';

@Injectable()
export class AdminPaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async findAll(type?: string, status?: number) {
    try {
      const queryBuilder = this.paymentsRepository.createQueryBuilder('payment')
        .leftJoinAndSelect('payment.user', 'user')
        .leftJoinAndSelect('payment.order', 'order');
      
      // 根据类型筛选：recharge（充值）或 withdraw（提现）
      // 充值通常是订单支付（微信/支付宝），提现通常是银行转账
      if (type === 'recharge') {
        // 充值：微信或支付宝支付
        queryBuilder.andWhere('(payment.payment_method = :wechat OR payment.payment_method = :alipay)', {
          wechat: 'wechat',
          alipay: 'alipay',
        });
      } else if (type === 'withdraw') {
        // 提现：银行转账
        queryBuilder.andWhere('payment.payment_method = :bank', { bank: 'bank' });
      }
      
      if (status !== undefined) {
        queryBuilder.andWhere('payment.status = :status', { status });
      }

      queryBuilder.orderBy('payment.created_at', 'DESC')
        .addOrderBy('payment.id', 'DESC');

      const payments = await queryBuilder.getMany();
      
      console.log('✅ 查询到支付记录数量:', payments.length);
      return payments;
    } catch (error) {
      console.error('❌ 查询支付记录失败:', error);
      throw error;
    }
  }

  async findOne(id: number) {
    const payment = await this.paymentsRepository.findOne({
      where: { id },
      relations: ['user', 'order'],
    });
    
    if (!payment) {
      throw new NotFoundException('支付记录不存在');
    }

    return payment;
  }

  async getStatistics() {
    try {
      const totalPayments = await this.paymentsRepository.count();
      
      // 统计各状态的支付记录数
      const statusCounts = await this.paymentsRepository
        .createQueryBuilder('payment')
        .select('payment.status', 'status')
        .addSelect('COUNT(*)', 'count')
        .groupBy('payment.status')
        .getRawMany();
      
      // 统计总支付金额（成功支付的）
      const totalAmountResult = await this.paymentsRepository
        .createQueryBuilder('payment')
        .select('SUM(payment.amount)', 'total')
        .where('payment.status = :status', { status: 1 })
        .getRawOne();
      
      // 统计总退款金额
      const totalRefundResult = await this.paymentsRepository
        .createQueryBuilder('payment')
        .select('SUM(payment.refund_amount)', 'total')
        .where('payment.refund_amount > 0')
        .getRawOne();
      
      const statusMap: Record<number, number> = {};
      statusCounts.forEach(item => {
        statusMap[item.status] = parseInt(item.count);
      });

      return {
        total_payments: totalPayments,
        status_counts: {
          pending: statusMap[0] || 0,
          success: statusMap[1] || 0,
          failed: statusMap[2] || 0,
          refunded: statusMap[3] || 0,
        },
        total_amount: Number(totalAmountResult?.total || 0),
        total_refund_amount: Number(totalRefundResult?.total || 0),
      };
    } catch (error) {
      console.error('❌ 查询支付统计失败:', error);
      throw error;
    }
  }
}

