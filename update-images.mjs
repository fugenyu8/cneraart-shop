import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';

const DB_URL = 'mysql://3sTgkhNymxcGJsq.dc2e5ef9e23e:3i3JNeXks4422BKffDiV@gateway03.us-east-1.prod.aws.tidbcloud.com:4000/c8K47cxkpIofT46rxSignU?ssl={"rejectUnauthorized":true}';

// Parse S3 URLs
const urlMap = {};
readFileSync('/home/ubuntu/s3_urls.txt', 'utf-8').trim().split('\n').forEach(line => {
  const [label, url] = line.split('|');
  urlMap[label] = url;
});

console.log(`Loaded ${Object.keys(urlMap).length} S3 URLs`);

async function main() {
  const conn = await mysql.createConnection(DB_URL);
  
  // Strategy: 
  // 1. Delete ALL existing product_images rows
  // 2. Re-insert with correct S3 URLs, proper primary flags, and multiple images per product
  
  console.log('\n=== Step 1: Delete all existing product_images ===');
  const [delResult] = await conn.query('DELETE FROM product_images');
  console.log(`Deleted ${delResult.affectedRows} rows`);
  
  console.log('\n=== Step 2: Insert new images with S3 URLs ===');
  
  const inserts = [];
  
  // Helper to add image
  let nextId = 1;
  function addImg(productId, label, isPrimary, altText) {
    const url = urlMap[label];
    if (!url) { console.log(`  WARNING: No URL for label "${label}"`); return; }
    inserts.push([nextId++, productId, url, label, altText || '', isPrimary ? 1 : 0, isPrimary ? 1 : inserts.filter(i => i[1] === productId).length + 1]);
  }
  
  // === ZODIAC GUARDIANS (pid 30001-30012) ===
  const zodiacAnimals = [
    [30001, 'zodiac-rat', 'Rat Guardian Pendant'],
    [30002, 'zodiac-ox', 'Ox Guardian Pendant'],
    [30003, 'zodiac-tiger', 'Tiger Guardian Pendant'],
    [30004, 'zodiac-rabbit', 'Rabbit Guardian Pendant'],
    [30005, 'zodiac-dragon', 'Dragon Guardian Pendant'],
    [30006, 'zodiac-snake', 'Snake Guardian Pendant'],
    [30007, 'zodiac-horse', 'Horse Guardian Pendant'],
    [30008, 'zodiac-goat', 'Goat Guardian Pendant'],
    [30009, 'zodiac-monkey', 'Monkey Guardian Pendant'],
    [30010, 'zodiac-rooster', 'Rooster Guardian Pendant'],
    [30011, 'zodiac-dog', 'Dog Guardian Pendant'],
    [30012, 'zodiac-pig', 'Pig Guardian Pendant'],
  ];
  for (const [pid, label, alt] of zodiacAnimals) {
    addImg(pid, label, true, alt);
    addImg(pid, 'zodiac-back', false, 'Pendant Back - Yin Yang');
  }
  
  // Parent category product pid=1 (Chinese Zodiac Guardian generic)
  addImg(1, 'zodiac-group', true, 'Chinese Zodiac Guardian Pendants Collection');
  
  // === SUN SIGN GUARDIANS (pid 30013-30024) ===
  const sunSigns = [
    [30013, 'sun-aries', 'Aries Sun Guardian Pendant'],
    [30014, 'sun-taurus', 'Taurus Sun Guardian Pendant'],
    [30015, 'sun-gemini', 'Gemini Sun Guardian Pendant'],
    [30016, 'sun-cancer', 'Cancer Sun Guardian Pendant'],
    [30017, 'sun-leo', 'Leo Sun Guardian Pendant'],
    [30018, 'sun-virgo', 'Virgo Sun Guardian Pendant'],
    [30019, 'sun-libra', 'Libra Sun Guardian Pendant'],
    [30020, 'sun-scorpio', 'Scorpio Sun Guardian Pendant'],
    [30021, 'sun-sagittarius', 'Sagittarius Sun Guardian Pendant'],
    [30022, 'sun-capricorn', 'Capricorn Sun Guardian Pendant'],
    [30023, 'sun-aquarius', 'Aquarius Sun Guardian Pendant'],
    [30024, 'sun-pisces', 'Pisces Sun Guardian Pendant'],
  ];
  for (const [pid, label, alt] of sunSigns) {
    addImg(pid, label, true, alt);
    addImg(pid, 'sun-back', false, 'Pendant Back');
  }
  
  // Parent category product pid=5 (Zodiac Constellation generic)
  addImg(5, 'sun-group', true, 'Zodiac Constellation Guardian Pendants Collection');
  
  // === MOON SIGN GUARDIANS (pid 30025-30036) ===
  const moonSigns = [
    [30025, 'moon-aries', 'Aries Moon Crescent Pendant'],
    [30026, 'moon-taurus', 'Taurus Moon Crescent Pendant'],
    [30027, 'moon-gemini', 'Gemini Moon Crescent Pendant'],
    [30028, 'moon-cancer', 'Cancer Moon Crescent Pendant'],
    [30029, 'moon-leo', 'Leo Moon Crescent Pendant'],
    [30030, 'moon-virgo', 'Virgo Moon Crescent Pendant'],
    [30031, 'moon-libra', 'Libra Moon Crescent Pendant'],
    [30032, 'moon-scorpio', 'Scorpio Moon Crescent Pendant'],
    [30033, 'moon-sagittarius', 'Sagittarius Moon Crescent Pendant'],
    [30034, 'moon-capricorn', 'Capricorn Moon Crescent Pendant'],
    [30035, 'moon-aquarius', 'Aquarius Moon Crescent Pendant'],
    [30036, 'moon-pisces', 'Pisces Moon Crescent Pendant'],
  ];
  for (const [pid, label, alt] of moonSigns) {
    addImg(pid, label, true, alt);
  }
  
  // Parent category product pid=6 (Moon Crescent generic)
  addImg(6, 'moon-group', true, 'Zodiac Moon Crescent Pendants Collection');
  
  // === SCRIPTURE PENDANT (pid=2) ===
  addImg(2, 'scripture-pendant-main', true, 'Eastern Ancient Wisdom Text Pendant');
  addImg(2, 'scripture-pendant-2', false, 'Scripture Pendant Detail');
  addImg(2, 'scripture-pendant-3', false, 'Scripture Pendant Detail');
  addImg(2, 'scripture-pendant-4', false, 'Scripture Pendant Detail');
  addImg(2, 'scripture-pendant-5', false, 'Scripture Pendant Detail');
  addImg(2, 'scripture-pendant-6', false, 'Scripture Pendant Detail');
  
  // === NORTH STAR PENDANT (pid=3) ===
  addImg(3, 'north-star-1', true, 'North Star Seven-Star Pendant');
  addImg(3, 'north-star-2', false, 'North Star Pendant Detail');
  addImg(3, 'north-star-3', false, 'North Star Pendant Back');
  
  // === BRACELETS ===
  // Heart Sutra (pid=30037)
  addImg(30037, 'bracelet-heart-sutra-silver', true, 'Heart Sutra Bracelet Silver');
  addImg(30037, 'bracelet-heart-sutra-gold', false, 'Heart Sutra Bracelet Gold');
  
  // Great Compassion Mantra (pid=30038)
  addImg(30038, 'bracelet-compassion-gold', true, 'Great Compassion Mantra Bracelet Gold');
  addImg(30038, 'bracelet-compassion-silver', false, 'Great Compassion Mantra Bracelet Silver');
  
  // Shurangama Mantra (pid=30039)
  addImg(30039, 'bracelet-shurangama-silver', true, 'Shurangama Mantra Bracelet Silver');
  addImg(30039, 'bracelet-shurangama-gold', false, 'Shurangama Mantra Bracelet Gold');
  addImg(30039, 'bracelet-shurangama-rosegold', false, 'Shurangama Mantra Bracelet Rose Gold');
  
  // Yellow Jambhala (pid=30040)
  addImg(30040, 'bracelet-jambhala', true, 'Yellow Jambhala Bracelet');
  addImg(30040, 'bracelet-jambhala-gold', false, 'Yellow Jambhala Bracelet Gold');
  
  // Amitabha (pid=30041)
  addImg(30041, 'bracelet-amitabha', true, 'Amitabha Bracelet');
  addImg(30041, 'bracelet-amitabha-1', false, 'Amitabha Bracelet Detail');
  
  // Parent category product pid=4 (Master-Infused Bracelet generic)
  addImg(4, 'bracelet-link1', true, 'Master-Infused Energy Bracelet Collection');
  
  // === DESTINY ANALYSIS ===
  // $19 (pid=7)
  addImg(7, 'destiny19-main', true, 'Ancient Chinese Wisdom Analysis');
  addImg(7, 'destiny19-desc1', false, 'Destiny Analysis Description');
  
  // $79 (pid=8)
  addImg(8, 'destiny79-main', true, 'Dual Blessings Package');
  addImg(8, 'destiny79-desc1', false, 'Destiny Analysis Description');
  
  // === BLESSING SERVICES ===
  // Incense $69 (pid=9)
  addImg(9, 'blessing-incense69-link', true, 'Wutai Mountain Incense Offering');
  addImg(9, 'blessing-incense69-1', false, 'Incense Offering Detail');
  
  // Lamp $69 (pid=10)
  addImg(10, 'blessing-lamp69-link', true, 'Lamp Offering for Blessings');
  addImg(10, 'blessing-lamp69-link1', false, 'Lamp Offering Detail');
  
  // Incense+Amulet $159 (pid=11)
  addImg(11, 'blessing-incense-amulet-link', true, 'Incense and Amulet Package');
  addImg(11, 'blessing-incense-amulet-1', false, 'Incense and Amulet Detail');
  
  // Complete $209 (pid=12)
  addImg(12, 'blessing-complete-link', true, 'Complete Blessing Ceremony');
  addImg(12, 'blessing-complete-1', false, 'Complete Blessing Detail');
  
  // === FACE/PALM/FENGSHUI (pid=13,14,15) - No product photos provided ===
  // Keep using destiny images as placeholder
  addImg(13, 'destiny19-main', true, 'Face Reading Analysis');
  addImg(14, 'destiny19-main', true, 'Palm Reading Analysis');
  addImg(15, 'destiny19-main', true, 'Home Feng Shui Consultation');
  
  // Execute batch insert
  console.log(`Preparing to insert ${inserts.length} image records...`);
  
  const sql = 'INSERT INTO product_images (id, productId, url, fileKey, altText, isPrimary, displayOrder) VALUES ?';
  const [insertResult] = await conn.query(sql, [inserts]);
  console.log(`Inserted ${insertResult.affectedRows} rows`);
  
  // Verify
  const [verify] = await conn.query('SELECT COUNT(*) as cnt FROM product_images');
  console.log(`\nVerification: ${verify[0].cnt} total images in database`);
  
  const [byProduct] = await conn.query('SELECT productId, COUNT(*) as cnt FROM product_images GROUP BY productId ORDER BY productId');
  console.log('\nImages per product:');
  byProduct.forEach(r => console.log(`  pid=${r.productId}: ${r.cnt} images`));
  
  await conn.end();
  console.log('\n=== Database update complete! ===');
}

main().catch(console.error);
