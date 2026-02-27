/**
 * 图片迁移脚本: 从 Manus CDN 迁移到 Cloudflare R2
 * 1. 查询数据库中所有产品图片URL
 * 2. 下载每张图片
 * 3. 上传到 Cloudflare R2
 * 4. 更新数据库中的URL
 */
import mysql from 'mysql2/promise';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import https from 'https';
import http from 'http';
import { URL } from 'url';

const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET = process.env.R2_BUCKET;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL?.replace(/\/+$/, '');

if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET || !R2_PUBLIC_URL) {
  console.error('❌ R2 环境变量未设置');
  process.exit(1);
}

const r2Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// 下载图片为 Buffer
function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    
    const req = client.get(url, { timeout: 30000 }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        // 处理重定向
        return downloadImage(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    });
    
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Timeout downloading ${url}`));
    });
  });
}

// 从URL推断Content-Type
function getContentType(url) {
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase();
  const types = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
  };
  return types[ext] || 'image/jpeg';
}

// 从URL生成R2 key
function generateR2Key(originalUrl, imageId) {
  try {
    const parsedUrl = new URL(originalUrl);
    const pathname = parsedUrl.pathname;
    const filename = pathname.split('/').pop() || `image-${imageId}`;
    // 确保文件名有扩展名
    const hasExt = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(filename);
    const finalFilename = hasExt ? filename : `${filename}.jpg`;
    return `products/${finalFilename}`;
  } catch {
    return `products/image-${imageId}-${Date.now()}.jpg`;
  }
}

// 查询所有需要迁移的图片（非R2 URL）
const [images] = await conn.execute(
  `SELECT id, productId, url, fileKey FROM product_images 
   WHERE url NOT LIKE '%r2.dev%' AND url NOT LIKE '%cloudflarestorage%'
   ORDER BY id`
);

console.log(`📦 需要迁移的图片: ${images.length} 张`);

let success = 0;
let failed = 0;
const failedImages = [];

for (let i = 0; i < images.length; i++) {
  const img = images[i];
  const progress = `[${i + 1}/${images.length}]`;
  
  try {
    // 1. 下载图片
    process.stdout.write(`${progress} 下载: ${img.url.substring(0, 60)}...`);
    const buffer = await downloadImage(img.url);
    
    // 2. 生成R2 key
    const r2Key = generateR2Key(img.url, img.id);
    const contentType = getContentType(img.url);
    
    // 3. 上传到R2
    await r2Client.send(new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: r2Key,
      Body: buffer,
      ContentType: contentType,
    }));
    
    // 4. 生成新URL
    const newUrl = `${R2_PUBLIC_URL}/${r2Key}`;
    
    // 5. 更新数据库
    await conn.execute(
      'UPDATE product_images SET url = ?, fileKey = ? WHERE id = ?',
      [newUrl, r2Key, img.id]
    );
    
    success++;
    console.log(` ✅ → ${newUrl.substring(0, 60)}`);
    
  } catch (err) {
    failed++;
    failedImages.push({ id: img.id, url: img.url, error: err.message });
    console.log(` ❌ 失败: ${err.message}`);
  }
  
  // 每10张暂停100ms避免限流
  if ((i + 1) % 10 === 0) {
    await new Promise(r => setTimeout(r, 100));
  }
}

await conn.end();

console.log('\n========== 迁移完成 ==========');
console.log(`✅ 成功: ${success} 张`);
console.log(`❌ 失败: ${failed} 张`);

if (failedImages.length > 0) {
  console.log('\n失败的图片:');
  failedImages.forEach(f => console.log(`  ID ${f.id}: ${f.error}`));
}
