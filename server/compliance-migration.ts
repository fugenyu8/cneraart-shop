/**
 * 合规化数据迁移脚本 v2
 * 将数据库中产品的敏感词替换为合规表述
 * 对所有字段同时应用中文和英文替换规则（因为某些字段存储了错误语言的文本）
 */
import { getDb } from "./db";
import { products } from "../drizzle/schema";
import { sql } from "drizzle-orm";

// 中文敏感词替换 - 按长度降序
const zhReplacements: [string, string][] = [
  ["开光仪式", "启蕴仪式"],
  ["开光法物", "启蕴信物"],
  ["开光效用", "启蕴效用"],
  ["开光", "启蕴"],
  ["法物", "信物"],
  ["法器", "信物"],
  ["高僧大德", "文化传承人"],
  ["高僧", "文化传承人"],
  ["法师", "传承人"],
  ["住持", "传承人"],
  ["寺庙", "文化圣地"],
  ["寺院", "文化圣地"],
  ["古刹", "文化圣地"],
  ["佛教", "东方文化"],
  ["佛法", "东方智慧"],
  ["净土宗", "东方文化传承"],
  ["阿弥陀佛", "永恒之光"],
  ["阿弥陀", "永恒之光"],
  ["文殊菩萨", "文殊智慧"],
  ["菩萨", "守护者"],
  ["佛", "文化"],
  ["诵经", "传承吟诵"],
  ["念经", "传承吟诵"],
  ["诵念", "吟诵"],
  ["诵唱", "吟诵"],
  ["经文", "传承典籍"],
  ["圣典", "传承典籍"],
  ["咒语", "传承吟诵"],
  ["名咒", "传承吟诵"],
  ["祈福", "文化祝愿"],
  ["祈祷", "文化祝愿"],
  ["加持仪式", "启蕴仪式"],
  ["加持", "启蕴"],
  ["灵验", "灵韵"],
  ["灵修", "文化修行"],
  ["灵性", "文化底蕴"],
  ["灵气", "文化气韵"],
  ["灵力", "文化能量"],
  ["神圣", "庄严"],
  ["护身符", "守护信物"],
  ["心經", "心智慧"],
  ["心经", "心智慧"],
  ["大悲咒", "大悲传承吟诵"],
  ["楞严咒", "英勇传承吟诵"],
  ["财宝天王", "金色繁荣守护"],
  ["法力", "文化能量"],
  ["圣檀香", "传承檀香"],
  ["大师", "传承人"],
  ["大師", "傳承人"],
  ["心灵圣地", "心灵净土"],
];

// 英文敏感词替换 - 按长度降序
const enReplacements: [string, string][] = [
  // Long phrases first
  ["pulsating with centuries of spiritual devotion", "steeped in centuries of cultural heritage"],
  ["Great Compassion Mantra", "Great Compassion Heritage Chant"],
  ["Shurangama Mantra", "Heroic Heritage Chant"],
  ["chanting of sacred texts", "heritage chanting"],
  ["Yellow Jambhala", "Golden Prosperity"],
  ["Manjushri Hall", "Wisdom Hall"],
  ["venerable masters", "cultural lineage holders"],
  ["Venerable Master", "Cultural Lineage Holder"],
  ["venerable master", "cultural lineage holder"],
  ["revered masters", "cultural lineage holders"],
  ["Revered Master", "Cultural Lineage Holder"],
  ["revered master", "cultural lineage holder"],
  ["temple masters", "lineage holders"],
  ["Temple Master", "Lineage Holder"],
  ["temple master", "lineage holder"],
  ["Sutra Chanting", "Heritage Chanting"],
  ["sutra chanting", "heritage chanting"],
  ["Heart Sutra", "Heart Wisdom"],
  ["ancient temples", "heritage sites"],
  ["Ancient Temple", "Heritage Site"],
  ["ancient temple", "heritage site"],
  ["high priest", "lineage holder"],
  // Consecration
  ["consecration ceremony", "imbuing ceremony"],
  ["Consecration Ceremony", "Imbuing Ceremony"],
  ["Consecration", "Imbuing Ceremony"],
  ["consecration", "imbuing ceremony"],
  ["Consecrating", "Imbuing"],
  ["consecrating", "imbuing"],
  ["Consecrated", "Imbued"],
  ["consecrated", "imbued"],
  ["Consecrate", "Imbue"],
  ["consecrate", "imbue"],
  // Blessing
  ["Blessing Ritual", "Imbuing Ceremony"],
  ["blessing ritual", "imbuing ceremony"],
  ["Blessing", "Imbuing"],
  ["blessing", "imbuing"],
  ["Blessed", "Imbued"],
  ["blessed", "imbued"],
  // Adjectives
  ["Spiritual", "Cultural"],
  ["spiritual", "cultural"],
  ["Sacred", "Cultural"],
  ["sacred", "cultural"],
  ["Holy", "Cultural"],
  ["holy", "cultural"],
  ["Divine", "Heritage"],
  ["divine", "heritage"],
  ["Religious", "Traditional"],
  ["religious", "traditional"],
  // People
  ["Monks", "Lineage Holders"],
  ["monks", "lineage holders"],
  ["Monk", "Lineage Holder"],
  ["monk", "lineage holder"],
  // Places
  ["Temples", "Heritage Sites"],
  ["temples", "heritage sites"],
  ["Temple", "Heritage Site"],
  ["temple", "heritage site"],
  ["Monasteries", "Heritage Sites"],
  ["monasteries", "heritage sites"],
  ["Monastery", "Heritage Site"],
  ["monastery", "heritage site"],
  ["Shrine", "Heritage Site"],
  ["shrine", "heritage site"],
  // Texts
  ["Sutras", "Heritage Texts"],
  ["sutras", "heritage texts"],
  ["Sutra", "Heritage Text"],
  ["sutra", "heritage text"],
  ["Mantras", "Heritage Chants"],
  ["mantras", "heritage chants"],
  ["Mantra", "Heritage Chant"],
  ["mantra", "heritage chant"],
  ["incantation", "heritage chant"],
  // Prayer
  ["Prayers", "Cultural Intentions"],
  ["prayers", "cultural intentions"],
  ["Prayer", "Cultural Intention"],
  ["prayer", "cultural intention"],
  // Ritual
  ["Rituals", "Ceremonies"],
  ["rituals", "ceremonies"],
  ["Ritual", "Ceremony"],
  ["ritual", "ceremony"],
  // Buddhist specific
  ["Buddhist", "Eastern cultural"],
  ["Buddhism", "Eastern culture"],
  ["Bodhisattva", "Guardian"],
  ["bodhisattva", "guardian"],
  ["Buddha", "cultural heritage"],
  ["Amitabha", "Eternal Light"],
  ["Manjushri", "Wisdom"],
  ["Jambhala", "Prosperity Guardian"],
  // Objects
  ["Amulets", "Guardian Tokens"],
  ["amulets", "guardian tokens"],
  ["Amulet", "Guardian Token"],
  ["amulet", "guardian token"],
  ["Talismans", "Guardian Tokens"],
  ["talismans", "guardian tokens"],
  ["Talisman", "Guardian Token"],
  ["talisman", "guardian token"],
  // Other
  ["sanctity", "cultural integrity"],
  ["devotion", "dedication"],
  ["hallowed", "revered"],
  ["Pure Land", "Eastern Heritage"],
];

