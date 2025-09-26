import { create } from "@web3-storage/w3up-client";
import { createError } from "../utils/errorHandler.js";

// service file to handle my filecoin storage and retrieval
class FilecoinService {
  static async storeData(files) {
    try {
      const client = await create();
      await client.login(process.env.FILECOIN_API_KEY);

      const cid = await client.uploadFiles(
        files.map((file) => new Blob([file]))
      );
      return cid.toString();
    } catch (error) {
      throw createError(500, `Filecoin storage failed: ${error.message}`);
    }
  }

  static async retrieveData(cid) {
    try {
      const client = await create();
      await client.login(process.env.FILECOIN_API_KEY);

      const response = await client.downloadFiles(cid);
      const files = [];

      for await (const file of response) {
        files.push(await file.text());
      }

      return files;
    } catch (error) {
      throw createError(500, `Filecoin retrieval failed: ${error.message}`);
    }
  }
}

export default FilecoinService;
