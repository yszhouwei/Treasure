import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TeamSettingsDto } from './dto/team-settings.dto';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  async findAll() {
    return this.teamsService.findAll();
  }

  // 具体路由必须放在参数路由之前，否则会被 :id 匹配
  @UseGuards(JwtAuthGuard)
  @Get('my/overview')
  async getMyTeamOverview(@Request() req) {
    return this.teamsService.getTeamOverview(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my/settings')
  async getTeamSettings(@Request() req) {
    return this.teamsService.getTeamSettings(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('my/settings')
  async updateTeamSettings(
    @Request() req,
    @Body() settingsDto: TeamSettingsDto,
  ) {
    return this.teamsService.updateTeamSettings(req.user.userId, settingsDto);
  }

  // 参数路由放在最后
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.teamsService.findOne(id);
  }
}

