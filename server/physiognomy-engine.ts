import { getFaceRules, getPalmRules } from "./db";

/**
 * 命理计算引擎 - 核心逻辑（增强版）
 * 规则库 score 范围：-10 到 +10
 * 输出评分范围：0-100（归一化百分制）
 * 归一化公式：outputScore = (ruleScore + 10) / 20 * 100 = (ruleScore + 10) * 5
 */

interface FeatureParam {
  [key: string]: number | string;
}

interface PalaceFeatures {
  [palaceName: string]: FeatureParam;
}

interface LineFeatures {
  [lineName: string]: FeatureParam;
}

interface HillFeatures {
  [hillName: string]: FeatureParam;
}

interface FaceFeatures {
  faceType?: string;
  palaces: PalaceFeatures;
}

interface PalmFeatures {
  handType?: string;
  lines: LineFeatures;
  hills: HillFeatures;
}

export interface CalculationResult {
  [key: string]: {
    score: number;        // 0-100 百分制
    rawScore: number;     // -10 到 +10 原始分
    category: string;     // 大吉/吉/中吉/平/小凶/凶
    level: number;        // 1-6 等级
    matchedCount: number; // 匹配的规则数
    interpretations: string[];
    categories: string[]; // 匹配规则的分类标签
  };
}

/**
 * 将规则原始分（-10到+10）归一化为百分制（0-100）
 */
function normalizeScore(rawScore: number): number {
  return Math.round(Math.max(0, Math.min(100, (rawScore + 10) * 5)));
}

/**
 * 根据百分制评分判断吉凶等级
 */
function getCategory(score: number): { category: string; level: number } {
  if (score >= 90) return { category: "大吉", level: 6 };
  if (score >= 75) return { category: "吉", level: 5 };
  if (score >= 65) return { category: "中吉", level: 4 };
  if (score >= 50) return { category: "平", level: 3 };
  if (score >= 35) return { category: "小凶", level: 2 };
  return { category: "凶", level: 1 };
}

/**
 * 检查特征值是否满足规则条件
 */
function matchCondition(
  value: number | string,
  operator: string,
  conditionValue: string
): boolean {
  if (typeof value === "string") {
    return operator === "=" && value === conditionValue;
  }

  const numValue = Number(value);
  if (isNaN(numValue)) return false;

  switch (operator) {
    case ">":
      return numValue > Number(conditionValue);
    case "<":
      return numValue < Number(conditionValue);
    case "=":
      return Math.abs(numValue - Number(conditionValue)) < 0.001;
    case ">=":
      return numValue >= Number(conditionValue);
    case "<=":
      return numValue <= Number(conditionValue);
    case "between": {
      const parts = conditionValue.split("-").map(Number);
      if (parts.length !== 2) return false;
      const [min, max] = parts;
      return numValue >= min && numValue <= max;
    }
    default:
      return false;
  }
}

/**
 * 面相计算引擎（增强版）
 * 支持十二宫位 + 扩展维度（三停/五岳/人中/四渎/对称性/气色/法令纹/流年运/特殊格局/耳相/额纹）
 */
export async function calculateFacePhysiognomy(
  features: FaceFeatures
): Promise<CalculationResult> {
  const rules = await getFaceRules();
  const result: CalculationResult = {};

  if (!features.palaces || typeof features.palaces !== "object") {
    return result;
  }

  // 遍历每个宫位/维度的特征
  for (const [palaceName, palaceFeatures] of Object.entries(features.palaces)) {
    const matchedRules: Array<{
      score: number;
      interpretation: string;
      category: string;
    }> = [];

    // 查找匹配的规则
    for (const rule of rules) {
      if (rule.palaceName !== palaceName) continue;

      const featureValue = palaceFeatures[rule.featureName];
      if (featureValue === undefined) continue;

      if (
        matchCondition(featureValue, rule.conditionOperator, rule.conditionValue)
      ) {
        matchedRules.push({
          score: rule.score,
          interpretation: rule.interpretation,
          category: rule.category || "综合",
        });
      }
    }

    // 计算评分和解读
    if (matchedRules.length > 0) {
      // 加权平均：取所有匹配规则的平均分
      const totalRawScore = matchedRules.reduce((sum, r) => sum + r.score, 0);
      const avgRawScore = totalRawScore / matchedRules.length;
      const normalizedScore = normalizeScore(avgRawScore);
      const { category, level } = getCategory(normalizedScore);

      // 收集所有分类标签
      const categories = Array.from(new Set(matchedRules.map((r) => r.category)));

      result[palaceName] = {
        score: normalizedScore,
        rawScore: parseFloat(avgRawScore.toFixed(1)),
        category,
        level,
        matchedCount: matchedRules.length,
        interpretations: matchedRules.map((r) => r.interpretation),
        categories,
      };
    } else {
      // 没有匹配规则时，给一个中等默认值
      result[palaceName] = {
        score: 65,
        rawScore: 3,
        category: "中吉",
        level: 4,
        matchedCount: 0,
        interpretations: [`${palaceName}整体表现平稳，无明显吉凶特征，运势平和。`],
        categories: ["综合"],
      };
    }
  }

  return result;
}

