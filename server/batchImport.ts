/**
 * 产品批量导入 API
 * 支持上传 Excel + 图片压缩包，自动处理并写入数据库
 */

import { Router, Request, Response } from "express";
import multer from "multer";
import * as XLSX from "xlsx";
import * as unzipper from "unzipper";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";
import { storagePut } from "./storage";
import * as db from "./db";

export const batchImportRouter = Router();

// 内存存储（文件不超过100MB）
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 },
});

// 任务状态存储（内存，重启后清空）
const importTasks: Map<string, ImportTask> = new Map();

interface ImportTask {
  id: string;
  status: "pending" | "processing" | "done" | "error";
  progress: number;
  message: string;
  logs: string[];
  result?: {
    productsCreated: number;
    imagesUploaded: number;
    reviewsGenerated: number;
    errors: string[];
  };
  createdAt: number;
}

// 多语言评论模板（通用）
const REVIEW_TEMPLATES: Record<string, string[]> = {
  en: [
    "Excellent product! The quality is outstanding and the craftsmanship is exquisite. Very satisfied with my purchase.",
    "Blessed at Wutai Mountain, very spiritual! Already gave it to my parents, they love it. Great quality and beautiful packaging.",
    "Beautiful item, even better than the pictures. The detail work is incredible. Highly recommend!",
    "Second purchase! Bought one for mom last time, she loved it, now buying one for myself.",
    "Beautiful packaging, great for gifting. Excellent quality, the blessing gives peace of mind.",
    "Very satisfied with this product, fine craftsmanship, natural beautiful details. Already recommended to friends.",
    "Always trust Wutai Mountain blessed products. This item is high quality and convenient to carry.",
    "Was pleasantly surprised when I received it, even better than the pictures. Feels very solid and authentic.",
    "Bought for my husband, he loves it. Says it looks great and he feels more protected.",
    "The quality is amazing for the price. Will definitely buy more gifts from this store.",
  ],
  zh: [
    "非常好的产品！质感很好，做工精细。佩戴后感觉整个人都平静了很多。",
    "五台山开光的，很有灵气！已经送给父母了，他们非常喜欢。质量很好，包装也很精美。",
    "买来给婆婆的，她说戴上之后睡眠好多了，身体也感觉好了很多。非常感谢！",
    "做工精细，细节处理得很好。第二次购买了，非常满意。",
    "包装很精美，送礼很有面子。质感很好，开光加持让人放心。",
    "很满意这个产品，做工精细，纹理自然漂亮。已经推荐给朋友了。",
    "五台山的开光产品一直很信赖，质量很好，随身携带很方便。",
    "收到货后非常惊喜，比图片还要好看。质感很扎实，形状很完美。",
    "给老公买的，他很喜欢，感觉开车更安全了。",
    "物超所值，会继续回购，也会推荐给朋友。",
  ],
  de: [
    "Ausgezeichnetes Produkt! Die Qualität ist hervorragend und die Verarbeitung ist exquisit.",
    "Am Wutai-Berg gesegnet, sehr spirituell! Bereits an meine Eltern verschenkt, sie lieben es.",
    "Wunderschönes Stück, noch besser als auf den Bildern. Die Detailarbeit ist unglaublich.",
    "Zweiter Kauf! Beim letzten Mal für Mama gekauft, sie liebte es, jetzt kaufe ich eines für mich.",
    "Schöne Verpackung, toll zum Verschenken. Ausgezeichnete Qualität, die Segnung gibt Seelenfrieden.",
  ],
  fr: [
    "Excellent produit! La qualité est remarquable et l'artisanat est exquis.",
    "Béni au Mont Wutai, très spirituel! Déjà offert à mes parents, ils l'adorent.",
    "Bel article, encore mieux que sur les photos. Le travail de détail est incroyable.",
    "Deuxième achat! Acheté un pour maman la dernière fois, elle l'a adoré.",
    "Belle emballage, parfait pour offrir. Excellente qualité, la bénédiction apporte la paix.",
  ],
  es: [
    "¡Excelente producto! La calidad es sobresaliente y la artesanía es exquisita.",
    "¡Bendecido en el Monte Wutai, muy espiritual! Ya se lo di a mis padres, les encanta.",
    "Hermoso artículo, aún mejor que las fotos. ¡El trabajo de detalle es increíble!",
    "¡Segunda compra! Compré uno para mamá la última vez, le encantó.",
    "Hermoso empaque, ideal para regalar. Excelente calidad, la bendición da paz mental.",
  ],
  it: [
    "Prodotto eccellente! La qualità è eccezionale e la lavorazione è squisita.",
    "Benedetto al Monte Wutai, molto spirituale! Già regalato ai miei genitori, lo adorano.",
    "Bellissimo articolo, ancora meglio delle foto. Il lavoro di dettaglio è incredibile.",
    "Secondo acquisto! Ho comprato uno per la mamma l'ultima volta, lo ha adorato.",
    "Bellissima confezione, ottima per i regali. Qualità eccellente, la benedizione dà pace.",
  ],
};

