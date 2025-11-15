import { IsArray, IsString, IsIn } from 'class-validator';

export class BatchUpdateUsersDto {
  @IsArray()
  ids: number[];

  @IsString()
  @IsIn(['active', 'inactive'])
  status?: 'active' | 'inactive';

  @IsString()
  @IsIn(['user', 'team_leader', 'admin'])
  role?: string;
}

