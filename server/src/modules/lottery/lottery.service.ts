import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
export class LotteryService {
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

  async drawLottery(groupId: number, userId: number) {
    // 检查团购是否存在且已完成
    const group = await this.groupBuyingRepository.findOne({
      where: { id: groupId },
      relations: ['product'],
    });

    if (!group) {
      throw new NotFoundException('团购不存在');
    }

    // 检查是否已经开奖
    const existingLottery = await this.lotteryRepository.findOne({
      where: { group_id: groupId, status: 1 },
    });

    if (existingLottery) {
      throw new BadRequestException('该团购已开奖');
    }

    // 检查团购是否完成（人数是否达到目标）
    if (group.current_members < group.group_size) {
      throw new BadRequestException('团购尚未完成，无法开奖');
    }

    // 获取商品配置（中奖数量和分红比例）
    const product = await this.productRepository.findOne({
      where: { id: group.product_id },
    });

    if (!product) {
      throw new NotFoundException('商品不存在');
    }

    const winnerCount = product.winner_count || 1; // 中奖数量（平台设定，默认1）
    const dividendRate = product.dividend_rate || 5.0; // 分红比例（平台设定，默认5%）

    // 获取所有参与订单
    const orders = await this.orderRepository.find({
      where: { 
        product_id: group.product_id,
        status: 1, // 已支付
      },
      relations: ['user'],
    });

    if (orders.length === 0) {
      throw new BadRequestException('没有参与订单');
    }

    if (orders.length < winnerCount) {
      throw new BadRequestException(`参与人数不足，无法开奖（需要至少${winnerCount}人）`);
    }

    // 随机选择中奖者（不重复）
    const shuffledOrders = [...orders].sort(() => Math.random() - 0.5);
    const winnerOrders = shuffledOrders.slice(0, winnerCount);
    const winnerIds = winnerOrders.map(o => o.user_id);

    // 创建开奖记录
    const lottery = this.lotteryRepository.create({
      group_id: groupId,
      product_id: group.product_id,
      winner_count: winnerCount,
      lottery_time: new Date(),
      lottery_method: 'random',
      status: 1,
    });

    const savedLottery = await this.lotteryRepository.save(lottery);

    // 创建中奖者记录
    const winners: LotteryWinner[] = [];
    for (const winnerOrder of winnerOrders) {
      const winner = this.lotteryWinnerRepository.create({
        lottery_id: savedLottery.id,
        winner_id: winnerOrder.user_id,
        order_id: winnerOrder.id,
      });
      winners.push(winner);
    }
    await this.lotteryWinnerRepository.save(winners);

    // 计算分红：只有未中奖者获得分红，中奖者只获得商品，不分红
    const dividends: Dividend[] = [];
    const totalDividendAmount = orders.reduce((sum, order) => sum + Number(order.actual_amount), 0);
    const dividendPerOrder = (totalDividendAmount * dividendRate / 100) / (orders.length - winnerCount);

    for (const order of orders) {
      // 中奖者不分红
      if (!winnerIds.includes(order.user_id)) {
        const dividend = this.dividendRepository.create({
          lottery_id: savedLottery.id,
          user_id: order.user_id,
          order_id: order.id,
          amount: dividendPerOrder,
          dividend_type: 'participant',
          status: 0, // 待发放
        });
        dividends.push(dividend);
      }
    }

    if (dividends.length > 0) {
      await this.dividendRepository.save(dividends);
    }

    // 更新团购状态
    group.status = 2; // 已完成
    group.success_time = new Date();
    await this.groupBuyingRepository.save(group);

    return {
      lottery: savedLottery,
      winners: winnerOrders.map(o => ({
        id: o.user.id,
        username: o.user.username,
        nickname: o.user.nickname,
      })),
      dividends: dividends.length,
    };
  }

  async getLotteryResult(groupId: number) {
    const lottery = await this.lotteryRepository.findOne({
      where: { group_id: groupId },
      relations: ['product'],
    });

    if (!lottery) {
      throw new NotFoundException('开奖记录不存在');
    }

    // 获取所有中奖者
    const winners = await this.lotteryWinnerRepository.find({
      where: { lottery_id: lottery.id },
      relations: ['winner', 'order'],
    });

    // 获取分红信息
    const dividends = await this.dividendRepository.find({
      where: { lottery_id: lottery.id },
      relations: ['user', 'order'],
    });

    return {
      lottery,
      winners: winners.map(w => ({
        id: w.winner.id,
        username: w.winner.username,
        nickname: w.winner.nickname,
      })),
      dividends,
    };
  }

  async getMyLotteryRecords(userId: number) {
    // 获取用户中奖的记录
    const winnerRecords = await this.lotteryWinnerRepository.find({
      where: { winner_id: userId },
      relations: ['lottery', 'lottery.product', 'lottery.group'],
      order: { created_at: 'DESC' },
    });

    const wins = winnerRecords.map(w => w.lottery);

    // 获取用户的分红记录
    const dividends = await this.dividendRepository.find({
      where: { user_id: userId },
      relations: ['lottery', 'order'],
      order: { created_at: 'DESC' },
    });

    return {
      wins,
      dividends,
    };
  }
}

