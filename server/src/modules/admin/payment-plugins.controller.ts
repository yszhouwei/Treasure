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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { AdminPaymentPluginsService } from './payment-plugins.service';
import { CreatePaymentPluginDto } from './dto/create-payment-plugin.dto';
import { UpdatePaymentPluginDto } from './dto/update-payment-plugin.dto';

@Controller('admin/payment-plugins')
export class AdminPaymentPluginsController {
  constructor(private readonly adminPaymentPluginsService: AdminPaymentPluginsService) {}

  // 公开接口：获取已启用的支付插件（H5客户端使用）
  @Get('enabled')
  async getEnabledPlugins(
    @Query('region') region?: string,
    @Query('currency') currency?: string,
  ) {
    return this.adminPaymentPluginsService.getEnabledPlugins(region, currency);
  }

  // 管理接口：需要认证
  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async findAll() {
    return this.adminPaymentPluginsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async findOne(@Param('id') id: string) {
    return this.adminPaymentPluginsService.findOne(Number(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async create(@Body() createPluginDto: CreatePaymentPluginDto) {
    return this.adminPaymentPluginsService.create(createPluginDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async update(@Param('id') id: string, @Body() updatePluginDto: UpdatePaymentPluginDto) {
    return this.adminPaymentPluginsService.update(Number(id), updatePluginDto);
  }

  @Post(':id/install')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async install(@Param('id') id: string) {
    return this.adminPaymentPluginsService.install(Number(id));
  }

  @Post(':id/enable')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async enable(@Param('id') id: string) {
    return this.adminPaymentPluginsService.enable(Number(id));
  }

  @Post(':id/disable')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async disable(@Param('id') id: string) {
    return this.adminPaymentPluginsService.disable(Number(id));
  }

  @Post(':id/uninstall')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async uninstall(@Param('id') id: string) {
    return this.adminPaymentPluginsService.uninstall(Number(id));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async remove(@Param('id') id: string) {
    try {
      console.log('🗑️ 控制器：收到删除请求, ID:', id);
      const result = await this.adminPaymentPluginsService.remove(Number(id));
      console.log('✅ 控制器：删除成功, 结果:', result);
      return result;
    } catch (error) {
      console.error('❌ 控制器：删除失败:', error);
      throw error;
    }
  }
}
