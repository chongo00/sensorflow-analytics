import { AnalysisModel, SensorReading } from './types';

// Helper to generate UUIDs (simplified for mock)
const uuid = () => Math.random().toString(36).substring(2, 9);

export const DEFAULT_MODELS: AnalysisModel[] = [
  {
    id: 'cb800',
    name: 'CB800',
    sourceChannel: 'channel_4_mW',
    params: {
      m_cpo: 1.2,
      m_agua: 0.05,
      m_arcilla: 0.1,
      m_pasta: 0.0,
      percent_cpo: 98,
      percent_agua: 1.5,
      percent_arcilla: 0.5,
      zero: -10,
      min_threshold: 50,
    },
  },
  {
    id: 'cb850',
    name: 'CB850',
    sourceChannel: 'channel_5_mW',
    params: {
      m_cpo: 1.15,
      m_agua: 0.06,
      m_arcilla: 0.12,
      m_pasta: 0.0,
      percent_cpo: 97,
      percent_agua: 1.8,
      percent_arcilla: 0.6,
      zero: -12,
      min_threshold: 55,
    },
  },
  {
    id: 'cc750',
    name: 'CC750',
    sourceChannel: 'channel_6_mW',
    params: {
      m_cpo: 1.3,
      m_agua: 0.04,
      m_arcilla: 0.08,
      m_pasta: 1.1,
      percent_cpo: 99,
      percent_agua: 0.5,
      percent_arcilla: 0.2,
      zero: -8,
      min_threshold: 45,
    },
  },
  {
    id: 'cc800',
    name: 'CC800',
    sourceChannel: 'channel_7_mW',
    params: {
      m_cpo: 1.25,
      m_agua: 0.05,
      m_arcilla: 0.09,
      m_pasta: 1.2,
      percent_cpo: 98.5,
      percent_agua: 1.0,
      percent_arcilla: 0.3,
      zero: -9,
      min_threshold: 48,
    },
  },
  {
    id: 'cc850',
    name: 'CC850',
    sourceChannel: 'channel_8_mW',
    params: {
      m_cpo: 1.22,
      m_agua: 0.055,
      m_arcilla: 0.11,
      m_pasta: 1.15,
      percent_cpo: 97.5,
      percent_agua: 1.2,
      percent_arcilla: 0.4,
      zero: -11,
      min_threshold: 52,
    },
  },
];

// Generate 50 mock readings spanning a few hours
export const generateMockReadings = (): SensorReading[] => {
  const readings: SensorReading[] = [];
  const startTime = 3600 * 8; // 8:00 AM in seconds

  for (let i = 0; i < 100; i++) {
    const t = startTime + i * 300; // Every 5 minutes
    // Simulate some noise and trends
    const trend = Math.sin(i / 10) * 20;
    
    readings.push({
      id: uuid(),
      timestamp_sec: t,
      time_hours: parseFloat((t / 3600).toFixed(4)),
      channel_4_mW: 100 + trend + Math.random() * 5,
      channel_5_mW: 110 + trend + Math.random() * 5,
      channel_6_mW: 90 + trend + Math.random() * 5,
      channel_7_mW: 95 + trend + Math.random() * 5,
      channel_8_mW: 105 + trend + Math.random() * 5,
    });
  }
  
  // Inject an "XXX" anomaly case by dropping values extremely low
  readings[25].channel_4_mW = 10; 
  readings[25].channel_5_mW = 10;

  return readings;
};