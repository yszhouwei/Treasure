import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll(@Request() req, @Query('status') status?: number) {
    try {
      const statusNum = status !== undefined ? Number(status) : undefined;
      return await this.ordersService.findAll(req.user.userId, statusNum);
    } catch (error) {
      console.error('获取订单列表失败:', error);
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: number) {
    return this.ordersService.findOne(req.user.userId, id);
  }

  @Post()
  async create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    try {
      return await this.ordersService.create(req.user.userId, createOrderDto);
    } catch (error) {
      console.error('订单控制器错误:', error);
      // 重新抛出错误，让 NestJS 的异常过滤器处理
      throw error;
    }
  }

  @Post(':id/pay')
  async payOrder(@Request() req, @Param('id') id: number, @Body() body: { payment_method: string }) {
    return this.ordersService.payOrder(req.user.userId, id, body.payment_method);
  }
}

