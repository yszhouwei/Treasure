import { IsString, IsIn } from 'class-validator';

export class UpdateUserRoleDto {
  @IsString()
  @IsIn(['user', 'team_leader', 'admin'])
  role: string;
}

