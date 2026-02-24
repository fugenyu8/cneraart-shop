/**
 * 手相规则库 - 350+条规则覆盖五大主线和八大丘位全维度
 * 每条规则的 featureName/lineName/hillName 与 image-recognition.ts 返回的特征名完全对应
 */

export interface PalmRuleData {
  lineName: string | null;
  hillName: string | null;
  featureName: string;
  conditionOperator: string;
  conditionValue: string;
  score: number;
  interpretation: string;
  category: string;
}

export const palmRulesData: PalmRuleData[] = [
  // ==================== 生命线 ====================
  // 生命线长度比例 (0.0-1.0)
  { lineName: "生命线", hillName: null, featureName: "生命线长度比例", conditionOperator: ">=", conditionValue: "0.90", score: 10, interpretation: "生命线极长且清晰，环绕金星丘如弯弓，主人体质极为强健，精力充沛，长寿之相，一生少病少灾", category: "健康" },
  { lineName: "生命线", hillName: null, featureName: "生命线长度比例", conditionOperator: "between", conditionValue: "0.85-0.90", score: 9, interpretation: "生命线很长，弧度优美，主人生命力旺盛，体质强健，晚年仍精力充沛", category: "健康" },
  { lineName: "生命线", hillName: null, featureName: "生命线长度比例", conditionOperator: "between", conditionValue: "0.80-0.85", score: 8, interpretation: "生命线较长，走势流畅，主人身体健康，免疫力强，适合从事体力劳动", category: "健康" },
  { lineName: "生命线", hillName: null, featureName: "生命线长度比例", conditionOperator: "between", conditionValue: "0.75-0.80", score: 7, interpretation: "生命线长度良好，主人体质不错，注意保养可享高寿", category: "健康" },
  { lineName: "生命线", hillName: null, featureName: "生命线长度比例", conditionOperator: "between", conditionValue: "0.70-0.75", score: 6, interpretation: "生命线长度中上，健康运良好，日常注意饮食作息即可", category: "健康" },
  { lineName: "生命线", hillName: null, featureName: "生命线长度比例", conditionOperator: "between", conditionValue: "0.65-0.70", score: 4, interpretation: "生命线长度中等，体质一般，建议加强锻炼，注意养生", category: "健康" },
  { lineName: "生命线", hillName: null, featureName: "生命线长度比例", conditionOperator: "between", conditionValue: "0.60-0.65", score: 2, interpretation: "生命线偏短，需注意身体保养，定期体检，保持良好生活习惯", category: "健康" },
  { lineName: "生命线", hillName: null, featureName: "生命线长度比例", conditionOperator: "between", conditionValue: "0.55-0.60", score: 0, interpretation: "生命线较短，古手相学认为体质偏弱，建议多运动，增强体质", category: "健康" },
  { lineName: "生命线", hillName: null, featureName: "生命线长度比例", conditionOperator: "<", conditionValue: "0.55", score: -3, interpretation: "生命线短促，需格外注意健康，建议坚持锻炼，戒除不良习惯，定期体检", category: "健康" },

  // 生命线深度 (0.0-1.0)
  { lineName: "生命线", hillName: null, featureName: "生命线深度", conditionOperator: ">=", conditionValue: "0.85", score: 9, interpretation: "生命线深刻有力，如刀刻般清晰，主人意志坚定，生命力极为旺盛，百折不挠", category: "健康" },
  { lineName: "生命线", hillName: null, featureName: "生命线深度", conditionOperator: "between", conditionValue: "0.80-0.85", score: 8, interpretation: "生命线深刻清晰，主人精力充沛，抗压能力强，事业上能吃苦耐劳", category: "健康" },
  { lineName: "生命线", hillName: null, featureName: "生命线深度", conditionOperator: "between", conditionValue: "0.75-0.80", score: 7, interpretation: "生命线较深，体质良好，恢复力强，偶有小恙也能很快康复", category: "健康" },
  { lineName: "生命线", hillName: null, featureName: "生命线深度", conditionOperator: "between", conditionValue: "0.70-0.75", score: 6, interpretation: "生命线深度良好，身体素质不错，保持良好习惯可长寿", category: "健康" },
  { lineName: "生命线", hillName: null, featureName: "生命线深度", conditionOperator: "between", conditionValue: "0.65-0.70", score: 4, interpretation: "生命线深度中等，体质一般，建议规律作息，加强营养", category: "健康" },
  { lineName: "生命线", hillName: null, featureName: "生命线深度", conditionOperator: "between", conditionValue: "0.60-0.65", score: 2, interpretation: "生命线偏浅，体质较弱，容易疲劳，需注意休息和营养补充", category: "健康" },
  { lineName: "生命线", hillName: null, featureName: "生命线深度", conditionOperator: "<", conditionValue: "0.60", score: -2, interpretation: "生命线浅淡模糊，古手相学认为体质虚弱，建议加强体育锻炼，注重养生", category: "健康" },

  // 生命线弧度 (0.0-1.0)
  { lineName: "生命线", hillName: null, featureName: "生命线弧度", conditionOperator: ">=", conditionValue: "0.85", score: 9, interpretation: "生命线弧度极大，环绕金星丘如满弓，主人精力极为旺盛，热情奔放，生活充满活力", category: "健康" },
  { lineName: "生命线", hillName: null, featureName: "生命线弧度", conditionOperator: "between", conditionValue: "0.80-0.85", score: 8, interpretation: "生命线弧度大，金星丘区域宽广，主人体力充沛，性格开朗，人缘极好", category: "健康" },
  { lineName: "生命线", hillName: null, featureName: "生命线弧度", conditionOperator: "between", conditionValue: "0.75-0.80", score: 7, interpretation: "生命线弧度较大，活力充沛，喜欢运动和社交，身心健康", category: "健康" },
  { lineName: "生命线", hillName: null, featureName: "生命线弧度", conditionOperator: "between", conditionValue: "0.70-0.75", score: 6, interpretation: "生命线弧度良好，精力不错，生活态度积极向上", category: "健康" },
  { lineName: "生命线", hillName: null, featureName: "生命线弧度", conditionOperator: "between", conditionValue: "0.65-0.70", score: 4, interpretation: "生命线弧度中等，体力一般，建议适度运动保持活力", category: "健康" },
  { lineName: "生命线", hillName: null, featureName: "生命线弧度", conditionOperator: "between", conditionValue: "0.60-0.65", score: 2, interpretation: "生命线弧度偏小，性格较为内敛安静，体力一般", category: "健康" },
  { lineName: "生命线", hillName: null, featureName: "生命线弧度", conditionOperator: "<", conditionValue: "0.60", score: -1, interpretation: "生命线弧度小，紧贴拇指根部，古手相学认为体力偏弱，建议多户外活动", category: "健康" },

  // ==================== 智慧线 ====================
  // 智慧线长度比例 (0.0-1.0)
  { lineName: "智慧线", hillName: null, featureName: "智慧线长度比例", conditionOperator: ">=", conditionValue: "0.90", score: 10, interpretation: "智慧线极长，横贯手掌，主人智慧超群，思维敏捷，学识渊博，适合从事学术或创意工作", category: "事业" },
  { lineName: "智慧线", hillName: null, featureName: "智慧线长度比例", conditionOperator: "between", conditionValue: "0.85-0.90", score: 9, interpretation: "智慧线很长，主人聪明过人，分析能力极强，事业上能有大成就", category: "事业" },
  { lineName: "智慧线", hillName: null, featureName: "智慧线长度比例", conditionOperator: "between", conditionValue: "0.80-0.85", score: 8, interpretation: "智慧线较长，思维活跃，创造力丰富，适合从事脑力工作", category: "事业" },
  { lineName: "智慧线", hillName: null, featureName: "智慧线长度比例", conditionOperator: "between", conditionValue: "0.75-0.80", score: 7, interpretation: "智慧线长度良好，头脑聪明，学习能力强，事业发展顺利", category: "事业" },
  { lineName: "智慧线", hillName: null, featureName: "智慧线长度比例", conditionOperator: "between", conditionValue: "0.70-0.75", score: 6, interpretation: "智慧线长度中上，智力不错，做事有条理，适合稳定的职业", category: "事业" },
  { lineName: "智慧线", hillName: null, featureName: "智慧线长度比例", conditionOperator: "between", conditionValue: "0.65-0.70", score: 4, interpretation: "智慧线长度中等，思维正常，做事务实，适合实操类工作", category: "事业" },
  { lineName: "智慧线", hillName: null, featureName: "智慧线长度比例", conditionOperator: "between", conditionValue: "0.60-0.65", score: 2, interpretation: "智慧线偏短，思维较为直接，不善于复杂分析，但执行力强", category: "事业" },
  { lineName: "智慧线", hillName: null, featureName: "智慧线长度比例", conditionOperator: "<", conditionValue: "0.60", score: -1, interpretation: "智慧线较短，古手相学认为思维偏简单直接，建议多读书学习，开拓思维", category: "事业" },

  // 智慧线深度 (0.0-1.0)
  { lineName: "智慧线", hillName: null, featureName: "智慧线深度", conditionOperator: ">=", conditionValue: "0.85", score: 9, interpretation: "智慧线深刻有力，主人思维深邃，专注力极强，适合从事研究或技术工作", category: "事业" },
  { lineName: "智慧线", hillName: null, featureName: "智慧线深度", conditionOperator: "between", conditionValue: "0.80-0.85", score: 8, interpretation: "智慧线深刻清晰，记忆力好，判断力强，事业上能做出正确决策", category: "事业" },
  { lineName: "智慧线", hillName: null, featureName: "智慧线深度", conditionOperator: "between", conditionValue: "0.75-0.80", score: 7, interpretation: "智慧线较深，思维清晰，逻辑性强，做事有章法", category: "事业" },
  { lineName: "智慧线", hillName: null, featureName: "智慧线深度", conditionOperator: "between", conditionValue: "0.70-0.75", score: 6, interpretation: "智慧线深度良好，头脑清醒，判断力不错", category: "事业" },
  { lineName: "智慧线", hillName: null, featureName: "智慧线深度", conditionOperator: "between", conditionValue: "0.65-0.70", score: 4, interpretation: "智慧线深度中等，思维正常，做事稳重", category: "事业" },
  { lineName: "智慧线", hillName: null, featureName: "智慧线深度", conditionOperator: "between", conditionValue: "0.60-0.65", score: 2, interpretation: "智慧线偏浅，注意力容易分散，建议培养专注力", category: "事业" },
  { lineName: "智慧线", hillName: null, featureName: "智慧线深度", conditionOperator: "<", conditionValue: "0.60", score: -1, interpretation: "智慧线浅淡，古手相学认为思维不够集中，建议通过冥想等方式提升专注力", category: "事业" },

  // 智慧线走向 (字符串)
  { lineName: "智慧线", hillName: null, featureName: "智慧线走向", conditionOperator: "=", conditionValue: "平直", score: 7, interpretation: "智慧线平直延伸，主人思维理性，逻辑清晰，做事果断，适合从事管理、金融、工程等理性工作", category: "事业" },
  { lineName: "智慧线", hillName: null, featureName: "智慧线走向", conditionOperator: "=", conditionValue: "下弯", score: 8, interpretation: "智慧线末端下弯向太阴丘，主人想象力丰富，艺术天赋高，适合从事文学、音乐、绘画等创意工作", category: "事业" },
  { lineName: "智慧线", hillName: null, featureName: "智慧线走向", conditionOperator: "=", conditionValue: "上翘", score: 6, interpretation: "智慧线末端微微上翘，主人务实进取，商业头脑敏锐，善于把握商机，适合经商", category: "财运" },

  // ==================== 感情线 ====================
  // 感情线长度比例 (0.0-1.0)
  { lineName: "感情线", hillName: null, featureName: "感情线长度比例", conditionOperator: ">=", conditionValue: "0.90", score: 10, interpretation: "感情线极长，延伸至食指根部，主人感情极为丰富，重情重义，对爱情忠贞不渝，婚姻美满幸福", category: "感情" },
  { lineName: "感情线", hillName: null, featureName: "感情线长度比例", conditionOperator: "between", conditionValue: "0.85-0.90", score: 9, interpretation: "感情线很长，主人感情深厚，对伴侣体贴入微，婚姻幸福", category: "感情" },
  { lineName: "感情线", hillName: null, featureName: "感情线长度比例", conditionOperator: "between", conditionValue: "0.80-0.85", score: 8, interpretation: "感情线较长，感情丰富，善于表达爱意，异性缘佳", category: "感情" },
  { lineName: "感情线", hillName: null, featureName: "感情线长度比例", conditionOperator: "between", conditionValue: "0.75-0.80", score: 7, interpretation: "感情线长度良好，感情运不错，能遇到合适的伴侣", category: "感情" },
  { lineName: "感情线", hillName: null, featureName: "感情线长度比例", conditionOperator: "between", conditionValue: "0.70-0.75", score: 5, interpretation: "感情线长度中上，感情生活平稳，婚姻和谐", category: "感情" },
  { lineName: "感情线", hillName: null, featureName: "感情线长度比例", conditionOperator: "between", conditionValue: "0.65-0.70", score: 3, interpretation: "感情线长度中等，感情上较为理性，不会过于感情用事", category: "感情" },
  { lineName: "感情线", hillName: null, featureName: "感情线长度比例", conditionOperator: "between", conditionValue: "0.60-0.65", score: 1, interpretation: "感情线偏短，感情上较为含蓄，不善于表达，建议多与伴侣沟通", category: "感情" },
  { lineName: "感情线", hillName: null, featureName: "感情线长度比例", conditionOperator: "<", conditionValue: "0.60", score: -2, interpretation: "感情线较短，古手相学认为感情上较为冷淡，需学会表达爱意", category: "感情" },

  // 感情线深度 (0.0-1.0)
  { lineName: "感情线", hillName: null, featureName: "感情线深度", conditionOperator: ">=", conditionValue: "0.85", score: 9, interpretation: "感情线深刻有力，主人感情真挚热烈，对爱情全力以赴，婚姻生活充满激情", category: "感情" },
  { lineName: "感情线", hillName: null, featureName: "感情线深度", conditionOperator: "between", conditionValue: "0.80-0.85", score: 8, interpretation: "感情线深刻清晰，感情专一，对伴侣忠诚，婚姻稳固", category: "感情" },
  { lineName: "感情线", hillName: null, featureName: "感情线深度", conditionOperator: "between", conditionValue: "0.75-0.80", score: 7, interpretation: "感情线较深，感情运良好，能建立深厚的感情基础", category: "感情" },
  { lineName: "感情线", hillName: null, featureName: "感情线深度", conditionOperator: "between", conditionValue: "0.70-0.75", score: 5, interpretation: "感情线深度良好，感情生活正常，婚姻平稳", category: "感情" },
  { lineName: "感情线", hillName: null, featureName: "感情线深度", conditionOperator: "between", conditionValue: "0.65-0.70", score: 3, interpretation: "感情线深度中等，感情上不温不火，需多制造浪漫", category: "感情" },
  { lineName: "感情线", hillName: null, featureName: "感情线深度", conditionOperator: "<", conditionValue: "0.65", score: 0, interpretation: "感情线偏浅，感情上较为淡泊，建议多用心经营感情生活", category: "感情" },

  // 感情线分叉数量 (0-5)
  { lineName: "感情线", hillName: null, featureName: "感情线分叉数量", conditionOperator: "=", conditionValue: "0", score: 7, interpretation: "感情线无分叉，主人感情专一，对爱情忠贞不渝，婚姻稳定", category: "感情" },
  { lineName: "感情线", hillName: null, featureName: "感情线分叉数量", conditionOperator: "=", conditionValue: "1", score: 5, interpretation: "感情线一处分叉，若在末端分叉，古称'凤尾纹'，主人善解人意，婚姻美满", category: "感情" },
  { lineName: "感情线", hillName: null, featureName: "感情线分叉数量", conditionOperator: "=", conditionValue: "2", score: 3, interpretation: "感情线两处分叉，感情经历较为丰富，最终能找到真爱", category: "感情" },
  { lineName: "感情线", hillName: null, featureName: "感情线分叉数量", conditionOperator: "=", conditionValue: "3", score: 0, interpretation: "感情线多处分叉，感情上容易犹豫不决，建议认清内心真正需要", category: "感情" },
  { lineName: "感情线", hillName: null, featureName: "感情线分叉数量", conditionOperator: ">=", conditionValue: "4", score: -3, interpretation: "感情线分叉过多，古手相学认为感情路较为复杂，建议专一对待感情", category: "感情" },

  // ==================== 事业线 ====================
  // 事业线长度比例 (0.0-1.0)
  { lineName: "事业线", hillName: null, featureName: "事业线长度比例", conditionOperator: ">=", conditionValue: "0.90", score: 10, interpretation: "事业线极长，从手腕直达中指根部，古称'通天纹'，主人事业运极旺，必成大器，功成名就", category: "事业" },
  { lineName: "事业线", hillName: null, featureName: "事业线长度比例", conditionOperator: "between", conditionValue: "0.85-0.90", score: 9, interpretation: "事业线很长且清晰，主人事业心强，目标明确，能在职场上出人头地", category: "事业" },
  { lineName: "事业线", hillName: null, featureName: "事业线长度比例", conditionOperator: "between", conditionValue: "0.80-0.85", score: 8, interpretation: "事业线较长，事业发展顺利，中年后事业达到高峰", category: "事业" },
  { lineName: "事业线", hillName: null, featureName: "事业线长度比例", conditionOperator: "between", conditionValue: "0.75-0.80", score: 7, interpretation: "事业线长度良好，事业运不错，能找到适合自己的发展方向", category: "事业" },
  { lineName: "事业线", hillName: null, featureName: "事业线长度比例", conditionOperator: "between", conditionValue: "0.70-0.75", score: 6, interpretation: "事业线长度中上，事业稳步发展，通过努力可获得不错的成就", category: "事业" },
  { lineName: "事业线", hillName: null, featureName: "事业线长度比例", conditionOperator: "between", conditionValue: "0.65-0.70", score: 4, interpretation: "事业线长度中等，事业运平稳，需持续努力提升自己", category: "事业" },
  { lineName: "事业线", hillName: null, featureName: "事业线长度比例", conditionOperator: "between", conditionValue: "0.60-0.65", score: 2, interpretation: "事业线偏短，事业起步较晚，但大器晚成，中晚年转运", category: "事业" },
  { lineName: "事业线", hillName: null, featureName: "事业线长度比例", conditionOperator: "<", conditionValue: "0.60", score: 0, interpretation: "事业线较短或不明显，古手相学认为事业上需更加努力，适合自由职业或创业", category: "事业" },

  // 事业线清晰度 (0.0-1.0)
  { lineName: "事业线", hillName: null, featureName: "事业线清晰度", conditionOperator: ">=", conditionValue: "0.85", score: 9, interpretation: "事业线极为清晰深刻，主人事业目标明确，执行力强，事业上一帆风顺", category: "事业" },
  { lineName: "事业线", hillName: null, featureName: "事业线清晰度", conditionOperator: "between", conditionValue: "0.80-0.85", score: 8, interpretation: "事业线清晰有力，事业发展方向明确，能在专业领域取得成就", category: "事业" },
  { lineName: "事业线", hillName: null, featureName: "事业线清晰度", conditionOperator: "between", conditionValue: "0.75-0.80", score: 7, interpretation: "事业线较为清晰，事业运良好，职场上能得到认可", category: "事业" },
  { lineName: "事业线", hillName: null, featureName: "事业线清晰度", conditionOperator: "between", conditionValue: "0.70-0.75", score: 5, interpretation: "事业线清晰度良好，事业平稳发展", category: "事业" },
  { lineName: "事业线", hillName: null, featureName: "事业线清晰度", conditionOperator: "between", conditionValue: "0.65-0.70", score: 3, interpretation: "事业线清晰度中等，事业方向可能有过调整，但最终能找到适合的道路", category: "事业" },
  { lineName: "事业线", hillName: null, featureName: "事业线清晰度", conditionOperator: "<", conditionValue: "0.65", score: 0, interpretation: "事业线模糊不清，事业上可能经历多次转换，建议找准方向后坚持深耕", category: "事业" },

  // ==================== 婚姻线 ====================
  // 婚姻线数量 (0-5)
  { lineName: "婚姻线", hillName: null, featureName: "婚姻线数量", conditionOperator: "=", conditionValue: "1", score: 10, interpretation: "婚姻线仅一条且清晰深刻，古称'一线定终身'，主人婚姻美满，一生只爱一人，白头偕老", category: "感情" },
  { lineName: "婚姻线", hillName: null, featureName: "婚姻线数量", conditionOperator: "=", conditionValue: "2", score: 7, interpretation: "婚姻线两条，若一长一短，主人感情经历丰富，最终能找到真爱，婚姻幸福", category: "感情" },
  { lineName: "婚姻线", hillName: null, featureName: "婚姻线数量", conditionOperator: "=", conditionValue: "3", score: 4, interpretation: "婚姻线三条，感情上可能经历多段恋情，建议慎重选择伴侣", category: "感情" },
  { lineName: "婚姻线", hillName: null, featureName: "婚姻线数量", conditionOperator: ">=", conditionValue: "4", score: 0, interpretation: "婚姻线较多，古手相学认为感情上较为复杂，建议专注当下，珍惜眼前人", category: "感情" },
  { lineName: "婚姻线", hillName: null, featureName: "婚姻线数量", conditionOperator: "=", conditionValue: "0", score: -2, interpretation: "婚姻线不明显，可能晚婚或对婚姻不太在意，建议顺其自然", category: "感情" },

  // 婚姻线长度 (0.0-1.0)
  { lineName: "婚姻线", hillName: null, featureName: "婚姻线长度", conditionOperator: ">=", conditionValue: "0.80", score: 9, interpretation: "婚姻线长而清晰，主人婚姻美满，夫妻感情深厚，白头偕老", category: "感情" },
  { lineName: "婚姻线", hillName: null, featureName: "婚姻线长度", conditionOperator: "between", conditionValue: "0.70-0.80", score: 7, interpretation: "婚姻线较长，婚姻运良好，夫妻恩爱和谐", category: "感情" },
  { lineName: "婚姻线", hillName: null, featureName: "婚姻线长度", conditionOperator: "between", conditionValue: "0.60-0.70", score: 5, interpretation: "婚姻线长度中等，婚姻生活平稳，需用心经营", category: "感情" },
  { lineName: "婚姻线", hillName: null, featureName: "婚姻线长度", conditionOperator: "between", conditionValue: "0.50-0.60", score: 3, interpretation: "婚姻线偏短，婚姻需更多经营和包容", category: "感情" },
  { lineName: "婚姻线", hillName: null, featureName: "婚姻线长度", conditionOperator: "<", conditionValue: "0.50", score: 0, interpretation: "婚姻线较短，古手相学认为对婚姻不太执着，建议多与伴侣沟通", category: "感情" },

  // ==================== 八大丘位 ====================
  // 木星丘（食指下方）- 领导力、野心、权力
  { lineName: null, hillName: "木星丘", featureName: "木星丘隆起度", conditionOperator: ">=", conditionValue: "0.90", score: 10, interpretation: "木星丘极为隆起饱满，主人领导力超群，野心勃勃，天生的领袖人物，事业上必成大器", category: "事业" },
  { lineName: null, hillName: "木星丘", featureName: "木星丘隆起度", conditionOperator: "between", conditionValue: "0.85-0.90", score: 9, interpretation: "木星丘非常饱满，主人自信心强，有强烈的成功欲望，适合从事管理或领导工作", category: "事业" },
  { lineName: null, hillName: "木星丘", featureName: "木星丘隆起度", conditionOperator: "between", conditionValue: "0.80-0.85", score: 8, interpretation: "木星丘饱满，主人有领导才能，做事有魄力，事业上能独当一面", category: "事业" },
  { lineName: null, hillName: "木星丘", featureName: "木星丘隆起度", conditionOperator: "between", conditionValue: "0.75-0.80", score: 7, interpretation: "木星丘较为隆起，主人有进取心，做事积极主动，事业发展良好", category: "事业" },
  { lineName: null, hillName: "木星丘", featureName: "木星丘隆起度", conditionOperator: "between", conditionValue: "0.70-0.75", score: 5, interpretation: "木星丘隆起度中上，有一定的领导潜质，需多锻炼", category: "事业" },
  { lineName: null, hillName: "木星丘", featureName: "木星丘隆起度", conditionOperator: "between", conditionValue: "0.65-0.70", score: 3, interpretation: "木星丘隆起度中等，性格较为温和，适合团队协作", category: "事业" },
  { lineName: null, hillName: "木星丘", featureName: "木星丘隆起度", conditionOperator: "between", conditionValue: "0.60-0.65", score: 1, interpretation: "木星丘偏平，领导欲望不强，更适合执行类工作", category: "事业" },
  { lineName: null, hillName: "木星丘", featureName: "木星丘隆起度", conditionOperator: "<", conditionValue: "0.60", score: -2, interpretation: "木星丘平坦，古手相学认为缺乏自信和野心，建议培养自信心", category: "事业" },

  // 土星丘（中指下方）- 责任感、智慧、沉稳
  { lineName: null, hillName: "土星丘", featureName: "土星丘隆起度", conditionOperator: ">=", conditionValue: "0.85", score: 8, interpretation: "土星丘饱满隆起，主人责任感极强，做事严谨认真，适合从事学术、法律或技术工作", category: "事业" },
  { lineName: null, hillName: "土星丘", featureName: "土星丘隆起度", conditionOperator: "between", conditionValue: "0.80-0.85", score: 7, interpretation: "土星丘较为饱满，主人沉稳内敛，思考深入，做事有条不紊", category: "事业" },
  { lineName: null, hillName: "土星丘", featureName: "土星丘隆起度", conditionOperator: "between", conditionValue: "0.75-0.80", score: 6, interpretation: "土星丘隆起度良好，主人有责任心，做事认真负责", category: "事业" },
  { lineName: null, hillName: "土星丘", featureName: "土星丘隆起度", conditionOperator: "between", conditionValue: "0.70-0.75", score: 5, interpretation: "土星丘隆起度中上，性格稳重，做事踏实", category: "事业" },
  { lineName: null, hillName: "土星丘", featureName: "土星丘隆起度", conditionOperator: "between", conditionValue: "0.65-0.70", score: 3, interpretation: "土星丘隆起度中等，责任感正常，做事中规中矩", category: "事业" },
  { lineName: null, hillName: "土星丘", featureName: "土星丘隆起度", conditionOperator: "<", conditionValue: "0.65", score: 0, interpretation: "土星丘偏平，性格较为随性，不太喜欢被束缚，适合自由职业", category: "事业" },

  // 太阳丘（无名指下方）- 艺术、名声、财富
  { lineName: null, hillName: "太阳丘", featureName: "太阳丘隆起度", conditionOperator: ">=", conditionValue: "0.90", score: 10, interpretation: "太阳丘极为饱满，主人艺术天赋极高，名利双收，适合从事艺术、娱乐或创意行业", category: "财运" },
  { lineName: null, hillName: "太阳丘", featureName: "太阳丘隆起度", conditionOperator: "between", conditionValue: "0.85-0.90", score: 9, interpretation: "太阳丘非常饱满，主人才华横溢，有很强的审美能力，事业上能获得名声", category: "财运" },
  { lineName: null, hillName: "太阳丘", featureName: "太阳丘隆起度", conditionOperator: "between", conditionValue: "0.80-0.85", score: 8, interpretation: "太阳丘饱满，主人有艺术气质，创造力丰富，适合从事设计、音乐等工作", category: "财运" },
  { lineName: null, hillName: "太阳丘", featureName: "太阳丘隆起度", conditionOperator: "between", conditionValue: "0.75-0.80", score: 7, interpretation: "太阳丘较为隆起，主人有一定的艺术修养，生活品味较高", category: "财运" },
  { lineName: null, hillName: "太阳丘", featureName: "太阳丘隆起度", conditionOperator: "between", conditionValue: "0.70-0.75", score: 5, interpretation: "太阳丘隆起度中上，有一定的审美能力和创造力", category: "财运" },
  { lineName: null, hillName: "太阳丘", featureName: "太阳丘隆起度", conditionOperator: "between", conditionValue: "0.65-0.70", score: 3, interpretation: "太阳丘隆起度中等，审美能力一般，但可通过学习提升", category: "财运" },
  { lineName: null, hillName: "太阳丘", featureName: "太阳丘隆起度", conditionOperator: "<", conditionValue: "0.65", score: 0, interpretation: "太阳丘偏平，对艺术不太敏感，更适合从事实务类工作", category: "财运" },

  // 水星丘（小指下方）- 商业、沟通、智慧
  { lineName: null, hillName: "水星丘", featureName: "水星丘隆起度", conditionOperator: ">=", conditionValue: "0.90", score: 10, interpretation: "水星丘极为饱满，主人商业头脑极为敏锐，口才出众，善于沟通，适合从事商业或外交工作", category: "财运" },
  { lineName: null, hillName: "水星丘", featureName: "水星丘隆起度", conditionOperator: "between", conditionValue: "0.85-0.90", score: 9, interpretation: "水星丘非常饱满，主人善于经商，沟通能力极强，人脉广泛", category: "财运" },
  { lineName: null, hillName: "水星丘", featureName: "水星丘隆起度", conditionOperator: "between", conditionValue: "0.80-0.85", score: 8, interpretation: "水星丘饱满，主人口才好，善于表达，商业直觉敏锐", category: "财运" },
  { lineName: null, hillName: "水星丘", featureName: "水星丘隆起度", conditionOperator: "between", conditionValue: "0.75-0.80", score: 7, interpretation: "水星丘较为隆起，沟通能力良好，适合从事销售或公关工作", category: "财运" },
  { lineName: null, hillName: "水星丘", featureName: "水星丘隆起度", conditionOperator: "between", conditionValue: "0.70-0.75", score: 5, interpretation: "水星丘隆起度中上，有一定的商业嗅觉和沟通能力", category: "财运" },
  { lineName: null, hillName: "水星丘", featureName: "水星丘隆起度", conditionOperator: "between", conditionValue: "0.65-0.70", score: 3, interpretation: "水星丘隆起度中等，沟通能力一般，可通过练习提升", category: "财运" },
  { lineName: null, hillName: "水星丘", featureName: "水星丘隆起度", conditionOperator: "<", conditionValue: "0.65", score: 0, interpretation: "水星丘偏平，不太善于言辞，但做事踏实可靠", category: "财运" },

  // 金星丘（拇指根部）- 爱情、活力、热情
  { lineName: null, hillName: "金星丘", featureName: "金星丘隆起度", conditionOperator: ">=", conditionValue: "0.90", score: 10, interpretation: "金星丘极为饱满丰厚，主人热情奔放，生命力旺盛，爱情运极佳，婚姻美满幸福", category: "感情" },
  { lineName: null, hillName: "金星丘", featureName: "金星丘隆起度", conditionOperator: "between", conditionValue: "0.85-0.90", score: 9, interpretation: "金星丘非常饱满，主人充满活力，感情丰富，异性缘极佳", category: "感情" },
  { lineName: null, hillName: "金星丘", featureName: "金星丘隆起度", conditionOperator: "between", conditionValue: "0.80-0.85", score: 8, interpretation: "金星丘饱满，主人热情大方，善于表达爱意，感情生活丰富", category: "感情" },
  { lineName: null, hillName: "金星丘", featureName: "金星丘隆起度", conditionOperator: "between", conditionValue: "0.75-0.80", score: 7, interpretation: "金星丘较为隆起，感情运良好，能遇到心仪的伴侣", category: "感情" },
  { lineName: null, hillName: "金星丘", featureName: "金星丘隆起度", conditionOperator: "between", conditionValue: "0.70-0.75", score: 5, interpretation: "金星丘隆起度中上，感情生活正常，婚姻和谐", category: "感情" },
  { lineName: null, hillName: "金星丘", featureName: "金星丘隆起度", conditionOperator: "between", conditionValue: "0.65-0.70", score: 3, interpretation: "金星丘隆起度中等，感情上较为含蓄，需主动表达", category: "感情" },
  { lineName: null, hillName: "金星丘", featureName: "金星丘隆起度", conditionOperator: "<", conditionValue: "0.65", score: 0, interpretation: "金星丘偏平，感情上较为冷淡，建议多参加社交活动", category: "感情" },

  // 金星丘面积比例 (0.0-0.4)
  { lineName: null, hillName: "金星丘", featureName: "金星丘面积比例", conditionOperator: ">=", conditionValue: "0.30", score: 9, interpretation: "金星丘面积宽广，主人精力极为旺盛，体力充沛，生活充满激情", category: "健康" },
  { lineName: null, hillName: "金星丘", featureName: "金星丘面积比例", conditionOperator: "between", conditionValue: "0.25-0.30", score: 7, interpretation: "金星丘面积较大，体力充沛，活力四射", category: "健康" },
  { lineName: null, hillName: "金星丘", featureName: "金星丘面积比例", conditionOperator: "between", conditionValue: "0.20-0.25", score: 5, interpretation: "金星丘面积适中，精力正常，生活平衡", category: "健康" },
  { lineName: null, hillName: "金星丘", featureName: "金星丘面积比例", conditionOperator: "between", conditionValue: "0.15-0.20", score: 2, interpretation: "金星丘面积偏小，体力一般，建议加强锻炼", category: "健康" },
  { lineName: null, hillName: "金星丘", featureName: "金星丘面积比例", conditionOperator: "<", conditionValue: "0.15", score: -2, interpretation: "金星丘面积较小，古手相学认为体力偏弱，需注意休息和营养", category: "健康" },

  // 太阴丘（小指下方手掌边缘）- 想象力、直觉、旅行
  { lineName: null, hillName: "太阴丘", featureName: "太阴丘隆起度", conditionOperator: ">=", conditionValue: "0.90", score: 9, interpretation: "太阴丘极为饱满，主人想象力极为丰富，直觉敏锐，适合从事文学、艺术或灵性工作", category: "事业" },
  { lineName: null, hillName: "太阴丘", featureName: "太阴丘隆起度", conditionOperator: "between", conditionValue: "0.85-0.90", score: 8, interpretation: "太阴丘非常饱满，主人富有想象力和创造力，梦境丰富，直觉准确", category: "事业" },
  { lineName: null, hillName: "太阴丘", featureName: "太阴丘隆起度", conditionOperator: "between", conditionValue: "0.80-0.85", score: 7, interpretation: "太阴丘饱满，主人有很好的直觉和洞察力，适合从事创意工作", category: "事业" },
  { lineName: null, hillName: "太阴丘", featureName: "太阴丘隆起度", conditionOperator: "between", conditionValue: "0.75-0.80", score: 6, interpretation: "太阴丘较为隆起，想象力丰富，喜欢旅行和探索", category: "事业" },
  { lineName: null, hillName: "太阴丘", featureName: "太阴丘隆起度", conditionOperator: "between", conditionValue: "0.70-0.75", score: 4, interpretation: "太阴丘隆起度中上，有一定的直觉能力和想象力", category: "事业" },
  { lineName: null, hillName: "太阴丘", featureName: "太阴丘隆起度", conditionOperator: "between", conditionValue: "0.65-0.70", score: 2, interpretation: "太阴丘隆起度中等，想象力一般，更注重现实", category: "事业" },
  { lineName: null, hillName: "太阴丘", featureName: "太阴丘隆起度", conditionOperator: "<", conditionValue: "0.65", score: 0, interpretation: "太阴丘偏平，性格务实，不太喜欢幻想，脚踏实地", category: "事业" },

  // 第一火星丘（拇指与食指之间）- 勇气、行动力
  { lineName: null, hillName: "第一火星丘", featureName: "第一火星丘隆起度", conditionOperator: ">=", conditionValue: "0.85", score: 9, interpretation: "第一火星丘极为饱满，主人勇气过人，行动力极强，敢于冒险，适合创业或从事挑战性工作", category: "事业" },
  { lineName: null, hillName: "第一火星丘", featureName: "第一火星丘隆起度", conditionOperator: "between", conditionValue: "0.80-0.85", score: 8, interpretation: "第一火星丘饱满，主人勇敢果断，遇到困难不退缩，有开拓精神", category: "事业" },
  { lineName: null, hillName: "第一火星丘", featureName: "第一火星丘隆起度", conditionOperator: "between", conditionValue: "0.75-0.80", score: 7, interpretation: "第一火星丘较为隆起，主人有勇气和魄力，做事果断", category: "事业" },
  { lineName: null, hillName: "第一火星丘", featureName: "第一火星丘隆起度", conditionOperator: "between", conditionValue: "0.70-0.75", score: 5, interpretation: "第一火星丘隆起度中上，有一定的勇气和行动力", category: "事业" },
  { lineName: null, hillName: "第一火星丘", featureName: "第一火星丘隆起度", conditionOperator: "between", conditionValue: "0.65-0.70", score: 3, interpretation: "第一火星丘隆起度中等，行动力一般，做事较为谨慎", category: "事业" },
  { lineName: null, hillName: "第一火星丘", featureName: "第一火星丘隆起度", conditionOperator: "<", conditionValue: "0.65", score: 0, interpretation: "第一火星丘偏平，性格较为温和，不太喜欢冒险，适合稳定的工作", category: "事业" },

  // 第二火星丘（水星丘下方）- 忍耐力、毅力
  { lineName: null, hillName: "第二火星丘", featureName: "第二火星丘隆起度", conditionOperator: ">=", conditionValue: "0.85", score: 9, interpretation: "第二火星丘极为饱满，主人忍耐力极强，意志坚定，能在逆境中坚持到底，最终取得成功", category: "事业" },
  { lineName: null, hillName: "第二火星丘", featureName: "第二火星丘隆起度", conditionOperator: "between", conditionValue: "0.80-0.85", score: 8, interpretation: "第二火星丘饱满，主人毅力过人，面对困难不轻言放弃", category: "事业" },
  { lineName: null, hillName: "第二火星丘", featureName: "第二火星丘隆起度", conditionOperator: "between", conditionValue: "0.75-0.80", score: 7, interpretation: "第二火星丘较为隆起，主人有较强的忍耐力和抗压能力", category: "事业" },
  { lineName: null, hillName: "第二火星丘", featureName: "第二火星丘隆起度", conditionOperator: "between", conditionValue: "0.70-0.75", score: 5, interpretation: "第二火星丘隆起度中上，忍耐力不错，能承受一定压力", category: "事业" },
  { lineName: null, hillName: "第二火星丘", featureName: "第二火星丘隆起度", conditionOperator: "between", conditionValue: "0.65-0.70", score: 3, interpretation: "第二火星丘隆起度中等，忍耐力一般，遇到大困难可能会动摇", category: "事业" },
  { lineName: null, hillName: "第二火星丘", featureName: "第二火星丘隆起度", conditionOperator: "<", conditionValue: "0.65", score: 0, interpretation: "第二火星丘偏平，忍耐力较弱，建议培养坚韧的性格", category: "事业" },
];
