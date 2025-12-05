import { AnalysisModel, AnalysisResult, SensorReading } from '../types';

/**
 * Calculates analysis results based on the "Implied Formulas" requirement.
 * Since exact formulas were not provided, we implement a linear calibration
 * model based on the standard parameters: m (slope), Zero (intercept), and Min (threshold).
 */
export const calculateResults = (
  readings: SensorReading[],
  models: AnalysisModel[]
): AnalysisResult[] => {
  const results: AnalysisResult[] = [];

  readings.forEach((reading) => {
    models.forEach((model) => {
      const rawValue = reading[model.sourceChannel] as number;
      
      // RULE 1: Threshold Check (The "Min" parameter)
      // If raw value is below Min, we treat it as an anomaly "XXX"
      if (rawValue < model.params.min_threshold) {
        results.push({
          id: `${reading.id}-${model.id}`,
          readingId: reading.id,
          modelId: model.id,
          timestamp_sec: reading.timestamp_sec,
          calculatedValue: 0, // Fallback for charts
          additionalValue: null,
          status: 'XXX',
        });
        return;
      }

      // RULE 2: Primary Calculation (Inferred)
      // Result = (Raw * m_cpo) + Zero + (Effect of Water)
      // This is a hypothetical chemical analysis formula structure
      const mainCalc = (rawValue * model.params.m_cpo) + model.params.zero - (model.params.m_agua * 10);

      // RULE 3: Secondary Calculation (The _1 columns)
      // Inferred as a normalized percentage check or derivative
      const secondaryCalc = (mainCalc / model.params.percent_cpo) * 100;

      results.push({
        id: `${reading.id}-${model.id}`,
        readingId: reading.id,
        modelId: model.id,
        timestamp_sec: reading.timestamp_sec,
        calculatedValue: parseFloat(mainCalc.toFixed(2)),
        additionalValue: parseFloat(secondaryCalc.toFixed(2)),
        status: 'OK',
      });
    });
  });

  return results;
};

export const aggregateStats = (results: AnalysisResult[]) => {
  const validResults = results.filter(r => r.status === 'OK');
  const values = validResults.map(r => r.calculatedValue);
  
  if (values.length === 0) return { min: 0, max: 0, avg: 0, stdDev: 0 };

  const sum = values.reduce((a, b) => a + b, 0);
  const avg = sum / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);
  
  const squareDiffs = values.map(v => Math.pow(v - avg, 2));
  const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
  const stdDev = Math.sqrt(avgSquareDiff);

  return {
    min: parseFloat(min.toFixed(2)),
    max: parseFloat(max.toFixed(2)),
    avg: parseFloat(avg.toFixed(2)),
    stdDev: parseFloat(stdDev.toFixed(2)),
  };
};