import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Order } from '../../entities/order.entity';

@Injectable()
export class AdminOrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async findAll(page: number = 1, pageSize: number = 10, keyword?: string, status?: string) {
    const skip = (page - 1) * pageSize;
    const where: any = {};

    if (keyword) {
      where.order_no = Like(`%${keyword}%`);
    }

    if (status) {
      where.status = parseInt(status);
    }

    const [data, total] = await this.ordersRepository.findAndCount({
      where,
      relations: ['user', 'product', 'team'],
      skip,
      take: pageSize,
      order: { created_at: 'DESC' },
    });

    return {
      data: data.map(order => ({
        id: order.id,
        orderNo: order.order_no,
        productName: order.product_name,
        customerName: order.user?.nickname || order.user?.username || '未知',
        customerId: order.user_id,
        amount: parseFloat(String(order.actual_amount || 0)),
        status: this.getStatusText(order.status),
        statusCode: order.status,
        paymentMethod: order.payment_method,
        paymentTime: order.payment_time,
        createdAt: order.created_at,
      })),
      total,
      page,
      pageSize,
    };
  }

  async findOne(id: number) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['user', 'product', 'team'],
    });

    if (!order) {
      throw new NotFoundException('订单不存在');
    }

    return {
      id: order.id,
      orderNo: order.order_no,
      productName: order.product_name,
      productImage: order.product_image,
      customerName: order.user?.nickname || order.user?.username || '未知',
      customerId: order.user_id,
      teamName: order.team?.name,
      quantity: order.quantity,
      unitPrice: parseFloat(String(order.unit_price || 0)),
      totalAmount: parseFloat(String(order.total_amount || 0)),
      discountAmount: parseFloat(String(order.discount_amount || 0)),
      actualAmount: parseFloat(String(order.actual_amount || 0)),
      status: this.getStatusText(order.status),
      statusCode: order.status,
      paymentMethod: order.payment_method,
      paymentTime: order.payment_time,
      shippingAddress: order.shipping_address,
      shippingCompany: order.shipping_company,
      shippingNo: order.shipping_no,
      shippingTime: order.shipping_time,
      completedTime: order.completed_time,
      remark: order.remark,
      createdAt: order.created_at,
    };
  }

  private getStatusText(status: number): string {
    const statusMap: Record<number, string> = {
      0: 'pending',
      1: 'paid',
      2: 'completed',
      3: 'cancelled',
    };
    return statusMap[status] || 'unknown';
  }
}

