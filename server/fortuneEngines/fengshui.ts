/**
 * 风水分析引擎 - 本地版
 * 基于传统中国风水学的分析系统
 * 完全本地运行，不依赖任何外部API
 * 
 * 流程：图像特征提取 → 规则库匹配 → 风水计算 → 模板报告生成
 */

import { extractRoomFeatures } from "../fengshui-recognition";
import { calculateRoomFengshui, ROOM_TYPE_NAMES, DIRECTION_NAMES } from "../fengshui-engine";
import { generateFengshuiAIInterpretation } from "../fengshui-ai-interpretation";

/**
 * 八卦方位定义
 */
const BAGUA_DIRECTIONS = {
  qian: { name: "乾", direction: "西北", element: "金", aspects: ["父亲", "权威", "事业", "领导力"] },
  kun: { name: "坤", direction: "西南", element: "土", aspects: ["母亲", "包容", "家庭", "稳定"] },
  zhen: { name: "震", direction: "东", element: "木", aspects: ["长子", "行动", "创新", "发展"] },
  xun: { name: "巽", direction: "东南", element: "木", aspects: ["长女", "财运", "人际", "柔和"] },
  kan: { name: "坎", direction: "北", element: "水", aspects: ["中男", "智慧", "事业", "流动"] },
  li: { name: "离", direction: "南", element: "火", aspects: ["中女", "名声", "美丽", "光明"] },
  gen: { name: "艮", direction: "东北", element: "土", aspects: ["少男", "学业", "静止", "转折"] },
  dui: { name: "兑", direction: "西", element: "金", aspects: ["少女", "口才", "娱乐", "收获"] },
};

/**
 * 五行相生相克
 */
const FIVE_ELEMENTS = {
  wood: { name: "木", generates: "火", controls: "土", color: "绿色", direction: "东" },
  fire: { name: "火", generates: "土", controls: "金", color: "红色", direction: "南" },
  earth: { name: "土", generates: "金", controls: "水", color: "黄色", direction: "中央" },
  metal: { name: "金", generates: "水", controls: "木", color: "白色", direction: "西" },
  water: { name: "水", generates: "木", controls: "火", color: "黑色", direction: "北" },
};

/**
 * 风水分析主函数 - 本地引擎
 */
export async function analyzeFengshui(imageUrls: string[], questionDescription?: string) {
  console.log("[Fengshui Engine] Starting local fengshui analysis...");
  console.log(`[Fengshui Engine] Processing ${imageUrls.length} image(s)`);

  try {
    // 从用户描述中推断房间类型
    const roomType = inferRoomType(questionDescription);
    const direction = inferDirection(questionDescription);
    console.log(`[Fengshui Engine] Inferred room type: ${roomType}, direction: ${direction || 'unknown'}`);

    // 第一步：图像特征提取（使用 sharp 色彩/亮度分析）
    console.log("[Fengshui Engine] Step 1: Extracting room features...");
    const roomFeatures = await extractRoomFeatures(imageUrls, roomType, direction);
    console.log("[Fengshui Engine] Room features extracted:", JSON.stringify(roomFeatures).substring(0, 200));

    // 第二步：风水计算（规则库匹配）
    console.log("[Fengshui Engine] Step 2: Calculating fengshui...");
    const calculationResult = await calculateRoomFengshui(roomFeatures);
    console.log(`[Fengshui Engine] Calculation complete, overall score: ${calculationResult.overallScore}`);
    console.log(`[Fengshui Engine] Positive: ${calculationResult.positiveCount}, Negative: ${calculationResult.negativeCount}`);

    // 第三步：生成解读报告（本地模板引擎）
    console.log("[Fengshui Engine] Step 3: Generating interpretation...");
    const interpretation = await generateFengshuiAIInterpretation(calculationResult, roomType);

    // 生成五行平衡评分
    const elementBalance = generateElementBalance(roomFeatures, calculationResult);

    // 生成风水问题列表
    const issues = generateIssuesList(calculationResult);

    // 组装最终分析结果
    const analysis = {
      overallSummary: interpretation.overallSummary,
      score: calculationResult.overallScore,
      elementBalance,
      sections: interpretation.sections.map((section) => ({
        title: section.title,
        content: section.content,
        score: section.score,
      })),
      issues,
      recommendations: generateFengshuiRecommendations(calculationResult, roomType, questionDescription),
    };

    console.log("[Fengshui Engine] Analysis complete, overall score:", analysis.score);
    return analysis;

  } catch (error) {
    console.error("[Fengshui Engine] Analysis error:", error);
    return generateFallbackFengshuiAnalysis(questionDescription);
  }
}

