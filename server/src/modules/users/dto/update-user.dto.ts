import { IsString, IsEmail, IsOptional, IsDateString, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @Transform(({ value }) => {
    // 如果值不存在，返回 undefined
    if (value === null || value === undefined || value === '') {
      return undefined;
    }
    // 如果传入的是字符串，转换为数字
    if (typeof value === 'string') {
      const genderMap: Record<string, number> = {
        'male': 1,
        'female': 2,
        'other': 0,
      };
      const numValue = genderMap[value];
      if (numValue !== undefined) {
        return numValue;
      }
      return undefined;
    }
    // 如果已经是数字，直接返回
    if (typeof value === 'number') {
      return value;
    }
    return undefined;
  })
  @IsOptional()
  @IsNumber({}, { message: '性别必须是数字' })
  gender?: number;

  @IsOptional()
  @IsDateString()
  birthday?: string;
}

