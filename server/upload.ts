import { Router } from "express";
import { storagePut } from "./storage";

export const uploadRouter = Router();

uploadRouter.post("/upload", async (req, res) => {
  try {
    const { fileKey, data, contentType } = req.body;

    if (!fileKey || !data || !contentType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 将Base64转换回Buffer
    const buffer = Buffer.from(data, "base64");

    // 上传到S3
    const result = await storagePut(fileKey, buffer, contentType);

    res.json({ url: result.url, key: result.key });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});
