/**
 * 合规化数据迁移脚本
 * 将数据库中产品的敏感词替换为合规表述
 * 此脚本在服务器启动时运行一次
 */
import { getDb } from "./db";
import { products } from "../drizzle/schema";
import { sql } from "drizzle-orm";

// 多语言敏感词替换映射 - 按长度降序排列避免部分匹配
const textReplacements: Record<string, [string, string][]> = {
  en: [
    // 长短语优先
    ["pulsating with centuries of spiritual devotion", "steeped in centuries of cultural heritage"],
    ["Great Compassion Mantra", "Great Compassion Heritage Chant"],
    ["Shurangama Mantra", "Heroic Heritage Chant"],
    ["chanting of sacred texts", "heritage chanting"],
    ["Yellow Jambhala", "Golden Prosperity"],
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
    ["Blessing Ritual", "Imbuing Ceremony"],
    ["blessing ritual", "imbuing ceremony"],
    ["Consecration", "Imbuing Ceremony"],
    ["consecration", "imbuing ceremony"],
    ["Consecrated", "Imbued"],
    ["consecrated", "imbued"],
    ["Consecrate", "Imbue"],
    ["consecrate", "imbue"],
    ["Blessing", "Imbuing"],
    ["blessing", "imbuing"],
    ["Blessed", "Imbued"],
    ["blessed", "imbued"],
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
    ["Monks", "Lineage Holders"],
    ["monks", "lineage holders"],
    ["Monk", "Lineage Holder"],
    ["monk", "lineage holder"],
    ["Master's", "Lineage Holder's"],
    ["master's", "lineage holder's"],
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
    ["Sutras", "Heritage Texts"],
    ["sutras", "heritage texts"],
    ["Sutra", "Heritage Text"],
    ["sutra", "heritage text"],
    ["Mantras", "Heritage Chants"],
    ["mantras", "heritage chants"],
    ["Mantra", "Heritage Chant"],
    ["mantra", "heritage chant"],
    ["incantation", "heritage chant"],
    ["Prayers", "Cultural Intentions"],
    ["prayers", "cultural intentions"],
    ["Prayer", "Cultural Intention"],
    ["prayer", "cultural intention"],
    ["Rituals", "Ceremonies"],
    ["rituals", "ceremonies"],
    ["Ritual", "Ceremony"],
    ["ritual", "ceremony"],
    ["Buddhist", "Eastern cultural"],
    ["Buddhism", "Eastern culture"],
    ["Buddha", "cultural heritage"],
    ["Amitabha", "Eternal Light"],
    ["Jambhala", "Prosperity Guardian"],
    ["Amulets", "Guardian Tokens"],
    ["amulets", "guardian tokens"],
    ["Amulet", "Guardian Token"],
    ["amulet", "guardian token"],
    ["Talismans", "Guardian Tokens"],
    ["talismans", "guardian tokens"],
    ["Talisman", "Guardian Token"],
    ["talisman", "guardian token"],
    ["sanctity", "cultural integrity"],
    ["devotion", "dedication"],
    ["hallowed", "revered"],
  ],
  zh: [
    ["开光仪式", "启蕴仪式"],
    ["开光法物", "启蕴信物"],
    ["开光效用", "启蕴效用"],
    ["开光", "启蕴"],
    ["法物", "信物"],
    ["法器", "信物"],
    ["高僧大德", "文化传承人"],
    ["高僧", "文化传承人"],
    ["大师", "传承人"],
    ["大師", "傳承人"],
    ["法师", "传承人"],
    ["住持", "传承人"],
    ["寺庙", "文化圣地"],
    ["寺院", "文化圣地"],
    ["古刹", "文化圣地"],
    ["佛教", "东方文化"],
    ["佛法", "东方智慧"],
    ["佛", "文化"],
    ["诵经", "传承吟诵"],
    ["念经", "传承吟诵"],
    ["经文", "传承典籍"],
    ["咒语", "传承吟诵"],
    ["祈福", "文化祝愿"],
    ["祈祷", "文化祝愿"],
    ["加持", "启蕴"],
    ["灵验", "灵韵"],
    ["神圣", "庄严"],
    ["护身符", "守护信物"],
    ["阿弥陀", "永恒之光"],
    ["心經", "心智慧"],
    ["心经", "心智慧"],
    ["大悲咒", "大悲传承吟诵"],
    ["楞严咒", "英勇传承吟诵"],
    ["财宝天王", "金色繁荣守护"],
    ["法力", "文化能量"],
    ["灵性", "文化底蕴"],
    ["灵气", "文化气韵"],
    ["净土宗", "东方文化传承"],
  ],
  ja: [
    ["開光", "啓蘊"],
    ["法物", "信物"],
    ["高僧", "文化伝承者"],
    ["大師", "伝承者"],
    ["法師", "伝承者"],
    ["寺院", "文化聖地"],
    ["寺廟", "文化聖地"],
    ["仏教", "東方文化"],
    ["仏法", "東方の知恵"],
    ["仏", "文化"],
    ["読経", "伝承詠唱"],
    ["念仏", "伝承詠唱"],
    ["経文", "伝承典籍"],
    ["呪文", "伝承詠唱"],
    ["祈福", "文化祝願"],
    ["祈祷", "文化祝願"],
    ["加持", "啓蘊"],
    ["霊験", "霊韻"],
    ["神聖", "荘厳"],
    ["阿弥陀", "永遠の光"],
    ["浄土宗", "東方文化伝承"],
  ],
  de: [
    ["Segen", "Zeremonie"],
    ["gesegnet", "geweiht"],
    ["Kloster", "Kulturstätte"],
    ["Tempel", "Kulturstätte"],
    ["Mönch", "Kulturbewahrer"],
    ["Mönche", "Kulturbewahrer"],
    ["Ritual", "Zeremonie"],
    ["spirituell", "kulturell"],
    ["heilig", "kulturell"],
    ["göttlich", "kulturell"],
    ["buddhistisch", "östlich-kulturell"],
    ["Gebet", "kulturelle Intention"],
    ["Amulett", "Schutzzeichen"],
  ],
  fr: [
    ["bénédiction", "cérémonie d'imprégnation"],
    ["béni", "imprégné"],
    ["monastère", "site patrimonial"],
    ["moine", "gardien du patrimoine"],
    ["moines", "gardiens du patrimoine"],
    ["rituel", "cérémonie"],
    ["spirituel", "culturel"],
    ["sacré", "culturel"],
    ["divin", "patrimonial"],
    ["bouddhiste", "culturel oriental"],
    ["prière", "intention culturelle"],
    ["amulette", "jeton gardien"],
  ],
  es: [
    ["bendición", "ceremonia de impregnación"],
    ["bendecido", "imbuido"],
    ["monasterio", "sitio patrimonial"],
    ["monje", "guardián del patrimonio"],
    ["monjes", "guardianes del patrimonio"],
    ["espiritual", "cultural"],
    ["sagrado", "cultural"],
    ["divino", "patrimonial"],
    ["budista", "cultural oriental"],
    ["oración", "intención cultural"],
    ["amuleto", "token guardián"],
  ],
  it: [
    ["benedizione", "cerimonia di infusione"],
    ["benedetto", "infuso"],
    ["monastero", "sito del patrimonio"],
    ["monaco", "custode del patrimonio"],
    ["monaci", "custodi del patrimonio"],
    ["rituale", "cerimonia"],
    ["spirituale", "culturale"],
    ["sacro", "culturale"],
    ["divino", "del patrimonio"],
    ["buddista", "culturale orientale"],
    ["preghiera", "intenzione culturale"],
    ["amuleto", "token guardiano"],
  ],
  pt: [
    ["bênção", "cerimônia de imbuição"],
    ["abençoado", "imbuído"],
    ["mosteiro", "sítio patrimonial"],
    ["monge", "guardião do patrimônio"],
    ["monges", "guardiões do patrimônio"],
    ["espiritual", "cultural"],
    ["sagrado", "cultural"],
    ["divino", "patrimonial"],
    ["budista", "cultural oriental"],
    ["oração", "intenção cultural"],
    ["amuleto", "token guardião"],
  ],
};