function applyReplacements(text: string, replacements: [string, string][]): string {
  let result = text;
  for (const [find, replace] of replacements) {
    result = result.split(find).join(replace);
  }
  return result;
}

function replaceAllSensitiveTerms(text: string): string {
  // Apply Chinese replacements first, then English
  let result = applyReplacements(text, zhReplacements);
  result = applyReplacements(result, enReplacements);
  return result;
}

function replaceInMultiLangJson(jsonStr: string): string {
  try {
    const data = JSON.parse(jsonStr);
    if (typeof data === "object" && data !== null) {
      for (const lang of Object.keys(data)) {
        if (typeof data[lang] === "string") {
          // Apply ALL replacements to ALL language fields
          // because some fields have wrong-language content
          data[lang] = replaceAllSensitiveTerms(data[lang]);
        }
      }
      return JSON.stringify(data);
    }
  } catch {
    return replaceAllSensitiveTerms(jsonStr);
  }
  return jsonStr;
}

export async function runComplianceMigration() {
  console.log("[Compliance Migration v2] Starting product data compliance update...");
  
  try {
    const db = await getDb();
    if (!db) {
      console.error("[Compliance Migration] Database not available, skipping");
      return false;
    }
    
    const allProducts = await db.select().from(products);
    console.log(`[Compliance Migration] Found ${allProducts.length} products to process`);
    
    let updatedCount = 0;
    
    for (const product of allProducts) {
      const updates: Record<string, any> = {};
      let hasChanges = false;
      
      // Process multi-lang JSON fields
      const jsonFields = ["name", "description", "shortDescription", "blessingDescription", "efficacy", "suitableFor", "wearingGuide"] as const;
      for (const field of jsonFields) {
        const value = (product as any)[field] as string | null;
        if (value) {
          const newValue = replaceInMultiLangJson(value);
          if (newValue !== value) {
            updates[field] = newValue;
            hasChanges = true;
          }
        }
      }
      
      // Process blessingMaster (plain text) - "Master X" → "Lineage Holder X"
      if (product.blessingMaster) {
        let newMaster = replaceAllSensitiveTerms(product.blessingMaster);
        // Also handle "Master X" pattern
        if (newMaster.startsWith("Master ")) {
          newMaster = newMaster.replace(/^Master /, "Lineage Holder ");
        }
        if (newMaster !== product.blessingMaster) {
          updates.blessingMaster = newMaster;
          hasChanges = true;
        }
      }
      
      // Process blessingTemple (plain text) - "Wutai Mountain" → "Wutai Mountain Heritage Site"
      if (product.blessingTemple) {
        let newTemple = replaceAllSensitiveTerms(product.blessingTemple);
        // Ensure "Wutai Mountain" gets proper suffix
        if (newTemple === "Wutai Mountain") {
          newTemple = "Wutai Mountain Heritage Site";
        }
        if (newTemple !== product.blessingTemple) {
          updates.blessingTemple = newTemple;
          hasChanges = true;
        }
      }
      
      if (hasChanges) {
        await db
          .update(products)
          .set(updates)
          .where(sql`id = ${product.id}`);
        updatedCount++;
        console.log(`[Compliance Migration] Updated product ID=${product.id} (${Object.keys(updates).join(", ")})`);
      }
    }
    
    console.log(`[Compliance Migration] Complete. Updated ${updatedCount}/${allProducts.length} products.`);
    return true;
  } catch (error) {
    console.error("[Compliance Migration] Error:", error);
    return false;
  }
}
