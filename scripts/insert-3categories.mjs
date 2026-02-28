/**
 * 批量上传 Inner Peace / Wealth & Fortune / Wisdom & Study 三个分类产品
 * 上传图片到 Cloudflare R2，写入生产数据库
 */
import mysql2 from 'mysql2/promise';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// R2 配置
const R2 = new S3Client({
  region: 'auto',
  endpoint: 'https://29cf0286c425d97503df396d9ffcada2.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: 'f47ba2a65a604c43983abda116a80349',
    secretAccessKey: '9e8915fbe737db0191f3cd873d52cf308fff7e23f035c50901a3e581d0c7b1d0',
  },
});
const R2_BUCKET = 'cneraart-assets';
const R2_PUBLIC_URL = 'https://pub-fcd65df361fe4419b10617be62eec737.r2.dev';

const PROD_URL = 'mysql://3sTgkhNymxcGJsq.dc2e5ef9e23e:3i3JNeXks4422BKffDiV@gateway03.us-east-1.prod.aws.tidbcloud.com:4000/c8K47cxkpiofT46rxSignU?ssl={"rejectUnauthorized":true}';

// 生产库分类ID
const CAT_INNER_PEACE = 30007;
const CAT_WEALTH = 30004;
const CAT_WISDOM = 30006;

// 价格计算：(成本价 + 275) / 7，取整到 .00 或 .99
function calcPrice(costCNY) {
  const raw = (costCNY + 275) / 7;
  return Math.round(raw);
}

// 上传单张图片到 R2
async function uploadImage(localPath, key) {
  const buf = fs.readFileSync(localPath);
  const ext = path.extname(localPath).toLowerCase();
  const contentType = ext === '.png' ? 'image/png' : 'image/jpeg';
  await R2.send(new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    Body: buf,
    ContentType: contentType,
  }));
  return `${R2_PUBLIC_URL}/${key}`;
}

// 上传某产品目录下所有图片
async function uploadProductImages(dirPath, productSlug) {
  if (!fs.existsSync(dirPath)) return [];
  const files = fs.readdirSync(dirPath)
    .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .sort();
  const results = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const key = `products/${productSlug}/${Date.now()}-${i+1}${path.extname(file)}`;
    const url = await uploadImage(path.join(dirPath, file), key);
    results.push({ url, fileKey: key, displayOrder: i, isPrimary: i === 0 });
    process.stdout.write(`  图片 ${i+1}/${files.length} 上传完成\r`);
  }
  console.log(`  共上传 ${results.length} 张图片`);
  return results;
}

function slugify(str) {
  return str.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60);
}

// ============================================================
// 产品数据定义
// ============================================================

