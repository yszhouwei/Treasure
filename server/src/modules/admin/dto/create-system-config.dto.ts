import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateSystemConfigDto {
  @IsString()
  @IsNotEmpty()
  config_key: string;

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

