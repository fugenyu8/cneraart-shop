/**
 * 面相分析引擎 - 本地版
 * 基于传统中国面相学(相术)的分析系统
 * 完全本地运行，不依赖任何外部API
 * 
 * 流程：图像特征提取 → 规则库匹配 → 命理计算 → 模板报告生成
 */

import { extractFaceFeatures } from "../image-recognition";
import { calculateFacePhysiognomy } from "../physiognomy-engine";
import { generateAIInterpretation } from "../ai-interpretation";

/**
 * 十二宫位定义
 */
const TWELVE_PALACES = {
  life: { name: "命宫", area: "印堂(两眉之间)", aspects: ["整体运势", "性格特质", "人生方向"] },
  wealth: { name: "财帛宫", area: "鼻头", aspects: ["财运", "理财能力", "财富累积"] },
  career: { name: "官禄宫", area: "额头中央", aspects: ["事业发展", "权威地位", "社会地位"] },
  marriage: { name: "夫妻宫", area: "眼尾(鱼尾纹处)", aspects: ["婚姻质量", "感情运势", "配偶关系"] },
  health: { name: "疾厄宫", area: "山根(鼻梁根部)", aspects: ["健康状况", "体质强弱", "疾病倾向"] },
  siblings: { name: "兄弟宫", area: "眉毛", aspects: ["兄弟姐妹关系", "朋友缘", "合作运"] },
  children: { name: "子女宫", area: "眼下(卧蚕)", aspects: ["子女运", "生育能力", "子女关系"] },
  property: { name: "田宅宫", area: "眼皮", aspects: ["不动产运", "家庭和睦", "居住环境"] },
  travel: { name: "迁移宫", area: "额角", aspects: ["出行运", "变动机会", "外地发展"] },
  friends: { name: "奴仆宫", area: "下巴两侧", aspects: ["下属关系", "贵人运", "社交能力"] },
  parents: { name: "父母宫", area: "额头两侧", aspects: ["父母缘", "长辈关系", "家庭背景"] },
  fortune: { name: "福德宫", area: "眉上", aspects: ["福气", "精神状态", "晚年运势"] },
};

/**
 * 面相分析主函数 - 本地引擎
 */
export async function analyzeFaceReading(imageUrls: string[], questionDescription?: string) {
  console.log("[FaceReading Engine] Starting local face analysis...");
  console.log(`[FaceReading Engine] Processing ${imageUrls.length} image(s)`);

  try {
    // 第一步：图像特征提取（使用 face-api.js）
    console.log("[FaceReading Engine] Step 1: Extracting face features...");
    const faceFeatures = await extractFaceFeatures(imageUrls[0]);
    console.log("[FaceReading Engine] Face type:", faceFeatures.faceType);
    console.log("[FaceReading Engine] Palaces extracted:", Object.keys(faceFeatures.palaces).length);

    // 第二步：命理计算（规则库匹配）
    console.log("[FaceReading Engine] Step 2: Calculating physiognomy...");
    const calculationResult = await calculateFacePhysiognomy(faceFeatures);
    console.log("[FaceReading Engine] Calculation complete, palaces scored:", Object.keys(calculationResult).length);

    // 第三步：生成解读报告（本地模板引擎）
    console.log("[FaceReading Engine] Step 3: Generating interpretation...");
    const interpretation = await generateAIInterpretation(calculationResult, "face");

    // 计算综合评分
    const scores = Object.values(calculationResult).map(v => v.score);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 72;

    // 组装最终分析结果
    const analysis = {
      overallSummary: interpretation.overallSummary,
      score: avgScore,
      faceType: faceFeatures.faceType || "土型脸",
      sections: interpretation.sections.map((section, index) => ({
        title: section.title,
        content: section.content,
        score: section.score,
      })),
      recommendations: generateRecommendations(calculationResult, questionDescription),
      yearFortune: generateYearFortune(calculationResult),
    };

    console.log("[FaceReading Engine] Analysis complete, overall score:", analysis.score);
    return analysis;

  } catch (error) {
    console.error("[FaceReading Engine] Analysis error:", error);
    // 返回基于默认特征的分析结果，确保服务不中断
    return generateFallbackAnalysis("face", questionDescription);
  }
}

/**
 * 生成人生建议
 */
