import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { AdminPaymentsService } from './payments.service';

@Controller('admin/payments')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminPaymentsController {
  constructor(private readonly adminPaymentsService: AdminPaymentsService) {}

  @Get()
  async findAll(
    @Query('type') type?: string,
    @Query('status') status?: string,
  ) {
    const statusNum = status ? parseInt(status) : undefined;
    return this.adminPaymentsService.findAll(type, statusNum);
  }

  @Get('statistics')
  async getStatistics() {
    return this.adminPaymentsService.getStatistics();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.adminPaymentsService.findOne(Number(id));
  }
}

