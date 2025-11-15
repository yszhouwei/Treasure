import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { ProductCategory } from '../../entities/product-category.entity';
import { GroupBuying } from '../../entities/group-buying.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

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

  async findAllCategories(includeDisabled: boolean = false) {
    const where: any = {};
    if (!includeDisabled) {
      where.status = 1;
    }
    const categories = await this.categoriesRepository.find({
      where,
      order: { sort_order: 'DESC', id: 'ASC' },
    });
    return categories.map(category => ({
      id: category.id,
      name: category.name,
      sortOrder: category.sort_order,
    }));
  }

  async findCategoryById(id: number) {
    const category = await this.categoriesRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('分类不存在');
    }
    return {
      id: category.id,
      name: category.name,
      parentId: category.parent_id,
      icon: category.icon,
      sortOrder: category.sort_order,
      status: category.status,
    };
  }

  async createCategory(createCategoryDto: CreateCategoryDto) {
    // 检查分类名称是否已存在
    const existingCategory = await this.categoriesRepository.findOne({
      where: { name: createCategoryDto.name },
    });

    if (existingCategory) {
      throw new BadRequestException('分类名称已存在');
    }

    const category = this.categoriesRepository.create({
      name: createCategoryDto.name,
      parent_id: createCategoryDto.parentId || 0,
      icon: createCategoryDto.icon,
      sort_order: createCategoryDto.sortOrder || 0,
      status: 1,
    });

    const saved = await this.categoriesRepository.save(category);
    return this.findCategoryById(saved.id);
  }

  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoriesRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('分类不存在');
    }

    // 如果更新名称，检查是否与其他分类重复
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existingCategory = await this.categoriesRepository.findOne({
        where: { name: updateCategoryDto.name },
      });

      if (existingCategory && existingCategory.id !== id) {
        throw new BadRequestException('分类名称已存在');
      }
    }

    if (updateCategoryDto.name !== undefined) {
      category.name = updateCategoryDto.name;
    }
    if (updateCategoryDto.parentId !== undefined) {
      category.parent_id = updateCategoryDto.parentId;
    }
    if (updateCategoryDto.icon !== undefined) {
      category.icon = updateCategoryDto.icon;
    }
    if (updateCategoryDto.sortOrder !== undefined) {
      category.sort_order = updateCategoryDto.sortOrder;
    }
    if (updateCategoryDto.status !== undefined) {
      category.status = updateCategoryDto.status;
    }

    await this.categoriesRepository.save(category);
    return this.findCategoryById(id);
  }

  async removeCategory(id: number) {
    const category = await this.categoriesRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('分类不存在');
    }

    // 检查是否有商品使用此分类
    const productsCount = await this.productsRepository.count({
      where: { category_id: id },
    });

    if (productsCount > 0) {
      throw new BadRequestException(`该分类下有 ${productsCount} 个商品，无法删除`);
    }

    // 软删除：将状态设置为禁用
    category.status = 0;
    await this.categoriesRepository.save(category);

    return { message: '分类已删除' };
  }
}

