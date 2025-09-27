import FilecoinService from "../services/filecoin.service.js";
import { createError } from "../utils/errorhandler.js";

export const uploadDataset = async (req, res, next) => {
  try {
    const files = req.files.map((f) => f.buffer.toString());
    const cid = await FilecoinService.storeData(files);
    res.status(200).json({ cid });
  } catch (error) {
    next(createError(500, error.message));
  }
};

export const retrieveDataset = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const files = await FilecoinService.retrieveData(cid);
    res.status(200).json({ files });
  } catch (error) {
    next(createError(500, error.message));
  }
};
