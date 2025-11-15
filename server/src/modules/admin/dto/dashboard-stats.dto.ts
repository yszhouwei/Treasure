export interface DashboardStatsResponse {
  totalUsers: number;
  totalTeams: number;
  totalProducts: number;
  totalRevenue: number;
  // 图表数据
  userGrowth?: Array<{ date: string; count: number }>;
  revenueTrend?: Array<{ date: string; amount: number }>;
  productSales?: Array<{ name: string; sales: number }>;
  orderStatus?: Array<{ status: string; count: number }>;
}

