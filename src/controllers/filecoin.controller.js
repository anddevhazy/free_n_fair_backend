import { readFile } from "fs/promises";
import FilecoinService from "../services/FilecoinService.js";
import { createError } from "../utils/errorHandler.js";

// My Filecoin storage and retrieval will be handled here
export const storeOnFilecoin = async (req, res, next) => {
  try {
    const { fileId, reportId } = req.body;
    const dataset = await readFile(`uploads/validated_${fileId}.json`);
    const report = await readFile(`uploads/${reportId}.json`);

    const cid = await FilecoinService.storeData([dataset, report]);

    res.json({ cid, message: "Data stored on Filecoin" });
  } catch (error) {
    next(error);
  }
};

export const verifyByCID = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const data = await FilecoinService.retrieveData(cid);

    res.json({ dataset: JSON.parse(data[0]), report: JSON.parse(data[1]) });
  } catch (error) {
    next(error);
  }
};
