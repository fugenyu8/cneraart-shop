import { invokeLLM } from "./_core/llm";

interface CalculationResult {
  [key: string]: {
    score: number;
    category: string;
    interpretations: string[];
  };
}

interface AIInterpretationResult {
  overallSummary: string;
  sections: Array<{
    title: string;
    content: string;
    score: number;
  }>;
}

/**
 * 使用AI生成命理解读报告
 * 将所有计算结果整合为一个完整的上下文,一次性调用大语言模型API
 */
export async function generateAIInterpretation(
  calculationResult: CalculationResult,
  serviceType: "face" | "palm"
): Promise<AIInterpretationResult> {
  // 构建上下文数据
  const contextData = Object.entries(calculationResult)
    .map(([name, data]) => {
      const category = data.category === "吉" ? "吉" : data.category === "凶" ? "凶" : "中";
      return `- ${name}: 评分${data.score}分(${category}), 特征解读: ${data.interpretations.join(";")}`;
    })
    .join("\n");

  const serviceTypeName = serviceType === "face" ? "面相" : "手相";

  // 构建Prompt
  const prompt = `你是一位精通中国传统${serviceTypeName}学的命理大师,擅长将复杂的相学理论转化为通俗易懂的解读。

用户上传了一张【${serviceTypeName}】照片,经过专业的图像识别和传统命理计算,得到以下结构化数据:

${contextData}

请根据以上数据,生成一份完整的${serviceTypeName}测算报告,包括:
1. 综合命理总结 (200-300字): 概括用户的整体运势、性格特点和人生走向
2. 分项详细解读 (每项100-150字): 对每个${serviceType === "face" ? "宫位" : "纹路/丘位"}进行深入分析,结合传统相学理论,给出具体的建议和注意事项

要求:
- 语言通俗易懂,避免过于专业的术语
- 保持积极正面的基调,即使是"凶"的判断,也要给出改善建议
- 结合现代生活场景,让解读更具实用性
- 确保逻辑连贯,各部分之间相互呼应
- 返回JSON格式,包含overallSummary(综合总结)和sections(分项解读数组,每项包含title、content、score)`;

  try {
    // 调用AI API
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "你是一位专业的命理大师,擅长面相和手相分析。你的解读既要符合传统相学理论,又要通俗易懂,积极正面。",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "physiognomy_report",
          strict: true,
          schema: {
            type: "object",
            properties: {
              overallSummary: {
                type: "string",
                description: "综合命理总结,200-300字",
              },
              sections: {
                type: "array",
                description: "分项详细解读数组",
                items: {
                  type: "object",
                  properties: {
                    title: {
                      type: "string",
                      description: "分析项标题,如'命宫分析'",
                    },
                    content: {
                      type: "string",
                      description: "详细解读内容,100-150字",
                    },
                    score: {
                      type: "number",
                      description: "评分,0-100",
                    },
                  },
                  required: ["title", "content", "score"],
                  additionalProperties: false,
                },
              },
            },
            required: ["overallSummary", "sections"],
            additionalProperties: false,
          },
        },
      },
    });

    // 解析AI响应
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("AI response is empty");
    }

    const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
    const result = JSON.parse(contentStr);
    return result as AIInterpretationResult;
  } catch (error) {
    console.error("[AI Interpretation] Failed to generate interpretation:", error);
    throw error;
  }
}

/**
 * 带重试机制的AI解读生成
 */
export async function generateAIInterpretationWithRetry(
  calculationResult: CalculationResult,
  serviceType: "face" | "palm",
  maxRetries: number = 3
): Promise<AIInterpretationResult> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await generateAIInterpretation(calculationResult, serviceType);
    } catch (error) {
      lastError = error as Error;
      console.warn(`[AI Interpretation] Retry ${i + 1}/${maxRetries} failed:`, error);
      
      // 如果不是最后一次重试,等待一段时间后再试
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }

  throw lastError || new Error("AI interpretation failed after retries");
}