/**
 * 手相计算引擎（增强版）
 * 支持五大主线 + 辅助线 + 八大丘位 + 手型五行 + 特殊纹路
 */
export async function calculatePalmPhysiognomy(
  features: PalmFeatures
): Promise<CalculationResult> {
  const rules = await getPalmRules();
  const result: CalculationResult = {};

  // 处理纹路特征（主线 + 辅助线）
  if (features.lines && typeof features.lines === "object") {
    for (const [lineName, lineFeatures] of Object.entries(features.lines)) {
      const matchedRules: Array<{
        score: number;
        interpretation: string;
        category: string;
      }> = [];

      for (const rule of rules) {
        // 匹配 lineName 或 hillName（兼容两种字段）
        if (rule.lineName !== lineName && rule.hillName !== lineName) continue;

        const featureValue = lineFeatures[rule.featureName];
        if (featureValue === undefined) continue;

        if (
          matchCondition(
            featureValue,
            rule.conditionOperator,
            rule.conditionValue
          )
        ) {
          matchedRules.push({
            score: rule.score,
            interpretation: rule.interpretation,
            category: rule.category || "综合",
          });
        }
      }

      if (matchedRules.length > 0) {
        const totalRawScore = matchedRules.reduce((sum, r) => sum + r.score, 0);
        const avgRawScore = totalRawScore / matchedRules.length;
        const normalizedScore = normalizeScore(avgRawScore);
        const { category, level } = getCategory(normalizedScore);
        const categories = Array.from(new Set(matchedRules.map((r) => r.category)));

        result[lineName] = {
          score: normalizedScore,
          rawScore: parseFloat(avgRawScore.toFixed(1)),
          category,
          level,
          matchedCount: matchedRules.length,
          interpretations: matchedRules.map((r) => r.interpretation),
          categories,
        };
      } else {
        result[lineName] = {
          score: 65,
          rawScore: 3,
          category: "中吉",
          level: 4,
          matchedCount: 0,
          interpretations: [`${lineName}整体表现平稳，纹路清晰，运势平和。`],
          categories: ["综合"],
        };
      }
    }
  }

  // 处理丘位特征
  if (features.hills && typeof features.hills === "object") {
    for (const [hillName, hillFeatures] of Object.entries(features.hills)) {
      const matchedRules: Array<{
        score: number;
        interpretation: string;
        category: string;
      }> = [];

      for (const rule of rules) {
        if (rule.hillName !== hillName && rule.lineName !== hillName) continue;

        const featureValue = hillFeatures[rule.featureName];
        if (featureValue === undefined) continue;

        if (
          matchCondition(
            featureValue,
            rule.conditionOperator,
            rule.conditionValue
          )
        ) {
          matchedRules.push({
            score: rule.score,
            interpretation: rule.interpretation,
            category: rule.category || "综合",
          });
        }
      }

      if (matchedRules.length > 0) {
        const totalRawScore = matchedRules.reduce((sum, r) => sum + r.score, 0);
        const avgRawScore = totalRawScore / matchedRules.length;
        const normalizedScore = normalizeScore(avgRawScore);
        const { category, level } = getCategory(normalizedScore);
        const categories = Array.from(new Set(matchedRules.map((r) => r.category)));

        result[hillName] = {
          score: normalizedScore,
          rawScore: parseFloat(avgRawScore.toFixed(1)),
          category,
          level,
          matchedCount: matchedRules.length,
          interpretations: matchedRules.map((r) => r.interpretation),
          categories,
        };
      } else {
        result[hillName] = {
          score: 65,
          rawScore: 3,
          category: "中吉",
          level: 4,
          matchedCount: 0,
          interpretations: [`${hillName}丘位饱满度适中，整体运势平稳。`],
          categories: ["综合"],
        };
      }
    }
  }

  return result;
}

/**
 * 计算综合评分和运势概览
 */
export function calculateOverallScore(
  calculationResult: CalculationResult
): {
  overallScore: number;
  overallCategory: string;
  overallLevel: number;
  dimensionCount: number;
  topDimensions: Array<{ name: string; score: number; category: string }>;
  weakDimensions: Array<{ name: string; score: number; category: string }>;
  categoryDistribution: Record<string, number>;
} {
  const entries = Object.entries(calculationResult);
  if (entries.length === 0) {
    return {
      overallScore: 65,
      overallCategory: "中吉",
      overallLevel: 4,
      dimensionCount: 0,
      topDimensions: [],
      weakDimensions: [],
      categoryDistribution: {},
    };
  }

  // 加权平均（十二宫位权重更高）
  const mainPalaces = [
    "命宫", "财帛宫", "官禄宫", "田宅宫", "妻妾宫", "儿女宫",
    "兄弟宫", "福德宫", "迁移宫", "疾厄宫", "父母宫", "奴仆宫",
    "生命线", "智慧线", "感情线", "命运线", "太阳线",
  ];

  let weightedTotal = 0;
  let weightTotal = 0;

  for (const [name, data] of entries) {
    const weight = mainPalaces.includes(name) ? 2 : 1;
    weightedTotal += data.score * weight;
    weightTotal += weight;
  }

  const overallScore = Math.round(weightedTotal / weightTotal);
  const { category: overallCategory, level: overallLevel } = getCategory(overallScore);

  // 排序找出最强和最弱维度
  const sorted = entries
    .map(([name, data]) => ({ name, score: data.score, category: data.category }))
    .sort((a, b) => b.score - a.score);

  const topDimensions = sorted.slice(0, 5);
  const weakDimensions = sorted.slice(-3).reverse();

  // 吉凶分布统计
  const categoryDistribution: Record<string, number> = {};
  for (const [, data] of entries) {
    categoryDistribution[data.category] = (categoryDistribution[data.category] || 0) + 1;
  }

  return {
    overallScore,
    overallCategory,
    overallLevel,
    dimensionCount: entries.length,
    topDimensions,
    weakDimensions,
    categoryDistribution,
  };
}

