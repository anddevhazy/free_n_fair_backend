import { readFile, writeFile } from "fs/promises";
import AnalysisService from "../services/AnalysisService.js";
import { createError } from "../utils/errorHandler.js";

// I will run AI anomaly detection here and generate the report
export const analyzeDataset = async (req, res, next) => {
  try {
    const { fileId } = req.body;
    const dataset = JSON.parse(
      await readFile(`uploads/validated_${fileId}.json`)
    );

    const anomalies = await AnalysisService.detectAnomalies(dataset);

    const report = {
      totalRecords: dataset.length,
      anomaliesDetected: anomalies.length,
      anomalyDetails: anomalies,
      timestamp: new Date().toISOString(),
    };

    // Here, I'm storing the generated report temporarily
    const reportId = `report_${fileId}`;
    await writeFile(`uploads/${reportId}.json`, JSON.stringify(report));

    res.json({ reportId, summary: report });
  } catch (error) {
    next(error);
  }
};
