import { IsString, IsOptional, IsNumber, IsInt, IsDateString, Min, IsNotEmpty, IsIn } from 'class-validator';

export class CreateContentDto {
  @IsString()
  @IsNotEmpty({ message: '标题不能为空' })
  title: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsNotEmpty({ message: '类型不能为空' })
  @IsIn(['trending', 'insight', 'story'], { message: '类型必须是 trending、insight 或 story' })
  type: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  cover_image?: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsNumber()
  @IsInt()
  @Min(0)
  @IsOptional()
  view_count?: number;

  @IsNumber()
  @IsInt()
  @Min(0)
  @IsOptional()
  like_count?: number;

  @IsNumber()
  @IsInt()
  @Min(0)
  @IsOptional()
  collect_count?: number;

  @IsNumber()
  @IsInt()
  @IsOptional()
  status?: number;

  @IsNumber()
  @IsInt()
  @IsOptional()
  is_recommend?: number;

  @IsNumber()
  @IsInt()
  @Min(0)
  @IsOptional()
  sort_order?: number;

  @IsDateString()
  @IsOptional()
  published_at?: string;
}