/**
 * 生成默认解读（当报告模板引擎失败时使用）
 */
export function generateDefaultInterpretation(
  calculationResult: CalculationResult,
  serviceType: "face" | "palm"
): { overallSummary: string; sections: any[] } {
  const overall = calculateOverallScore(calculationResult);
  const sections = [];

  // 按分数排序生成章节
  const sorted = Object.entries(calculationResult).sort(
    (a, b) => b[1].score - a[1].score
  );

  for (const [name, data] of sorted) {
    sections.push({
      title: `${name}分析`,
      content: data.interpretations.join("。") + "。",
      score: data.score,
      category: data.category,
    });
  }

  // 根据综合评分生成总结
  let overallSummary = "";
  const topNames = overall.topDimensions.slice(0, 3).map((d) => d.name).join("、");
  const weakNames = overall.weakDimensions.map((d) => d.name).join("、");

  if (serviceType === "face") {
    if (overall.overallScore >= 80) {
      overallSummary = `综合面相评分${overall.overallScore}分，整体呈现${overall.overallCategory}之相。您的${topNames}等宫位表现尤为突出，预示着运势亨通，前程似锦。面相五官端正，气色明润，主人聪慧过人，心胸开阔。在事业、财运、感情等方面均有良好的发展潜力。建议保持积极心态，善于把握机遇，必能成就一番事业。`;
    } else if (overall.overallScore >= 65) {
      overallSummary = `综合面相评分${overall.overallScore}分，整体呈现${overall.overallCategory}之相。您的${topNames}等宫位表现较好，整体运势平稳向上。面相显示您性格稳重，做事踏实，虽然${weakNames}等方面需要注意，但只要持之以恒，必能积累财富，成就事业。建议在稳健的基础上适当开拓进取。`;
    } else if (overall.overallScore >= 50) {
      overallSummary = `综合面相评分${overall.overallScore}分，整体呈现${overall.overallCategory}之相。面相各宫位表现较为均衡，${topNames}等方面有一定优势，但${weakNames}等方面需要特别留意。建议调整心态，积极面对挑战，通过自身努力改善运势。多行善积德，广结善缘，运势自然好转。`;
    } else {
      overallSummary = `综合面相评分${overall.overallScore}分，部分宫位需要注意调整。${weakNames}等方面显示近期可能面临一些挑战，但命运掌握在自己手中。建议保持乐观心态，注意身体健康，多与贵人交往。通过修身养性、积善行德，完全可以改善运势，创造美好未来。`;
    }
  } else {
    if (overall.overallScore >= 80) {
      overallSummary = `综合手相评分${overall.overallScore}分，整体呈现${overall.overallCategory}之相。您的${topNames}等纹路/丘位表现优秀，预示着健康长寿、事业有成、感情美满。掌纹清晰有力，生命力旺盛，智慧超群，在人生各个领域都有望取得不俗成就。建议继续保持积极心态，勇往直前。`;
    } else if (overall.overallScore >= 65) {
      overallSummary = `综合手相评分${overall.overallScore}分，整体呈现${overall.overallCategory}之相。您的${topNames}等方面表现较好，整体运势平稳。掌纹显示您性格稳重，做事有条理，${weakNames}等方面虽需注意，但只要持之以恒，必能积累财富。建议在稳健基础上适当开拓进取。`;
    } else if (overall.overallScore >= 50) {
      overallSummary = `综合手相评分${overall.overallScore}分，整体呈现${overall.overallCategory}之相。手相各纹路和丘位表现较为均衡，${topNames}等方面有一定优势。建议注意${weakNames}等方面的调养，保持良好的生活习惯，运势将逐步提升。`;
    } else {
      overallSummary = `综合手相评分${overall.overallScore}分，部分纹路和丘位需要注意。建议在生活中多加留意，调整心态，积极面对挑战。命运掌握在自己手中，通过努力和智慧，完全可以改善运势。保持乐观，勤奋进取，善待他人。`;
    }
  }

  return {
    overallSummary,
    sections,
  };
}
