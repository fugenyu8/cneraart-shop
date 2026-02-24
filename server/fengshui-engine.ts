import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { fengshuiRules } from "../drizzle/schema";

/**
 * 房间特征数据结构 - 使用中文特征名，与规则库统一
 * 所有数值范围 0-100
 */
export interface RoomFeatures {
  roomType: string;
  direction?: string;

  // ============= 通用特征 =============
  // 光照与环境
  自然采光度?: number;
  亮度?: number;
  空气流通度?: number;
  通风度?: number;
  安静度?: number;

  // 色彩
  色调温暖度?: number;
  色彩和谐度?: number;
  色彩饱和度?: number;
  暖色比例?: number;
  冷色比例?: number;
  红色比例?: number;
  绿色比例?: number;
  光影平衡度?: number;
  对比度?: number;
  自然光比例?: number;

  // 空间
  空间开阔度?: number;
  空间比例和谐度?: number;
  空间大小适宜度?: number;
  整洁度?: number;
  整洁有序度?: number;
  杂物堆积度?: number;
  视野开阔度?: number;

  // 植物与装饰
  植物覆盖率?: number;
  植物生机度?: number;
  绿植丰富度?: number;
  纹理复杂度?: number;

  // 五行元素
  木元素比例?: number;
  火元素比例?: number;
  土元素比例?: number;
  金元素比例?: number;
  水元素比例?: number;
  五行平衡度?: number;
  阴阳平衡度?: number;

  // 煞气指标
  尖角煞指数?: number;
  穿堂煞指数?: number;
  门冲煞指数?: number;
  镜面煞指数?: number;
  梁压煞指数?: number;
  天斩煞指数?: number;
  反弓煞指数?: number;
  电磁干扰指数?: number;

  // 财位
  财位明亮度?: number;
  财位整洁度?: number;
  财位有靠度?: number;
  财位植物生机?: number;

  // 桃花位
  桃花位能量?: number;
  桃花位花卉度?: number;

  // 文昌位
  文昌位能量?: number;
  文昌位书籍度?: number;

  // 玄关
  玄关设置度?: number;
  玄关明亮度?: number;
  气口通畅度?: number;

  // 八卦方位能量
  乾位能量?: number;
  坤位能量?: number;
  震位能量?: number;
  巽位能量?: number;
  坎位能量?: number;
  离位能量?: number;
  艮位能量?: number;
  兑位能量?: number;

  // 整体
  整体气场和谐度?: number;
  吉祥物摆放合理度?: number;

  // ============= 客厅特有 =============
  沙发靠墙度?: number;
  电视墙和谐度?: number;

  // ============= 卧室特有 =============
  床头朝向吉度?: number;
  床位靠墙度?: number;
  床对门指数?: number;
  床对窗指数?: number;

  // ============= 书房特有 =============
  书桌朝向吉度?: number;
  朝向吉度?: number;

  // ============= 厨房特有 =============
  灶台位置吉度?: number;
  灶台对门指数?: number;
  水火相冲指数?: number;
  冰箱位置吉度?: number;

  // ============= 卫生间特有 =============
  马桶位置吉度?: number;
  干湿分离度?: number;
  位置吉度?: number;

  // ============= 餐厅特有 =============

  // 允许动态属性
  [key: string]: any;
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
  fiveElements: {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
    balance: number; // 0-100 平衡度分数
    balanceDescription: string; // 文字描述
  };
  baguaEnergy: {
    qian: number;
    kun: number;
    zhen: number;
    xun: number;
    kan: number;
    li: number;
    gen: number;
    dui: number;
  };
  shaQiItems: AnalysisItem[];
  wealthPosition: { score: number; description: string };
  peachBlossom: { score: number; description: string };
  wenChang: { score: number; description: string };
}

/**
 * 计算房间风水 - 增强版
 */
