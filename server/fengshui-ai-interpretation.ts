/**
 * 风水解读报告生成 - 本地模板引擎（深化版）
 * 完全本地运行，不依赖任何外部 LLM API
 * 覆盖8种房间类型 × 6级评分 × 多维度分析（五行/八卦/煞气/财位/桃花/文昌）
 */

import type { FengshuiCalculationResult } from "./fengshui-engine";
import { ROOM_TYPE_NAMES } from "./fengshui-engine";

// ============= 六级评分体系 =============
type ScoreLevel = "supreme" | "excellent" | "good" | "average" | "poor" | "critical";

function getScoreLevel(score: number): ScoreLevel {
  if (score >= 90) return "supreme";
  if (score >= 78) return "excellent";
  if (score >= 65) return "good";
  if (score >= 50) return "average";
  if (score >= 35) return "poor";
  return "critical";
}

// ============= 综合总结模板（8种房间 × 6级） =============

const OVERALL_TEMPLATES: Record<string, Record<ScoreLevel, string[]>> = {
  living_room: {
    supreme: [
      "老夫观此客厅布局，实为上上之局！据八宅风水所载，此间格局方正，气场流通，{positiveCount}处合乎风水吉相，整体评分高达{score}分。客厅乃一家之主堂，聚气纳福之所。财位明亮通透，沙发靠墙而设，此为'背有靠山'之格，主事业稳固，贵人相助。五行之气在此间流转自如，阴阳调和，实为难得的风水宝地。老夫建议继续保持此等布局，适当点缀绿植和流水摆件，可使气场更加旺盛，家运昌隆，财源广进。",
      "善哉善哉！此客厅风水格局之佳，老夫行走江湖数十载，亦属罕见。{positiveCount}处吉相汇聚，评分{score}分，可谓'明堂开阔，气聚财来'之上佳格局。五行流通无碍，八卦方位各安其所，此等客厅必主家道兴旺，子孙昌盛。"
    ],
    excellent: [
      "老夫观此客厅风水，甚感欣慰。整体评分{score}分，有{positiveCount}处吉相。客厅为家宅之心脏，气运汇聚之地。布局方正，光线充足，多数方面符合传统风水理论。古语云'明堂宜宽阔'，您的客厅正合此理。稍有{negativeCount}处可优化之处，但无伤大雅。老夫建议在保持现有优势的基础上，微调细节，家运将更加兴旺。",
    ],
    good: [
      "老夫细观此客厅风水，整体格局尚佳，评分{score}分，有{positiveCount}处吉相。客厅为家宅之心脏，气运汇聚之地。布局基本合理，多数方面符合传统风水理论。然仍有{negativeCount}处需要调整，以臻完美。古语云'明堂宜宽阔，暗室宜紧凑'，建议在保持现有优势的基础上，对不足之处加以改善，家运将更加兴旺。",
    ],
    average: [
      "老夫观此客厅布局，喜忧参半。整体评分{score}分，有{positiveCount}处吉相，{negativeCount}处需改善。客厅风水关乎全家运势，不可不慎。目前的布局虽无大碍，但仍有提升空间。据玄空飞星理论，适当调整家具摆放和色彩搭配，可有效改善气场。老夫建议逐步调整，不必急于一时，循序渐进，方能收到良效。",
    ],
    poor: [
      "老夫观此客厅风水，发现{negativeCount}处需要注意的问题，整体评分{score}分。但施主不必过于忧虑，风水之道在于调和，非一成不变。佛家讲因果，风水亦然——只要用心调整，必能转危为安。老夫将逐一指出问题所在，并给出具体的改善建议。记住，心存善念，广积阴德，是最好的风水。",
    ],
    critical: [
      "老夫观此客厅风水，发现{negativeCount}处较为严重的问题，评分仅{score}分。施主切莫惊慌，风水之道讲究'化煞为权'，任何困局皆有破解之法。老夫将详细分析每一处问题，并给出切实可行的化解方案。古人云'穷则变，变则通'，只要按照建议逐步调整，客厅风水定能大为改观。",
    ],
  },
  bedroom: {
    supreme: [
      "老夫观此卧室布局，深感赞叹。卧室乃休养生息之所，关乎主人的健康和感情运势。{positiveCount}处合乎风水吉相，评分高达{score}分。床位安置得当，远离门窗直冲，无横梁压顶之忧，此为安眠养神之佳局。色调柔和温馨，阴阳平衡，有利于夫妻和睦，身心健康。此等卧室风水，主人必定精力充沛，感情和睦，事业顺遂。",
    ],
    excellent: [
      "老夫观此卧室风水，整体格局优良，评分{score}分，{positiveCount}处吉相。卧室为阴气汇聚之所，宜静不宜动，宜暗不宜明。床位安置基本得当，色调和谐，有利于睡眠和身心恢复。稍有{negativeCount}处可优化，调整后将更加完美。",
    ],
    good: [
      "老夫细观此卧室风水，整体格局良好，评分{score}分。卧室为阴气汇聚之所，宜静不宜动。布局基本得当，有{positiveCount}处吉相。然仍有{negativeCount}处可以优化。古人云'卧室安宁，则身心康泰'，建议对不足之处加以调整，睡眠质量和运势都将有所提升。",
    ],
    average: [
      "老夫观此卧室布局，有喜有忧。评分{score}分，{positiveCount}处吉相，{negativeCount}处需改善。卧室风水直接影响主人的精气神，不可轻视。目前的布局虽无大碍，但若能按照建议加以调整，睡眠质量和整体运势都将明显改善。",
    ],
    poor: [
      "老夫观此卧室风水，发现{negativeCount}处需要关注的问题，评分{score}分。但施主莫要担忧，卧室风水的调整相对简单，只需按照建议逐步改善即可。佛家讲'心安即是归处'，先调整心态，再调整环境，双管齐下，效果更佳。",
    ],
    critical: [
      "老夫观此卧室风水，发现{negativeCount}处较为严重的问题，评分仅{score}分。卧室风水关乎健康和感情，不可忽视。但施主不必过于焦虑，老夫将给出详细的化解方案，只要逐步调整，卧室风水定能改善，睡眠质量和运势都会好转。",
    ],
  },
  study: {
    supreme: [
      "老夫观此书房布局，甚为赞赏。书房乃文昌之位，主学业事业。{positiveCount}处合乎风水吉相，评分{score}分。书桌朝向得当，背后有靠，前方开阔，此为'文昌大开'之格，主学业有成，事业顺遂。光线充足，空气流通，有利于思维清晰，灵感涌现。此等书房风水，主人必定才思敏捷，事业有成。",
    ],
    excellent: [
      "老夫观此书房风水，格局优良，评分{score}分。书房为静心修学之所，宜清净雅致。{positiveCount}处吉相，文昌位能量充沛，有利于学业和事业。稍有{negativeCount}处可优化，调整后文昌运将更加旺盛。",
    ],
    good: [
      "老夫细观此书房风水，整体格局不错，评分{score}分。书房为静心修学之所，宜清净雅致。有{positiveCount}处吉相，建议在此基础上进一步优化，使文昌运更加旺盛。",
    ],
    average: [
      "老夫观此书房布局，尚有提升空间。评分{score}分，{positiveCount}处吉相，{negativeCount}处需改善。建议按照风水理论进行适当调整，以催旺文昌运，提升学业和事业运势。",
    ],
    poor: [
      "老夫观此书房风水，发现{negativeCount}处需要改善的地方，评分{score}分。书房风水对学业和事业影响甚大，建议按照建议进行调整。在书桌上摆放文昌塔或四支毛笔，可辅助催旺文昌运。",
    ],
    critical: [
      "老夫观此书房风水，发现{negativeCount}处较为严重的问题，评分仅{score}分。书房风水关乎学业和事业前途，需要尽快调整。老夫将给出详细建议，逐步改善，文昌运定能好转。",
    ],
  },
  kitchen: {
    supreme: [
      "老夫观此厨房布局，颇为满意。厨房为家宅之灶位，关乎全家的健康和财运。{positiveCount}处合乎风水吉相，评分{score}分。灶台与水槽位置得当，火水不相冲，此为'水火既济'之格，主家人健康，财运亨通。通风良好，色调温馨，实为上佳之厨房风水。",
    ],
    excellent: [
      "老夫观此厨房风水，格局优良，评分{score}分。厨房为养命之源，灶位安置得当，{positiveCount}处吉相。水火相济，五行调和，有利于家人健康和财运。稍有{negativeCount}处可优化。",
    ],
    good: [
      "老夫细观此厨房风水，整体格局良好，评分{score}分。厨房为养命之源，风水布局不可忽视。基本合理，{positiveCount}处吉相，建议在此基础上进一步优化。",
    ],
    average: [
      "老夫观此厨房布局，有待改善之处。评分{score}分，{positiveCount}处吉相，{negativeCount}处需改善。建议注意灶台和水槽的相对位置，避免水火相冲。",
    ],
    poor: [
      "老夫观此厨房风水，发现{negativeCount}处需要注意的问题，评分{score}分。厨房风水关乎全家健康，建议按照建议调整灶台位置和厨房布局。",
    ],
    critical: [
      "老夫观此厨房风水，发现{negativeCount}处较为严重的问题，评分仅{score}分。厨房为一家之灶，关乎健康和财运，需要尽快调整。老夫将给出详细的化解方案。",
    ],
  },
  bathroom: {
    supreme: [
      "老夫观此卫生间布局，甚为满意。卫生间虽为排污之所，但布局得当亦可化煞为权。{positiveCount}处合乎风水吉相，评分{score}分。通风良好，整洁有序，排水顺畅，不犯冲煞，实为难得。",
    ],
    excellent: [
      "老夫观此卫生间风水，格局优良，评分{score}分。卫生间布局得当，{positiveCount}处吉相，通风排水良好，不影响其他房间的气场。",
    ],
    good: [
      "老夫细观此卫生间风水，整体格局不错，评分{score}分。有{positiveCount}处吉相，{negativeCount}处可优化。注意保持通风和整洁即可。",
    ],
    average: [
      "老夫观此卫生间布局，评分{score}分。有{positiveCount}处吉相，{negativeCount}处需改善。卫生间风水重在通风排水，建议加强这两方面。",
    ],
    poor: [
      "老夫观此卫生间风水，发现{negativeCount}处需要注意的问题，评分{score}分。卫生间为排污之所，风水不佳会影响全家运势，建议尽快调整。",
    ],
    critical: [
      "老夫观此卫生间风水，发现{negativeCount}处较为严重的问题，评分仅{score}分。卫生间风水关乎全家健康，需要紧急调整通风和排水系统。",
    ],
  },
  balcony: {
    supreme: [
      "老夫观此阳台布局，甚为赞赏。阳台为纳气之口，关乎家宅的气场流通。{positiveCount}处合乎风水吉相，评分{score}分。视野开阔，光线充足，绿植丰富，此为'纳气生财'之佳局。",
    ],
    excellent: [
      "老夫观此阳台风水，格局优良，评分{score}分。阳台为纳气之口，{positiveCount}处吉相，光线和通风俱佳，有利于家宅气场。",
    ],
    good: [
      "老夫细观此阳台风水，整体格局不错，评分{score}分。有{positiveCount}处吉相，建议增加绿植，进一步提升气场。",
    ],
    average: [
      "老夫观此阳台布局，评分{score}分。有{positiveCount}处吉相，{negativeCount}处需改善。阳台为纳气之口，建议保持整洁通透。",
    ],
    poor: [
      "老夫观此阳台风水，发现{negativeCount}处需要注意的问题，评分{score}分。阳台为纳气之口，堆放杂物会影响全家气场。",
    ],
    critical: [
      "老夫观此阳台风水，发现{negativeCount}处较为严重的问题，评分仅{score}分。阳台为纳气之口，需要紧急清理和调整。",
    ],
  },
  dining_room: {
    supreme: [
      "老夫观此餐厅布局，甚为满意。餐厅为一家团聚之所，关乎家庭和睦和健康运势。{positiveCount}处合乎风水吉相，评分{score}分。光线温馨，色调和谐，餐桌摆放得当，此为'家和万事兴'之佳局。",
    ],
    excellent: [
      "老夫观此餐厅风水，格局优良，评分{score}分。餐厅为团聚之所，{positiveCount}处吉相，色调温馨和谐，有利于家庭和睦。",
    ],
    good: [
      "老夫细观此餐厅风水，整体格局不错，评分{score}分。有{positiveCount}处吉相，{negativeCount}处可优化。建议使用暖色调灯光，增进家庭和睦。",
    ],
    average: [
      "老夫观此餐厅布局，评分{score}分。有{positiveCount}处吉相，{negativeCount}处需改善。餐厅风水重在温馨和谐，建议调整灯光和色调。",
    ],
    poor: [
      "老夫观此餐厅风水，发现{negativeCount}处需要注意的问题，评分{score}分。餐厅为一家团聚之所，风水不佳会影响家庭和睦。",
    ],
    critical: [
      "老夫观此餐厅风水，发现{negativeCount}处较为严重的问题，评分仅{score}分。餐厅风水关乎家庭和睦和健康，需要尽快调整。",
    ],
  },
  entrance: {
    supreme: [
      "老夫观此玄关布局，甚为赞赏。玄关为家宅之气口，关乎纳气和藏风。{positiveCount}处合乎风水吉相，评分{score}分。玄关明亮整洁，气口通畅，此为'迎财纳福'之佳局。",
    ],
    excellent: [
      "老夫观此玄关风水，格局优良，评分{score}分。玄关为气口之所，{positiveCount}处吉相，明亮整洁，有利于纳气聚财。",
    ],
    good: [
      "老夫细观此玄关风水，整体格局不错，评分{score}分。有{positiveCount}处吉相，建议保持整洁明亮，增加挡煞屏风。",
    ],
    average: [
      "老夫观此玄关布局，评分{score}分。有{positiveCount}处吉相，{negativeCount}处需改善。玄关为气口，建议增加照明和绿植。",
    ],
    poor: [
      "老夫观此玄关风水，发现{negativeCount}处需要注意的问题，评分{score}分。玄关为纳气之口，堆放杂物会阻碍财气进入。",
    ],
    critical: [
      "老夫观此玄关风水，发现{negativeCount}处较为严重的问题，评分仅{score}分。玄关为家宅之气口，需要紧急清理和调整。",
    ],
  },
};

