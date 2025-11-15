import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Team } from '../../entities/team.entity';
import { Product } from '../../entities/product.entity';
import { Order } from '../../entities/order.entity';

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

      return {
        totalUsers,
        totalTeams,
        totalProducts,
        totalRevenue: parseFloat(totalRevenue?.total || '0'),
        userGrowth,
        revenueTrend,
        productSales,
        orderStatus,
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
}
