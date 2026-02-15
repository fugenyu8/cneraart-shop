import { getFaceRules, getPalmRules } from "./db";

/**
 * 命理计算引擎 - 核心逻辑
 * 根据图像识别提取的特征参数,匹配规则库,计算评分和吉凶判断
 */

interface FeatureParam {
  [key: string]: number | string;
}

interface PalaceFeatures {
  [palaceName: string]: FeatureParam;
}

interface LineFeatures {
  [lineName: string]: FeatureParam;
}

interface HillFeatures {
  [hillName: string]: FeatureParam;
}

interface FaceFeatures {
  faceType?: string;
  palaces: PalaceFeatures;
}

interface PalmFeatures {
  handType?: string;
  lines: LineFeatures;
  hills: HillFeatures;
}

interface CalculationResult {
  [key: string]: {
    score: number;
    category: string;
    interpretations: string[];
  };
}

/**
 * 检查特征值是否满足规则条件
 */
function matchCondition(
  value: number | string,
  operator: string,
  conditionValue: string
): boolean {
  if (typeof value === "string") {
    // 字符串类型直接比较
    return operator === "=" && value === conditionValue;
  }

  // 数值类型比较
  const numValue = Number(value);
  if (isNaN(numValue)) return false;

  switch (operator) {
    case ">":
      return numValue > Number(conditionValue);
    case "<":
      return numValue < Number(conditionValue);
    case "=":
      return numValue === Number(conditionValue);
    case ">=":
      return numValue >= Number(conditionValue);
    case "<=":
      return numValue <= Number(conditionValue);
    case "between": {
      const [min, max] = conditionValue.split("-").map(Number);
      return numValue >= min && numValue <= max;
    }
    default:
      return false;
  }
}

/**
 * 面相计算引擎
 */
export async function calculateFacePhysiognomy(
  features: FaceFeatures
): Promise<CalculationResult> {
  const rules = await getFaceRules();
  const result: CalculationResult = {};

  // 如果没有palaces字段,直接返回空结果
  if (!features.palaces || typeof features.palaces !== 'object') {
    return result;
  }

  // 遍历每个宫位的特征
  for (const [palaceName, palaceFeatures] of Object.entries(features.palaces)) {
    const matchedRules = [];

    // 查找匹配的规则
    for (const rule of rules) {
      if (rule.palaceName !== palaceName) continue;

      const featureValue = palaceFeatures[rule.featureName];
      if (featureValue === undefined) continue;

      if (
        matchCondition(
          featureValue,
          rule.conditionOperator,
          rule.conditionValue
        )
      ) {
        matchedRules.push(rule);
      }
    }

    // 如果有匹配的规则,计算评分和解读
    if (matchedRules.length > 0) {
      const totalScore = matchedRules.reduce(
        (sum, rule) => sum + rule.score,
        0
      );
      const avgScore = Math.round(totalScore / matchedRules.length);

      // 根据评分判断吉凶
      let category = "中";
      if (avgScore >= 80) category = "吉";
      else if (avgScore < 60) category = "凶";

      result[palaceName] = {
        score: avgScore,
        category,
        interpretations: matchedRules.map((rule) => rule.interpretation),
      };
    }
  }

  return result;
}

/**
 * 手相计算引擎
 */