// 通用房间模板
const GENERIC_TEMPLATES: Record<ScoreLevel, string[]> = {
  supreme: [
    "老夫观此{roomName}布局，实为上上之局！整体风水格局优良，评分{score}分，有{positiveCount}处吉相。布局合理，气场流通，阴阳调和，五行平衡，实为难得的风水宝地。建议保持现有布局，适当点缀吉祥物品，运势将更加旺盛。",
  ],
  excellent: [
    "老夫观此{roomName}风水，格局优良，评分{score}分，有{positiveCount}处吉相。布局得当，气场和谐，稍有{negativeCount}处可优化。建议在保持优势的基础上微调细节。",
  ],
  good: [
    "老夫细观此{roomName}风水，整体格局不错，评分{score}分。有{positiveCount}处吉相，{negativeCount}处需优化。建议在保持优势的基础上，对不足之处加以改善。",
  ],
  average: [
    "老夫观此{roomName}布局，喜忧参半，评分{score}分。有{positiveCount}处吉相，{negativeCount}处需改善。建议按照风水理论逐步调整，运势将逐渐好转。",
  ],
  poor: [
    "老夫观此{roomName}风水，发现{negativeCount}处需要关注。评分{score}分，但施主不必忧虑，只要按照建议调整，风水格局定能改善。",
  ],
  critical: [
    "老夫观此{roomName}风水，发现{negativeCount}处较为严重的问题，评分仅{score}分。施主切莫惊慌，老夫将给出详细的化解方案，逐步调整，风水定能好转。",
  ],
};