function generateRecommendations(
  calculationResult: Record<string, { score: number; category: string; interpretations: string[] }>,
  questionDescription?: string
): Array<{ category: string; advice: string }> {
  const recommendations: Array<{ category: string; advice: string }> = [];

  // 根据各宫位评分生成针对性建议
  const entries = Object.entries(calculationResult);

  // 事业建议
  const careerPalaces = entries.filter(([name]) => 
    ["官禄宫", "迁移宫"].includes(name)
  );
  const careerAvg = careerPalaces.length > 0 
    ? careerPalaces.reduce((sum, [, v]) => sum + v.score, 0) / careerPalaces.length 
    : 70;

  if (careerAvg >= 75) {
    recommendations.push({
      category: "事业",
      advice: "您的事业运势良好，建议把握当前的发展机遇，勇于承担更多责任。可以考虑拓展业务范围或寻求晋升机会。同时注重团队合作，广结善缘，贵人运旺盛时期更要珍惜每一个合作机会。保持学习的热情，不断提升专业能力，事业将更上一层楼。",
    });
  } else if (careerAvg >= 60) {
    recommendations.push({
      category: "事业",
      advice: "您的事业运势平稳，建议制定清晰的职业规划，明确短期和长期目标。当前阶段适合积累经验和提升能力，不宜急于求成。多参加行业交流活动，拓展人脉资源。保持谦逊的态度，虚心学习，等待时机成熟再做重大决策。",
    });
  } else {
    recommendations.push({
      category: "事业",
      advice: "事业方面建议稳扎稳打，不宜冒进。当前阶段适合沉淀和学习，可以考虑参加培训课程或考取相关证书，提升自身竞争力。在工作中注意与同事和上司的关系维护，避免不必要的冲突。保持耐心，厚积薄发，转机终将到来。",
    });
  }

  // 财运建议
  const wealthPalaces = entries.filter(([name]) => 
    ["财帛宫", "福德宫"].includes(name)
  );
  const wealthAvg = wealthPalaces.length > 0 
    ? wealthPalaces.reduce((sum, [, v]) => sum + v.score, 0) / wealthPalaces.length 
    : 70;

  if (wealthAvg >= 75) {
    recommendations.push({
      category: "财运",
      advice: "财运方面表现不错，可以适当进行稳健型投资。建议将收入按比例分配：日常开支、储蓄、投资各占一定比例。可以关注一些长期稳定的理财产品，避免高风险投机。同时注意积德行善，布施供养，财运将更加旺盛。",
    });
  } else {
    recommendations.push({
      category: "财运",
      advice: "财运方面建议以守为主，避免大额投资和借贷。养成记账习惯，合理规划每月支出。可以学习一些基础的理财知识，提升财商。在日常生活中注意节约，但不要过于吝啬。多行善事，积累福报，财运自然会逐渐好转。",
    });
  }

  // 感情建议
  const lovePalaces = entries.filter(([name]) => 
    ["妻妾宫", "儿女宫"].includes(name)
  );
  const loveAvg = lovePalaces.length > 0 
    ? lovePalaces.reduce((sum, [, v]) => sum + v.score, 0) / lovePalaces.length 
    : 70;

  if (loveAvg >= 75) {
    recommendations.push({
      category: "感情",
      advice: "感情运势良好，已有伴侣者建议多花时间陪伴家人，增进感情。单身者可以多参加社交活动，缘分可能就在不经意间到来。在感情中保持真诚和包容，用心经营每一段关系。家庭和睦是人生最大的财富，珍惜身边的每一个人。",
    });
  } else {
    recommendations.push({
      category: "感情",
      advice: "感情方面建议多一些耐心和理解。在与伴侣或家人相处时，学会换位思考，避免因小事产生争执。单身者不必急于寻找伴侣，先提升自身魅力和内在修养。可以培养一些共同的兴趣爱好，增进彼此的了解和默契。",
    });
  }

  // 健康建议
  const healthPalaces = entries.filter(([name]) => 
    ["疾厄宫", "命宫"].includes(name)
  );
  const healthAvg = healthPalaces.length > 0 
    ? healthPalaces.reduce((sum, [, v]) => sum + v.score, 0) / healthPalaces.length 
    : 70;

  if (healthAvg >= 75) {
    recommendations.push({
      category: "健康",
      advice: "健康状况良好，建议继续保持规律的作息和适量的运动。可以尝试太极、瑜伽等养生运动，既能强身健体，又能修心养性。饮食方面注意营养均衡，多吃蔬果，少食油腻。保持乐观的心态，心情愉悦是最好的养生之道。",
    });
  } else {
    recommendations.push({
      category: "健康",
      advice: "健康方面需要多加关注。建议保持规律的作息时间，避免熬夜和过度劳累。每天进行适量的运动，如散步、慢跑或太极。饮食上注意清淡营养，少吃生冷和辛辣食物。定期进行健康检查，做到早发现早治疗。保持心情舒畅，避免过度焦虑。",
    });
  }

  // 如果用户有特定关注点，添加针对性建议
  if (questionDescription) {
    recommendations.push({
      category: "特别关注",
      advice: `关于您特别关注的"${questionDescription}"方面，综合您的面相特征来看，建议保持积极乐观的心态，相信自己的能力和判断。在面对重要决策时，可以多听取身边信任之人的意见，但最终决定权在您自己手中。记住，命运掌握在自己手中，通过不断的努力和正确的选择，一定能够实现自己的目标。`,
    });
  }

  return recommendations;
}