/**
 * 从用户描述中推断房间类型
 */
function inferRoomType(description?: string): string {
  if (!description) return "living_room";
  const text = description.toLowerCase();
  if (text.includes("卧室") || text.includes("bedroom") || text.includes("睡房")) return "bedroom";
  if (text.includes("书房") || text.includes("study") || text.includes("办公")) return "study";
  if (text.includes("厨房") || text.includes("kitchen")) return "kitchen";
  if (text.includes("卫生间") || text.includes("bathroom") || text.includes("厕所")) return "bathroom";
  if (text.includes("玄关") || text.includes("entrance") || text.includes("门口")) return "entrance";
  if (text.includes("阳台") || text.includes("balcony")) return "balcony";
  if (text.includes("餐厅") || text.includes("dining")) return "dining_room";
  return "living_room";
}

/**
 * 从用户描述中推断朝向
 */
function inferDirection(description?: string): string | undefined {
  if (!description) return undefined;
  const text = description;
  if (text.includes("坐北朝南") || text.includes("朝南")) return "south";
  if (text.includes("坐南朝北") || text.includes("朝北")) return "north";
  if (text.includes("朝东")) return "east";
  if (text.includes("朝西")) return "west";
  if (text.includes("东南")) return "southeast";
  if (text.includes("东北")) return "northeast";
  if (text.includes("西南")) return "southwest";
  if (text.includes("西北")) return "northwest";
  return undefined;
}

/**
 * 生成五行平衡评分
 */
function generateElementBalance(
  roomFeatures: any,
  calculationResult: any
): { wood: number; fire: number; earth: number; metal: number; water: number } {
  const score = calculationResult.overallScore;
  const baseScore = Math.max(40, Math.min(90, score));

  // 根据房间特征调整五行分布
  const dominantColor = roomFeatures.dominant_color || "neutral";
  const hasPlants = (roomFeatures.plant_count || 0) > 0;
  const hasWater = roomFeatures.has_water_feature || false;
  const lightingGood = roomFeatures.lighting_quality === "good";

  let wood = baseScore + (hasPlants ? 10 : -5);
  let fire = baseScore + (lightingGood ? 8 : -3);
  let earth = baseScore + 2; // 土为中央，相对稳定
  let metal = baseScore + (dominantColor === "white" || dominantColor === "gray" ? 5 : -2);
  let water = baseScore + (hasWater ? 12 : -5);

  // 根据颜色调整
  if (dominantColor === "green") wood += 8;
  if (dominantColor === "red" || dominantColor === "orange") fire += 8;
  if (dominantColor === "yellow" || dominantColor === "brown") earth += 8;
  if (dominantColor === "blue" || dominantColor === "black") water += 5;

  // 限制范围
  const clamp = (v: number) => Math.max(30, Math.min(95, Math.round(v)));

  return {
    wood: clamp(wood),
    fire: clamp(fire),
    earth: clamp(earth),
    metal: clamp(metal),
    water: clamp(water),
  };
}

/**
 * 生成风水问题列表
 */
