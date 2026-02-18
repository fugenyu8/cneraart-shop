import { Request, Response } from "express";
import { storagePut } from "./storage";
import multer from "multer";
import { randomBytes } from "crypto";

// 配置multer用于内存存储
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    // 只允许图片
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

/**
 * 上传命理服务图片到S3
 */
export const uploadFortuneImageHandler = upload.single("file");

export async function handleFortuneImageUpload(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // 生成随机文件名
    const randomSuffix = randomBytes(8).toString("hex");
    const ext = req.file.originalname.split(".").pop() || "jpg";
    const fileKey = `fortune-images/${Date.now()}-${randomSuffix}.${ext}`;

    // 上传到S3
    const { url } = await storagePut(
      fileKey,
      req.file.buffer,
      req.file.mimetype
    );

    return res.json({ url, key: fileKey });
  } catch (error) {
    console.error("Error uploading fortune image:", error);
    return res.status(500).json({ error: "Failed to upload image" });
  }
}
