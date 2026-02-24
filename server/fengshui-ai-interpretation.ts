/**
 * 风水解读报告生成 - 本地模板引擎
 * 完全本地运行，不依赖任何外部 LLM API
 * 根据风水计算结果匹配预设的解读文案库，组合生成完整报告
 */

import type { FengshuiCalculationResult } from "./fengshui-engine";
import { ROOM_TYPE_NAMES } from "./fengshui-engine";

// ============= 风水解读文案库 =============

/**
 * 综合总结模板 - 五台山大师风格
 */
const OVERALL_TEMPLATES: Record<string, Record<string, string[]>> = {
  living_room: {
    excellent: [
      "老夫观此客厅布局，甚感欣慰。据八宅风水所载，此间格局方正，气场流通，实为上佳之局。客厅乃一家之主堂，聚气纳福之所，您的客厅{positiveCount}处合乎风水吉相，整体评分高达{score}分。财位明亮通透，沙发靠墙而设，此为\"背有靠山\"之格，主事业稳固，贵人相助。五行之气在此间流转自如，阴阳调和，实为难得。老夫建议继续保持此等布局，适当点缀绿植和流水摆件，可使气场更加旺盛，家运昌隆。",
    ],
    good: [
      "老夫细观此客厅风水，整体格局尚佳，评分{score}分，有{positiveCount}处吉相。客厅为家宅之心脏，气运汇聚之地。您的客厅布局基本合理，多数方面符合传统风水理论。然仍有{negativeCount}处需要调整，以臻完美。古语云:\"明堂宜宽阔，暗室宜紧凑\"，建议在保持现有优势的基础上，对不足之处加以改善，家运将更加兴旺。",
    ],
    average: [
      "老夫观此客厅布局，喜忧参半。整体评分{score}分，有{positiveCount}处吉相，{negativeCount}处需改善。客厅风水关乎全家运势，不可不慎。目前的布局虽无大碍，但仍有提升空间。据玄空飞星理论，适当调整家具摆放和色彩搭配，可有效改善气场。老夫建议逐步调整，不必急于一时，循序渐进，方能收到良效。",
    ],
    poor: [
      "老夫观此客厅风水，发现{negativeCount}处需要注意的问题，整体评分{score}分。但施主不必过于忧虑，风水之道在于调和，非一成不变。佛家讲因果，风水亦然——只要用心调整，必能转危为安。老夫将逐一指出问题所在，并给出具体的改善建议。记住，心存善念，广积阴德，是最好的风水。",
    ],
  },
  bedroom: {
    excellent: [
      "老夫观此卧室布局，深感满意。卧室乃休养生息之所，关乎主人的健康和感情运势。您的卧室{positiveCount}处合乎风水吉相，评分高达{score}分。床位安置得当，远离门窗直冲，无横梁压顶之忧，此为安眠养神之佳局。色调柔和温馨，阴阳平衡，有利于夫妻和睦，身心健康。老夫建议保持此等布局，晚间可点一盏暖色小灯，更添温馨之气。",
    ],
    good: [
      "老夫细观此卧室风水，整体格局良好，评分{score}分。卧室为阴气汇聚之所，宜静不宜动，宜暗不宜明。您的卧室布局基本得当，有{positiveCount}处吉相。然仍有{negativeCount}处可以优化。古人云:\"卧室安宁，则身心康泰\"，建议对不足之处加以调整，睡眠质量和运势都将有所提升。",
    ],
    average: [
      "老夫观此卧室布局，有喜有忧。评分{score}分，{positiveCount}处吉相，{negativeCount}处需改善。卧室风水直接影响主人的精气神，不可轻视。目前的布局虽无大碍，但若能按照老夫的建议加以调整，睡眠质量和整体运势都将明显改善。",
    ],
    poor: [
      "老夫观此卧室风水，发现{negativeCount}处需要关注的问题。但施主莫要担忧，卧室风水的调整相对简单，只需按照建议逐步改善即可。佛家讲\"心安即是归处\"，先调整心态，再调整环境，双管齐下，效果更佳。",
    ],
  },
  study: {
    excellent: [
      "老夫观此书房布局，甚为赞赏。书房乃文昌之位，主学业事业。您的书房{positiveCount}处合乎风水吉相，评分{score}分。书桌朝向得当，背后有靠，前方开阔，此为\"文昌大开\"之格，主学业有成，事业顺遂。光线充足，空气流通，有利于思维清晰，灵感涌现。老夫建议在书桌上摆放文昌塔或四支毛笔，可进一步催旺文昌运。",
    ],
    good: [
      "老夫细观此书房风水，整体格局不错，评分{score}分。书房为静心修学之所，宜清净雅致。您的书房布局基本合理，有{positiveCount}处吉相。建议在此基础上进一步优化，使文昌运更加旺盛。",
    ],
    average: [
      "老夫观此书房布局，尚有提升空间。评分{score}分，建议按照风水理论进行适当调整，以催旺文昌运，提升学业和事业运势。",
    ],
    poor: [
      "老夫观此书房风水，发现一些需要改善的地方。书房风水对学业和事业影响甚大，建议尽快按照建议进行调整。",
    ],
  },
  kitchen: {
    excellent: [
      "老夫观此厨房布局，颇为满意。厨房为家宅之灶位，关乎全家的健康和财运。您的厨房{positiveCount}处合乎风水吉相，评分{score}分。灶台与水槽位置得当，火水不相冲，此为\"水火既济\"之格，主家人健康，财运亨通。",
    ],
    good: [
      "老夫细观此厨房风水，整体格局良好，评分{score}分。厨房为养命之源，风水布局不可忽视。您的厨房基本合理，建议在此基础上进一步优化。",
    ],
    average: [
      "老夫观此厨房布局，有待改善之处。评分{score}分，建议注意灶台和水槽的相对位置，避免水火相冲。",
    ],
    poor: [
      "老夫观此厨房风水，发现一些需要注意的问题。厨房风水关乎全家健康，建议尽快调整。",
    ],
  },
};

