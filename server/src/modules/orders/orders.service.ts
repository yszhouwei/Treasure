import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../entities/order.entity';
import { Product } from '../../entities/product.entity';
import { User } from '../../entities/user.entity';
import { Payment } from '../../entities/payment.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
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

  async payOrder(userId: number, orderId: number, paymentMethod: string): Promise<any> {
    const order = await this.ordersRepository.findOne({ 
      where: { id: orderId, user_id: userId } 
    });

    if (!order) {
      throw new NotFoundException('订单不存在');
    }

    if (order.status !== 0) {
      throw new BadRequestException('订单状态不正确，无法支付');
    }

    const orderAmount = parseFloat(String(order.actual_amount));

    // 如果是余额支付，直接处理
    if (paymentMethod === 'balance') {
      const user = await this.usersRepository.findOne({
        where: { id: userId }
      });

      if (!user) {
        throw new NotFoundException('用户不存在');
      }

      const userBalance = parseFloat(String(user.balance || 0));

      if (userBalance < orderAmount) {
        throw new BadRequestException(`余额不足，当前余额：¥${userBalance.toFixed(2)}，需要支付：¥${orderAmount.toFixed(2)}`);
      }

      // 扣除余额
      user.balance = parseFloat((userBalance - orderAmount).toFixed(2));
      await this.usersRepository.save(user);

      // 更新订单状态为已支付
      order.status = 1; // 已支付
      order.payment_method = paymentMethod;
      order.payment_time = new Date();
      await this.ordersRepository.save(order);

      return {
        success: true,
        message: '支付成功',
        order,
        payment_type: 'balance',
      };
    }

    // 对于第三方支付（微信、支付宝、PayPal、Stripe等），需要调用支付接口
    // 这里返回支付信息，让前端跳转到支付页面或显示支付二维码
    // 实际项目中应该调用对应的支付SDK
    
    // 先创建支付记录（待支付状态）
    const payment = this.paymentsRepository.create({
      payment_no: `PAY${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
      order_id: order.id,
      order_no: order.order_no,
      user_id: userId,
      amount: orderAmount,
      payment_method: paymentMethod,
      payment_channel: paymentMethod,
      status: 0, // 待支付
    });
    await this.paymentsRepository.save(payment);

    // 根据不同的支付方式返回不同的支付信息
    let paymentData: any = {
      success: true,
      message: '请完成支付',
      payment_id: payment.id,
      payment_no: payment.payment_no,
      amount: orderAmount,
      payment_method: paymentMethod,
      order_id: order.id,
    };

    // 根据支付方式返回不同的支付信息
    if (paymentMethod === 'wechat_pay') {
      // 微信支付：返回支付参数或二维码
      paymentData.payment_type = 'wechat';
      paymentData.message = '请使用微信扫码支付';
      // 实际应该调用微信支付API获取支付参数
      // paymentData.pay_params = await this.wechatPayService.createPayment(...);
    } else if (paymentMethod === 'alipay') {
      // 支付宝：返回支付链接或表单
      paymentData.payment_type = 'alipay';
      paymentData.message = '请使用支付宝支付';
      // 实际应该调用支付宝API获取支付链接
      // paymentData.pay_url = await this.alipayService.createPayment(...);
    } else if (paymentMethod.startsWith('usdt_')) {
      // USDT支付：返回支付地址和金额
      paymentData.payment_type = 'crypto';
      paymentData.message = '请向以下地址转账USDT';
      paymentData.crypto_address = 'TYourUSDTAddressHere'; // 实际应该从配置中获取
      paymentData.crypto_amount = orderAmount; // 实际应该根据汇率计算
      paymentData.network = paymentMethod.replace('usdt_', '').toUpperCase(); // TRC20, ERC20, BEP20
    } else if (paymentMethod === 'paypal' || paymentMethod === 'stripe') {
      // PayPal/Stripe：返回支付链接
      paymentData.payment_type = 'online';
      paymentData.message = `请使用${paymentMethod === 'paypal' ? 'PayPal' : 'Stripe'}完成支付`;
      // 实际应该调用对应的支付API
      // paymentData.pay_url = await this.paypalService.createPayment(...);
    } else {
      // 其他支付方式：返回待支付状态
      paymentData.payment_type = 'other';
      paymentData.message = '支付处理中，请稍候...';
    }

    return paymentData;
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

