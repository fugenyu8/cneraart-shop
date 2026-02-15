import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../drizzle/schema.ts';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

const products = [
  // 开光饰品
  {
    name: 'Chinese Zodiac Guardian Pendant',
    slug: 'chinese-zodiac-guardian-pendant',
    description: 'Ancient Eastern Ritual-Enhanced Symbolic Talisman. Handcrafted by masters from Wutai Mountain, this pendant carries the protective energy of your zodiac guardian.',
    regularPrice: '55.00',
    salePrice: '45.00',
    stock: 50,
    status: 'published',
    featured: true,
    blessingTemple: 'Wutai Mountain',
    blessingMaster: 'Master Zhang',
  },
  {
    name: 'Eastern Ancient Wisdom Text Pendant',
    slug: 'eastern-ancient-wisdom-text-pendant',
    description: 'Ritual-Enlivened Spiritual Symbol Amulet. Inscribed with ancient scriptures and blessed through traditional consecration ceremonies.',
    regularPrice: '59.00',
    salePrice: '49.00',
    stock: 45,
    status: 'published',
    featured: true,
    blessingTemple: 'Wutai Mountain',
    blessingMaster: 'Master Li',
  },
  {
    name: 'Esoteric North Star Seven-Star Pendant',
    slug: 'esoteric-north-star-seven-star-pendant',
    description: 'Ritual-Infused Cosmic Protection Amulet. Aligned with the Big Dipper constellation, this pendant channels celestial protection energy.',
    regularPrice: '55.00',
    salePrice: '45.00',
    stock: 40,
    status: 'published',
    featured: true,
    blessingTemple: 'Wutai Mountain',
    blessingMaster: 'Master Wang',
  },
  {
    name: 'Master-Infused Energy Bracelet',
    slug: 'master-infused-energy-bracelet',
    description: 'Embedded with Ancient Scriptural Wisdom, A Personal Talisman for Meditation & Energy. Each bead is individually blessed by Wutai Mountain monks.',
    regularPrice: '59.00',
    salePrice: '49.00',
    stock: 60,
    status: 'published',
    featured: true,
    blessingTemple: 'Wutai Mountain',
    blessingMaster: 'Master Chen',
  },
  {
    name: 'Zodiac Constellation Guardian Pendant',
    slug: 'zodiac-constellation-guardian-pendant',
    description: 'Eastern Ritual-Enhanced Celestial Talisman. Connects you with the cosmic energies of your birth constellation.',
    regularPrice: '59.00',
    salePrice: '49.00',
    stock: 35,
    status: 'published',
    featured: true,
    blessingTemple: 'Wutai Mountain',
    blessingMaster: 'Master Liu',
  },
  {
    name: 'Zodiac Moon Crescent Pendant',
    slug: 'zodiac-moon-crescent-pendant',
    description: 'Ancient Eastern Ritual-Enhanced Celestial Symbol Accessory. Harmonizes lunar energies with your personal destiny.',
    regularPrice: '59.00',
    salePrice: '49.00',
    stock: 50,
    status: 'published',
    featured: true,
    blessingTemple: 'Wutai Mountain',
    blessingMaster: 'Master Zhou',
  },

  // 命理分析服务
  {
    name: 'Ancient Chinese Wisdom Analysis',
    slug: 'ancient-chinese-wisdom-analysis',
    description: 'Unlock Ancient Chinese Wisdom for Only $19! Receive a comprehensive Four Pillars of Destiny analysis based on your birth date and time.',
    regularPrice: '19.00',
    stock: 999,
    status: 'published',
    featured: false,
  },
  {
    name: 'Dual Blessings Package',
    slug: 'dual-blessings-package',
    description: '【Limited Time Upgrade】Only $79! Get Dual Blessings of Destiny Analysis + Wutai Mountain Blessing Ceremony! Complete fortune reading plus personalized blessing ritual.',
    regularPrice: '79.00',
    stock: 999,
    status: 'published',
    featured: false,
    blessingTemple: 'Wutai Mountain',
  },

  // 祈福服务
  {
    name: 'Wutai Mountain Incense Offering',
    slug: 'wutai-mountain-incense-offering',
    description: 'A stick of incense, a wish, a blessing, good fortune from Wutai Mountain—incense offering on your behalf. Monks will light incense for your intentions.',
    regularPrice: '79.00',
    salePrice: '69.00',
    stock: 999,
    status: 'published',
    featured: false,
    blessingTemple: 'Wutai Mountain',
  },
  {
    name: 'Lamp Offering for Blessings',
    slug: 'lamp-offering-for-blessings',
    description: 'Offering lamps for blessings 🙏 Nurturing love and compassion 💗. Traditional butter lamp ceremony performed at Wutai Mountain temples.',
    regularPrice: '79.00',
    salePrice: '69.00',
    stock: 999,
    status: 'published',
    featured: false,
    blessingTemple: 'Wutai Mountain',
  },
  {
    name: 'Incense and Amulet Package',
    slug: 'incense-and-amulet-package',
    description: 'Special offer on incense and amulets. Includes consecrated amulet and 7-day incense offering ceremony at Wutai Mountain.',
    regularPrice: '179.00',
    salePrice: '159.00',
    stock: 999,
    status: 'published',
    featured: false,
    blessingTemple: 'Wutai Mountain',
  },
  {
    name: 'Complete Blessing Ceremony',
    slug: 'complete-blessing-ceremony',
    description: 'Special offers on offering lamps, consecration, and burning incense. Full 21-day blessing ceremony with multiple rituals.',
    regularPrice: '229.00',
    salePrice: '209.00',
    stock: 999,
    status: 'published',
    featured: false,
    blessingTemple: 'Wutai Mountain',
  },
];