// 通用房间模板（用于未定义的房间类型）
const GENERIC_TEMPLATES: Record<string, string[]> = {
  excellent: [
    "老夫观此{roomName}布局，整体风水格局优良，评分{score}分，有{positiveCount}处吉相。布局合理，气场流通，阴阳调和，实为上佳之局。建议保持现有布局，适当点缀吉祥物品，运势将更加旺盛。",
  ],
  good: [
    "老夫细观此{roomName}风水，整体格局不错，评分{score}分。有{positiveCount}处吉相，{negativeCount}处需优化。建议在保持优势的基础上，对不足之处加以改善。",
  ],
  average: [
    "老夫观此{roomName}布局，喜忧参半，评分{score}分。有{positiveCount}处吉相，{negativeCount}处需改善。建议按照风水理论逐步调整，运势将逐渐好转。",
  ],
  poor: [
    "老夫观此{roomName}风水，发现{negativeCount}处需要关注。但施主不必忧虑，只要按照建议调整，风水格局定能改善。",
  ],
};

// ============= 分项解读文案增强 =============

const CATEGORY_INTROS: Record<string, string> = {
  布局: "据八宅风水所载，室内布局乃风水之根本。",
  色彩: "五行之中，色彩各有所属，对气场影响甚大。",
  装饰: "室内装饰非仅美观之用，更关乎气场之调和。",
  环境: "环境之气，乃风水之本源。光照通风，皆为要务。",
  方位: "方位乃风水之纲领，八卦各有所主，不可不察。",
  家具: "家具摆放，关乎气场流通，不可随意为之。",
};

const POSITIVE_CLOSINGS = [
  "此为上佳之象，宜继续保持。",
  "甚好，此等布局有利于运势提升。",
  "老夫甚感欣慰，此处风水极佳。",
  "此为吉相，主家运昌隆。",
  "布局得当，气场和谐，实为难得。",
];

const NEGATIVE_CLOSINGS = [
  "建议尽早调整，以免影响运势。",
  "此处需要注意，但调整起来并不困难。",
  "老夫建议施主留意此处，适当调整即可。",
  "虽有不足，但通过调整完全可以化解。",
  "建议按照老夫的建议进行改善，运势将好转。",
];

// ============= 改善建议文案库 =============

const GENERAL_SUGGESTIONS: Record<string, string[]> = {
  living_room: [
    "在客厅财位（通常为大门对角线位置）摆放一盆常绿植物，如发财树或金钱树，可催旺财运",
    "客厅宜保持整洁明亮，避免堆放杂物，以利气场流通",
    "可在客厅悬挂山水画，取\"背山面水\"之意，有利于事业和财运",
    "沙发背后宜靠实墙，不宜背对门窗，取\"背有靠山\"之意",
    "客厅灯光宜明亮温暖，避免过暗或过于刺眼的灯光",
  ],
  bedroom: [
    "床头宜靠实墙，不宜悬空或靠窗，取\"背有靠山\"之意",
    "卧室宜选用柔和的暖色调，如米色、浅粉等，有利于睡眠和感情",
    "床头不宜摆放大面积镜子，以免影响睡眠质量",
    "卧室宜保持整洁，不宜堆放过多杂物，以利气场流通",
    "可在床头柜摆放一对鸳鸯或玫瑰花，有利于感情运势",
  ],
  study: [
    "书桌宜面向门口或窗户，取\"明堂开阔\"之意，有利于思维清晰",
    "书房宜选用清新淡雅的色调，如浅绿、浅蓝等，有利于集中注意力",
    "可在书桌上摆放文昌塔或四支毛笔，催旺文昌运",
    "书房宜保持安静整洁，避免过多装饰，以利于静心学习",
    "书架宜靠墙摆放，不宜正对书桌，以免形成压迫感",
  ],
  kitchen: [
    "灶台不宜正对水槽，以免水火相冲，影响家人健康",
    "厨房宜保持通风良好，避免油烟积聚，影响气场",
    "厨房色调宜以暖色为主，如米白、浅黄等，营造温馨氛围",
    "灶台不宜正对厨房门，以免财气外泄",
    "厨房宜保持整洁，餐具归位，以利于健康运势",
  ],
  default: [
    "保持室内整洁明亮，是改善风水的基本功",
    "适当摆放绿色植物，可净化空气，改善气场",
    "注意室内通风，让新鲜空气流通，有利于运势提升",
    "选用和谐的色彩搭配，避免过于刺激的颜色",
    "定期清理不需要的物品，保持空间的通透感",
  ],
};

