import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

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
  @Min(0)
  originalPrice: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  stock?: number;

  @IsString()
  @IsOptional()
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

  @IsNumber()
  @IsOptional()
  @Min(1)
  winnerCount?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  dividendRate?: number;
}

