/**
 * 手相分析引擎 - 本地版
 * 基于传统中国手相学的分析系统
 * 完全本地运行，不依赖任何外部API
 * 
 * 流程：图像特征提取 → 规则库匹配 → 命理计算 → 模板报告生成
 */

import { extractPalmFeatures } from "../image-recognition";
import { calculatePalmPhysiognomy } from "../physiognomy-engine";
import { generateAIInterpretation } from "../ai-interpretation";

/**
 * 三大主线定义
 */
const MAJOR_LINES = {
  life: { 
    name: "生命线", 
    location: "从拇指与食指之间出发,环绕拇指根部",
    aspects: ["生命力", "健康状况", "重大生命事件", "寿命长短"]
  },
  head: { 
    name: "智慧线/头脑线", 
    location: "从拇指与食指之间出发,横向延伸",
    aspects: ["智力水平", "思维方式", "决策能力", "学习能力"]
  },
  heart: { 
    name: "感情线/心线", 
    location: "从小指下方出发,横向延伸",
    aspects: ["感情状态", "爱情运势", "情感表达", "婚姻质量"]
  },
};

/**
 * 手型分类(五行)
 */
const HAND_TYPES: Record<string, { name: string; characteristics: string; personality: string }> = {
  木形手: { name: "木形手", characteristics: "手掌长方形,手指修长", personality: "理想主义、艺术气质、敏感细腻" },
  火形手: { name: "火形手", characteristics: "手掌长方形,手指短", personality: "热情活力、行动力强、冲动直接" },
  土形手: { name: "土形手", characteristics: "手掌方形,手指短", personality: "务实稳重、脚踏实地、可靠诚实" },
  金形手: { name: "金形手", characteristics: "手掌方形,手指修长", personality: "理性冷静、逻辑清晰、追求完美" },
  水形手: { name: "水形手", characteristics: "手掌圆形,手指圆润", personality: "灵活变通、直觉敏锐、富有想象力" },
};

/**
 * 手相分析主函数 - 本地引擎
 */
export async function analyzePalmReading(imageUrls: string[], questionDescription?: string) {
  console.log("[PalmReading Engine] Starting local palm analysis...");
  console.log(`[PalmReading Engine] Processing ${imageUrls.length} image(s)`);

  try {
    // 第一步：图像特征提取（使用 sharp 图像分析）
    console.log("[PalmReading Engine] Step 1: Extracting palm features...");
    const palmFeatures = await extractPalmFeatures(imageUrls[0]);
    console.log("[PalmReading Engine] Hand type:", palmFeatures.handType);
    console.log("[PalmReading Engine] Lines extracted:", Object.keys(palmFeatures.lines).length);
    console.log("[PalmReading Engine] Hills extracted:", Object.keys(palmFeatures.hills).length);

    // 第二步：命理计算（规则库匹配）
    console.log("[PalmReading Engine] Step 2: Calculating palm physiognomy...");
    const calculationResult = await calculatePalmPhysiognomy(palmFeatures);
    console.log("[PalmReading Engine] Calculation complete, items scored:", Object.keys(calculationResult).length);

    // 第三步：生成解读报告（本地模板引擎）
    console.log("[PalmReading Engine] Step 3: Generating interpretation...");
    const interpretation = await generateAIInterpretation(calculationResult, "palm");

    // 计算综合评分
    const scores = Object.values(calculationResult).map(v => v.score);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 72;

    // 获取手型信息
    const handTypeKey = palmFeatures.handType || "土形手";
    const handTypeInfo = HAND_TYPES[handTypeKey] || HAND_TYPES["土形手"];

    // 组装最终分析结果
    const analysis = {
      overallSummary: interpretation.overallSummary,
      score: avgScore,
      handType: {
        type: handTypeInfo.name,
        description: handTypeInfo.characteristics,
        personality: handTypeInfo.personality,
      },
      sections: interpretation.sections.map((section) => ({
        title: section.title,
        content: section.content,
        score: section.score,
      })),
      recommendations: generatePalmRecommendations(calculationResult, handTypeKey, questionDescription),
    };

    console.log("[PalmReading Engine] Analysis complete, overall score:", analysis.score);
    return analysis;

  } catch (error) {
    console.error("[PalmReading Engine] Analysis error:", error);
    return generateFallbackPalmAnalysis(questionDescription);
  }
}

