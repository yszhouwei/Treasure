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
import { AdminContentsService } from './contents.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Controller('admin/contents')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminContentsController {
  constructor(private readonly adminContentsService: AdminContentsService) {}

  @Get()
  async findAll(@Query('type') type?: string) {
    return this.adminContentsService.findAll(type);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.adminContentsService.findOne(Number(id));
  }

  @Post()
  async create(@Body() createContentDto: CreateContentDto) {
    return this.adminContentsService.create(createContentDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateContentDto: UpdateContentDto) {
    return this.adminContentsService.update(Number(id), updateContentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      console.log('🗑️ 控制器：收到删除请求, ID:', id);
      const result = await this.adminContentsService.remove(Number(id));
      console.log('✅ 控制器：删除成功, 结果:', result);
      return result;
    } catch (error) {
      console.error('❌ 控制器：删除失败:', error);
      throw error;
    }
  }
}

