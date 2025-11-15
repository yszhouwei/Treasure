import { IsString, IsOptional, IsNumber, IsInt, IsDateString, Min, IsNotEmpty } from 'class-validator';

export class CreateBannerDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsNotEmpty({ message: '图片URL不能为空' })
  image_url: string;

  @IsString()
  @IsOptional()
  link_url?: string;

  @IsString()
  @IsOptional()
  link_type?: string;

  @IsNumber()
  @IsInt()
  @Min(0)
  @IsOptional()
  sort_order?: number;

  @IsNumber()
  @IsInt()
  @IsOptional()
  status?: number;

  @IsDateString()
  @IsOptional()
  start_time?: string;

  @IsDateString()
  @IsOptional()
  end_time?: string;
}

