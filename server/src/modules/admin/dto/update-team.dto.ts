import { IsString, IsNumber, IsBoolean, IsOptional, IsIn, Min, Max } from 'class-validator';

export class UpdateTeamDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  region?: string;

  @IsNumber()
  @IsOptional()
  @Min(10)
  @Max(100)
  groupSize?: number;

  @IsString()
  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: 'active' | 'inactive';

  @IsBoolean()
  @IsOptional()
  autoApprove?: boolean;

  @IsBoolean()
  @IsOptional()
  notificationEnabled?: boolean;
}

