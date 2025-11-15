import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BatchUpdateProductsDto } from './dto/batch-update-products.dto';

@Injectable()
export class AdminProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async findAll(page: number = 1, pageSize: number = 10, keyword?: string) {
    const skip = (page - 1) * pageSize;
    const where: any = {};

    if (keyword) {
      where.name = Like(`%${keyword}%`);
    }

    const [data, total] = await this.productsRepository.findAndCount({
      where,
      relations: ['category'],
      skip,
      take: pageSize,
      order: { created_at: 'DESC' },
    });

    return {
      data: data.map(product => ({
        id: product.id,
        name: product.name,
        category: product.category?.name || '未分类',
        categoryId: product.category_id,
        price: parseFloat(String(product.group_price || 0)),
        originalPrice: parseFloat(String(product.original_price || 0)),
        stock: product.stock,
        salesCount: product.sales_count,
        status: product.status === 1 ? 'active' : 'inactive',
        isHot: product.is_hot === 1,
        isRecommend: product.is_recommend === 1,
        createdAt: product.created_at,
      })),
      total,
      page,
      pageSize,
    };
  }

  async findOne(id: number) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException('商品不存在');
    }

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category?.name || '未分类',
      categoryId: product.category_id,
      imageUrl: product.image_url,
      images: product.images ? JSON.parse(product.images) : [],
      price: parseFloat(String(product.group_price || 0)),
      originalPrice: parseFloat(String(product.original_price || 0)),
      stock: product.stock,
      salesCount: product.sales_count,
      viewCount: product.view_count,
      status: product.status === 1 ? 'active' : 'inactive',
      isHot: product.is_hot === 1,
      isRecommend: product.is_recommend === 1,
      sortOrder: product.sort_order,
      specifications: product.specifications ? JSON.parse(product.specifications) : {},
      warranty: product.warranty,
      winnerCount: product.winner_count,
      dividendRate: parseFloat(String(product.dividend_rate || 0)),
      createdAt: product.created_at,
    };
  }

  async create(createProductDto: CreateProductDto) {
    const product = this.productsRepository.create({
      name: createProductDto.name,
      description: createProductDto.description,
      category_id: createProductDto.categoryId,
      image_url: createProductDto.imageUrl,
      images: createProductDto.images ? JSON.stringify(createProductDto.images) : null,
      original_price: createProductDto.originalPrice,
      group_price: createProductDto.price,
      stock: createProductDto.stock || 0,
      status: createProductDto.status === 'active' ? 1 : 0,
      is_hot: createProductDto.isHot ? 1 : 0,
      is_recommend: createProductDto.isRecommend ? 1 : 0,
      sort_order: createProductDto.sortOrder || 0,
      specifications: createProductDto.specifications ? JSON.stringify(createProductDto.specifications) : null,
      warranty: createProductDto.warranty,
      winner_count: createProductDto.winnerCount || 1,
      dividend_rate: createProductDto.dividendRate || 5.0,
    });

    const saved = await this.productsRepository.save(product);
    return this.findOne(saved.id);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('商品不存在');
    }

    if (updateProductDto.name !== undefined) {
      product.name = updateProductDto.name;
    }
    if (updateProductDto.description !== undefined) {
      product.description = updateProductDto.description;
    }
    if (updateProductDto.categoryId !== undefined) {
      product.category_id = updateProductDto.categoryId;
    }
    if (updateProductDto.imageUrl !== undefined) {
      product.image_url = updateProductDto.imageUrl;
    }
    if (updateProductDto.images !== undefined) {
      product.images = JSON.stringify(updateProductDto.images);
    }
    if (updateProductDto.price !== undefined) {
      product.group_price = updateProductDto.price;
    }
    if (updateProductDto.originalPrice !== undefined) {
      product.original_price = updateProductDto.originalPrice;
    }
    if (updateProductDto.stock !== undefined) {
      product.stock = updateProductDto.stock;
    }
    if (updateProductDto.status !== undefined) {
      product.status = updateProductDto.status === 'active' ? 1 : 0;
    }
    if (updateProductDto.isHot !== undefined) {
      product.is_hot = updateProductDto.isHot ? 1 : 0;
    }
    if (updateProductDto.isRecommend !== undefined) {
      product.is_recommend = updateProductDto.isRecommend ? 1 : 0;
    }
    if (updateProductDto.sortOrder !== undefined) {
      product.sort_order = updateProductDto.sortOrder;
    }
    if (updateProductDto.specifications !== undefined) {
      product.specifications = JSON.stringify(updateProductDto.specifications);
    }
    if (updateProductDto.warranty !== undefined) {
      product.warranty = updateProductDto.warranty;
    }

    await this.productsRepository.save(product);
    return this.findOne(id);
  }

  async updateStatus(id: number, status: 'active' | 'inactive') {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('商品不存在');
    }

    product.status = status === 'active' ? 1 : 0;
    await this.productsRepository.save(product);

    return this.findOne(id);
  }

  async remove(id: number) {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('商品不存在');
    }

    // 软删除：将状态设置为下架
    product.status = 0;
    await this.productsRepository.save(product);

    return { message: '商品已删除' };
  }

  async batchUpdate(batchUpdateDto: BatchUpdateProductsDto) {
    const { ids, status } = batchUpdateDto;

    if (!ids || ids.length === 0) {
      throw new BadRequestException('请选择要更新的商品');
    }

    if (status === undefined) {
      throw new BadRequestException('请指定要更新的状态');
    }

    await this.productsRepository.update(
      { id: In(ids) },
      { status: status === 'active' ? 1 : 0 },
    );

    return {
      message: `成功更新 ${ids.length} 个商品`,
      count: ids.length,
    };
  }

  async batchDelete(ids: number[]) {
    if (!ids || ids.length === 0) {
      throw new BadRequestException('请选择要删除的商品');
    }

    // 批量软删除：将状态设置为下架
    await this.productsRepository.update(
      { id: In(ids) },
      { status: 0 },
    );

    return {
      message: `成功删除 ${ids.length} 个商品`,
      count: ids.length,
    };
  }
}