// Inner Peace 产品
const INNER_PEACE_PRODUCTS = [
  {
    zhName: '黑曜石水滴吊坠',
    name: 'Obsidian Teardrop Pendant',
    spec: 'approx. 38×27×13mm',
    cost: 31,
    dirName: '黑曜石水滴吊坠',
    description: 'A polished black obsidian teardrop pendant, naturally formed from volcanic glass. Obsidian is revered in Eastern traditions as a powerful protective stone that absorbs negative energy and shields the wearer from psychic attacks. Consecrated at Wutai Mountain, this pendant carries the blessing of clarity and inner stillness.',
    shortDescription: 'Volcanic obsidian teardrop pendant for protection and inner calm. Consecrated at Wutai Mountain.',
    suitableFor: 'Those seeking emotional protection, stress relief, and grounding energy.',
    efficacy: 'Shields against negative energy, promotes emotional balance, enhances clarity of mind.',
    wearingGuide: 'Wear close to the heart on a chain or cord. Cleanse monthly under moonlight.',
    blessingTemple: 'Wutai Mountain Pusading Temple',
    blessingMaster: 'Venerable Master Mingkong',
  },
  {
    zhName: '黑曜石转运珠手链',
    name: 'Obsidian Fortune-Turn Bead Bracelet',
    spec: 'bead diameter approx. 10mm',
    cost: 36,
    dirName: '黑曜石转运珠手链',
    description: 'A bracelet of smooth black obsidian beads, each carefully selected for uniform size and deep luster. In Chinese metaphysics, obsidian fortune beads are worn to turn bad luck into good fortune and to ward off evil influences. Blessed by monks at Wutai Mountain, this bracelet serves as both a spiritual talisman and an elegant accessory.',
    shortDescription: 'Black obsidian bead bracelet to turn fortune and ward off negativity. Wutai Mountain blessed.',
    suitableFor: 'Anyone experiencing a streak of bad luck or seeking a protective talisman for daily wear.',
    efficacy: 'Transforms negative energy into positive fortune, provides psychic protection, promotes confidence.',
    wearingGuide: 'Wear on the left wrist to absorb positive energy. Cleanse weekly with sage smoke.',
    blessingTemple: 'Wutai Mountain Pusading Temple',
    blessingMaster: 'Venerable Master Mingkong',
  },
  {
    zhName: '白玉髓平安如意吊坠',
    name: 'White Chalcedony Ruyi Peace Pendant',
    spec: 'width approx. 2cm',
    cost: 25,
    dirName: '如意玉坠',
    description: 'Carved from pure white chalcedony into the traditional Ruyi (如意) form—a scepter symbolizing good fortune and the fulfillment of wishes. White chalcedony is associated with purity, peace, and divine protection in Chinese culture. This pendant has been ritually consecrated at Wutai Mountain to amplify its auspicious properties.',
    shortDescription: 'White chalcedony Ruyi pendant symbolizing peace and wish fulfillment. Wutai Mountain blessed.',
    suitableFor: 'Those seeking peace of mind, wish fulfillment, and auspicious blessings in daily life.',
    efficacy: 'Brings peace and good fortune, fulfills heartfelt wishes, purifies the spirit.',
    wearingGuide: 'Wear as a necklace pendant. Hold it while making wishes or during meditation.',
    blessingTemple: 'Wutai Mountain Shuxiang Temple',
    blessingMaster: 'Venerable Master Huiyuan',
  },
  {
    zhName: '菩提杏花微雨手串（10mm）',
    name: 'Bodhi Apricot Blossom Mist Bracelet',
    spec: 'bead diameter approx. 10mm',
    cost: 27,
    dirName: '天然菩提杏花微雨手串',
    description: 'Crafted from natural bodhi seeds with a delicate mottled pattern reminiscent of apricot blossoms in a gentle rain—hence the poetic name "Apricot Blossom Mist." Bodhi seeds hold deep significance in Buddhism as the tree under which the Buddha attained enlightenment. Each bead is naturally unique, carrying the energy of awakening and tranquility.',
    shortDescription: 'Natural bodhi seed bracelet with delicate floral pattern, symbolizing enlightenment and peace.',
    suitableFor: 'Meditation practitioners, those seeking mental clarity, and anyone drawn to Buddhist traditions.',
    efficacy: 'Promotes mindfulness and meditation, brings inner peace, supports spiritual awakening.',
    wearingGuide: 'Wear on either wrist. Use during meditation by gently rolling beads between fingers.',
    blessingTemple: 'Wutai Mountain Dailuo Peak Temple',
    blessingMaster: 'Venerable Master Jingkong',
  },
  {
    zhName: '菩提杏花微雨手串（11mm）',
    name: 'Bodhi Apricot Blossom Mist Bracelet',
    spec: 'bead diameter approx. 11mm',
    cost: 30,
    dirName: '天然菩提杏花微雨手串',
    description: 'Crafted from natural bodhi seeds with a delicate mottled pattern reminiscent of apricot blossoms in a gentle rain—hence the poetic name "Apricot Blossom Mist." Bodhi seeds hold deep significance in Buddhism as the tree under which the Buddha attained enlightenment. Each bead is naturally unique, carrying the energy of awakening and tranquility.',
    shortDescription: 'Natural bodhi seed bracelet with delicate floral pattern, symbolizing enlightenment and peace.',
    suitableFor: 'Meditation practitioners, those seeking mental clarity, and anyone drawn to Buddhist traditions.',
    efficacy: 'Promotes mindfulness and meditation, brings inner peace, supports spiritual awakening.',
    wearingGuide: 'Wear on either wrist. Use during meditation by gently rolling beads between fingers.',
    blessingTemple: 'Wutai Mountain Dailuo Peak Temple',
    blessingMaster: 'Venerable Master Jingkong',
  },
  {
    zhName: '菩提杏花微雨手串（12mm）',
    name: 'Bodhi Apricot Blossom Mist Bracelet',
    spec: 'bead diameter approx. 12mm',
    cost: 32,
    dirName: '天然菩提杏花微雨手串',
    description: 'Crafted from natural bodhi seeds with a delicate mottled pattern reminiscent of apricot blossoms in a gentle rain—hence the poetic name "Apricot Blossom Mist." Bodhi seeds hold deep significance in Buddhism as the tree under which the Buddha attained enlightenment. Each bead is naturally unique, carrying the energy of awakening and tranquility.',
    shortDescription: 'Natural bodhi seed bracelet with delicate floral pattern, symbolizing enlightenment and peace.',
    suitableFor: 'Meditation practitioners, those seeking mental clarity, and anyone drawn to Buddhist traditions.',
    efficacy: 'Promotes mindfulness and meditation, brings inner peace, supports spiritual awakening.',
    wearingGuide: 'Wear on either wrist. Use during meditation by gently rolling beads between fingers.',
    blessingTemple: 'Wutai Mountain Dailuo Peak Temple',
    blessingMaster: 'Venerable Master Jingkong',
  },
  {
    zhName: '紫金砂吊坠挂脖项链',
    name: 'Purple Gold Sand Pendant Necklace',
    spec: 'bead diameter approx. 10mm',
    cost: 17,
    dirName: '朱砂吊坠',
    description: 'A pendant crafted from purple gold sand (紫金砂), a rare mineral prized in Chinese metaphysics for its powerful energy-amplifying properties. The deep purple-gold hue symbolizes nobility, wisdom, and spiritual elevation. Consecrated through traditional Buddhist rituals at Wutai Mountain, this necklace serves as a powerful talisman for those seeking spiritual growth and protection.',
    shortDescription: 'Purple gold sand pendant necklace for spiritual elevation and protection. Wutai Mountain blessed.',
    suitableFor: 'Those seeking spiritual growth, wisdom enhancement, and noble energy in their lives.',
    efficacy: 'Amplifies spiritual energy, promotes wisdom and clarity, attracts noble opportunities.',
    wearingGuide: 'Wear as a necklace, letting the pendant rest near the heart chakra.',
    blessingTemple: 'Wutai Mountain Pusading Temple',
    blessingMaster: 'Venerable Master Mingkong',
  },
  {
    zhName: '朱砂平安扣平安红手链',
    name: 'Cinnabar Peace Clasp Red Bracelet',
    spec: 'peace clasp diameter approx. 20mm',
    cost: 32,
    dirName: '朱砂平安扣红绳手链',
    description: 'A traditional Chinese peace bracelet featuring a cinnabar (朱砂) peace clasp on a vibrant red cord. Cinnabar is one of the most sacred minerals in Chinese culture, used for centuries in protective talismans and ritual objects. The peace clasp (平安扣) symbolizes safety and harmony. Consecrated at Wutai Mountain with prayers for protection and peace.',
    shortDescription: 'Cinnabar peace clasp on red cord bracelet for protection and harmony. Wutai Mountain blessed.',
    suitableFor: 'Those seeking daily protection, peace of mind, and harmonious relationships.',
    efficacy: 'Provides strong protective energy, promotes peace and harmony, wards off misfortune.',
    wearingGuide: 'Wear on the left wrist. The red cord can be adjusted for a comfortable fit.',
    blessingTemple: 'Wutai Mountain Pusading Temple',
    blessingMaster: 'Venerable Master Mingkong',
  },
  {
    zhName: '朱砂平安扣喜乐红手链',
    name: 'Cinnabar Peace Clasp Joyful Red Bracelet',
    spec: 'peace clasp diameter approx. 20mm',
    cost: 32,
    dirName: '朱砂平安扣红绳手链',
    description: 'A joyful variation of the traditional cinnabar peace bracelet, featuring a bright cinnabar peace clasp on a cheerful red cord. This piece is specially blessed to bring not only protection but also joy and happiness to the wearer. In Chinese tradition, the combination of cinnabar and red symbolizes vitality, good fortune, and celebration of life.',
    shortDescription: 'Cinnabar peace clasp joyful red bracelet for happiness and protection. Wutai Mountain blessed.',
    suitableFor: 'Those seeking joy, happiness, and protection in their daily lives.',
    efficacy: 'Attracts joy and positive energy, provides protection, promotes a cheerful outlook on life.',
    wearingGuide: 'Wear on the left wrist. Perfect for gifting to loved ones for celebrations.',
    blessingTemple: 'Wutai Mountain Pusading Temple',
    blessingMaster: 'Venerable Master Mingkong',
  },
  {
    zhName: '黑曜石海蓝宝水晶手串（6mm）',
    name: 'Obsidian Aquamarine Crystal Bracelet',
    spec: 'bead diameter approx. 6mm',
    cost: 50,
    dirName: '黑曜石海蓝宝水晶手串',
    description: 'An exquisite bracelet combining the protective power of black obsidian with the calming energy of aquamarine crystal. This harmonious pairing creates a powerful balance between grounding protection and serene tranquility. Each bead is carefully selected for quality and energetic properties. Consecrated at Wutai Mountain to enhance the natural properties of both stones.',
    shortDescription: 'Obsidian and aquamarine crystal bracelet combining protection with serenity. Wutai Mountain blessed.',
    suitableFor: 'Those seeking balance between protection and peace, or those drawn to ocean energy.',
    efficacy: 'Combines protective and calming energies, promotes emotional balance, enhances communication.',
    wearingGuide: 'Wear on the left wrist. Cleanse under running water monthly.',
    blessingTemple: 'Wutai Mountain Shuxiang Temple',
    blessingMaster: 'Venerable Master Huiyuan',
  },
  {
    zhName: '黑曜石海蓝宝水晶手串（8mm）',
    name: 'Obsidian Aquamarine Crystal Bracelet',
    spec: 'bead diameter approx. 8mm',
    cost: 59,
    dirName: '黑曜石海蓝宝水晶手串',
    description: 'An exquisite bracelet combining the protective power of black obsidian with the calming energy of aquamarine crystal. This harmonious pairing creates a powerful balance between grounding protection and serene tranquility. Each bead is carefully selected for quality and energetic properties. Consecrated at Wutai Mountain to enhance the natural properties of both stones.',
    shortDescription: 'Obsidian and aquamarine crystal bracelet combining protection with serenity. Wutai Mountain blessed.',
    suitableFor: 'Those seeking balance between protection and peace, or those drawn to ocean energy.',
    efficacy: 'Combines protective and calming energies, promotes emotional balance, enhances communication.',
    wearingGuide: 'Wear on the left wrist. Cleanse under running water monthly.',
    blessingTemple: 'Wutai Mountain Shuxiang Temple',
    blessingMaster: 'Venerable Master Huiyuan',
  },
  {
    zhName: '黑曜石海蓝宝水晶手串（10mm）',
    name: 'Obsidian Aquamarine Crystal Bracelet',
    spec: 'bead diameter approx. 10mm',
    cost: 68,
    dirName: '黑曜石海蓝宝水晶手串',
    description: 'An exquisite bracelet combining the protective power of black obsidian with the calming energy of aquamarine crystal. This harmonious pairing creates a powerful balance between grounding protection and serene tranquility. Each bead is carefully selected for quality and energetic properties. Consecrated at Wutai Mountain to enhance the natural properties of both stones.',
    shortDescription: 'Obsidian and aquamarine crystal bracelet combining protection with serenity. Wutai Mountain blessed.',
    suitableFor: 'Those seeking balance between protection and peace, or those drawn to ocean energy.',
    efficacy: 'Combines protective and calming energies, promotes emotional balance, enhances communication.',
    wearingGuide: 'Wear on the left wrist. Cleanse under running water monthly.',
    blessingTemple: 'Wutai Mountain Shuxiang Temple',
    blessingMaster: 'Venerable Master Huiyuan',
  },
  {
    zhName: '黑曜石海蓝宝水晶手串（12mm）',
    name: 'Obsidian Aquamarine Crystal Bracelet',
    spec: 'bead diameter approx. 12mm',
    cost: 77,
    dirName: '黑曜石海蓝宝水晶手串',
    description: 'An exquisite bracelet combining the protective power of black obsidian with the calming energy of aquamarine crystal. This harmonious pairing creates a powerful balance between grounding protection and serene tranquility. Each bead is carefully selected for quality and energetic properties. Consecrated at Wutai Mountain to enhance the natural properties of both stones.',
    shortDescription: 'Obsidian and aquamarine crystal bracelet combining protection with serenity. Wutai Mountain blessed.',
    suitableFor: 'Those seeking balance between protection and peace, or those drawn to ocean energy.',
    efficacy: 'Combines protective and calming energies, promotes emotional balance, enhances communication.',
    wearingGuide: 'Wear on the left wrist. Cleanse under running water monthly.',
    blessingTemple: 'Wutai Mountain Shuxiang Temple',
    blessingMaster: 'Venerable Master Huiyuan',
  },
];