// ============= 五行分析文案库 =============

const FIVE_ELEMENTS_TEMPLATES: Record<string, Record<string, string>> = {
  wood: {
    excess: "木气过旺，主人容易急躁冲动，肝胆方面需要注意。建议减少绿色装饰，增加金属元素以制木。",
    deficient: "木气不足，缺乏生机活力，主人容易疲倦乏力。建议增加绿色植物和木质家具，催旺木气。",
    balanced: "木气适中，生机盎然，有利于健康和事业发展。",
  },
  fire: {
    excess: "火气过旺，主人容易心浮气躁，心脑血管方面需要注意。建议减少红色装饰，增加水元素以制火。",
    deficient: "火气不足，缺乏热情和动力，人际关系可能冷淡。建议增加暖色调灯光和红色装饰，催旺火气。",
    balanced: "火气适中，热情洋溢，有利于人际关系和名声运势。",
  },
  earth: {
    excess: "土气过旺，主人容易固执保守，脾胃方面需要注意。建议减少黄色和土色装饰，增加木元素以疏土。",
    deficient: "土气不足，缺乏稳定感和安全感。建议增加黄色和米色装饰，使用陶瓷器皿，催旺土气。",
    balanced: "土气适中，稳重踏实，有利于财运和家庭稳定。",
  },
  metal: {
    excess: "金气过旺，主人容易刻板严肃，呼吸系统方面需要注意。建议减少金属装饰，增加火元素以克金。",
    deficient: "金气不足，缺乏决断力和执行力。建议增加金属装饰品和白色元素，催旺金气。",
    balanced: "金气适中，果断干练，有利于事业决策和财运。",
  },
  water: {
    excess: "水气过旺，主人容易优柔寡断，肾脏方面需要注意。建议减少深色和水景装饰，增加土元素以制水。",
    deficient: "水气不足，缺乏灵活性和智慧。建议增加水景摆件和深色装饰，催旺水气。",
    balanced: "水气适中，聪慧灵活，有利于智慧和财运流通。",
  },
};

