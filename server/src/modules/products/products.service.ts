import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { ProductCategory } from '../../entities/product-category.entity';
import { GroupBuying } from '../../entities/group-buying.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(ProductCategory)
    private categoriesRepository: Repository<ProductCategory>,
    @InjectRepository(GroupBuying)
    private groupBuyingRepository: Repository<GroupBuying>,
  ) {}

  async findAll(options: {
    page: number;
    limit: number;
    categoryId?: number;
    isHot?: number;
    isRecommend?: number;
  }) {
    const { page, limit, categoryId, isHot, isRecommend } = options;
    const queryBuilder = this.productsRepository
      .createQueryBuilder('product')
      .where('product.status = :status', { status: 1 });

    if (categoryId) {
      queryBuilder.andWhere('product.category_id = :categoryId', {
        categoryId,
      });
    }

    if (isHot !== undefined) {
      queryBuilder.andWhere('product.is_hot = :isHot', { isHot });
    }

    if (isRecommend !== undefined) {
      queryBuilder.andWhere('product.is_recommend = :isRecommend', {
        isRecommend,
      });
    }

    const [items, total] = await queryBuilder
      .orderBy('product.sort_order', 'DESC')
      .addOrderBy('product.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id, status: 1 },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException('商品不存在');
    }

    // 增加浏览量
    product.view_count += 1;
    await this.productsRepository.save(product);

    return product;
  }

  async findHot(): Promise<Product[]> {
    return this.productsRepository.find({
      where: { status: 1, is_hot: 1 },
      order: { sort_order: 'DESC', created_at: 'DESC' },
      take: 10,
    });
  }

  async findRecommend(): Promise<Product[]> {
    return this.productsRepository.find({
      where: { status: 1, is_recommend: 1 },
      order: { sort_order: 'DESC', created_at: 'DESC' },
      take: 10,
    });
  }

  async findByGroupSize(groupSize: number): Promise<Product[]> {
    // 查找该团购类型下的所有商品ID（从团购活动中获取）
    const groupBuyings = await this.groupBuyingRepository.find({
      where: { group_size: groupSize },
      select: ['product_id'],
    });

    // 提取唯一的商品ID
    const productIds = [...new Set(groupBuyings.map(gb => gb.product_id))];

    if (productIds.length === 0) {
      // 如果没有找到该类型的团购活动，返回空数组
      return [];
    }

    // 根据商品ID获取商品列表
    return this.productsRepository.find({
      where: {
        id: In(productIds),
        status: 1,
      },
      order: { sort_order: 'DESC', created_at: 'DESC' },
    });
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // 将 images 数组转换为 JSON 字符串
    const productData = {
      ...createProductDto,
      images: createProductDto.images
        ? JSON.stringify(createProductDto.images)
        : null,
    };
    const product = this.productsRepository.create(productData);
    return this.productsRepository.save(product);
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('商品不存在');
    }

    // 将 images 数组转换为 JSON 字符串（如果存在）
    const updateData: any = { ...updateProductDto };
    if (updateProductDto.images !== undefined) {
      updateData.images = updateProductDto.images
        ? JSON.stringify(updateProductDto.images)
        : null;
    }

    Object.assign(product, updateData);
    return this.productsRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('商品不存在');
    }

    product.status = 0;
    await this.productsRepository.save(product);
  }
}

