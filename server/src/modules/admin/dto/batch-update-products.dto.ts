import { IsArray, IsString, IsIn } from 'class-validator';

export class BatchUpdateProductsDto {
  @IsArray()
  ids: number[];

  @IsString()
  @IsIn(['active', 'inactive'])
  status?: 'active' | 'inactive';
}

