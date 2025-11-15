import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    console.log(`[LocalStrategy] ========== 开始验证 ==========`);
    console.log(`[LocalStrategy] 用户名: ${username}`);
    console.log(`[LocalStrategy] 密码长度: ${password?.length}`);
    console.log(`[LocalStrategy] 密码预览: ${password ? password.substring(0, 3) + '***' : 'null'}`);
    
    try {
      const user = await this.authService.validateUser(username, password);
      
      if (!user) {
        console.log(`[LocalStrategy] ❌ 验证失败: ${username} - validateUser返回null`);
        throw new UnauthorizedException('用户名或密码错误');
      }
      
      console.log(`[LocalStrategy] ✅ 验证成功: ${username}`);
      console.log(`[LocalStrategy] 用户信息:`, {
        id: user.id,
        username: user.username,
        role: user.role,
        status: user.status,
      });
      console.log(`[LocalStrategy] ========== 验证完成 ==========`);
      
      return user;
    } catch (error) {
      console.error(`[LocalStrategy] ❌ 验证异常:`, error);
      throw error;
    }
  }
}

