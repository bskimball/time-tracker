export type MetricType = 'occupancy' | 'efficiency';

export interface AnalyticsCostSummary {
  regular: number;
  overtime: number;
  total: number;
  variance: number;
  variancePercent: number;
}

export interface AnalyticsStationOverview {
  name: string;
  efficiency: number;
  occupancy: number;
  employees: number;
}

export interface AnalyticsDashboardData {
  costSummary: AnalyticsCostSummary;
  stations: AnalyticsStationOverview[];
}

export interface ZoneStatus {
  id: string;
  name: string;
  occupancy: number; // percentage 0-100
  efficiency: number; // percentage 0-100
  throughputPerHour: number;
  updatedAt: string; // ISO timestamp
}

export interface LiveFloorData {
  zones: ZoneStatus[];
}
