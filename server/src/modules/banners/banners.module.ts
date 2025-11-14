import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BannersController } from './banners.controller';
import { BannersService } from './banners.service';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [BannersController],
  providers: [BannersService],
})
export class BannersModule {}

