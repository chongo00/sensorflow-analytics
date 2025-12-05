export interface SensorReading {
  id: string;
  timestamp_sec: number; // Original 'Hora'
  time_hours: number;    // Calculated 'Tiempo (h)'
  channel_4_mW: number;
  channel_5_mW: number;
  channel_6_mW: number;
  channel_7_mW: number;
  channel_8_mW: number;
}

export interface CalibrationParams {
  m_cpo: number;
  m_agua: number;
  m_arcilla: number;
  m_pasta: number;
  percent_cpo: number;
  percent_agua: number;
  percent_arcilla: number;
  zero: number;
  min_threshold: number; // Used for "XXX" logic
}

export interface AnalysisModel {
  id: string;
  name: string; // e.g., "CB800", "CC750"
  sourceChannel: keyof SensorReading; // Inferred correlation
  params: CalibrationParams;
}

export interface AnalysisResult {
  id: string;
  readingId: string;
  modelId: string;
  timestamp_sec: number;
  calculatedValue: number; // The main result
  additionalValue: number | null; // The _1 result
  status: 'OK' | 'XXX' | '...'; // Exception state
}

export type ViewState = 'dashboard' | 'configuration' | 'data-import' | 'reports' | 'documentation';