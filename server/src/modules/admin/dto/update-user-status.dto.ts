import { IsString, IsIn } from 'class-validator';

export class UpdateUserStatusDto {
  @IsString()
  @IsIn(['active', 'inactive'])
  status: 'active' | 'inactive';
}

