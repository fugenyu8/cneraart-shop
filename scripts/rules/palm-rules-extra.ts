/**
 * 手相补充规则 - 特殊纹路、指节分析、手型五行深化、掌色判断
 */

export interface PalmExtraRuleData {
  featureName: string;
  conditionOperator: string;
  conditionValue: string;
  score: number;
  interpretation: string;
  category: string;
}

export const palmExtraRulesData: PalmExtraRuleData[] = [
  // ==================== 特殊纹路 ====================
  // 星纹（三条短线交叉成星形）
  { featureName: "星纹_木星丘", conditionOperator: ">=", conditionValue: "0.70", score: 10, interpretation: "木星丘（食指下方）出现星纹，古称'星照木星'，主大富大贵、事业飞黄腾达，是极为罕见的吉相", category: "特殊纹路" },
  { featureName: "星纹_太阳丘", conditionOperator: ">=", conditionValue: "0.70", score: 9, interpretation: "太阳丘（无名指下方）出现星纹，古称'星照太阳'，主才华横溢、名利双收，在艺术或创意领域有极高成就", category: "特殊纹路" },
  { featureName: "星纹_水星丘", conditionOperator: ">=", conditionValue: "0.70", score: 8, interpretation: "水星丘（小指下方）出现星纹，主商业天赋极高、口才出众，在商业或外交领域有卓越成就", category: "特殊纹路" },
  { featureName: "星纹_土星丘", conditionOperator: ">=", conditionValue: "0.70", score: 5, interpretation: "土星丘（中指下方）出现星纹，需注意命运的突然转折，可能有意外的好运或挑战", category: "特殊纹路" },

  // 十字纹
  { featureName: "十字纹_木星丘", conditionOperator: ">=", conditionValue: "0.65", score: 8, interpretation: "木星丘出现十字纹，古称'神秘十字'，主直觉力极强、有宗教或神秘学天赋，常能逢凶化吉", category: "特殊纹路" },
  { featureName: "十字纹_太阳丘", conditionOperator: ">=", conditionValue: "0.65", score: 7, interpretation: "太阳丘出现十字纹，主艺术天赋高但可能大器晚成，需坚持不懈", category: "特殊纹路" },
  { featureName: "十字纹_掌心", conditionOperator: ">=", conditionValue: "0.65", score: 9, interpretation: "掌心出现神秘十字纹（位于感情线与智慧线之间），古称'灵感十字'，主第六感极强、有通灵体质", category: "特殊纹路" },

  // 岛纹（椭圆形封闭纹路）
  { featureName: "岛纹_生命线", conditionOperator: ">=", conditionValue: "0.60", score: -3, interpretation: "生命线上出现岛纹，古称'生命线有岛则体弱'，对应位置的年龄段可能有健康问题，建议定期体检", category: "特殊纹路" },
  { featureName: "岛纹_智慧线", conditionOperator: ">=", conditionValue: "0.60", score: -2, interpretation: "智慧线上出现岛纹，古称'智慧线有岛则思虑过多'，可能在某段时期精神压力较大，建议学会放松", category: "特殊纹路" },
  { featureName: "岛纹_感情线", conditionOperator: ">=", conditionValue: "0.60", score: -2, interpretation: "感情线上出现岛纹，古称'感情线有岛则情路坎坷'，对应时期可能有感情波折", category: "特殊纹路" },
  { featureName: "岛纹_命运线", conditionOperator: ">=", conditionValue: "0.60", score: -3, interpretation: "命运线上出现岛纹，对应时期事业可能遇到困难或挫折，但岛纹结束后运势会回升", category: "特殊纹路" },

  // 方形纹（保护纹）
  { featureName: "方形纹_生命线", conditionOperator: ">=", conditionValue: "0.60", score: 8, interpretation: "生命线旁出现方形纹，古称'保护纹'，主有贵人保护，即使遇到危险也能化险为夷", category: "特殊纹路" },
  { featureName: "方形纹_命运线", conditionOperator: ">=", conditionValue: "0.60", score: 7, interpretation: "命运线旁出现方形纹，主事业有保护，即使遇到困难也能安然度过", category: "特殊纹路" },

  // 三角纹
  { featureName: "三角纹_掌心", conditionOperator: ">=", conditionValue: "0.65", score: 8, interpretation: "掌心出现大三角纹（由生命线、智慧线、命运线围成），古称'掌中金三角'，主一生财运极佳", category: "特殊纹路" },
  { featureName: "三角纹_木星丘", conditionOperator: ">=", conditionValue: "0.65", score: 7, interpretation: "木星丘出现三角纹，主有外交才能和领导力", category: "特殊纹路" },

  // 链状纹
  { featureName: "链状纹_感情线", conditionOperator: ">=", conditionValue: "0.60", score: -2, interpretation: "感情线呈链状，古称'感情线如锁链则多情'，主感情经历丰富但可能不够专一，建议学会珍惜", category: "特殊纹路" },
  { featureName: "链状纹_智慧线", conditionOperator: ">=", conditionValue: "0.60", score: -1, interpretation: "智慧线呈链状，主思维活跃但可能不够专注，建议培养专注力", category: "特殊纹路" },

  // ==================== 指节分析 ====================
  // 拇指
  { featureName: "拇指第一节长度", conditionOperator: ">=", conditionValue: "0.55", score: 8, interpretation: "拇指第一节（指甲节）较长，古称'意志节'，主意志力极强、做事有决心、不轻易放弃", category: "指节" },
  { featureName: "拇指第一节长度", conditionOperator: "between", conditionValue: "0.40-0.55", score: 6, interpretation: "拇指第一节长度适中，意志力正常", category: "指节" },
  { featureName: "拇指第一节长度", conditionOperator: "<", conditionValue: "0.40", score: 3, interpretation: "拇指第一节偏短，意志力可能不够坚定，建议培养毅力", category: "指节" },

  { featureName: "拇指第二节长度", conditionOperator: ">=", conditionValue: "0.55", score: 8, interpretation: "拇指第二节（中间节）较长，古称'理性节'，主逻辑思维强、善于分析判断", category: "指节" },
  { featureName: "拇指第二节长度", conditionOperator: "between", conditionValue: "0.40-0.55", score: 6, interpretation: "拇指第二节长度适中，理性思维正常", category: "指节" },
  { featureName: "拇指第二节长度", conditionOperator: "<", conditionValue: "0.40", score: 3, interpretation: "拇指第二节偏短，可能偏感性决策", category: "指节" },

  // 食指（木星指）
  { featureName: "食指长度比例", conditionOperator: ">=", conditionValue: "0.75", score: 8, interpretation: "食指较长（超过中指第一节中部），古称'木星指长则有领导力'，主有野心、有权威、适合管理岗位", category: "指节" },
  { featureName: "食指长度比例", conditionOperator: "between", conditionValue: "0.60-0.75", score: 6, interpretation: "食指长度适中，领导力正常", category: "指节" },
  { featureName: "食指长度比例", conditionOperator: "<", conditionValue: "0.60", score: 3, interpretation: "食指偏短，可能不太喜欢出风头，更适合幕后工作", category: "指节" },

  // 中指（土星指）
  { featureName: "中指长度比例", conditionOperator: ">=", conditionValue: "0.85", score: 7, interpretation: "中指较长，古称'土星指长则沉稳'，主性格沉稳、做事认真、有责任感", category: "指节" },
  { featureName: "中指长度比例", conditionOperator: "between", conditionValue: "0.75-0.85", score: 6, interpretation: "中指长度适中，性格平衡", category: "指节" },
  { featureName: "中指长度比例", conditionOperator: "<", conditionValue: "0.75", score: 4, interpretation: "中指偏短，性格可能偏活泼，不太喜欢受约束", category: "指节" },

  // 无名指（太阳指）
  { featureName: "无名指长度比例", conditionOperator: ">=", conditionValue: "0.75", score: 8, interpretation: "无名指较长（接近或超过中指），古称'太阳指长则有艺术天赋'，主有创造力、审美能力强、适合艺术领域", category: "指节" },
  { featureName: "无名指长度比例", conditionOperator: "between", conditionValue: "0.60-0.75", score: 6, interpretation: "无名指长度适中，创造力正常", category: "指节" },
  { featureName: "无名指长度比例", conditionOperator: "<", conditionValue: "0.60", score: 3, interpretation: "无名指偏短，可能更偏理性思维", category: "指节" },

  // 小指（水星指）
  { featureName: "小指长度比例", conditionOperator: ">=", conditionValue: "0.70", score: 8, interpretation: "小指较长（超过无名指第一节），古称'水星指长则口才好'，主口才出众、善于交际、商业天赋高", category: "指节" },
  { featureName: "小指长度比例", conditionOperator: "between", conditionValue: "0.55-0.70", score: 6, interpretation: "小指长度适中，交际能力正常", category: "指节" },
  { featureName: "小指长度比例", conditionOperator: "<", conditionValue: "0.55", score: 3, interpretation: "小指偏短，古称'水星指短则不善言辞'，但可能内心世界丰富", category: "指节" },

  // ==================== 掌色判断 ====================
  { featureName: "掌色红润度", conditionOperator: ">=", conditionValue: "0.80", score: 9, interpretation: "手掌红润有光泽，古称'掌如红玉'，主身体健康、精力充沛、近期运势极佳", category: "掌色" },
  { featureName: "掌色红润度", conditionOperator: "between", conditionValue: "0.65-0.80", score: 7, interpretation: "手掌色泽良好，健康状况正常", category: "掌色" },
  { featureName: "掌色红润度", conditionOperator: "between", conditionValue: "0.50-0.65", score: 4, interpretation: "手掌色泽一般，建议注意休息和营养", category: "掌色" },
  { featureName: "掌色红润度", conditionOperator: "<", conditionValue: "0.50", score: 1, interpretation: "手掌偏白或偏暗，古称'掌色暗则气血不足'，建议注意健康调理", category: "掌色" },

  { featureName: "掌心温度感", conditionOperator: ">=", conditionValue: "0.75", score: 8, interpretation: "掌心温暖，古称'掌暖则心善'，主为人热情、乐于助人、人缘极好", category: "掌色" },
  { featureName: "掌心温度感", conditionOperator: "between", conditionValue: "0.50-0.75", score: 6, interpretation: "掌心温度适中", category: "掌色" },
  { featureName: "掌心温度感", conditionOperator: "<", conditionValue: "0.50", score: 3, interpretation: "掌心偏凉，古称'掌凉则气虚'，建议注意保暖和气血调理", category: "掌色" },

  // ==================== 手型五行深化 ====================
  // 金型手（方形、指节分明）
  { featureName: "金型手指数", conditionOperator: ">=", conditionValue: "0.80", score: 8, interpretation: "典型的金型手，手掌方正、指节分明、皮肤白皙。五行属金者性格果断、有正义感、适合法律、金融、管理等行业", category: "手型" },
  { featureName: "金型手指数", conditionOperator: "between", conditionValue: "0.60-0.80", score: 6, interpretation: "有一定的金型手特征，性格中有果断的一面", category: "手型" },

  // 木型手（修长、指节纤细）
  { featureName: "木型手指数", conditionOperator: ">=", conditionValue: "0.80", score: 8, interpretation: "典型的木型手，手指修长、指节纤细、手掌偏长。五行属木者性格仁慈、有创造力、适合教育、文化、艺术等行业", category: "手型" },
  { featureName: "木型手指数", conditionOperator: "between", conditionValue: "0.60-0.80", score: 6, interpretation: "有一定的木型手特征，性格中有仁慈创新的一面", category: "手型" },

  // 水型手（柔软、圆润）
  { featureName: "水型手指数", conditionOperator: ">=", conditionValue: "0.80", score: 8, interpretation: "典型的水型手，手掌柔软圆润、指尖圆滑。五行属水者性格聪明、善于变通、适合商业、外交、传媒等行业", category: "手型" },
  { featureName: "水型手指数", conditionOperator: "between", conditionValue: "0.60-0.80", score: 6, interpretation: "有一定的水型手特征，性格中有聪明灵活的一面", category: "手型" },

  // 火型手（尖形、指尖尖锐）
  { featureName: "火型手指数", conditionOperator: ">=", conditionValue: "0.80", score: 8, interpretation: "典型的火型手，手指尖锐、手掌偏红。五行属火者性格热情、有行动力、适合销售、演艺、体育等行业", category: "手型" },
  { featureName: "火型手指数", conditionOperator: "between", conditionValue: "0.60-0.80", score: 6, interpretation: "有一定的火型手特征，性格中有热情积极的一面", category: "手型" },

  // 土型手（厚实、宽大）
  { featureName: "土型手指数", conditionOperator: ">=", conditionValue: "0.80", score: 8, interpretation: "典型的土型手，手掌厚实宽大、指节粗壮。五行属土者性格稳重、有耐心、适合农业、建筑、房地产等行业", category: "手型" },
  { featureName: "土型手指数", conditionOperator: "between", conditionValue: "0.60-0.80", score: 6, interpretation: "有一定的土型手特征，性格中有稳重踏实的一面", category: "手型" },

  // ==================== 掌纹深浅与清晰度 ====================
  { featureName: "整体纹路清晰度", conditionOperator: ">=", conditionValue: "0.80", score: 9, interpretation: "掌纹整体清晰深刻，古称'纹深则命强'，主性格坚毅、人生经历丰富、运势强劲", category: "综合" },
  { featureName: "整体纹路清晰度", conditionOperator: "between", conditionValue: "0.65-0.80", score: 7, interpretation: "掌纹较为清晰，运势正常", category: "综合" },
  { featureName: "整体纹路清晰度", conditionOperator: "between", conditionValue: "0.50-0.65", score: 5, interpretation: "掌纹清晰度一般", category: "综合" },
  { featureName: "整体纹路清晰度", conditionOperator: "<", conditionValue: "0.50", score: 2, interpretation: "掌纹较为模糊，古称'纹浅则性柔'，主性格温和、随遇而安", category: "综合" },

  // 杂纹多少
  { featureName: "杂纹密度", conditionOperator: ">=", conditionValue: "0.80", score: 3, interpretation: "掌中杂纹极多，古称'纹多则思虑多'，主思虑过重、操心较多，建议学会放下", category: "综合" },
  { featureName: "杂纹密度", conditionOperator: "between", conditionValue: "0.60-0.80", score: 5, interpretation: "掌中杂纹适中，思维活跃", category: "综合" },
  { featureName: "杂纹密度", conditionOperator: "between", conditionValue: "0.40-0.60", score: 7, interpretation: "掌中杂纹较少，古称'纹少则心宽'，主性格豁达、心态好", category: "综合" },
  { featureName: "杂纹密度", conditionOperator: "<", conditionValue: "0.40", score: 8, interpretation: "掌中杂纹极少，主线清晰分明，古称'清纹贵相'，主一生顺遂", category: "综合" },

  // ==================== 左右手对比 ====================
  { featureName: "左右手差异度", conditionOperator: ">=", conditionValue: "0.80", score: 4, interpretation: "左右手掌纹差异极大，古称'左手先天右手后天'，说明后天经历对命运改变很大，是一个不断突破自我的人", category: "综合" },
  { featureName: "左右手差异度", conditionOperator: "between", conditionValue: "0.60-0.80", score: 6, interpretation: "左右手掌纹有一定差异，后天努力对命运有一定影响", category: "综合" },
  { featureName: "左右手差异度", conditionOperator: "between", conditionValue: "0.40-0.60", score: 7, interpretation: "左右手掌纹较为相似，先天运势与后天发展基本一致", category: "综合" },
  { featureName: "左右手差异度", conditionOperator: "<", conditionValue: "0.40", score: 8, interpretation: "左右手掌纹几乎一致，古称'天命所归'，先天运势极强，一生较为顺遂", category: "综合" },

  // ==================== 健康线深化 ====================
  { featureName: "健康线清晰度", conditionOperator: ">=", conditionValue: "0.75", score: 3, interpretation: "健康线非常清晰，古称'健康线明显则需注意健康'，反而提示需要关注身体状况，建议定期体检", category: "辅助线" },
  { featureName: "健康线清晰度", conditionOperator: "between", conditionValue: "0.50-0.75", score: 5, interpretation: "健康线较为清晰，需适当注意健康", category: "辅助线" },
  { featureName: "健康线清晰度", conditionOperator: "<", conditionValue: "0.50", score: 8, interpretation: "健康线不明显或没有，古称'无健康线则体健'，反而说明身体状况良好", category: "辅助线" },

  // 直觉线
  { featureName: "直觉线清晰度", conditionOperator: ">=", conditionValue: "0.70", score: 9, interpretation: "直觉线（月丘到水星丘的弧线）清晰可见，古称'灵感线'，主第六感极强、有通灵体质、适合从事心理学或玄学", category: "辅助线" },
  { featureName: "直觉线清晰度", conditionOperator: "between", conditionValue: "0.50-0.70", score: 6, interpretation: "直觉线隐约可见，有一定的直觉力", category: "辅助线" },
  { featureName: "直觉线清晰度", conditionOperator: "<", conditionValue: "0.50", score: 4, interpretation: "直觉线不明显，直觉力一般，更偏理性思维", category: "辅助线" },

  // 旅行线
  { featureName: "旅行线数量", conditionOperator: ">=", conditionValue: "0.75", score: 8, interpretation: "旅行线（从生命线延伸向月丘的横线）较多，古称'驿马纹'，主一生多旅行、多迁移，有海外发展的机会", category: "辅助线" },
  { featureName: "旅行线数量", conditionOperator: "between", conditionValue: "0.50-0.75", score: 6, interpretation: "旅行线适中，有一些旅行和迁移的机会", category: "辅助线" },
  { featureName: "旅行线数量", conditionOperator: "<", conditionValue: "0.50", score: 4, interpretation: "旅行线较少，可能更倾向于安定的生活", category: "辅助线" },

  // 子女线
  { featureName: "子女线数量", conditionOperator: ">=", conditionValue: "0.75", score: 7, interpretation: "子女线（小指下方的短竖线）较多且清晰，古称'子女纹多则子女缘旺'，主子女较多且关系亲密", category: "辅助线" },
  { featureName: "子女线数量", conditionOperator: "between", conditionValue: "0.50-0.75", score: 6, interpretation: "子女线适中，子女缘正常", category: "辅助线" },
  { featureName: "子女线数量", conditionOperator: "<", conditionValue: "0.50", score: 4, interpretation: "子女线较少或不明显，子女缘可能较淡，但不代表没有子女", category: "辅助线" },

  // 财运线
  { featureName: "财运线清晰度", conditionOperator: ">=", conditionValue: "0.75", score: 9, interpretation: "财运线（水星丘上的短竖线）清晰有力，古称'财纹深则财运旺'，主有理财天赋、善于积累财富", category: "辅助线" },
  { featureName: "财运线清晰度", conditionOperator: "between", conditionValue: "0.50-0.75", score: 6, interpretation: "财运线较为清晰，财运正常", category: "辅助线" },
  { featureName: "财运线清晰度", conditionOperator: "<", conditionValue: "0.50", score: 3, interpretation: "财运线不太明显，理财能力可能需要加强", category: "辅助线" },
];
