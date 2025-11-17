import { IsString, IsOptional, IsIn } from 'class-validator';

export class UpdateSystemConfigDto {
  @IsString()
  @IsOptional()
  config_value?: string;

  @IsString()
  @IsOptional()
  @IsIn(['string', 'number', 'boolean', 'json'])
  config_type?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsOptional()
  is_public?: number;
}