// ============= 报告生成函数 =============

/**
 * 生成风水解读报告（本地模板引擎）
 */
export async function generateFengshuiAIInterpretation(
  calculationResult: FengshuiCalculationResult,
  roomType: string
): Promise<{
  overallSummary: string;
  sections: Array<{
    title: string;
    content: string;
    score: number;
    suggestion?: string;
  }>;
  suggestions: string[];
}> {
  const roomName = ROOM_TYPE_NAMES[roomType] || "房间";
  const score = calculationResult.overallScore;
  const positiveCount = calculationResult.positiveCount;
  const negativeCount = calculationResult.negativeCount;

  // 1. 生成综合总结
  const overallSummary = generateOverallSummary(
    roomType,
    roomName,
    score,
    positiveCount,
    negativeCount
  );

  // 2. 生成分项解读
  const sections = generateSections(calculationResult.items, roomName);

  // 3. 生成改善建议
  const suggestions = generateSuggestions(
    calculationResult.items,
    roomType,
    negativeCount
  );

  return {
    overallSummary,
    sections,
    suggestions,
  };
}

/**
 * 生成综合总结
 */
function generateOverallSummary(
  roomType: string,
  roomName: string,
  score: number,
  positiveCount: number,
  negativeCount: number
): string {
  // 确定评分等级
  let level: string;
  if (score >= 80) level = "excellent";
  else if (score >= 65) level = "good";
  else if (score >= 50) level = "average";
  else level = "poor";

  // 获取模板
  let templates: string[];
  const roomTemplates = OVERALL_TEMPLATES[roomType];
  if (roomTemplates && roomTemplates[level]) {
    templates = roomTemplates[level];
  } else {
    templates = GENERIC_TEMPLATES[level];
  }

  let template = templates[0];

  // 替换占位符
  template = template
    .replace(/{roomName}/g, roomName)
    .replace(/{score}/g, String(score))
    .replace(/{positiveCount}/g, String(positiveCount))
    .replace(/{negativeCount}/g, String(negativeCount));

  return template;
}

/**
 * 生成分项解读
 */
function generateSections(
  items: FengshuiCalculationResult["items"],
  roomName: string
): Array<{ title: string; content: string; score: number; suggestion?: string }> {
  return items.map((item, index) => {
    // 获取分类引言
    const categoryIntro = CATEGORY_INTROS[item.category] || "";

    // 构建解读内容
    let content = "";

    if (categoryIntro) {
      content += categoryIntro + " ";
    }

    // 添加原始解读
    content += item.interpretation;

    // 添加结尾语
    if (item.score > 0) {
      content += " " + POSITIVE_CLOSINGS[index % POSITIVE_CLOSINGS.length];
    } else if (item.score < 0) {
      content += " " + NEGATIVE_CLOSINGS[index % NEGATIVE_CLOSINGS.length];
    }

    // 将原始分数转换为0-100的评分
    let normalizedScore: number;
    if (item.score > 0) {
      normalizedScore = Math.min(100, 60 + item.score * 2);
    } else if (item.score < 0) {
      normalizedScore = Math.max(10, 50 + item.score * 2);
    } else {
      normalizedScore = 50;
    }

    return {
      title: item.title,
      content,
      score: normalizedScore,
      suggestion: item.suggestion || undefined,
    };
  });
}

/**
 * 生成改善建议
 */
function generateSuggestions(
  items: FengshuiCalculationResult["items"],
  roomType: string,
  negativeCount: number
): string[] {
  const suggestions: string[] = [];

  // 1. 从分析项中收集具体建议
  for (const item of items) {
    if (item.suggestion && item.score < 0) {
      suggestions.push(item.suggestion);
    }
  }

  // 2. 补充通用建议
  const generalSugs = GENERAL_SUGGESTIONS[roomType] || GENERAL_SUGGESTIONS["default"];

  // 确保至少有3条建议
  let idx = 0;
  while (suggestions.length < Math.max(3, negativeCount) && idx < generalSugs.length) {
    if (!suggestions.includes(generalSugs[idx])) {
      suggestions.push(generalSugs[idx]);
    }
    idx++;
  }

  // 最多返回5条建议
  return suggestions.slice(0, 5);
}
