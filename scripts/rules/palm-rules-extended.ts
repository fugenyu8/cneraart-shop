/**
 * 手相扩展规则库 - 辅助线、手型五行、指节分析、特殊纹路、丘位组合
 * 补充 palm-rules.ts 中的基础规则
 */

export interface PalmExtendedRuleData {
  featureName: string;
  conditionOperator: string;
  conditionValue: string;
  score: number;
  interpretation: string;
  category: string;
}

export const palmExtendedRulesData: PalmExtendedRuleData[] = [
  // ==================== 辅助线 - 太阳线（成功线）====================
  { featureName: "太阳线清晰度", conditionOperator: ">=", conditionValue: "0.85", score: 10, interpretation: "太阳线深长清晰，古称'成功线明显'，主人才华横溢，名利双收，事业上能获得极大成功和社会认可", category: "事业" },
  { featureName: "太阳线清晰度", conditionOperator: "between", conditionValue: "0.80-0.85", score: 9, interpretation: "太阳线较为清晰，主人有一定的艺术天赋或表演才能，事业上能获得较好的声誉", category: "事业" },
  { featureName: "太阳线清晰度", conditionOperator: "between", conditionValue: "0.75-0.80", score: 7, interpretation: "太阳线可见且较清晰，主人有创造力，事业发展前景不错", category: "事业" },
  { featureName: "太阳线清晰度", conditionOperator: "between", conditionValue: "0.70-0.75", score: 5, interpretation: "太阳线隐约可见，主人有一定的才华，但需要更多努力才能获得认可", category: "事业" },
  { featureName: "太阳线清晰度", conditionOperator: "between", conditionValue: "0.65-0.70", score: 3, interpretation: "太阳线较淡，成功需要付出更多努力，但不代表没有机会", category: "事业" },
  { featureName: "太阳线清晰度", conditionOperator: "<", conditionValue: "0.65", score: 1, interpretation: "太阳线不明显，古相学认为成功之路需要更多坚持和努力", category: "事业" },

  // 太阳线长度
  { featureName: "太阳线长度", conditionOperator: ">=", conditionValue: "0.85", score: 9, interpretation: "太阳线从手腕延伸至无名指根部，极为罕见，主人一生名利双收", category: "事业" },
  { featureName: "太阳线长度", conditionOperator: "between", conditionValue: "0.75-0.85", score: 7, interpretation: "太阳线较长，主人中年后事业蒸蒸日上", category: "事业" },
  { featureName: "太阳线长度", conditionOperator: "between", conditionValue: "0.65-0.75", score: 5, interpretation: "太阳线中等长度，事业发展稳定", category: "事业" },
  { featureName: "太阳线长度", conditionOperator: "<", conditionValue: "0.65", score: 2, interpretation: "太阳线较短，成功可能来得较晚，但贵在坚持", category: "事业" },

  // ==================== 辅助线 - 健康线 ====================
  { featureName: "健康线清晰度", conditionOperator: ">=", conditionValue: "0.85", score: 2, interpretation: "健康线非常清晰，古相学认为健康线越不明显越好，清晰的健康线提示需要特别注意消化系统和神经系统", category: "健康" },
  { featureName: "健康线清晰度", conditionOperator: "between", conditionValue: "0.75-0.85", score: 4, interpretation: "健康线较为清晰，提示近期可能有些疲劳，建议注意休息和饮食", category: "健康" },
  { featureName: "健康线清晰度", conditionOperator: "between", conditionValue: "0.65-0.75", score: 6, interpretation: "健康线隐约可见，身体状况一般，建议定期体检", category: "健康" },
  { featureName: "健康线清晰度", conditionOperator: "<", conditionValue: "0.65", score: 9, interpretation: "健康线不明显或没有，古相学认为这是身体健康的好兆头", category: "健康" },

  // 健康线长度
  { featureName: "健康线长度", conditionOperator: ">=", conditionValue: "0.80", score: 3, interpretation: "健康线较长，提示需要长期关注身体健康，特别是肝胆和消化系统", category: "健康" },
  { featureName: "健康线长度", conditionOperator: "between", conditionValue: "0.65-0.80", score: 5, interpretation: "健康线中等长度，身体偶有小恙，注意调理即可", category: "健康" },
  { featureName: "健康线长度", conditionOperator: "<", conditionValue: "0.65", score: 8, interpretation: "健康线短或不明显，身体底子不错", category: "健康" },

  // ==================== 辅助线 - 直觉线 ====================
  { featureName: "直觉线清晰度", conditionOperator: ">=", conditionValue: "0.80", score: 9, interpretation: "直觉线清晰可见，极为罕见，主人第六感极强，直觉准确，适合从事心理咨询、艺术创作等需要感知力的工作", category: "智慧" },
  { featureName: "直觉线清晰度", conditionOperator: "between", conditionValue: "0.70-0.80", score: 7, interpretation: "直觉线较为清晰，主人感知力强，善于洞察人心", category: "智慧" },
  { featureName: "直觉线清晰度", conditionOperator: "between", conditionValue: "0.60-0.70", score: 5, interpretation: "直觉线隐约可见，主人有一定的直觉能力", category: "智慧" },
  { featureName: "直觉线清晰度", conditionOperator: "<", conditionValue: "0.60", score: 3, interpretation: "直觉线不明显，主人更偏向理性思维", category: "智慧" },

  // ==================== 辅助线 - 旅行线 ====================
  { featureName: "旅行线清晰度", conditionOperator: ">=", conditionValue: "0.80", score: 8, interpretation: "旅行线清晰明显，主人一生多有远行机会，适合从事贸易、外交或旅游相关行业，在外地发展运势更佳", category: "事业" },
  { featureName: "旅行线清晰度", conditionOperator: "between", conditionValue: "0.70-0.80", score: 6, interpretation: "旅行线较为清晰，主人有外出发展的机会", category: "事业" },
  { featureName: "旅行线清晰度", conditionOperator: "between", conditionValue: "0.60-0.70", score: 4, interpretation: "旅行线隐约可见，偶有出行机会", category: "事业" },
  { featureName: "旅行线清晰度", conditionOperator: "<", conditionValue: "0.60", score: 2, interpretation: "旅行线不明显，适合在本地发展", category: "事业" },

  // ==================== 辅助线 - 婚姻线 ====================
  { featureName: "婚姻线清晰度", conditionOperator: ">=", conditionValue: "0.85", score: 9, interpretation: "婚姻线深长清晰，古称'姻缘线明显'，主人感情专一，婚姻美满幸福，夫妻恩爱", category: "感情" },
  { featureName: "婚姻线清晰度", conditionOperator: "between", conditionValue: "0.80-0.85", score: 8, interpretation: "婚姻线较为清晰，主人重视感情，婚姻关系稳定", category: "感情" },
  { featureName: "婚姻线清晰度", conditionOperator: "between", conditionValue: "0.75-0.80", score: 7, interpretation: "婚姻线可见且清晰，感情运不错", category: "感情" },
  { featureName: "婚姻线清晰度", conditionOperator: "between", conditionValue: "0.70-0.75", score: 5, interpretation: "婚姻线中等清晰度，感情运正常", category: "感情" },
  { featureName: "婚姻线清晰度", conditionOperator: "between", conditionValue: "0.65-0.70", score: 3, interpretation: "婚姻线较淡，感情上可能经历一些波折", category: "感情" },
  { featureName: "婚姻线清晰度", conditionOperator: "<", conditionValue: "0.65", score: 1, interpretation: "婚姻线不太明显，古相学认为需要更加用心经营感情", category: "感情" },

  // 婚姻线长度
  { featureName: "婚姻线长度", conditionOperator: ">=", conditionValue: "0.85", score: 9, interpretation: "婚姻线长而清晰，主人感情深厚，婚姻持久美满", category: "感情" },
  { featureName: "婚姻线长度", conditionOperator: "between", conditionValue: "0.75-0.85", score: 7, interpretation: "婚姻线较长，感情稳定", category: "感情" },
  { featureName: "婚姻线长度", conditionOperator: "between", conditionValue: "0.65-0.75", score: 5, interpretation: "婚姻线中等长度，感情运正常", category: "感情" },
  { featureName: "婚姻线长度", conditionOperator: "<", conditionValue: "0.65", score: 2, interpretation: "婚姻线较短，感情上可能需要更多沟通和理解", category: "感情" },

  // 婚姻线数量
  { featureName: "婚姻线数量", conditionOperator: "==", conditionValue: "1", score: 9, interpretation: "只有一条婚姻线，古称'一线定终身'，主人感情专一，一生只爱一人", category: "感情" },
  { featureName: "婚姻线数量", conditionOperator: "==", conditionValue: "2", score: 7, interpretation: "有两条婚姻线，主人感情丰富，可能经历两段重要感情", category: "感情" },
  { featureName: "婚姻线数量", conditionOperator: "==", conditionValue: "3", score: 5, interpretation: "有三条婚姻线，感情经历较为丰富，建议用心经营每段感情", category: "感情" },
  { featureName: "婚姻线数量", conditionOperator: ">=", conditionValue: "4", score: 3, interpretation: "婚姻线较多，感情上可能有较多波折，建议专注于当下的感情", category: "感情" },

  // ==================== 辅助线 - 财运线 ====================
  { featureName: "财运线清晰度", conditionOperator: ">=", conditionValue: "0.85", score: 10, interpretation: "财运线深长清晰，古称'财库丰盈'，主人天生有理财天赋，一生财运亨通，善于投资理财", category: "财运" },
  { featureName: "财运线清晰度", conditionOperator: "between", conditionValue: "0.80-0.85", score: 8, interpretation: "财运线较为清晰，主人有不错的理财能力，财运良好", category: "财运" },
  { featureName: "财运线清晰度", conditionOperator: "between", conditionValue: "0.75-0.80", score: 7, interpretation: "财运线可见，主人有一定的财运", category: "财运" },
  { featureName: "财运线清晰度", conditionOperator: "between", conditionValue: "0.70-0.75", score: 5, interpretation: "财运线中等，财运正常", category: "财运" },
  { featureName: "财运线清晰度", conditionOperator: "<", conditionValue: "0.70", score: 2, interpretation: "财运线不太明显，财运需要通过努力来提升", category: "财运" },

  // ==================== 手型五行分析 ====================
  // 手掌面积比例（判断手型大小）
  { featureName: "手掌面积比例", conditionOperator: ">=", conditionValue: "0.85", score: 8, interpretation: "手掌宽大厚实，五行属土，古称'土形手'，主人性格稳重踏实，做事有耐心，适合从事农业、建筑、房地产等行业", category: "事业" },
  { featureName: "手掌面积比例", conditionOperator: "between", conditionValue: "0.80-0.85", score: 7, interpretation: "手掌较大，五行偏土金，主人性格坚毅，做事有魄力", category: "事业" },
  { featureName: "手掌面积比例", conditionOperator: "between", conditionValue: "0.75-0.80", score: 6, interpretation: "手掌大小适中，五行平衡，主人性格均衡", category: "综合" },
  { featureName: "手掌面积比例", conditionOperator: "between", conditionValue: "0.70-0.75", score: 5, interpretation: "手掌中等偏小，五行偏木水，主人性格灵活", category: "综合" },
  { featureName: "手掌面积比例", conditionOperator: "<", conditionValue: "0.70", score: 4, interpretation: "手掌较小，五行属水，古称'水形手'，主人聪明灵活，善于变通，适合从事商业或技术工作", category: "事业" },

  // 手指长度比例（相对手掌）
  { featureName: "手指长度比例", conditionOperator: ">=", conditionValue: "0.85", score: 8, interpretation: "手指修长，五行属木，古称'木形手'，主人思维敏捷，有艺术天赋，适合从事文学、音乐、绘画等创作类工作", category: "事业" },
  { featureName: "手指长度比例", conditionOperator: "between", conditionValue: "0.80-0.85", score: 7, interpretation: "手指较长，五行偏木火，主人有创造力和表现力", category: "事业" },
  { featureName: "手指长度比例", conditionOperator: "between", conditionValue: "0.75-0.80", score: 6, interpretation: "手指长度适中，五行平衡", category: "综合" },
  { featureName: "手指长度比例", conditionOperator: "between", conditionValue: "0.70-0.75", score: 5, interpretation: "手指中等偏短，五行偏金土，主人务实", category: "综合" },
  { featureName: "手指长度比例", conditionOperator: "<", conditionValue: "0.70", score: 4, interpretation: "手指较短，五行属金，古称'金形手'，主人做事果断，执行力强，适合从事管理或技术工作", category: "事业" },

  // 手掌颜色（红润度）
  { featureName: "手掌红润度", conditionOperator: ">=", conditionValue: "0.85", score: 9, interpretation: "手掌红润有光泽，古称'掌如红绸'，主人气血充盈，身体健康，财运极佳", category: "健康" },
  { featureName: "手掌红润度", conditionOperator: "between", conditionValue: "0.80-0.85", score: 8, interpretation: "手掌较为红润，气血流通顺畅，身体健康", category: "健康" },
  { featureName: "手掌红润度", conditionOperator: "between", conditionValue: "0.75-0.80", score: 6, interpretation: "手掌颜色正常，健康状况良好", category: "健康" },
  { featureName: "手掌红润度", conditionOperator: "between", conditionValue: "0.70-0.75", score: 4, interpretation: "手掌颜色偏淡，可能气血略有不足，建议注意调理", category: "健康" },
  { featureName: "手掌红润度", conditionOperator: "<", conditionValue: "0.70", score: 2, interpretation: "手掌颜色偏白或偏暗，古相学认为气血不足，建议加强锻炼和饮食调理", category: "健康" },

  // 手掌纹理密度
  { featureName: "手掌纹理密度", conditionOperator: ">=", conditionValue: "0.85", score: 7, interpretation: "手掌纹理非常密集，古称'纹密则心细'，主人思虑周密，心思细腻，但可能容易焦虑", category: "性格" },
  { featureName: "手掌纹理密度", conditionOperator: "between", conditionValue: "0.75-0.85", score: 8, interpretation: "手掌纹理较为丰富，主人感情细腻，善于观察", category: "性格" },
  { featureName: "手掌纹理密度", conditionOperator: "between", conditionValue: "0.65-0.75", score: 6, interpretation: "手掌纹理密度适中，性格平衡", category: "性格" },
  { featureName: "手掌纹理密度", conditionOperator: "<", conditionValue: "0.65", score: 5, interpretation: "手掌纹理较少，古称'纹少则心宽'，主人性格豁达，不拘小节", category: "性格" },

  // ==================== 特殊纹路 ====================
  // 十字纹（神秘十字）
  { featureName: "神秘十字纹清晰度", conditionOperator: ">=", conditionValue: "0.80", score: 9, interpretation: "掌中出现清晰的神秘十字纹，极为罕见，古称'天赐灵纹'，主人有极强的第六感和灵性，适合从事宗教、哲学、心理学等领域", category: "智慧" },
  { featureName: "神秘十字纹清晰度", conditionOperator: "between", conditionValue: "0.70-0.80", score: 7, interpretation: "神秘十字纹较为清晰，主人直觉力强，对神秘事物有天然的感知力", category: "智慧" },
  { featureName: "神秘十字纹清晰度", conditionOperator: "between", conditionValue: "0.60-0.70", score: 5, interpretation: "神秘十字纹隐约可见，主人有一定的灵性", category: "智慧" },
  { featureName: "神秘十字纹清晰度", conditionOperator: "<", conditionValue: "0.60", score: 3, interpretation: "神秘十字纹不明显，主人更偏向理性思维", category: "智慧" },

  // 星纹
  { featureName: "星纹清晰度", conditionOperator: ">=", conditionValue: "0.80", score: 8, interpretation: "掌中出现清晰的星纹，古称'星光闪耀'，主人在某个领域会有突出成就，可能获得意外的好运", category: "综合" },
  { featureName: "星纹清晰度", conditionOperator: "between", conditionValue: "0.70-0.80", score: 6, interpretation: "星纹较为清晰，主人有获得意外好运的机会", category: "综合" },
  { featureName: "星纹清晰度", conditionOperator: "<", conditionValue: "0.70", score: 3, interpretation: "星纹不明显，好运需要通过努力来创造", category: "综合" },

  // 岛纹
  { featureName: "岛纹数量", conditionOperator: ">=", conditionValue: "3", score: 1, interpretation: "掌中岛纹较多，古相学认为岛纹代表阻碍和困难，建议在做重大决定时多加谨慎", category: "综合" },
  { featureName: "岛纹数量", conditionOperator: "between", conditionValue: "1-3", score: 4, interpretation: "掌中有少量岛纹，人生中会遇到一些小挫折，但都能克服", category: "综合" },
  { featureName: "岛纹数量", conditionOperator: "==", conditionValue: "0", score: 8, interpretation: "掌中没有岛纹，古相学认为人生道路较为顺畅", category: "综合" },

  // ==================== 丘位扩展 - 更多维度 ====================
  // 木星丘（食指下方）- 领导力
  { featureName: "木星丘:饱满度", conditionOperator: ">=", conditionValue: "0.90", score: 10, interpretation: "木星丘极为饱满隆起，古称'木星高耸'，主人天生具有领袖气质，野心勃勃，事业上能达到极高成就", category: "事业" },
  { featureName: "木星丘:饱满度", conditionOperator: "between", conditionValue: "0.85-0.90", score: 9, interpretation: "木星丘非常饱满，主人有强烈的进取心和领导欲望", category: "事业" },
  { featureName: "木星丘:饱满度", conditionOperator: "between", conditionValue: "0.80-0.85", score: 8, interpretation: "木星丘较为饱满，主人有一定的领导才能", category: "事业" },
  { featureName: "木星丘:纹理清晰度", conditionOperator: ">=", conditionValue: "0.80", score: 8, interpretation: "木星丘纹理清晰，主人在领导和管理方面有天赋", category: "事业" },
  { featureName: "木星丘:纹理清晰度", conditionOperator: "between", conditionValue: "0.70-0.80", score: 6, interpretation: "木星丘纹理较清晰，有一定的组织能力", category: "事业" },
  { featureName: "木星丘:纹理清晰度", conditionOperator: "<", conditionValue: "0.70", score: 3, interpretation: "木星丘纹理不太清晰，领导力需要后天培养", category: "事业" },

  // 土星丘（中指下方）- 责任感
  { featureName: "土星丘:饱满度", conditionOperator: ">=", conditionValue: "0.85", score: 8, interpretation: "土星丘饱满，古称'土星高隆'，主人责任感极强，做事认真负责，适合从事法律、会计、工程等需要严谨性的工作", category: "事业" },
  { featureName: "土星丘:饱满度", conditionOperator: "between", conditionValue: "0.75-0.85", score: 6, interpretation: "土星丘较为饱满，主人做事有条理，有责任心", category: "事业" },
  { featureName: "土星丘:饱满度", conditionOperator: "<", conditionValue: "0.75", score: 3, interpretation: "土星丘不太饱满，做事可能不够严谨，建议培养责任感", category: "事业" },
  { featureName: "土星丘:纹理清晰度", conditionOperator: ">=", conditionValue: "0.80", score: 7, interpretation: "土星丘纹理清晰，主人有深度思考的能力，适合做研究", category: "智慧" },
  { featureName: "土星丘:纹理清晰度", conditionOperator: "<", conditionValue: "0.70", score: 3, interpretation: "土星丘纹理不太清晰，可能缺乏耐心", category: "性格" },

  // 太阳丘（无名指下方）- 艺术才华
  { featureName: "太阳丘:饱满度", conditionOperator: ">=", conditionValue: "0.85", score: 9, interpretation: "太阳丘极为饱满，古称'太阳高照'，主人艺术天赋极高，审美能力出众，适合从事设计、音乐、绘画等创意行业", category: "事业" },
  { featureName: "太阳丘:饱满度", conditionOperator: "between", conditionValue: "0.75-0.85", score: 7, interpretation: "太阳丘较为饱满，主人有一定的艺术细胞", category: "事业" },
  { featureName: "太阳丘:饱满度", conditionOperator: "<", conditionValue: "0.75", score: 3, interpretation: "太阳丘不太饱满，艺术方面的天赋需要后天培养", category: "事业" },
  { featureName: "太阳丘:纹理清晰度", conditionOperator: ">=", conditionValue: "0.80", score: 8, interpretation: "太阳丘纹理清晰，主人有创造力和表现力", category: "事业" },
  { featureName: "太阳丘:纹理清晰度", conditionOperator: "<", conditionValue: "0.70", score: 3, interpretation: "太阳丘纹理不太清晰，创造力需要激发", category: "事业" },

  // 水星丘（小指下方）- 商业才能
  { featureName: "水星丘:饱满度", conditionOperator: ">=", conditionValue: "0.85", score: 9, interpretation: "水星丘极为饱满，古称'水星丰隆'，主人口才极佳，商业头脑灵活，适合从事销售、贸易、金融等行业", category: "财运" },
  { featureName: "水星丘:饱满度", conditionOperator: "between", conditionValue: "0.75-0.85", score: 7, interpretation: "水星丘较为饱满，主人善于沟通，有商业眼光", category: "财运" },
  { featureName: "水星丘:饱满度", conditionOperator: "<", conditionValue: "0.75", score: 3, interpretation: "水星丘不太饱满，商业能力需要后天学习", category: "财运" },
  { featureName: "水星丘:纹理清晰度", conditionOperator: ">=", conditionValue: "0.80", score: 8, interpretation: "水星丘纹理清晰，主人在商业和沟通方面有天赋", category: "财运" },
  { featureName: "水星丘:纹理清晰度", conditionOperator: "<", conditionValue: "0.70", score: 3, interpretation: "水星丘纹理不太清晰，沟通能力需要提升", category: "人际" },

  // 金星丘（拇指根部）- 爱情与活力
  { featureName: "金星丘:饱满度", conditionOperator: ">=", conditionValue: "0.90", score: 9, interpretation: "金星丘极为饱满丰厚，古称'金星丰隆'，主人精力充沛，热情奔放，感情丰富，一生桃花运极旺", category: "感情" },
  { featureName: "金星丘:饱满度", conditionOperator: "between", conditionValue: "0.85-0.90", score: 8, interpretation: "金星丘非常饱满，主人充满活力，感情热烈", category: "感情" },
  { featureName: "金星丘:饱满度", conditionOperator: "between", conditionValue: "0.80-0.85", score: 7, interpretation: "金星丘较为饱满，主人有魅力，感情运不错", category: "感情" },
  { featureName: "金星丘:饱满度", conditionOperator: "between", conditionValue: "0.75-0.80", score: 5, interpretation: "金星丘饱满度适中，感情运正常", category: "感情" },
  { featureName: "金星丘:饱满度", conditionOperator: "<", conditionValue: "0.75", score: 2, interpretation: "金星丘不太饱满，精力可能不太充沛，感情上较为被动", category: "感情" },

  // 月丘（手掌外侧下方）- 想象力
  { featureName: "月丘:饱满度", conditionOperator: ">=", conditionValue: "0.85", score: 9, interpretation: "月丘极为饱满，古称'月丘丰隆'，主人想象力极为丰富，有浪漫主义情怀，适合从事文学、影视、艺术创作", category: "智慧" },
  { featureName: "月丘:饱满度", conditionOperator: "between", conditionValue: "0.75-0.85", score: 7, interpretation: "月丘较为饱满，主人有丰富的想象力和创造力", category: "智慧" },
  { featureName: "月丘:饱满度", conditionOperator: "<", conditionValue: "0.75", score: 3, interpretation: "月丘不太饱满，想象力一般，更偏向实际", category: "智慧" },
  { featureName: "月丘:纹理清晰度", conditionOperator: ">=", conditionValue: "0.80", score: 7, interpretation: "月丘纹理清晰，主人有很强的直觉力和创造力", category: "智慧" },
  { featureName: "月丘:纹理清晰度", conditionOperator: "<", conditionValue: "0.70", score: 3, interpretation: "月丘纹理不太清晰，直觉力一般", category: "智慧" },

  // 火星丘（手掌中央）- 勇气与毅力
  { featureName: "火星丘:饱满度", conditionOperator: ">=", conditionValue: "0.85", score: 8, interpretation: "火星丘饱满有力，古称'火星高隆'，主人勇气十足，意志坚定，面对困难从不退缩", category: "性格" },
  { featureName: "火星丘:饱满度", conditionOperator: "between", conditionValue: "0.75-0.85", score: 6, interpretation: "火星丘较为饱满，主人有一定的勇气和毅力", category: "性格" },
  { featureName: "火星丘:饱满度", conditionOperator: "<", conditionValue: "0.75", score: 3, interpretation: "火星丘不太饱满，面对困难可能容易退缩", category: "性格" },

  // ==================== 掌纹组合判断 ====================
  // 生命线+智慧线起点
  { featureName: "生命线智慧线连接度", conditionOperator: ">=", conditionValue: "0.80", score: 7, interpretation: "生命线与智慧线起点紧密相连，古称'川字掌'变体，主人做事谨慎，三思而后行，但可能过于保守", category: "性格" },
  { featureName: "生命线智慧线连接度", conditionOperator: "between", conditionValue: "0.60-0.80", score: 8, interpretation: "生命线与智慧线起点适度分离，主人性格平衡，既有谨慎又有魄力", category: "性格" },
  { featureName: "生命线智慧线连接度", conditionOperator: "<", conditionValue: "0.60", score: 6, interpretation: "生命线与智慧线起点分离较远，古称'断掌'变体，主人性格独立，有主见，做事果断", category: "性格" },

  // 感情线弧度
  { featureName: "感情线弧度", conditionOperator: ">=", conditionValue: "0.80", score: 8, interpretation: "感情线弧度大，向上弯曲明显，主人感情热烈，表达直接，爱恨分明", category: "感情" },
  { featureName: "感情线弧度", conditionOperator: "between", conditionValue: "0.65-0.80", score: 7, interpretation: "感情线弧度适中，主人感情表达适度", category: "感情" },
  { featureName: "感情线弧度", conditionOperator: "<", conditionValue: "0.65", score: 5, interpretation: "感情线较为平直，主人感情内敛，不善于表达", category: "感情" },

  // 智慧线弧度
  { featureName: "智慧线弧度", conditionOperator: ">=", conditionValue: "0.80", score: 8, interpretation: "智慧线弧度大，向月丘弯曲，主人想象力丰富，有艺术天赋，适合创意类工作", category: "智慧" },
  { featureName: "智慧线弧度", conditionOperator: "between", conditionValue: "0.65-0.80", score: 7, interpretation: "智慧线弧度适中，主人思维灵活，兼具理性和感性", category: "智慧" },
  { featureName: "智慧线弧度", conditionOperator: "<", conditionValue: "0.65", score: 6, interpretation: "智慧线较为平直，主人思维理性，逻辑性强，适合从事科学或技术工作", category: "智慧" },

  // 三大主线整体评分
  { featureName: "三线均衡度", conditionOperator: ">=", conditionValue: "0.85", score: 10, interpretation: "生命线、智慧线、感情线三线均衡清晰，古称'三才俱全'，主人天地人三才齐备，一生运势极佳", category: "综合" },
  { featureName: "三线均衡度", conditionOperator: "between", conditionValue: "0.75-0.85", score: 8, interpretation: "三大主线较为均衡，整体运势良好", category: "综合" },
  { featureName: "三线均衡度", conditionOperator: "between", conditionValue: "0.65-0.75", score: 5, interpretation: "三大主线有一定差异，某些方面可能较为突出", category: "综合" },
  { featureName: "三线均衡度", conditionOperator: "<", conditionValue: "0.65", score: 2, interpretation: "三大主线差异较大，人生发展可能不太均衡，建议注意短板", category: "综合" },

  // ==================== 左右手对比 ====================
  { featureName: "左右手差异度", conditionOperator: ">=", conditionValue: "0.80", score: 4, interpretation: "左右手掌纹差异较大，古相学认为'左手先天，右手后天'，说明后天努力改变了先天命运，人生经历丰富", category: "综合" },
  { featureName: "左右手差异度", conditionOperator: "between", conditionValue: "0.60-0.80", score: 7, interpretation: "左右手掌纹有一定差异，说明后天有一定的自我提升", category: "综合" },
  { featureName: "左右手差异度", conditionOperator: "<", conditionValue: "0.60", score: 8, interpretation: "左右手掌纹较为一致，先天命格与后天发展方向一致，人生较为顺遂", category: "综合" },
];
