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
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Controller('admin/permissions')
@UseGuards(JwtAuthGuard, AdminGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  async findAll(@Query('module') module?: string, @Query('grouped') grouped?: string) {
    if (module) {
      return this.permissionsService.findAll(module);
    }
    // 如果请求分组数据，返回按模块分组的对象
    if (grouped === 'true') {
      return this.permissionsService.getByModule();
    }
    // 默认返回数组
    return this.permissionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(Number(id));
  }

  @Get('code/:code')
  async findByCode(@Param('code') code: string) {
    return this.permissionsService.findByCode(code);
  }

  @Post()
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(Number(id), updatePermissionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.permissionsService.remove(Number(id));
  }
}