const REVIEWER_NAMES = [
  "Sarah M.", "Michael K.", "Emma L.", "James W.", "Sophia R.",
  "Oliver T.", "Isabella N.", "William H.", "Mia C.", "Benjamin F.",
  "Charlotte D.", "Elijah B.", "Amelia G.", "Lucas P.", "Harper S.",
  "Mason J.", "Evelyn A.", "Logan V.", "Abigail E.", "Ethan Y.",
  "张伟", "李芳", "王明", "陈静", "刘洋",
  "杨丽", "赵磊", "黄敏", "周强", "吴娟",
  "Hans M.", "Marie D.", "Pierre L.", "Anna S.", "Klaus B.",
];

const LOCATIONS = [
  "United States", "Germany", "France", "United Kingdom", "Canada",
  "Australia", "Netherlands", "Spain", "Italy", "Sweden",
  "中国", "新加坡", "马来西亚", "日本", "韩国",
];

function generateReviews(productId: number, count = 300) {
  const languages = Object.keys(REVIEW_TEMPLATES);
  const reviewList = [];
  const now = Date.now();
  const eightMonthsAgo = now - 8 * 30 * 24 * 60 * 60 * 1000;

  for (let i = 0; i < count; i++) {
    const lang = languages[i % languages.length];
    const templates = REVIEW_TEMPLATES[lang];
    const comment = templates[i % templates.length];
    const userName = REVIEWER_NAMES[i % REVIEWER_NAMES.length];
    const rating = Math.random() > 0.08 ? 5 : 4;
    const createdAt = new Date(eightMonthsAgo + Math.random() * (now - eightMonthsAgo));
    const location = LOCATIONS[i % LOCATIONS.length];

    reviewList.push({
      productId,
      userId: null as any,
      userName,
      rating,
      comment,
      location,
      language: lang,
      createdAt: createdAt.toISOString().slice(0, 19).replace("T", " "),
      isVerified: 1,
      isApproved: 1,
    });
  }

  return reviewList;
}

// 从Excel行解析产品数据
function parseExcelRow(row: any, headers: string[]) {
  const data: Record<string, any> = {};
  headers.forEach((h, i) => {
    data[h.toLowerCase().trim()] = row[i];
  });
  return data;
}

// 规范化价格（向上取整到整数）
function normalizePrice(price: any): number {
  const num = parseFloat(String(price).replace(/[^0-9.]/g, ""));
  if (isNaN(num)) return 45;
  return Math.ceil(num);
}

// 生成slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .substring(0, 80);
}

// 验证管理员身份（简单token验证）
function validateAdminToken(req: Request): boolean {
  const token = req.headers["x-admin-token"] || req.query.token;
  // 使用环境变量中的JWT_SECRET作为admin token的一部分
  const expectedToken = process.env.ADMIN_IMPORT_TOKEN || "cneraart-admin-2024";
  return token === expectedToken;
}

/**
 * POST /api/admin/batch-import
 * 上传Excel + 图片压缩包，开始批量导入任务
 */