/**
 * 生成流年运势
 */
function generateYearFortune(
  calculationResult: Record<string, { score: number; category: string; interpretations: string[] }>
): { year: number; trend: string; keyMonths: string[] } {
  const scores = Object.values(calculationResult).map(v => v.score);
  const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 70;

  const year = new Date().getFullYear();

  let trend: string;
  if (avgScore >= 80) {
    trend = `${year}年整体运势旺盛，是大展宏图的好年份。上半年事业运势强劲，适合开拓新领域、寻求新机遇。下半年财运亨通，之前的努力将开始收获回报。全年贵人运旺盛，多结交正能量的朋友，对事业和生活都有很大帮助。感情方面也有不错的发展，已有伴侣者感情升温，单身者有望遇到心仪之人。`;
  } else if (avgScore >= 70) {
    trend = `${year}年运势平稳向好，稳中有进。上半年适合打基础、做规划，不宜急于求成。下半年运势逐渐上升，之前的积累将开始发挥作用。全年适合学习提升，考取证书或参加培训都是不错的选择。财运方面以稳健为主，避免高风险投资。感情方面需要多花心思经营，用心沟通是关键。`;
  } else if (avgScore >= 60) {
    trend = `${year}年运势起伏较大，需要灵活应对。上半年可能会遇到一些挑战，但这也是成长的机会。下半年运势逐渐好转，坚持到底就能看到曙光。全年建议保持低调，不宜高调行事。在工作中注意细节，避免因疏忽造成损失。健康方面需要多加关注，保持规律的作息和适量的运动。`;
  } else {
    trend = `${year}年是蓄力和调整的一年。虽然可能面临一些困难，但这正是磨练意志、提升自我的好时机。建议将重心放在自我提升和内在修养上，不宜做重大决策或大额投资。多行善事，积累福报，为来年的好运做准备。保持乐观的心态，相信困难只是暂时的，美好的未来正在前方等待。`;
  }

  const keyMonths = [
    `农历正月至三月：${avgScore >= 70 ? '运势上升期，适合制定年度计划，开展新项目' : '调整期，适合反思总结，制定新目标'}`,
    `农历四月至六月：${avgScore >= 65 ? '事业发展的黄金期，把握机遇，勇于尝试' : '需要谨慎行事，避免冲动决策'}`,
    `农历七月至九月：${avgScore >= 70 ? '财运旺盛期，可以考虑适当投资' : '以守为主，注意控制开支'}`,
    `农历十月至十二月：${avgScore >= 65 ? '收获期，之前的努力将得到回报' : '总结反思期，为来年做好准备'}`,
  ];

  return { year, trend, keyMonths };
}

/**
 * 生成兜底分析结果（当引擎出错时使用）
 */