// ============= 八卦方位文案库 =============

const BAGUA_TEMPLATES: Record<string, Record<string, string>> = {
  qian: {
    strong: "乾位（西北）能量充沛，主人事业运强劲，有利于领导力和权威的建立。此方位为父亲和男主人之位，能量旺盛主家中男性运势亨通。",
    weak: "乾位（西北）能量偏弱，可能影响男主人的事业运和领导力。建议在西北方摆放金属摆件或六帝古钱，催旺乾位能量。",
    average: "乾位（西北）能量中等，男主人事业运平稳。可适当增加金属元素以提升。",
  },
  kun: {
    strong: "坤位（西南）能量充沛，主人家庭和睦，女主人运势旺盛。此方位为母亲和女主人之位，能量旺盛主家中女性运势亨通，家庭幸福。",
    weak: "坤位（西南）能量偏弱，可能影响女主人的运势和家庭和睦。建议在西南方摆放黄色水晶或陶瓷器皿，催旺坤位能量。",
    average: "坤位（西南）能量中等，家庭关系平稳。可适当增加土元素以提升。",
  },
  zhen: {
    strong: "震位（东方）能量充沛，主人事业发展迅速，有利于创新和开拓。此方位主长子运势，能量旺盛有利于年轻人的发展。",
    weak: "震位（东方）能量偏弱，可能影响事业发展和创新能力。建议在东方摆放绿色植物或木质摆件，催旺震位能量。",
    average: "震位（东方）能量中等，事业发展平稳。可适当增加木元素以提升。",
  },
  xun: {
    strong: "巽位（东南）能量充沛，主人财运亨通，有利于投资和理财。此方位为财位之一，能量旺盛主财源广进。",
    weak: "巽位（东南）能量偏弱，可能影响财运和投资运势。建议在东南方摆放发财树或聚宝盆，催旺巽位能量。",
    average: "巽位（东南）能量中等，财运平稳。可适当增加木元素和水元素以提升。",
  },
  kan: {
    strong: "坎位（北方）能量充沛，主人智慧过人，事业根基稳固。此方位主事业运，能量旺盛有利于事业的长远发展。",
    weak: "坎位（北方）能量偏弱，可能影响事业根基和智慧发挥。建议在北方摆放水景摆件或鱼缸，催旺坎位能量。",
    average: "坎位（北方）能量中等，事业根基平稳。可适当增加水元素以提升。",
  },
  li: {
    strong: "离位（南方）能量充沛，主人名声远扬，社交运势旺盛。此方位主名声和人际关系，能量旺盛有利于社会地位的提升。",
    weak: "离位（南方）能量偏弱，可能影响名声和社交运势。建议在南方增加照明或摆放红色装饰品，催旺离位能量。",
    average: "离位（南方）能量中等，社交运势平稳。可适当增加火元素以提升。",
  },
  gen: {
    strong: "艮位（东北）能量充沛，主人学业有成，知识丰富。此方位主学业和知识运，能量旺盛有利于考试和学习。",
    weak: "艮位（东北）能量偏弱，可能影响学业和知识积累。建议在东北方摆放书籍或文昌塔，催旺艮位能量。",
    average: "艮位（东北）能量中等，学业运势平稳。可适当增加土元素以提升。",
  },
  dui: {
    strong: "兑位（西方）能量充沛，主人口才出众，人缘极佳。此方位主口才和人缘运，能量旺盛有利于社交和谈判。",
    weak: "兑位（西方）能量偏弱，可能影响口才和人际关系。建议在西方摆放金属风铃或铜器，催旺兑位能量。",
    average: "兑位（西方）能量中等，人际关系平稳。可适当增加金元素以提升。",
  },
};

