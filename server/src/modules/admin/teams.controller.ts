import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminTeamsService } from './teams.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Controller('admin/teams')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminTeamsController {
  constructor(private readonly adminTeamsService: AdminTeamsService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('keyword') keyword?: string,
  ) {
    return this.adminTeamsService.findAll(page, pageSize, keyword);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.adminTeamsService.findOne(id);
  }

  @Post()
  async create(@Body() createTeamDto: CreateTeamDto) {
    return this.adminTeamsService.create(createTeamDto);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateTeamDto: UpdateTeamDto) {
    return this.adminTeamsService.update(id, updateTeamDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.adminTeamsService.remove(id);
  }
}