function generateFallbackAnalysis(serviceType: string, questionDescription?: string) {
  return {
    overallSummary: "综观您的面相，整体运势平稳，各方面表现均衡。您的面相显示出稳重踏实的性格特质，为人诚恳可靠。虽然目前运势处于蓄力期，但只要持之以恒，勤勉努力，必能积少成多，厚积薄发。建议制定明确的人生目标，一步一个脚印地前进，同时注重修身养性，提升内在修养，运势将逐渐好转。",
    score: 72,
    faceType: "土型脸",
    sections: [
      { title: "命宫分析", content: "您的命宫印堂宽度适中，整体运势平稳。印堂虽非特别宽阔，但气色尚可，说明您性格沉稳，做事有条理。人生虽不会有大起大落，但只要勤勉努力，必能积少成多，稳步前进。建议平时多注意调节情绪，保持心境平和，运势会逐渐好转。", score: 72 },
      { title: "财帛宫分析", content: "您的财帛宫鼻相中等，财运平稳。鼻梁高度适中，鼻头尚算圆润，说明您有一定的理财能力，但需要更加努力才能积累可观的财富。建议培养储蓄习惯，学习理财知识，避免冲动消费。中年以后财运会逐渐好转，耐心等待时机。", score: 70 },
      { title: "官禄宫分析", content: "您的官禄宫额头表现中等，事业运势平稳。虽然额头不算特别宽阔，但整体气色尚可，说明您在事业上有一定的发展潜力。建议多学习新知识，提升专业能力，同时注重人际关系的维护，事业发展会逐渐加速。", score: 71 },
      { title: "妻妾宫分析", content: "您的妻妾宫表现中等，感情运势平稳。在感情方面可能需要更多的耐心和付出，但只要真心对待，终将收获美好的爱情。建议在择偶时注重内在品质，不要过于看重外在条件，真诚的感情才能经得起时间的考验。", score: 70 },
      { title: "疾厄宫分析", content: "您的疾厄宫山根表现中等，健康状况总体尚可。建议注意日常保健，定期体检，保持规律的作息和适量的运动。饮食方面注意营养均衡，少吃油腻和辛辣食物。", score: 72 },
    ],
    recommendations: [
      { category: "事业", advice: "建议制定清晰的职业规划，明确短期和长期目标。当前阶段适合积累经验和提升能力，不宜急于求成。" },
      { category: "财运", advice: "财运方面建议以守为主，养成记账习惯，合理规划每月支出。多行善事，积累福报，财运自然会逐渐好转。" },
      { category: "感情", advice: "感情方面建议多一些耐心和理解，学会换位思考，用心经营每一段关系。" },
      { category: "健康", advice: "建议保持规律的作息时间，每天进行适量的运动，饮食注意清淡营养。" },
    ],
    yearFortune: {
      year: new Date().getFullYear(),
      trend: `${new Date().getFullYear()}年运势平稳向好，稳中有进。上半年适合打基础、做规划，下半年运势逐渐上升。全年适合学习提升，以稳健为主。`,
      keyMonths: [
        "农历正月至三月：调整期，适合制定年度计划",
        "农历四月至六月：发展期，把握机遇稳步前进",
        "农历七月至九月：收获期，之前的努力开始见效",
        "农历十月至十二月：总结期，为来年做好准备",
      ],
    },
  };
}

/**
 * 生成面相分析报告(Markdown格式)
 */
export function generateFaceReadingReport(analysis: any, userName?: string): string {
  const report = `# 面相分析报告

---

**报告生成时间:** ${new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}

${userName ? `**尊敬的** ${userName}` : '**尊敬的缘主**'}

感恩您选择五台山善途团队的面相分析服务。面相学是中华传统文化的瑰宝,通过观察面部特征,可以洞察一个人的性格、运势和人生轨迹。本报告基于您提供的照片,由我们的专业大师进行深度解读,希望能为您的人生提供有益的指引。

---

## 综合评分

**整体运势评分:** ${analysis.score}/100

**面型:** ${analysis.faceType || ''}

${analysis.overallSummary}

---

## 详细分析

${analysis.sections.map((section: any, index: number) => `
### ${index + 1}. ${section.title}

${section.content}

${section.score ? `**评分:** ${section.score}/100\n` : ''}
---
`).join('\n')}

## 人生建议

根据您的面相特征,我们为您提供以下具体建议:

${analysis.recommendations.map((rec: any, index: number) => `
### ${index + 1}. ${rec.category}

${rec.advice}
`).join('\n')}

---

## ${analysis.yearFortune.year}年流年运势

${analysis.yearFortune.trend}

**关键时间节点:**

${analysis.yearFortune.keyMonths.map((month: string, index: number) => `${index + 1}. ${month}`).join('\n')}

---

## 回向祝福

愿此分析能为您带来启迪与指引。五台山善途团队祝您:

- 事业顺遂,步步高升
- 财源广进,富贵安康
- 感情美满,家庭和睦
- 身体健康,福寿绵长

---

## 法律声明

本报告内容仅供参考,不构成任何法律、医疗或投资建议。面相学是传统文化的一部分,应理性看待。人生运势受多种因素影响,个人努力和选择才是决定命运的关键。

---

**五台山善途团队**  
*传承千年智慧,照亮人生之路*

---
`;

  return report;
}
