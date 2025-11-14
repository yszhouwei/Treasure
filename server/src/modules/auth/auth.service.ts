import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { username, password, email, phone } = registerDto;

    // 检查用户是否已存在
    const existingUser = await this.usersRepository.findOne({
      where: [
        { username },
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : []),
      ],
    });

    if (existingUser) {
      throw new UnauthorizedException('用户已存在');
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 生成邀请码
    const inviteCode = this.generateInviteCode();

    // 创建用户
    const user = this.usersRepository.create({
      username,
      password: hashedPassword,
      email,
      phone,
      invite_code: inviteCode,
      nickname: registerDto.nickname || username,
    });

    const savedUser = await this.usersRepository.save(user);

    // 生成JWT token
    const payload = { sub: savedUser.id, username: savedUser.username };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: savedUser.id,
        username: savedUser.username,
        email: savedUser.email,
        phone: savedUser.phone,
        nickname: savedUser.nickname,
        avatar: savedUser.avatar,
        balance: savedUser.balance,
        points: savedUser.points,
        level: savedUser.level,
      },
    };
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: [{ username }, { email: username }, { phone: username }],
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        nickname: user.nickname,
        avatar: user.avatar,
        balance: user.balance,
        points: user.points,
        level: user.level,
        is_team_leader: user.is_team_leader,
        team_id: user.team_id,
      },
    };
  }

  private generateInviteCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 10; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}

