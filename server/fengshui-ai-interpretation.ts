import { invokeLLM } from "./_core/llm";
import type { FengshuiCalculationResult } from "./fengshui-engine";
import { ROOM_TYPE_NAMES } from "./fengshui-engine";

/**
 * 使用AI生成风水解读报告
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

  // 构建上下文信息
  const contextInfo = {
    roomType: roomName,
    overallScore: calculationResult.overallScore,
    positiveCount: calculationResult.positiveCount,
    negativeCount: calculationResult.negativeCount,
    items: calculationResult.items.map(item => ({
      category: item.category,
      title: item.title,
      score: item.score,
      interpretation: item.interpretation,
      suggestion: item.suggestion,
    })),
  };

  // 构建Prompt - 五台山大师风格
  const prompt = `你是五台山德高望重的风水大师，融会贯通八宅风水、玄空飞星、五行理论等古籍精髓，并融合佛教智慧。现在需要你以大师的口吨和视角，根据以下${roomName}的风水分析数据，生成一份深入而通俗的风水解读报告。

## 分析数据

房间类型: ${roomName}
综合评分: ${calculationResult.overallScore}分(满分100分)
吉相数量: ${calculationResult.positiveCount}处
需改善之处: ${calculationResult.negativeCount}处

### 详细分析项

${calculationResult.items.map((item, index) => `
${index + 1}. ${item.title}
   - 评分: ${item.score > 0 ? '+' : ''}${item.score}分
   - 解读: ${item.interpretation}
   ${item.suggestion ? `- 建议: ${item.suggestion}` : ''}
`).join('\n')}

## 要求

请生成一份JSON格式的风水报告,包含以下字段:

{
  "overallSummary": "综合命理总结,200-300字,要求通俗易懂,既要体现专业性,又要让普通人能理解。需要提及整体评分、主要优点和问题,并给予积极的建议。",
  "sections": [
    {
      "title": "分析项标题(如'床头朝向分析')",
      "content": "详细解读内容,150-200字,解释为什么这样布局好或不好,有什么影响,基于传统风水理论",
      "score": 评分数字(0-100),
      "suggestion": "改善建议(如果有问题的话),具体可执行"
    }
  ],
  "suggestions": [
    "改善建议1:具体可执行的建议",
    "改善建议2:具体可执行的建议"
  ]
}

**重要要求**:
1. 使用传统风水术语，避免现代词汇(如"AI分析"、"系统检测")
2. 采用大师口吨，例如"老夫观此${roomName}布局..."、"据八宅风水所载..."
3. 解读要基于传统风水理论，体现专业性和可信度
4. 融入佛教智慧，强调和谐、平衡、慈悲
5. 即使有问题，也要给出积德改运的方法
6. sections数组应包含所有重要的分析项(至少5项)
7. suggestions数组应包含3-5条具体可执行的改善建议
8. 必须返回有效的JSON格式,不要包含其他文字

请直接返回JSON,不要包含任何其他说明文字。`;

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "你是一位专业的风水大师,擅长用通俗易懂的语言解读风水,帮助人们改善居住环境。",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const rawContent = response.choices[0]?.message?.content;
    
    // 确保content是字符串
    const content = typeof rawContent === 'string' ? rawContent : '';

    // 尝试解析JSON
    try {
      // 提取JSON部分(可能包含markdown代码块)
      let jsonStr = content.trim();
      if (jsonStr.startsWith("```json")) {
        jsonStr = jsonStr.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      } else if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr.replace(/```\n?/g, "");
      }

      const result = JSON.parse(jsonStr);

      // 验证结果结构
      if (!result.overallSummary || !Array.isArray(result.sections) || !Array.isArray(result.suggestions)) {
        throw new Error("Invalid response structure");
      }

      return result;
    } catch (parseError) {
      console.error("[Fengshui AI] Failed to parse AI response:", parseError);
      console.error("[Fengshui AI] Raw response:", content);
      throw new Error("AI response parsing failed");
    }
  } catch (error) {
    console.error("[Fengshui AI] AI interpretation failed:", error);
    throw error;
  }
}
