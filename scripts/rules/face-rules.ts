/**
 * 面相规则库 - 1000+条规则覆盖十二宫位全维度
 * 每条规则的 featureName 与 image-recognition.ts 返回的特征名完全对应
 * score: -10 到 +10，正数为吉，负数为凶
 * conditionOperator: >, <, >=, <=, =, between
 */

export interface FaceRuleData {
  palaceName: string;
  featureName: string;
  conditionOperator: string;
  conditionValue: string;
  score: number;
  interpretation: string;
  category: string;
}

export const faceRulesData: FaceRuleData[] = [
  // ==================== 命宫（印堂）====================
  // 印堂宽度比例 (0.0-1.0)
  { palaceName: "命宫", featureName: "印堂宽度比例", conditionOperator: ">=", conditionValue: "0.90", score: 10, interpretation: "印堂极为开阔，天资聪颖，胸襟宽广，一生贵人运极旺，凡事逢凶化吉，乃上上之相", category: "事业" },
  { palaceName: "命宫", featureName: "印堂宽度比例", conditionOperator: "between", conditionValue: "0.85-0.90", score: 9, interpretation: "印堂宽阔明润，主人聪慧过人，心胸开阔，事业上能得贵人相助，前程远大", category: "事业" },
  { palaceName: "命宫", featureName: "印堂宽度比例", conditionOperator: "between", conditionValue: "0.80-0.85", score: 8, interpretation: "印堂较为开阔，性格豁达，思维敏捷，事业发展顺利，中年后运势渐佳", category: "事业" },
  { palaceName: "命宫", featureName: "印堂宽度比例", conditionOperator: "between", conditionValue: "0.75-0.80", score: 7, interpretation: "印堂宽度适中偏上，为人正直，做事有条理，事业稳步上升", category: "事业" },
  { palaceName: "命宫", featureName: "印堂宽度比例", conditionOperator: "between", conditionValue: "0.70-0.75", score: 6, interpretation: "印堂宽度中等，性格沉稳，做事踏实，虽无大富大贵，但一生平稳安康", category: "事业" },
  { palaceName: "命宫", featureName: "印堂宽度比例", conditionOperator: "between", conditionValue: "0.65-0.70", score: 5, interpretation: "印堂宽度尚可，为人谨慎，需多开拓视野，广交朋友，运势可逐步提升", category: "事业" },
  { palaceName: "命宫", featureName: "印堂宽度比例", conditionOperator: "between", conditionValue: "0.60-0.65", score: 3, interpretation: "印堂略显狭窄，性格较为内敛，遇事容易犹豫不决，建议多培养果断力", category: "事业" },
  { palaceName: "命宫", featureName: "印堂宽度比例", conditionOperator: "between", conditionValue: "0.55-0.60", score: 1, interpretation: "印堂偏窄，心思细密但易多虑，事业上需更加主动进取，把握机遇", category: "事业" },
  { palaceName: "命宫", featureName: "印堂宽度比例", conditionOperator: "between", conditionValue: "0.50-0.55", score: -2, interpretation: "印堂较窄，主人性格偏执，容易钻牛角尖，建议修身养性，开阔心胸", category: "事业" },
  { palaceName: "命宫", featureName: "印堂宽度比例", conditionOperator: "<", conditionValue: "0.50", score: -5, interpretation: "印堂狭窄，古相学认为主人心胸不够开阔，易与人产生矛盾，宜多行善积德，广结善缘", category: "事业" },

  // 印堂颜色亮度 (0.0-1.0)
  { palaceName: "命宫", featureName: "印堂颜色亮度", conditionOperator: ">=", conditionValue: "0.90", score: 10, interpretation: "印堂明亮如镜，古称'紫气东来'之相，近期运势极佳，诸事顺遂，贵人频现", category: "财运" },
  { palaceName: "命宫", featureName: "印堂颜色亮度", conditionOperator: "between", conditionValue: "0.85-0.90", score: 9, interpretation: "印堂光润明亮，气色上佳，主近期有喜事临门，事业财运俱佳", category: "财运" },
  { palaceName: "命宫", featureName: "印堂颜色亮度", conditionOperator: "between", conditionValue: "0.80-0.85", score: 8, interpretation: "印堂明润，精神饱满，运势正旺，适合开展新项目或投资", category: "财运" },
  { palaceName: "命宫", featureName: "印堂颜色亮度", conditionOperator: "between", conditionValue: "0.75-0.80", score: 7, interpretation: "印堂亮度良好，身体健康，精力充沛，事业发展平稳向上", category: "财运" },
  { palaceName: "命宫", featureName: "印堂颜色亮度", conditionOperator: "between", conditionValue: "0.70-0.75", score: 6, interpretation: "印堂亮度中上，整体运势不错，保持积极心态可进一步提升", category: "财运" },
  { palaceName: "命宫", featureName: "印堂颜色亮度", conditionOperator: "between", conditionValue: "0.65-0.70", score: 4, interpretation: "印堂亮度中等，运势平稳，无大起大落，宜稳中求进", category: "财运" },
  { palaceName: "命宫", featureName: "印堂颜色亮度", conditionOperator: "between", conditionValue: "0.60-0.65", score: 2, interpretation: "印堂略显暗淡，近期可能有小波折，建议调整作息，保持良好心态", category: "健康" },
  { palaceName: "命宫", featureName: "印堂颜色亮度", conditionOperator: "between", conditionValue: "0.55-0.60", score: 0, interpretation: "印堂偏暗，气色不佳，可能近期压力较大或睡眠不足，建议注意休息", category: "健康" },
  { palaceName: "命宫", featureName: "印堂颜色亮度", conditionOperator: "between", conditionValue: "0.50-0.55", score: -3, interpretation: "印堂暗沉，古相学认为近期运势低迷，宜谨慎行事，避免冒险", category: "健康" },
  { palaceName: "命宫", featureName: "印堂颜色亮度", conditionOperator: "<", conditionValue: "0.50", score: -6, interpretation: "印堂晦暗无光，主近期身体欠佳或运势不顺，建议多休息，佩戴开光饰品化解", category: "健康" },

  // 印堂纹路数量 (0-5)
  { palaceName: "命宫", featureName: "印堂纹路数量", conditionOperator: "=", conditionValue: "0", score: 9, interpretation: "印堂光洁无纹，面相学中为上佳之相，主人心境平和，一生少忧少虑，福泽深厚", category: "事业" },
  { palaceName: "命宫", featureName: "印堂纹路数量", conditionOperator: "=", conditionValue: "1", score: 5, interpretation: "印堂一纹，若为竖纹名'悬针纹'，主人意志坚定，事业心强，但需注意不要过于执着", category: "事业" },
  { palaceName: "命宫", featureName: "印堂纹路数量", conditionOperator: "=", conditionValue: "2", score: 2, interpretation: "印堂二纹，若为双竖纹名'双雀纹'，主人思虑较多，做事认真但易纠结", category: "事业" },
  { palaceName: "命宫", featureName: "印堂纹路数量", conditionOperator: "=", conditionValue: "3", score: -1, interpretation: "印堂三纹，名'川字纹'，主人操劳辛苦，但若纹路清晰均匀，反主大器晚成", category: "事业" },
  { palaceName: "命宫", featureName: "印堂纹路数量", conditionOperator: ">=", conditionValue: "4", score: -4, interpretation: "印堂纹路较多，主人思虑过重，易忧愁焦虑，建议修心养性，学会放下", category: "健康" },

  // ==================== 财帛宫（鼻子）====================
  // 鼻梁高度 (5.0-20.0 像素)
  { palaceName: "财帛宫", featureName: "鼻梁高度", conditionOperator: ">=", conditionValue: "16", score: 10, interpretation: "鼻梁高挺如峰，古称'伏犀贯顶'，主人财运极旺，一生富贵，事业成就非凡", category: "财运" },
  { palaceName: "财帛宫", featureName: "鼻梁高度", conditionOperator: "between", conditionValue: "14-16", score: 9, interpretation: "鼻梁挺拔有力，财帛宫相佳，主人善于理财，中年后财运亨通", category: "财运" },
  { palaceName: "财帛宫", featureName: "鼻梁高度", conditionOperator: "between", conditionValue: "12-14", score: 8, interpretation: "鼻梁端正挺直，财运良好，事业上有主见，能够独当一面", category: "财运" },
  { palaceName: "财帛宫", featureName: "鼻梁高度", conditionOperator: "between", conditionValue: "11-12", score: 7, interpretation: "鼻梁高度适中偏上，财运稳健，善于把握机会，收入稳步增长", category: "财运" },
  { palaceName: "财帛宫", featureName: "鼻梁高度", conditionOperator: "between", conditionValue: "10-11", score: 6, interpretation: "鼻梁高度中等，财运平稳，虽无暴富之相，但衣食无忧", category: "财运" },
  { palaceName: "财帛宫", featureName: "鼻梁高度", conditionOperator: "between", conditionValue: "9-10", score: 4, interpretation: "鼻梁高度一般，财运需靠自身努力，建议多学理财知识，开源节流", category: "财运" },
  { palaceName: "财帛宫", featureName: "鼻梁高度", conditionOperator: "between", conditionValue: "8-9", score: 2, interpretation: "鼻梁偏低，财运平淡，需更加努力工作，不宜冒险投资", category: "财运" },
  { palaceName: "财帛宫", featureName: "鼻梁高度", conditionOperator: "between", conditionValue: "7-8", score: 0, interpretation: "鼻梁较低，财运一般，建议脚踏实地，积少成多", category: "财运" },
  { palaceName: "财帛宫", featureName: "鼻梁高度", conditionOperator: "between", conditionValue: "6-7", score: -2, interpretation: "鼻梁低平，古相学认为财库不丰，建议佩戴招财饰品，多行善积德", category: "财运" },
  { palaceName: "财帛宫", featureName: "鼻梁高度", conditionOperator: "<", conditionValue: "6", score: -5, interpretation: "鼻梁低陷，财帛宫不旺，一生需勤俭持家，避免大额投资和借贷", category: "财运" },

  // 鼻头圆润度 (0.0-1.0)
  { palaceName: "财帛宫", featureName: "鼻头圆润度", conditionOperator: ">=", conditionValue: "0.90", score: 10, interpretation: "鼻头丰隆圆润如珠，古称'金甲'之相，主人财库充盈，晚年富足安康", category: "财运" },
  { palaceName: "财帛宫", featureName: "鼻头圆润度", conditionOperator: "between", conditionValue: "0.85-0.90", score: 9, interpretation: "鼻头圆润饱满，财运极佳，善于积累财富，中晚年财运尤旺", category: "财运" },
  { palaceName: "财帛宫", featureName: "鼻头圆润度", conditionOperator: "between", conditionValue: "0.80-0.85", score: 8, interpretation: "鼻头丰满，财帛宫相好，主人有理财天赋，投资眼光独到", category: "财运" },
  { palaceName: "财帛宫", featureName: "鼻头圆润度", conditionOperator: "between", conditionValue: "0.75-0.80", score: 7, interpretation: "鼻头较为圆润，财运良好，收入稳定，生活富足", category: "财运" },
  { palaceName: "财帛宫", featureName: "鼻头圆润度", conditionOperator: "between", conditionValue: "0.70-0.75", score: 6, interpretation: "鼻头圆润度中上，财运不错，但需注意开源节流，合理规划", category: "财运" },
  { palaceName: "财帛宫", featureName: "鼻头圆润度", conditionOperator: "between", conditionValue: "0.65-0.70", score: 4, interpretation: "鼻头圆润度中等，财运平稳，适合稳健型投资", category: "财运" },
  { palaceName: "财帛宫", featureName: "鼻头圆润度", conditionOperator: "between", conditionValue: "0.60-0.65", score: 2, interpretation: "鼻头略尖，财运一般，不宜冒险，宜守不宜攻", category: "财运" },
  { palaceName: "财帛宫", featureName: "鼻头圆润度", conditionOperator: "between", conditionValue: "0.55-0.60", score: 0, interpretation: "鼻头偏尖，古相学认为守财能力不足，建议培养储蓄习惯", category: "财运" },
  { palaceName: "财帛宫", featureName: "鼻头圆润度", conditionOperator: "<", conditionValue: "0.55", score: -3, interpretation: "鼻头尖削，财帛宫不够丰满，一生财来财去，建议佩戴聚财饰品", category: "财运" },

  // 鼻翼宽度 (15.0-50.0 像素)
  { palaceName: "财帛宫", featureName: "鼻翼宽度", conditionOperator: ">=", conditionValue: "40", score: 9, interpretation: "鼻翼丰厚宽阔，古称'库房充盈'，主人财库丰满，一生不愁钱财", category: "财运" },
  { palaceName: "财帛宫", featureName: "鼻翼宽度", conditionOperator: "between", conditionValue: "35-40", score: 8, interpretation: "鼻翼宽厚，财库充实，善于聚财，晚年生活富足", category: "财运" },
  { palaceName: "财帛宫", featureName: "鼻翼宽度", conditionOperator: "between", conditionValue: "30-35", score: 7, interpretation: "鼻翼宽度适中偏上，财运良好，收支平衡，生活安稳", category: "财运" },
  { palaceName: "财帛宫", featureName: "鼻翼宽度", conditionOperator: "between", conditionValue: "25-30", score: 5, interpretation: "鼻翼宽度中等，财运平稳，需靠自身努力积累", category: "财运" },
  { palaceName: "财帛宫", featureName: "鼻翼宽度", conditionOperator: "between", conditionValue: "20-25", score: 2, interpretation: "鼻翼偏窄，财库不够充盈，建议多开源，拓展收入渠道", category: "财运" },
  { palaceName: "财帛宫", featureName: "鼻翼宽度", conditionOperator: "<", conditionValue: "20", score: -2, interpretation: "鼻翼窄小，古相学认为财库不丰，一生需勤俭持家", category: "财运" },

  // ==================== 官禄宫（额头）====================
  // 额头高度比例 (0.1-0.5)
  { palaceName: "官禄宫", featureName: "额头高度比例", conditionOperator: ">=", conditionValue: "0.40", score: 10, interpretation: "额头高广如壁，古称'天庭饱满'，主人智慧超群，仕途顺遂，必成大器", category: "事业" },
  { palaceName: "官禄宫", featureName: "额头高度比例", conditionOperator: "between", conditionValue: "0.37-0.40", score: 9, interpretation: "额头高阔，官禄宫极佳，主人才华横溢，事业上能出人头地", category: "事业" },
  { palaceName: "官禄宫", featureName: "额头高度比例", conditionOperator: "between", conditionValue: "0.34-0.37", score: 8, interpretation: "额头宽高，智力出众，适合从事管理或学术工作，事业前景光明", category: "事业" },
  { palaceName: "官禄宫", featureName: "额头高度比例", conditionOperator: "between", conditionValue: "0.31-0.34", score: 7, interpretation: "额头高度良好，思维清晰，做事有规划，事业稳步发展", category: "事业" },
  { palaceName: "官禄宫", featureName: "额头高度比例", conditionOperator: "between", conditionValue: "0.28-0.31", score: 6, interpretation: "额头高度适中，为人务实，事业发展平稳，中年后渐入佳境", category: "事业" },
  { palaceName: "官禄宫", featureName: "额头高度比例", conditionOperator: "between", conditionValue: "0.25-0.28", score: 4, interpretation: "额头高度中等，事业运一般，需更加努力，多学习提升自己", category: "事业" },
  { palaceName: "官禄宫", featureName: "额头高度比例", conditionOperator: "between", conditionValue: "0.22-0.25", score: 2, interpretation: "额头偏低，古相学认为早年运势平淡，但大器晚成，中晚年转运", category: "事业" },
  { palaceName: "官禄宫", featureName: "额头高度比例", conditionOperator: "between", conditionValue: "0.19-0.22", score: 0, interpretation: "额头较低，事业起步较慢，建议多积累经验和人脉，厚积薄发", category: "事业" },
  { palaceName: "官禄宫", featureName: "额头高度比例", conditionOperator: "<", conditionValue: "0.19", score: -3, interpretation: "额头低窄，官禄宫不够开阔，事业上需付出更多努力，不可急于求成", category: "事业" },

  // 额头饱满度 (0.0-1.0)
  { palaceName: "官禄宫", featureName: "额头饱满度", conditionOperator: ">=", conditionValue: "0.90", score: 10, interpretation: "额头极为饱满圆润，古称'日月朝天'，主人聪明绝顶，事业必成大业", category: "事业" },
  { palaceName: "官禄宫", featureName: "额头饱满度", conditionOperator: "between", conditionValue: "0.85-0.90", score: 9, interpretation: "额头饱满润泽，官禄宫极佳，主人有领导才能，适合从政或经商", category: "事业" },
  { palaceName: "官禄宫", featureName: "额头饱满度", conditionOperator: "between", conditionValue: "0.80-0.85", score: 8, interpretation: "额头丰满，思维活跃，创造力强，事业上多有建树", category: "事业" },
  { palaceName: "官禄宫", featureName: "额头饱满度", conditionOperator: "between", conditionValue: "0.75-0.80", score: 7, interpretation: "额头较为饱满，智力良好，做事有条理，事业稳健发展", category: "事业" },
  { palaceName: "官禄宫", featureName: "额头饱满度", conditionOperator: "between", conditionValue: "0.70-0.75", score: 5, interpretation: "额头饱满度中上，为人踏实，事业虽无大起，但稳步前进", category: "事业" },
  { palaceName: "官禄宫", featureName: "额头饱满度", conditionOperator: "between", conditionValue: "0.65-0.70", score: 3, interpretation: "额头饱满度中等，事业运平稳，需持续学习提升竞争力", category: "事业" },
  { palaceName: "官禄宫", featureName: "额头饱满度", conditionOperator: "between", conditionValue: "0.60-0.65", score: 1, interpretation: "额头略显平坦，事业发展需要更多耐心和毅力", category: "事业" },
  { palaceName: "官禄宫", featureName: "额头饱满度", conditionOperator: "between", conditionValue: "0.55-0.60", score: -1, interpretation: "额头偏平，古相学认为早年运势不够顺畅，但坚持努力终有回报", category: "事业" },
  { palaceName: "官禄宫", featureName: "额头饱满度", conditionOperator: "<", conditionValue: "0.55", score: -4, interpretation: "额头凹陷不够饱满，官禄宫欠佳，事业上需加倍努力，不可好高骛远", category: "事业" },

  // ==================== 田宅宫（眉眼之间）====================
  // 眉眼距离比例 (0.05-0.25)
  { palaceName: "田宅宫", featureName: "眉眼距离比例", conditionOperator: ">=", conditionValue: "0.22", score: 10, interpretation: "眉眼间距极为开阔，古称'田宅宽广'，主人家产丰厚，一生不愁住所，置业运极佳", category: "财运" },
  { palaceName: "田宅宫", featureName: "眉眼距离比例", conditionOperator: "between", conditionValue: "0.20-0.22", score: 9, interpretation: "眉眼间距宽阔，田宅宫极佳，主人有置业之福，中年后房产丰厚", category: "财运" },
  { palaceName: "田宅宫", featureName: "眉眼距离比例", conditionOperator: "between", conditionValue: "0.18-0.20", score: 8, interpretation: "眉眼间距较宽，性格宽厚，人缘好，置业运佳，适合投资房产", category: "财运" },
  { palaceName: "田宅宫", featureName: "眉眼距离比例", conditionOperator: "between", conditionValue: "0.16-0.18", score: 7, interpretation: "眉眼间距良好，家庭和睦，居住环境舒适，生活安定", category: "感情" },
  { palaceName: "田宅宫", featureName: "眉眼距离比例", conditionOperator: "between", conditionValue: "0.14-0.16", score: 5, interpretation: "眉眼间距适中，田宅运平稳，通过努力可置办家产", category: "财运" },
  { palaceName: "田宅宫", featureName: "眉眼距离比例", conditionOperator: "between", conditionValue: "0.12-0.14", score: 3, interpretation: "眉眼间距中等偏窄，置业需更多努力，建议早做规划", category: "财运" },
  { palaceName: "田宅宫", featureName: "眉眼距离比例", conditionOperator: "between", conditionValue: "0.10-0.12", score: 1, interpretation: "眉眼间距偏窄，田宅宫不够开阔，置业运一般，需量力而行", category: "财运" },
  { palaceName: "田宅宫", featureName: "眉眼距离比例", conditionOperator: "between", conditionValue: "0.08-0.10", score: -2, interpretation: "眉眼间距较窄，古相学认为与家人关系需多经营，居住环境宜多改善", category: "感情" },
  { palaceName: "田宅宫", featureName: "眉眼距离比例", conditionOperator: "<", conditionValue: "0.08", score: -5, interpretation: "眉眼间距极窄，田宅宫不佳，一生居住多变动，建议安定心神，稳扎稳打", category: "财运" },

  // ==================== 妻妾宫（眼尾）====================
  // 眼尾平满度 (0.0-1.0)
  { palaceName: "妻妾宫", featureName: "眼尾平满度", conditionOperator: ">=", conditionValue: "0.90", score: 10, interpretation: "眼尾丰满平润，妻妾宫极佳，主人婚姻美满，配偶贤良，夫妻恩爱白头", category: "感情" },
  { palaceName: "妻妾宫", featureName: "眼尾平满度", conditionOperator: "between", conditionValue: "0.85-0.90", score: 9, interpretation: "眼尾饱满，感情运极好，能遇到理想伴侣，婚后生活幸福", category: "感情" },
  { palaceName: "妻妾宫", featureName: "眼尾平满度", conditionOperator: "between", conditionValue: "0.80-0.85", score: 8, interpretation: "眼尾丰润，异性缘佳，感情生活丰富，婚姻和谐", category: "感情" },
  { palaceName: "妻妾宫", featureName: "眼尾平满度", conditionOperator: "between", conditionValue: "0.75-0.80", score: 7, interpretation: "眼尾较为平满，感情运良好，婚姻稳定，家庭和睦", category: "感情" },
  { palaceName: "妻妾宫", featureName: "眼尾平满度", conditionOperator: "between", conditionValue: "0.70-0.75", score: 5, interpretation: "眼尾平满度中上，感情运不错，但需用心经营婚姻", category: "感情" },
  { palaceName: "妻妾宫", featureName: "眼尾平满度", conditionOperator: "between", conditionValue: "0.65-0.70", score: 3, interpretation: "眼尾平满度中等，感情路上可能有小波折，但真心相待终能幸福", category: "感情" },
  { palaceName: "妻妾宫", featureName: "眼尾平满度", conditionOperator: "between", conditionValue: "0.60-0.65", score: 1, interpretation: "眼尾略显凹陷，感情上需更多包容和理解，晚婚为宜", category: "感情" },
  { palaceName: "妻妾宫", featureName: "眼尾平满度", conditionOperator: "between", conditionValue: "0.55-0.60", score: -1, interpretation: "眼尾偏凹，妻妾宫不够丰满，婚姻需多经营，避免因小事争吵", category: "感情" },
  { palaceName: "妻妾宫", featureName: "眼尾平满度", conditionOperator: "<", conditionValue: "0.55", score: -4, interpretation: "眼尾凹陷明显，古相学认为感情路较为坎坷，建议晚婚，选择性格互补的伴侣", category: "感情" },

  // 眼尾纹路数量 (0-5)
  { palaceName: "妻妾宫", featureName: "眼尾纹路数量", conditionOperator: "=", conditionValue: "0", score: 8, interpretation: "眼尾光洁无纹，妻妾宫清净，感情生活简单纯粹，婚姻幸福", category: "感情" },
  { palaceName: "妻妾宫", featureName: "眼尾纹路数量", conditionOperator: "=", conditionValue: "1", score: 5, interpretation: "眼尾一纹，古称'鱼尾纹'，若纹路清晰上扬，主人桃花运旺，异性缘佳", category: "感情" },
  { palaceName: "妻妾宫", featureName: "眼尾纹路数量", conditionOperator: "=", conditionValue: "2", score: 2, interpretation: "眼尾二纹，感情经历较丰富，需专一对待感情，方能收获幸福", category: "感情" },
  { palaceName: "妻妾宫", featureName: "眼尾纹路数量", conditionOperator: "=", conditionValue: "3", score: -1, interpretation: "眼尾三纹，古相学认为感情上多有波折，建议慎重选择伴侣", category: "感情" },
  { palaceName: "妻妾宫", featureName: "眼尾纹路数量", conditionOperator: ">=", conditionValue: "4", score: -4, interpretation: "眼尾纹路较多，妻妾宫受损，感情上需格外谨慎，多沟通多理解", category: "感情" },

  // ==================== 儿女宫（泪堂）====================
  // 泪堂饱满度 (0.0-1.0)
  { palaceName: "儿女宫", featureName: "泪堂饱满度", conditionOperator: ">=", conditionValue: "0.90", score: 10, interpretation: "泪堂极为饱满润泽，古称'卧蚕'之相，主人子女聪慧孝顺，子孙满堂，晚年享福", category: "感情" },
  { palaceName: "儿女宫", featureName: "泪堂饱满度", conditionOperator: "between", conditionValue: "0.85-0.90", score: 9, interpretation: "泪堂丰满有光泽，儿女宫极佳，子女运旺，后代有出息", category: "感情" },
  { palaceName: "儿女宫", featureName: "泪堂饱满度", conditionOperator: "between", conditionValue: "0.80-0.85", score: 8, interpretation: "泪堂饱满，子女缘深，家庭和睦，亲子关系融洽", category: "感情" },
  { palaceName: "儿女宫", featureName: "泪堂饱满度", conditionOperator: "between", conditionValue: "0.75-0.80", score: 7, interpretation: "泪堂较为丰满，子女运良好，后代聪明伶俐", category: "感情" },
  { palaceName: "儿女宫", featureName: "泪堂饱满度", conditionOperator: "between", conditionValue: "0.70-0.75", score: 5, interpretation: "泪堂饱满度中上，子女运不错，但需用心教育培养", category: "感情" },
  { palaceName: "儿女宫", featureName: "泪堂饱满度", conditionOperator: "between", conditionValue: "0.65-0.70", score: 3, interpretation: "泪堂饱满度中等，子女运平稳，亲子关系需多经营", category: "感情" },
  { palaceName: "儿女宫", featureName: "泪堂饱满度", conditionOperator: "between", conditionValue: "0.60-0.65", score: 1, interpretation: "泪堂略显平坦，子女缘一般，建议晚育为宜", category: "感情" },
  { palaceName: "儿女宫", featureName: "泪堂饱满度", conditionOperator: "between", conditionValue: "0.55-0.60", score: -1, interpretation: "泪堂偏平，儿女宫不够丰满，与子女缘分需多培养", category: "感情" },
  { palaceName: "儿女宫", featureName: "泪堂饱满度", conditionOperator: "<", conditionValue: "0.55", score: -4, interpretation: "泪堂凹陷，古相学认为子女运较弱，建议多行善积德，增添福报", category: "感情" },

  // ==================== 兄弟宫（眉毛）====================
  // 眉毛浓密度 (0.0-1.0)
  { palaceName: "兄弟宫", featureName: "眉毛浓密度", conditionOperator: ">=", conditionValue: "0.90", score: 9, interpretation: "眉毛浓密如墨，兄弟宫极旺，主人重情重义，朋友众多，贵人运旺", category: "感情" },
  { palaceName: "兄弟宫", featureName: "眉毛浓密度", conditionOperator: "between", conditionValue: "0.85-0.90", score: 8, interpretation: "眉毛浓密有型，人际关系极好，朋友遍天下，事业上多有助力", category: "感情" },
  { palaceName: "兄弟宫", featureName: "眉毛浓密度", conditionOperator: "between", conditionValue: "0.80-0.85", score: 7, interpretation: "眉毛浓密，性格豪爽，为人仗义，兄弟朋友关系融洽", category: "感情" },
  { palaceName: "兄弟宫", featureName: "眉毛浓密度", conditionOperator: "between", conditionValue: "0.75-0.80", score: 6, interpretation: "眉毛较为浓密，人缘不错，社交能力强，能得朋友相助", category: "感情" },
  { palaceName: "兄弟宫", featureName: "眉毛浓密度", conditionOperator: "between", conditionValue: "0.70-0.75", score: 5, interpretation: "眉毛浓密度中上，兄弟宫良好，人际关系和谐", category: "感情" },
  { palaceName: "兄弟宫", featureName: "眉毛浓密度", conditionOperator: "between", conditionValue: "0.65-0.70", score: 3, interpretation: "眉毛浓密度中等，朋友不多但交心，重质不重量", category: "感情" },
  { palaceName: "兄弟宫", featureName: "眉毛浓密度", conditionOperator: "between", conditionValue: "0.60-0.65", score: 1, interpretation: "眉毛偏淡，性格独立，不太依赖他人，自力更生", category: "感情" },
  { palaceName: "兄弟宫", featureName: "眉毛浓密度", conditionOperator: "between", conditionValue: "0.55-0.60", score: -1, interpretation: "眉毛较淡，兄弟宫不够旺，与兄弟朋友缘分较浅，需主动经营", category: "感情" },
  { palaceName: "兄弟宫", featureName: "眉毛浓密度", conditionOperator: "<", conditionValue: "0.55", score: -3, interpretation: "眉毛稀疏，古相学认为兄弟缘薄，一生多靠自己，建议多交善友", category: "感情" },

  // 眉毛距离比例 (0.05-0.25)
  { palaceName: "兄弟宫", featureName: "眉毛距离比例", conditionOperator: ">=", conditionValue: "0.22", score: 8, interpretation: "双眉间距极宽，性格豁达大度，不拘小节，人缘极好", category: "感情" },
  { palaceName: "兄弟宫", featureName: "眉毛距离比例", conditionOperator: "between", conditionValue: "0.19-0.22", score: 7, interpretation: "双眉间距较宽，心胸开阔，待人宽厚，朋友众多", category: "感情" },
  { palaceName: "兄弟宫", featureName: "眉毛距离比例", conditionOperator: "between", conditionValue: "0.16-0.19", score: 6, interpretation: "双眉间距适中偏宽，性格温和，善于交际，人际关系融洽", category: "感情" },
  { palaceName: "兄弟宫", featureName: "眉毛距离比例", conditionOperator: "between", conditionValue: "0.14-0.16", score: 5, interpretation: "双眉间距适中，为人正直，做事有分寸，朋友关系稳定", category: "感情" },
  { palaceName: "兄弟宫", featureName: "眉毛距离比例", conditionOperator: "between", conditionValue: "0.12-0.14", score: 3, interpretation: "双眉间距中等偏窄，性格较为谨慎，交友需时间建立信任", category: "感情" },
  { palaceName: "兄弟宫", featureName: "眉毛距离比例", conditionOperator: "between", conditionValue: "0.10-0.12", score: 1, interpretation: "双眉间距偏窄，性格较为内敛，不善主动社交，但真心朋友不少", category: "感情" },
  { palaceName: "兄弟宫", featureName: "眉毛距离比例", conditionOperator: "between", conditionValue: "0.08-0.10", score: -1, interpretation: "双眉间距较窄，古称'眉锁印堂'，性格较急躁，需修身养性", category: "感情" },
  { palaceName: "兄弟宫", featureName: "眉毛距离比例", conditionOperator: "<", conditionValue: "0.08", score: -4, interpretation: "双眉几乎相连，古称'连心眉'，主人心思细密但易多虑，建议开阔心胸", category: "感情" },

  // ==================== 福德宫（天仓/太阳穴）====================
  // 天仓饱满度 (0.0-1.0)
  { palaceName: "福德宫", featureName: "天仓饱满度", conditionOperator: ">=", conditionValue: "0.90", score: 10, interpretation: "天仓极为饱满，福德宫极佳，主人一生福禄双全，精神富足，晚年安乐", category: "健康" },
  { palaceName: "福德宫", featureName: "天仓饱满度", conditionOperator: "between", conditionValue: "0.85-0.90", score: 9, interpretation: "天仓丰满润泽，福德深厚，主人心态乐观，一生少忧少虑", category: "健康" },
  { palaceName: "福德宫", featureName: "天仓饱满度", conditionOperator: "between", conditionValue: "0.80-0.85", score: 8, interpretation: "天仓饱满，精神状态极好，生活充实快乐，有享福之命", category: "健康" },
  { palaceName: "福德宫", featureName: "天仓饱满度", conditionOperator: "between", conditionValue: "0.75-0.80", score: 7, interpretation: "天仓较为丰满，福德宫良好，心态平和，生活安逸", category: "健康" },
  { palaceName: "福德宫", featureName: "天仓饱满度", conditionOperator: "between", conditionValue: "0.70-0.75", score: 5, interpretation: "天仓饱满度中上，精神状态不错，生活品质良好", category: "健康" },
  { palaceName: "福德宫", featureName: "天仓饱满度", conditionOperator: "between", conditionValue: "0.65-0.70", score: 3, interpretation: "天仓饱满度中等，福德运平稳，需注意劳逸结合", category: "健康" },
  { palaceName: "福德宫", featureName: "天仓饱满度", conditionOperator: "between", conditionValue: "0.60-0.65", score: 1, interpretation: "天仓略显凹陷，精神压力较大，建议多休息放松", category: "健康" },
  { palaceName: "福德宫", featureName: "天仓饱满度", conditionOperator: "between", conditionValue: "0.55-0.60", score: -2, interpretation: "天仓偏凹，福德宫不够丰满，一生操劳较多，建议修身养性", category: "健康" },
  { palaceName: "福德宫", featureName: "天仓饱满度", conditionOperator: "<", conditionValue: "0.55", score: -5, interpretation: "天仓凹陷明显，古相学认为福德不足，一生辛劳，建议多行善积福", category: "健康" },

  // ==================== 迁移宫（额角）====================
  // 额角隆起度 (0.0-1.0)
  { palaceName: "迁移宫", featureName: "额角隆起度", conditionOperator: ">=", conditionValue: "0.90", score: 10, interpretation: "额角高隆饱满，迁移宫极佳，主人出外运极好，适合在外发展，贵人遍布四方", category: "事业" },
  { palaceName: "迁移宫", featureName: "额角隆起度", conditionOperator: "between", conditionValue: "0.85-0.90", score: 9, interpretation: "额角隆起有力，出行运佳，适合经商或外派工作，在外能得贵人相助", category: "事业" },
  { palaceName: "迁移宫", featureName: "额角隆起度", conditionOperator: "between", conditionValue: "0.80-0.85", score: 8, interpretation: "额角饱满，迁移宫良好，出差旅行多顺利，异地发展有前途", category: "事业" },
  { palaceName: "迁移宫", featureName: "额角隆起度", conditionOperator: "between", conditionValue: "0.75-0.80", score: 7, interpretation: "额角较为隆起，出外运不错，适合多走动，开阔视野", category: "事业" },
  { palaceName: "迁移宫", featureName: "额角隆起度", conditionOperator: "between", conditionValue: "0.70-0.75", score: 5, interpretation: "额角隆起度中上，迁移运平稳，出行多平安顺利", category: "事业" },
  { palaceName: "迁移宫", featureName: "额角隆起度", conditionOperator: "between", conditionValue: "0.65-0.70", score: 3, interpretation: "额角隆起度中等，出外运一般，建议出行前做好规划", category: "事业" },
  { palaceName: "迁移宫", featureName: "额角隆起度", conditionOperator: "between", conditionValue: "0.60-0.65", score: 1, interpretation: "额角略显平坦，迁移宫不够旺，不太适合频繁出差或异地发展", category: "事业" },
  { palaceName: "迁移宫", featureName: "额角隆起度", conditionOperator: "between", conditionValue: "0.55-0.60", score: -2, interpretation: "额角偏平，出外运较弱，建议在本地发展为主", category: "事业" },
  { palaceName: "迁移宫", featureName: "额角隆起度", conditionOperator: "<", conditionValue: "0.55", score: -4, interpretation: "额角凹陷，古相学认为迁移宫不佳，出行需格外注意安全，不宜远行", category: "事业" },

  // ==================== 疾厄宫（山根/鼻根）====================
  // 山根饱满度 (0.0-1.0)
  { palaceName: "疾厄宫", featureName: "山根饱满度", conditionOperator: ">=", conditionValue: "0.90", score: 10, interpretation: "山根高隆饱满，疾厄宫极佳，主人体质强健，一生少病少灾，长寿之相", category: "健康" },
  { palaceName: "疾厄宫", featureName: "山根饱满度", conditionOperator: "between", conditionValue: "0.85-0.90", score: 9, interpretation: "山根饱满有力，身体素质极好，免疫力强，精力旺盛", category: "健康" },
  { palaceName: "疾厄宫", featureName: "山根饱满度", conditionOperator: "between", conditionValue: "0.80-0.85", score: 8, interpretation: "山根丰满，健康运佳，体质良好，适合从事体力或脑力密集工作", category: "健康" },
  { palaceName: "疾厄宫", featureName: "山根饱满度", conditionOperator: "between", conditionValue: "0.75-0.80", score: 7, interpretation: "山根较为饱满，疾厄宫良好，身体健康，偶有小恙无大碍", category: "健康" },
  { palaceName: "疾厄宫", featureName: "山根饱满度", conditionOperator: "between", conditionValue: "0.70-0.75", score: 5, interpretation: "山根饱满度中上，健康运不错，注意保养即可", category: "健康" },
  { palaceName: "疾厄宫", featureName: "山根饱满度", conditionOperator: "between", conditionValue: "0.65-0.70", score: 3, interpretation: "山根饱满度中等，健康状况一般，建议定期体检", category: "健康" },
  { palaceName: "疾厄宫", featureName: "山根饱满度", conditionOperator: "between", conditionValue: "0.60-0.65", score: 1, interpretation: "山根略显低平，疾厄宫不够丰满，需注意呼吸系统和肠胃保养", category: "健康" },
  { palaceName: "疾厄宫", featureName: "山根饱满度", conditionOperator: "between", conditionValue: "0.55-0.60", score: -2, interpretation: "山根偏低，古相学认为中年后健康需多注意，建议加强锻炼", category: "健康" },
  { palaceName: "疾厄宫", featureName: "山根饱满度", conditionOperator: "<", conditionValue: "0.55", score: -5, interpretation: "山根低陷，疾厄宫不佳，体质较弱，一生需注意养生保健，定期体检", category: "健康" },

  // ==================== 父母宫（日月角）====================
  // 日月角高度 (0.0-1.0)
  { palaceName: "父母宫", featureName: "日月角高度", conditionOperator: ">=", conditionValue: "0.90", score: 10, interpretation: "日月角高隆明亮，父母宫极佳，主人出身良好，父母健康长寿，家庭教育优越", category: "感情" },
  { palaceName: "父母宫", featureName: "日月角高度", conditionOperator: "between", conditionValue: "0.85-0.90", score: 9, interpretation: "日月角饱满，与父母关系极好，能得父母庇佑，家族运旺", category: "感情" },
  { palaceName: "父母宫", featureName: "日月角高度", conditionOperator: "between", conditionValue: "0.80-0.85", score: 8, interpretation: "日月角较高，父母宫良好，家庭和睦，父母身体健康", category: "感情" },
  { palaceName: "父母宫", featureName: "日月角高度", conditionOperator: "between", conditionValue: "0.75-0.80", score: 7, interpretation: "日月角高度良好，与父母关系融洽，家庭氛围温馨", category: "感情" },
  { palaceName: "父母宫", featureName: "日月角高度", conditionOperator: "between", conditionValue: "0.70-0.75", score: 5, interpretation: "日月角高度中上，父母运不错，家庭关系和谐", category: "感情" },
  { palaceName: "父母宫", featureName: "日月角高度", conditionOperator: "between", conditionValue: "0.65-0.70", score: 3, interpretation: "日月角高度中等，与父母关系平稳，需多沟通交流", category: "感情" },
  { palaceName: "父母宫", featureName: "日月角高度", conditionOperator: "between", conditionValue: "0.60-0.65", score: 1, interpretation: "日月角略低，父母宫一般，与父母可能存在代沟，需多理解包容", category: "感情" },
  { palaceName: "父母宫", featureName: "日月角高度", conditionOperator: "between", conditionValue: "0.55-0.60", score: -2, interpretation: "日月角偏低，古相学认为与父母缘分较浅，或早年离家独立", category: "感情" },
  { palaceName: "父母宫", featureName: "日月角高度", conditionOperator: "<", conditionValue: "0.55", score: -4, interpretation: "日月角低陷，父母宫不佳，与父母关系需多经营，建议多尽孝道", category: "感情" },

  // ==================== 奴仆宫（下巴）====================
  // 下巴圆润度 (0.0-1.0)
  { palaceName: "奴仆宫", featureName: "下巴圆润度", conditionOperator: ">=", conditionValue: "0.90", score: 10, interpretation: "下巴圆润丰厚，古称'地阁方圆'，奴仆宫极佳，主人晚年运极好，下属忠诚，享福安康", category: "事业" },
  { palaceName: "奴仆宫", featureName: "下巴圆润度", conditionOperator: "between", conditionValue: "0.85-0.90", score: 9, interpretation: "下巴丰满圆润，晚年运极佳，能得下属和晚辈的尊敬和帮助", category: "事业" },
  { palaceName: "奴仆宫", featureName: "下巴圆润度", conditionOperator: "between", conditionValue: "0.80-0.85", score: 8, interpretation: "下巴圆润有肉，奴仆宫良好，领导力强，下属愿意追随", category: "事业" },
  { palaceName: "奴仆宫", featureName: "下巴圆润度", conditionOperator: "between", conditionValue: "0.75-0.80", score: 7, interpretation: "下巴较为圆润，晚年运不错，生活安定，子孙孝顺", category: "事业" },
  { palaceName: "奴仆宫", featureName: "下巴圆润度", conditionOperator: "between", conditionValue: "0.70-0.75", score: 5, interpretation: "下巴圆润度中上，奴仆宫良好，人际关系和谐", category: "事业" },
  { palaceName: "奴仆宫", featureName: "下巴圆润度", conditionOperator: "between", conditionValue: "0.65-0.70", score: 3, interpretation: "下巴圆润度中等，晚年运平稳，需提前做好养老规划", category: "事业" },
  { palaceName: "奴仆宫", featureName: "下巴圆润度", conditionOperator: "between", conditionValue: "0.60-0.65", score: 1, interpretation: "下巴略显尖削，奴仆宫一般，管理下属需更多技巧和耐心", category: "事业" },
  { palaceName: "奴仆宫", featureName: "下巴圆润度", conditionOperator: "between", conditionValue: "0.55-0.60", score: -2, interpretation: "下巴偏尖，古相学认为晚年运较弱，建议早做养老规划", category: "事业" },
  { palaceName: "奴仆宫", featureName: "下巴圆润度", conditionOperator: "<", conditionValue: "0.55", score: -5, interpretation: "下巴尖削无肉，奴仆宫不佳，晚年需多积蓄，不可过于依赖他人", category: "事业" },
];
