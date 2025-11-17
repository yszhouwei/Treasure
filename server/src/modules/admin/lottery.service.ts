import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LotteryRecord } from '../../entities/lottery-record.entity';
import { LotteryWinner } from '../../entities/lottery-winner.entity';
import { Dividend } from '../../entities/dividend.entity';
import { GroupBuying } from '../../entities/group-buying.entity';
import { Order } from '../../entities/order.entity';
import { User } from '../../entities/user.entity';
import { Product } from '../../entities/product.entity';

@Injectable()
export class AdminLotteryService {
  constructor(
    @InjectRepository(LotteryRecord)
    private lotteryRepository: Repository<LotteryRecord>,
    @InjectRepository(LotteryWinner)
    private lotteryWinnerRepository: Repository<LotteryWinner>,
    @InjectRepository(Dividend)
    private dividendRepository: Repository<Dividend>,
    @InjectRepository(GroupBuying)
    private groupBuyingRepository: Repository<GroupBuying>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAll() {
    try {
      const records = await this.lotteryRepository.find({
        relations: ['product', 'group'],
        order: { lottery_time: 'DESC', id: 'DESC' },
      });
      
      // 获取每个开奖记录的中奖者数量
      const recordsWithWinners = await Promise.all(
        records.map(async (record) => {
          const winnerCount = await this.lotteryWinnerRepository.count({
            where: { lottery_id: record.id },
          });
          return {
            ...record,
            winner_count_actual: winnerCount,
          };
        })
      );
      
      console.log('✅ 查询到开奖记录数量:', recordsWithWinners.length);
      return recordsWithWinners;
    } catch (error) {
      console.error('❌ 查询开奖记录失败:', error);
      throw error;
    }
  }

  async findOne(id: number) {
    const record = await this.lotteryRepository.findOne({
      where: { id },
      relations: ['product', 'group'],
    });
    
    if (!record) {
      throw new NotFoundException('开奖记录不存在');
    }

    // 获取中奖者信息
    const winners = await this.lotteryWinnerRepository.find({
      where: { lottery_id: id },
      relations: ['winner', 'order'],
    });

    // 获取分红信息
    const dividends = await this.dividendRepository.find({
      where: { lottery_id: id },
      relations: ['user', 'order'],
    });

    return {
      ...record,
      winners: winners.map(w => ({
        id: w.id,
        winner_id: w.winner_id,
        winner_name: w.winner?.username || w.winner?.nickname || '未知',
        order_id: w.order_id,
        order_no: w.order?.order_no,
      })),
      dividends: dividends.map(d => ({
        id: d.id,
        user_id: d.user_id,
        user_name: d.user?.username || d.user?.nickname || '未知',
        amount: d.amount,
        status: d.status,
        order_id: d.order_id,
        order_no: d.order?.order_no,
      })),
    };
  }

  async getStatistics() {
    try {
      const totalRecords = await this.lotteryRepository.count();
      const totalWinners = await this.lotteryWinnerRepository.count();
      const totalDividendsCount = await this.dividendRepository.count();
      
      const totalDividendsResult = await this.dividendRepository
        .createQueryBuilder('dividend')
        .select('SUM(dividend.amount)', 'total')
        .getRawOne();
      
      const totalDividendAmount = totalDividendsResult?.total || 0;

      return {
        total_records: totalRecords,
        total_winners: totalWinners,
        total_dividends: totalDividendsCount,
        total_dividend_amount: Number(totalDividendAmount),
      };
    } catch (error) {
      console.error('❌ 查询开奖统计失败:', error);
      throw error;
    }
  }
}