export async function calculatePalmPhysiognomy(
  features: PalmFeatures
): Promise<CalculationResult> {
  const rules = await getPalmRules();
  const result: CalculationResult = {};

  // 如果没有lines字段,跳过纹路处理
  if (features.lines && typeof features.lines === 'object') {
    // 处理纹路特征
    for (const [lineName, lineFeatures] of Object.entries(features.lines)) {
      const matchedRules = [];

      for (const rule of rules) {
        if (rule.lineName !== lineName) continue;

        const featureValue = lineFeatures[rule.featureName];
        if (featureValue === undefined) continue;

        if (
          matchCondition(
            featureValue,
            rule.conditionOperator,
            rule.conditionValue
          )
        ) {
          matchedRules.push(rule);
        }
      }

      if (matchedRules.length > 0) {
        const totalScore = matchedRules.reduce(
          (sum, rule) => sum + rule.score,
          0
        );
        const avgScore = Math.round(totalScore / matchedRules.length);

        let category = "中";
        if (avgScore >= 80) category = "吉";
        else if (avgScore < 60) category = "凶";

        result[lineName] = {
          score: avgScore,
          category,
          interpretations: matchedRules.map((rule) => rule.interpretation),
        };
      }
    }
  }

  // 如果没有hills字段,跳过丘位处理
  if (features.hills && typeof features.hills === 'object') {
    // 处理丘位特征
    for (const [hillName, hillFeatures] of Object.entries(features.hills)) {
      const matchedRules = [];

      for (const rule of rules) {
        if (rule.hillName !== hillName) continue;

        const featureValue = hillFeatures[rule.featureName];
        if (featureValue === undefined) continue;

        if (
          matchCondition(
            featureValue,
            rule.conditionOperator,
            rule.conditionValue
          )
        ) {
          matchedRules.push(rule);
        }
      }

      if (matchedRules.length > 0) {
        const totalScore = matchedRules.reduce(
          (sum, rule) => sum + rule.score,
          0
        );
        const avgScore = Math.round(totalScore / matchedRules.length);

        let category = "中";
        if (avgScore >= 80) category = "吉";
        else if (avgScore < 60) category = "凶";

        result[hillName] = {
          score: avgScore,
          category,
          interpretations: matchedRules.map((rule) => rule.interpretation),
        };
      }
    }
  }

  return result;
}

/**
 * 生成默认解读(当AI调用失败时使用)
 */
export function generateDefaultInterpretation(
  calculationResult: CalculationResult,
  serviceType: "face" | "palm"
): { overallSummary: string; sections: any[] } {
  const sections = [];
  let totalScore = 0;
  let count = 0;

  for (const [name, data] of Object.entries(calculationResult)) {
    totalScore += data.score;
    count++;

    sections.push({
      title: `${name}分析`,
      content: data.interpretations.join("。") + "。",
      score: data.score,
    });
  }

  const avgScore = count > 0 ? Math.round(totalScore / count) : 70;

  let overallSummary = "";
  if (serviceType === "face") {
    if (avgScore >= 80) {
      overallSummary =
        "您的面相整体呈现吉祥之相,多个宫位评分优秀,预示着运势顺遂,前程似锦。您性格开朗,心境平和,善于把握机会,在人生的道路上将稳步向前。建议保持积极的心态,继续努力,必能收获美好的未来。";
    } else if (avgScore >= 60) {
      overallSummary =
        "您的面相整体平稳,各宫位表现均衡,预示着运势平稳发展。您性格稳重,做事踏实,虽然可能不会有大起大落,但只要持之以恒,必能积累财富,成就事业。建议在稳健的基础上,适当开拓进取,把握机遇。";
    } else {
      overallSummary =
        "您的面相显示部分宫位需要注意,建议在生活中多加留意,调整心态,积极面对挑战。命运掌握在自己手中,通过努力和智慧,完全可以改善运势,创造美好的未来。建议保持乐观,勤奋进取,善待他人。";
    }
  } else {
    if (avgScore >= 80) {
      overallSummary =
        "您的手相显示整体运势良好,多条纹路和丘位评分优秀,预示着健康长寿,事业有成,感情美满。您生命力旺盛,智慧超群,善于把握机会,在人生的各个领域都有望取得不俗的成就。建议继续保持积极的心态,勇往直前。";
    } else if (avgScore >= 60) {
      overallSummary =
        "您的手相整体平稳,各纹路和丘位表现均衡,预示着人生平稳发展。您性格稳重,做事踏实,虽然可能不会有大起大落,但只要持之以恒,必能积累财富,成就事业。建议在稳健的基础上,适当开拓进取,把握机遇。";
    } else {
      overallSummary =
        "您的手相显示部分纹路和丘位需要注意,建议在生活中多加留意,调整心态,积极面对挑战。命运掌握在自己手中,通过努力和智慧,完全可以改善运势,创造美好的未来。建议保持乐观,勤奋进取,善待他人。";
    }
  }

  return {
    overallSummary,
    sections,
  };
}
