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
import { TestDbConnectionController } from './test-db-connection.controller';
import { User } from '../../entities/user.entity';
import { Team } from '../../entities/team.entity';
import { Product } from '../../entities/product.entity';
import { Order } from '../../entities/order.entity';
import { ProductCategory } from '../../entities/product-category.entity';
import { Banner } from '../../entities/banner.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Team, Product, Order, ProductCategory, Banner]),
    UsersModule,
  ],
  controllers: [
    AdminController,
    AdminUsersController,
    AdminTeamsController,
    AdminProductsController,
    AdminOrdersController,
    AdminBannersController,
    TestDbConnectionController,
  ],
  providers: [
    AdminService,
    AdminUsersService,
    AdminTeamsService,
    AdminProductsService,
    AdminOrdersService,
    AdminBannersService,
  ],
  exports: [
    AdminService,
    AdminUsersService,
    AdminTeamsService,
    AdminProductsService,
    AdminOrdersService,
    AdminBannersService,
  ],
})
export class AdminModule {}

