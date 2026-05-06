import api from './api';

export interface InsightReport {
  period: string;
  tasks: { total: number; completed: number; pending: number };
  expenses: { totalSpent: number };
  maintenance: { total: number; completed: number; pending: number };
  cleaning: { total: number; completed: number; pending: number };
}

interface InsightResponse {
  report: InsightReport;
}

const insightService = {
  getMonthlyInsights: () => api.get<InsightResponse>('/insights/monthly'),
};

export default insightService;