/**
 * 生成手相人生建议
 */
function generatePalmRecommendations(
  calculationResult: Record<string, { score: number; category: string; interpretations: string[] }>,
  handType: string,
  questionDescription?: string
): Array<{ category: string; advice: string }> {
  const recommendations: Array<{ category: string; advice: string }> = [];
  const entries = Object.entries(calculationResult);

  // 根据手型给出性格建议
  const handTypeAdvice: Record<string, string> = {
    木形手: "您属于木形手，天生具有艺术气质和理想主义精神。建议将这份创造力运用到事业中，从事设计、文学、艺术等领域会有不错的发展。同时注意不要过于理想化，适当接受现实的不完美。",
    火形手: "您属于火形手，充满热情和行动力。建议将这份能量引导到正确的方向，在创业或销售领域会有很好的表现。同时注意控制冲动，重大决策前多思考三分钟。",
    土形手: "您属于土形手，性格务实稳重，脚踏实地。建议在技术、管理或金融领域深耕，您的可靠和诚实是最大的优势。同时可以适当增加一些冒险精神，不要错过好的机遇。",
    金形手: "您属于金形手，理性冷静，逻辑清晰。建议在科研、法律、工程等需要精确思维的领域发展。同时注意不要过于追求完美，学会接受\"足够好\"，生活会更加轻松。",
    水形手: "您属于水形手，灵活变通，直觉敏锐。建议在咨询、教育、心理等需要洞察力的领域发展。同时注意保持专注，不要同时追求太多目标，集中精力才能取得突破。",
  };

  recommendations.push({
    category: "性格与天赋",
    advice: handTypeAdvice[handType] || handTypeAdvice["土形手"],
  });

  // 事业建议 - 基于事业线和智慧线
  const careerItems = entries.filter(([name]) => 
    name.includes("事业") || name.includes("智慧")
  );
  const careerAvg = careerItems.length > 0 
    ? careerItems.reduce((sum, [, v]) => sum + v.score, 0) / careerItems.length 
    : 70;

  if (careerAvg >= 75) {
    recommendations.push({
      category: "事业发展",
      advice: "您的事业线和智慧线表现优秀，说明您在事业上有很强的发展潜力。建议勇于承担更多责任，积极争取晋升机会。您的思维清晰、决策能力强，适合担任管理或领导角色。同时保持学习的热情，不断更新知识储备，事业将持续上升。",
    });
  } else if (careerAvg >= 60) {
    recommendations.push({
      category: "事业发展",
      advice: "您的事业线表现中等，说明事业发展需要更多的努力和耐心。建议制定明确的职业规划，一步一个脚印地前进。可以考虑参加专业培训或考取相关证书，提升竞争力。在工作中注重团队合作，广结善缘，贵人的帮助将加速您的事业发展。",
    });
  } else {
    recommendations.push({
      category: "事业发展",
      advice: "事业方面建议稳扎稳打，当前阶段适合积累经验和提升能力。不要与他人比较，每个人都有自己的节奏。可以尝试发展副业或兴趣爱好，也许会找到新的发展方向。保持积极的心态，相信付出终有回报。",
    });
  }

  // 财运建议 - 基于财运线
  const wealthItems = entries.filter(([name]) => 
    name.includes("财") || name.includes("金星")
  );
  const wealthAvg = wealthItems.length > 0 
    ? wealthItems.reduce((sum, [, v]) => sum + v.score, 0) / wealthItems.length 
    : 70;

  if (wealthAvg >= 70) {
    recommendations.push({
      category: "财富理财",
      advice: "您的财运线和金星丘表现不错，说明您有较好的理财天赋。建议学习系统的理财知识，制定合理的投资计划。可以考虑多元化投资，分散风险。同时注意积德行善，布施供养，财运将更加旺盛。",
    });
  } else {
    recommendations.push({
      category: "财富理财",
      advice: "财运方面建议以稳健为主，避免高风险投资。养成记账和储蓄的习惯，合理规划每月支出。可以从小额理财开始，逐步积累经验。多行善事，积累福报，财运自然会逐渐好转。",
    });
  }

  // 感情建议 - 基于感情线和婚姻线
  const loveItems = entries.filter(([name]) => 
    name.includes("感情") || name.includes("婚姻")
  );
  const loveAvg = loveItems.length > 0 
    ? loveItems.reduce((sum, [, v]) => sum + v.score, 0) / loveItems.length 
    : 70;

  if (loveAvg >= 70) {
    recommendations.push({
      category: "感情婚姻",
      advice: "您的感情线深长清晰，说明您是一个重感情的人，在爱情中真诚投入。建议珍惜身边的感情，用心经营每一段关系。已有伴侣者多花时间陪伴对方，制造浪漫惊喜。单身者可以多参加社交活动，缘分就在不远处。",
    });
  } else {
    recommendations.push({
      category: "感情婚姻",
      advice: "感情方面建议多一些耐心和包容。在与伴侣相处时，学会表达自己的感受，同时也要倾听对方的心声。不要因为小事产生争执，大事化小，小事化了。单身者不必急于寻找伴侣，先充实自己，提升个人魅力。",
    });
  }

  // 健康建议 - 基于生命线和健康线
  const healthItems = entries.filter(([name]) => 
    name.includes("生命") || name.includes("健康")
  );
  const healthAvg = healthItems.length > 0 
    ? healthItems.reduce((sum, [, v]) => sum + v.score, 0) / healthItems.length 
    : 70;

  recommendations.push({
    category: "健康养生",
    advice: healthAvg >= 70
      ? "您的生命线表现良好，说明您的生命力旺盛，体质较好。建议继续保持健康的生活方式，规律作息，适量运动。可以尝试太极、瑜伽等养生运动，既能强身健体，又能修心养性。饮食方面注意营养均衡，保持乐观的心态。"
      : "健康方面需要多加关注。建议养成规律的作息习惯，每天保证充足的睡眠。适量运动，如散步、慢跑或游泳。饮食上注意清淡营养，少吃油腻和辛辣食物。定期进行健康检查，做到早发现早治疗。保持心情舒畅，学会释放压力。",
  });

  // 用户特定关注点
  if (questionDescription) {
    recommendations.push({
      category: "特别关注",
      advice: `关于您特别关注的"${questionDescription}"方面，综合您的手相特征来看，建议保持积极乐观的心态。您的手相显示您具有克服困难的能力和韧性，只要坚持不懈，一定能够达成目标。在面对选择时，可以多听从内心的声音，您的直觉往往是正确的。`,
    });
  }

  return recommendations;
}

