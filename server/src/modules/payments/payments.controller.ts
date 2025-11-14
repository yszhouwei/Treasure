import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('recharge')
  async recharge(@Request() req, @Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.recharge(req.user.userId, createPaymentDto);
  }

  @Post('withdraw')
  async withdraw(@Request() req, @Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.withdraw(req.user.userId, createPaymentDto);
  }
}

