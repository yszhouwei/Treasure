import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Team } from '../../entities/team.entity';
import { Product } from '../../entities/product.entity';
import { Order } from '../../entities/order.entity';
import { ProductCategory } from '../../entities/product-category.entity';

@Controller('admin/test-db')
export class TestDbConnectionController {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(ProductCategory)
    private categoriesRepository: Repository<ProductCategory>,
  ) {}

  @Get()
  async testConnection() {
    try {
      console.log('🧪 开始测试数据库连接...');

      // 测试用户表
      const userCount = await this.usersRepository.count();
      const users = await this.usersRepository.find({ take: 5 });
      console.log('✅ 用户表连接正常，总数:', userCount, '示例:', users.length);

      // 测试团队表
      const teamCount = await this.teamsRepository.count();
      const teams = await this.teamsRepository.find({ take: 5 });
      console.log('✅ 团队表连接正常，总数:', teamCount, '示例:', teams.length);

      // 测试商品表
      const productCount = await this.productsRepository.count();
      const products = await this.productsRepository.find({ take: 5 });
      console.log('✅ 商品表连接正常，总数:', productCount, '示例:', products.length);

      // 测试分类表
      const categoryCount = await this.categoriesRepository.count();
      const categories = await this.categoriesRepository.find({ take: 5 });
      console.log('✅ 分类表连接正常，总数:', categoryCount, '示例:', categories.length);

      // 测试订单表
      const orderCount = await this.ordersRepository.count();
      const orders = await this.ordersRepository.find({ take: 5 });
      console.log('✅ 订单表连接正常，总数:', orderCount, '示例:', orders.length);

      return {
        success: true,
        message: '数据库连接正常',
        data: {
          users: {
            total: userCount,
            sample: users.map(u => ({ id: u.id, username: u.username, role: u.role })),
          },
          teams: {
            total: teamCount,
            sample: teams.map(t => ({ id: t.id, name: t.name })),
          },
          products: {
            total: productCount,
            sample: products.map(p => ({ id: p.id, name: p.name })),
          },
          categories: {
            total: categoryCount,
            sample: categories.map(c => ({ id: c.id, name: c.name })),
          },
          orders: {
            total: orderCount,
            sample: orders.map(o => ({ id: o.id, order_no: o.order_no })),
          },
        },
      };
    } catch (error: any) {
      console.error('❌ 数据库连接测试失败:', error);
      return {
        success: false,
        message: '数据库连接失败',
        error: error.message,
        stack: error.stack,
      };
    }
  }
}

