import { IsString, IsOptional, IsBoolean, MinLength } from 'class-validator';

export class TeamSettingsDto {
  @IsString()
  @IsOptional()
  @MinLength(1, { message: '团队名称不能为空' })
  teamName?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  region?: string;

  @IsBoolean()
  @IsOptional()
  autoApprove?: boolean;

  @IsBoolean()
  @IsOptional()
  notificationEnabled?: boolean;
}

