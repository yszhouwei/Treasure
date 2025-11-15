import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banner } from '../../entities/banner.entity';

@Injectable()
export class BannersService {
  constructor(
    @InjectRepository(Banner)
    private bannersRepository: Repository<Banner>,
  ) {}

  async findAll() {
    // 只返回启用的轮播图，并按排序和ID排序
    return this.bannersRepository.find({
      where: { status: 1 },
      order: { sort_order: 'ASC', id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const banner = await this.bannersRepository.findOne({ where: { id } });
    if (!banner) {
      throw new Error('轮播图不存在');
    }
    return banner;
  }

  async create(data: Partial<Banner>) {
    const banner = this.bannersRepository.create(data);
    return this.bannersRepository.save(banner);
  }

  async update(id: number, data: Partial<Banner>) {
    const banner = await this.findOne(id);
    Object.assign(banner, data);
    return this.bannersRepository.save(banner);
  }

  async remove(id: number) {
    const banner = await this.findOne(id);
    await this.bannersRepository.remove(banner);
    return { message: '删除成功' };
  }
}

