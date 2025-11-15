import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from '../../entities/product.entity';
import { ProductCategory } from '../../entities/product-category.entity';
import { GroupBuying } from '../../entities/group-buying.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductCategory, GroupBuying])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}