function generateIssuesList(
  calculationResult: any
): Array<{ type: string; description: string; severity: string; solution: string }> {
  const issues: Array<{ type: string; description: string; severity: string; solution: string }> = [];

  if (calculationResult.items) {
    for (const item of calculationResult.items) {
      if (item.score < 60) {
        issues.push({
          type: item.category || item.title,
          description: item.interpretation,
          severity: item.score < 40 ? "高" : item.score < 50 ? "中" : "低",
          solution: item.suggestion || "建议咨询专业风水师进行调整",
        });
      }
    }
  }

  // 如果没有识别到问题，添加通用提醒
  if (issues.length === 0) {
    issues.push({
      type: "整体布局",
      description: "整体风水格局尚可，但仍有优化空间",
      severity: "低",
      solution: "建议在财位摆放绿色植物或水晶，增强财运能量",
    });
  }

  return issues;
}

/**
 * 生成风水优化建议
 */
function generateFengshuiRecommendations(
  calculationResult: any,
  roomType: string,
  questionDescription?: string
): Array<{ category: string; advice: string; priority: string }> {
  const recommendations: Array<{ category: string; advice: string; priority: string }> = [];
  const score = calculationResult.overallScore;
  const roomName = ROOM_TYPE_NAMES[roomType] || "房间";

  // 财运风水建议
  recommendations.push({
    category: "财运",
    advice: score >= 70
      ? `您的${roomName}财位风水良好。建议在财位（通常为进门对角线位置）摆放常绿植物如发财树或金钱树，增强财运能量。保持财位整洁明亮，避免堆放杂物。可以在财位放置水晶球或聚宝盆，进一步催旺财运。`
      : `您的${roomName}财位风水有待改善。建议首先清理财位区域的杂物，保持整洁。在财位摆放一盆常绿植物，如发财树、金钱树或万年青。确保财位光线充足，如果自然光不够，可以增加一盏暖色调的灯。避免在财位放置垃圾桶或尖锐物品。`,
    priority: score < 60 ? "高" : "中",
  });

  // 事业风水建议
  recommendations.push({
    category: "事业",
    advice: score >= 70
      ? `事业方面的风水布局不错。建议在书桌或办公区域的左侧（青龙位）放置一些提升事业运的物品，如文昌塔或笔筒。保持工作区域整洁有序，有助于提升工作效率和事业运势。`
      : `事业方面建议优化工作区域的风水布局。确保书桌或办公桌不要背对门口，最好能看到门的方向。在桌面左侧放置台灯或绿色植物，增强青龙位的能量。避免在头顶正上方有横梁，如果有，可以用装饰物遮挡或移动桌子位置。`,
    priority: score < 60 ? "高" : "中",
  });

  // 健康风水建议
  recommendations.push({
    category: "健康",
    advice: score >= 70
      ? `健康方面的风水格局良好。建议保持室内空气流通，定期开窗通风。可以在室内摆放一些净化空气的植物，如绿萝、吊兰或虎皮兰。保持室内光线充足，阳光是最好的消毒剂。`
      : `健康方面需要注意改善室内环境。首先确保通风良好，避免潮湿和阴暗。检查是否有横梁压顶的情况，如果有，建议移动家具位置或用装饰物化解。在室内摆放一些绿色植物，改善空气质量。保持室内整洁，减少灰尘和杂物的堆积。`,
    priority: score < 60 ? "高" : "中",
  });

  // 感情风水建议
  recommendations.push({
    category: "感情",
    advice: score >= 70
      ? `感情方面的风水布局不错。建议在卧室西南方（坤位）放置一对鸳鸯或粉色水晶，增强桃花运和感情运。保持卧室温馨整洁，避免放置过多电子产品。床头可以放置一对相同的台灯，象征成双成对。`
      : `感情方面建议优化卧室的风水布局。首先确保床头有靠墙，象征有靠山。避免床头对着门或镜子，这会影响感情稳定。在卧室的西南方放置粉色或红色的装饰物，增强感情运。保持卧室的温馨氛围，避免过于冷清或杂乱。`,
    priority: "中",
  });

  // 根据房间类型添加特定建议
  const roomSpecificAdvice: Record<string, { category: string; advice: string; priority: string }> = {
    bedroom: {
      category: "卧室专项",
      advice: "卧室是休息的地方，风水布局尤为重要。建议：1) 床头靠实墙，不要靠窗；2) 避免镜子对床；3) 床不要正对门口；4) 床上方不要有横梁或吊灯；5) 保持卧室色调温馨柔和，以暖色调为主。",
      priority: "高",
    },
    study: {
      category: "书房专项",
      advice: "书房是学习和工作的地方，文昌位的布局很重要。建议：1) 书桌面向门口方向，但不要正对门；2) 在书桌上放置文昌塔或四支毛笔；3) 书架不要压在头顶上方；4) 保持书房整洁有序；5) 可以在书房放置一盆富贵竹，增强文昌运。",
      priority: "高",
    },
    kitchen: {
      category: "厨房专项",
      advice: "厨房代表家庭的财库，风水布局影响全家的财运和健康。建议：1) 灶台不要正对水槽（水火相冲）；2) 灶台不要正对厨房门；3) 保持厨房整洁明亮；4) 可以在厨房放置一些黄色或橙色的装饰物，增强土元素；5) 定期清理冰箱和橱柜，避免食物过期。",
      priority: "高",
    },
    living_room: {
      category: "客厅专项",
      advice: "客厅是家庭的核心区域，风水布局影响全家的运势。建议：1) 沙发靠实墙放置，象征有靠山；2) 茶几大小要与沙发匹配；3) 电视墙不要放置过多尖锐装饰物；4) 在客厅的财位放置绿色植物；5) 保持客厅明亮通风，避免阴暗潮湿。",
      priority: "高",
    },
  };

  if (roomSpecificAdvice[roomType]) {
    recommendations.push(roomSpecificAdvice[roomType]);
  }

  // 用户特定关注点
  if (questionDescription) {
    recommendations.push({
      category: "特别关注",
      advice: `关于您特别关注的"${questionDescription}"方面，综合风水分析来看，建议从环境布局入手进行调整。风水讲究"藏风聚气"，保持室内空气流通但不要形成穿堂风。在关键位置摆放适当的风水物品，如水晶、植物或铜器，可以有效改善相关运势。同时注意保持环境整洁，定期清理不需要的物品，让正能量自由流动。`,
      priority: "高",
    });
  }

  return recommendations;
}

