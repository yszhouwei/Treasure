import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banner } from '../../entities/banner.entity';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Injectable()
export class AdminBannersService {
  constructor(
    @InjectRepository(Banner)
    private bannersRepository: Repository<Banner>,
  ) {}

  async findAll() {
    try {
      const banners = await this.bannersRepository.find({
        order: { sort_order: 'ASC', id: 'DESC' },
      });
      console.log('✅ 查询到轮播图数量:', banners.length);
      return banners;
    } catch (error) {
      console.error('❌ 查询轮播图失败:', error);
      throw error;
    }
  }

  async findOne(id: number) {
    const banner = await this.bannersRepository.findOne({ where: { id } });
    if (!banner) {
      throw new NotFoundException('轮播图不存在');
    }
    return banner;
  }

  async create(createBannerDto: CreateBannerDto) {
    try {
      console.log('📝 创建轮播图:', createBannerDto);
      
      // 处理空值，转换为null
      const data: any = {
        ...createBannerDto,
        title: createBannerDto.title || null,
        link_url: createBannerDto.link_url || null,
        link_type: createBannerDto.link_type || null,
        sort_order: createBannerDto.sort_order ?? 0,
        status: createBannerDto.status ?? 1,
        start_time: createBannerDto.start_time || null,
        end_time: createBannerDto.end_time || null,
      };
      
      const banner = this.bannersRepository.create(data);
      const saved = await this.bannersRepository.save(banner);
      // save() 可能返回数组或单个实体，确保返回单个实体
      const result = Array.isArray(saved) ? saved[0] : saved;
      console.log('✅ 轮播图创建成功, ID:', result.id);
      return result;
    } catch (error) {
      console.error('❌ 创建轮播图失败:', error);
      throw error;
    }
  }

  async update(id: number, updateBannerDto: UpdateBannerDto) {
    try {
      console.log('📝 更新轮播图, ID:', id, '数据:', updateBannerDto);
      const banner = await this.findOne(id);
      
      // 处理空值，转换为null
      const data: any = {
        ...updateBannerDto,
      };
      
      // 如果字段存在且为空字符串，转换为null
      if (data.title === '') data.title = null;
      if (data.link_url === '') data.link_url = null;
      if (data.link_type === '') data.link_type = null;
      if (data.start_time === '') data.start_time = null;
      if (data.end_time === '') data.end_time = null;
      
      Object.assign(banner, data);
      const saved = await this.bannersRepository.save(banner);
      // save() 可能返回数组或单个实体，确保返回单个实体
      const result = Array.isArray(saved) ? saved[0] : saved;
      console.log('✅ 轮播图更新成功');
      return result;
    } catch (error) {
      console.error('❌ 更新轮播图失败:', error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      console.log('🗑️ 删除轮播图, ID:', id);
      const banner = await this.bannersRepository.findOne({ where: { id } });
      if (!banner) {
        throw new NotFoundException('轮播图不存在');
      }
      await this.bannersRepository.remove(banner);
      console.log('✅ 轮播图删除成功, ID:', id);
      return { message: '删除成功', id };
    } catch (error) {
      console.error('❌ 删除轮播图失败:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`删除轮播图失败: ${error.message || error}`);
    }
  }
}

