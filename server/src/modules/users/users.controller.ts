import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Request() req) {
    return this.usersService.findOne(req.user.userId);
  }

  @Put('profile')
  async updateProfile(@Request() req, @Body() body: any) {
    try {
      console.log('收到更新请求 - 用户ID:', req.user.userId);
      console.log('更新数据 (原始):', JSON.stringify(body, null, 2));
      
      // 手动转换性别字段（在验证之前）
      if (body.gender !== undefined && body.gender !== null && body.gender !== '') {
        if (typeof body.gender === 'string') {
          const genderMap: Record<string, number> = {
            'male': 1,
            'female': 2,
            'other': 0,
          };
          body.gender = genderMap[body.gender] ?? undefined;
        }
      } else {
        body.gender = undefined;
      }
      
      // 使用 plainToInstance 转换并应用 Transform 装饰器
      const updateUserDto = plainToInstance(UpdateUserDto, body, {
        enableImplicitConversion: true,
        excludeExtraneousValues: false,
      });
      
      // 手动验证
      const errors = await validate(updateUserDto);
      if (errors.length > 0) {
        const errorMessages = errors.map(err => {
          if (err.constraints) {
            return Object.values(err.constraints).join(', ');
          }
          return err.property;
        });
        throw new BadRequestException({
          message: errorMessages,
          error: 'Bad Request',
          statusCode: 400,
        });
      }
      
      console.log('更新数据 (转换后):', JSON.stringify(updateUserDto, null, 2));
      console.log('更新数据 (类型):', {
        nickname: typeof updateUserDto.nickname,
        email: typeof updateUserDto.email,
        phone: typeof updateUserDto.phone,
        bio: typeof updateUserDto.bio,
        gender: typeof updateUserDto.gender,
        avatar: typeof updateUserDto.avatar,
      });
      
      return await this.usersService.update(req.user.userId, updateUserDto);
    } catch (error) {
      console.error('更新用户信息失败:', error);
      throw error;
    }
  }

  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = join(process.cwd(), 'uploads', 'avatars');
          // 确保目录存在
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `avatar-${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new BadRequestException('只支持图片格式：jpg, jpeg, png, gif, webp'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadAvatar(@Request() req, @UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('请选择要上传的图片');
    }

    // 返回文件的URL（这里简化处理，实际应该使用CDN或静态文件服务）
    const fileUrl = `/uploads/avatars/${file.filename}`;
    
    // 更新用户头像
    await this.usersService.update(req.user.userId, { avatar: fileUrl });

    return { url: fileUrl };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }
}

