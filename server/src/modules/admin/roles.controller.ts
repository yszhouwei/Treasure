import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('admin/roles')
@UseGuards(JwtAuthGuard, AdminGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.rolesService.findOne(Number(id));
  }

  @Get('code/:code')
  async findByCode(@Param('code') code: string) {
    return this.rolesService.findByCode(code);
  }

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(Number(id), updateRoleDto);
  }

  @Put(':id/permissions')
  async assignPermissions(
    @Param('id') id: string,
    @Body('permission_ids') permissionIds: number[],
  ) {
    return this.rolesService.assignPermissions(Number(id), permissionIds);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.rolesService.remove(Number(id));
  }
}

