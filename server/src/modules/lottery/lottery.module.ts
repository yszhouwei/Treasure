import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LotteryController } from './lottery.controller';
import { LotteryService } from './lottery.service';
import { LotteryRecord } from '../../entities/lottery-record.entity';
import { LotteryWinner } from '../../entities/lottery-winner.entity';
import { Dividend } from '../../entities/dividend.entity';
import { GroupBuying } from '../../entities/group-buying.entity';
import { Order } from '../../entities/order.entity';
import { User } from '../../entities/user.entity';
import { Product } from '../../entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([LotteryRecord, LotteryWinner, Dividend, GroupBuying, Order, User, Product]),
  ],
  controllers: [LotteryController],
  providers: [LotteryService],
  exports: [LotteryService],
})
export class LotteryModule {}

