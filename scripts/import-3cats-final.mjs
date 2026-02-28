/**
 * 最终版：导入 Inner Peace / Wealth & Fortune / Wisdom & Study 三个分类产品
 * - 读取Excel成本价，计算 salePrice=(成本+300)/7，regularPrice=salePrice*1.05
 * - 上传图片到 R2
 * - 写入生产数据库
 */
import mysql2 from 'mysql2/promise';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import openpyxl from 'xlsx';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// R2配置（从环境变量读取）
const R2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});
const R2_BUCKET = process.env.R2_BUCKET;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

// 分类ID
const CAT_INNER_PEACE = 90007;   // 心灵平和
const CAT_WEALTH = 90004;         // 招财旺运
const CAT_WISDOM = 90006;         // 智慧学业

// 计算价格
function calcPrice(cost) {
  const salePrice = Math.round((cost + 300) / 7);
  const regularPrice = Math.round(salePrice * 1.05);
  return { salePrice, regularPrice };
}

// slugify
function slugify(str) {
  return str.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .substring(0, 60);
}

// 随机后缀
function randomSuffix() {
  return Math.random().toString(36).substring(2, 8);
}

// 上传单张图片
async function uploadImage(filePath, productSlug, index) {
  const ext = path.extname(filePath).toLowerCase();
  const key = `products/${productSlug}-${index}-${randomSuffix()}${ext}`;
  const data = fs.readFileSync(filePath);
  const contentType = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
  
  await R2.send(new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    Body: data,
    ContentType: contentType,
  }));
  
  return {
    url: `${R2_PUBLIC_URL}/${key}`,
    fileKey: key,
    displayOrder: index,
    isPrimary: index === 0,
  };
}

// 上传产品目录下所有图片
async function uploadProductImages(imgDir, productSlug) {
  if (!fs.existsSync(imgDir)) {
    console.log(`    ⚠️ 图片目录不存在: ${imgDir}`);
    return [];
  }
  
  const files = fs.readdirSync(imgDir)
    .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .sort();
  
  const images = [];
  for (let i = 0; i < files.length; i++) {
    const filePath = path.join(imgDir, files[i]);
    try {
      const img = await uploadImage(filePath, productSlug, i);
      images.push(img);
      process.stdout.write('.');
    } catch (e) {
      console.log(`    ❌ 上传失败: ${files[i]} - ${e.message}`);
    }
  }
  return images;
}

// 读取Excel产品数据
function readExcel(xlsxPath) {
  const workbook = openpyxl.readFile(xlsxPath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = openpyxl.utils.sheet_to_json(sheet, { header: 1 });
  
  const products = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row[0] || !row[4] || !row[6]) continue; // 序号、标题、成本价
    
    const title = String(row[4]).trim();
    const cost = Number(row[6]);
    if (isNaN(cost) || cost <= 0) continue;
    
    products.push({ seq: row[0], title, cost });
  }
  return products;
}

