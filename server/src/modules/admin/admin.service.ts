import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Team } from '../../entities/team.entity';
import { Product } from '../../entities/product.entity';
import { Order } from '../../entities/order.entity';
import { Payment } from '../../entities/payment.entity';
import { ProductCategory } from '../../entities/product-category.entity';
import { LotteryRecord } from '../../entities/lottery-record.entity';
import { GroupBuying } from '../../entities/group-buying.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    @InjectRepository(ProductCategory)
    private categoriesRepository: Repository<ProductCategory>,
    @InjectRepository(LotteryRecord)
    private lotteryRepository: Repository<LotteryRecord>,
    @InjectRepository(GroupBuying)
    private groupBuyingRepository: Repository<GroupBuying>,
  ) {}

  async getDashboardStats() {
    try {
      console.log('📊 开始获取仪表盘统计数据...');

      // 先检查数据库连接
      const userCount = await this.usersRepository.count();
      console.log('✅ 数据库连接正常，用户总数:', userCount);

      const [
        totalUsers,
        totalTeams,
        totalProducts,
        totalRevenue,
      ] = await Promise.all([
        this.usersRepository.count({ where: { status: 1 } }),
        this.teamsRepository.count({ where: { status: 1 } }),
        this.productsRepository.count({ where: { status: 1 } }),
        this.ordersRepository
          .createQueryBuilder('order')
          .select('SUM(order.actual_amount)', 'total')
          .where('order.status IN (1, 2)')
          .getRawOne(),
      ]);

      console.log('📈 统计数据:', {
        totalUsers,
        totalTeams,
        totalProducts,
        totalRevenue: totalRevenue?.total || 0,
      });

      // 获取最近7天的用户增长数据
      const userGrowth = await this.getUserGrowthData(7);
      console.log('👥 用户增长数据:', userGrowth.length, '条');
      
      // 获取最近7天的收入趋势
      const revenueTrend = await this.getRevenueTrendData(7);
      console.log('💰 收入趋势数据:', revenueTrend.length, '条');
      
      // 获取商品销售Top 10
      const productSales = await this.getProductSalesData(10);
      console.log('🛍️ 商品销售数据:', productSales.length, '条');
      
      // 获取订单状态统计
      const orderStatus = await this.getOrderStatusData();
      console.log('📦 订单状态数据:', orderStatus.length, '条');
      
      // 获取支付方式统计
      const paymentMethods = await this.getPaymentMethodData();
      console.log('💳 支付方式数据:', paymentMethods.length, '条');
      
      // 获取团队规模分布
      const teamSizeDistribution = await this.getTeamSizeDistribution();
      console.log('👥 团队规模分布数据:', teamSizeDistribution.length, '条');
      
      // 获取商品分类销售统计
      const categorySales = await this.getCategorySalesData();
      console.log('📊 分类销售数据:', categorySales.length, '条');
      
      // 获取开奖统计
      const lotteryStats = await this.getLotteryStats();
      console.log('🎲 开奖统计数据:', lotteryStats);

      return {
        totalUsers,
        totalTeams,
        totalProducts,
        totalRevenue: parseFloat(totalRevenue?.total || '0'),
        userGrowth,
        revenueTrend,
        productSales,
        orderStatus,
        paymentMethods,
        teamSizeDistribution,
        categorySales,
        lotteryStats,
      };
    } catch (error) {
      console.error('❌ 获取仪表盘统计数据失败:', error);
      throw error;
    }
  }

  private async getUserGrowthData(days: number = 7) {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      console.log('📅 查询用户增长数据，时间范围:', startDate, '到', endDate);

      const users = await this.usersRepository
        .createQueryBuilder('user')
        .select('DATE_FORMAT(user.created_at, "%Y-%m-%d")', 'date')
        .addSelect('COUNT(*)', 'count')
        .where('user.created_at >= :startDate', { startDate })
        .andWhere('user.created_at <= :endDate', { endDate })
        .groupBy('DATE_FORMAT(user.created_at, "%Y-%m-%d")')
        .orderBy('DATE_FORMAT(user.created_at, "%Y-%m-%d")', 'ASC')
        .getRawMany();

      console.log('📊 查询到的用户数据:', users.length, '条');

      // 填充缺失的日期
      const result: Array<{ date: string; count: number }> = [];
      for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        const userData = users.find(u => u.date === dateStr);
        result.push({
          date: dateStr,
          count: userData ? parseInt(userData.count) : 0,
        });
      }

      return result;
    } catch (error) {
      console.error('❌ 获取用户增长数据失败:', error);
      return [];
    }
  }

  private async getRevenueTrendData(days: number = 7) {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const orders = await this.ordersRepository
        .createQueryBuilder('order')
        .select('DATE_FORMAT(order.created_at, "%Y-%m-%d")', 'date')
        .addSelect('SUM(order.actual_amount)', 'amount')
        .where('order.created_at >= :startDate', { startDate })
        .andWhere('order.created_at <= :endDate', { endDate })
        .andWhere('order.status IN (1, 2)')
        .groupBy('DATE_FORMAT(order.created_at, "%Y-%m-%d")')
        .orderBy('DATE_FORMAT(order.created_at, "%Y-%m-%d")', 'ASC')
        .getRawMany();

      // 填充缺失的日期
      const result: Array<{ date: string; amount: number }> = [];
      for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        const orderData = orders.find(o => o.date === dateStr);
        result.push({
          date: dateStr,
          amount: orderData ? parseFloat(orderData.amount || '0') : 0,
        });
      }

      return result;
    } catch (error) {
      console.error('❌ 获取收入趋势数据失败:', error);
      return [];
    }
  }

  private async getProductSalesData(limit: number = 10) {
    try {
      const products = await this.productsRepository
        .createQueryBuilder('product')
        .select('product.name', 'name')
        .addSelect('product.sales_count', 'sales')
        .orderBy('product.sales_count', 'DESC')
        .limit(limit)
        .getRawMany();

      return products.map(p => ({
        name: p.name,
        sales: parseInt(p.sales || '0'),
      }));
    } catch (error) {
      console.error('❌ 获取商品销售数据失败:', error);
      return [];
    }
  }

  private async getOrderStatusData() {
    try {
      const statusCounts = await this.ordersRepository
        .createQueryBuilder('order')
        .select('order.status', 'status')
        .addSelect('COUNT(*)', 'count')
        .groupBy('order.status')
        .getRawMany();

      const statusMap: Record<number, string> = {
        0: '待支付',
        1: '已支付',
        2: '已完成',
        3: '已取消',
      };

      return statusCounts.map(item => ({
        status: statusMap[item.status] || '未知',
        count: parseInt(item.count),
      }));
    } catch (error) {
      console.error('❌ 获取订单状态数据失败:', error);
      return [];
    }
  }

  private async getPaymentMethodData() {
    try {
      const methods = await this.paymentsRepository
        .createQueryBuilder('payment')
        .select('payment.payment_method', 'method')
        .addSelect('COUNT(*)', 'count')
        .addSelect('SUM(payment.amount)', 'amount')
        .where('payment.status = :status', { status: 1 })
        .groupBy('payment.payment_method')
        .getRawMany();

      const methodMap: Record<string, string> = {
        wechat: '微信支付',
        alipay: '支付宝',
        bank: '银行转账',
      };

      return methods.map(m => ({
        method: methodMap[m.method] || m.method,
        count: parseInt(m.count),
        amount: parseFloat(m.amount || '0'),
      }));
    } catch (error) {
      console.error('❌ 获取支付方式数据失败:', error);
      return [];
    }
  }

  private async getTeamSizeDistribution() {
    try {
      const distribution = await this.teamsRepository
        .createQueryBuilder('team')
        .select('team.group_size', 'size')
        .addSelect('COUNT(*)', 'count')
        .where('team.status = :status', { status: 1 })
        .groupBy('team.group_size')
        .getRawMany();

      return distribution.map(d => ({
        size: `${d.size}人团`,
        count: parseInt(d.count),
      }));
    } catch (error) {
      console.error('❌ 获取团队规模分布失败:', error);
      return [];
    }
  }

  private async getCategorySalesData() {
    try {
      const categorySales = await this.productsRepository
        .createQueryBuilder('product')
        .leftJoin('product.category', 'category')
        .select('COALESCE(category.name, "未分类")', 'category')
        .addSelect('SUM(product.sales_count)', 'sales')
        .addSelect('COUNT(product.id)', 'count')
        .where('product.status = :status', { status: 1 })
        .groupBy('category.id')
        .orderBy('SUM(product.sales_count)', 'DESC')
        .limit(10)
        .getRawMany();

      return categorySales.map(c => ({
        category: c.category,
        sales: parseInt(c.sales || '0'),
        count: parseInt(c.count),
      }));
    } catch (error) {
      console.error('❌ 获取分类销售数据失败:', error);
      return [];
    }
  }

  private async getLotteryStats() {
    try {
      const totalLotteries = await this.lotteryRepository.count();
      const totalGroups = await this.groupBuyingRepository.count({ where: { status: 2 } }); // 已成团
      
      // 获取最近30天的开奖趋势
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const lotteryTrend = await this.lotteryRepository
        .createQueryBuilder('lottery')
        .select('DATE_FORMAT(lottery.lottery_time, "%Y-%m-%d")', 'date')
        .addSelect('COUNT(*)', 'count')
        .where('lottery.lottery_time >= :startDate', { startDate })
        .andWhere('lottery.lottery_time <= :endDate', { endDate })
        .groupBy('DATE_FORMAT(lottery.lottery_time, "%Y-%m-%d")')
        .orderBy('DATE_FORMAT(lottery.lottery_time, "%Y-%m-%d")', 'ASC')
        .getRawMany();

      return {
        totalLotteries,
        totalGroups,
        lotteryTrend: lotteryTrend.map(l => ({
          date: l.date,
          count: parseInt(l.count),
        })),
      };
    } catch (error) {
      console.error('❌ 获取开奖统计失败:', error);
      return {
        totalLotteries: 0,
        totalGroups: 0,
        lotteryTrend: [],
      };
    }
  }
}
