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
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    Object.assign(user, updateUserDto);
    const updated = await this.usersRepository.save(user);
    const { password, ...result } = updated;
    return result as any;
  }
}