// Wealth & Fortune 产品
const WEALTH_PRODUCTS = [
  {
    zhName: '绿檀木天然沉香红玛瑙手串（8mm）',
    name: 'Green Sandalwood Agarwood Red Agate Bracelet',
    spec: 'bead diameter approx. 8mm',
    cost: 25,
    dirName: '绿檀木天然沉香红玛瑙手串',
    description: 'A wealth-attracting bracelet combining three powerful materials: green sandalwood (绿檀木), natural agarwood (沉香), and red agate (红玛瑙). Green sandalwood carries the energy of growth and prosperity. Agarwood is one of the most prized aromatic woods in Asian traditions, used in sacred rituals for centuries. Red agate activates wealth luck and vitality. Consecrated at Wutai Mountain for maximum fortune-attracting power.',
    shortDescription: 'Triple-power wealth bracelet: green sandalwood, agarwood & red agate. Wutai Mountain blessed.',
    suitableFor: 'Entrepreneurs, business owners, and anyone seeking to improve their financial fortune.',
    efficacy: 'Attracts wealth and prosperity, activates business luck, promotes financial growth.',
    wearingGuide: 'Wear on the left wrist to attract wealth energy into your life.',
    blessingTemple: 'Wutai Mountain Pusading Temple',
    blessingMaster: 'Venerable Master Mingkong',
  },
  {
    zhName: '绿檀木天然沉香红玛瑙手串（10mm）',
    name: 'Green Sandalwood Agarwood Red Agate Bracelet',
    spec: 'bead diameter approx. 10mm',
    cost: 29,
    dirName: '绿檀木天然沉香红玛瑙手串',
    description: 'A wealth-attracting bracelet combining three powerful materials: green sandalwood (绿檀木), natural agarwood (沉香), and red agate (红玛瑙). Green sandalwood carries the energy of growth and prosperity. Agarwood is one of the most prized aromatic woods in Asian traditions, used in sacred rituals for centuries. Red agate activates wealth luck and vitality. Consecrated at Wutai Mountain for maximum fortune-attracting power.',
    shortDescription: 'Triple-power wealth bracelet: green sandalwood, agarwood & red agate. Wutai Mountain blessed.',
    suitableFor: 'Entrepreneurs, business owners, and anyone seeking to improve their financial fortune.',
    efficacy: 'Attracts wealth and prosperity, activates business luck, promotes financial growth.',
    wearingGuide: 'Wear on the left wrist to attract wealth energy into your life.',
    blessingTemple: 'Wutai Mountain Pusading Temple',
    blessingMaster: 'Venerable Master Mingkong',
  },
  {
    zhName: '绿檀木天然沉香红玛瑙手串（12mm）',
    name: 'Green Sandalwood Agarwood Red Agate Bracelet',
    spec: 'bead diameter approx. 12mm',
    cost: 33,
    dirName: '绿檀木天然沉香红玛瑙手串',
    description: 'A wealth-attracting bracelet combining three powerful materials: green sandalwood (绿檀木), natural agarwood (沉香), and red agate (红玛瑙). Green sandalwood carries the energy of growth and prosperity. Agarwood is one of the most prized aromatic woods in Asian traditions, used in sacred rituals for centuries. Red agate activates wealth luck and vitality. Consecrated at Wutai Mountain for maximum fortune-attracting power.',
    shortDescription: 'Triple-power wealth bracelet: green sandalwood, agarwood & red agate. Wutai Mountain blessed.',
    suitableFor: 'Entrepreneurs, business owners, and anyone seeking to improve their financial fortune.',
    efficacy: 'Attracts wealth and prosperity, activates business luck, promotes financial growth.',
    wearingGuide: 'Wear on the left wrist to attract wealth energy into your life.',
    blessingTemple: 'Wutai Mountain Pusading Temple',
    blessingMaster: 'Venerable Master Mingkong',
  },
  {
    zhName: '朱砂转运珠手串（好运红）',
    name: 'Cinnabar Fortune Bead Bracelet - Lucky Red',
    spec: 'bead diameter approx. 8mm, Lucky Red',
    cost: 24,
    dirName: '朱砂转运珠手绳',
    description: 'A vibrant red cinnabar fortune bead bracelet designed to turn luck in your favor. Cinnabar (朱砂) has been used in Chinese culture for over 2,000 years as a powerful protective and fortune-attracting material. The fortune beads (转运珠) are specifically shaped to "roll" bad luck away and bring good fortune. This Lucky Red version is especially potent for attracting positive energy and new opportunities.',
    shortDescription: 'Cinnabar fortune bead bracelet in Lucky Red to turn fortune and attract good luck.',
    suitableFor: 'Those experiencing bad luck or seeking a powerful boost to their overall fortune.',
    efficacy: 'Turns bad luck to good fortune, attracts positive opportunities, provides strong protective energy.',
    wearingGuide: 'Wear on the left wrist. Rotate the fortune beads clockwise while setting intentions.',
    blessingTemple: 'Wutai Mountain Pusading Temple',
    blessingMaster: 'Venerable Master Mingkong',
  },
  {
    zhName: '朱砂转运珠手串（平安红）',
    name: 'Cinnabar Fortune Bead Bracelet - Peace Red',
    spec: 'bead diameter approx. 8mm, Peace Red',
    cost: 24,
    dirName: '朱砂转运珠手绳',
    description: 'A calming red cinnabar fortune bead bracelet that combines the fortune-turning power of cinnabar with the peaceful energy of the Peace Red color. This variation is ideal for those who seek both good fortune and a sense of calm protection in their daily lives. The bracelet has been consecrated at Wutai Mountain with prayers for peace and prosperity.',
    shortDescription: 'Cinnabar fortune bead bracelet in Peace Red for fortune and tranquility.',
    suitableFor: 'Those seeking both good fortune and inner peace in their daily lives.',
    efficacy: 'Balances fortune-attracting and peace-promoting energies, provides protective calm.',
    wearingGuide: 'Wear on the left wrist. Ideal for wearing during stressful situations.',
    blessingTemple: 'Wutai Mountain Pusading Temple',
    blessingMaster: 'Venerable Master Mingkong',
  },
  {
    zhName: '朱砂转运珠手串（子夜黑）',
    name: 'Cinnabar Fortune Bead Bracelet - Midnight Black',
    spec: 'bead diameter approx. 8mm, Midnight Black',
    cost: 24,
    dirName: '朱砂转运珠手绳',
    description: 'A sophisticated midnight black cinnabar fortune bead bracelet that combines the powerful fortune-turning properties of cinnabar with the deep protective energy of black. This elegant variation is perfect for those who prefer a more understated aesthetic while still benefiting from the powerful metaphysical properties of cinnabar. Consecrated at Wutai Mountain.',
    shortDescription: 'Cinnabar fortune bead bracelet in Midnight Black for protection and fortune.',
    suitableFor: 'Those seeking powerful protection alongside fortune enhancement, with a preference for dark aesthetics.',
    efficacy: 'Strong protective energy combined with fortune-turning power, promotes confidence and authority.',
    wearingGuide: 'Wear on the left wrist. The dark color absorbs negative energy effectively.',
    blessingTemple: 'Wutai Mountain Pusading Temple',
    blessingMaster: 'Venerable Master Mingkong',
  },
  {
    zhName: '红玉髓平安扣钥匙扣【莲花款】',
    name: 'Red Carnelian Peace Clasp Keychain - Lotus Edition',
    spec: 'peace clasp diameter approx. 3cm, total length 10cm',
    cost: 22,
    dirName: '玉髓平安扣莲花钥匙扣',
    description: 'A beautiful red carnelian peace clasp keychain featuring an intricate lotus flower design. Red carnelian is associated with vitality, courage, and good fortune in Chinese metaphysics. The peace clasp (平安扣) is a traditional symbol of safety and protection. The lotus motif adds a layer of spiritual purity and enlightenment. Consecrated at Wutai Mountain.',
    shortDescription: 'Red carnelian lotus peace clasp keychain for vitality, protection and good fortune.',
    suitableFor: 'Those seeking daily protection and good fortune, perfect as a meaningful gift.',
    efficacy: 'Attracts good fortune, provides daily protection, promotes vitality and courage.',
    wearingGuide: 'Attach to keys, bag, or backpack for daily protection and fortune.',
    blessingTemple: 'Wutai Mountain Shuxiang Temple',
    blessingMaster: 'Venerable Master Huiyuan',
  },
  {
    zhName: '绿玉髓平安扣钥匙扣【莲花款】',
    name: 'Green Chalcedony Peace Clasp Keychain - Lotus Edition',
    spec: 'peace clasp diameter approx. 3cm, total length 10cm',
    cost: 22,
    dirName: '玉髓平安扣莲花钥匙扣',
    description: 'A serene green chalcedony peace clasp keychain with an elegant lotus flower design. Green chalcedony is associated with growth, healing, and prosperity. The peace clasp symbolizes safety and harmony, while the lotus represents spiritual purity. This combination creates a powerful talisman for those seeking both material prosperity and spiritual growth. Consecrated at Wutai Mountain.',
    shortDescription: 'Green chalcedony lotus peace clasp keychain for growth, healing and prosperity.',
    suitableFor: 'Those seeking healing energy, growth opportunities, and harmonious relationships.',
    efficacy: 'Promotes healing and growth, attracts prosperity, brings harmony to relationships.',
    wearingGuide: 'Attach to keys, bag, or backpack. The green color promotes healing wherever you go.',
    blessingTemple: 'Wutai Mountain Shuxiang Temple',
    blessingMaster: 'Venerable Master Huiyuan',
  },
  {
    zhName: '白玉髓平安扣钥匙扣【莲花款】',
    name: 'White Chalcedony Peace Clasp Keychain - Lotus Edition',
    spec: 'peace clasp diameter approx. 3cm, total length 10cm',
    cost: 22,
    dirName: '玉髓平安扣莲花钥匙扣',
    description: 'A pure white chalcedony peace clasp keychain adorned with a delicate lotus flower design. White chalcedony embodies purity, clarity, and divine protection. The peace clasp and lotus motif together create a powerful symbol of spiritual protection and enlightenment. This elegant piece has been consecrated at Wutai Mountain to carry the blessings of purity and peace.',
    shortDescription: 'White chalcedony lotus peace clasp keychain for purity, clarity and divine protection.',
    suitableFor: 'Those seeking purity of mind and spirit, divine protection, and clarity in decision-making.',
    efficacy: 'Purifies energy, provides divine protection, promotes clarity and wise decision-making.',
    wearingGuide: 'Attach to keys, bag, or backpack. Ideal for those starting new chapters in life.',
    blessingTemple: 'Wutai Mountain Shuxiang Temple',
    blessingMaster: 'Venerable Master Huiyuan',
  },
  {
    zhName: '朱砂钱袋手机挂件',
    name: 'Cinnabar Money Bag Phone Charm',
    spec: 'approx. 21×17mm',
    cost: 31,
    dirName: '朱砂钱袋、貔貅、莲花、五帝钱手机链',
    description: 'A charming cinnabar money bag phone charm, crafted in the shape of the traditional Chinese money bag (钱袋)—a powerful symbol of wealth accumulation and financial abundance. Cinnabar amplifies the wealth-attracting properties of this charm. Consecrated at Wutai Mountain with specific prayers for financial prosperity and abundance.',
    shortDescription: 'Cinnabar money bag phone charm for wealth accumulation and financial abundance.',
    suitableFor: 'Those seeking financial abundance, business success, and wealth accumulation.',
    efficacy: 'Attracts money and financial opportunities, promotes abundance mindset, activates wealth luck.',
    wearingGuide: 'Attach to your phone or bag. Keep it visible to continuously attract wealth energy.',
    blessingTemple: 'Wutai Mountain Pusading Temple',
    blessingMaster: 'Venerable Master Mingkong',
  },
  {
    zhName: '朱砂貔貅手机挂件',
    name: 'Cinnabar Pixiu Phone Charm',
    spec: 'approx. 27.7×13.6×11.6mm',
    cost: 33,
    dirName: '朱砂钱袋、貔貅、莲花、五帝钱手机链',
    description: 'A powerful cinnabar Pixiu (貔貅) phone charm. The Pixiu is one of the most revered wealth-attracting creatures in Chinese mythology—it is said to devour wealth from all directions and never release it, making it the ultimate symbol of wealth accumulation. Crafted from sacred cinnabar and consecrated at Wutai Mountain, this charm is a potent talisman for attracting and retaining wealth.',
    shortDescription: 'Cinnabar Pixiu phone charm—the ultimate wealth-attracting mythical creature. Wutai Mountain blessed.',
    suitableFor: 'Those seeking powerful wealth attraction and financial protection.',
    efficacy: 'Extremely powerful wealth attraction, retains accumulated wealth, protects against financial loss.',
    wearingGuide: 'Attach to phone or bag with the Pixiu facing outward to "eat" incoming wealth.',
    blessingTemple: 'Wutai Mountain Pusading Temple',
    blessingMaster: 'Venerable Master Mingkong',
  },
  {
    zhName: '紫金砂莲花手机挂件',
    name: 'Purple Gold Sand Lotus Phone Charm',
    spec: 'lotus approx. 19×13mm, total length 10-12cm',
    cost: 34,
    dirName: '朱砂钱袋、貔貅、莲花、五帝钱手机链',
    description: 'An elegant purple gold sand lotus phone charm that combines the spiritual power of purple gold sand with the sacred symbolism of the lotus flower. The lotus represents purity, enlightenment, and the ability to rise above adversity. Purple gold sand amplifies spiritual energy and attracts noble opportunities. Consecrated at Wutai Mountain.',
    shortDescription: 'Purple gold sand lotus phone charm for spiritual elevation and noble fortune.',
    suitableFor: 'Those seeking spiritual growth, noble opportunities, and elegant fortune.',
    efficacy: 'Attracts noble and high-quality opportunities, promotes spiritual elevation, brings elegant fortune.',
    wearingGuide: 'Attach to phone or bag. The lotus energy purifies your surroundings as you move.',
    blessingTemple: 'Wutai Mountain Pusading Temple',
    blessingMaster: 'Venerable Master Mingkong',
  },
  {
    zhName: '紫金砂五帝钱手机挂件',
    name: 'Purple Gold Sand Five Emperor Coins Phone Charm',
    spec: 'coin approx. 15mm, total length 14-15cm',
    cost: 32,
    dirName: '朱砂钱袋、貔貅、莲花、五帝钱手机链',
    description: 'A powerful purple gold sand phone charm featuring the Five Emperor Coins (五帝钱)—coins from the five most prosperous emperors of the Qing Dynasty, representing the peak of imperial wealth and power. In Feng Shui, Five Emperor Coins are among the most potent wealth-attracting tools. Combined with purple gold sand and consecrated at Wutai Mountain, this charm is exceptionally powerful for attracting wealth.',
    shortDescription: 'Purple gold sand Five Emperor Coins charm—supreme Feng Shui wealth attractor.',
    suitableFor: 'Feng Shui practitioners and those seeking the most powerful wealth attraction available.',
    efficacy: 'Supreme wealth attraction using imperial energy, activates all five directions of wealth.',
    wearingGuide: 'Attach to phone or bag. Place facing the main door of your home for Feng Shui activation.',
    blessingTemple: 'Wutai Mountain Pusading Temple',
    blessingMaster: 'Venerable Master Mingkong',
  },
  {
    zhName: '紫金砂招财纳福手机链',
    name: 'Purple Gold Sand Wealth & Blessing Phone Chain',
    spec: 'bead diameter 8mm, agate accent beads',
    cost: 34,
    dirName: '朱砂钱袋、貔貅、莲花、五帝钱手机链',
    description: 'A beautiful purple gold sand phone chain designed specifically for attracting wealth and blessings. The main purple gold sand beads are complemented by colorful agate accent beads, creating a vibrant and powerful combination. The phrase "招财纳福" means "attract wealth and receive blessings"—the dual intention of this piece. Consecrated at Wutai Mountain.',
    shortDescription: 'Purple gold sand wealth & blessing phone chain with agate accents. Wutai Mountain blessed.',
    suitableFor: 'Those seeking both material wealth and spiritual blessings in their lives.',
    efficacy: 'Attracts wealth and material abundance, invites blessings and good fortune into life.',
    wearingGuide: 'Attach to phone or bag. The colorful agate beads attract positive energy from all directions.',
    blessingTemple: 'Wutai Mountain Pusading Temple',
    blessingMaster: 'Venerable Master Mingkong',
  },
  {
    zhName: '紫金砂大吉大利手机链',
    name: 'Purple Gold Sand Great Fortune Phone Chain',
    spec: 'bead diameter 8mm, agate accent beads',
    cost: 31,
    dirName: '朱砂钱袋、貔貅、莲花、五帝钱手机链',
    description: 'A vibrant purple gold sand phone chain embodying the auspicious phrase "大吉大利"—meaning "great luck and great prosperity." This powerful combination of purple gold sand and colorful agate beads creates a talisman that radiates positive fortune energy. Consecrated at Wutai Mountain with specific prayers for great luck in all endeavors.',
    shortDescription: 'Purple gold sand "Great Fortune" phone chain for supreme luck and prosperity.',
    suitableFor: 'Those seeking a major boost in overall luck and prosperity across all life areas.',
    efficacy: 'Activates great luck in all areas of life, attracts prosperity and positive outcomes.',
    wearingGuide: 'Attach to phone or bag. Say "大吉大利" (great luck, great prosperity) when attaching.',
    blessingTemple: 'Wutai Mountain Pusading Temple',
    blessingMaster: 'Venerable Master Mingkong',
  },
  {
    zhName: '红砂招财纳福手机链',
    name: 'Red Sand Wealth & Blessing Phone Chain',
    spec: 'bead diameter 8mm, agate accent beads',
    cost: 37,
    dirName: '朱砂钱袋、貔貅、莲花、五帝钱手机链',
    description: 'A powerful red sand phone chain for attracting wealth and blessings. Red sand carries the intense yang energy of fire, making it exceptionally effective for activating wealth luck and dispelling negative energy. Combined with colorful agate accent beads and consecrated at Wutai Mountain, this chain is a potent daily talisman for financial success.',
    shortDescription: 'Red sand wealth & blessing phone chain with agate accents for powerful fortune activation.',
    suitableFor: 'Those seeking powerful wealth activation and strong positive energy in their lives.',
    efficacy: 'Powerful wealth activation using fire energy, dispels negative energy, attracts financial success.',
    wearingGuide: 'Attach to phone or bag. The red energy is most active during daytime hours.',
    blessingTemple: 'Wutai Mountain Pusading Temple',
    blessingMaster: 'Venerable Master Mingkong',
  },
  {
    zhName: '红砂大吉大利手机链',
    name: 'Red Sand Great Fortune Phone Chain',
    spec: 'bead diameter 8mm, agate accent beads',
    cost: 37,
    dirName: '朱砂钱袋、貔貅、莲花、五帝钱手机链',
    description: 'A fiery red sand phone chain embodying the supreme auspicious phrase "大吉大利." The intense yang energy of red sand combined with the auspicious intention creates an exceptionally powerful fortune activator. This piece is consecrated at Wutai Mountain with prayers for great luck and prosperity to manifest quickly in the wearer\'s life.',
    shortDescription: 'Red sand "Great Fortune" phone chain for fast-acting supreme luck and prosperity.',
    suitableFor: 'Those needing a quick and powerful boost to their luck and financial situation.',
    efficacy: 'Fast-acting fortune activation, attracts great luck quickly, promotes rapid positive change.',
    wearingGuide: 'Attach to phone or bag. Most effective when carried during important meetings or events.',
    blessingTemple: 'Wutai Mountain Pusading Temple',
    blessingMaster: 'Venerable Master Mingkong',
  },
];

