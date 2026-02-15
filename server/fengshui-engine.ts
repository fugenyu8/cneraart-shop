import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { fengshuiRules } from "../drizzle/schema";

/**
 * 房间特征数据结构
 */
export interface RoomFeatures {
  roomType: string; // living_room, bedroom, study, kitchen, etc.
  direction?: string; // north, south, east, west, etc.
  
  // 布局特征
  bed_direction?: string;
  bed_facing_door?: boolean;
  bed_facing_window?: boolean;
  beam_above_bed?: boolean;
  sofa_against_wall?: boolean;
  wealth_position_bright?: boolean;
  stove_facing_sink?: boolean;
  desk_direction?: string;
  desk_against_wall?: boolean;
  
  // 色彩特征
  dominant_color?: string;
  color_balance?: string; // balanced, unbalanced
  
  // 家具特征
  has_nightstand?: boolean;
  mirror_facing_bed?: boolean;
  coffee_table_size?: string; // appropriate, too_large, too_small
  
  // 装饰特征
  plant_at_wealth_position?: boolean;
  has_water_feature?: boolean;
  plant_count?: number;
  has_sharp_corners?: boolean;
  has_wenchang_tower?: boolean;
  
  // 环境特征
  lighting_quality?: string; // good, moderate, poor
  ventilation_quality?: string; // good, moderate, poor
}

/**
 * 单项分析结果
 */
export interface AnalysisItem {
  category: string;
  title: string;
  score: number;
  interpretation: string;
  suggestion?: string;
}

/**
 * 风水计算结果
 */
export interface FengshuiCalculationResult {
  overallScore: number;
  items: AnalysisItem[];
  positiveCount: number;
  negativeCount: number;
}

/**
 * 计算房间风水
 */
export async function calculateRoomFengshui(
  features: RoomFeatures
): Promise<FengshuiCalculationResult> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // 获取所有适用的规则
  const allRules = await db.select().from(fengshuiRules);
  
  // 过滤适用于当前房间类型的规则
  const applicableRules = allRules.filter(rule => 
    rule.roomType === null || rule.roomType === features.roomType
  );

  const matchedItems: AnalysisItem[] = [];
  let totalScore = 0;
  let positiveCount = 0;
  let negativeCount = 0;

  // 遍历规则进行匹配
  for (const rule of applicableRules) {
    const featureValue = (features as any)[rule.ruleName];
    
    // 如果特征不存在,跳过
    if (featureValue === undefined || featureValue === null) {
      continue;
    }

    let isMatched = false;

    // 根据条件运算符判断是否匹配
    switch (rule.conditionType) {
      case "=":
        isMatched = String(featureValue) === rule.conditionValue;
        break;
      case ">":
        isMatched = Number(featureValue) > Number(rule.conditionValue);
        break;
      case "<":
        isMatched = Number(featureValue) < Number(rule.conditionValue);
        break;
      case ">=":
        isMatched = Number(featureValue) >= Number(rule.conditionValue);
        break;
      case "<=":
        isMatched = Number(featureValue) <= Number(rule.conditionValue);
        break;
      case "in":
        const values = rule.conditionValue.split(",");
        isMatched = values.includes(String(featureValue));
        break;
      case "contains":
        isMatched = String(featureValue).includes(rule.conditionValue);
        break;
      default:
        break;
    }

    // 如果匹配,记录结果
    if (isMatched) {
      matchedItems.push({
        category: rule.category,
        title: rule.ruleName,
        score: rule.score,
        interpretation: rule.interpretation,
        suggestion: rule.suggestion || undefined,
      });

      totalScore += rule.score;
      
      if (rule.score > 0) {
        positiveCount++;
      } else if (rule.score < 0) {
        negativeCount++;
      }
    }
  }

  // 按评分排序
  matchedItems.sort((a: any, b: any) => {
    return Math.abs(b.score) - Math.abs(a.score); // 评分绝对值大的在前
  });

  // 归一化总分到0-100范围
  // 假设最好情况总分约为150,最差情况约为-150
  const normalizedScore = Math.max(0, Math.min(100, 50 + (totalScore / 3)));

  return {
    overallScore: Math.round(normalizedScore),
    items: matchedItems,
    positiveCount,
    negativeCount,
  };
}

/**
 * 生成默认解读(当AI调用失败时使用)
 */
export function generateDefaultFengshuiInterpretation(
  calculationResult: FengshuiCalculationResult,
  roomType: string
): {
  overallSummary: string;
  sections: Array<{
    title: string;
    content: string;
    score: number;
    suggestion?: string;
  }>;
  suggestions: string[];
} {
  const roomTypeNames: Record<string, string> = {
    living_room: "客厅",
    bedroom: "卧室",
    study: "书房",
    kitchen: "厨房",
    dining_room: "餐厅",
    bathroom: "卫生间",
  };

  const roomName = roomTypeNames[roomType] || "房间";
  const score = calculationResult.overallScore;

  // 生成综合总结
  let overallSummary = `您的${roomName}风水整体评分为${score}分。`;
  
  if (score >= 80) {
    overallSummary += `风水布局非常理想,多个方面符合传统风水理论,有利于提升运势和生活品质。`;
  } else if (score >= 60) {
    overallSummary += `风水布局基本合理,部分方面有待改善,建议参考以下建议进行优化。`;
  } else {
    overallSummary += `风水布局存在一些问题,建议尽快调整,以改善运势和生活环境。`;
  }

  if (calculationResult.positiveCount > 0) {
    overallSummary += `您的${roomName}有${calculationResult.positiveCount}处符合风水吉相,`;
  }
  if (calculationResult.negativeCount > 0) {
    overallSummary += `有${calculationResult.negativeCount}处需要注意的问题。`;
  }

  // 生成分项解读
  const sections = calculationResult.items.map(item => ({
    title: item.title,
    content: item.interpretation,
    score: item.score > 0 ? 100 : item.score < 0 ? 40 : 70,
    suggestion: item.suggestion,
  }));

  // 收集改善建议
  const suggestions = calculationResult.items
    .filter(item => item.suggestion)
    .map(item => item.suggestion!);

  return {
    overallSummary,
    sections,
    suggestions,
  };
}

/**
 * 房间类型中文名称映射
 */
export const ROOM_TYPE_NAMES: Record<string, string> = {
  living_room: "客厅",
  bedroom: "卧室",
  study: "书房",
  kitchen: "厨房",
  dining_room: "餐厅",
  bathroom: "卫生间",
};

/**
 * 方位中文名称映射
 */
export const DIRECTION_NAMES: Record<string, string> = {
  north: "北",
  south: "南",
  east: "东",
  west: "西",
  northeast: "东北",
  northwest: "西北",
  southeast: "东南",
  southwest: "西南",
};
