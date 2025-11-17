import { IsString, IsNotEmpty, IsOptional, IsInt, IsIn } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  role_code: string;

  @IsString()
  @IsNotEmpty()
  role_name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  @IsIn([0, 1])
  status?: number;

  @IsInt()
  @IsOptional()
  sort_order?: number;

  @IsOptional()
  permission_ids?: number[];
}

