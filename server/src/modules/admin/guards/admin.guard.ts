import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('[AdminGuard] 检查管理员权限, user:', user);

    if (!user) {
      console.log('[AdminGuard] ❌ 用户未登录');
      throw new ForbiddenException('未登录');
    }

    console.log('[AdminGuard] 用户角色:', user.role);

    if (user.role !== 'admin') {
      console.log('[AdminGuard] ❌ 用户不是管理员, role:', user.role);
      throw new ForbiddenException('您不是管理员，无权访问此接口');
    }

    console.log('[AdminGuard] ✅ 管理员权限验证通过');
    return true;
  }
}

