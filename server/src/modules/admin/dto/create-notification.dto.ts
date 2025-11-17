import { IsString, IsOptional, IsNumber, IsInt, IsDateString, IsNotEmpty } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty({ message: '标题不能为空' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: '内容不能为空' })
  content: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsNumber()
  @IsInt()
  @IsOptional()
  user_id?: number | null; // null表示系统消息

  @IsNumber()
  @IsInt()
  @IsOptional()
  status?: number;

  @IsString()
  @IsOptional()
  related_id?: string;

  @IsString()
  @IsOptional()
  related_type?: string;
}

