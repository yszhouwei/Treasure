import { IsArray } from 'class-validator';

export class BatchDeleteUsersDto {
  @IsArray()
  ids: number[];
}

