import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    const { password, ...result } = user;
    return result as any;
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: [{ username }, { email: username }, { phone: username }],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('用户不存在');
      }

      console.log('更新用户信息 - 用户ID:', id);
      console.log('更新数据:', updateUserDto);

      // 只更新提供的字段
      if (updateUserDto.nickname !== undefined) {
        user.nickname = updateUserDto.nickname;
      }
      if (updateUserDto.email !== undefined) {
        user.email = updateUserDto.email;
      }
      if (updateUserDto.phone !== undefined) {
        user.phone = updateUserDto.phone;
      }
      if (updateUserDto.avatar !== undefined) {
        user.avatar = updateUserDto.avatar;
      }
      if (updateUserDto.bio !== undefined) {
        user.bio = updateUserDto.bio;
      }
      if (updateUserDto.gender !== undefined) {
        user.gender = updateUserDto.gender;
      }
      if (updateUserDto.birthday !== undefined) {
        user.birthday = new Date(updateUserDto.birthday);
      }

      const updated = await this.usersRepository.save(user);
      console.log('更新成功:', updated);
      const { password, ...result } = updated;
      return result as any;
    } catch (error) {
      console.error('更新用户信息失败:', error);
      throw error;
    }
  }
}

