import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content } from '../../entities/content.entity';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Injectable()
export class AdminContentsService {
  constructor(
    @InjectRepository(Content)
    private contentsRepository: Repository<Content>,
  ) {}

  async findAll(type?: string) {
    try {
      const where: any = {};
      if (type) {
        where.type = type;
      }
      const contents = await this.contentsRepository.find({
        where,
        order: { sort_order: 'ASC', id: 'DESC' },
      });
      console.log('✅ 查询到内容数量:', contents.length);
      return contents;
    } catch (error) {
      console.error('❌ 查询内容失败:', error);
      throw error;
    }
  }

  async findOne(id: number) {
    const content = await this.contentsRepository.findOne({ where: { id } });
    if (!content) {
      throw new NotFoundException('内容不存在');
    }
    return content;
  }

  async create(createContentDto: CreateContentDto) {
    try {
      console.log('📝 创建内容:', createContentDto);
      
      const data: any = {
        ...createContentDto,
        content: createContentDto.content || null,
        category: createContentDto.category || null,
        cover_image: createContentDto.cover_image || null,
        author: createContentDto.author || null,
        view_count: createContentDto.view_count ?? 0,
        like_count: createContentDto.like_count ?? 0,
        collect_count: createContentDto.collect_count ?? 0,
        status: createContentDto.status ?? 1,
        is_recommend: createContentDto.is_recommend ?? 0,
        sort_order: createContentDto.sort_order ?? 0,
        published_at: createContentDto.published_at || null,
      };
      
      const content = this.contentsRepository.create(data);
      const saved = await this.contentsRepository.save(content);
      const result = Array.isArray(saved) ? saved[0] : saved;
      console.log('✅ 内容创建成功, ID:', result.id);
      return result;
    } catch (error) {
      console.error('❌ 创建内容失败:', error);
      throw error;
    }
  }

  async update(id: number, updateContentDto: UpdateContentDto) {
    try {
      console.log('📝 更新内容, ID:', id, '数据:', updateContentDto);
      const content = await this.findOne(id);
      
      const data: any = {
        ...updateContentDto,
      };
      
      if (data.content === '') data.content = null;
      if (data.category === '') data.category = null;
      if (data.cover_image === '') data.cover_image = null;
      if (data.author === '') data.author = null;
      if (data.published_at === '') data.published_at = null;
      
      Object.assign(content, data);
      const saved = await this.contentsRepository.save(content);
      const result = Array.isArray(saved) ? saved[0] : saved;
      console.log('✅ 内容更新成功');
      return result;
    } catch (error) {
      console.error('❌ 更新内容失败:', error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      console.log('🗑️ 删除内容, ID:', id);
      const content = await this.contentsRepository.findOne({ where: { id } });
      if (!content) {
        throw new NotFoundException('内容不存在');
      }
      await this.contentsRepository.remove(content);
      console.log('✅ 内容删除成功, ID:', id);
      return { message: '删除成功', id };
    } catch (error) {
      console.error('❌ 删除内容失败:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`删除内容失败: ${error.message || error}`);
    }
  }
}

