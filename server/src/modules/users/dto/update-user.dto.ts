import { IsString, IsEmail, IsOptional, IsDateString } from 'class-validator';

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

  @IsDateString()
  @IsOptional()
  birthday?: string;
}

