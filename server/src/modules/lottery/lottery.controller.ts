import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { LotteryService } from './lottery.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('lottery')
@UseGuards(JwtAuthGuard)
export class LotteryController {
  constructor(private readonly lotteryService: LotteryService) {}

  @Post('draw/:groupId')
  async drawLottery(@Request() req, @Param('groupId') groupId: number) {
    return this.lotteryService.drawLottery(groupId, req.user.userId);
  }

  @Get('result/:groupId')
  async getLotteryResult(@Param('groupId') groupId: number) {
    return this.lotteryService.getLotteryResult(groupId);
  }

  @Get('my-records')
  async getMyLotteryRecords(@Request() req) {
    return this.lotteryService.getMyLotteryRecords(req.user.userId);
  }
}

