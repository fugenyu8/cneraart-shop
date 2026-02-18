/**
 * 风水分析引擎
 * 基于传统中国风水学的分析系统
 */

import { invokeLLM } from "../_core/llm";

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
 * 常见煞气类型
 */
const SHA_QI_TYPES = [
  { name: "路冲", description: "道路直冲门口", impact: "影响健康和财运", solution: "设置屏风或植物遮挡" },
  { name: "尖角煞", description: "建筑物尖角对准住宅", impact: "导致不安和争执", solution: "使用圆形装饰或植物化解" },
  { name: "天斩煞", description: "两栋高楼之间的狭窄缝隙", impact: "影响健康和运势", solution: "悬挂八卦镜或葫芦" },
  { name: "反光煞", description: "玻璃或水面反光", impact: "导致心神不宁", solution: "使用窗帘或调整角度" },
  { name: "穿堂煞", description: "门窗相对直通", impact: "财气流失", solution: "设置玄关或屏风" },
];

/**
 * 风水分析主函数
 */
export async function analyzeFengshui(imageUrls: string[], questionDescription?: string) {
  try {
    const systemPrompt = `你是一位精通中国传统风水学的大师,拥有深厚的堪舆功底。你将基于用户上传的环境照片,进行专业的风水分析。

**分析框架:**

1. **八卦方位分析** - 分析各方位的风水状况:
${Object.entries(BAGUA_DIRECTIONS).map(([key, bagua]) => 
  `   - ${bagua.name}(${bagua.direction},${bagua.element}): ${bagua.aspects.join('、')}`
).join('\n')}

2. **五行平衡** - 评估五行分布:
${Object.entries(FIVE_ELEMENTS).map(([key, element]) => 
  `   - ${element.name}: 生${element.generates},克${element.controls},色${element.color},方位${element.direction}`
).join('\n')}

3. **煞气识别** - 检查常见煞气:
${SHA_QI_TYPES.map(sha => 
  `   - ${sha.name}: ${sha.description} → ${sha.impact}`
).join('\n')}

4. **气场评估** - 分析:
   - 采光通风
   - 空间布局
   - 家具摆放
   - 色彩搭配
   - 植物配置

5. **综合评分** - 各方面评分(0-100):
   - 财运风水
   - 事业风水
   - 健康风水
   - 感情风水
   - 综合评分

6. **优化建议** - 提供具体改善方案

**重要原则:**
- 基于传统风水学理论
- 结合现代居住需求
- 语言专业、实用、可操作
- 避免过度迷信
- 提供科学合理的解释
- 报告长度至少10页内容

请以专业、详细的方式进行分析。`;

    const userPrompt = `请分析这些环境照片,提供详细的风水解读报告。

${questionDescription ? `用户关注点: ${questionDescription}` : ''}

请按照以下结构输出JSON格式的分析结果:

{
  "overallSummary": "整体概述(200-300字)",
  "score": 综合评分(0-100),
  "elementBalance": {
    "wood": 木元素评分(0-100),
    "fire": 火元素评分(0-100),
    "earth": 土元素评分(0-100),
    "metal": 金元素评分(0-100),
    "water": 水元素评分(0-100)
  },
  "sections": [
    {
      "title": "章节标题",
      "content": "详细内容",
      "score": 评分(可选)
    }
  ],
  "issues": [
    {
      "type": "问题类型",
      "description": "问题描述",
      "severity": "严重程度(高/中/低)",
      "solution": "化解方法"
    }
  ],
  "recommendations": [
    {
      "category": "类别(财运/事业/健康/感情)",
      "advice": "具体建议",
      "priority": "优先级(高/中/低)"
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
          name: "fengshui_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              overallSummary: { type: "string" },
              score: { type: "number" },
              elementBalance: {
                type: "object",
                properties: {
                  wood: { type: "number" },
                  fire: { type: "number" },
                  earth: { type: "number" },
                  metal: { type: "number" },
                  water: { type: "number" }
                },
                required: ["wood", "fire", "earth", "metal", "water"],
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
              issues: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: { type: "string" },
                    description: { type: "string" },
                    severity: { type: "string" },
                    solution: { type: "string" }
                  },
                  required: ["type", "description", "severity", "solution"],
                  additionalProperties: false
                }
              },
              recommendations: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    category: { type: "string" },
                    advice: { type: "string" },
                    priority: { type: "string" }
                  },
                  required: ["category", "advice", "priority"],
                  additionalProperties: false
                }
              }
            },
            required: ["overallSummary", "score", "elementBalance", "sections", "issues", "recommendations"],
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
    console.error("Fengshui analysis error:", error);
    throw error;
  }
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

## 📊 综合评分

**整体风水评分:** ${analysis.score}/100

${analysis.overallSummary}

---

## ☯️ 五行平衡分析

| 五行 | 评分 | 状态 |
|------|------|------|
| 木 | ${analysis.elementBalance.wood}/100 | ${analysis.elementBalance.wood >= 70 ? '✅ 平衡' : analysis.elementBalance.wood >= 50 ? '⚠️ 需调整' : '❌ 失衡'} |
| 火 | ${analysis.elementBalance.fire}/100 | ${analysis.elementBalance.fire >= 70 ? '✅ 平衡' : analysis.elementBalance.fire >= 50 ? '⚠️ 需调整' : '❌ 失衡'} |
| 土 | ${analysis.elementBalance.earth}/100 | ${analysis.elementBalance.earth >= 70 ? '✅ 平衡' : analysis.elementBalance.earth >= 50 ? '⚠️ 需调整' : '❌ 失衡'} |
| 金 | ${analysis.elementBalance.metal}/100 | ${analysis.elementBalance.metal >= 70 ? '✅ 平衡' : analysis.elementBalance.metal >= 50 ? '⚠️ 需调整' : '❌ 失衡'} |
| 水 | ${analysis.elementBalance.water}/100 | ${analysis.elementBalance.water >= 70 ? '✅ 平衡' : analysis.elementBalance.water >= 50 ? '⚠️ 需调整' : '❌ 失衡'} |

---

## 📖 详细分析

${analysis.sections.map((section: any, index: number) => `
### ${index + 1}. ${section.title}

${section.content}

${section.score ? `**评分:** ${section.score}/100\n` : ''}
---
`).join('\n')}

## ⚠️ 风水问题识别

${analysis.issues.length > 0 ? analysis.issues.map((issue: any, index: number) => `
### ${index + 1}. ${issue.type} ${issue.severity === '高' ? '🔴' : issue.severity === '中' ? '🟡' : '🟢'}

**问题描述:** ${issue.description}

**严重程度:** ${issue.severity}

**化解方法:** ${issue.solution}

---
`).join('\n') : '未发现明显风水问题。'}

## 🎯 优化建议

${analysis.recommendations.map((rec: any, index: number) => `
### ${index + 1}. ${rec.category} ${rec.priority === '高' ? '⭐⭐⭐' : rec.priority === '中' ? '⭐⭐' : '⭐'}

${rec.advice}

**优先级:** ${rec.priority}

---
`).join('\n')}

## 💫 回向祝福

愿此分析能为您的居住环境带来正能量。五台山善途团队祝您:

- 家宅平安,风生水起
- 财源广进,富贵安康
- 事业顺遂,步步高升
- 家庭和睦,幸福美满

---

## ⚖️ 法律声明

本报告内容仅供参考,不构成任何法律、医疗或投资建议。风水学是传统文化的一部分,应理性看待。居住环境的改善应结合实际情况和科学原理,避免盲目迷信。

---

**五台山善途团队**  
*传承千年智慧,照亮人生之路*

---
`;

  return report;
}
