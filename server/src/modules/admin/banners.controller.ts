import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { AdminBannersService } from './banners.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Controller('admin/banners')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminBannersController {
  constructor(private readonly adminBannersService: AdminBannersService) {}

  @Get()
  async findAll() {
    return this.adminBannersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.adminBannersService.findOne(Number(id));
  }

  @Post()
  async create(@Body() createBannerDto: CreateBannerDto) {
    return this.adminBannersService.create(createBannerDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateBannerDto: UpdateBannerDto) {
    return this.adminBannersService.update(Number(id), updateBannerDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      console.log('🗑️ 控制器：收到删除请求, ID:', id);
      const result = await this.adminBannersService.remove(Number(id));
      console.log('✅ 控制器：删除成功, 结果:', result);
      return result;
    } catch (error) {
      console.error('❌ 控制器：删除失败:', error);
      throw error;
    }
  }
}

