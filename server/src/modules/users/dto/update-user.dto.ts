import { IsString, IsEmail, IsOptional, IsDateString, IsNumber, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  nickname?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => {
    // 如果传入的是字符串，转换为数字
    if (typeof value === 'string') {
      const genderMap: Record<string, number> = {
        'male': 1,
        'female': 2,
        'other': 0,
      };
      return genderMap[value] ?? 0;
    }
    return value;
  })
  gender?: number;

  @IsDateString()
  @IsOptional()
  birthday?: string;
}