function replaceInText(text: string, lang: string): string {
  let result = text;
  const replacements = textReplacements[lang];
  if (replacements) {
    for (const [find, replace] of replacements) {
      result = result.split(find).join(replace);
    }
  }
  return result;
}

function replaceInMultiLangJson(jsonStr: string): string {
  try {
    const data = JSON.parse(jsonStr);
    if (typeof data === "object" && data !== null) {
      for (const lang of Object.keys(data)) {
        if (typeof data[lang] === "string") {
          // Chinese variants
          if (lang === "zh" || lang === "zh-Hant" || lang === "zh-TW") {
            data[lang] = replaceInText(data[lang], "zh");
          }
          // Japanese
          if (lang === "ja") {
            data[lang] = replaceInText(data[lang], "ja");
          }
          // European languages with specific mappings
          if (textReplacements[lang]) {
            data[lang] = replaceInText(data[lang], lang);
          }
          // Always apply English replacements as fallback
          data[lang] = replaceInText(data[lang], "en");
        }
      }
      return JSON.stringify(data);
    }
  } catch {
    return replaceInText(replaceInText(jsonStr, "zh"), "en");
  }
  return jsonStr;
}

export async function runComplianceMigration() {
  console.log("[Compliance Migration] Starting product data compliance update...");
  
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
      
      // Process blessingMaster (plain text)
      if (product.blessingMaster) {
        const newMaster = replaceInText(replaceInText(product.blessingMaster, "zh"), "en");
        if (newMaster !== product.blessingMaster) {
          updates.blessingMaster = newMaster;
          hasChanges = true;
        }
      }
      
      // Process blessingTemple (plain text)
      if (product.blessingTemple) {
        const newTemple = replaceInText(replaceInText(product.blessingTemple, "zh"), "en");
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
