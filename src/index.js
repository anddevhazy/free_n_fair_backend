import "dotenv/config";
import express from "express";
import multer from "multer";

import * as authController from "./controllers/auth.controller.js";
import * as datasetController from "./controllers/dataset.controller.js";
import * as analysisController from "./controllers/analysis.controller.js";
import * as filecoinController from "./controllers/filecoin.controller.js";
import { errorHandler } from "./utils/errorhandler.js";

const app = express();
const upload = multer({ dest: "uploads/" });
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.post("/auth/login", authController.login);
app.post("/upload", upload.single("dataset"), datasetController.uploadDataset);
app.post("/analyze", analysisController.analyzeDataset);
app.post("/store", filecoinController.storeOnFilecoin);
app.get("/verify/:cid", filecoinController.verifyByCID);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