// 产品英文名称和描述映射（从之前的脚本中提取）
const INNER_PEACE_EN = {
  '黑曜石水滴吊坠': {
    name: 'Obsidian Teardrop Pendant',
    shortDesc: 'Natural obsidian teardrop pendant for protection and spiritual grounding.',
    desc: 'Crafted from genuine natural obsidian, this teardrop-shaped pendant carries powerful protective energy. Obsidian is revered in Eastern spiritual traditions for its ability to shield against negative energies and promote inner peace. Each piece is uniquely formed by volcanic activity, making it a one-of-a-kind spiritual companion.',
    dirName: '黑曜石水滴吊坠',
  },
  '黑曜石转运珠手链': {
    name: 'Obsidian Lucky Bead Bracelet',
    shortDesc: 'Natural obsidian lucky bead bracelet for protection and good fortune.',
    desc: 'This elegant bracelet features genuine obsidian beads known for their powerful protective properties. In Chinese spiritual tradition, obsidian is believed to ward off evil spirits and attract positive energy. The smooth, polished beads create a beautiful accessory that serves both aesthetic and spiritual purposes.',
    dirName: '黑曜石转运珠手链',
  },
  '白玉髓平安如意吊坠': {
    name: 'White Chalcedony Peace & Prosperity Pendant',
    shortDesc: 'White chalcedony Ruyi pendant symbolizing peace and good fortune.',
    desc: 'This beautiful pendant features genuine white chalcedony carved into the traditional Ruyi shape, a symbol of good fortune and fulfillment of wishes in Chinese culture. White chalcedony is associated with clarity, calm, and positive energy flow.',
    dirName: '如意玉坠',
  },
  '菩提杏花微雨手串': {
    name: 'Bodhi Apricot Blossom Mist Bracelet',
    shortDesc: 'Natural Bodhi seed bracelet with delicate apricot blossom pattern.',
    desc: 'Handcrafted from genuine Bodhi seeds, this bracelet features a delicate apricot blossom pattern that evokes the serenity of spring rain. Bodhi seeds are sacred in Buddhist tradition, symbolizing enlightenment and spiritual awakening. Each bead carries the natural energy of the Bodhi tree.',
    dirName: '天然菩提杏花微雨手串',
  },
  '紫金砂吊坠挂脖项链': {
    name: 'Purple Goldstone Pendant Necklace',
    shortDesc: 'Elegant purple goldstone pendant necklace for spiritual elevation.',
    desc: 'This stunning necklace features genuine purple goldstone beads, known in Chinese spiritual tradition for their ability to elevate consciousness and attract positive cosmic energy. The deep purple hue with golden sparkles represents the connection between earth and heaven.',
    dirName: '朱砂吊坠',
  },
  '朱砂平安扣平安红手链': {
    name: 'Cinnabar Peace Buckle Red Bracelet',
    shortDesc: 'Traditional cinnabar peace buckle bracelet in auspicious red.',
    desc: 'This bracelet combines the powerful protective energy of cinnabar with the traditional Peace Buckle (平安扣) design. Cinnabar has been used in Chinese spiritual practices for thousands of years for its protective and luck-enhancing properties. The red color represents vitality and good fortune.',
    dirName: '朱砂平安扣红绳手链',
  },
  '朱砂平安扣喜乐红手链': {
    name: 'Cinnabar Peace Buckle Joy Red Bracelet',
    shortDesc: 'Cinnabar peace buckle bracelet in joyful red for happiness and protection.',
    desc: 'Featuring the sacred cinnabar stone in a traditional Peace Buckle design, this bracelet radiates joy and protection. Cinnabar is revered in Taoist traditions for its powerful yang energy that dispels negativity and invites happiness into one\'s life.',
    dirName: '朱砂平安扣红绳手链',
  },
  '黑曜石海蓝宝水晶手串': {
    name: 'Obsidian Aquamarine Crystal Bracelet',
    shortDesc: 'Dual-energy bracelet combining obsidian protection with aquamarine clarity.',
    desc: 'This powerful bracelet combines the protective energy of obsidian with the clarity-enhancing properties of aquamarine crystal. Together, they create a harmonious balance of protection and spiritual clarity. Obsidian shields against negative energies while aquamarine promotes calm, clear thinking and emotional balance.',
    dirName: '黑曜石海蓝宝水晶手串',
  },
};

