import W3upClient from "@web3-storage/w3up-client";
import { Blob } from "buffer";
import { createError } from "../utils/errorhandler.js";

// Service file to handle Filecoin storage and retrieval
class FilecoinService {
  static async storeData(files) {
    try {
      const client = new W3upClient();

      const blobs = files.map((file) => new Blob([file]));
      const space = await client.getSpace(process.env.SPACE);
      const cid = await space.uploadFiles(blobs);

      return cid.toString();
    } catch (error) {
      throw createError(500, `Filecoin storage failed: ${error.message}`);
    }
  }

  static async retrieveData(cid) {
    try {
      const client = new W3upClient();

      const space = await client.getSpace(process.env.SPACE);
      const response = await space.downloadFiles(cid);

      const files = [];
      for await (const file of response) {
        files.push(await file.text());
      }

      if (files.length < 2) {
        throw new Error("Expected 2 files (dataset + report)");
      }

      return files;
    } catch (error) {
      throw createError(500, `Filecoin retrieval failed: ${error.message}`);
    }
  }
}

export default FilecoinService;
