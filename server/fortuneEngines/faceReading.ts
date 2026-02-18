/**
 * 面相分析引擎
 * 基于传统中国面相学(相术)的分析系统
 */

import { invokeLLM } from "../_core/llm";

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
 * 五官特征定义
 */
const FIVE_FEATURES = {
  eyebrows: { name: "眉", significance: "兄弟宫、性格、智慧" },
  eyes: { name: "眼", significance: "心灵之窗、智慧、感情" },
  nose: { name: "鼻", significance: "财帛宫、自我、健康" },
  mouth: { name: "口", significance: "食禄、表达、晚年运" },
  ears: { name: "耳", significance: "早年运、智慧、寿命" },
};

/**
 * 面相分析主函数
 */
export async function analyzeFaceReading(imageUrls: string[], questionDescription?: string) {
  try {
    // 构建分析提示词
    const systemPrompt = `你是一位精通中国传统面相学的大师,拥有数十年的相术经验。你将基于用户上传的面部照片,进行专业的面相分析。

**分析框架:**

1. **十二宫位分析** - 分析以下宫位:
${Object.entries(TWELVE_PALACES).map(([key, palace]) => 
  `   - ${palace.name}(${palace.area}): ${palace.aspects.join('、')}`
).join('\n')}

2. **五官特征解读** - 分析:
${Object.entries(FIVE_FEATURES).map(([key, feature]) => 
  `   - ${feature.name}: ${feature.significance}`
).join('\n')}

3. **面相综合评分** - 给出各方面评分(0-100):
   - 事业运势
   - 财富运势
   - 感情婚姻
   - 健康状况
   - 综合福运

4. **流年运势** - 分析2026年运势走向

5. **人生建议** - 提供具体的改善建议

**重要原则:**
- 基于传统面相学理论,结合现代心理学
- 语言温和、积极、鼓励性
- 避免过于绝对的判断
- 提供可操作的建议
- 报告长度至少10页内容

请以专业、详细的方式进行分析。`;

    const userPrompt = `请分析这些面部照片,提供详细的面相解读报告。

${questionDescription ? `用户关注点: ${questionDescription}` : ''}

请按照以下结构输出JSON格式的分析结果:

{
  "overallSummary": "整体概述(200-300字)",
  "score": 综合评分(0-100),
  "sections": [
    {
      "title": "章节标题",
      "content": "详细内容",
      "score": 评分(可选)
    }
  ],
  "recommendations": [
    {
      "category": "类别(事业/财运/感情/健康)",
      "advice": "具体建议"
    }
  ],
  "yearFortune": {
    "year": 2026,
    "trend": "运势走向描述",
    "keyMonths": ["关键月份说明"]
  }
}`;

    // 调用LLM进行分析
    const response = await invokeLLM({
      messages: [
        { role: "system", content: systemPrompt },
        { 
          role: "user", 
          content: [
            { type: "text", text: userPrompt },
            ...imageUrls.map(url => ({
              type: "image_url" as const,
              image_url: { url, detail: "high" as const }
            }))
          ]
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "face_reading_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              overallSummary: { type: "string" },
              score: { type: "number" },
              sections: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    content: { type: "string" },
                    score: { type: "number" }
                  },
                  required: ["title", "content"],
                  additionalProperties: false
                }
              },
              recommendations: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    category: { type: "string" },
                    advice: { type: "string" }
                  },
                  required: ["category", "advice"],
                  additionalProperties: false
                }
              },
              yearFortune: {
                type: "object",
                properties: {
                  year: { type: "number" },
                  trend: { type: "string" },
                  keyMonths: {
                    type: "array",
                    items: { type: "string" }
                  }
                },
                required: ["year", "trend", "keyMonths"],
                additionalProperties: false
              }
            },
            required: ["overallSummary", "score", "sections", "recommendations", "yearFortune"],
            additionalProperties: false
          }
        }
      }
    });

    const content = response.choices[0].message.content;
    if (!content || typeof content !== 'string') {
      throw new Error("No analysis result returned");
    }

    const analysis = JSON.parse(content);
    return analysis;

  } catch (error) {
    console.error("Face reading analysis error:", error);
    throw error;
  }
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

## 📊 综合评分

**整体运势评分:** ${analysis.score}/100

${analysis.overallSummary}

---

## 📖 详细分析

${analysis.sections.map((section: any, index: number) => `
### ${index + 1}. ${section.title}

${section.content}

${section.score ? `**评分:** ${section.score}/100\n` : ''}
---
`).join('\n')}

## 🎯 人生建议

根据您的面相特征,我们为您提供以下具体建议:

${analysis.recommendations.map((rec: any, index: number) => `
### ${index + 1}. ${rec.category}

${rec.advice}
`).join('\n')}

---

## 🌟 ${analysis.yearFortune.year}年流年运势

${analysis.yearFortune.trend}

**关键时间节点:**

${analysis.yearFortune.keyMonths.map((month: string, index: number) => `${index + 1}. ${month}`).join('\n')}

---

## 💫 回向祝福

愿此分析能为您带来启迪与指引。五台山善途团队祝您:

- 事业顺遂,步步高升
- 财源广进,富贵安康
- 感情美满,家庭和睦
- 身体健康,福寿绵长

---

## ⚖️ 法律声明

本报告内容仅供参考,不构成任何法律、医疗或投资建议。面相学是传统文化的一部分,应理性看待。人生运势受多种因素影响,个人努力和选择才是决定命运的关键。

---

**五台山善途团队**  
*传承千年智慧,照亮人生之路*

---
`;

  return report;
}
