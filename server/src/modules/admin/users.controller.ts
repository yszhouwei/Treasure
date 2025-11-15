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
  Request,
} from '@nestjs/common';
import { AdminUsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BatchUpdateUsersDto } from './dto/batch-update-users.dto';
import { BatchDeleteUsersDto } from './dto/batch-delete-users.dto';

@Controller('admin/users')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('keyword') keyword?: string,
  ) {
    return this.adminUsersService.findAll(page, pageSize, keyword);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.adminUsersService.findOne(id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.adminUsersService.create(createUserDto);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.adminUsersService.update(id, updateUserDto);
  }

  @Post('batch/update')
  async batchUpdate(@Body() batchUpdateDto: BatchUpdateUsersDto) {
    return this.adminUsersService.batchUpdate(batchUpdateDto);
  }

  @Post('batch/delete')
  async batchDelete(@Body() batchDeleteDto: BatchDeleteUsersDto) {
    return this.adminUsersService.batchDelete(batchDeleteDto.ids);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: number,
    @Body() updateStatusDto: UpdateUserStatusDto,
  ) {
    return this.adminUsersService.updateStatus(id, updateStatusDto.status);
  }

  @Put(':id/role')
  async updateRole(
    @Param('id') id: number,
    @Body() updateRoleDto: UpdateUserRoleDto,
  ) {
    return this.adminUsersService.updateRole(id, updateRoleDto.role);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.adminUsersService.remove(id);
  }
}

