import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  IsObject,
} from 'class-validator';

export class CreateOrderDto {
  @IsInt()
  product_id: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsInt()
  @IsOptional()
  team_id?: number;

  @IsObject()
  @IsOptional()
  shipping_address?: any;
}

