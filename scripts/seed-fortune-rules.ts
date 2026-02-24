import { getDb } from "../server/db";
import { faceRules, palmRules, fengshuiRules } from "../drizzle/schema";

// 导入所有规则数据文件
import { faceRulesData } from "./rules/face-rules";
import { faceExtendedRulesData } from "./rules/face-rules-extended";
import { faceExtraRulesData } from "./rules/face-rules-extra";
import { palmRulesData } from "./rules/palm-rules";
import { palmExtendedRulesData } from "./rules/palm-rules-extended";
import { palmExtraRulesData } from "./rules/palm-rules-extra";
import { fengshuiRulesData } from "./rules/fengshui-rules";
import { fengshuiExtendedRulesData } from "./rules/fengshui-rules-extended";
import { fengshuiExtraRulesData } from "./rules/fengshui-rules-extra";

/**
 * 中文房间类型 → 英文房间类型映射
 * 与 fengshui.ts 中的 inferRoomType() 返回值保持一致
 */
const ROOM_TYPE_MAP: Record<string, string> = {
  "客厅": "living_room",
  "卧室": "bedroom",
  "书房": "study",
  "厨房": "kitchen",
  "卫生间": "bathroom",
  "阳台": "balcony",
  "餐厅": "dining_room",
  "玄关": "entrance",
  "通用": "general",
};

/**
 * 转换风水规则的 conditionValue：
 * 1. 将 0-1 范围的数值转换为 0-100 范围
 * 2. 将 between 分隔符从 "-" 转换为 ","
 */
function convertFengshuiConditionValue(operator: string, value: string): string {
  if (operator === "between") {
    // "0.80-0.85" → "80,85"
    const parts = value.split("-");
    if (parts.length === 2) {
      const min = parseFloat(parts[0]);
      const max = parseFloat(parts[1]);
      // 判断是否是 0-1 范围的值（需要乘以 100）
      if (min <= 1 && max <= 1) {
        return `${Math.round(min * 100)},${Math.round(max * 100)}`;
      }
      // 已经是 0-100 范围，只需要改分隔符
      return `${Math.round(min)},${Math.round(max)}`;
    }
    return value;
  }

  if (operator === ">=" || operator === "<=" || operator === ">" || operator === "<" || operator === "=") {
    const num = parseFloat(value);
    // 判断是否是 0-1 范围的值
    if (!isNaN(num) && num <= 1 && num >= 0) {
      return String(Math.round(num * 100));
    }
    return value;
  }

  return value;
}

/**
 * 初始化命理测算规则数据
 * 总计 1071 条规则：面相 353 + 手相 348 + 风水 370
 */