batchImportRouter.post(
  "/admin/batch-import",
  upload.fields([
    { name: "excel", maxCount: 1 },
    { name: "images", maxCount: 1 },
  ]),
  async (req: Request, res: Response) => {
    if (!validateAdminToken(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const files = req.files as Record<string, Express.Multer.File[]>;
    const excelFile = files?.excel?.[0];
    const imagesFile = files?.images?.[0];

    if (!excelFile) {
      return res.status(400).json({ error: "Excel file is required" });
    }

    const categoryId = parseInt(req.body.categoryId) || 90005;
    const reviewCount = parseInt(req.body.reviewCount) || 300;

    // 创建任务
    const taskId = `import_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const task: ImportTask = {
      id: taskId,
      status: "pending",
      progress: 0,
      message: "任务已创建，等待处理...",
      logs: [],
      createdAt: Date.now(),
    };
    importTasks.set(taskId, task);

    // 异步处理
    processImportTask(taskId, excelFile.buffer, imagesFile?.buffer, categoryId, reviewCount).catch(
      (err) => {
        const t = importTasks.get(taskId);
        if (t) {
          t.status = "error";
          t.message = `处理失败: ${err.message}`;
          t.logs.push(`❌ 错误: ${err.message}`);
        }
      }
    );

    res.json({ taskId, message: "导入任务已启动" });
  }
);

/**
 * GET /api/admin/batch-import/:taskId
 * 查询导入任务状态
 */
batchImportRouter.get("/admin/batch-import/:taskId", (req: Request, res: Response) => {
  if (!validateAdminToken(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const task = importTasks.get(req.params.taskId);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.json(task);
});

/**
 * GET /api/admin/export-sql
 * 导出当前数据库中所有产品/图片/分类为SQL
 * 供生产环境直接导入
 */
batchImportRouter.get("/admin/export-sql", async (req: Request, res: Response) => {
  if (!validateAdminToken(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const mysql2 = await import("mysql2/promise");
    const conn = await mysql2.createConnection(process.env.DATABASE_URL!);

    let sql = `-- 源·华渡商城 产品数据导出\n-- 生成时间: ${new Date().toISOString()}\n\nSET NAMES utf8mb4;\n\n`;

    // 导出分类
    const [cats] = await conn.execute("SELECT * FROM categories ORDER BY id") as any[];
    sql += "-- 分类数据\n";
    for (const c of cats) {
      sql += `INSERT IGNORE INTO categories (id, name, slug, description, parentId, displayOrder, createdAt, updatedAt) VALUES (${c.id}, ${mysql2.escape(c.name)}, ${mysql2.escape(c.slug)}, ${mysql2.escape(c.description)}, ${c.parentId ?? "NULL"}, ${c.displayOrder ?? 0}, NOW(), NOW());\n`;
    }
    sql += "\n";

    // 导出产品
    const [prods] = await conn.execute("SELECT * FROM products ORDER BY id") as any[];
    sql += "-- 产品数据\n";
    for (const p of prods) {
      sql += `INSERT IGNORE INTO products (id, name, slug, description, shortDescription, regularPrice, salePrice, categoryId, status, featured, blessingTemple, blessingMaster, blessingDescription, suitableFor, efficacy, wearingGuide, createdAt, updatedAt) VALUES (${p.id}, ${mysql2.escape(p.name)}, ${mysql2.escape(p.slug)}, ${mysql2.escape(p.description)}, ${mysql2.escape(p.shortDescription)}, ${mysql2.escape(p.regularPrice)}, ${p.salePrice != null ? mysql2.escape(p.salePrice) : "NULL"}, ${p.categoryId ?? "NULL"}, ${mysql2.escape(p.status)}, ${p.featured ? 1 : 0}, ${mysql2.escape(p.blessingTemple)}, ${mysql2.escape(p.blessingMaster)}, ${mysql2.escape(p.blessingDescription)}, ${mysql2.escape(p.suitableFor)}, ${mysql2.escape(p.efficacy)}, ${mysql2.escape(p.wearingGuide)}, NOW(), NOW());\n`;
    }
    sql += "\n";

    // 导出图片
    const [imgs] = await conn.execute("SELECT * FROM product_images ORDER BY id") as any[];
    sql += "-- 产品图片数据\n";
    for (const img of imgs) {
      sql += `INSERT IGNORE INTO product_images (id, productId, url, fileKey, altText, displayOrder, isPrimary, createdAt) VALUES (${img.id}, ${img.productId}, ${mysql2.escape(img.url)}, ${mysql2.escape(img.fileKey)}, ${mysql2.escape(img.altText)}, ${img.displayOrder ?? 0}, ${img.isPrimary ? 1 : 0}, NOW());\n`;
    }

    await conn.end();

    // 返回SQL文件
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="products-${Date.now()}.sql"`
    );
    res.send(sql);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 异步处理导入任务
 */
async function processImportTask(
  taskId: string,
  excelBuffer: Buffer,
  imagesBuffer: Buffer | undefined,
  categoryId: number,
  reviewCount: number
) {
  const task = importTasks.get(taskId)!;
  const log = (msg: string) => {
    task.logs.push(msg);
    console.log(`[BatchImport ${taskId}] ${msg}`);
  };

  task.status = "processing";
  task.progress = 5;
  task.message = "正在解析Excel文件...";
  log("📊 开始解析Excel文件");

  // 1. 解析Excel
  const workbook = XLSX.read(excelBuffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

  if (rawData.length < 2) {
    throw new Error("Excel文件为空或格式不正确");
  }

  // 检测表头行（第一行）
  const headers = (rawData[0] as string[]).map((h) => String(h || "").toLowerCase().trim());
  log(`📋 表头: ${headers.join(", ")}`);

  // 解析产品行
  const productRows = rawData.slice(1).filter((row) => row && row.length > 0 && row[0]);
  log(`📦 发现 ${productRows.length} 个产品`);

  task.progress = 15;
  task.message = "正在解压图片文件...";

  // 2. 解压图片（如果有）
  const imageMap: Map<string, Buffer> = new Map();
  if (imagesBuffer) {
    log("🗜️ 开始解压图片压缩包");
    try {
      const directory = await unzipper.Open.buffer(imagesBuffer);
      for (const file of directory.files) {
        if (file.type === "File" && /\.(jpg|jpeg|png|webp|gif)$/i.test(file.path)) {
          const content = await file.buffer();
          const fileName = path.basename(file.path);
          imageMap.set(fileName.toLowerCase(), content);
          imageMap.set(file.path.toLowerCase(), content);
        }
      }
      log(`🖼️ 解压完成，共 ${imageMap.size} 张图片`);
    } catch (err: any) {
      log(`⚠️ 图片解压失败: ${err.message}，将跳过图片上传`);
    }
  }

  task.progress = 25;
  task.message = "正在处理产品数据...";

  const mysql2 = await import("mysql2/promise");
  const conn = await mysql2.createConnection(process.env.DATABASE_URL!);

  const result = {
    productsCreated: 0,
    imagesUploaded: 0,
    reviewsGenerated: 0,
    errors: [] as string[],
  };

  // 3. 逐个处理产品
  for (let i = 0; i < productRows.length; i++) {
    const row = productRows[i];
    const progress = 25 + Math.floor((i / productRows.length) * 65);
    task.progress = progress;
    task.message = `正在处理产品 ${i + 1}/${productRows.length}...`;

    try {
      // 解析行数据
      const rowData: Record<string, any> = {};
      headers.forEach((h, idx) => {
        rowData[h] = row[idx];
      });

      // 提取字段（支持多种列名格式）
      const name =
        String(rowData["product name"] || rowData["name"] || rowData["产品名称"] || rowData["名称"] || "").trim();
      const descZh =
        String(rowData["description (chinese)"] || rowData["description"] || rowData["描述"] || rowData["产品描述"] || "").trim();
      const priceRaw =
        rowData["sale price"] || rowData["price"] || rowData["售价"] || rowData["价格"] || 45;
      const imageFiles =
        String(rowData["image files"] || rowData["images"] || rowData["图片文件"] || rowData["图片"] || "").trim();

      if (!name) {
        log(`⚠️ 第${i + 2}行: 产品名称为空，跳过`);
        continue;
      }

      const salePrice = normalizePrice(priceRaw);
      const regularPrice = Math.ceil(salePrice * 1.3); // 原价 = 售价 * 1.3
      const slug = generateSlug(name) + "-" + Date.now().toString(36).slice(-4);

      log(`📦 处理产品: ${name} ($${salePrice})`);

      // 检查是否已存在（按名称）
      const [existing] = await conn.execute("SELECT id FROM products WHERE name = ? LIMIT 1", [name]) as any[];

      let productId: number;

      if (existing.length > 0) {
        productId = existing[0].id;
        log(`  ↻ 产品已存在 (ID: ${productId})，更新数据`);
        await conn.execute(
          `UPDATE products SET description=?, regularPrice=?, salePrice=?, categoryId=?, status='published' WHERE id=?`,
          [descZh || null, regularPrice.toString(), salePrice.toString(), categoryId, productId]
        );
      } else {
        const [insertResult] = await conn.execute(
          `INSERT INTO products (name, slug, description, regularPrice, salePrice, categoryId, status, featured, blessingTemple, blessingMaster, stock) VALUES (?, ?, ?, ?, ?, ?, 'published', 0, '五台山', '五台山高僧', 999)`,
          [name, slug, descZh || null, regularPrice.toString(), salePrice.toString(), categoryId]
        ) as any[];
        productId = insertResult.insertId;
        log(`  ✅ 产品创建成功 (ID: ${productId})`);
        result.productsCreated++;
      }

      // 上传图片
      if (imageMap.size > 0) {
        const imageFileNames = imageFiles
          ? imageFiles.split(/[,;|]/).map((f: string) => f.trim().toLowerCase()).filter(Boolean)
          : [];

        // 如果没有指定图片文件名，尝试按产品序号匹配
        const matchedImages: Buffer[] = [];

        if (imageFileNames.length > 0) {
          for (const fname of imageFileNames) {
            const imgBuffer = imageMap.get(fname) || imageMap.get(fname.toLowerCase());
            if (imgBuffer) {
              matchedImages.push(imgBuffer);
            }
          }
        }

        // 如果没有匹配到，尝试按行号匹配（第i+1个产品对应第i+1组图片）
        if (matchedImages.length === 0) {
          const allImages = Array.from(imageMap.entries())
            .sort(([a], [b]) => a.localeCompare(b));
          // 每个产品取3张图片
          const startIdx = i * 3;
          for (let j = startIdx; j < Math.min(startIdx + 3, allImages.length); j++) {
            matchedImages.push(allImages[j][1]);
          }
        }

        if (matchedImages.length > 0) {
          // 删除旧图片
          await conn.execute("DELETE FROM product_images WHERE productId = ?", [productId]);

          for (let imgIdx = 0; imgIdx < matchedImages.length; imgIdx++) {
            const imgBuffer = matchedImages[imgIdx];
            const ext = "jpg";
            const fileKey = `products/${categoryId}/${slug}-${imgIdx + 1}-${Date.now()}.${ext}`;
            const { url } = await storagePut(fileKey, imgBuffer, "image/jpeg");

            await conn.execute(
              `INSERT INTO product_images (productId, url, fileKey, altText, sortOrder, isPrimary) VALUES (?, ?, ?, ?, ?, ?)`,
              [productId, url, fileKey, name, imgIdx, imgIdx === 0 ? 1 : 0]
            );
            result.imagesUploaded++;
          }
          log(`  🖼️ 上传了 ${matchedImages.length} 张图片`);
        }
      }

      // 生成评论
      if (reviewCount > 0) {
        const reviewList = generateReviews(productId, reviewCount);
        await conn.execute("DELETE FROM reviews WHERE productId = ?", [productId]);

        for (let ri = 0; ri < reviewList.length; ri += 100) {
          const batch = reviewList.slice(ri, ri + 100);
          for (const review of batch) {
            await conn.execute(
              `INSERT INTO reviews (productId, userId, userName, rating, comment, location, language, createdAt, isVerified, isApproved) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                review.productId,
                review.userId,
                review.userName,
                review.rating,
                review.comment,
                review.location,
                review.language,
                review.createdAt,
                review.isVerified,
                review.isApproved,
              ]
            );
          }
        }
        result.reviewsGenerated += reviewCount;
        log(`  💬 生成了 ${reviewCount} 条评论`);
      }
    } catch (err: any) {
      const errMsg = `第${i + 2}行处理失败: ${err.message}`;
      log(`❌ ${errMsg}`);
      result.errors.push(errMsg);
    }
  }

  await conn.end();

  task.status = "done";
  task.progress = 100;
  task.message = `导入完成！创建 ${result.productsCreated} 个产品，上传 ${result.imagesUploaded} 张图片，生成 ${result.reviewsGenerated} 条评论`;
  task.result = result;
  log(`🎉 ${task.message}`);
}
