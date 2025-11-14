import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async findAll(userId: number, status?: number) {
    const where: any = { user_id: userId };
    if (status !== undefined) {
      where.status = status;
    }

    return this.ordersRepository.find({
      where,
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('订单不存在');
    }
    return order;
  }

  async create(userId: number, createOrderDto: CreateOrderDto): Promise<Order> {
    const orderNo = this.generateOrderNo();
    const order = this.ordersRepository.create({
      ...createOrderDto,
      user_id: userId,
      order_no: orderNo,
      status: 0, // 待支付
    });

    return this.ordersRepository.save(order);
  }

  private generateOrderNo(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `TBX${timestamp}${random.toString().padStart(4, '0')}`;
  }
}

