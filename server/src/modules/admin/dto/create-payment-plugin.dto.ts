import { IsString, IsOptional, IsNumber, IsInt, IsArray, IsBoolean, IsObject, Min, IsNotEmpty } from 'class-validator';

export class CreatePaymentPluginDto {
  @IsString()
  @IsNotEmpty({ message: '插件代码不能为空' })
  plugin_code: string;

  @IsString()
  @IsNotEmpty({ message: '插件名称不能为空' })
  plugin_name: string;

  @IsString()
  @IsNotEmpty({ message: '插件类型不能为空' })
  plugin_type: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  icon_url?: string;

  @IsString()
  @IsOptional()
  version?: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsObject()
  @IsOptional()
  config_schema?: any;

  @IsObject()
  @IsOptional()
  config_data?: any;

  @IsNumber()
  @IsInt()
  @IsOptional()
  status?: number;

  @IsNumber()
  @IsInt()
  @IsOptional()
  is_default?: number;

  @IsNumber()
  @IsInt()
  @Min(0)
  @IsOptional()
  sort_order?: number;

  @IsArray()
  @IsOptional()
  supported_regions?: string[];

  @IsArray()
  @IsOptional()
  supported_currencies?: string[];

  @IsNumber()
  @Min(0)
  @IsOptional()
  min_amount?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  max_amount?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  fee_rate?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  fee_fixed?: number;
}

