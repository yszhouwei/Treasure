import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { AdminLotteryService } from './lottery.service';

@Controller('admin/lottery')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminLotteryController {
  constructor(private readonly adminLotteryService: AdminLotteryService) {}

  @Get()
  async findAll() {
    return this.adminLotteryService.findAll();
  }

  @Get('statistics')
  async getStatistics() {
    return this.adminLotteryService.getStatistics();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.adminLotteryService.findOne(Number(id));
  }
}

