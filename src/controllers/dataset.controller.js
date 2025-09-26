import { promises as fs } from "fs";
import { parse } from "csv-parse";
import { validateElectionSchema } from "../utils/validator.js";
import { createError } from "../utils/errorhandler.js";

// trying to implement a simple dataset upload and validation
export const uploadDataset = async (req, res, next) => {
  try {
    if (!req.file) throw createError(400, "No file uploaded");

    const fileContent = await fs.readFile(req.file.path);
    let dataset;

    if (req.file.mimetype === "application/json") {
      dataset = JSON.parse(fileContent);
    } else if (req.file.mimetype === "text/csv") {
      dataset = await new Promise((resolve, reject) => {
        const records = [];
        parse(fileContent, { columns: true })
          .on("data", (record) => records.push(record))
          .on("end", () => resolve(records))
          .on("error", reject);
      });
    } else {
      throw createError(400, "Unsupported file type");
    }

    const isValid = validateElectionSchema(dataset);
    if (!isValid) throw createError(400, "Invalid dataset schema");

    // I'm storing the  dataset temporarily not in a database since it's for demo
    await fs.writeFile(
      `uploads/validated_${req.file.filename}.json`,
      JSON.stringify(dataset)
    );

    res.json({
      message: "Dataset uploaded and validated",
      fileId: req.file.filename,
    });
  } catch (error) {
    next(error);
  }
};
