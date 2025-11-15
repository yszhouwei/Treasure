import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'your-secret-key',
    });
  }

  async validate(payload: any) {
    console.log('[JwtStrategy] 验证JWT token, payload:', payload);
    const user = {
      userId: payload.sub,
      id: payload.sub,
      username: payload.username,
      role: payload.role || 'user',
    };
    console.log('[JwtStrategy] 返回用户信息:', user);
    return user;
  }
}

