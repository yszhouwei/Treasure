import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  name: string;

  @IsNumber()
  leaderId: number;

  @IsNumber()
  @Min(10)
  @Max(100)
  groupSize: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  region?: string;
}

