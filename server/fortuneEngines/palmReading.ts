/**
 * 手相分析引擎
 * 基于传统中国手相学的分析系统
 */

import { invokeLLM } from "../_core/llm";

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
 * 辅助线定义
 */
const MINOR_LINES = {
  fate: { name: "命运线/事业线", aspects: ["事业发展", "人生方向", "成就高度"] },
  sun: { name: "太阳线/成功线", aspects: ["名声", "成就", "社会认可"] },
  mercury: { name: "水星线/健康线", aspects: ["健康", "商业才能", "沟通能力"] },
  marriage: { name: "婚姻线", aspects: ["婚姻次数", "婚姻质量", "感情深度"] },
  wealth: { name: "财运线", aspects: ["财富累积", "理财能力", "意外之财"] },
};

/**
 * 手型分类(五行)
 */
const HAND_TYPES = {
  wood: { name: "木形手", characteristics: "手掌长方形,手指修长", personality: "理想主义、艺术气质、敏感细腻" },
  fire: { name: "火形手", characteristics: "手掌长方形,手指短", personality: "热情活力、行动力强、冲动直接" },
  earth: { name: "土形手", characteristics: "手掌方形,手指短", personality: "务实稳重、脚踏实地、可靠诚实" },
  metal: { name: "金形手", characteristics: "手掌方形,手指修长", personality: "理性冷静、逻辑清晰、追求完美" },
  water: { name: "水形手", characteristics: "手掌圆形,手指圆润", personality: "灵活变通、直觉敏锐、富有想象力" },
};

/**
 * 手相分析主函数
 */
export async function analyzePalmReading(imageUrls: string[], questionDescription?: string) {
  try {
    const systemPrompt = `你是一位精通中国传统手相学的大师,拥有深厚的相术功底。你将基于用户上传的手掌照片,进行专业的手相分析。

**分析框架:**

1. **手型分类** - 判断属于哪种手型:
${Object.entries(HAND_TYPES).map(([key, type]) => 
  `   - ${type.name}: ${type.characteristics} → ${type.personality}`
).join('\n')}

2. **三大主线分析**:
${Object.entries(MAJOR_LINES).map(([key, line]) => 
  `   - ${line.name}(${line.location}): ${line.aspects.join('、')}`
).join('\n')}

3. **辅助线分析**:
${Object.entries(MINOR_LINES).map(([key, line]) => 
  `   - ${line.name}: ${line.aspects.join('、')}`
).join('\n')}

4. **特殊纹路** - 分析:
   - 星纹、三角纹、方格纹、岛纹、十字纹等
   - 各种特殊标记的吉凶含义

5. **综合评分** - 各方面评分(0-100):
   - 事业成就
   - 财富运势
   - 感情婚姻
   - 健康长寿
   - 综合福运

6. **人生建议** - 提供具体改善建议

**重要原则:**
- 基于传统手相学理论
- 语言温和、积极、鼓励性
- 避免过于绝对的判断
- 提供可操作的建议
- 报告长度至少10页内容

请以专业、详细的方式进行分析。`;

    const userPrompt = `请分析这些手掌照片,提供详细的手相解读报告。

${questionDescription ? `用户关注点: ${questionDescription}` : ''}

请按照以下结构输出JSON格式的分析结果:

{
  "overallSummary": "整体概述(200-300字)",
  "score": 综合评分(0-100),
  "handType": {
    "type": "手型类别",
    "description": "手型描述",
    "personality": "性格特征"
  },
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
  ]
}`;

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
          name: "palm_reading_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              overallSummary: { type: "string" },
              score: { type: "number" },
              handType: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  description: { type: "string" },
                  personality: { type: "string" }
                },
                required: ["type", "description", "personality"],
                additionalProperties: false
              },
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
              }
            },
            required: ["overallSummary", "score", "handType", "sections", "recommendations"],
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
    console.error("Palm reading analysis error:", error);
    throw error;
  }
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

## 📊 综合评分

**整体运势评分:** ${analysis.score}/100

${analysis.overallSummary}

---

## ✋ 手型分类

**手型:** ${analysis.handType.type}

**特征:** ${analysis.handType.description}

**性格:** ${analysis.handType.personality}

---

## 📖 详细分析

${analysis.sections.map((section: any, index: number) => `
### ${index + 1}. ${section.title}

${section.content}

${section.score ? `**评分:** ${section.score}/100\n` : ''}
---
`).join('\n')}

## 🎯 人生建议

根据您的手相特征,我们为您提供以下具体建议:

${analysis.recommendations.map((rec: any, index: number) => `
### ${index + 1}. ${rec.category}

${rec.advice}
`).join('\n')}

---

## 💫 回向祝福

愿此分析能为您带来启迪与指引。五台山善途团队祝您:

- 事业顺遂,步步高升
- 财源广进,富贵安康
- 感情美满,家庭和睦
- 身体健康,福寿绵长

---

## ⚖️ 法律声明

本报告内容仅供参考,不构成任何法律、医疗或投资建议。手相学是传统文化的一部分,应理性看待。人生运势受多种因素影响,个人努力和选择才是决定命运的关键。

---

**五台山善途团队**  
*传承千年智慧,照亮人生之路*

---
`;

  return report;
}
