/**
 * 风水补充规则 - 财位布局、桃花位、文昌位、流年风水、组合煞气
 */

export interface FengshuiExtraRuleData {
  roomType: string;
  featureName: string;
  conditionOperator: string;
  conditionValue: string;
  score: number;
  interpretation: string;
  category: string;
}

export const fengshuiExtraRulesData: FengshuiExtraRuleData[] = [
  // ==================== 财位布局 ====================
  { roomType: "客厅", featureName: "财位明亮度", conditionOperator: ">=", conditionValue: "0.80", score: 10, interpretation: "财位（入门对角线位置）光线充足明亮，古称'财位宜明不宜暗'，有利于财运亨通、正财偏财皆旺", category: "财位" },
  { roomType: "客厅", featureName: "财位明亮度", conditionOperator: "between", conditionValue: "0.65-0.80", score: 7, interpretation: "财位光线较好，财运正常", category: "财位" },
  { roomType: "客厅", featureName: "财位明亮度", conditionOperator: "<", conditionValue: "0.65", score: 2, interpretation: "财位光线不足，古称'暗财位则财运滞'，建议在财位增加照明", category: "财位" },

  { roomType: "客厅", featureName: "财位整洁度", conditionOperator: ">=", conditionValue: "0.80", score: 9, interpretation: "财位整洁干净，古称'财位净则财气聚'，有利于财运积累", category: "财位" },
  { roomType: "客厅", featureName: "财位整洁度", conditionOperator: "between", conditionValue: "0.60-0.80", score: 6, interpretation: "财位较为整洁", category: "财位" },
  { roomType: "客厅", featureName: "财位整洁度", conditionOperator: "<", conditionValue: "0.60", score: 0, interpretation: "财位杂乱，古称'财位乱则财气散'，建议立即清理财位", category: "财位" },

  { roomType: "客厅", featureName: "财位有靠度", conditionOperator: ">=", conditionValue: "0.80", score: 9, interpretation: "财位背后有实墙依靠，古称'财有靠山则稳固'，财运稳定持久", category: "财位" },
  { roomType: "客厅", featureName: "财位有靠度", conditionOperator: "between", conditionValue: "0.60-0.80", score: 6, interpretation: "财位有一定依靠", category: "财位" },
  { roomType: "客厅", featureName: "财位有靠度", conditionOperator: "<", conditionValue: "0.60", score: 2, interpretation: "财位背后是窗户或空旷，古称'财无靠则不聚'，建议在财位背后放置高柜或屏风", category: "财位" },

  { roomType: "客厅", featureName: "财位植物生机", conditionOperator: ">=", conditionValue: "0.75", score: 8, interpretation: "财位摆放了生机勃勃的绿植，古称'财位有生气则财运旺'，建议选择叶片圆润的植物如发财树、金钱树", category: "财位" },
  { roomType: "客厅", featureName: "财位植物生机", conditionOperator: "between", conditionValue: "0.50-0.75", score: 5, interpretation: "财位有植物但生机一般，建议加强养护", category: "财位" },
  { roomType: "客厅", featureName: "财位植物生机", conditionOperator: "<", conditionValue: "0.50", score: 1, interpretation: "财位没有植物或植物枯萎，建议摆放新鲜的发财树或富贵竹", category: "财位" },

  // ==================== 桃花位 ====================
  { roomType: "卧室", featureName: "桃花位能量", conditionOperator: ">=", conditionValue: "0.80", score: 9, interpretation: "桃花位能量充沛，古称'桃花位旺则姻缘到'，有利于单身者遇到良缘，已婚者感情和谐", category: "桃花" },
  { roomType: "卧室", featureName: "桃花位能量", conditionOperator: "between", conditionValue: "0.60-0.80", score: 6, interpretation: "桃花位能量适中，感情运正常", category: "桃花" },
  { roomType: "卧室", featureName: "桃花位能量", conditionOperator: "<", conditionValue: "0.60", score: 2, interpretation: "桃花位能量不足，建议在桃花位摆放鲜花或粉色装饰品", category: "桃花" },

  { roomType: "卧室", featureName: "桃花位花卉度", conditionOperator: ">=", conditionValue: "0.70", score: 8, interpretation: "桃花位有鲜花装饰，古称'花开富贵、缘来如此'，有利于催旺桃花运", category: "桃花" },
  { roomType: "卧室", featureName: "桃花位花卉度", conditionOperator: "between", conditionValue: "0.40-0.70", score: 5, interpretation: "桃花位有一些装饰", category: "桃花" },
  { roomType: "卧室", featureName: "桃花位花卉度", conditionOperator: "<", conditionValue: "0.40", score: 2, interpretation: "桃花位缺少装饰，建议摆放粉色或红色鲜花", category: "桃花" },

  // ==================== 文昌位 ====================
  { roomType: "书房", featureName: "文昌位能量", conditionOperator: ">=", conditionValue: "0.80", score: 10, interpretation: "文昌位能量极强，古称'文昌星照则才思泉涌'，有利于学业进步、考试成功、文思敏捷", category: "文昌" },
  { roomType: "书房", featureName: "文昌位能量", conditionOperator: "between", conditionValue: "0.60-0.80", score: 7, interpretation: "文昌位能量适中，学业运正常", category: "文昌" },
  { roomType: "书房", featureName: "文昌位能量", conditionOperator: "<", conditionValue: "0.60", score: 2, interpretation: "文昌位能量不足，建议在文昌位摆放文昌塔或四支毛笔", category: "文昌" },

  { roomType: "书房", featureName: "文昌位书籍度", conditionOperator: ">=", conditionValue: "0.75", score: 8, interpretation: "文昌位有书籍或文房四宝，古称'文昌位有文气则学运旺'", category: "文昌" },
  { roomType: "书房", featureName: "文昌位书籍度", conditionOperator: "between", conditionValue: "0.50-0.75", score: 5, interpretation: "文昌位有一些文化元素", category: "文昌" },
  { roomType: "书房", featureName: "文昌位书籍度", conditionOperator: "<", conditionValue: "0.50", score: 2, interpretation: "文昌位缺少文化元素，建议摆放书籍或文昌塔", category: "文昌" },

  // ==================== 玄关风水 ====================
  { roomType: "客厅", featureName: "玄关设置度", conditionOperator: ">=", conditionValue: "0.80", score: 9, interpretation: "玄关设置合理，古称'玄关是气口'，能有效阻挡外部煞气，保护室内气场", category: "玄关" },
  { roomType: "客厅", featureName: "玄关设置度", conditionOperator: "between", conditionValue: "0.60-0.80", score: 6, interpretation: "玄关设置尚可", category: "玄关" },
  { roomType: "客厅", featureName: "玄关设置度", conditionOperator: "<", conditionValue: "0.60", score: 2, interpretation: "玄关设置不足或没有玄关，建议设置玄关柜或屏风来缓冲气流", category: "玄关" },

  { roomType: "客厅", featureName: "玄关明亮度", conditionOperator: ">=", conditionValue: "0.75", score: 8, interpretation: "玄关明亮整洁，古称'明堂亮则财运旺'，进门第一印象极好", category: "玄关" },
  { roomType: "客厅", featureName: "玄关明亮度", conditionOperator: "between", conditionValue: "0.55-0.75", score: 5, interpretation: "玄关光线适中", category: "玄关" },
  { roomType: "客厅", featureName: "玄关明亮度", conditionOperator: "<", conditionValue: "0.55", score: 1, interpretation: "玄关昏暗，古称'暗门则运滞'，建议增加玄关照明", category: "玄关" },

  // ==================== 卧室床位风水 ====================
  { roomType: "卧室", featureName: "床位靠墙度", conditionOperator: ">=", conditionValue: "0.80", score: 9, interpretation: "床头紧靠实墙，古称'床有靠山则安眠'，有利于睡眠质量和事业稳定", category: "床位" },
  { roomType: "卧室", featureName: "床位靠墙度", conditionOperator: "between", conditionValue: "0.60-0.80", score: 6, interpretation: "床头基本靠墙", category: "床位" },
  { roomType: "卧室", featureName: "床位靠墙度", conditionOperator: "<", conditionValue: "0.60", score: 1, interpretation: "床头没有靠墙或靠窗，古称'床无靠则心不安'，建议将床头移至靠墙位置", category: "床位" },

  { roomType: "卧室", featureName: "床对门指数", conditionOperator: ">=", conditionValue: "0.70", score: -4, interpretation: "床直对房门，古称'门冲床则不安'，可能导致睡眠不好、精神紧张。化解方法：调整床位或在门口放置屏风", category: "煞气" },
  { roomType: "卧室", featureName: "床对门指数", conditionOperator: "between", conditionValue: "0.40-0.70", score: -1, interpretation: "床与门有一定角度，影响不大", category: "布局" },
  { roomType: "卧室", featureName: "床对门指数", conditionOperator: "<", conditionValue: "0.40", score: 8, interpretation: "床与门不直对，布局合理，有利于安眠", category: "布局" },

  { roomType: "卧室", featureName: "床对窗指数", conditionOperator: ">=", conditionValue: "0.70", score: -3, interpretation: "床头正对窗户，古称'床靠窗则气散'，可能导致头痛和睡眠质量差。建议加装厚窗帘或移动床位", category: "煞气" },
  { roomType: "卧室", featureName: "床对窗指数", conditionOperator: "between", conditionValue: "0.40-0.70", score: 0, interpretation: "床与窗有一定距离，影响不大", category: "布局" },
  { roomType: "卧室", featureName: "床对窗指数", conditionOperator: "<", conditionValue: "0.40", score: 7, interpretation: "床与窗保持适当距离，布局合理", category: "布局" },

  // ==================== 厨房深化 ====================
  { roomType: "厨房", featureName: "灶台对门指数", conditionOperator: ">=", conditionValue: "0.70", score: -4, interpretation: "灶台正对厨房门，古称'开门见灶则钱财多耗'，可能影响财运。化解方法：设置隔断或调整灶台位置", category: "煞气" },
  { roomType: "厨房", featureName: "灶台对门指数", conditionOperator: "between", conditionValue: "0.40-0.70", score: 0, interpretation: "灶台与门有一定角度，影响不大", category: "布局" },
  { roomType: "厨房", featureName: "灶台对门指数", conditionOperator: "<", conditionValue: "0.40", score: 8, interpretation: "灶台不对门，布局合理，有利于财运", category: "布局" },

  { roomType: "厨房", featureName: "冰箱位置吉度", conditionOperator: ">=", conditionValue: "0.75", score: 7, interpretation: "冰箱位置合理，古称'冰箱为财库'，摆放得当有利于财运", category: "布局" },
  { roomType: "厨房", featureName: "冰箱位置吉度", conditionOperator: "between", conditionValue: "0.50-0.75", score: 5, interpretation: "冰箱位置尚可", category: "布局" },
  { roomType: "厨房", featureName: "冰箱位置吉度", conditionOperator: "<", conditionValue: "0.50", score: 2, interpretation: "冰箱位置不太理想，建议不要正对灶台", category: "布局" },

  // ==================== 卫生间深化 ====================
  { roomType: "卫生间", featureName: "马桶位置吉度", conditionOperator: ">=", conditionValue: "0.75", score: 7, interpretation: "马桶位置合理，不在正对门的位置，古称'秽气不冲门则吉'", category: "布局" },
  { roomType: "卫生间", featureName: "马桶位置吉度", conditionOperator: "between", conditionValue: "0.50-0.75", score: 4, interpretation: "马桶位置尚可，建议保持马桶盖关闭", category: "布局" },
  { roomType: "卫生间", featureName: "马桶位置吉度", conditionOperator: "<", conditionValue: "0.50", score: 0, interpretation: "马桶正对卫生间门，古称'秽气直冲'，建议保持门常关、马桶盖关闭", category: "布局" },

  { roomType: "卫生间", featureName: "干湿分离度", conditionOperator: ">=", conditionValue: "0.80", score: 8, interpretation: "卫生间干湿分离做得好，有利于保持清洁干燥，减少湿气对健康的影响", category: "环境" },
  { roomType: "卫生间", featureName: "干湿分离度", conditionOperator: "between", conditionValue: "0.60-0.80", score: 5, interpretation: "干湿分离一般", category: "环境" },
  { roomType: "卫生间", featureName: "干湿分离度", conditionOperator: "<", conditionValue: "0.60", score: 1, interpretation: "干湿分离不足，湿气可能较重，建议改善", category: "环境" },

  // ==================== 阳台深化 ====================
  { roomType: "阳台", featureName: "绿植丰富度", conditionOperator: ">=", conditionValue: "0.80", score: 9, interpretation: "阳台绿植丰富茂盛，古称'阳台有生气则家运旺'，有利于全家健康和运势", category: "装饰" },
  { roomType: "阳台", featureName: "绿植丰富度", conditionOperator: "between", conditionValue: "0.60-0.80", score: 6, interpretation: "阳台有一些绿植", category: "装饰" },
  { roomType: "阳台", featureName: "绿植丰富度", conditionOperator: "<", conditionValue: "0.60", score: 2, interpretation: "阳台缺少绿植，建议摆放一些常绿植物", category: "装饰" },

  { roomType: "阳台", featureName: "杂物堆积度", conditionOperator: ">=", conditionValue: "0.70", score: -3, interpretation: "阳台堆积过多杂物，古称'阳台乱则气滞'，阻碍了气流进入室内，建议清理", category: "环境" },
  { roomType: "阳台", featureName: "杂物堆积度", conditionOperator: "between", conditionValue: "0.40-0.70", score: 0, interpretation: "阳台有一些物品，建议适当整理", category: "环境" },
  { roomType: "阳台", featureName: "杂物堆积度", conditionOperator: "<", conditionValue: "0.40", score: 8, interpretation: "阳台整洁有序，气流畅通，有利于引入正能量", category: "环境" },

  // ==================== 组合煞气 ====================
  // 天斩煞（两栋高楼之间的缝隙对着窗户）
  { roomType: "通用", featureName: "天斩煞指数", conditionOperator: ">=", conditionValue: "0.75", score: -5, interpretation: "检测到天斩煞，窗外可能有两栋高楼之间的狭窄缝隙正对窗户，古称'天斩煞如刀劈'，可能影响健康。化解方法：在窗户挂上铜葫芦或八卦镜", category: "煞气" },
  { roomType: "通用", featureName: "天斩煞指数", conditionOperator: "between", conditionValue: "0.50-0.75", score: -2, interpretation: "轻度天斩煞，建议在窗户增加遮挡", category: "煞气" },
  { roomType: "通用", featureName: "天斩煞指数", conditionOperator: "<", conditionValue: "0.50", score: 7, interpretation: "没有天斩煞的影响", category: "环境" },

  // 反弓煞（弧形道路的外侧）
  { roomType: "通用", featureName: "反弓煞指数", conditionOperator: ">=", conditionValue: "0.70", score: -4, interpretation: "检测到反弓煞，窗外可能有弧形道路或河流的外侧正对窗户，古称'反弓无情则财散'。化解方法：在窗台摆放泰山石敢当", category: "煞气" },
  { roomType: "通用", featureName: "反弓煞指数", conditionOperator: "between", conditionValue: "0.40-0.70", score: -1, interpretation: "轻度反弓煞，影响不大", category: "煞气" },
  { roomType: "通用", featureName: "反弓煞指数", conditionOperator: "<", conditionValue: "0.40", score: 7, interpretation: "没有反弓煞的影响", category: "环境" },

  // 孤阳煞（旁边有变电站、信号塔等）
  { roomType: "通用", featureName: "电磁干扰指数", conditionOperator: ">=", conditionValue: "0.70", score: -4, interpretation: "检测到较强的电磁干扰迹象，附近可能有变电站或信号塔，古称'孤阳煞'，可能影响健康和睡眠。化解方法：在窗户挂上铜铃或放置黑曜石", category: "煞气" },
  { roomType: "通用", featureName: "电磁干扰指数", conditionOperator: "between", conditionValue: "0.40-0.70", score: -1, interpretation: "轻度电磁干扰，影响不大", category: "煞气" },
  { roomType: "通用", featureName: "电磁干扰指数", conditionOperator: "<", conditionValue: "0.40", score: 7, interpretation: "电磁环境良好", category: "环境" },

  // ==================== 整体气场 ====================
  { roomType: "通用", featureName: "整体气场和谐度", conditionOperator: ">=", conditionValue: "0.85", score: 10, interpretation: "整体气场极为和谐，五行平衡、八卦方位得当、无明显煞气，古称'天地人和'，是理想的居住环境", category: "综合" },
  { roomType: "通用", featureName: "整体气场和谐度", conditionOperator: "between", conditionValue: "0.75-0.85", score: 8, interpretation: "整体气场良好，居住环境不错", category: "综合" },
  { roomType: "通用", featureName: "整体气场和谐度", conditionOperator: "between", conditionValue: "0.65-0.75", score: 5, interpretation: "整体气场一般，有一些需要改善的地方", category: "综合" },
  { roomType: "通用", featureName: "整体气场和谐度", conditionOperator: "<", conditionValue: "0.65", score: 1, interpretation: "整体气场需要较大改善，建议全面调整风水布局", category: "综合" },

  // 阴阳平衡
  { roomType: "通用", featureName: "阴阳平衡度", conditionOperator: ">=", conditionValue: "0.80", score: 9, interpretation: "阴阳极为平衡，光线与阴影、动与静、冷与暖达到和谐统一，古称'阴阳调和则万事顺'", category: "综合" },
  { roomType: "通用", featureName: "阴阳平衡度", conditionOperator: "between", conditionValue: "0.65-0.80", score: 6, interpretation: "阴阳较为平衡", category: "综合" },
  { roomType: "通用", featureName: "阴阳平衡度", conditionOperator: "<", conditionValue: "0.65", score: 2, interpretation: "阴阳失衡，空间可能过于阴暗或过于明亮，建议调整", category: "综合" },

  // 气口（门窗）
  { roomType: "通用", featureName: "气口通畅度", conditionOperator: ">=", conditionValue: "0.80", score: 9, interpretation: "气口（门窗）通畅，古称'气口畅则运势旺'，有利于引入新鲜气场", category: "环境" },
  { roomType: "通用", featureName: "气口通畅度", conditionOperator: "between", conditionValue: "0.65-0.80", score: 6, interpretation: "气口较为通畅", category: "环境" },
  { roomType: "通用", featureName: "气口通畅度", conditionOperator: "<", conditionValue: "0.65", score: 2, interpretation: "气口不太通畅，建议检查门窗是否被遮挡", category: "环境" },
];
