import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role } from '../../entities/role.entity';
import { Permission } from '../../entities/permission.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {}

  async findAll(): Promise<Role[]> {
    return this.rolesRepository.find({
      relations: ['permissions'],
      order: { sort_order: 'ASC', id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.rolesRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
    if (!role) {
      throw new NotFoundException(`角色 ID ${id} 不存在`);
    }
    return role;
  }

  async findByCode(roleCode: string): Promise<Role> {
    const role = await this.rolesRepository.findOne({
      where: { role_code: roleCode },
      relations: ['permissions'],
    });
    if (!role) {
      throw new NotFoundException(`角色代码 ${roleCode} 不存在`);
    }
    return role;
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    // 检查角色代码是否已存在
    const existing = await this.rolesRepository.findOne({
      where: { role_code: createRoleDto.role_code },
    });
    if (existing) {
      throw new BadRequestException(`角色代码 ${createRoleDto.role_code} 已存在`);
    }

    const role = this.rolesRepository.create({
      role_code: createRoleDto.role_code,
      role_name: createRoleDto.role_name,
      description: createRoleDto.description,
      status: createRoleDto.status ?? 1,
      sort_order: createRoleDto.sort_order ?? 0,
    });

    // 如果提供了权限ID，关联权限
    if (createRoleDto.permission_ids && createRoleDto.permission_ids.length > 0) {
      const permissions = await this.permissionsRepository.findBy({
        id: In(createRoleDto.permission_ids),
      });
      role.permissions = permissions;
    }

    return this.rolesRepository.save(role);
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);

    if (updateRoleDto.role_name !== undefined) {
      role.role_name = updateRoleDto.role_name;
    }
    if (updateRoleDto.description !== undefined) {
      role.description = updateRoleDto.description;
    }
    if (updateRoleDto.status !== undefined) {
      role.status = updateRoleDto.status;
    }
    if (updateRoleDto.sort_order !== undefined) {
      role.sort_order = updateRoleDto.sort_order;
    }

    // 如果提供了权限ID，更新权限关联
    if (updateRoleDto.permission_ids !== undefined) {
      if (updateRoleDto.permission_ids.length > 0) {
        const permissions = await this.permissionsRepository.findBy({
          id: In(updateRoleDto.permission_ids),
        });
        role.permissions = permissions;
      } else {
        role.permissions = [];
      }
    }

    return this.rolesRepository.save(role);
  }

  async remove(id: number): Promise<{ message: string }> {
    const role = await this.findOne(id);
    
    // 检查是否是系统默认角色（不允许删除）
    if (['admin', 'user', 'team_leader'].includes(role.role_code)) {
      throw new BadRequestException('系统默认角色不允许删除');
    }

    const result = await this.rolesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`角色 ID ${id} 不存在`);
    }
    return { message: `角色 ID ${id} 删除成功` };
  }

  async assignPermissions(roleId: number, permissionIds: number[]): Promise<Role> {
    const role = await this.findOne(roleId);
    const permissions = await this.permissionsRepository.findBy({
      id: In(permissionIds),
    });
    role.permissions = permissions;
    return this.rolesRepository.save(role);
  }
}

