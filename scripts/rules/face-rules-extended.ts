/**
 * 面相扩展规则库 - 五官细分、面型体系、气色判断、组合判断
 * 补充 face-rules.ts 中的十二宫位规则
 */

export interface FaceExtendedRuleData {
  palaceName: string;
  featureName: string;
  conditionOperator: string;
  conditionValue: string;
  score: number;
  interpretation: string;
  category: string;
}

export const faceExtendedRulesData: FaceExtendedRuleData[] = [
  // ==================== 五官细分 - 眉相 ====================
  // 左眉高度比例
  { palaceName: "兄弟宫", featureName: "左眉高度比例", conditionOperator: ">=", conditionValue: "0.85", score: 9, interpretation: "眉毛高挑飞扬，古称'扬眉吐气'，主人志向远大，胸怀宽广，兄弟朋友运极佳", category: "人际" },
  { palaceName: "兄弟宫", featureName: "左眉高度比例", conditionOperator: "between", conditionValue: "0.80-0.85", score: 8, interpretation: "眉毛位置较高，主人性格开朗大方，人缘好，朋友众多", category: "人际" },
  { palaceName: "兄弟宫", featureName: "左眉高度比例", conditionOperator: "between", conditionValue: "0.75-0.80", score: 7, interpretation: "眉毛高度适中偏高，主人待人真诚，兄弟朋友关系融洽", category: "人际" },
  { palaceName: "兄弟宫", featureName: "左眉高度比例", conditionOperator: "between", conditionValue: "0.70-0.75", score: 5, interpretation: "眉毛高度适中，兄弟宫平稳，人际关系正常", category: "人际" },
  { palaceName: "兄弟宫", featureName: "左眉高度比例", conditionOperator: "between", conditionValue: "0.65-0.70", score: 3, interpretation: "眉毛位置偏低，性格较为内敛，不太善于社交", category: "人际" },
  { palaceName: "兄弟宫", featureName: "左眉高度比例", conditionOperator: "<", conditionValue: "0.65", score: 0, interpretation: "眉毛低压眼睛，古相学认为'眉压眼则心胸窄'，建议多与人交流", category: "人际" },

  // 眉间距比例
  { palaceName: "命宫", featureName: "眉间距比例", conditionOperator: ">=", conditionValue: "0.85", score: 8, interpretation: "眉间距宽广，印堂开阔，古称'天庭饱满'，主人心胸宽广，气量大，贵人运极佳", category: "事业" },
  { palaceName: "命宫", featureName: "眉间距比例", conditionOperator: "between", conditionValue: "0.80-0.85", score: 7, interpretation: "眉间距较宽，印堂明亮，主人性格豁达，做事大气", category: "事业" },
  { palaceName: "命宫", featureName: "眉间距比例", conditionOperator: "between", conditionValue: "0.75-0.80", score: 6, interpretation: "眉间距适中，命宫正常，运势平稳", category: "事业" },
  { palaceName: "命宫", featureName: "眉间距比例", conditionOperator: "between", conditionValue: "0.70-0.75", score: 4, interpretation: "眉间距中等偏窄，做事较为谨慎", category: "事业" },
  { palaceName: "命宫", featureName: "眉间距比例", conditionOperator: "<", conditionValue: "0.70", score: 0, interpretation: "眉间距较窄，古相学认为'印堂窄则气量小'，建议修身养性，拓宽心胸", category: "事业" },

  // ==================== 五官细分 - 眼相 ====================
  // 左眼宽度比例
  { palaceName: "妻妾宫", featureName: "左眼宽度比例", conditionOperator: ">=", conditionValue: "0.85", score: 9, interpretation: "眼睛大而有神，古称'龙目凤眼'，主人聪明伶俐，异性缘极佳，婚姻美满", category: "感情" },
  { palaceName: "妻妾宫", featureName: "左眼宽度比例", conditionOperator: "between", conditionValue: "0.80-0.85", score: 8, interpretation: "眼睛较大，目光明亮，主人感情丰富，善于表达爱意", category: "感情" },
  { palaceName: "妻妾宫", featureName: "左眼宽度比例", conditionOperator: "between", conditionValue: "0.75-0.80", score: 7, interpretation: "眼睛大小适中偏大，眼神温和，感情运良好", category: "感情" },
  { palaceName: "妻妾宫", featureName: "左眼宽度比例", conditionOperator: "between", conditionValue: "0.70-0.75", score: 5, interpretation: "眼睛大小适中，妻妾宫平稳", category: "感情" },
  { palaceName: "妻妾宫", featureName: "左眼宽度比例", conditionOperator: "between", conditionValue: "0.65-0.70", score: 3, interpretation: "眼睛偏小，性格较为含蓄内敛，感情上不善表达", category: "感情" },
  { palaceName: "妻妾宫", featureName: "左眼宽度比例", conditionOperator: "<", conditionValue: "0.65", score: 1, interpretation: "眼睛较小，古相学认为'目小则心细'，做事谨慎，感情上需主动", category: "感情" },

  // 眼间距比例
  { palaceName: "疾厄宫", featureName: "眼间距比例", conditionOperator: ">=", conditionValue: "0.85", score: 7, interpretation: "两眼间距较宽，古称'山根宽阔'，主人性格宽厚，包容心强，但做事可能不够果断", category: "健康" },
  { palaceName: "疾厄宫", featureName: "眼间距比例", conditionOperator: "between", conditionValue: "0.75-0.85", score: 8, interpretation: "两眼间距适中，山根端正，疾厄宫良好，身体健康，抵抗力强", category: "健康" },
  { palaceName: "疾厄宫", featureName: "眼间距比例", conditionOperator: "between", conditionValue: "0.65-0.75", score: 6, interpretation: "两眼间距中等，健康运正常", category: "健康" },
  { palaceName: "疾厄宫", featureName: "眼间距比例", conditionOperator: "<", conditionValue: "0.65", score: 2, interpretation: "两眼间距较窄，古相学认为山根窄则疾厄宫弱，需注意呼吸系统健康", category: "健康" },

  // ==================== 五官细分 - 鼻相 ====================
  // 鼻梁高度比例
  { palaceName: "财帛宫", featureName: "鼻梁高度比例", conditionOperator: ">=", conditionValue: "0.90", score: 10, interpretation: "鼻梁高挺如玉柱，古称'鼻如悬胆'，主人财运极旺，一生富贵，事业有成", category: "财运" },
  { palaceName: "财帛宫", featureName: "鼻梁高度比例", conditionOperator: "between", conditionValue: "0.85-0.90", score: 9, interpretation: "鼻梁高挺端正，财帛宫饱满，主人理财能力强，善于积累财富", category: "财运" },
  { palaceName: "财帛宫", featureName: "鼻梁高度比例", conditionOperator: "between", conditionValue: "0.80-0.85", score: 8, interpretation: "鼻梁较高，财运良好，中年后财运更旺", category: "财运" },
  { palaceName: "财帛宫", featureName: "鼻梁高度比例", conditionOperator: "between", conditionValue: "0.75-0.80", score: 7, interpretation: "鼻梁高度适中偏高，有一定的理财能力", category: "财运" },
  { palaceName: "财帛宫", featureName: "鼻梁高度比例", conditionOperator: "between", conditionValue: "0.70-0.75", score: 5, interpretation: "鼻梁高度适中，财运平稳", category: "财运" },
  { palaceName: "财帛宫", featureName: "鼻梁高度比例", conditionOperator: "between", conditionValue: "0.65-0.70", score: 3, interpretation: "鼻梁偏低，财运一般，需通过努力积累财富", category: "财运" },
  { palaceName: "财帛宫", featureName: "鼻梁高度比例", conditionOperator: "<", conditionValue: "0.65", score: 0, interpretation: "鼻梁较低，古相学认为财帛宫弱，建议培养理财意识，量入为出", category: "财运" },

  // 鼻翼宽度比例
  { palaceName: "财帛宫", featureName: "鼻翼宽度比例", conditionOperator: ">=", conditionValue: "0.85", score: 9, interpretation: "鼻翼丰满宽厚，古称'准头有肉'，主人聚财能力极强，晚年富足", category: "财运" },
  { palaceName: "财帛宫", featureName: "鼻翼宽度比例", conditionOperator: "between", conditionValue: "0.80-0.85", score: 8, interpretation: "鼻翼较为丰满，主人善于理财，能守住财富", category: "财运" },
  { palaceName: "财帛宫", featureName: "鼻翼宽度比例", conditionOperator: "between", conditionValue: "0.75-0.80", score: 7, interpretation: "鼻翼宽度适中偏大，聚财能力不错", category: "财运" },
  { palaceName: "财帛宫", featureName: "鼻翼宽度比例", conditionOperator: "between", conditionValue: "0.70-0.75", score: 5, interpretation: "鼻翼宽度适中，财运正常", category: "财运" },
  { palaceName: "财帛宫", featureName: "鼻翼宽度比例", conditionOperator: "between", conditionValue: "0.65-0.70", score: 3, interpretation: "鼻翼偏窄，花钱可能较大方，建议注意节约", category: "财运" },
  { palaceName: "财帛宫", featureName: "鼻翼宽度比例", conditionOperator: "<", conditionValue: "0.65", score: 0, interpretation: "鼻翼较窄，古相学认为'准头尖削则财来财去'，建议培养储蓄习惯", category: "财运" },

  // ==================== 五官细分 - 嘴相 ====================
  // 嘴巴宽度比例
  { palaceName: "福德宫", featureName: "嘴巴宽度比例", conditionOperator: ">=", conditionValue: "0.85", score: 9, interpretation: "嘴巴宽大端正，古称'口大食四方'，主人口福极佳，一生衣食无忧，晚年享福", category: "福德" },
  { palaceName: "福德宫", featureName: "嘴巴宽度比例", conditionOperator: "between", conditionValue: "0.80-0.85", score: 8, interpretation: "嘴巴较大，口才好，善于表达，人际关系融洽", category: "福德" },
  { palaceName: "福德宫", featureName: "嘴巴宽度比例", conditionOperator: "between", conditionValue: "0.75-0.80", score: 7, interpretation: "嘴巴大小适中偏大，口福不错，生活品质良好", category: "福德" },
  { palaceName: "福德宫", featureName: "嘴巴宽度比例", conditionOperator: "between", conditionValue: "0.70-0.75", score: 5, interpretation: "嘴巴大小适中，福德宫正常", category: "福德" },
  { palaceName: "福德宫", featureName: "嘴巴宽度比例", conditionOperator: "between", conditionValue: "0.65-0.70", score: 3, interpretation: "嘴巴偏小，性格较为含蓄，不太善于社交", category: "福德" },
  { palaceName: "福德宫", featureName: "嘴巴宽度比例", conditionOperator: "<", conditionValue: "0.65", score: 1, interpretation: "嘴巴较小，古相学认为'口小则福薄'，建议多行善积德", category: "福德" },

  // 上唇厚度比例
  { palaceName: "福德宫", featureName: "上唇厚度比例", conditionOperator: ">=", conditionValue: "0.80", score: 8, interpretation: "上唇丰厚，古称'唇厚则情深'，主人感情丰富，待人真诚，福德深厚", category: "感情" },
  { palaceName: "福德宫", featureName: "上唇厚度比例", conditionOperator: "between", conditionValue: "0.70-0.80", score: 6, interpretation: "上唇厚度适中，感情表达正常", category: "感情" },
  { palaceName: "福德宫", featureName: "上唇厚度比例", conditionOperator: "<", conditionValue: "0.70", score: 3, interpretation: "上唇偏薄，性格较为理性，感情上不太外露", category: "感情" },

  // 下唇厚度比例
  { palaceName: "福德宫", featureName: "下唇厚度比例", conditionOperator: ">=", conditionValue: "0.80", score: 8, interpretation: "下唇丰满，古称'地阁丰隆'，主人物质运极佳，一生衣食丰足", category: "财运" },
  { palaceName: "福德宫", featureName: "下唇厚度比例", conditionOperator: "between", conditionValue: "0.70-0.80", score: 6, interpretation: "下唇厚度适中，物质运正常", category: "财运" },
  { palaceName: "福德宫", featureName: "下唇厚度比例", conditionOperator: "<", conditionValue: "0.70", score: 3, interpretation: "下唇偏薄，物质欲望不强，生活较为简朴", category: "财运" },

  // ==================== 五官细分 - 耳相 ====================
  // 左耳长度比例
  { palaceName: "福德宫", featureName: "左耳长度比例", conditionOperator: ">=", conditionValue: "0.85", score: 10, interpretation: "耳朵长大，古称'耳大如轮'，主人福德深厚，长寿之相，一生平安顺遂", category: "福德" },
  { palaceName: "福德宫", featureName: "左耳长度比例", conditionOperator: "between", conditionValue: "0.80-0.85", score: 8, interpretation: "耳朵较大，福德宫饱满，主人有福气，晚年安乐", category: "福德" },
  { palaceName: "福德宫", featureName: "左耳长度比例", conditionOperator: "between", conditionValue: "0.75-0.80", score: 7, interpretation: "耳朵大小适中偏大，福德不错", category: "福德" },
  { palaceName: "福德宫", featureName: "左耳长度比例", conditionOperator: "between", conditionValue: "0.70-0.75", score: 5, interpretation: "耳朵大小适中，福德宫正常", category: "福德" },
  { palaceName: "福德宫", featureName: "左耳长度比例", conditionOperator: "<", conditionValue: "0.70", score: 2, interpretation: "耳朵偏小，古相学认为福德稍弱，建议多行善积福", category: "福德" },

  // ==================== 面型体系 ====================
  // 面部宽高比
  { palaceName: "命宫", featureName: "面部宽高比", conditionOperator: "between", conditionValue: "0.78-0.85", score: 9, interpretation: "面部比例黄金分割，古称'天庭饱满，地阁方圆'，主人命格极佳，一生运势亨通", category: "综合" },
  { palaceName: "命宫", featureName: "面部宽高比", conditionOperator: "between", conditionValue: "0.85-0.90", score: 7, interpretation: "面部较宽，古称'国字脸'，主人性格稳重，做事有魄力，适合从事管理工作", category: "事业" },
  { palaceName: "命宫", featureName: "面部宽高比", conditionOperator: "between", conditionValue: "0.73-0.78", score: 7, interpretation: "面部较长，古称'甲字脸'，主人聪明睿智，思维敏捷，适合从事学术或技术工作", category: "事业" },
  { palaceName: "命宫", featureName: "面部宽高比", conditionOperator: ">=", conditionValue: "0.90", score: 5, interpretation: "面部很宽，古称'圆脸'，主人性格随和，人缘好，适合从事服务或社交类工作", category: "人际" },
  { palaceName: "命宫", featureName: "面部宽高比", conditionOperator: "<", conditionValue: "0.73", score: 5, interpretation: "面部较窄长，古称'瓜子脸'，主人性格细腻，审美能力强，适合从事艺术类工作", category: "事业" },

  // 面部对称度
  { palaceName: "命宫", featureName: "面部对称度", conditionOperator: ">=", conditionValue: "0.92", score: 10, interpretation: "面部极为对称，古称'五岳朝归'，主人命格极正，一生运势极佳，贵人运旺", category: "综合" },
  { palaceName: "命宫", featureName: "面部对称度", conditionOperator: "between", conditionValue: "0.88-0.92", score: 8, interpretation: "面部对称度很高，五官端正，主人运势良好，做事顺利", category: "综合" },
  { palaceName: "命宫", featureName: "面部对称度", conditionOperator: "between", conditionValue: "0.85-0.88", score: 7, interpretation: "面部较为对称，五官协调，运势不错", category: "综合" },
  { palaceName: "命宫", featureName: "面部对称度", conditionOperator: "between", conditionValue: "0.80-0.85", score: 5, interpretation: "面部对称度中上，整体还不错", category: "综合" },
  { palaceName: "命宫", featureName: "面部对称度", conditionOperator: "between", conditionValue: "0.75-0.80", score: 3, interpretation: "面部对称度中等，运势有起伏", category: "综合" },
  { palaceName: "命宫", featureName: "面部对称度", conditionOperator: "<", conditionValue: "0.75", score: 0, interpretation: "面部对称度偏低，古相学认为运势可能有较大波动，建议修身养性", category: "综合" },

  // ==================== 气色判断 ====================
  // 印堂颜色亮度
  { palaceName: "命宫", featureName: "印堂颜色亮度", conditionOperator: ">=", conditionValue: "0.85", score: 10, interpretation: "印堂明亮如镜，古称'印堂发亮'，主人近期运势极佳，有大喜事临门", category: "综合" },
  { palaceName: "命宫", featureName: "印堂颜色亮度", conditionOperator: "between", conditionValue: "0.80-0.85", score: 8, interpretation: "印堂明亮，气色红润，近期运势良好，事业和感情都有好消息", category: "综合" },
  { palaceName: "命宫", featureName: "印堂颜色亮度", conditionOperator: "between", conditionValue: "0.75-0.80", score: 7, interpretation: "印堂光泽不错，气色良好，运势平稳向上", category: "综合" },
  { palaceName: "命宫", featureName: "印堂颜色亮度", conditionOperator: "between", conditionValue: "0.70-0.75", score: 5, interpretation: "印堂亮度中等，运势正常", category: "综合" },
  { palaceName: "命宫", featureName: "印堂颜色亮度", conditionOperator: "between", conditionValue: "0.65-0.70", score: 3, interpretation: "印堂略显暗淡，近期可能有些烦心事，建议放松心情", category: "综合" },
  { palaceName: "命宫", featureName: "印堂颜色亮度", conditionOperator: "<", conditionValue: "0.65", score: -2, interpretation: "印堂暗淡无光，古相学认为'印堂发暗则运势低迷'，建议多行善事，调整心态", category: "综合" },

  // 肤色均匀度
  { palaceName: "疾厄宫", featureName: "肤色均匀度", conditionOperator: ">=", conditionValue: "0.85", score: 9, interpretation: "面部肤色极为均匀，气血充盈，古称'面如冠玉'，主人身体极为健康", category: "健康" },
  { palaceName: "疾厄宫", featureName: "肤色均匀度", conditionOperator: "between", conditionValue: "0.80-0.85", score: 7, interpretation: "面部肤色较为均匀，气血流通顺畅，身体健康", category: "健康" },
  { palaceName: "疾厄宫", featureName: "肤色均匀度", conditionOperator: "between", conditionValue: "0.75-0.80", score: 5, interpretation: "面部肤色均匀度中上，健康状况不错", category: "健康" },
  { palaceName: "疾厄宫", featureName: "肤色均匀度", conditionOperator: "between", conditionValue: "0.70-0.75", score: 3, interpretation: "面部肤色有些不均匀，可能气血略有不畅，建议注意休息", category: "健康" },
  { palaceName: "疾厄宫", featureName: "肤色均匀度", conditionOperator: "<", conditionValue: "0.70", score: 0, interpretation: "面部肤色不均匀，古相学认为气血不畅，建议调理身体，注意饮食和作息", category: "健康" },

  // ==================== 额头细分 ====================
  // 额头高度比例
  { palaceName: "官禄宫", featureName: "额头高度比例", conditionOperator: ">=", conditionValue: "0.90", score: 10, interpretation: "额头极高且饱满，古称'天庭高耸'，主人智慧超群，仕途通达，适合从政或从事管理", category: "事业" },
  { palaceName: "官禄宫", featureName: "额头高度比例", conditionOperator: "between", conditionValue: "0.85-0.90", score: 9, interpretation: "额头高而饱满，主人聪明过人，事业心强，能在职场上出人头地", category: "事业" },
  { palaceName: "官禄宫", featureName: "额头高度比例", conditionOperator: "between", conditionValue: "0.80-0.85", score: 8, interpretation: "额头较高，思维活跃，学习能力强", category: "事业" },
  { palaceName: "官禄宫", featureName: "额头高度比例", conditionOperator: "between", conditionValue: "0.75-0.80", score: 6, interpretation: "额头高度适中偏高，智力不错", category: "事业" },
  { palaceName: "官禄宫", featureName: "额头高度比例", conditionOperator: "between", conditionValue: "0.70-0.75", score: 4, interpretation: "额头高度适中，事业运正常", category: "事业" },
  { palaceName: "官禄宫", featureName: "额头高度比例", conditionOperator: "<", conditionValue: "0.70", score: 1, interpretation: "额头偏低，古相学认为官禄宫弱，事业上需更加努力", category: "事业" },

  // 额头宽度比例
  { palaceName: "官禄宫", featureName: "额头宽度比例", conditionOperator: ">=", conditionValue: "0.85", score: 8, interpretation: "额头宽广，古称'天庭开阔'，主人胸怀宽广，有领导才能", category: "事业" },
  { palaceName: "官禄宫", featureName: "额头宽度比例", conditionOperator: "between", conditionValue: "0.80-0.85", score: 7, interpretation: "额头较宽，思维开阔，做事有大局观", category: "事业" },
  { palaceName: "官禄宫", featureName: "额头宽度比例", conditionOperator: "between", conditionValue: "0.75-0.80", score: 5, interpretation: "额头宽度适中，事业运正常", category: "事业" },
  { palaceName: "官禄宫", featureName: "额头宽度比例", conditionOperator: "<", conditionValue: "0.75", score: 2, interpretation: "额头偏窄，做事可能过于专注细节，建议培养大局观", category: "事业" },

  // ==================== 下巴细分 ====================
  // 下巴长度比例
  { palaceName: "奴仆宫", featureName: "下巴长度比例", conditionOperator: ">=", conditionValue: "0.85", score: 9, interpretation: "下巴长而饱满，古称'地阁方圆'，主人晚年运极佳，子孙孝顺，下属得力", category: "福德" },
  { palaceName: "奴仆宫", featureName: "下巴长度比例", conditionOperator: "between", conditionValue: "0.80-0.85", score: 8, interpretation: "下巴较长，晚年运良好，能享天伦之乐", category: "福德" },
  { palaceName: "奴仆宫", featureName: "下巴长度比例", conditionOperator: "between", conditionValue: "0.75-0.80", score: 6, interpretation: "下巴长度适中偏长，晚年运不错", category: "福德" },
  { palaceName: "奴仆宫", featureName: "下巴长度比例", conditionOperator: "between", conditionValue: "0.70-0.75", score: 4, interpretation: "下巴长度适中，晚年运正常", category: "福德" },
  { palaceName: "奴仆宫", featureName: "下巴长度比例", conditionOperator: "<", conditionValue: "0.70", score: 1, interpretation: "下巴偏短，古相学认为晚年运稍弱，建议早做养老规划", category: "福德" },

  // 下巴宽度比例
  { palaceName: "奴仆宫", featureName: "下巴宽度比例", conditionOperator: ">=", conditionValue: "0.85", score: 8, interpretation: "下巴宽厚，古称'地阁丰隆'，主人意志坚定，做事有毅力，下属忠心", category: "事业" },
  { palaceName: "奴仆宫", featureName: "下巴宽度比例", conditionOperator: "between", conditionValue: "0.80-0.85", score: 7, interpretation: "下巴较宽，性格坚毅，做事有始有终", category: "事业" },
  { palaceName: "奴仆宫", featureName: "下巴宽度比例", conditionOperator: "between", conditionValue: "0.75-0.80", score: 5, interpretation: "下巴宽度适中，性格平衡", category: "事业" },
  { palaceName: "奴仆宫", featureName: "下巴宽度比例", conditionOperator: "<", conditionValue: "0.75", score: 2, interpretation: "下巴偏窄，性格可能偏柔和，建议培养坚毅品质", category: "事业" },

  // ==================== 颧骨 ====================
  // 左颧骨高度
  { palaceName: "迁移宫", featureName: "左颧骨高度", conditionOperator: ">=", conditionValue: "0.85", score: 8, interpretation: "颧骨高耸有力，古称'颧骨高则权力大'，主人有领导才能，适合在外发展", category: "事业" },
  { palaceName: "迁移宫", featureName: "左颧骨高度", conditionOperator: "between", conditionValue: "0.80-0.85", score: 7, interpretation: "颧骨较高，主人有进取心，适合外出发展事业", category: "事业" },
  { palaceName: "迁移宫", featureName: "左颧骨高度", conditionOperator: "between", conditionValue: "0.75-0.80", score: 5, interpretation: "颧骨高度适中，迁移宫正常", category: "事业" },
  { palaceName: "迁移宫", featureName: "左颧骨高度", conditionOperator: "<", conditionValue: "0.75", score: 2, interpretation: "颧骨偏低，古相学认为迁移宫弱，适合在本地发展", category: "事业" },

  // ==================== 三停比例 ====================
  // 上停比例（额头到眉毛）
  { palaceName: "官禄宫", featureName: "上停比例", conditionOperator: "between", conditionValue: "0.32-0.36", score: 9, interpretation: "上停比例标准，古称'天庭饱满'，主人少年运极佳，学业出众，早年得志", category: "事业" },
  { palaceName: "官禄宫", featureName: "上停比例", conditionOperator: "between", conditionValue: "0.36-0.40", score: 7, interpretation: "上停偏长，额头饱满，主人智慧过人，但可能少年辛苦", category: "事业" },
  { palaceName: "官禄宫", featureName: "上停比例", conditionOperator: "between", conditionValue: "0.28-0.32", score: 5, interpretation: "上停偏短，少年运一般，但中晚年运势好", category: "事业" },
  { palaceName: "官禄宫", featureName: "上停比例", conditionOperator: "<", conditionValue: "0.28", score: 2, interpretation: "上停较短，古相学认为少年运弱，但大器晚成", category: "事业" },
  { palaceName: "官禄宫", featureName: "上停比例", conditionOperator: ">", conditionValue: "0.40", score: 4, interpretation: "上停过长，少年聪慧但可能过于理想化", category: "事业" },

  // 中停比例（眉毛到鼻尖）
  { palaceName: "财帛宫", featureName: "中停比例", conditionOperator: "between", conditionValue: "0.32-0.36", score: 9, interpretation: "中停比例标准，古称'中岳端正'，主人中年运极佳，事业有成，财运亨通", category: "财运" },
  { palaceName: "财帛宫", featureName: "中停比例", conditionOperator: "between", conditionValue: "0.36-0.40", score: 7, interpretation: "中停偏长，鼻梁高挺，主人中年事业发展好", category: "财运" },
  { palaceName: "财帛宫", featureName: "中停比例", conditionOperator: "between", conditionValue: "0.28-0.32", score: 5, interpretation: "中停偏短，中年运一般，需更加努力", category: "财运" },
  { palaceName: "财帛宫", featureName: "中停比例", conditionOperator: "<", conditionValue: "0.28", score: 2, interpretation: "中停较短，古相学认为中年运弱，建议早做规划", category: "财运" },

  // 下停比例（鼻尖到下巴）
  { palaceName: "奴仆宫", featureName: "下停比例", conditionOperator: "between", conditionValue: "0.32-0.36", score: 9, interpretation: "下停比例标准，古称'地阁方圆'，主人晚年运极佳，子孙满堂，安享晚年", category: "福德" },
  { palaceName: "奴仆宫", featureName: "下停比例", conditionOperator: "between", conditionValue: "0.36-0.40", score: 7, interpretation: "下停偏长，下巴饱满，主人晚年福气深厚", category: "福德" },
  { palaceName: "奴仆宫", featureName: "下停比例", conditionOperator: "between", conditionValue: "0.28-0.32", score: 5, interpretation: "下停偏短，晚年运一般，建议注意养老规划", category: "福德" },
  { palaceName: "奴仆宫", featureName: "下停比例", conditionOperator: "<", conditionValue: "0.28", score: 2, interpretation: "下停较短，古相学认为晚年运弱，建议多积福德", category: "福德" },
];