const productImages = [
  // 为每个开光饰品添加图片
  { productSlug: 'chinese-zodiac-guardian-pendant', url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800', isPrimary: true },
  { productSlug: 'eastern-ancient-wisdom-text-pendant', url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800', isPrimary: true },
  { productSlug: 'esoteric-north-star-seven-star-pendant', url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800', isPrimary: true },
  { productSlug: 'master-infused-energy-bracelet', url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800', isPrimary: true },
  { productSlug: 'zodiac-constellation-guardian-pendant', url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800', isPrimary: true },
  { productSlug: 'zodiac-moon-crescent-pendant', url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800', isPrimary: true },
  
  // 命理和祈福服务的图片
  { productSlug: 'ancient-chinese-wisdom-analysis', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800', isPrimary: true },
  { productSlug: 'dual-blessings-package', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800', isPrimary: true },
  { productSlug: 'wutai-mountain-incense-offering', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800', isPrimary: true },
  { productSlug: 'lamp-offering-for-blessings', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800', isPrimary: true },
  { productSlug: 'incense-and-amulet-package', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800', isPrimary: true },
  { productSlug: 'complete-blessing-ceremony', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800', isPrimary: true },
];

console.log('Starting to seed products...');

const insertedProducts = {};

for (const product of products) {
  try {
    const [result] = await db.insert(schema.products).values(product);
    insertedProducts[product.slug] = result.insertId;
    console.log(`✓ Inserted: ${product.name} (ID: ${result.insertId})`);
  } catch (error) {
    console.error(`✗ Failed to insert ${product.name}:`, error.message);
  }
}

console.log('\\nStarting to seed product images...');

for (const image of productImages) {
  try {
    const productId = insertedProducts[image.productSlug];
    if (!productId) {
      console.error(`✗ Product not found for slug: ${image.productSlug}`);
      continue;
    }
    
    await db.insert(schema.productImages).values({
      productId,
      url: image.url,
      fileKey: `product-images/${image.productSlug}`,
      isPrimary: image.isPrimary,
      displayOrder: 0,
    });
    console.log(`✓ Inserted image for: ${image.productSlug}`);
  } catch (error) {
    console.error(`✗ Failed to insert image for ${image.productSlug}:`, error.message);
  }
}

console.log('\\nProduct and image seeding completed!');
await connection.end();
