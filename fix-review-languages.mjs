import mysql from 'mysql2/promise';

const DB_URL = process.env.DATABASE_URL;

// Map location country/city patterns to language codes
const locationToLang = [
  // German-speaking
  { patterns: ['Germany', 'Austria', 'Zurich', 'Bern', 'Basel'], lang: 'de' },
  // French-speaking
  { patterns: ['France', 'Belgium', 'Geneva', 'Luxembourg', 'Namur', 'Antwerp'], lang: 'fr' },
  // Spanish-speaking
  { patterns: ['Spain', 'Mexico', 'Argentina', 'Colombia', 'Chile', 'Peru'], lang: 'es' },
  // Italian-speaking
  { patterns: ['Italy', 'Milan', 'Rome', 'Florence', 'Genoa', 'Naples', 'Turin', 'Venice', 'Bologna'], lang: 'it' },
  // Portuguese-speaking
  { patterns: ['Portugal', 'Brazil', 'Porto', 'Lisbon', 'Braga', 'São Paulo', 'Rio'], lang: 'pt' },
  // Japanese
  { patterns: ['Japan', 'Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Sapporo', 'Nagoya', 'Kobe', 'Fukuoka'], lang: 'ja' },
  // Korean
  { patterns: ['South Korea', 'Korea', 'Seoul', 'Busan', 'Incheon', 'Daegu'], lang: 'ko' },
  // Chinese
  { patterns: ['China', 'Taiwan', 'Hong Kong', 'Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Taipei', 'Singapore'], lang: 'zh' },
  // Thai
  { patterns: ['Thailand', 'Bangkok', 'Chiang Mai', 'Phuket'], lang: 'th' },
  // Vietnamese
  { patterns: ['Vietnam', 'Ho Chi Minh', 'Hanoi', 'Da Nang'], lang: 'vi' },
  // English (default for US, UK, Canada, Australia, etc.)
  { patterns: ['United States', 'United Kingdom', 'Canada', 'Australia', 'New Zealand', 'Ireland', 'Scotland', 'England', 'Wales', 'India', 'Philippines', 'Malaysia', 'Indonesia', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Netherlands', 'Poland', 'Czech', 'Hungary', 'Romania', 'Greece', 'Turkey', 'Israel', 'UAE', 'Dubai', 'Saudi'], lang: 'en' },
];

function detectLangFromLocation(location) {
  if (!location) return 'en';
  for (const { patterns, lang } of locationToLang) {
    for (const p of patterns) {
      if (location.includes(p)) return lang;
    }
  }
  return 'en'; // default
}

// Also detect from comment content as backup
function detectLangFromComment(comment) {
  if (!comment) return null;
  const first100 = comment.substring(0, 100);
  if (/[äöüßÄÖÜ]/.test(first100) || /\b(Das|Die|Der|Ich|und|ist|habe|sehr|wurde|nach|dieses|wunderschön)\b/i.test(first100)) return 'de';
  if (/[àâéèêëïîôùûüÿçÀÂÉÈ]/.test(first100) || /\b(Le|La|Les|Ce|Cette|Mon|Très|Acheté|après|depuis|qualité|magnifique)\b/.test(first100)) return 'fr';
  if (/[áéíóúñ¿¡]/.test(first100) || /\b(El|La|Los|Las|Este|Esta|Como|exactamente|espiritual|increíble|hermosa)\b/i.test(first100)) return 'es';
  if (/[àèéìòùÀÈÉÌÒÙ]/.test(first100) || /\b(Il|La|Le|Lo|Gli|Questo|Questa|assolutamente|bellissimo|incisione|qualità)\b/i.test(first100)) return 'it';
  if (/[ãõçáéíóú]/.test(first100) || /\b(O|A|Os|As|Este|Esta|Peça|linda|chegou|embalado|qualidade)\b/i.test(first100)) return 'pt';
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(first100)) return 'ja';
  if (/[\uAC00-\uD7AF]/.test(first100)) return 'ko';
  if (/[\u4E00-\u9FFF]/.test(first100)) return 'zh';
  if (/[\u0E00-\u0E7F]/.test(first100)) return 'th';
  if (/[\u0100-\u024F]/.test(first100) && /\b(đ|ơ|ư|ạ|ả|ấ|ầ|ẩ|ẫ|ậ)\b/.test(first100)) return 'vi';
  return null;
}

async function main() {
  const conn = await mysql.createConnection(DB_URL);
  console.log('Connected to database');

  // Process in batches of 50000
  const BATCH = 50000;
  const [countResult] = await conn.execute('SELECT COUNT(*) as total FROM reviews');
  const total = countResult[0].total;
  console.log(`Total reviews: ${total}`);

  let processed = 0;
  let lastId = 0;

  while (processed < total) {
    const [rows] = await conn.execute(
      `SELECT id, location, comment FROM reviews WHERE id > ? ORDER BY id ASC LIMIT ${BATCH}`,
      [lastId]
    );

    if (rows.length === 0) break;

    // Group updates by language
    const langUpdates = {};
    for (const row of rows) {
      let lang = detectLangFromLocation(row.location);
      // Double-check with comment content if location says 'en' but comment is clearly another language
      if (lang === 'en' || lang === 'zh') {
        const commentLang = detectLangFromComment(row.comment);
        if (commentLang && commentLang !== 'en' && commentLang !== 'zh') {
          lang = commentLang;
        } else if (lang === 'zh') {
          // For 'zh' from location, verify the comment is actually Chinese
          const commentLang2 = detectLangFromComment(row.comment);
          if (commentLang2 && commentLang2 !== 'zh') {
            lang = commentLang2;
          }
        }
      }

      if (!langUpdates[lang]) langUpdates[lang] = [];
      langUpdates[lang].push(row.id);
    }

    // Batch update by language
    for (const [lang, ids] of Object.entries(langUpdates)) {
      if (lang === 'zh') continue; // Already set to zh, skip

      // Update in chunks of 5000 IDs
      for (let i = 0; i < ids.length; i += 5000) {
        const chunk = ids.slice(i, i + 5000);
        const placeholders = chunk.map(() => '?').join(',');
        await conn.execute(
          `UPDATE reviews SET language = ? WHERE id IN (${placeholders})`,
          [lang, ...chunk]
        );
      }
    }

    lastId = rows[rows.length - 1].id;
    processed += rows.length;
    
    // Show language distribution for this batch
    const langCounts = {};
    for (const [lang, ids] of Object.entries(langUpdates)) {
      langCounts[lang] = ids.length;
    }
    console.log(`Processed ${processed}/${total} | Batch langs:`, JSON.stringify(langCounts));
  }

  // Final check
  const [finalDist] = await conn.execute('SELECT language, COUNT(*) as cnt FROM reviews GROUP BY language ORDER BY cnt DESC');
  console.log('\nFinal language distribution:');
  finalDist.forEach(r => console.log(`  ${r.language}: ${r.cnt}`));

  await conn.end();
  console.log('Done!');
}

main().catch(console.error);