const WEALTH_EN = {
  '绿檀木天然沉香红玛瑙手串': {
    name: 'Green Sandalwood Natural Agarwood Red Agate Bracelet',
    shortDesc: 'Premium green sandalwood and agarwood bracelet with red agate for wealth attraction.',
    desc: 'This exquisite bracelet combines three powerful wealth-attracting materials: green sandalwood, natural agarwood, and red agate. In Chinese feng shui tradition, this combination is believed to create a powerful energy field that attracts prosperity and good fortune. The natural fragrance of agarwood adds a meditative quality to this beautiful piece.',
    dirName: '绿檀木天然沉香红玛瑙手串',
  },
  '朱砂转运珠手串': {
    name: 'Cinnabar Lucky Bead Bracelet',
    shortDesc: 'Traditional cinnabar lucky bead bracelet for turning fortune and attracting wealth.',
    desc: 'This traditional bracelet features genuine cinnabar beads, one of the most powerful wealth-attracting stones in Chinese spiritual tradition. Cinnabar is believed to activate the energy centers associated with prosperity and help turn one\'s fortune in a positive direction.',
    dirName: '朱砂转运珠手绳',
  },
  '红玉髓平安扣钥匙扣【莲花款】': {
    name: 'Red Carnelian Peace Buckle Keychain - Lotus Design',
    shortDesc: 'Red carnelian peace buckle keychain with lotus motif for protection and prosperity.',
    desc: 'This beautiful keychain features a genuine red carnelian Peace Buckle adorned with an intricate lotus design. Red carnelian is associated with vitality, courage, and motivation in Chinese crystal healing traditions. The lotus symbolizes purity and spiritual enlightenment.',
    dirName: '玉髓平安扣莲花钥匙扣',
  },
  '绿玉髓平安扣钥匙扣【莲花款】': {
    name: 'Green Chalcedony Peace Buckle Keychain - Lotus Design',
    shortDesc: 'Green chalcedony peace buckle keychain with lotus motif for harmony and growth.',
    desc: 'This elegant keychain features genuine green chalcedony carved into the traditional Peace Buckle shape with a lotus motif. Green chalcedony is associated with growth, harmony, and new beginnings. It is believed to promote emotional balance and attract positive opportunities.',
    dirName: '玉髓平安扣莲花钥匙扣',
  },
  '白玉髓平安扣钥匙扣【莲花款】': {
    name: 'White Chalcedony Peace Buckle Keychain - Lotus Design',
    shortDesc: 'White chalcedony peace buckle keychain with lotus motif for clarity and peace.',
    desc: 'This refined keychain features genuine white chalcedony in the traditional Peace Buckle design with a lotus motif. White chalcedony is prized for its ability to promote mental clarity, inner peace, and positive communication. A perfect daily companion for those seeking serenity.',
    dirName: '玉髓平安扣莲花钥匙扣',
  },
  '朱砂钱袋手机挂件': {
    name: 'Cinnabar Money Bag Phone Charm',
    shortDesc: 'Traditional cinnabar money bag phone charm for attracting wealth and prosperity.',
    desc: 'This charming phone accessory features a genuine cinnabar money bag, a traditional Chinese symbol of wealth and abundance. Cinnabar is one of the most powerful wealth-attracting stones in Chinese spiritual practice. Hang it on your phone to invite prosperity into your daily life.',
    dirName: '朱砂钱袋、貔貅、莲花、五帝钱手机链',
  },
  '朱砂貔貅手机挂件': {
    name: 'Cinnabar Pixiu Phone Charm',
    shortDesc: 'Cinnabar Pixiu mythical creature phone charm for wealth protection.',
    desc: 'The Pixiu (貔貅) is one of the most powerful wealth-attracting symbols in Chinese mythology. This phone charm features a genuine cinnabar Pixiu, combining the wealth-attracting power of the mythical creature with the protective energy of cinnabar. It is believed to attract wealth and prevent it from leaving.',
    dirName: '朱砂钱袋、貔貅、莲花、五帝钱手机链',
  },
  '紫金砂莲花手机挂件': {
    name: 'Purple Goldstone Lotus Phone Charm',
    shortDesc: 'Purple goldstone lotus phone charm for spiritual elevation and prosperity.',
    desc: 'This beautiful phone charm features a purple goldstone lotus, combining the spiritual symbolism of the lotus flower with the cosmic energy of purple goldstone. The lotus represents purity and enlightenment, while purple goldstone is believed to enhance ambition and attract success.',
    dirName: '朱砂钱袋、貔貅、莲花、五帝钱手机链',
  },
  '紫金砂五帝钱手机挂件': {
    name: 'Purple Goldstone Five Emperor Coins Phone Charm',
    shortDesc: 'Purple goldstone five emperor coins phone charm for maximum wealth attraction.',
    desc: 'The Five Emperor Coins (五帝钱) represent the combined power of five prosperous Chinese dynasties and are considered one of the most powerful feng shui wealth symbols. This phone charm combines this ancient symbol with purple goldstone for enhanced prosperity energy.',
    dirName: '朱砂钱袋、貔貅、莲花、五帝钱手机链',
  },
  '紫金砂招财纳福手机链': {
    name: 'Purple Goldstone Wealth Attraction Phone Chain',
    shortDesc: 'Purple goldstone phone chain for attracting wealth and blessings.',
    desc: 'This elegant phone chain features genuine purple goldstone beads with colorful agate accents, creating a powerful combination for attracting wealth and blessings. Purple goldstone is believed to enhance ambition and drive, while the agate beads add stability and grounding energy.',
    dirName: '朱砂钱袋、貔貅、莲花、五帝钱手机链',
  },
  '紫金砂大吉大利手机链': {
    name: 'Purple Goldstone Great Fortune Phone Chain',
    shortDesc: 'Purple goldstone great fortune phone chain for abundant luck.',
    desc: 'Inspired by the auspicious phrase "大吉大利" (Great Fortune and Prosperity), this phone chain features purple goldstone beads with vibrant agate accents. Carry this beautiful accessory to invite abundant luck and positive energy into every aspect of your life.',
    dirName: '朱砂钱袋、貔貅、莲花、五帝钱手机链',
  },
  '红砂招财纳福手机链': {
    name: 'Red Sand Wealth Attraction Phone Chain',
    shortDesc: 'Red sand phone chain for powerful wealth attraction and good fortune.',
    desc: 'This vibrant phone chain features genuine red sand beads with colorful agate accents. Red is the color of luck and prosperity in Chinese culture, and red sand carries powerful yang energy that is believed to activate wealth-attracting forces. A beautiful and spiritually powerful accessory.',
    dirName: '朱砂钱袋、貔貅、莲花、五帝钱手机链',
  },
  '红砂大吉大利手机链': {
    name: 'Red Sand Great Fortune Phone Chain',
    shortDesc: 'Red sand great fortune phone chain for maximum luck and prosperity.',
    desc: 'Combining the powerful wealth energy of red sand with the auspicious symbolism of "大吉大利" (Great Fortune), this phone chain is designed to maximize positive energy flow. The red sand beads carry strong yang energy while the agate accents provide balance and stability.',
    dirName: '朱砂钱袋、貔貅、莲花、五帝钱手机链',
  },
};