async function seedFortuneRules() {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    process.exit(1);
  }

  console.log("开始初始化命理测算规则...");
  console.log("总计规则数: 1071 条");

  // 清空现有规则
  await db.delete(faceRules);
  await db.delete(palmRules);
  await db.delete(fengshuiRules);

  // ==================== 面相规则 (353条) ====================
  console.log("插入面相规则 (353条)...");
  const allFaceRules = [
    ...faceRulesData,
    ...faceExtendedRulesData,
    ...faceExtraRulesData,
  ];

  // 分批插入，每批 50 条
  for (let i = 0; i < allFaceRules.length; i += 50) {
    const batch = allFaceRules.slice(i, i + 50).map((r) => ({
      palaceName: r.palaceName,
      featureName: r.featureName,
      conditionOperator: r.conditionOperator,
      conditionValue: r.conditionValue,
      score: r.score,
      interpretation: r.interpretation,
      category: r.category,
    }));
    await db.insert(faceRules).values(batch);
    console.log(`  面相规则: ${Math.min(i + 50, allFaceRules.length)}/${allFaceRules.length}`);
  }

  // ==================== 手相规则 (348条) ====================
  console.log("插入手相规则 (348条)...");
  const allPalmRules = [
    ...palmRulesData,
    ...palmExtendedRulesData,
    ...palmExtraRulesData,
  ];

  for (let i = 0; i < allPalmRules.length; i += 50) {
    const batch = allPalmRules.slice(i, i + 50).map((r) => {
      // 从 featureName 推断 lineName 和 hillName
      let lineName: string | null = null;
      let hillName: string | null = null;

      const lineKeywords = ["生命线", "智慧线", "感情线", "命运线", "太阳线", "健康线", "直觉线", "旅行线", "子女线", "财运线", "婚姻线"];
      const hillKeywords = ["木星丘", "土星丘", "太阳丘", "水星丘", "金星丘", "月丘", "火星丘", "第一火星丘", "第二火星丘"];

      for (const kw of lineKeywords) {
        if (r.featureName.includes(kw) || (r.category && r.category.includes(kw))) {
          lineName = kw;
          break;
        }
      }
      for (const kw of hillKeywords) {
        if (r.featureName.includes(kw) || (r.category && r.category.includes(kw))) {
          hillName = kw;
          break;
        }
      }

      // 从 category 推断
      if (!lineName && !hillName) {
        if (r.category === "主线" || r.category === "辅助线") {
          const match = r.featureName.match(/(生命线|智慧线|感情线|命运线|太阳线|健康线|直觉线|旅行线|子女线|财运线|婚姻线)/);
          if (match) lineName = match[1];
        } else if (r.category === "丘位") {
          const match = r.featureName.match(/(木星丘|土星丘|太阳丘|水星丘|金星丘|月丘|火星丘)/);
          if (match) hillName = match[1];
        }
      }

      return {
        lineName,
        hillName,
        featureName: r.featureName,
        conditionOperator: r.conditionOperator,
        conditionValue: r.conditionValue,
        score: r.score,
        interpretation: r.interpretation,
        category: r.category,
      };
    });
    await db.insert(palmRules).values(batch);
    console.log(`  手相规则: ${Math.min(i + 50, allPalmRules.length)}/${allPalmRules.length}`);
  }

  // ==================== 风水规则 (370条) ====================
  console.log("插入风水规则 (370条)...");
  const allFengshuiRules = [
    ...fengshuiRulesData,
    ...fengshuiExtendedRulesData,
    ...fengshuiExtraRulesData,
  ];

  for (let i = 0; i < allFengshuiRules.length; i += 50) {
    const batch = allFengshuiRules.slice(i, i + 50).map((r) => {
      // 1. 转换 roomType：中文 → 英文，"通用" 设为 null 以匹配所有房间
      const englishRoomType = r.roomType === "通用" ? null : (ROOM_TYPE_MAP[r.roomType] || r.roomType);

      // 2. 转换 conditionValue：0-1 → 0-100，between 分隔符 - → ,
      const convertedValue = convertFengshuiConditionValue(r.conditionOperator, r.conditionValue);

      return {
        roomType: englishRoomType,
        category: r.category,
        ruleName: r.featureName,           // featureName → ruleName
        conditionType: r.conditionOperator, // conditionOperator → conditionType
        conditionValue: convertedValue,
        score: r.score,
        interpretation: r.interpretation,
        suggestion: r.remedy || null,       // remedy → suggestion
      };
    });
    await db.insert(fengshuiRules).values(batch);
    console.log(`  风水规则: ${Math.min(i + 50, allFengshuiRules.length)}/${allFengshuiRules.length}`);
  }

  console.log("\n=== 规则初始化完成 ===");
  console.log(`面相规则: ${allFaceRules.length} 条`);
  console.log(`手相规则: ${allPalmRules.length} 条`);
  console.log(`风水规则: ${allFengshuiRules.length} 条`);
  console.log(`总计: ${allFaceRules.length + allPalmRules.length + allFengshuiRules.length} 条`);

  process.exit(0);
}

seedFortuneRules().catch((err) => {
  console.error("规则初始化失败:", err);
  process.exit(1);
});
