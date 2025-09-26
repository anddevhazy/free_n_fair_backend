import { create } from "@web3-storage/w3up-client";
import { Blob } from "buffer";
import { createError } from "../utils/errorhandler.js";

export class FilecoinService {
  static async storeData(files) {
    try {
      const client = await create();
      await client.login(process.env.DID);

      const blobs = files.map((fileContent) => new Blob([fileContent]));
      const space = await client.getSpace(process.env.SPACE);
      const cid = await space.uploadFiles(blobs);

      return cid.toString();
    } catch (error) {
      throw createError(500, `w3up storage failed: ${error.message}`);
    }
  }

  static async retrieveData(cid) {
    try {
      const client = await create();
      await client.login(process.env.DID);

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
      throw createError(500, `w3up retrieval failed: ${error.message}`);
    }
  }
}
