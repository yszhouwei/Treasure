import {
  IsString,
  IsNumber,
  IsOptional,
  IsInt,
  Min,
  IsArray,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  category_id?: number;

  @IsString()
  @IsOptional()
  image_url?: string;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsNumber()
  @Min(0)
  original_price: number;

  @IsNumber()
  @Min(0)
  group_price: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  stock?: number;

  @IsInt()
  @IsOptional()
  is_hot?: number;

  @IsInt()
  @IsOptional()
  is_recommend?: number;

  @IsInt()
  @IsOptional()
  sort_order?: number;

  @IsString()
  @IsOptional()
  specifications?: string;

  @IsString()
  @IsOptional()
  warranty?: string;
}