/**
 * 生成兜底分析结果
 */
function generateFallbackFengshuiAnalysis(questionDescription?: string) {
  return {
    overallSummary: "综观您的居住环境，整体风水格局中等偏上。空间布局基本合理，但仍有一些可以优化的地方。建议从采光通风、家具摆放、色彩搭配和植物配置四个方面进行调整，可以有效提升居住环境的风水能量，改善家人的运势和健康。",
    score: 68,
    elementBalance: { wood: 65, fire: 60, earth: 70, metal: 62, water: 55 },
    sections: [
      { title: "整体格局分析", content: "您的居住空间整体格局尚可，空间利用较为合理。建议保持主要通道的畅通，避免家具摆放过于拥挤。客厅作为家庭的核心区域，应该保持宽敞明亮，有利于气场的流通和聚集。", score: 68 },
      { title: "采光通风评估", content: "室内采光和通风是风水中非常重要的因素。建议白天尽量利用自然光，晚上使用暖色调的灯光。定期开窗通风，保持空气清新。避免使用过于阴暗的窗帘，让阳光能够照进室内。", score: 65 },
      { title: "色彩搭配分析", content: "室内色彩对风水有重要影响。建议以暖色调为主，搭配适当的冷色调，营造温馨和谐的氛围。避免大面积使用黑色或深灰色，这些颜色容易造成压抑感。可以适当使用绿色和蓝色的装饰物，增添生机。", score: 70 },
      { title: "家具摆放建议", content: "家具的摆放直接影响气场的流通。建议沙发靠墙放置，不要背对门口。床头靠实墙，避免对着门或窗。书桌面向开阔的方向，有利于思维的开阔。避免在头顶正上方放置重物或吊灯。", score: 67 },
    ],
    issues: [
      { type: "五行平衡", description: "水元素略显不足，可能影响财运和人际关系", severity: "中", solution: "建议在北方位置放置小型水景或蓝色装饰物" },
      { type: "采光问题", description: "部分区域采光不足，影响阳气聚集", severity: "低", solution: "增加暖色调灯光，使用浅色窗帘" },
    ],
    recommendations: [
      { category: "财运", advice: "建议在财位放置常绿植物，保持财位整洁明亮。", priority: "高" },
      { category: "事业", advice: "优化工作区域布局，确保书桌面向开阔方向。", priority: "中" },
      { category: "健康", advice: "保持室内空气流通，摆放净化空气的植物。", priority: "中" },
      { category: "感情", advice: "在卧室西南方放置粉色装饰物，增强感情运。", priority: "中" },
    ],
  };
}

