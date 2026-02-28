/**
 * 为三组重复名称的产品添加规格标注
 * 规格信息来自Excel中文标题的括号内容
 */
import mysql2 from 'mysql2/promise';
import * as XLSX from 'xlsx';
import { readFileSync } from 'fs';

const DB_URL = 'mysql://3sTgkhNymxcGJsq.dc2e5ef9e23e:3i3JNeXks4422BKffDiV@gateway03.us-east-1.prod.aws.tidbcloud.com:4000/c8K47cxkpiofT46rxSignU?ssl={"rejectUnauthorized":true}';

function readExcelTitles(filepath) {
  const buf = readFileSync(filepath);
  const wb = XLSX.read(buf, { type: 'buffer' });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
  const result = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const seq = row[0];
    const rawTitle = String(row[4] || '');
    if (!seq || !rawTitle) continue;
    // 提取括号内的规格
    const specMatch = rawTitle.match(/[（(]([^）)]+)[）)]/);
    const spec = specMatch ? specMatch[1].trim() : null;
    result.push({ seq, rawTitle, spec });
  }
  return result;
}

// 将中文规格转换为英文
function translateSpec(spec) {
  if (!spec) return null;
  return spec
    .replace(/珠子直径[：:]\s*约\s*/g, 'Bead Dia. ~')
    .replace(/珠子直径约[：:]?\s*/g, 'Bead Dia. ~')
    .replace(/主石直径约[：:]?\s*/g, 'Main Stone ~')
    .replace(/直径约\s*/g, 'Dia. ~')
    .replace(/宽约[：:]?\s*/g, 'W ~')
    .replace(/约\s*/g, '~')
    .replace(/毫米/g, 'mm')
    .replace(/厘米|cm/g, 'cm')
    .trim();
}

const conn = await mysql2.createConnection(DB_URL);
console.log('✅ 数据库连接成功\n');

// ===== Wisdom & Study: 白水晶手串 (IDs: 700031, 700032, 700033, 700034) =====
const wisdomTitles = readExcelTitles('/home/ubuntu/upload/wisdom&study.xlsx');
const crystalBracelets = wisdomTitles.filter(t => t.rawTitle.includes('天然纯净白水晶手串'));
console.log('白水晶手串规格:');
crystalBracelets.forEach(t => console.log(`  seq${t.seq}: ${t.rawTitle} → spec: ${t.spec} → EN: ${translateSpec(t.spec)}`));

const crystalIds = [700031, 700032, 700033, 700034];
for (let i = 0; i < Math.min(crystalBracelets.length, crystalIds.length); i++) {
  const spec = translateSpec(crystalBracelets[i].spec);
  const newName = spec
    ? `Natural Pure White Crystal Bracelet - ${spec}`
    : `Natural Pure White Crystal Bracelet #${i + 1}`;
  await conn.execute('UPDATE products SET name = ? WHERE id = ?', [newName, crystalIds[i]]);
  console.log(`  ✅ ID ${crystalIds[i]}: → "${newName}"`);
}

// ===== Inner Peace: 菩提杏花微雨手串 (IDs: 700004, 700005, 700006) =====
const innerTitles = readExcelTitles('/home/ubuntu/upload/innerpeace.xlsx');
const bodhiBracelets = innerTitles.filter(t => t.rawTitle.includes('菩提杏花微雨手串'));
console.log('\n菩提手串规格:');
bodhiBracelets.forEach(t => console.log(`  seq${t.seq}: ${t.rawTitle} → spec: ${t.spec} → EN: ${translateSpec(t.spec)}`));

const bodhi = [700004, 700005, 700006];
for (let i = 0; i < Math.min(bodhiBracelets.length, bodhi.length); i++) {
  const spec = translateSpec(bodhiBracelets[i].spec);
  const newName = spec
    ? `Bodhi Apricot Blossom Mist Bracelet - ${spec}`
    : `Bodhi Apricot Blossom Mist Bracelet #${i + 1}`;
  await conn.execute('UPDATE products SET name = ? WHERE id = ?', [newName, bodhi[i]]);
  console.log(`  ✅ ID ${bodhi[i]}: → "${newName}"`);
}

// ===== Inner Peace: 黑曜石海蓝宝水晶手串 (IDs: 700010, 700011, 700012, 700013) =====
const obsidianBracelets = innerTitles.filter(t => t.rawTitle.includes('黑曜石海蓝宝水晶手串'));
console.log('\n黑曜石手串规格:');
obsidianBracelets.forEach(t => console.log(`  seq${t.seq}: ${t.rawTitle} → spec: ${t.spec} → EN: ${translateSpec(t.spec)}`));

const obsidian = [700010, 700011, 700012, 700013];
for (let i = 0; i < Math.min(obsidianBracelets.length, obsidian.length); i++) {
  const spec = translateSpec(obsidianBracelets[i].spec);
  const newName = spec
    ? `Obsidian Aquamarine Crystal Bracelet - ${spec}`
    : `Obsidian Aquamarine Crystal Bracelet #${i + 1}`;
  await conn.execute('UPDATE products SET name = ? WHERE id = ?', [newName, obsidian[i]]);
  console.log(`  ✅ ID ${obsidian[i]}: → "${newName}"`);
}

// 验证
console.log('\n=== 验证更新结果 ===');
const ids = [...crystalIds, ...bodhi, ...obsidian];
const [rows] = await conn.execute(
  `SELECT id, name FROM products WHERE id IN (${ids.join(',')}) ORDER BY id`
);
for (const r of rows) {
  console.log(`  ID ${r.id}: ${r.name}`);
}

await conn.end();
console.log('\n✅ 全部完成！');
