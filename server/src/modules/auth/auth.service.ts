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
    console.log(`[validateUser] 开始验证用户: ${username}`);
    console.log(`[validateUser] 接收到的密码长度: ${password?.length}`);
    
    const user = await this.usersRepository.findOne({
      where: [{ username }, { email: username }, { phone: username }],
    });

    if (!user) {
      console.log(`[validateUser] ❌ 用户不存在: ${username}`);
      return null;
    }

    console.log(`[validateUser] ✅ 找到用户:`, {
      id: user.id,
      username: user.username,
      role: user.role,
      status: user.status,
      passwordLength: user.password?.length,
      passwordPreview: user.password?.substring(0, 20) + '...',
    });

    // 检查用户状态
    if (user.status === 0) {
      console.log(`[validateUser] ❌ 用户已被禁用: ${username}`);
      throw new UnauthorizedException('账户已被禁用');
    }

    // 检查密码字段
    if (!user.password) {
      console.log(`[validateUser] ❌ 用户密码字段为空: ${username}`);
      return null;
    }

    // 验证密码
    console.log(`[validateUser] 开始验证密码...`);
    console.log(`[validateUser] 数据库密码哈希: ${user.password.substring(0, 30)}...`);
    
    try {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log(`[validateUser] 密码验证结果: ${isPasswordValid}`);
      
      if (!isPasswordValid) {
        // 尝试直接比较（调试用）
        console.log(`[validateUser] ⚠️ 密码验证失败，尝试调试...`);
        console.log(`[validateUser] 输入密码: ${password}`);
        console.log(`[validateUser] 数据库哈希: ${user.password}`);
        
        // 测试生成新哈希
        const testHash = await bcrypt.hash(password, 10);
        console.log(`[validateUser] 新生成的哈希: ${testHash}`);
        console.log(`[validateUser] 新哈希验证: ${await bcrypt.compare(password, testHash)}`);
      }
      
      if (isPasswordValid) {
        const { password: _, ...result } = user;
        console.log(`[validateUser] ✅ 验证成功，返回用户信息`);
        return result;
      }
      
      console.log(`[validateUser] ❌ 密码错误: ${username}`);
      return null;
    } catch (error) {
      console.error(`[validateUser] ❌ 密码验证异常:`, error);
      return null;
    }
  }

  async login(user: any) {
    const payload = { sub: user.id, username: user.username, role: user.role };
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
        role: user.role,
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