const WISDOM_EN = {
  '天然纯净白水晶手串': {
    name: 'Natural Pure White Crystal Bracelet',
    shortDesc: 'Pure natural white crystal bracelet for clarity, wisdom, and mental focus.',
    desc: 'Crafted from genuine natural white crystal, this bracelet is prized for its ability to enhance mental clarity and focus. In Chinese crystal healing traditions, white crystal is considered the "master healer" and is particularly beneficial for students and those engaged in intellectual pursuits. Each bead is carefully selected for its purity and clarity.',
    dirName: '天然纯净白水晶手串手链',
  },
  '天然白水晶平安扣吊坠': {
    name: 'Natural White Crystal Peace Buckle Pendant',
    shortDesc: 'Natural white crystal peace buckle pendant for protection and mental clarity.',
    desc: 'This elegant pendant features a genuine white crystal carved into the traditional Peace Buckle (平安扣) shape. White crystal is revered for its ability to amplify positive energy and enhance mental clarity. The Peace Buckle design adds an additional layer of protection and good fortune.',
    dirName: '天然白水晶平安扣吊坠',
  },
  '红色绳款天然白水晶葫芦吊坠': {
    name: 'Natural White Crystal Gourd Pendant - Red Cord',
    shortDesc: 'White crystal gourd pendant on red cord for wisdom and health.',
    desc: 'The gourd (葫芦) is a powerful symbol in Chinese culture, representing health, longevity, and the ability to absorb negative energy. This pendant features a genuine white crystal gourd on a traditional red cord. White crystal enhances the gourd\'s natural ability to promote wisdom and protect health.',
    dirName: '天然白水晶葫芦吊坠',
  },
  '褐色绳款天然白水晶葫芦吊坠': {
    name: 'Natural White Crystal Gourd Pendant - Brown Cord',
    shortDesc: 'White crystal gourd pendant on brown cord for grounded wisdom and health.',
    desc: 'This sophisticated pendant features a genuine white crystal gourd on a natural brown cord. The brown cord adds an earthy, grounding quality to the crystal\'s clarifying energy. The gourd shape is a traditional Chinese symbol of health and wisdom, making this a meaningful spiritual accessory.',
    dirName: '天然白水晶葫芦吊坠',
  },
  '玛瑙平安扣喜乐红手链': {
    name: 'Agate Peace Buckle Joy Red Bracelet',
    shortDesc: 'Agate peace buckle bracelet in joyful red for happiness and academic success.',
    desc: 'This vibrant bracelet features genuine agate in the traditional Peace Buckle design with a joyful red color. Agate is associated with stability, focus, and perseverance—qualities essential for academic success. The red color adds vitality and enthusiasm to your studies.',
    dirName: '玛瑙平安扣红绳手链',
  },
  '玛瑙平安扣平安红手链': {
    name: 'Agate Peace Buckle Safety Red Bracelet',
    shortDesc: 'Agate peace buckle bracelet in classic red for protection and study focus.',
    desc: 'Combining the protective energy of the Peace Buckle with the focusing properties of genuine agate, this classic red bracelet is ideal for students seeking both protection and mental clarity. Agate is believed to enhance concentration and analytical thinking.',
    dirName: '玛瑙平安扣红绳手链',
  },
  '玛瑙平安扣海盐蓝手链': {
    name: 'Agate Peace Buckle Sea Salt Blue Bracelet',
    shortDesc: 'Agate peace buckle bracelet in calming sea salt blue for focused study.',
    desc: 'This serene bracelet features genuine agate in a calming sea salt blue color, perfect for creating a peaceful study environment. The blue color is associated with calm, focus, and clear communication. Combined with the protective Peace Buckle design, this bracelet supports both mental clarity and spiritual protection.',
    dirName: '玛瑙平安扣红绳手链（海盐、奶油、喜乐）',
  },
  '玛瑙平安扣奶油黄手链': {
    name: 'Agate Peace Buckle Cream Yellow Bracelet',
    shortDesc: 'Agate peace buckle bracelet in warm cream yellow for optimism and learning.',
    desc: 'This warm and inviting bracelet features genuine agate in a soft cream yellow color. Yellow is associated with optimism, creativity, and intellectual energy in color therapy traditions. The Peace Buckle design adds protective energy, making this an ideal companion for students and creative thinkers.',
    dirName: '玛瑙平安扣红绳手链（海盐、奶油、喜乐）',
  },
  '玛瑙平安扣喜乐红手链（第二款）': {
    name: 'Agate Peace Buckle Joyful Red Bracelet',
    shortDesc: 'Agate peace buckle bracelet in vibrant joyful red for enthusiasm and success.',
    desc: 'This energetic bracelet features genuine agate in a vibrant joyful red, designed to boost enthusiasm and motivation for learning. The Peace Buckle provides spiritual protection while the red agate energizes and inspires. Perfect for those who need an extra boost of positive energy in their studies.',
    dirName: '玛瑙平安扣红绳手链（海盐、奶油、喜乐）',
  },
};

