import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminUsersController } from './users.controller';
import { AdminUsersService } from './users.service';
import { AdminTeamsController } from './teams.controller';
import { AdminTeamsService } from './teams.service';
import { AdminProductsController } from './products.controller';
import { AdminProductsService } from './products.service';
import { AdminOrdersController } from './orders.controller';
import { AdminOrdersService } from './orders.service';
import { AdminBannersController } from './banners.controller';
import { AdminBannersService } from './banners.service';
import { AdminContentsController } from './contents.controller';
import { AdminContentsService } from './contents.service';
import { AdminLotteryController } from './lottery.controller';
import { AdminLotteryService } from './lottery.service';
import { AdminPaymentsController } from './payments.controller';
import { AdminPaymentsService } from './payments.service';
import { AdminMessagesController } from './messages.controller';
import { AdminMessagesService } from './messages.service';
import { AdminPaymentPluginsController } from './payment-plugins.controller';
import { AdminPaymentPluginsService } from './payment-plugins.service';
import { TestDbConnectionController } from './test-db-connection.controller';
import { User } from '../../entities/user.entity';
import { Team } from '../../entities/team.entity';
import { Product } from '../../entities/product.entity';
import { Order } from '../../entities/order.entity';
import { ProductCategory } from '../../entities/product-category.entity';
import { Banner } from '../../entities/banner.entity';
import { Content } from '../../entities/content.entity';
import { LotteryRecord } from '../../entities/lottery-record.entity';
import { LotteryWinner } from '../../entities/lottery-winner.entity';
import { Dividend } from '../../entities/dividend.entity';
import { GroupBuying } from '../../entities/group-buying.entity';
import { Payment } from '../../entities/payment.entity';
import { Notification } from '../../entities/notification.entity';
import { PaymentPlugin } from '../../entities/payment-plugin.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, 
      Team, 
      Product, 
      Order, 
      ProductCategory, 
      Banner, 
      Content,
      LotteryRecord,
      LotteryWinner,
      Dividend,
      GroupBuying,
      Payment,
      Notification,
      PaymentPlugin,
    ]),
    UsersModule,
  ],
  controllers: [
    AdminController,
    AdminUsersController,
    AdminTeamsController,
    AdminProductsController,
    AdminOrdersController,
    AdminBannersController,
    AdminContentsController,
    AdminLotteryController,
    AdminPaymentsController,
    AdminMessagesController,
    AdminPaymentPluginsController,
    TestDbConnectionController,
  ],
  providers: [
    AdminService,
    AdminUsersService,
    AdminTeamsService,
    AdminProductsService,
    AdminOrdersService,
    AdminBannersService,
    AdminContentsService,
    AdminLotteryService,
    AdminPaymentsService,
    AdminMessagesService,
    AdminPaymentPluginsService,
  ],
  exports: [
    AdminService,
    AdminUsersService,
    AdminTeamsService,
    AdminProductsService,
    AdminOrdersService,
    AdminBannersService,
    AdminContentsService,
    AdminLotteryService,
    AdminPaymentsService,
    AdminMessagesService,
    AdminPaymentPluginsService,
  ],
})
export class AdminModule {}

