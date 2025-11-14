import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  async findAll() {
    return this.teamsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.teamsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my/overview')
  async getMyTeamOverview(@Request() req) {
    return this.teamsService.getTeamOverview(req.user.userId);
  }
}

