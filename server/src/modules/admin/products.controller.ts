import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BatchUpdateProductsDto } from './dto/batch-update-products.dto';
import { BatchDeleteProductsDto } from './dto/batch-delete-products.dto';

@Controller('admin/products')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminProductsController {
  constructor(private readonly adminProductsService: AdminProductsService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('keyword') keyword?: string,
  ) {
    return this.adminProductsService.findAll(page, pageSize, keyword);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.adminProductsService.findOne(id);
  }

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.adminProductsService.create(createProductDto);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.adminProductsService.update(id, updateProductDto);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: number,
    @Body() body: { status: 'active' | 'inactive' },
  ) {
    return this.adminProductsService.updateStatus(id, body.status);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.adminProductsService.remove(id);
  }

  @Post('batch/update')
  async batchUpdate(@Body() batchUpdateDto: BatchUpdateProductsDto) {
    return this.adminProductsService.batchUpdate(batchUpdateDto);
  }

  @Post('batch/delete')
  async batchDelete(@Body() batchDeleteDto: BatchDeleteProductsDto) {
    return this.adminProductsService.batchDelete(batchDeleteDto.ids);
  }
}

