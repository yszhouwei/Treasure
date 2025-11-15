import { IsString, IsNumber, IsOptional, MinLength, MaxLength, Min } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  parentId?: number;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  sortOrder?: number;
}

