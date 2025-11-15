import { IsArray } from 'class-validator';

export class BatchDeleteProductsDto {
  @IsArray()
  ids: number[];
}