/**
 * 生成兜底分析结果
 */
function generateFallbackPalmAnalysis(questionDescription?: string) {
  return {
    overallSummary: "综观您的手相，整体运势平稳，各方面表现均衡。您的手掌纹路清晰，主要掌纹分布合理，显示出稳重踏实的性格特质。生命线环绕有力，说明您的生命力旺盛；智慧线延伸适中，表明您思维清晰、判断力强；感情线深长，说明您重感情、待人真诚。整体来看，您的人生将在稳步中前进，通过不断的努力和积累，终将收获丰硕的成果。",
    score: 72,
    handType: {
      type: "土形手",
      description: "手掌方形,手指短",
      personality: "务实稳重、脚踏实地、可靠诚实",
    },
    sections: [
      { title: "手型分析", content: "您的手型属于土形手，手掌方正，手指粗壮有力。这种手型的人性格务实稳重，做事脚踏实地，为人可靠诚实。在事业上适合从事需要耐心和毅力的工作，如管理、技术、金融等领域。您的优势在于坚持和可靠，只要认定了方向，就会坚定不移地走下去。", score: 72 },
      { title: "生命线分析", content: "您的生命线弧度适中，环绕拇指根部延伸，长度适当。这表明您的生命力旺盛，体质较好，能够承受较大的工作和生活压力。生命线的深度表明您的精力充沛，但也需要注意劳逸结合，避免过度消耗。中年以后注意保养，可以保持良好的健康状态。", score: 73 },
      { title: "智慧线分析", content: "您的智慧线走向平稳，长度适中。这表明您思维清晰，逻辑能力强，善于分析问题。在学习和工作中，您能够快速理解新知识，做出正确的判断。建议多读书学习，不断拓展知识面，您的智慧将成为事业发展的重要助力。", score: 71 },
      { title: "感情线分析", content: "您的感情线深度适中，延伸长度合理。这表明您在感情方面比较理性，能够平衡感性和理性。在恋爱和婚姻中，您是一个可靠的伴侣，虽然不善于甜言蜜语，但会用实际行动表达爱意。建议在感情中多一些浪漫和表达，让对方感受到您的心意。", score: 70 },
      { title: "事业线分析", content: "您的事业线清晰度适中，表明事业发展需要通过自身努力来实现。不要期望一步登天，而是要一步一个脚印地前进。中年以后事业运势会逐渐好转，之前的积累将开始发挥作用。建议保持学习的热情，不断提升专业能力。", score: 70 },
    ],
    recommendations: [
      { category: "性格与天赋", advice: "您属于土形手，性格务实稳重。建议在技术、管理或金融领域深耕，您的可靠和诚实是最大的优势。" },
      { category: "事业发展", advice: "建议制定明确的职业规划，一步一个脚印地前进。注重团队合作，广结善缘。" },
      { category: "财富理财", advice: "财运方面建议以稳健为主，养成储蓄习惯，合理规划支出。" },
      { category: "感情婚姻", advice: "感情方面建议多一些耐心和包容，用心经营每一段关系。" },
      { category: "健康养生", advice: "建议保持规律的作息和适量的运动，注意饮食营养均衡。" },
    ],
  };
}

