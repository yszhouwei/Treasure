import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../entities/order.entity';
import { Product } from '../../entities/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async findAll(userId: number, status?: number) {
    try {
      // 确保 userId 是数字类型
      if (!userId || typeof userId !== 'number') {
        throw new Error('用户ID无效');
      }

      const queryBuilder = this.ordersRepository
        .createQueryBuilder('order')
        .where('order.user_id = :userId', { userId });

      if (status !== undefined && status !== null) {
        const statusNum = Number(status);
        if (!isNaN(statusNum)) {
          queryBuilder.andWhere('order.status = :status', { status: statusNum });
        }
      }

      const orders = await queryBuilder
        .orderBy('order.created_at', 'DESC')
        .getMany();

      return orders;
    } catch (error) {
      console.error('获取订单列表失败:', error);
      console.error('错误堆栈:', error.stack);
      if (error.code) {
        console.error('数据库错误代码:', error.code);
        console.error('数据库错误详情:', error.sqlMessage || error.message);
      }
      throw new InternalServerErrorException({
        message: `获取订单列表失败: ${error.message || '未知错误'}`,
        error: error.code || 'UNKNOWN_ERROR',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  async findOne(userId: number, id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({ 
      where: { id, user_id: userId } 
    });
    if (!order) {
      throw new NotFoundException('订单不存在');
    }
    return order;
  }

  async create(userId: number, createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      // 获取商品信息
      const product = await this.productsRepository.findOne({
        where: { id: createOrderDto.product_id, status: 1 }
      });

      if (!product) {
        throw new NotFoundException('商品不存在或已下架');
      }

      // 计算价格
      const unitPrice = parseFloat(String(product.group_price)) || 0;
      if (unitPrice <= 0) {
        throw new Error('商品价格无效');
      }
      
      const quantity = createOrderDto.quantity || 1;
      if (quantity <= 0 || quantity > 999) {
        throw new Error('商品数量无效');
      }
      
      const totalAmount = parseFloat((unitPrice * quantity).toFixed(2));
      const discountAmount = 0; // 可以根据业务逻辑计算折扣
      const actualAmount = parseFloat((totalAmount - discountAmount).toFixed(2));
      
      // 验证金额是否有效
      if (isNaN(totalAmount) || isNaN(actualAmount) || totalAmount <= 0 || actualAmount <= 0) {
        throw new Error('订单金额计算错误');
      }

      // 处理商品图片
      let productImage = product.image_url || null;
      if (!productImage && product.images) {
        try {
          const images = JSON.parse(product.images);
          if (Array.isArray(images) && images.length > 0) {
            productImage = images[0];
          }
        } catch (e) {
          // 忽略解析错误
        }
      }

      // 处理收货地址
      let shippingAddressStr = null;
      if (createOrderDto.shipping_address) {
        shippingAddressStr = typeof createOrderDto.shipping_address === 'string'
          ? createOrderDto.shipping_address
          : JSON.stringify(createOrderDto.shipping_address);
      }

      // 确保商品名称不超过长度限制
      const productName = product.name.length > 200 
        ? product.name.substring(0, 200) 
        : product.name;

      const orderNo = await this.generateOrderNo();
      const order = this.ordersRepository.create({
        user_id: userId,
        product_id: createOrderDto.product_id,
        team_id: createOrderDto.team_id || null,
        product_name: productName,
        product_image: productImage,
        quantity: quantity,
        unit_price: unitPrice,
        total_amount: totalAmount,
        discount_amount: discountAmount,
        actual_amount: actualAmount,
        shipping_address: shippingAddressStr,
        order_no: orderNo,
        status: 0, // 待支付
      });

      return await this.ordersRepository.save(order);
    } catch (error) {
      console.error('创建订单失败:', error);
      console.error('错误堆栈:', error.stack);
      if (error instanceof NotFoundException) {
        throw error;
      }
      // 如果是数据库错误，提供更详细的错误信息
      if (error.code) {
        console.error('数据库错误代码:', error.code);
        console.error('数据库错误详情:', error.sqlMessage || error.message);
      }
      // 返回更详细的错误信息
      const errorMessage = error.message || '未知错误';
      throw new InternalServerErrorException({
        message: `创建订单失败: ${errorMessage}`,
        error: error.code || 'UNKNOWN_ERROR',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  async payOrder(userId: number, orderId: number, paymentMethod: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({ 
      where: { id: orderId, user_id: userId } 
    });

    if (!order) {
      throw new NotFoundException('订单不存在');
    }

    if (order.status !== 0) {
      throw new Error('订单状态不正确，无法支付');
    }

    // 更新订单状态为已支付
    order.status = 1; // 已支付
    order.payment_method = paymentMethod;
    order.payment_time = new Date();

    return this.ordersRepository.save(order);
  }

  private async generateOrderNo(): Promise<string> {
    let orderNo: string;
    let exists = true;
    let attempts = 0;
    const maxAttempts = 10;

    // 确保订单号唯一
    while (exists && attempts < maxAttempts) {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 100000);
      orderNo = `TBX${timestamp}${random.toString().padStart(6, '0')}`;
      
      const existingOrder = await this.ordersRepository.findOne({
        where: { order_no: orderNo }
      });
      
      exists = !!existingOrder;
      attempts++;
      
      if (exists) {
        // 如果订单号已存在，等待1毫秒后重试
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }

    if (attempts >= maxAttempts) {
      throw new Error('无法生成唯一订单号，请重试');
    }

    return orderNo!;
  }
}