// 通用描述模板（当找不到具体描述时使用）
function getEnInfo(title, category) {
  // 提取中文主标题（去掉括号内的规格）
  const mainTitle = title.split('\n')[0].trim();
  const spec = title.includes('\n') ? title.split('\n').slice(1).join(' ').replace(/[（）()]/g, '').trim() : '';
  
  let map;
  if (category === 'inner_peace') map = INNER_PEACE_EN;
  else if (category === 'wealth') map = WEALTH_EN;
  else map = WISDOM_EN;
  
  // 精确匹配
  if (map[mainTitle]) {
    const info = map[mainTitle];
    const specSuffix = spec ? ` - ${spec}` : '';
    return {
      name: info.name + specSuffix,
      shortDesc: info.shortDesc,
      desc: info.desc,
      dirName: info.dirName,
    };
  }
  
  // 模糊匹配
  for (const [key, info] of Object.entries(map)) {
    if (mainTitle.includes(key) || key.includes(mainTitle)) {
      const specSuffix = spec ? ` - ${spec}` : '';
      return {
        name: info.name + specSuffix,
        shortDesc: info.shortDesc,
        desc: info.desc,
        dirName: info.dirName,
      };
    }
  }
  
  // 默认
  return {
    name: mainTitle + (spec ? ` - ${spec}` : ''),
    shortDesc: `Traditional Chinese spiritual ${category} accessory.`,
    desc: `A beautiful traditional Chinese spiritual accessory crafted with care and blessed for positive energy.`,
    dirName: mainTitle,
  };
}