// Wisdom & Study 产品
const WISDOM_PRODUCTS = [
  {
    zhName: '天然纯净白水晶手串（6mm）',
    name: 'Natural Pure White Crystal Bracelet',
    spec: 'bead diameter approx. 6mm',
    cost: 26,
    dirName: '天然纯净白水晶手串手链',
    description: 'A bracelet of natural, pure white crystal beads, each carefully selected for clarity and energetic purity. White crystal (白水晶) is known as the "master healer" in crystal healing traditions and is associated with clarity of thought, enhanced focus, and amplification of positive intentions. In Chinese metaphysics, white crystal is used to enhance wisdom and academic success. Consecrated at Wutai Mountain.',
    shortDescription: 'Natural pure white crystal bracelet for clarity, focus and wisdom enhancement.',
    suitableFor: 'Students, academics, and anyone seeking mental clarity and enhanced focus.',
    efficacy: 'Enhances mental clarity and focus, promotes wisdom and academic success, amplifies positive intentions.',
    wearingGuide: 'Wear on the left wrist during study or work. Cleanse monthly under sunlight.',
    blessingTemple: 'Wutai Mountain Shuxiang Temple',
    blessingMaster: 'Venerable Master Huiyuan',
  },
  {
    zhName: '天然纯净白水晶手串（8mm）',
    name: 'Natural Pure White Crystal Bracelet',
    spec: 'bead diameter approx. 8mm',
    cost: 35,
    dirName: '天然纯净白水晶手串手链',
    description: 'A bracelet of natural, pure white crystal beads, each carefully selected for clarity and energetic purity. White crystal (白水晶) is known as the "master healer" in crystal healing traditions and is associated with clarity of thought, enhanced focus, and amplification of positive intentions. In Chinese metaphysics, white crystal is used to enhance wisdom and academic success. Consecrated at Wutai Mountain.',
    shortDescription: 'Natural pure white crystal bracelet for clarity, focus and wisdom enhancement.',
    suitableFor: 'Students, academics, and anyone seeking mental clarity and enhanced focus.',
    efficacy: 'Enhances mental clarity and focus, promotes wisdom and academic success, amplifies positive intentions.',
    wearingGuide: 'Wear on the left wrist during study or work. Cleanse monthly under sunlight.',
    blessingTemple: 'Wutai Mountain Shuxiang Temple',
    blessingMaster: 'Venerable Master Huiyuan',
  },
  {
    zhName: '天然纯净白水晶手串（10mm）',
    name: 'Natural Pure White Crystal Bracelet',
    spec: 'bead diameter approx. 10mm',
    cost: 46,
    dirName: '天然纯净白水晶手串手链',
    description: 'A bracelet of natural, pure white crystal beads, each carefully selected for clarity and energetic purity. White crystal (白水晶) is known as the "master healer" in crystal healing traditions and is associated with clarity of thought, enhanced focus, and amplification of positive intentions. In Chinese metaphysics, white crystal is used to enhance wisdom and academic success. Consecrated at Wutai Mountain.',
    shortDescription: 'Natural pure white crystal bracelet for clarity, focus and wisdom enhancement.',
    suitableFor: 'Students, academics, and anyone seeking mental clarity and enhanced focus.',
    efficacy: 'Enhances mental clarity and focus, promotes wisdom and academic success, amplifies positive intentions.',
    wearingGuide: 'Wear on the left wrist during study or work. Cleanse monthly under sunlight.',
    blessingTemple: 'Wutai Mountain Shuxiang Temple',
    blessingMaster: 'Venerable Master Huiyuan',
  },
  {
    zhName: '天然纯净白水晶手串（12mm）',
    name: 'Natural Pure White Crystal Bracelet',
    spec: 'bead diameter approx. 12mm',
    cost: 56,
    dirName: '天然纯净白水晶手串手链',
    description: 'A bracelet of natural, pure white crystal beads, each carefully selected for clarity and energetic purity. White crystal (白水晶) is known as the "master healer" in crystal healing traditions and is associated with clarity of thought, enhanced focus, and amplification of positive intentions. In Chinese metaphysics, white crystal is used to enhance wisdom and academic success. Consecrated at Wutai Mountain.',
    shortDescription: 'Natural pure white crystal bracelet for clarity, focus and wisdom enhancement.',
    suitableFor: 'Students, academics, and anyone seeking mental clarity and enhanced focus.',
    efficacy: 'Enhances mental clarity and focus, promotes wisdom and academic success, amplifies positive intentions.',
    wearingGuide: 'Wear on the left wrist during study or work. Cleanse monthly under sunlight.',
    blessingTemple: 'Wutai Mountain Shuxiang Temple',
    blessingMaster: 'Venerable Master Huiyuan',
  },
  {
    zhName: '天然白水晶平安扣吊坠',
    name: 'Natural White Crystal Peace Clasp Pendant',
    spec: 'diameter approx. 20mm',
    cost: 52,
    dirName: '天然白水晶平安扣吊坠',
    description: 'A pendant carved from natural white crystal in the traditional peace clasp (平安扣) form. The peace clasp is a circular disc with a hole in the center, symbolizing the completion of a cycle and the attainment of peace. White crystal amplifies this peaceful energy with its clarity and healing properties. Consecrated at Wutai Mountain with prayers for safety and wisdom.',
    shortDescription: 'Natural white crystal peace clasp pendant for safety, clarity and wisdom.',
    suitableFor: 'Those seeking peace of mind, mental clarity, and spiritual protection.',
    efficacy: 'Promotes peace and safety, enhances mental clarity, provides spiritual protection.',
    wearingGuide: 'Wear as a necklace pendant. The circular form creates a protective energy field.',
    blessingTemple: 'Wutai Mountain Shuxiang Temple',
    blessingMaster: 'Venerable Master Huiyuan',
  },
  {
    zhName: '红色绳款天然白水晶葫芦吊坠',
    name: 'Natural White Crystal Gourd Pendant - Red Cord',
    spec: 'diameter 17mm, height 27mm',
    cost: 52,
    dirName: '天然白水晶葫芦吊坠',
    description: 'A natural white crystal gourd (葫芦) pendant on a vibrant red cord. The gourd is one of the most auspicious symbols in Chinese culture, representing health, longevity, and the ability to absorb and contain negative energy. White crystal amplifies these protective properties. The red cord adds an element of vitality and good fortune. Consecrated at Wutai Mountain.',
    shortDescription: 'Natural white crystal gourd pendant on red cord for health, protection and longevity.',
    suitableFor: 'Those seeking health protection, longevity blessings, and absorption of negative energy.',
    efficacy: 'Absorbs negative energy, promotes health and longevity, provides comprehensive protection.',
    wearingGuide: 'Wear as a necklace. The gourd shape continuously absorbs negative energy from your environment.',
    blessingTemple: 'Wutai Mountain Shuxiang Temple',
    blessingMaster: 'Venerable Master Huiyuan',
  },
  {
    zhName: '褐色绳款天然白水晶葫芦吊坠',
    name: 'Natural White Crystal Gourd Pendant - Brown Cord',
    spec: 'diameter 17mm, height 27mm',
    cost: 52,
    dirName: '天然白水晶葫芦吊坠',
    description: 'A natural white crystal gourd (葫芦) pendant on an earthy brown cord. The gourd symbolizes health, longevity, and the absorption of negative energy in Chinese culture. The brown cord grounds the energy of the white crystal, making this pendant particularly effective for those who need both spiritual protection and earthly stability. Consecrated at Wutai Mountain.',
    shortDescription: 'Natural white crystal gourd pendant on brown cord for grounded protection and longevity.',
    suitableFor: 'Those seeking grounded protection, health blessings, and stable positive energy.',
    efficacy: 'Provides grounded protection, promotes health and stability, absorbs negative energy.',
    wearingGuide: 'Wear as a necklace. The brown cord grounds the crystal energy for practical daily protection.',
    blessingTemple: 'Wutai Mountain Shuxiang Temple',
    blessingMaster: 'Venerable Master Huiyuan',
  },
  {
    zhName: '玛瑙平安扣喜乐红手链',
    name: 'Agate Peace Clasp Joyful Red Bracelet',
    spec: 'peace clasp diameter approx. 20mm',
    cost: 26,
    dirName: '玛瑙平安扣红绳手链',
    description: 'A joyful red agate peace clasp bracelet that combines the protective properties of agate with the uplifting energy of the joyful red color. Agate is known for its stabilizing and grounding properties, while the peace clasp symbolizes safety and harmony. This bracelet is consecrated at Wutai Mountain to bring joy, peace, and protection to the wearer.',
    shortDescription: 'Agate peace clasp bracelet in joyful red for happiness, peace and protection.',
    suitableFor: 'Those seeking joy, emotional stability, and daily protection.',
    efficacy: 'Promotes joy and emotional stability, provides protection, brings peace and harmony.',
    wearingGuide: 'Wear on the left wrist. The joyful red color lifts spirits throughout the day.',
    blessingTemple: 'Wutai Mountain Shuxiang Temple',
    blessingMaster: 'Venerable Master Huiyuan',
  },
  {
    zhName: '玛瑙平安扣平安红手链',
    name: 'Agate Peace Clasp Peace Red Bracelet',
    spec: 'peace clasp diameter approx. 20mm',
    cost: 26,
    dirName: '玛瑙平安扣红绳手链',
    description: 'A classic red agate peace clasp bracelet in the traditional Peace Red color. This timeless piece combines the grounding and protective properties of agate with the powerful symbolism of the peace clasp. The Peace Red color is specifically associated with safety and protection in Chinese tradition. Consecrated at Wutai Mountain with prayers for peace and safety.',
    shortDescription: 'Classic agate peace clasp bracelet in Peace Red for safety and protection.',
    suitableFor: 'Those seeking classic protection and peace in their daily lives.',
    efficacy: 'Classic protective energy, promotes peace and safety, grounds and stabilizes emotions.',
    wearingGuide: 'Wear on the left wrist. A timeless protective talisman for everyday wear.',
    blessingTemple: 'Wutai Mountain Shuxiang Temple',
    blessingMaster: 'Venerable Master Huiyuan',
  },
  {
    zhName: '玛瑙平安扣海盐蓝手链',
    name: 'Agate Peace Clasp Sea Salt Blue Bracelet',
    spec: 'peace clasp diameter approx. 20mm',
    cost: 32,
    dirName: '玛瑙平安扣红绳手链（海盐、奶油、喜乐）',
    description: 'A refreshing sea salt blue agate peace clasp bracelet that brings the calming energy of the ocean to your daily life. The sea salt blue color is associated with clarity, communication, and emotional healing. Agate provides grounding stability, while the peace clasp offers protection. This unique color combination is consecrated at Wutai Mountain for those seeking calm and clarity.',
    shortDescription: 'Agate peace clasp bracelet in Sea Salt Blue for clarity, calm and emotional healing.',
    suitableFor: 'Those seeking emotional healing, clarity of communication, and calming energy.',
    efficacy: 'Promotes emotional healing and clarity, calms anxiety, enhances communication.',
    wearingGuide: 'Wear on the left wrist. The sea salt blue color is especially calming during stressful times.',
    blessingTemple: 'Wutai Mountain Shuxiang Temple',
    blessingMaster: 'Venerable Master Huiyuan',
  },
  {
    zhName: '玛瑙平安扣奶油黄手链',
    name: 'Agate Peace Clasp Cream Yellow Bracelet',
    spec: 'peace clasp diameter approx. 20mm',
    cost: 32,
    dirName: '玛瑙平安扣红绳手链（海盐、奶油、喜乐）',
    description: 'A warm cream yellow agate peace clasp bracelet that radiates gentle, nurturing energy. The cream yellow color is associated with warmth, nourishment, and gentle good fortune in Chinese color symbolism. Agate provides grounding and protection, while the peace clasp adds a layer of safety. Consecrated at Wutai Mountain for those seeking gentle, warm blessings.',
    shortDescription: 'Agate peace clasp bracelet in Cream Yellow for warmth, nourishment and gentle fortune.',
    suitableFor: 'Those seeking gentle, nurturing energy and warm blessings in their lives.',
    efficacy: 'Brings warmth and nurturing energy, attracts gentle good fortune, promotes emotional comfort.',
    wearingGuide: 'Wear on the left wrist. The warm cream color brings comfort and gentle positivity.',
    blessingTemple: 'Wutai Mountain Shuxiang Temple',
    blessingMaster: 'Venerable Master Huiyuan',
  },
  {
    zhName: '玛瑙平安扣喜乐红手链（大号）',
    name: 'Agate Peace Clasp Joyful Red Bracelet - Large',
    spec: 'peace clasp diameter approx. 20mm, large size',
    cost: 32,
    dirName: '玛瑙平安扣红绳手链（海盐、奶油、喜乐）',
    description: 'A larger version of the beloved joyful red agate peace clasp bracelet, designed for those who prefer a more substantial piece. The larger peace clasp provides enhanced protective energy, while the joyful red color continues to uplift and energize. This premium size version is consecrated at Wutai Mountain with extra prayers for joy and protection.',
    shortDescription: 'Large agate peace clasp bracelet in Joyful Red for enhanced joy and protection.',
    suitableFor: 'Those seeking enhanced protective energy with a preference for larger, more substantial jewelry.',
    efficacy: 'Enhanced protective energy, promotes joy and vitality, provides strong daily protection.',
    wearingGuide: 'Wear on the left wrist. The larger size provides stronger protective energy field.',
    blessingTemple: 'Wutai Mountain Shuxiang Temple',
    blessingMaster: 'Venerable Master Huiyuan',
  },
];