export async function calculateRoomFengshui(
  features: RoomFeatures
): Promise<FengshuiCalculationResult> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // 获取所有规则
  const allRules = await db.select().from(fengshuiRules);

  // 过滤适用于当前房间类型的规则
  const applicableRules = allRules.filter(
    (rule) => rule.roomType === null || rule.roomType === features.roomType
  );

  const matchedItems: AnalysisItem[] = [];
  const shaQiItems: AnalysisItem[] = [];
  let totalScore = 0;
  let positiveCount = 0;
  let negativeCount = 0;

  // 遍历规则进行匹配
  for (const rule of applicableRules) {
    const featureValue = features[rule.ruleName];

    // 如果特征不存在，跳过
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
      case "between": {
        const [min, max] = rule.conditionValue.split(",").map(Number);
        const val = Number(featureValue);
        isMatched = val >= min && val <= max;
        break;
      }
      case "in": {
        const values = rule.conditionValue.split(",");
        isMatched = values.includes(String(featureValue));
        break;
      }
      case "contains":
        isMatched = String(featureValue).includes(rule.conditionValue);
        break;
      default:
        break;
    }

    // 如果匹配，记录结果
    if (isMatched) {
      const item: AnalysisItem = {
        category: rule.category,
        title: rule.ruleName,
        score: rule.score,
        interpretation: rule.interpretation,
        suggestion: rule.suggestion || undefined,
      };

      matchedItems.push(item);
      totalScore += rule.score;

      if (rule.score > 0) {
        positiveCount++;
      } else if (rule.score < 0) {
        negativeCount++;
        // 煞气类规则单独收集
        if (rule.ruleName.includes("煞")) {
          shaQiItems.push(item);
        }
      }
    }
  }

  // 按评分绝对值排序
  matchedItems.sort((a, b) => Math.abs(b.score) - Math.abs(a.score));

  // 归一化总分到 0-100 范围
  const maxPossibleScore = applicableRules.reduce(
    (sum, r) => sum + Math.max(0, r.score),
    0
  );
  const minPossibleScore = applicableRules.reduce(
    (sum, r) => sum + Math.min(0, r.score),
    0
  );
  const range = maxPossibleScore - minPossibleScore;
  const normalizedScore =
    range > 0
      ? Math.round(((totalScore - minPossibleScore) / range) * 100)
      : 50;

  // 五行分析
  const fiveElements = calculateFiveElements(features);

  // 八卦方位能量
  const baguaEnergy = calculateBaguaEnergy(features);

  // 财位分析
  const wealthPosition = analyzeWealthPosition(features);

  // 桃花位分析
  const peachBlossom = analyzePeachBlossom(features);

  // 文昌位分析
  const wenChang = analyzeWenChang(features);

  return {
    overallScore: Math.max(0, Math.min(100, normalizedScore)),
    items: matchedItems,
    positiveCount,
    negativeCount,
    fiveElements,
    baguaEnergy,
    shaQiItems,
    wealthPosition,
    peachBlossom,
    wenChang,
  };
}

/**
 * 计算五行平衡
 */
function calculateFiveElements(features: RoomFeatures) {
  const wood = features.木元素比例 ?? 50;
  const fire = features.火元素比例 ?? 50;
  const earth = features.土元素比例 ?? 50;
  const metal = features.金元素比例 ?? 50;
  const water = features.水元素比例 ?? 50;

  const avg = (wood + fire + earth + metal + water) / 5;
  const variance =
    ((wood - avg) ** 2 +
      (fire - avg) ** 2 +
      (earth - avg) ** 2 +
      (metal - avg) ** 2 +
      (water - avg) ** 2) /
    5;
  const stdDev = Math.sqrt(variance);

  let balance: string;
  if (stdDev < 10) {
    balance = "五行均衡，气场和谐";
  } else if (stdDev < 20) {
    balance = "五行略有偏差，整体尚可";
  } else if (stdDev < 30) {
    balance = "五行失衡，需要调整";
  } else {
    balance = "五行严重失衡，亟需化解";
  }

  // 找出最强和最弱的元素
  const elements = { 木: wood, 火: fire, 土: earth, 金: metal, 水: water };
  const sorted = Object.entries(elements).sort((a, b) => b[1] - a[1]);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  if (strongest[1] - weakest[1] > 30) {
    balance += `。${strongest[0]}气过旺（${Math.round(strongest[1])}），${weakest[0]}气不足（${Math.round(weakest[1])}），建议增补${weakest[0]}元素`;
  }

  // 计算平衡度分数（0-100）
  const balanceScore = Math.max(0, Math.min(100, Math.round(100 - stdDev * 2.5)));

  return { wood, fire, earth, metal, water, balance: balanceScore, balanceDescription: balance };
}

/**
 * 计算八卦方位能量
 */
function calculateBaguaEnergy(features: RoomFeatures) {
  return {
    qian: features.乾位能量 ?? 50,
    kun: features.坤位能量 ?? 50,
    zhen: features.震位能量 ?? 50,
    xun: features.巽位能量 ?? 50,
    kan: features.坎位能量 ?? 50,
    li: features.离位能量 ?? 50,
    gen: features.艮位能量 ?? 50,
    dui: features.兑位能量 ?? 50,
  };
}

/**
 * 分析财位
 */
