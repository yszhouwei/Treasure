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
  ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('category_id') categoryId?: number,
    @Query('is_hot') isHot?: number,
    @Query('is_recommend') isRecommend?: number,
  ) {
    return this.productsService.findAll({
      page,
      limit,
      categoryId,
      isHot,
      isRecommend,
    });
  }

  @Get('hot')
  async findHot() {
    return this.productsService.findHot();
  }

  @Get('recommend')
  async findRecommend() {
    return this.productsService.findRecommend();
  }

  @Get('by-group-size/:groupSize')
  async findByGroupSize(@Param('groupSize', ParseIntPipe) groupSize: number) {
    return this.productsService.findByGroupSize(groupSize);
  }

  // 注意：这个路由必须放在最后，否则会匹配到上面的路由
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.productsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.productsService.remove(id);
  }
}

