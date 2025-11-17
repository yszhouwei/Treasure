import { IsString, IsNotEmpty, IsOptional, IsInt, IsIn } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  permission_code: string;

  @IsString()
  @IsNotEmpty()
  permission_name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  module?: string;

  @IsString()
  @IsOptional()
  resource?: string;

  @IsString()
  @IsOptional()
  action?: string;

  @IsInt()
  @IsOptional()
  parent_id?: number;

  @IsInt()
  @IsOptional()
  sort_order?: number;

  @IsInt()
  @IsOptional()
  @IsIn([0, 1])
  status?: number;
}

