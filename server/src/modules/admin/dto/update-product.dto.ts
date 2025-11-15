import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, IsIn, Min } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsNumber()
  @IsOptional()
  @Min(0)
  originalPrice?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  stock?: number;

  @IsString()
  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: 'active' | 'inactive';

  @IsBoolean()
  @IsOptional()
  isHot?: boolean;

  @IsBoolean()
  @IsOptional()
  isRecommend?: boolean;

  @IsNumber()
  @IsOptional()
  sortOrder?: number;

  @IsOptional()
  specifications?: any;

  @IsString()
  @IsOptional()
  warranty?: string;
}

