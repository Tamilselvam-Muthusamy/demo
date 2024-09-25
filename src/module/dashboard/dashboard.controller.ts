import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from 'src/common/guard/auth.guard';

@Controller('dashBoard')
export class DashboardController {
  constructor(private readonly dashBoardService: DashboardService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getDahsboardCounts() {
    const result = await this.dashBoardService.getDashBoardCounts();
    return {
      status: true,
      data: result,
      message: 'Dashboard counts fetched successfully',
    };
  }
}