// ============================================================
// 主函数
// ============================================================
async function main() {
  const conn = await mysql2.createConnection(PROD_URL);
  console.log('✅ 已连接生产数据库');

  // 获取当前最大产品ID
  const [maxRow] = await conn.execute('SELECT MAX(id) as maxId FROM products');
  let nextId = Math.max(maxRow[0].maxId || 0, 700000) + 1;

  const allCategories = [
    { name: 'Inner Peace', catId: CAT_INNER_PEACE, products: INNER_PEACE_PRODUCTS, imgBase: '/tmp/innerpeace/inner peace/图片' },
    { name: 'Wealth & Fortune', catId: CAT_WEALTH, products: WEALTH_PRODUCTS, imgBase: '/tmp/wealth/wealth&fortune/图片' },
    { name: 'Wisdom & Study', catId: CAT_WISDOM, products: WISDOM_PRODUCTS, imgBase: '/tmp/wisdom/wisdom&study/图片' },
  ];

  for (const cat of allCategories) {
    console.log(`\n📦 处理分类: ${cat.name}`);
    
    for (const p of cat.products) {
      const price = calcPrice(p.cost);
      const salePrice = price - 10 > 0 ? price - 10 : null;
      const slug = slugify(p.name) + '-' + nextId;
      
      console.log(`\n  产品: ${p.name} (${p.spec})`);
      console.log(`  价格: $${salePrice || price} (原价 $${price})`);
      
      // 上传图片
      const imgDir = path.join(cat.imgBase, p.dirName);
      const images = await uploadProductImages(imgDir, slug);
      
      // 插入产品
      await conn.execute(
        `INSERT IGNORE INTO products 
         (id, name, slug, description, shortDescription, regularPrice, salePrice, categoryId, 
          status, featured, stock, blessingTemple, blessingMaster, suitableFor, efficacy, wearingGuide, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'published', 0, 999, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [nextId, p.name, slug, p.description, p.shortDescription,
         price.toString(), salePrice ? salePrice.toString() : null,
         cat.catId, p.blessingTemple, p.blessingMaster,
         p.suitableFor, p.efficacy, p.wearingGuide]
      );
      
      // 插入图片
      for (const img of images) {
        await conn.execute(
          `INSERT INTO product_images (productId, url, fileKey, altText, displayOrder, isPrimary, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, NOW())`,
          [nextId, img.url, img.fileKey, p.name, img.displayOrder, img.isPrimary ? 1 : 0]
        );
      }
      
      console.log(`  ✅ 产品ID ${nextId} 已插入，${images.length} 张图片`);
      nextId++;
    }
  }

  // 验证
  const [counts] = await conn.execute(
    'SELECT categoryId, COUNT(*) as cnt FROM products WHERE categoryId IN (30004, 30006, 30007) GROUP BY categoryId'
  );
  console.log('\n=== 插入完成 ===');
  counts.forEach(r => console.log(`  分类 ${r.categoryId}: ${r.cnt} 个产品`));
  
  await conn.end();
  console.log('\n✅ 全部完成！');
}

main().catch(e => { console.error('❌ 错误:', e.message); process.exit(1); });