// ============= 煞气化解文案库 =============

const SHA_QI_REMEDIES: Record<string, string> = {
  "尖角煞": "尖角煞化解：在尖角处摆放圆叶绿植（如龟背竹、绿萝），或悬挂葫芦化煞。也可用圆形装饰品遮挡尖角，柔化煞气。",
  "穿堂煞": "穿堂煞化解：在大门与阳台/窗户之间设置屏风或珠帘，阻断直冲气流。也可在中间摆放高大绿植或鱼缸，起到缓冲作用。",
  "门冲煞": "门冲煞化解：在两门之间悬挂门帘或五帝钱，化解对冲之气。保持其中一扇门常关，减少气场冲突。",
  "镜面煞": "镜面煞化解：移除正对大门或床位的镜子，或用布帘遮挡。卧室中的镜子不宜过大，且不应正对床位。",
  "梁压煞": "梁压煞化解：在横梁下方摆放葫芦或麒麟，化解压顶之气。也可用吊顶装饰遮挡横梁，或将家具移离横梁正下方。",
  "天斩煞": "天斩煞化解：在窗户处悬挂铜葫芦或八卦镜，化解两楼之间的煞气。也可用厚重窗帘遮挡，减少煞气侵入。",
  "反弓煞": "反弓煞化解：在面向反弓路的窗户处摆放石敢当或泰山石，化解反弓之气。也可种植高大树木遮挡。",
  "电磁干扰": "电磁干扰化解：将电器远离床头和书桌，使用电磁屏蔽材料。卧室中减少电子设备，保持自然磁场。",
};

// ============= 分项解读增强文案 =============

const CATEGORY_INTROS: Record<string, string> = {
  "布局": "据八宅风水所载，室内布局乃风水之根本，关乎气场流通和运势走向。",
  "色彩": "五行之中，色彩各有所属——木青、火红、土黄、金白、水黑，对气场影响甚大。",
  "装饰": "室内装饰非仅美观之用，更关乎气场之调和，每一件摆设都在影响着空间的能量场。",
  "环境": "环境之气，乃风水之本源。光照通风，皆为要务，直接影响居住者的身心健康。",
  "方位": "方位乃风水之纲领，八卦各有所主，不可不察。方位正确，则万事顺遂。",
  "家具": "家具摆放，关乎气场流通，不可随意为之。正确的摆放能聚气纳福，错误则散气破财。",
  "财运": "财位乃聚财之所，明亮整洁方能招财进宝。财位布局得当，则财源广进。",
  "健康": "健康为人之根本，风水布局直接影响居住者的身体状况和精神状态。",
  "感情": "感情运势与卧室风水密切相关，色调和谐、布局得当方能促进夫妻和睦。",
  "事业": "事业运势与书房和客厅风水相关，文昌位旺盛则事业顺遂，贵人相助。",
  "煞气": "煞气为风水之大忌，需及时化解，否则会影响居住者的运势和健康。",
  "五行": "五行相生相克，平衡为上。木生火、火生土、土生金、金生水、水生木，循环不息。",
};

const POSITIVE_CLOSINGS = [
  "此为上佳之象，宜继续保持。",
  "甚好，此等布局有利于运势提升。",
  "老夫甚感欣慰，此处风水极佳。",
  "此为吉相，主家运昌隆。",
  "布局得当，气场和谐，实为难得。",
  "此处风水合乎古法，主人有福。",
  "善哉！此等格局有利于聚气纳福。",
  "此为上吉之象，主人运势亨通。",
];

