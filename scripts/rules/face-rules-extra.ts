/**
 * 面相补充规则 - 流年运势、组合判断、特殊面相格局
 */

export interface FaceExtraRuleData {
  palaceName: string;
  featureName: string;
  conditionOperator: string;
  conditionValue: string;
  score: number;
  interpretation: string;
  category: string;
}

export const faceExtraRulesData: FaceExtraRuleData[] = [
  // ==================== 流年运势规则 ====================
  // 少年运（1-25岁）看额头
  { palaceName: "流年运", featureName: "额头饱满度", conditionOperator: ">=", conditionValue: "0.80", score: 9, interpretation: "额头饱满圆润，少年运极佳（1-25岁），古称'天庭饱满'，主早年聪慧、学业有成、家境优越", category: "流年" },
  { palaceName: "流年运", featureName: "额头饱满度", conditionOperator: "between", conditionValue: "0.65-0.80", score: 7, interpretation: "额头较为饱满，少年运良好，学业和早年发展顺利", category: "流年" },
  { palaceName: "流年运", featureName: "额头饱满度", conditionOperator: "between", conditionValue: "0.50-0.65", score: 5, interpretation: "额头一般，少年运平稳，需靠自身努力", category: "流年" },
  { palaceName: "流年运", featureName: "额头饱满度", conditionOperator: "<", conditionValue: "0.50", score: 2, interpretation: "额头偏窄或凹陷，少年运较为坎坷，但古语云'少年磨砺多成器'，后运可期", category: "流年" },

  // 中年运（26-50岁）看眉眼鼻
  { palaceName: "流年运", featureName: "鼻梁高度比例", conditionOperator: ">=", conditionValue: "0.55", score: 9, interpretation: "鼻梁挺拔有力，中年运极佳（26-50岁），古称'山根高耸'，主事业有成、财运亨通、社会地位高", category: "流年" },
  { palaceName: "流年运", featureName: "鼻梁高度比例", conditionOperator: "between", conditionValue: "0.45-0.55", score: 7, interpretation: "鼻梁端正，中年运良好，事业和财运稳步上升", category: "流年" },
  { palaceName: "流年运", featureName: "鼻梁高度比例", conditionOperator: "between", conditionValue: "0.35-0.45", score: 5, interpretation: "鼻梁一般，中年运平稳", category: "流年" },
  { palaceName: "流年运", featureName: "鼻梁高度比例", conditionOperator: "<", conditionValue: "0.35", score: 3, interpretation: "鼻梁偏低，中年运需多加努力，但古语云'大器晚成'，晚年运势可期", category: "流年" },

  // 晚年运（51岁以后）看下巴
  { palaceName: "流年运", featureName: "下巴丰满度", conditionOperator: ">=", conditionValue: "0.75", score: 9, interpretation: "下巴丰满圆润，晚年运极佳（51岁以后），古称'地阁方圆'，主晚年安泰、子孙孝顺、福寿绵长", category: "流年" },
  { palaceName: "流年运", featureName: "下巴丰满度", conditionOperator: "between", conditionValue: "0.60-0.75", score: 7, interpretation: "下巴较为丰满，晚年运良好，生活安定", category: "流年" },
  { palaceName: "流年运", featureName: "下巴丰满度", conditionOperator: "between", conditionValue: "0.45-0.60", score: 5, interpretation: "下巴一般，晚年运平稳", category: "流年" },
  { palaceName: "流年运", featureName: "下巴丰满度", conditionOperator: "<", conditionValue: "0.45", score: 2, interpretation: "下巴偏尖或后缩，晚年运需注意健康和积蓄，建议早做规划", category: "流年" },

  // ==================== 五官组合判断 ====================
  // 三停均匀（额头:中庭:下巴 = 1:1:1）
  { palaceName: "三停", featureName: "三停均匀度", conditionOperator: ">=", conditionValue: "0.85", score: 10, interpretation: "三停极为均匀，上停（额头）、中停（眉眼鼻）、下停（嘴巴下巴）比例完美，古称'三停匀配'，主一生运势平稳，少年、中年、晚年皆顺", category: "格局" },
  { palaceName: "三停", featureName: "三停均匀度", conditionOperator: "between", conditionValue: "0.75-0.85", score: 8, interpretation: "三停较为均匀，一生运势较为平稳", category: "格局" },
  { palaceName: "三停", featureName: "三停均匀度", conditionOperator: "between", conditionValue: "0.65-0.75", score: 5, interpretation: "三停有一定偏差，某个阶段的运势可能较强或较弱", category: "格局" },
  { palaceName: "三停", featureName: "三停均匀度", conditionOperator: "<", conditionValue: "0.65", score: 2, interpretation: "三停不太均匀，人生运势起伏较大，但古语云'大起大落方显英雄本色'", category: "格局" },

  // 五岳朝归（额头、鼻子、下巴、左颧、右颧）
  { palaceName: "五岳", featureName: "五岳朝归度", conditionOperator: ">=", conditionValue: "0.80", score: 10, interpretation: "五岳朝归格局极佳，额为南岳、鼻为中岳、下巴为北岳、左颧为东岳、右颧为西岳，五岳端正丰隆，古称'五岳朝归则富贵双全'", category: "格局" },
  { palaceName: "五岳", featureName: "五岳朝归度", conditionOperator: "between", conditionValue: "0.65-0.80", score: 7, interpretation: "五岳较为端正，格局良好", category: "格局" },
  { palaceName: "五岳", featureName: "五岳朝归度", conditionOperator: "<", conditionValue: "0.65", score: 3, interpretation: "五岳不太均匀，某些部位可能偏弱", category: "格局" },

  // 四渎清秀（眼、耳、口、鼻）
  { palaceName: "四渎", featureName: "四渎清秀度", conditionOperator: ">=", conditionValue: "0.80", score: 9, interpretation: "四渎清秀，眼如江、耳如海、口如河、鼻如济，古称'四渎清则聪明智慧'，主才华横溢、智慧过人", category: "格局" },
  { palaceName: "四渎", featureName: "四渎清秀度", conditionOperator: "between", conditionValue: "0.65-0.80", score: 6, interpretation: "四渎较为清秀，智慧良好", category: "格局" },
  { palaceName: "四渎", featureName: "四渎清秀度", conditionOperator: "<", conditionValue: "0.65", score: 3, interpretation: "四渎不太清秀，建议多读书修身养性", category: "格局" },

  // ==================== 特殊面相格局 ====================
  // 贵人相
  { palaceName: "特殊格局", featureName: "贵人相指数", conditionOperator: ">=", conditionValue: "0.85", score: 10, interpretation: "具有典型的贵人面相，天庭饱满、地阁方圆、五官端正、气色红润，古称'贵不可言'之相，一生多贵人相助", category: "格局" },
  { palaceName: "特殊格局", featureName: "贵人相指数", conditionOperator: "between", conditionValue: "0.70-0.85", score: 7, interpretation: "有一定的贵人面相特征，人缘较好，时有贵人相助", category: "格局" },
  { palaceName: "特殊格局", featureName: "贵人相指数", conditionOperator: "<", conditionValue: "0.70", score: 4, interpretation: "贵人相特征不太明显，需主动结交贵人", category: "格局" },

  // 财富相
  { palaceName: "特殊格局", featureName: "财富相指数", conditionOperator: ">=", conditionValue: "0.85", score: 10, interpretation: "具有典型的财富面相，鼻头丰满有肉、颧骨有力、嘴唇厚实，古称'鼻如悬胆'之相，一生财运亨通", category: "格局" },
  { palaceName: "特殊格局", featureName: "财富相指数", conditionOperator: "between", conditionValue: "0.70-0.85", score: 7, interpretation: "有一定的财富面相特征，财运较好", category: "格局" },
  { palaceName: "特殊格局", featureName: "财富相指数", conditionOperator: "<", conditionValue: "0.70", score: 4, interpretation: "财富面相特征不太明显，需靠勤劳致富", category: "格局" },

  // 桃花相
  { palaceName: "特殊格局", featureName: "桃花相指数", conditionOperator: ">=", conditionValue: "0.85", score: 8, interpretation: "具有典型的桃花面相，眼神含情、嘴角微翘、面部轮廓柔和，古称'桃花满面'，异性缘极佳", category: "格局" },
  { palaceName: "特殊格局", featureName: "桃花相指数", conditionOperator: "between", conditionValue: "0.70-0.85", score: 6, interpretation: "有一定的桃花面相特征，异性缘较好", category: "格局" },
  { palaceName: "特殊格局", featureName: "桃花相指数", conditionOperator: "<", conditionValue: "0.70", score: 4, interpretation: "桃花面相特征不太明显，感情方面需主动", category: "格局" },

  // 福德相
  { palaceName: "特殊格局", featureName: "福德相指数", conditionOperator: ">=", conditionValue: "0.85", score: 10, interpretation: "具有典型的福德面相，耳垂厚大、额头宽广、面相慈善，古称'福相天成'，一生福泽深厚", category: "格局" },
  { palaceName: "特殊格局", featureName: "福德相指数", conditionOperator: "between", conditionValue: "0.70-0.85", score: 7, interpretation: "有一定的福德面相特征，福报较好", category: "格局" },
  { palaceName: "特殊格局", featureName: "福德相指数", conditionOperator: "<", conditionValue: "0.70", score: 4, interpretation: "福德面相特征不太明显，建议多行善积德", category: "格局" },

  // ==================== 气色判断 ====================
  // 面部气色
  { palaceName: "气色", featureName: "面部红润度", conditionOperator: ">=", conditionValue: "0.80", score: 9, interpretation: "面部气色红润有光泽，古称'面如春花'，主近期运势极佳，身体健康，精力充沛", category: "气色" },
  { palaceName: "气色", featureName: "面部红润度", conditionOperator: "between", conditionValue: "0.65-0.80", score: 7, interpretation: "面部气色良好，运势正常", category: "气色" },
  { palaceName: "气色", featureName: "面部红润度", conditionOperator: "between", conditionValue: "0.50-0.65", score: 4, interpretation: "面部气色一般，建议注意休息和饮食", category: "气色" },
  { palaceName: "气色", featureName: "面部红润度", conditionOperator: "<", conditionValue: "0.50", score: 1, interpretation: "面部气色偏暗，古称'面带晦气'，近期运势可能不太顺利，建议多休息、调整心态", category: "气色" },

  // 印堂气色
  { palaceName: "气色", featureName: "印堂明亮度", conditionOperator: ">=", conditionValue: "0.80", score: 9, interpretation: "印堂明亮如镜，古称'印堂发亮则好运将至'，近期有大好机遇", category: "气色" },
  { palaceName: "气色", featureName: "印堂明亮度", conditionOperator: "between", conditionValue: "0.65-0.80", score: 7, interpretation: "印堂气色良好，运势正常", category: "气色" },
  { palaceName: "气色", featureName: "印堂明亮度", conditionOperator: "between", conditionValue: "0.50-0.65", score: 4, interpretation: "印堂气色一般，近期需谨慎行事", category: "气色" },
  { palaceName: "气色", featureName: "印堂明亮度", conditionOperator: "<", conditionValue: "0.50", score: 1, interpretation: "印堂暗淡，古称'印堂发暗则运势低迷'，近期宜静不宜动，多修身养性", category: "气色" },

  // 眼神气色
  { palaceName: "气色", featureName: "眼神明亮度", conditionOperator: ">=", conditionValue: "0.80", score: 9, interpretation: "眼神明亮有神，古称'目光如炬'，主智慧通达、精力充沛、判断力强", category: "气色" },
  { palaceName: "气色", featureName: "眼神明亮度", conditionOperator: "between", conditionValue: "0.65-0.80", score: 7, interpretation: "眼神较为明亮，精神状态良好", category: "气色" },
  { palaceName: "气色", featureName: "眼神明亮度", conditionOperator: "<", conditionValue: "0.65", score: 3, interpretation: "眼神略显疲倦，建议注意休息", category: "气色" },

  // ==================== 面部对称性 ====================
  { palaceName: "对称性", featureName: "面部对称度", conditionOperator: ">=", conditionValue: "0.90", score: 10, interpretation: "面部极为对称，古称'左右均匀则贵'，主一生运势平稳，为人正直，人缘极佳", category: "格局" },
  { palaceName: "对称性", featureName: "面部对称度", conditionOperator: "between", conditionValue: "0.80-0.90", score: 8, interpretation: "面部较为对称，格局良好", category: "格局" },
  { palaceName: "对称性", featureName: "面部对称度", conditionOperator: "between", conditionValue: "0.70-0.80", score: 5, interpretation: "面部对称度一般，属正常范围", category: "格局" },
  { palaceName: "对称性", featureName: "面部对称度", conditionOperator: "<", conditionValue: "0.70", score: 2, interpretation: "面部对称度偏低，古相学认为左为阳右为阴，不对称可能反映阴阳失衡", category: "格局" },

  // ==================== 耳相 ====================
  { palaceName: "耳相", featureName: "耳垂厚度", conditionOperator: ">=", conditionValue: "0.75", score: 9, interpretation: "耳垂厚大丰满，古称'垂珠朝海'，主福禄双全、晚年安泰、子孙孝顺", category: "五官" },
  { palaceName: "耳相", featureName: "耳垂厚度", conditionOperator: "between", conditionValue: "0.55-0.75", score: 6, interpretation: "耳垂适中，福运正常", category: "五官" },
  { palaceName: "耳相", featureName: "耳垂厚度", conditionOperator: "<", conditionValue: "0.55", score: 3, interpretation: "耳垂偏薄，但古语云'耳薄者聪'，主思维敏捷", category: "五官" },

  { palaceName: "耳相", featureName: "耳朵位置高度", conditionOperator: ">=", conditionValue: "0.70", score: 8, interpretation: "耳朵位置较高（高于眉毛），古称'耳高于眉则聪明过人'，主智慧超群", category: "五官" },
  { palaceName: "耳相", featureName: "耳朵位置高度", conditionOperator: "between", conditionValue: "0.50-0.70", score: 6, interpretation: "耳朵位置适中，智慧正常", category: "五官" },
  { palaceName: "耳相", featureName: "耳朵位置高度", conditionOperator: "<", conditionValue: "0.50", score: 3, interpretation: "耳朵位置偏低，但古语云'耳低者稳重'，主为人踏实", category: "五官" },

  { palaceName: "耳相", featureName: "耳廓分明度", conditionOperator: ">=", conditionValue: "0.75", score: 8, interpretation: "耳廓分明，轮廓清晰，古称'轮廓分明则主贵'，主有主见、意志坚定", category: "五官" },
  { palaceName: "耳相", featureName: "耳廓分明度", conditionOperator: "between", conditionValue: "0.55-0.75", score: 5, interpretation: "耳廓较为分明，性格适中", category: "五官" },
  { palaceName: "耳相", featureName: "耳廓分明度", conditionOperator: "<", conditionValue: "0.55", score: 3, interpretation: "耳廓不太分明，性格可能偏柔和", category: "五官" },

  // ==================== 法令纹 ====================
  { palaceName: "法令纹", featureName: "法令纹深度", conditionOperator: ">=", conditionValue: "0.75", score: 7, interpretation: "法令纹深而有力，古称'法令纹深则权威重'，主中年后事业有成、有领导力", category: "纹路" },
  { palaceName: "法令纹", featureName: "法令纹深度", conditionOperator: "between", conditionValue: "0.50-0.75", score: 6, interpretation: "法令纹适中，事业运正常", category: "纹路" },
  { palaceName: "法令纹", featureName: "法令纹深度", conditionOperator: "<", conditionValue: "0.50", score: 5, interpretation: "法令纹较浅，面相显年轻，但权威感可能不足", category: "纹路" },

  { palaceName: "法令纹", featureName: "法令纹对称度", conditionOperator: ">=", conditionValue: "0.80", score: 8, interpretation: "法令纹左右对称，古称'法令均匀则一生平顺'，主事业和生活平衡发展", category: "纹路" },
  { palaceName: "法令纹", featureName: "法令纹对称度", conditionOperator: "between", conditionValue: "0.60-0.80", score: 5, interpretation: "法令纹基本对称", category: "纹路" },
  { palaceName: "法令纹", featureName: "法令纹对称度", conditionOperator: "<", conditionValue: "0.60", score: 2, interpretation: "法令纹不太对称，古相学认为左深右浅主事业波动，右深左浅主家庭变化", category: "纹路" },

  // ==================== 人中 ====================
  { palaceName: "人中", featureName: "人中深度", conditionOperator: ">=", conditionValue: "0.70", score: 8, interpretation: "人中深而宽，古称'人中深则寿长'，主健康长寿、子女运佳", category: "五官" },
  { palaceName: "人中", featureName: "人中深度", conditionOperator: "between", conditionValue: "0.50-0.70", score: 6, interpretation: "人中适中，健康运正常", category: "五官" },
  { palaceName: "人中", featureName: "人中深度", conditionOperator: "<", conditionValue: "0.50", score: 3, interpretation: "人中偏浅，建议注意健康保养", category: "五官" },

  { palaceName: "人中", featureName: "人中长度比例", conditionOperator: ">=", conditionValue: "0.70", score: 8, interpretation: "人中较长，古称'人中长则寿命长'，主长寿健康", category: "五官" },
  { palaceName: "人中", featureName: "人中长度比例", conditionOperator: "between", conditionValue: "0.50-0.70", score: 6, interpretation: "人中长度适中", category: "五官" },
  { palaceName: "人中", featureName: "人中长度比例", conditionOperator: "<", conditionValue: "0.50", score: 3, interpretation: "人中偏短，建议注意养生", category: "五官" },

  // ==================== 额头纹路 ====================
  { palaceName: "额纹", featureName: "天纹清晰度", conditionOperator: ">=", conditionValue: "0.75", score: 8, interpretation: "天纹（最上面的横纹）清晰有力，古称'天纹明则父运旺'，主与长辈关系好、有祖荫", category: "纹路" },
  { palaceName: "额纹", featureName: "天纹清晰度", conditionOperator: "between", conditionValue: "0.50-0.75", score: 5, interpretation: "天纹较为清晰", category: "纹路" },
  { palaceName: "额纹", featureName: "天纹清晰度", conditionOperator: "<", conditionValue: "0.50", score: 3, interpretation: "天纹不太明显，与长辈缘分一般", category: "纹路" },

  { palaceName: "额纹", featureName: "人纹清晰度", conditionOperator: ">=", conditionValue: "0.75", score: 8, interpretation: "人纹（中间的横纹）清晰有力，古称'人纹明则自身运旺'，主个人能力强、事业有成", category: "纹路" },
  { palaceName: "额纹", featureName: "人纹清晰度", conditionOperator: "between", conditionValue: "0.50-0.75", score: 5, interpretation: "人纹较为清晰", category: "纹路" },
  { palaceName: "额纹", featureName: "人纹清晰度", conditionOperator: "<", conditionValue: "0.50", score: 3, interpretation: "人纹不太明显", category: "纹路" },

  { palaceName: "额纹", featureName: "地纹清晰度", conditionOperator: ">=", conditionValue: "0.75", score: 8, interpretation: "地纹（最下面的横纹）清晰有力，古称'地纹明则子女运旺'，主子女孝顺、晚年幸福", category: "纹路" },
  { palaceName: "额纹", featureName: "地纹清晰度", conditionOperator: "between", conditionValue: "0.50-0.75", score: 5, interpretation: "地纹较为清晰", category: "纹路" },
  { palaceName: "额纹", featureName: "地纹清晰度", conditionOperator: "<", conditionValue: "0.50", score: 3, interpretation: "地纹不太明显，晚年运需多加注意", category: "纹路" },
];
