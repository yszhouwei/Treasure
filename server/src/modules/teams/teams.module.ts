import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { Team } from '../../entities/team.entity';
import { GroupBuying } from '../../entities/group-buying.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Team, GroupBuying])],
  controllers: [TeamsController],
  providers: [TeamsService],
  exports: [TeamsService],
})
export class TeamsModule {}