const NEGATIVE_CLOSINGS = [
  "建议尽早调整，以免影响运势。",
  "此处需要注意，但调整起来并不困难。",
  "老夫建议施主留意此处，适当调整即可。",
  "虽有不足，但通过调整完全可以化解。",
  "建议按照老夫的建议进行改善，运势将好转。",
  "此处虽有瑕疵，但化解之法并不复杂。",
  "施主不必忧虑，按照建议调整即可转危为安。",
  "此处需要重视，及时调整方为上策。",
];

// ============= 改善建议文案库（扩充版） =============

const GENERAL_SUGGESTIONS: Record<string, string[]> = {
  living_room: [
    "在客厅财位（通常为大门对角线位置）摆放一盆常绿植物，如发财树或金钱树，可催旺财运",
    "客厅宜保持整洁明亮，避免堆放杂物，以利气场流通",
    "可在客厅悬挂山水画，取'背山面水'之意，有利于事业和财运",
    "沙发背后宜靠实墙，不宜背对门窗，取'背有靠山'之意",
    "客厅灯光宜明亮温暖，避免过暗或过于刺眼的灯光",
    "客厅中央不宜摆放过高的家具，以免阻碍气场流通",
    "电视墙宜简洁大方，避免过于花哨的装饰",
    "客厅地毯宜选用暖色调，增加温馨感和聚气效果",
  ],
  bedroom: [
    "床头宜靠实墙，不宜悬空或靠窗，取'背有靠山'之意",
    "卧室宜选用柔和的暖色调，如米色、浅粉等，有利于睡眠和感情",
    "床头不宜摆放大面积镜子，以免影响睡眠质量",
    "卧室宜保持整洁，不宜堆放过多杂物，以利气场流通",
    "可在床头柜摆放一对鸳鸯或玫瑰花，有利于感情运势",
    "卧室灯光宜柔和温馨，避免过于明亮的白光",
    "床不宜正对房门，以免气流直冲影响睡眠",
    "卧室不宜摆放过多电子设备，以减少电磁干扰",
  ],
  study: [
    "书桌宜面向门口或窗户，取'明堂开阔'之意，有利于思维清晰",
    "书房宜选用清新淡雅的色调，如浅绿、浅蓝等，有利于集中注意力",
    "可在书桌上摆放文昌塔或四支毛笔，催旺文昌运",
    "书房宜保持安静整洁，避免过多装饰，以利于静心学习",
    "书架宜靠墙摆放，不宜正对书桌，以免形成压迫感",
    "书房光线宜充足但不刺眼，自然光为最佳",
    "书桌背后宜有实墙，取'背有靠山'之意",
    "书房可摆放一盆文竹或富贵竹，催旺文昌运",
  ],
  kitchen: [
    "灶台不宜正对水槽，以免水火相冲，影响家人健康",
    "厨房宜保持通风良好，避免油烟积聚，影响气场",
    "厨房色调宜以暖色为主，如米白、浅黄等，营造温馨氛围",
    "灶台不宜正对厨房门，以免财气外泄",
    "厨房宜保持整洁，餐具归位，以利于健康运势",
    "冰箱不宜正对灶台，以免水火相冲",
    "厨房宜有充足的照明，避免阴暗角落",
    "灶台上方不宜有横梁，以免形成梁压煞",
  ],
  bathroom: [
    "卫生间宜保持通风良好，避免湿气积聚",
    "卫生间门宜常关，以免污气外泄影响其他房间",
    "可在卫生间摆放绿色植物，吸收湿气和净化空气",
    "卫生间色调宜以浅色为主，增加明亮感",
    "马桶盖宜常盖，以免财气流失",
  ],
  balcony: [
    "阳台宜摆放绿色植物，增加生机和纳气效果",
    "阳台不宜堆放杂物，以免阻碍气场流通",
    "可在阳台种植香草植物，净化空气改善气场",
    "阳台栏杆宜坚固美观，增加安全感和美感",
    "阳台宜保持整洁通透，让阳光和新鲜空气充分进入",
  ],
  dining_room: [
    "餐桌宜选用圆形或椭圆形，取'团圆和睦'之意",
    "餐厅灯光宜温馨明亮，使用暖色调灯光增进食欲",
    "餐厅不宜正对卫生间门，以免影响食欲和健康",
    "可在餐厅摆放水果盘或鲜花，增加生机和财运",
    "餐厅色调宜温馨和谐，避免过于冷色调",
  ],
  entrance: [
    "玄关宜保持整洁明亮，不宜堆放杂物",
    "可在玄关摆放屏风或珠帘，化解穿堂煞",
    "玄关灯光宜明亮温暖，给人温馨的第一印象",
    "可在玄关摆放一盆绿植或鲜花，增加生机",
    "玄关不宜正对镜子，以免将财气反射出去",
  ],
  default: [
    "保持室内整洁明亮，是改善风水的基本功",
    "适当摆放绿色植物，可净化空气，改善气场",
    "注意室内通风，让新鲜空气流通，有利于运势提升",
    "选用和谐的色彩搭配，避免过于刺激的颜色",
    "定期清理不需要的物品，保持空间的通透感",
    "在财位摆放聚宝盆或发财树，催旺财运",
    "使用暖色调灯光，营造温馨和谐的氛围",
    "避免在家中摆放枯萎的植物或破损的物品",
  ],
};

