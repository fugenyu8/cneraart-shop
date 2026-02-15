import { getDb } from "../server/db";
import { faceRules, palmRules, fengshuiRules } from "../drizzle/schema";

/**
 * 初始化命理测算规则数据
 * 包含面相、手相、风水的核心规则
 */
async function seedFortuneRules() {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    process.exit(1);
  }

  console.log("开始初始化命理测算规则...");

  // 清空现有规则
  await db.delete(faceRules);
  await db.delete(palmRules);
  await db.delete(fengshuiRules);

  // ==================== 面相规则 ====================
  console.log("插入面相规则...");
  
  const faceRulesData = [
    // 额头(命宫)
    {
      palaceName: "命宫",
      featureName: "额头高度",
      conditionOperator: ">",
      conditionValue: "70",
      score: 8,
      interpretation: "额头高广,智慧聪颖,事业运佳",
      category: "事业",
    },
    {
      palaceName: "命宫",
      featureName: "额头光洁度",
      conditionOperator: ">",
      conditionValue: "80",
      score: 7,
      interpretation: "额头光洁无瑕,贵人运旺,前程似锦",
      category: "财运",
    },
    // 眉毛(兄弟宫)
    {
      palaceName: "兄弟宫",
      featureName: "眉毛浓度",
      conditionOperator: ">",
      conditionValue: "60",
      score: 6,
      interpretation: "眉毛浓密,兄弟情深,朋友相助",
      category: "感情",
    },
    {
      palaceName: "兄弟宫",
      featureName: "眉形",
      conditionOperator: "==",
      conditionValue: "柳叶眉",
      score: 8,
      interpretation: "眉如柳叶,性情温和,人缘极佳",
      category: "感情",
    },
    // 眼睛(子女宫)
    {
      palaceName: "子女宫",
      featureName: "眼睛大小",
      conditionOperator: ">",
      conditionValue: "65",
      score: 7,
      interpretation: "眼大有神,子女聪慧,家庭和睦",
      category: "感情",
    },
    {
      palaceName: "子女宫",
      featureName: "眼神",
      conditionOperator: "==",
      conditionValue: "有神",
      score: 9,
      interpretation: "目光炯炯,精神饱满,运势亨通",
      category: "事业",
    },
    // 鼻子(财帛宫)
    {
      palaceName: "财帛宫",
      featureName: "鼻梁高度",
      conditionOperator: ">",
      conditionValue: "70",
      score: 8,
      interpretation: "鼻梁高挺,财运亨通,事业有成",
      category: "财运",
    },
    {
      palaceName: "财帛宫",
      featureName: "鼻头丰满度",
      conditionOperator: ">",
      conditionValue: "75",
      score: 9,
      interpretation: "鼻头丰隆,财库充盈,富贵之相",
      category: "财运",
    },
    // 嘴巴(福德宫)
    {
      palaceName: "福德宫",
      featureName: "嘴唇厚度",
      conditionOperator: ">",
      conditionValue: "60",
      score: 7,
      interpretation: "唇厚有肉,福德深厚,晚年安康",
      category: "健康",
    },
    {
      palaceName: "福德宫",
      featureName: "嘴角上扬",
      conditionOperator: "==",
      conditionValue: "是",
      score: 8,
      interpretation: "嘴角上扬,性格乐观,福气满满",
      category: "健康",
    },
  ];

  await db.insert(faceRules).values(faceRulesData);
  console.log(`✓ 插入 ${faceRulesData.length} 条面相规则`);

  // ==================== 手相规则 ====================
  console.log("插入手相规则...");
  
  const palmRulesData = [
    // 生命线
    {
      lineName: "生命线",
      hillName: null,
      featureName: "长度",
      conditionOperator: ">",
      conditionValue: "80",
      score: 8,
      interpretation: "生命线长而清晰,体质健康,寿命绵长",
      category: "健康",
    },
    {
      lineName: "生命线",
      hillName: null,
      featureName: "深度",
      conditionOperator: ">",
      conditionValue: "70",
      score: 7,
      interpretation: "生命线深刻,精力充沛,抗压能力强",
      category: "健康",
    },
    // 智慧线
    {
      lineName: "智慧线",
      hillName: null,
      featureName: "长度",
      conditionOperator: ">",
      conditionValue: "75",
      score: 8,
      interpretation: "智慧线长,思维敏捷,学习能力强",
      category: "事业",
    },
    {
      lineName: "智慧线",
      hillName: null,
      featureName: "清晰度",
      conditionOperator: ">",
      conditionValue: "80",
      score: 9,
      interpretation: "智慧线清晰,头脑清醒,决策果断",
      category: "事业",
    },
    // 感情线
    {
      lineName: "感情线",
      hillName: null,
      featureName: "长度",
      conditionOperator: ">",
      conditionValue: "70",
      score: 7,
      interpretation: "感情线长,情感丰富,婚姻美满",
      category: "感情",
    },
    {
      lineName: "感情线",
      hillName: null,
      featureName: "深度",
      conditionOperator: ">",
      conditionValue: "75",
      score: 8,
      interpretation: "感情线深,用情专一,家庭和睦",
      category: "感情",
    },
    // 事业线
    {
      lineName: "事业线",
      hillName: null,
      featureName: "清晰度",
      conditionOperator: ">",
      conditionValue: "80",
      score: 9,
      interpretation: "事业线清晰,事业顺遂,步步高升",
      category: "事业",
    },
    {
      lineName: "事业线",
      hillName: null,
      featureName: "长度",
      conditionOperator: ">",
      conditionValue: "75",
      score: 8,
      interpretation: "事业线长,事业稳定,前途光明",
      category: "事业",
    },
    // 财运线
    {
      lineName: "财运线",
      hillName: null,
      featureName: "数量",
      conditionOperator: ">",
      conditionValue: "2",
      score: 8,
      interpretation: "财运线多,财源广进,财富丰盈",
      category: "财运",
    },
    {
      lineName: "财运线",
      hillName: null,
      featureName: "清晰度",
      conditionOperator: ">",
      conditionValue: "70",
      score: 7,
      interpretation: "财运线清晰,理财有道,积蓄丰厚",
      category: "财运",
    },
  ];

  await db.insert(palmRules).values(palmRulesData);
  console.log(`✓ 插入 ${palmRulesData.length} 条手相规则`);

  // ==================== 风水规则 ====================
  console.log("插入风水规则...");
  
  const fengshuiRulesData = [
    // 卧室风水
    {
      roomType: "bedroom",
      category: "layout",
      ruleName: "床头靠墙",
      conditionType: "==",
      conditionValue: "是",
      score: 8,
      interpretation: "床头靠实墙,有靠山,事业稳固,睡眠安稳",
      suggestion: "确保床头紧贴实墙,避免床头悬空或靠窗",
    },
    {
      roomType: "bedroom",
      category: "color",
      ruleName: "主色调",
      conditionType: "in",
      conditionValue: "米色,浅黄,淡粉",
      score: 7,
      interpretation: "卧室色调温馨柔和,有利于放松身心,促进夫妻和睦",
      suggestion: "选择温暖柔和的色调,避免过于鲜艳刺激的颜色",
    },
    {
      roomType: "bedroom",
      category: "decoration",
      ruleName: "镜子位置",
      conditionType: "!=",
      conditionValue: "对床",
      score: 6,
      interpretation: "镜子不对床,避免惊吓,有利于睡眠和健康",
      suggestion: "将镜子移至侧面或衣柜内,避免直对床铺",
    },
    // 客厅风水
    {
      roomType: "living_room",
      category: "layout",
      ruleName: "沙发摆放",
      conditionType: "==",
      conditionValue: "背靠实墙",
      score: 8,
      interpretation: "沙发背靠实墙,有靠山,家运稳固,贵人相助",
      suggestion: "将沙发靠墙摆放,避免背对门窗",
    },
    {
      roomType: "living_room",
      category: "color",
      ruleName: "主色调",
      conditionType: "in",
      conditionValue: "白色,米色,浅灰",
      score: 7,
      interpretation: "客厅色调明亮开阔,气场流通,财运亨通",
      suggestion: "选择明亮清爽的色调,营造开阔舒适的氛围",
    },
    {
      roomType: "living_room",
      category: "decoration",
      ruleName: "植物摆放",
      conditionType: "==",
      conditionValue: "有",
      score: 6,
      interpretation: "客厅摆放绿植,生机勃勃,净化空气,提升运势",
      suggestion: "摆放阔叶植物如发财树、富贵竹等",
    },
    // 书房风水
    {
      roomType: "study",
      category: "layout",
      ruleName: "书桌朝向",
      conditionType: "in",
      conditionValue: "东,东南,南",
      score: 8,
      interpretation: "书桌朝向吉位,文昌运旺,学业事业双丰收",
      suggestion: "书桌朝向东方或东南方,有利于思维活跃",
    },
    {
      roomType: "study",
      category: "color",
      ruleName: "主色调",
      conditionType: "in",
      conditionValue: "绿色,蓝色,米色",
      score: 7,
      interpretation: "书房色调清新宁静,有利于集中精神,提高效率",
      suggestion: "选择清新淡雅的色调,营造安静的学习氛围",
    },
    {
      roomType: "study",
      category: "decoration",
      ruleName: "书柜摆放",
      conditionType: "==",
      conditionValue: "靠墙",
      score: 6,
      interpretation: "书柜靠墙,知识有根基,学业稳固",
      suggestion: "将书柜靠墙摆放,保持书房整洁有序",
    },
    // 厨房风水
    {
      roomType: "kitchen",
      category: "layout",
      ruleName: "灶台位置",
      conditionType: "!=",
      conditionValue: "对门",
      score: 7,
      interpretation: "灶台不对门,财不外露,守住财运",
      suggestion: "调整灶台位置或使用屏风遮挡",
    },
    {
      roomType: "kitchen",
      category: "color",
      ruleName: "主色调",
      conditionType: "in",
      conditionValue: "白色,米色,浅黄",
      score: 6,
      interpretation: "厨房色调明亮清洁,五行平衡,家人健康",
      suggestion: "选择明亮清爽的色调,保持厨房整洁",
    },
    {
      roomType: "kitchen",
      category: "environment",
      ruleName: "通风采光",
      conditionType: "==",
      conditionValue: "良好",
      score: 8,
      interpretation: "厨房通风采光好,气场流通,家运兴旺",
      suggestion: "保持厨房通风良好,定期开窗换气",
    },
  ];

  await db.insert(fengshuiRules).values(fengshuiRulesData);
  console.log(`✓ 插入 ${fengshuiRulesData.length} 条风水规则`);

  console.log("\n✅ 规则初始化完成!");
  console.log(`总计: ${faceRulesData.length + palmRulesData.length + fengshuiRulesData.length} 条规则`);
  
  process.exit(0);
}

seedFortuneRules().catch((error) => {
  console.error("规则初始化失败:", error);
  process.exit(1);
});
