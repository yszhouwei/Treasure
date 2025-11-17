import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../../entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {}

  async findAll(module?: string): Promise<Permission[]> {
    const where: any = {};
    if (module) {
      where.module = module;
    }
    return this.permissionsRepository.find({
      where,
      order: { module: 'ASC', sort_order: 'ASC', id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Permission> {
    const permission = await this.permissionsRepository.findOne({
      where: { id },
    });
    if (!permission) {
      throw new NotFoundException(`权限 ID ${id} 不存在`);
    }
    return permission;
  }

  async findByCode(permissionCode: string): Promise<Permission> {
    const permission = await this.permissionsRepository.findOne({
      where: { permission_code: permissionCode },
    });
    if (!permission) {
      throw new NotFoundException(`权限代码 ${permissionCode} 不存在`);
    }
    return permission;
  }

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    // 检查权限代码是否已存在
    const existing = await this.permissionsRepository.findOne({
      where: { permission_code: createPermissionDto.permission_code },
    });
    if (existing) {
      throw new BadRequestException(`权限代码 ${createPermissionDto.permission_code} 已存在`);
    }

    const permission = this.permissionsRepository.create(createPermissionDto);
    return this.permissionsRepository.save(permission);
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto): Promise<Permission> {
    const permission = await this.findOne(id);
    Object.assign(permission, updatePermissionDto);
    return this.permissionsRepository.save(permission);
  }

  async remove(id: number): Promise<{ message: string }> {
    // 检查是否有子权限
    const children = await this.permissionsRepository.find({
      where: { parent_id: id },
    });
    if (children.length > 0) {
      throw new BadRequestException('该权限下存在子权限，请先删除子权限');
    }

    const result = await this.permissionsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`权限 ID ${id} 不存在`);
    }
    return { message: `权限 ID ${id} 删除成功` };
  }

  async getByModule(): Promise<Record<string, Permission[]>> {
    const permissions = await this.findAll();
    const grouped: Record<string, Permission[]> = {};
    permissions.forEach((perm) => {
      const module = perm.module || 'other';
      if (!grouped[module]) {
        grouped[module] = [];
      }
      grouped[module].push(perm);
    });
    return grouped;
  }
}

