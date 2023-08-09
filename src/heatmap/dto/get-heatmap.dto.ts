export interface GetHeatmapResponse {
  points: HeatmapPoint[];
}

export interface HeatmapPoint {
  location: {
    longitude: number;
    latitude: number;
  };
  value: number;
}
