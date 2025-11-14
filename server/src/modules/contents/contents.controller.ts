import { Controller, Get, Param } from '@nestjs/common';
import { ContentsService } from './contents.service';

@Controller('contents')
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @Get('trending')
  async getTrending() {
    return this.contentsService.getTrending();
  }

  @Get('insights')
  async getInsights() {
    return this.contentsService.getInsights();
  }

  @Get('stories')
  async getStories() {
    return this.contentsService.getStories();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.contentsService.findOne(id);
  }
}