async function main() {
  const conn = await mysql2.createConnection(process.env.DATABASE_URL);
  console.log('✅ 已连接数据库');
  
  // 获取当前最大ID
  const [maxRow] = await conn.execute('SELECT MAX(id) as maxId FROM products');
  let nextId = Math.max(maxRow[0].maxId || 0, 700000) + 1;
  console.log(`📦 起始产品ID: ${nextId}`);
  
  const categories = [
    {
      name: 'Inner Peace',
      catId: CAT_INNER_PEACE,
      xlsxPath: '/home/ubuntu/upload/innerpeace.xlsx',
      imgBase: '/tmp/innerpeace_v5/inner peace/图片',
      catKey: 'inner_peace',
    },
    {
      name: 'Wealth & Fortune',
      catId: CAT_WEALTH,
      xlsxPath: '/home/ubuntu/upload/wealth&fortune.xlsx',
      imgBase: '/tmp/wealth_v5/wealth&fortune/图片',
      catKey: 'wealth',
    },
    {
      name: 'Wisdom & Study',
      catId: CAT_WISDOM,
      xlsxPath: '/home/ubuntu/upload/wisdom&study.xlsx',
      imgBase: '/tmp/wisdom_v5/wisdom&study/图片',
      catKey: 'wisdom',
    },
  ];
  
  let totalInserted = 0;
  
  for (const cat of categories) {
    console.log(`\n\n📂 处理分类: ${cat.name} (catId=${cat.catId})`);
    
    const products = readExcel(cat.xlsxPath);
    console.log(`  读取到 ${products.length} 个产品`);
    
    for (const p of products) {
      const { salePrice, regularPrice } = calcPrice(p.cost);
      const enInfo = getEnInfo(p.title, cat.catKey);
      const slug = slugify(enInfo.name) + '-' + nextId;
      
      console.log(`\n  [${p.seq}] ${p.title.substring(0, 30)} → ${enInfo.name.substring(0, 40)}`);
      console.log(`       成本:¥${p.cost} | 售价:$${salePrice} | 划线:$${regularPrice}`);
      
      // 上传图片
      const imgDir = path.join(cat.imgBase, enInfo.dirName);
      process.stdout.write('       上传图片: ');
      const images = await uploadProductImages(imgDir, slug);
      console.log(` ${images.length}张`);
      
      // 插入产品
      await conn.execute(
        `INSERT IGNORE INTO products 
         (id, name, slug, description, shortDescription, regularPrice, salePrice, categoryId, 
          status, featured, stock, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'published', 0, 999, NOW(), NOW())`,
        [
          nextId,
          enInfo.name,
          slug,
          enInfo.desc,
          enInfo.shortDesc,
          regularPrice.toString(),
          salePrice.toString(),
          cat.catId,
        ]
      );
      
      // 插入图片
      for (const img of images) {
        await conn.execute(
          `INSERT INTO product_images (productId, url, fileKey, altText, displayOrder, isPrimary, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, NOW())`,
          [nextId, img.url, img.fileKey, enInfo.name, img.displayOrder, img.isPrimary ? 1 : 0]
        );
      }
      
      console.log(`       ✅ ID ${nextId} 已插入`);
      nextId++;
      totalInserted++;
    }
  }
  
  // 验证结果
  console.log('\n\n=== 导入完成 ===');
  const [counts] = await conn.execute(
    `SELECT c.name as catName, COUNT(p.id) as cnt 
     FROM categories c 
     LEFT JOIN products p ON p.categoryId = c.id 
     WHERE c.id IN (${CAT_INNER_PEACE}, ${CAT_WEALTH}, ${CAT_WISDOM})
     GROUP BY c.id, c.name`
  );
  counts.forEach(r => console.log(`  ${r.catName}: ${r.cnt} 个产品`));
  console.log(`\n共插入 ${totalInserted} 个产品`);
  
  await conn.end();
}

main().catch(console.error);