function analyzeWealthPosition(features: RoomFeatures) {
  const brightness = features.财位明亮度 ?? 50;
  const cleanliness = features.财位整洁度 ?? 50;
  const support = features.财位有靠度 ?? 50;
  const plantVitality = features.财位植物生机 ?? 50;

  const score = Math.round(
    brightness * 0.3 + cleanliness * 0.25 + support * 0.25 + plantVitality * 0.2
  );

  let description: string;
  if (score >= 80) {
    description =
      "财位布局极佳，明亮整洁，背后有靠，生机盎然。据《阳宅三要》所载，此等财位格局主财运亨通，正财偏财皆有进益。建议在财位摆放聚宝盆或貔貅，可进一步催旺财运。";
  } else if (score >= 65) {
    description =
      "财位布局良好，基本符合风水要求。财位光线充足，整洁有序，有利于财气聚集。建议适当增添绿植或水晶球，使财运更加旺盛。";
  } else if (score >= 50) {
    description =
      "财位布局一般，有提升空间。建议增加财位的照明，保持整洁，摆放常绿植物如发财树，可有效改善财运。";
  } else {
    description =
      "财位布局需要改善。财位可能过暗、杂乱或缺乏生气，这会影响财运的聚集。建议立即清理财位杂物，增加照明，摆放招财植物和吉祥物。";
  }

  return { score, description };
}

/**
 * 分析桃花位
 */
function analyzePeachBlossom(features: RoomFeatures) {
  const energy = features.桃花位能量 ?? 50;
  const flowers = features.桃花位花卉度 ?? 50;

  const score = Math.round(energy * 0.6 + flowers * 0.4);

  let description: string;
  if (score >= 75) {
    description =
      "桃花位能量充沛，花卉摆放得当，有利于人际关系和感情运势。已婚者夫妻和睦，未婚者易遇良缘。";
  } else if (score >= 50) {
    description =
      "桃花位能量一般，建议在桃花位摆放鲜花或粉色水晶，可催旺人缘和感情运势。";
  } else {
    description =
      "桃花位能量不足，可能影响人际关系和感情运势。建议在桃花位摆放桃花、玫瑰等鲜花，或粉色系装饰品，以催旺桃花运。";
  }

  return { score, description };
}

/**
 * 分析文昌位
 */
function analyzeWenChang(features: RoomFeatures) {
  const energy = features.文昌位能量 ?? 50;
  const books = features.文昌位书籍度 ?? 50;

  const score = Math.round(energy * 0.6 + books * 0.4);

  let description: string;
  if (score >= 75) {
    description =
      "文昌位能量旺盛，书籍摆放有序，有利于学业和事业发展。据《三元总录》所载，文昌位得力者，主聪明好学，考试顺利，事业有成。";
  } else if (score >= 50) {
    description =
      "文昌位能量一般，建议在文昌位摆放文昌塔、四支毛笔或文房四宝，可催旺文昌运，有利于学业和事业。";
  } else {
    description =
      "文昌位能量不足，可能影响学业和事业运势。建议在文昌位增加照明，摆放文昌塔或四支富贵竹，以催旺文昌运。";
  }

  return { score, description };
}

/**
 * 生成默认解读（当分析失败时使用）
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
  const roomName = ROOM_TYPE_NAMES[roomType] || "房间";
  const score = calculationResult.overallScore;

  let overallSummary = `您的${roomName}风水整体评分为${score}分。`;

  if (score >= 80) {
    overallSummary += `风水布局非常理想，多个方面符合传统风水理论，有利于提升运势和生活品质。`;
  } else if (score >= 60) {
    overallSummary += `风水布局基本合理，部分方面有待改善，建议参考以下建议进行优化。`;
  } else {
    overallSummary += `风水布局存在一些问题，建议尽快调整，以改善运势和生活环境。`;
  }

  if (calculationResult.positiveCount > 0) {
    overallSummary += `您的${roomName}有${calculationResult.positiveCount}处符合风水吉相，`;
  }
  if (calculationResult.negativeCount > 0) {
    overallSummary += `有${calculationResult.negativeCount}处需要注意的问题。`;
  }

  const sections = calculationResult.items.map((item) => ({
    title: item.title,
    content: item.interpretation,
    score: item.score > 0 ? 100 : item.score < 0 ? 40 : 70,
    suggestion: item.suggestion,
  }));

  const suggestions = calculationResult.items
    .filter((item) => item.suggestion)
    .map((item) => item.suggestion!);

  return { overallSummary, sections, suggestions };
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
  balcony: "阳台",
  entrance: "玄关",
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
