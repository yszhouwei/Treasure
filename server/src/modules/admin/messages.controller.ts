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
import { AdminMessagesService } from './messages.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Controller('admin/messages')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminMessagesController {
  constructor(private readonly adminMessagesService: AdminMessagesService) {}

  @Get()
  async findAll(
    @Query('type') type?: string,
    @Query('user_id') userId?: string,
  ) {
    const userIdNum = userId === 'null' ? null : (userId ? parseInt(userId) : undefined);
    return this.adminMessagesService.findAll(type, userIdNum);
  }

  @Get('statistics')
  async getStatistics() {
    return this.adminMessagesService.getStatistics();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.adminMessagesService.findOne(Number(id));
  }

  @Post()
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.adminMessagesService.create(createNotificationDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.adminMessagesService.update(Number(id), updateNotificationDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      console.log('🗑️ 控制器：收到删除请求, ID:', id);
      const result = await this.adminMessagesService.remove(Number(id));
      console.log('✅ 控制器：删除成功, 结果:', result);
      return result;
    } catch (error) {
      console.error('❌ 控制器：删除失败:', error);
      throw error;
    }
  }
}