/**
 * 生成手相分析报告(Markdown格式)
 */
export function generatePalmReadingReport(analysis: any, userName?: string): string {
  const report = `# 手相分析报告

---

**报告生成时间:** ${new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}

${userName ? `**尊敬的** ${userName}` : '**尊敬的缘主**'}

感恩您选择五台山善途团队的手相分析服务。手相学是中华传统文化的重要组成部分,通过观察手掌的纹路、形状和特征,可以洞察一个人的性格、天赋和人生轨迹。本报告基于您提供的手掌照片,由我们的专业大师进行深度解读,希望能为您的人生提供有益的指引。

---

## 综合评分

**整体运势评分:** ${analysis.score}/100

${analysis.overallSummary}

---

## 手型分类

**手型:** ${analysis.handType.type}

**特征:** ${analysis.handType.description}

**性格:** ${analysis.handType.personality}

---

## 详细分析

${analysis.sections.map((section: any, index: number) => `
### ${index + 1}. ${section.title}

${section.content}

${section.score ? `**评分:** ${section.score}/100\n` : ''}
---
`).join('\n')}

## 人生建议

根据您的手相特征,我们为您提供以下具体建议:

${analysis.recommendations.map((rec: any, index: number) => `
### ${index + 1}. ${rec.category}

${rec.advice}
`).join('\n')}

---

## 回向祝福

愿此分析能为您带来启迪与指引。五台山善途团队祝您:

- 事业顺遂,步步高升
- 财源广进,富贵安康
- 感情美满,家庭和睦
- 身体健康,福寿绵长

---

## 法律声明

本报告内容仅供参考,不构成任何法律、医疗或投资建议。手相学是传统文化的一部分,应理性看待。人生运势受多种因素影响,个人努力和选择才是决定命运的关键。

---

**五台山善途团队**  
*传承千年智慧,照亮人生之路*

---
`;

  return report;
}