// ============= 报告生成函数 =============

/**
 * 生成风水解读报告（本地模板引擎 - 深化版）
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
  fiveElementsAnalysis?: string;
  baguaAnalysis?: string;
  shaQiAnalysis?: string;
  wealthAnalysis?: string;
}> {
  const roomName = ROOM_TYPE_NAMES[roomType] || "房间";
  const score = calculationResult.overallScore;
  const positiveCount = calculationResult.positiveCount;
  const negativeCount = calculationResult.negativeCount;

  // 1. 生成综合总结
  const overallSummary = generateOverallSummary(
    roomType, roomName, score, positiveCount, negativeCount
  );

  // 2. 生成分项解读
  const sections = generateSections(calculationResult.items, roomName);

  // 3. 生成改善建议
  const suggestions = generateSuggestions(
    calculationResult.items, roomType, negativeCount
  );

  // 4. 生成五行分析报告
  const fiveElementsAnalysis = generateFiveElementsAnalysis(calculationResult.fiveElements);

  // 5. 生成八卦方位分析报告
  const baguaAnalysis = generateBaguaAnalysis(calculationResult.baguaEnergy);

  // 6. 生成煞气分析报告
  const shaQiAnalysis = generateShaQiAnalysis(calculationResult.shaQiItems);

  // 7. 生成财位分析报告
  const wealthAnalysis = generateWealthAnalysis(calculationResult.wealthPosition);

  return {
    overallSummary,
    sections,
    suggestions,
    fiveElementsAnalysis,
    baguaAnalysis,
    shaQiAnalysis,
    wealthAnalysis,
  };
}

/**
 * 生成综合总结
 */
