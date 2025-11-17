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
import { SystemService } from './system.service';
import { CreateSystemConfigDto } from './dto/create-system-config.dto';
import { UpdateSystemConfigDto } from './dto/update-system-config.dto';

@Controller('admin/system')
@UseGuards(JwtAuthGuard, AdminGuard)
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  // 系统配置相关接口
  @Get('configs')
  async findAllConfigs(@Query('category') category?: string) {
    return this.systemService.findAllConfigs(category);
  }

  @Get('configs/:key')
  async findConfigByKey(@Param('key') key: string) {
    return this.systemService.findConfigByKey(key);
  }

  @Post('configs')
  async createConfig(@Body() createDto: CreateSystemConfigDto) {
    return this.systemService.createConfig(createDto);
  }

  @Put('configs/:id')
  async updateConfig(
    @Param('id') id: string,
    @Body() updateDto: UpdateSystemConfigDto,
  ) {
    return this.systemService.updateConfig(Number(id), updateDto);
  }

  @Put('configs/key/:key')
  async updateConfigByKey(
    @Param('key') key: string,
    @Body('value') value: string,
  ) {
    return this.systemService.updateConfigByKey(key, value);
  }

  @Delete('configs/:id')
  async deleteConfig(@Param('id') id: string) {
    return this.systemService.deleteConfig(Number(id));
  }

  // 操作日志相关接口
  @Get('logs')
  async findAllLogs(
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '20',
    @Query('module') module?: string,
    @Query('action') action?: string,
    @Query('username') username?: string,
  ) {
    return this.systemService.findAllLogs(
      Number(page),
      Number(pageSize),
      module,
      action,
      username,
    );
  }

  @Get('logs/stats')
  async getLogStats() {
    return this.systemService.getLogStats();
  }

  @Get('logs/:id')
  async findLogById(@Param('id') id: string) {
    return this.systemService.findLogById(Number(id));
  }

  @Delete('logs/:id')
  async deleteLog(@Param('id') id: string) {
    return this.systemService.deleteLog(Number(id));
  }

  @Delete('logs/cleanup')
  async cleanupLogs(@Query('days') days: string = '30') {
    const beforeDate = new Date();
    beforeDate.setDate(beforeDate.getDate() - Number(days));
    return this.systemService.deleteLogsByDate(beforeDate);
  }
}