/**
 * 生成风水分析报告(Markdown格式)
 */
export function generateFengshuiReport(analysis: any, userName?: string): string {
  const report = `# 风水分析报告

---

**报告生成时间:** ${new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}

${userName ? `**尊敬的** ${userName}` : '**尊敬的缘主**'}

感恩您选择五台山善途团队的风水分析服务。风水学是中华传统文化的瑰宝,通过合理布局和调整环境,可以改善居住者的运势和生活质量。本报告基于您提供的环境照片,由我们的专业大师进行深度解读,希望能为您的居住环境提供有益的指引。

---

## 综合评分

**整体风水评分:** ${analysis.score}/100

${analysis.overallSummary}

---

## 五行平衡分析

| 五行 | 评分 | 状态 |
|------|------|------|
| 木 | ${analysis.elementBalance.wood}/100 | ${analysis.elementBalance.wood >= 70 ? '平衡' : analysis.elementBalance.wood >= 50 ? '需调整' : '失衡'} |
| 火 | ${analysis.elementBalance.fire}/100 | ${analysis.elementBalance.fire >= 70 ? '平衡' : analysis.elementBalance.fire >= 50 ? '需调整' : '失衡'} |
| 土 | ${analysis.elementBalance.earth}/100 | ${analysis.elementBalance.earth >= 70 ? '平衡' : analysis.elementBalance.earth >= 50 ? '需调整' : '失衡'} |
| 金 | ${analysis.elementBalance.metal}/100 | ${analysis.elementBalance.metal >= 70 ? '平衡' : analysis.elementBalance.metal >= 50 ? '需调整' : '失衡'} |
| 水 | ${analysis.elementBalance.water}/100 | ${analysis.elementBalance.water >= 70 ? '平衡' : analysis.elementBalance.water >= 50 ? '需调整' : '失衡'} |

---

## 详细分析

${analysis.sections.map((section: any, index: number) => `
### ${index + 1}. ${section.title}

${section.content}

${section.score ? `**评分:** ${section.score}/100\n` : ''}
---
`).join('\n')}

## 风水问题识别

${analysis.issues.length > 0 ? analysis.issues.map((issue: any, index: number) => `
### ${index + 1}. ${issue.type}

**问题描述:** ${issue.description}

**严重程度:** ${issue.severity}

**化解方法:** ${issue.solution}

---
`).join('\n') : '未发现明显风水问题。'}

## 优化建议

${analysis.recommendations.map((rec: any, index: number) => `
### ${index + 1}. ${rec.category}

${rec.advice}

**优先级:** ${rec.priority}

---
`).join('\n')}

## 回向祝福

愿此分析能为您的居住环境带来正能量。五台山善途团队祝您:

- 家宅平安,风生水起
- 财源广进,富贵安康
- 事业顺遂,步步高升
- 家庭和睦,幸福美满

---

## 法律声明

本报告内容仅供参考,不构成任何法律、医疗或投资建议。风水学是传统文化的一部分,应理性看待。居住环境的改善应结合实际情况和科学原理,避免盲目迷信。

---

**五台山善途团队**  
*传承千年智慧,照亮人生之路*

---
`;

  return report;
}
