import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentsController } from './contents.controller';
import { ContentsService } from './contents.service';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [ContentsController],
  providers: [ContentsService],
})
export class ContentsModule {}

