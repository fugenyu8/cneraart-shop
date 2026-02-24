/**
 * 风水扩展规则库 - 五行平衡、八卦方位、煞气化解、家具摆放、环境分析
 * 补充 fengshui-rules.ts 中的基础规则
 */

export interface FengshuiExtendedRuleData {
  roomType: string;
  featureName: string;
  conditionOperator: string;
  conditionValue: string;
  score: number;
  interpretation: string;
  category: string;
}

export const fengshuiExtendedRulesData: FengshuiExtendedRuleData[] = [
  // ==================== 五行平衡分析 ====================
  // 金元素（白色/金属色/圆形物品）
  { roomType: "通用", featureName: "金元素比例", conditionOperator: "between", conditionValue: "0.15-0.25", score: 9, interpretation: "金元素比例恰到好处，五行中金代表收敛和果断，空间中金属元素适中，有助于提升决断力和执行力", category: "五行" },
  { roomType: "通用", featureName: "金元素比例", conditionOperator: ">=", conditionValue: "0.35", score: 3, interpretation: "金元素过多，五行失衡偏金，空间过于冷硬，可能导致人际关系紧张，建议增加木元素（绿植）来调和", category: "五行" },
  { roomType: "通用", featureName: "金元素比例", conditionOperator: "<", conditionValue: "0.10", score: 4, interpretation: "金元素不足，空间缺乏收敛之气，做事可能缺乏果断，建议适当添加金属饰品或白色装饰", category: "五行" },

  // 木元素（绿色/植物/木质家具）
  { roomType: "通用", featureName: "木元素比例", conditionOperator: "between", conditionValue: "0.15-0.25", score: 9, interpretation: "木元素比例适中，五行中木代表生长和创新，空间中绿植和木质元素恰到好处，有助于身心健康和事业发展", category: "五行" },
  { roomType: "通用", featureName: "木元素比例", conditionOperator: ">=", conditionValue: "0.35", score: 4, interpretation: "木元素过多，五行失衡偏木，空间过于繁茂，可能导致思绪混乱，建议适当精简绿植", category: "五行" },
  { roomType: "通用", featureName: "木元素比例", conditionOperator: "<", conditionValue: "0.10", score: 3, interpretation: "木元素严重不足，空间缺乏生机，建议摆放绿色植物（如富贵竹、发财树），增添生气", category: "五行" },

  // 水元素（黑色/蓝色/流动感）
  { roomType: "通用", featureName: "水元素比例", conditionOperator: "between", conditionValue: "0.10-0.20", score: 9, interpretation: "水元素比例适中，五行中水代表智慧和财运，空间中水元素恰到好处，有助于提升智慧和财运", category: "五行" },
  { roomType: "通用", featureName: "水元素比例", conditionOperator: ">=", conditionValue: "0.30", score: 3, interpretation: "水元素过多，五行失衡偏水，空间过于阴冷，可能影响健康，建议增加火元素（暖色灯光）来调和", category: "五行" },
  { roomType: "通用", featureName: "水元素比例", conditionOperator: "<", conditionValue: "0.05", score: 4, interpretation: "水元素不足，空间缺乏灵动之气，建议添加小型水景或蓝色装饰品", category: "五行" },

  // 火元素（红色/暖色/三角形）
  { roomType: "通用", featureName: "火元素比例", conditionOperator: "between", conditionValue: "0.10-0.20", score: 9, interpretation: "火元素比例适中，五行中火代表热情和活力，空间中暖色调恰到好处，有助于提升人际关系和事业运", category: "五行" },
  { roomType: "通用", featureName: "火元素比例", conditionOperator: ">=", conditionValue: "0.30", score: 3, interpretation: "火元素过多，五行失衡偏火，空间过于燥热，可能导致脾气暴躁，建议增加水元素来降火", category: "五行" },
  { roomType: "通用", featureName: "火元素比例", conditionOperator: "<", conditionValue: "0.05", score: 4, interpretation: "火元素不足，空间缺乏温暖和活力，建议增加暖色调灯光或红色装饰品", category: "五行" },

  // 土元素（黄色/棕色/方形）
  { roomType: "通用", featureName: "土元素比例", conditionOperator: "between", conditionValue: "0.15-0.25", score: 9, interpretation: "土元素比例适中，五行中土代表稳定和包容，空间中土色调恰到好处，有助于家庭和谐和事业稳定", category: "五行" },
  { roomType: "通用", featureName: "土元素比例", conditionOperator: ">=", conditionValue: "0.35", score: 4, interpretation: "土元素过多，五行失衡偏土，空间过于沉闷，建议增加金属元素来泄土", category: "五行" },
  { roomType: "通用", featureName: "土元素比例", conditionOperator: "<", conditionValue: "0.10", score: 3, interpretation: "土元素不足，空间缺乏稳定感，建议添加陶瓷器皿或黄色/棕色装饰", category: "五行" },

  // 五行平衡总评
  { roomType: "通用", featureName: "五行平衡度", conditionOperator: ">=", conditionValue: "0.85", score: 10, interpretation: "五行极为平衡，金木水火土各元素协调共存，空间气场极佳，有助于全方位提升运势", category: "五行" },
  { roomType: "通用", featureName: "五行平衡度", conditionOperator: "between", conditionValue: "0.75-0.85", score: 8, interpretation: "五行较为平衡，空间气场良好", category: "五行" },
  { roomType: "通用", featureName: "五行平衡度", conditionOperator: "between", conditionValue: "0.65-0.75", score: 5, interpretation: "五行有一定偏差，某些元素可能过多或不足，建议适当调整", category: "五行" },
  { roomType: "通用", featureName: "五行平衡度", conditionOperator: "<", conditionValue: "0.65", score: 2, interpretation: "五行严重失衡，空间气场混乱，建议全面调整装饰和色彩搭配", category: "五行" },

  // ==================== 八卦方位分析 ====================
  // 乾位（西北）- 男主人运
  { roomType: "客厅", featureName: "乾位能量", conditionOperator: ">=", conditionValue: "0.80", score: 9, interpretation: "乾位（西北方）能量充沛，古称'天门吉位'，有利于男主人的事业发展和权威提升", category: "方位" },
  { roomType: "客厅", featureName: "乾位能量", conditionOperator: "between", conditionValue: "0.65-0.80", score: 6, interpretation: "乾位能量适中，男主人运势正常", category: "方位" },
  { roomType: "客厅", featureName: "乾位能量", conditionOperator: "<", conditionValue: "0.65", score: 2, interpretation: "乾位能量不足，可能影响男主人的事业运，建议在西北方摆放金属饰品或水晶球", category: "方位" },

  // 坤位（西南）- 女主人运
  { roomType: "客厅", featureName: "坤位能量", conditionOperator: ">=", conditionValue: "0.80", score: 9, interpretation: "坤位（西南方）能量充沛，古称'地母吉位'，有利于女主人的健康和家庭和谐", category: "方位" },
  { roomType: "客厅", featureName: "坤位能量", conditionOperator: "between", conditionValue: "0.65-0.80", score: 6, interpretation: "坤位能量适中，女主人运势正常", category: "方位" },
  { roomType: "客厅", featureName: "坤位能量", conditionOperator: "<", conditionValue: "0.65", score: 2, interpretation: "坤位能量不足，可能影响女主人的健康，建议在西南方摆放陶瓷花瓶或黄色装饰", category: "方位" },

  // 震位（正东）- 健康运
  { roomType: "通用", featureName: "震位能量", conditionOperator: ">=", conditionValue: "0.80", score: 8, interpretation: "震位（正东方）能量充沛，古称'青龙吉位'，有利于家人的身体健康和长寿", category: "方位" },
  { roomType: "通用", featureName: "震位能量", conditionOperator: "between", conditionValue: "0.65-0.80", score: 6, interpretation: "震位能量适中，健康运正常", category: "方位" },
  { roomType: "通用", featureName: "震位能量", conditionOperator: "<", conditionValue: "0.65", score: 2, interpretation: "震位能量不足，可能影响健康，建议在正东方摆放绿色植物", category: "方位" },

  // 巽位（东南）- 财运
  { roomType: "通用", featureName: "巽位能量", conditionOperator: ">=", conditionValue: "0.80", score: 9, interpretation: "巽位（东南方）能量充沛，古称'财门吉位'，有利于财运亨通，偏财运极佳", category: "方位" },
  { roomType: "通用", featureName: "巽位能量", conditionOperator: "between", conditionValue: "0.65-0.80", score: 6, interpretation: "巽位能量适中，财运正常", category: "方位" },
  { roomType: "通用", featureName: "巽位能量", conditionOperator: "<", conditionValue: "0.65", score: 2, interpretation: "巽位能量不足，可能影响财运，建议在东南方摆放发财树或流水摆件", category: "方位" },

  // 离位（正南）- 名声运
  { roomType: "通用", featureName: "离位能量", conditionOperator: ">=", conditionValue: "0.80", score: 8, interpretation: "离位（正南方）能量充沛，古称'朱雀吉位'，有利于名声和社会地位的提升", category: "方位" },
  { roomType: "通用", featureName: "离位能量", conditionOperator: "between", conditionValue: "0.65-0.80", score: 6, interpretation: "离位能量适中，名声运正常", category: "方位" },
  { roomType: "通用", featureName: "离位能量", conditionOperator: "<", conditionValue: "0.65", score: 2, interpretation: "离位能量不足，建议在正南方增加照明或摆放红色装饰品", category: "方位" },

  // 坎位（正北）- 事业运
  { roomType: "通用", featureName: "坎位能量", conditionOperator: ">=", conditionValue: "0.80", score: 8, interpretation: "坎位（正北方）能量充沛，古称'玄武吉位'，有利于事业稳定发展", category: "方位" },
  { roomType: "通用", featureName: "坎位能量", conditionOperator: "between", conditionValue: "0.65-0.80", score: 6, interpretation: "坎位能量适中，事业运正常", category: "方位" },
  { roomType: "通用", featureName: "坎位能量", conditionOperator: "<", conditionValue: "0.65", score: 2, interpretation: "坎位能量不足，建议在正北方摆放水景或黑色装饰品", category: "方位" },

  // 艮位（东北）- 学业运
  { roomType: "书房", featureName: "艮位能量", conditionOperator: ">=", conditionValue: "0.80", score: 9, interpretation: "艮位（东北方）能量充沛，古称'文昌吉位'，有利于学业进步和考试成功", category: "方位" },
  { roomType: "书房", featureName: "艮位能量", conditionOperator: "between", conditionValue: "0.65-0.80", score: 6, interpretation: "艮位能量适中，学业运正常", category: "方位" },
  { roomType: "书房", featureName: "艮位能量", conditionOperator: "<", conditionValue: "0.65", score: 2, interpretation: "艮位能量不足，建议在东北方摆放文昌塔或书籍", category: "方位" },

  // 兑位（正西）- 子女运
  { roomType: "通用", featureName: "兑位能量", conditionOperator: ">=", conditionValue: "0.80", score: 8, interpretation: "兑位（正西方）能量充沛，有利于子女的健康成长和学业发展", category: "方位" },
  { roomType: "通用", featureName: "兑位能量", conditionOperator: "between", conditionValue: "0.65-0.80", score: 6, interpretation: "兑位能量适中，子女运正常", category: "方位" },
  { roomType: "通用", featureName: "兑位能量", conditionOperator: "<", conditionValue: "0.65", score: 2, interpretation: "兑位能量不足，建议在正西方摆放金属风铃或白色装饰", category: "方位" },

  // ==================== 煞气识别与化解 ====================
  // 尖角煞
  { roomType: "通用", featureName: "尖角煞指数", conditionOperator: ">=", conditionValue: "0.80", score: -5, interpretation: "检测到严重的尖角煞，空间中有明显的尖锐角落或柱子直冲，古称'飞刃煞'，可能影响健康和人际关系。化解方法：在尖角处摆放圆叶绿植或用圆弧形家具遮挡", category: "煞气" },
  { roomType: "通用", featureName: "尖角煞指数", conditionOperator: "between", conditionValue: "0.60-0.80", score: -3, interpretation: "检测到中度尖角煞，空间中有一些尖锐角落。化解方法：在尖角处挂上水晶球或摆放盆栽", category: "煞气" },
  { roomType: "通用", featureName: "尖角煞指数", conditionOperator: "between", conditionValue: "0.40-0.60", score: -1, interpretation: "检测到轻微尖角煞，影响不大，可适当用软装遮挡", category: "煞气" },
  { roomType: "通用", featureName: "尖角煞指数", conditionOperator: "<", conditionValue: "0.40", score: 8, interpretation: "空间中几乎没有尖角煞，布局圆润和谐，气场流通顺畅", category: "煞气" },

  // 穿堂煞
  { roomType: "客厅", featureName: "穿堂煞指数", conditionOperator: ">=", conditionValue: "0.75", score: -5, interpretation: "检测到严重的穿堂煞，大门与阳台或后门直线相对，古称'一箭穿心'，财气直泄。化解方法：在中间设置屏风或玄关柜", category: "煞气" },
  { roomType: "客厅", featureName: "穿堂煞指数", conditionOperator: "between", conditionValue: "0.50-0.75", score: -3, interpretation: "检测到中度穿堂煞，气流过于直通。化解方法：摆放大型绿植或装饰柜来阻断直线气流", category: "煞气" },
  { roomType: "客厅", featureName: "穿堂煞指数", conditionOperator: "<", conditionValue: "0.50", score: 7, interpretation: "穿堂煞不明显，空间气流回旋有情，有利于聚财", category: "煞气" },

  // 梁压煞
  { roomType: "卧室", featureName: "梁压煞指数", conditionOperator: ">=", conditionValue: "0.75", score: -5, interpretation: "检测到严重的梁压煞，横梁直压床头，古称'横梁压顶'，可能导致头痛、失眠、压力大。化解方法：移动床位避开横梁，或安装天花板遮挡", category: "煞气" },
  { roomType: "卧室", featureName: "梁压煞指数", conditionOperator: "between", conditionValue: "0.50-0.75", score: -3, interpretation: "检测到中度梁压煞，横梁在床的上方但不直压床头。化解方法：在梁下悬挂葫芦或安装假天花", category: "煞气" },
  { roomType: "卧室", featureName: "梁压煞指数", conditionOperator: "<", conditionValue: "0.50", score: 7, interpretation: "卧室没有明显的梁压煞，天花板平整，睡眠环境良好", category: "煞气" },

  // 镜面煞
  { roomType: "卧室", featureName: "镜面煞指数", conditionOperator: ">=", conditionValue: "0.70", score: -4, interpretation: "检测到镜面煞，卧室中有大面积镜子对着床，古称'镜照床则神不安'，可能导致失眠多梦。化解方法：移走镜子或用布帘遮挡", category: "煞气" },
  { roomType: "卧室", featureName: "镜面煞指数", conditionOperator: "between", conditionValue: "0.40-0.70", score: -2, interpretation: "检测到轻度镜面煞，卧室中有镜子但不直对床。建议将镜子移至不对床的位置", category: "煞气" },
  { roomType: "卧室", featureName: "镜面煞指数", conditionOperator: "<", conditionValue: "0.40", score: 7, interpretation: "卧室没有镜面煞，环境安宁，有利于睡眠", category: "煞气" },

  // 门冲煞
  { roomType: "通用", featureName: "门冲煞指数", conditionOperator: ">=", conditionValue: "0.75", score: -4, interpretation: "检测到门冲煞，两扇门直接相对，古称'门对门则口舌多'，可能导致家庭不和。化解方法：在门上挂五帝钱或在门间放置屏风", category: "煞气" },
  { roomType: "通用", featureName: "门冲煞指数", conditionOperator: "between", conditionValue: "0.50-0.75", score: -2, interpretation: "检测到轻度门冲煞，两扇门有一定角度相对。建议在门间摆放绿植化解", category: "煞气" },
  { roomType: "通用", featureName: "门冲煞指数", conditionOperator: "<", conditionValue: "0.50", score: 7, interpretation: "没有明显的门冲煞，门的布局合理", category: "煞气" },

  // ==================== 客厅专项 ====================
  // 沙发靠墙
  { roomType: "客厅", featureName: "沙发靠墙度", conditionOperator: ">=", conditionValue: "0.80", score: 9, interpretation: "沙发背后有实墙依靠，古称'背有靠山'，主人在事业和生活中有贵人相助，做事有底气", category: "布局" },
  { roomType: "客厅", featureName: "沙发靠墙度", conditionOperator: "between", conditionValue: "0.60-0.80", score: 6, interpretation: "沙发基本靠墙，但可能有一定间距，建议尽量贴墙摆放", category: "布局" },
  { roomType: "客厅", featureName: "沙发靠墙度", conditionOperator: "<", conditionValue: "0.60", score: 2, interpretation: "沙发没有靠墙，古称'背无靠山'，做事可能缺乏支持。建议将沙发移至靠墙位置", category: "布局" },

  // 电视位置
  { roomType: "客厅", featureName: "电视墙和谐度", conditionOperator: ">=", conditionValue: "0.80", score: 8, interpretation: "电视墙布局和谐，与沙发形成良好的对话关系，有利于家庭和谐", category: "布局" },
  { roomType: "客厅", featureName: "电视墙和谐度", conditionOperator: "between", conditionValue: "0.60-0.80", score: 5, interpretation: "电视墙布局一般，建议适当调整", category: "布局" },
  { roomType: "客厅", featureName: "电视墙和谐度", conditionOperator: "<", conditionValue: "0.60", score: 2, interpretation: "电视墙布局不太合理，建议重新规划", category: "布局" },

  // 客厅采光
  { roomType: "客厅", featureName: "自然采光度", conditionOperator: ">=", conditionValue: "0.80", score: 9, interpretation: "客厅采光极好，阳光充足，古称'明堂光亮'，有利于聚集正能量，提升全家运势", category: "环境" },
  { roomType: "客厅", featureName: "自然采光度", conditionOperator: "between", conditionValue: "0.65-0.80", score: 7, interpretation: "客厅采光良好，光线充足", category: "环境" },
  { roomType: "客厅", featureName: "自然采光度", conditionOperator: "between", conditionValue: "0.50-0.65", score: 4, interpretation: "客厅采光一般，建议增加照明或使用浅色窗帘", category: "环境" },
  { roomType: "客厅", featureName: "自然采光度", conditionOperator: "<", conditionValue: "0.50", score: 1, interpretation: "客厅采光不足，古称'明堂暗淡'，可能影响家运。建议增加灯光，使用明亮色调装饰", category: "环境" },

  // ==================== 卧室专项 ====================
  // 床头朝向
  { roomType: "卧室", featureName: "床头朝向吉度", conditionOperator: ">=", conditionValue: "0.80", score: 9, interpretation: "床头朝向吉位，有利于睡眠质量和身体健康。古相学认为床头宜朝北或朝东", category: "布局" },
  { roomType: "卧室", featureName: "床头朝向吉度", conditionOperator: "between", conditionValue: "0.60-0.80", score: 6, interpretation: "床头朝向中性，睡眠运正常", category: "布局" },
  { roomType: "卧室", featureName: "床头朝向吉度", conditionOperator: "<", conditionValue: "0.60", score: 2, interpretation: "床头朝向不太理想，可能影响睡眠质量。建议调整床头朝北或朝东", category: "布局" },

  // 卧室大小
  { roomType: "卧室", featureName: "空间大小适宜度", conditionOperator: "between", conditionValue: "0.70-0.85", score: 9, interpretation: "卧室大小适中，古称'房不宜大，大则气散；不宜小，小则气滞'，当前空间恰到好处", category: "布局" },
  { roomType: "卧室", featureName: "空间大小适宜度", conditionOperator: ">=", conditionValue: "0.85", score: 5, interpretation: "卧室偏大，气场可能不够聚集，建议用家具和装饰适当分隔空间", category: "布局" },
  { roomType: "卧室", featureName: "空间大小适宜度", conditionOperator: "<", conditionValue: "0.70", score: 4, interpretation: "卧室偏小，气场可能不够流通，建议保持整洁，减少杂物", category: "布局" },

  // 卧室色调
  { roomType: "卧室", featureName: "色调温暖度", conditionOperator: "between", conditionValue: "0.60-0.80", score: 9, interpretation: "卧室色调温暖柔和，有利于放松身心，提升睡眠质量。古相学认为卧室宜用暖色调", category: "色彩" },
  { roomType: "卧室", featureName: "色调温暖度", conditionOperator: ">=", conditionValue: "0.80", score: 5, interpretation: "卧室色调过于热烈，可能导致心神不宁，建议适当加入冷色调元素", category: "色彩" },
  { roomType: "卧室", featureName: "色调温暖度", conditionOperator: "<", conditionValue: "0.60", score: 4, interpretation: "卧室色调偏冷，可能影响睡眠和感情运，建议增加暖色调装饰", category: "色彩" },

  // ==================== 厨房专项 ====================
  // 灶台位置
  { roomType: "厨房", featureName: "灶台位置吉度", conditionOperator: ">=", conditionValue: "0.80", score: 9, interpretation: "灶台位置极佳，古称'灶居吉位则财旺'，有利于家庭财运和健康", category: "布局" },
  { roomType: "厨房", featureName: "灶台位置吉度", conditionOperator: "between", conditionValue: "0.60-0.80", score: 6, interpretation: "灶台位置尚可，财运正常", category: "布局" },
  { roomType: "厨房", featureName: "灶台位置吉度", conditionOperator: "<", conditionValue: "0.60", score: 2, interpretation: "灶台位置不太理想，可能影响财运和健康。古相学认为灶台不宜正对门口或水槽", category: "布局" },

  // 水火相冲
  { roomType: "厨房", featureName: "水火相冲指数", conditionOperator: ">=", conditionValue: "0.75", score: -4, interpretation: "检测到水火相冲，灶台与水槽距离过近或直接相对，古称'水火不容'，可能影响家庭和谐。化解方法：在水火之间放置木质隔板", category: "煞气" },
  { roomType: "厨房", featureName: "水火相冲指数", conditionOperator: "between", conditionValue: "0.50-0.75", score: -2, interpretation: "轻度水火相冲，灶台与水槽距离偏近。建议适当拉开距离", category: "煞气" },
  { roomType: "厨房", featureName: "水火相冲指数", conditionOperator: "<", conditionValue: "0.50", score: 8, interpretation: "厨房水火布局合理，灶台与水槽保持适当距离，有利于家庭和谐", category: "布局" },

  // 厨房整洁度
  { roomType: "厨房", featureName: "整洁度", conditionOperator: ">=", conditionValue: "0.80", score: 9, interpretation: "厨房非常整洁，古称'灶台洁净则财运旺'，有利于家庭健康和财运", category: "环境" },
  { roomType: "厨房", featureName: "整洁度", conditionOperator: "between", conditionValue: "0.60-0.80", score: 6, interpretation: "厨房整洁度一般，建议保持干净整洁", category: "环境" },
  { roomType: "厨房", featureName: "整洁度", conditionOperator: "<", conditionValue: "0.60", score: 1, interpretation: "厨房较为杂乱，古相学认为'灶台不洁则财运受损'，建议及时清理", category: "环境" },

  // ==================== 书房专项 ====================
  // 书桌朝向
  { roomType: "书房", featureName: "书桌朝向吉度", conditionOperator: ">=", conditionValue: "0.80", score: 9, interpretation: "书桌朝向文昌位，古称'面壁读书不如面窗'，有利于学业和事业发展", category: "布局" },
  { roomType: "书房", featureName: "书桌朝向吉度", conditionOperator: "between", conditionValue: "0.60-0.80", score: 6, interpretation: "书桌朝向尚可，学业运正常", category: "布局" },
  { roomType: "书房", featureName: "书桌朝向吉度", conditionOperator: "<", conditionValue: "0.60", score: 2, interpretation: "书桌朝向不太理想，建议调整朝向东方或东南方", category: "布局" },

  // 书房安静度
  { roomType: "书房", featureName: "安静度", conditionOperator: ">=", conditionValue: "0.80", score: 8, interpretation: "书房环境安静，有利于专注学习和思考", category: "环境" },
  { roomType: "书房", featureName: "安静度", conditionOperator: "between", conditionValue: "0.60-0.80", score: 5, interpretation: "书房环境一般，建议增加隔音措施", category: "环境" },
  { roomType: "书房", featureName: "安静度", conditionOperator: "<", conditionValue: "0.60", score: 2, interpretation: "书房环境较吵，不利于学习和工作，建议改善隔音", category: "环境" },

  // ==================== 卫生间专项 ====================
  // 卫生间位置
  { roomType: "卫生间", featureName: "位置吉度", conditionOperator: ">=", conditionValue: "0.80", score: 8, interpretation: "卫生间位置合理，不在房屋中心或财位上，对家运影响较小", category: "布局" },
  { roomType: "卫生间", featureName: "位置吉度", conditionOperator: "between", conditionValue: "0.60-0.80", score: 5, interpretation: "卫生间位置尚可，建议保持通风和干燥", category: "布局" },
  { roomType: "卫生间", featureName: "位置吉度", conditionOperator: "<", conditionValue: "0.60", score: 0, interpretation: "卫生间位置不太理想，古相学认为卫生间不宜在房屋中心。化解方法：保持门常关，增加通风和绿植", category: "布局" },

  // 卫生间通风
  { roomType: "卫生间", featureName: "通风度", conditionOperator: ">=", conditionValue: "0.80", score: 8, interpretation: "卫生间通风极好，湿气不易积聚，有利于家庭健康", category: "环境" },
  { roomType: "卫生间", featureName: "通风度", conditionOperator: "between", conditionValue: "0.60-0.80", score: 5, interpretation: "卫生间通风一般，建议安装排风扇", category: "环境" },
  { roomType: "卫生间", featureName: "通风度", conditionOperator: "<", conditionValue: "0.60", score: 1, interpretation: "卫生间通风不足，湿气重，古相学认为'湿气重则阴气盛'，建议改善通风", category: "环境" },

  // ==================== 阳台专项 ====================
  // 阳台朝向
  { roomType: "阳台", featureName: "朝向吉度", conditionOperator: ">=", conditionValue: "0.80", score: 9, interpretation: "阳台朝向极佳（南向或东南向），阳光充足，古称'明堂开阔'，有利于聚集正能量", category: "方位" },
  { roomType: "阳台", featureName: "朝向吉度", conditionOperator: "between", conditionValue: "0.60-0.80", score: 6, interpretation: "阳台朝向尚可，采光正常", category: "方位" },
  { roomType: "阳台", featureName: "朝向吉度", conditionOperator: "<", conditionValue: "0.60", score: 2, interpretation: "阳台朝向不太理想，采光不足，建议增加人工照明和绿植", category: "方位" },

  // 阳台视野
  { roomType: "阳台", featureName: "视野开阔度", conditionOperator: ">=", conditionValue: "0.80", score: 9, interpretation: "阳台视野开阔，古称'明堂宽广则财运旺'，有利于事业发展和财运提升", category: "环境" },
  { roomType: "阳台", featureName: "视野开阔度", conditionOperator: "between", conditionValue: "0.60-0.80", score: 6, interpretation: "阳台视野一般", category: "环境" },
  { roomType: "阳台", featureName: "视野开阔度", conditionOperator: "<", conditionValue: "0.60", score: 2, interpretation: "阳台视野受阻，古称'明堂逼仄'，建议在阳台摆放小型水景或镜面装饰来扩展视觉空间", category: "环境" },

  // ==================== 整体环境 ====================
  // 空气流通度
  { roomType: "通用", featureName: "空气流通度", conditionOperator: ">=", conditionValue: "0.80", score: 9, interpretation: "空间空气流通极好，古称'藏风聚气'，气场流动顺畅，有利于健康和运势", category: "环境" },
  { roomType: "通用", featureName: "空气流通度", conditionOperator: "between", conditionValue: "0.65-0.80", score: 6, interpretation: "空气流通度尚可", category: "环境" },
  { roomType: "通用", featureName: "空气流通度", conditionOperator: "<", conditionValue: "0.65", score: 2, interpretation: "空气流通不足，古称'气滞则运滞'，建议改善通风条件", category: "环境" },

  // 整洁有序度
  { roomType: "通用", featureName: "整洁有序度", conditionOperator: ">=", conditionValue: "0.85", score: 9, interpretation: "空间极为整洁有序，古称'净则生财'，整洁的环境有利于聚集正能量，提升全方位运势", category: "环境" },
  { roomType: "通用", featureName: "整洁有序度", conditionOperator: "between", conditionValue: "0.70-0.85", score: 7, interpretation: "空间较为整洁，环境不错", category: "环境" },
  { roomType: "通用", featureName: "整洁有序度", conditionOperator: "between", conditionValue: "0.55-0.70", score: 4, interpretation: "空间整洁度一般，建议定期整理", category: "环境" },
  { roomType: "通用", featureName: "整洁有序度", conditionOperator: "<", conditionValue: "0.55", score: 0, interpretation: "空间较为杂乱，古相学认为'乱则气散'，建议全面整理，断舍离不需要的物品", category: "环境" },

  // 色彩和谐度
  { roomType: "通用", featureName: "色彩和谐度", conditionOperator: ">=", conditionValue: "0.80", score: 9, interpretation: "空间色彩搭配极为和谐，五行色彩平衡，有利于身心健康和运势提升", category: "色彩" },
  { roomType: "通用", featureName: "色彩和谐度", conditionOperator: "between", conditionValue: "0.65-0.80", score: 6, interpretation: "色彩搭配较为和谐", category: "色彩" },
  { roomType: "通用", featureName: "色彩和谐度", conditionOperator: "<", conditionValue: "0.65", score: 2, interpretation: "色彩搭配不太和谐，建议参考五行色彩理论重新搭配", category: "色彩" },

  // 光影平衡度
  { roomType: "通用", featureName: "光影平衡度", conditionOperator: ">=", conditionValue: "0.80", score: 8, interpretation: "光影分布均匀和谐，古称'阴阳调和'，空间气场平衡", category: "环境" },
  { roomType: "通用", featureName: "光影平衡度", conditionOperator: "between", conditionValue: "0.65-0.80", score: 6, interpretation: "光影分布较为均匀", category: "环境" },
  { roomType: "通用", featureName: "光影平衡度", conditionOperator: "<", conditionValue: "0.65", score: 2, interpretation: "光影分布不均匀，部分区域过暗或过亮，建议调整照明", category: "环境" },

  // 空间比例
  { roomType: "通用", featureName: "空间比例和谐度", conditionOperator: ">=", conditionValue: "0.80", score: 8, interpretation: "空间比例和谐，家具大小与房间比例适当，古称'大小得宜'", category: "布局" },
  { roomType: "通用", featureName: "空间比例和谐度", conditionOperator: "between", conditionValue: "0.65-0.80", score: 6, interpretation: "空间比例较为合理", category: "布局" },
  { roomType: "通用", featureName: "空间比例和谐度", conditionOperator: "<", conditionValue: "0.65", score: 2, interpretation: "空间比例不太协调，家具可能过大或过小，建议调整", category: "布局" },

  // ==================== 装饰品风水 ====================
  // 植物生机度
  { roomType: "通用", featureName: "植物生机度", conditionOperator: ">=", conditionValue: "0.80", score: 9, interpretation: "空间中植物生机勃勃，古称'草木茂盛则生气旺'，有利于健康和财运", category: "装饰" },
  { roomType: "通用", featureName: "植物生机度", conditionOperator: "between", conditionValue: "0.60-0.80", score: 6, interpretation: "植物状态一般，建议加强养护", category: "装饰" },
  { roomType: "通用", featureName: "植物生机度", conditionOperator: "<", conditionValue: "0.60", score: 1, interpretation: "植物枯萎或没有植物，古相学认为'枯木则气衰'，建议更换或添加新的绿植", category: "装饰" },

  // 吉祥物摆放
  { roomType: "通用", featureName: "吉祥物摆放合理度", conditionOperator: ">=", conditionValue: "0.80", score: 8, interpretation: "吉祥物摆放位置合理，能有效发挥风水作用", category: "装饰" },
  { roomType: "通用", featureName: "吉祥物摆放合理度", conditionOperator: "between", conditionValue: "0.60-0.80", score: 5, interpretation: "吉祥物摆放位置尚可", category: "装饰" },
  { roomType: "通用", featureName: "吉祥物摆放合理度", conditionOperator: "<", conditionValue: "0.60", score: 1, interpretation: "吉祥物摆放位置不太合理，建议参考风水方位重新摆放", category: "装饰" },
];
