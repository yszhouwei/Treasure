import { Controller, Post, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';

@Controller('auth/test-password')
export class TestPasswordController {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  @Post()
  async testPassword(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    
    console.log('🧪 测试密码验证');
    console.log('用户名:', username);
    console.log('密码:', password);
    
    const user = await this.usersRepository.findOne({
      where: { username },
    });
    
    if (!user) {
      return {
        success: false,
        message: '用户不存在',
      };
    }
    
    console.log('找到用户:', {
      id: user.id,
      username: user.username,
      role: user.role,
      status: user.status,
      passwordLength: user.password?.length,
      passwordHash: user.password?.substring(0, 30) + '...',
    });
    
    // 测试密码验证
    const isValid = await bcrypt.compare(password, user.password);
    
    // 生成新哈希用于对比
    const newHash = await bcrypt.hash(password, 10);
    const newHashValid = await bcrypt.compare(password, newHash);
    
    return {
      success: true,
      data: {
        userExists: true,
        userStatus: user.status,
        userRole: user.role,
        passwordValid: isValid,
        passwordLength: user.password?.length,
        passwordHashPreview: user.password?.substring(0, 30) + '...',
        testNewHash: {
          hash: newHash.substring(0, 30) + '...',
          valid: newHashValid,
        },
      },
    };
  }
}