function generateOverallSummary(
  roomType: string, roomName: string, score: number,
  positiveCount: number, negativeCount: number
): string {
  const level = getScoreLevel(score);
  let templates: string[];
  const roomTemplates = OVERALL_TEMPLATES[roomType];
  if (roomTemplates && roomTemplates[level]) {
    templates = roomTemplates[level];
  } else {
    templates = GENERIC_TEMPLATES[level];
  }

  // 随机选择模板变体
  let template = templates[Math.floor(Math.random() * templates.length)];

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
    const categoryIntro = CATEGORY_INTROS[item.category] || "";
    let content = "";

    if (categoryIntro && index < 5) {
      content += categoryIntro + " ";
    }

    content += item.interpretation;

    if (item.score > 0) {
      content += " " + POSITIVE_CLOSINGS[index % POSITIVE_CLOSINGS.length];
    } else if (item.score < 0) {
      content += " " + NEGATIVE_CLOSINGS[index % NEGATIVE_CLOSINGS.length];
    }

    // 归一化分数到 0-100
    let normalizedScore: number;
    if (item.score >= 8) normalizedScore = 90 + Math.min(10, (item.score - 8) * 5);
    else if (item.score >= 5) normalizedScore = 75 + (item.score - 5) * 5;
    else if (item.score >= 1) normalizedScore = 55 + (item.score - 1) * 5;
    else if (item.score === 0) normalizedScore = 50;
    else if (item.score >= -3) normalizedScore = 35 + (item.score + 3) * 5;
    else normalizedScore = Math.max(10, 35 + (item.score + 3) * 5);

    return {
      title: item.title,
      content,
      score: Math.max(0, Math.min(100, normalizedScore)),
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
  let idx = 0;
  while (suggestions.length < Math.max(3, negativeCount) && idx < generalSugs.length) {
    if (!suggestions.includes(generalSugs[idx])) {
      suggestions.push(generalSugs[idx]);
    }
    idx++;
  }

  return suggestions.slice(0, 8);
}

/**
 * 生成五行分析报告
 */
function generateFiveElementsAnalysis(
  fiveElements?: FengshuiCalculationResult["fiveElements"]
): string {
  if (!fiveElements) return "";

  const elements = [
    { name: "木", key: "wood", value: fiveElements.wood },
    { name: "火", key: "fire", value: fiveElements.fire },
    { name: "土", key: "earth", value: fiveElements.earth },
    { name: "金", key: "metal", value: fiveElements.metal },
    { name: "水", key: "water", value: fiveElements.water },
  ];

  let analysis = "【五行分析】\n";
  analysis += `五行平衡度：${fiveElements.balance}分（满分100分）\n`;
  if ((fiveElements as any).balanceDescription) {
    analysis += `状态：${(fiveElements as any).balanceDescription}\n`;
  }
  analysis += `\n`;

  for (const el of elements) {
    const templates = FIVE_ELEMENTS_TEMPLATES[el.key];
    let status: string;
    if (el.value > 70) {
      status = templates.excess;
    } else if (el.value < 30) {
      status = templates.deficient;
    } else {
      status = templates.balanced;
    }
    analysis += `${el.name}（${el.value}分）：${status}\n`;
  }

  // 五行相生相克建议
  const sorted = [...elements].sort((a, b) => b.value - a.value);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  analysis += `\n综合来看，此间${strongest.name}气最旺（${strongest.value}分），${weakest.name}气最弱（${weakest.value}分）。`;
  if (fiveElements.balance >= 70) {
    analysis += "五行整体较为平衡，气场和谐，有利于居住者的身心健康。";
  } else if (fiveElements.balance >= 50) {
    analysis += `建议适当增强${weakest.name}元素，减弱${strongest.name}元素，使五行趋于平衡。`;
  } else {
    analysis += `五行失衡较为严重，建议重点增强${weakest.name}元素，调整空间色彩和装饰，使五行恢复平衡。`;
  }

  return analysis;
}

/**
 * 生成八卦方位分析报告
 */
function generateBaguaAnalysis(
  baguaEnergy?: FengshuiCalculationResult["baguaEnergy"]
): string {
  if (!baguaEnergy) return "";

  const positions = [
    { name: "乾", key: "qian", value: baguaEnergy.qian },
    { name: "坤", key: "kun", value: baguaEnergy.kun },
    { name: "震", key: "zhen", value: baguaEnergy.zhen },
    { name: "巽", key: "xun", value: baguaEnergy.xun },
    { name: "坎", key: "kan", value: baguaEnergy.kan },
    { name: "离", key: "li", value: baguaEnergy.li },
    { name: "艮", key: "gen", value: baguaEnergy.gen },
    { name: "兑", key: "dui", value: baguaEnergy.dui },
  ];

  let analysis = "【八卦方位能量分析】\n\n";

  for (const pos of positions) {
    const templates = BAGUA_TEMPLATES[pos.key];
    let status: string;
    if (pos.value >= 70) {
      status = templates.strong;
    } else if (pos.value <= 40) {
      status = templates.weak;
    } else {
      status = templates.average;
    }
    analysis += `${status}\n\n`;
  }

  // 综合评价
  const avgEnergy = positions.reduce((sum, p) => sum + p.value, 0) / positions.length;
  const maxPos = positions.reduce((a, b) => a.value > b.value ? a : b);
  const minPos = positions.reduce((a, b) => a.value < b.value ? a : b);

  analysis += `八卦方位平均能量：${Math.round(avgEnergy)}分。`;
  analysis += `${maxPos.name}位能量最强（${maxPos.value}分），${minPos.name}位能量最弱（${minPos.value}分）。`;

  if (avgEnergy >= 65) {
    analysis += "整体八卦能量充沛，方位格局良好。";
  } else {
    analysis += `建议重点加强${minPos.name}位的能量，可通过调整该方位的装饰和色彩来实现。`;
  }

  return analysis;
}

/**
 * 生成煞气分析报告
 */
function generateShaQiAnalysis(
  shaQiItems?: FengshuiCalculationResult["shaQiItems"]
): string {
  if (!shaQiItems || shaQiItems.length === 0) {
    return "【煞气分析】\n\n经老夫仔细勘察，此间未发现明显煞气，气场清净和谐，实为难得。建议继续保持现有布局，避免引入尖角、镜面等容易产生煞气的元素。";
  }

  let analysis = "【煞气分析】\n\n";
  analysis += `经老夫勘察，此间发现${shaQiItems.length}处煞气需要化解：\n\n`;

  for (const item of shaQiItems) {
    analysis += `■ ${item.title}：${item.interpretation}\n`;

    // 匹配化解方案
    for (const [shaName, remedy] of Object.entries(SHA_QI_REMEDIES)) {
      if (item.title.includes(shaName)) {
        analysis += `  化解方案：${remedy}\n`;
        break;
      }
    }
    analysis += "\n";
  }

  analysis += "老夫提醒：煞气化解宜早不宜迟，但也不必过于紧张。按照上述方案逐步调整，煞气自然消散。";

  return analysis;
}

/**
 * 生成财位分析报告
 */
function generateWealthAnalysis(
  wealthPosition?: FengshuiCalculationResult["wealthPosition"]
): string {
  if (!wealthPosition) return "";

  let analysis = "【财位分析】\n\n";

  const score = wealthPosition.score;
  if (score >= 80) {
    analysis += `财位能量充沛（${score}分），聚财效果极佳。`;
    analysis += "财位明亮整洁，有靠有依，此为'财源广进'之格。建议在财位摆放聚宝盆或水晶球，进一步催旺财运。";
  } else if (score >= 60) {
    analysis += `财位能量良好（${score}分），基本具备聚财条件。`;
    analysis += "建议增加财位的照明和整洁度，摆放发财树或金蟾，可提升财运。";
  } else if (score >= 40) {
    analysis += `财位能量中等（${score}分），聚财效果一般。`;
    analysis += "建议重点改善财位的明亮度和整洁度，移除杂物，摆放招财植物或吉祥物。";
  } else {
    analysis += `财位能量偏弱（${score}分），需要重点改善。`;
    analysis += "财位可能被杂物遮挡或光线不足，建议立即清理财位，增加照明，摆放发财树和聚宝盆，催旺财运。";
  }

  return analysis;
}
