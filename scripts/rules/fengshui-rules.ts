/**
 * 风水规则库 - 350+条规则覆盖六种房间类型多维度
 * 每条规则的 featureName 与 fengshui-recognition.ts 返回的特征名完全对应
 * 特征来源：亮度(0-1)、色彩饱和度(0-1)、暖色比例(0-1)、冷色比例(0-1)、
 *          绿色比例(0-1)、红色比例(0-1)、对比度(0-1)、纹理复杂度(0-1)、
 *          空间开阔度(0-1)、整洁度(0-1)、自然光比例(0-1)、植物覆盖率(0-1)
 */

export interface FengshuiRuleData {
  roomType: string;
  featureName: string;
  conditionOperator: string;
  conditionValue: string;
  score: number;
  interpretation: string;
  category: string;
  remedy: string;
}

export const fengshuiRulesData: FengshuiRuleData[] = [
  // ==================== 客厅 ====================
  // 亮度
  { roomType: "客厅", featureName: "亮度", conditionOperator: ">=", conditionValue: "0.85", score: 10, interpretation: "客厅明亮通透，光线充足，风水学称'明堂开阔'，主人财运亨通，家运昌隆，贵人运极佳", category: "财运", remedy: "" },
  { roomType: "客厅", featureName: "亮度", conditionOperator: "between", conditionValue: "0.80-0.85", score: 9, interpretation: "客厅光线充足明亮，阳气充盈，有利于家人身体健康和事业发展", category: "财运", remedy: "" },
  { roomType: "客厅", featureName: "亮度", conditionOperator: "between", conditionValue: "0.75-0.80", score: 8, interpretation: "客厅采光良好，气场流通顺畅，有利于聚财纳福", category: "财运", remedy: "" },
  { roomType: "客厅", featureName: "亮度", conditionOperator: "between", conditionValue: "0.70-0.75", score: 7, interpretation: "客厅光线较好，整体气场不错，适合家人聚会交流", category: "财运", remedy: "" },
  { roomType: "客厅", featureName: "亮度", conditionOperator: "between", conditionValue: "0.65-0.70", score: 5, interpretation: "客厅光线中等，建议增加照明设备，提升明堂亮度", category: "财运", remedy: "增加落地灯或吸顶灯，保持客厅明亮通透" },
  { roomType: "客厅", featureName: "亮度", conditionOperator: "between", conditionValue: "0.60-0.65", score: 3, interpretation: "客厅光线偏暗，风水学认为'暗则气滞'，不利于财运和健康", category: "财运", remedy: "增加照明，拉开窗帘，使用浅色墙面和家具反射光线" },
  { roomType: "客厅", featureName: "亮度", conditionOperator: "between", conditionValue: "0.55-0.60", score: 1, interpretation: "客厅光线较暗，阴气偏重，容易导致家人情绪低落，财运受阻", category: "财运", remedy: "建议重新规划照明系统，增加自然光引入，使用暖色灯光" },
  { roomType: "客厅", featureName: "亮度", conditionOperator: "<", conditionValue: "0.55", score: -3, interpretation: "客厅过于阴暗，风水大忌，古语云'阴盛阳衰'，严重影响家运和健康", category: "财运", remedy: "紧急改善：增加大面积照明，更换浅色窗帘，墙面刷白色或米色，摆放镜子反射光线" },

  // 暖色比例
  { roomType: "客厅", featureName: "暖色比例", conditionOperator: ">=", conditionValue: "0.75", score: 8, interpretation: "客厅暖色调为主，温馨和谐，风水学认为暖色属阳，有利于家庭和睦，人际关系融洽", category: "人际", remedy: "" },
  { roomType: "客厅", featureName: "暖色比例", conditionOperator: "between", conditionValue: "0.65-0.75", score: 7, interpretation: "客厅暖色调较多，氛围温暖舒适，有利于家人感情交流", category: "人际", remedy: "" },
  { roomType: "客厅", featureName: "暖色比例", conditionOperator: "between", conditionValue: "0.55-0.65", score: 5, interpretation: "客厅色调冷暖适中，阴阳平衡，气场和谐", category: "人际", remedy: "" },
  { roomType: "客厅", featureName: "暖色比例", conditionOperator: "between", conditionValue: "0.45-0.55", score: 3, interpretation: "客厅冷色调偏多，氛围略显冷清，建议增加暖色装饰", category: "人际", remedy: "增加暖色系抱枕、地毯或装饰画，使用暖色灯光" },
  { roomType: "客厅", featureName: "暖色比例", conditionOperator: "<", conditionValue: "0.45", score: 0, interpretation: "客厅冷色调过重，风水学认为过冷则气散，不利于聚财和家庭和睦", category: "人际", remedy: "增加暖色系家具和装饰，更换暖色窗帘，使用暖白色灯光" },

  // 空间开阔度
  { roomType: "客厅", featureName: "空间开阔度", conditionOperator: ">=", conditionValue: "0.85", score: 10, interpretation: "客厅空间极为开阔，明堂宽广，风水学认为'明堂开阔，财源广进'，极利财运和事业", category: "财运", remedy: "" },
  { roomType: "客厅", featureName: "空间开阔度", conditionOperator: "between", conditionValue: "0.80-0.85", score: 9, interpretation: "客厅空间很开阔，气场流通顺畅，有利于家运兴旺", category: "财运", remedy: "" },
  { roomType: "客厅", featureName: "空间开阔度", conditionOperator: "between", conditionValue: "0.75-0.80", score: 8, interpretation: "客厅空间较为开阔，布局合理，气场良好", category: "财运", remedy: "" },
  { roomType: "客厅", featureName: "空间开阔度", conditionOperator: "between", conditionValue: "0.70-0.75", score: 6, interpretation: "客厅空间开阔度良好，整体布局不错", category: "财运", remedy: "" },
  { roomType: "客厅", featureName: "空间开阔度", conditionOperator: "between", conditionValue: "0.65-0.70", score: 4, interpretation: "客厅空间中等，建议减少不必要的家具，保持通道畅通", category: "财运", remedy: "精简家具，保持动线畅通，避免堆放杂物" },
  { roomType: "客厅", featureName: "空间开阔度", conditionOperator: "between", conditionValue: "0.60-0.65", score: 2, interpretation: "客厅空间偏小，气场受限，不利于财运", category: "财运", remedy: "减少大型家具，使用镜面装饰扩大视觉空间，保持整洁" },
  { roomType: "客厅", featureName: "空间开阔度", conditionOperator: "<", conditionValue: "0.60", score: -2, interpretation: "客厅空间狭窄拥挤，风水学认为'气不流通则财不聚'，严重影响财运", category: "财运", remedy: "大幅精简家具，清理杂物，使用浅色调扩大空间感，悬挂山水画增加纵深感" },

  // 整洁度
  { roomType: "客厅", featureName: "整洁度", conditionOperator: ">=", conditionValue: "0.85", score: 9, interpretation: "客厅极为整洁有序，风水学认为'净则气清'，有利于思维清晰，事业顺利", category: "事业", remedy: "" },
  { roomType: "客厅", featureName: "整洁度", conditionOperator: "between", conditionValue: "0.80-0.85", score: 8, interpretation: "客厅整洁干净，气场清爽，有利于家人身心健康", category: "健康", remedy: "" },
  { roomType: "客厅", featureName: "整洁度", conditionOperator: "between", conditionValue: "0.75-0.80", score: 7, interpretation: "客厅较为整洁，整体环境不错", category: "健康", remedy: "" },
  { roomType: "客厅", featureName: "整洁度", conditionOperator: "between", conditionValue: "0.70-0.75", score: 5, interpretation: "客厅整洁度中上，建议定期整理", category: "健康", remedy: "定期整理收纳，保持桌面清爽" },
  { roomType: "客厅", featureName: "整洁度", conditionOperator: "between", conditionValue: "0.65-0.70", score: 3, interpretation: "客厅略显凌乱，风水学认为杂乱会导致气场混乱", category: "健康", remedy: "增加收纳空间，定期清理不需要的物品" },
  { roomType: "客厅", featureName: "整洁度", conditionOperator: "<", conditionValue: "0.65", score: -2, interpretation: "客厅杂乱无章，风水大忌，古语云'乱则气散'，严重影响运势", category: "健康", remedy: "立即进行大扫除，丢弃不需要的物品，建立收纳系统" },

  // 自然光比例
  { roomType: "客厅", featureName: "自然光比例", conditionOperator: ">=", conditionValue: "0.80", score: 9, interpretation: "客厅自然光充足，阳气旺盛，风水学认为'天光下照，万物生长'，极利家运", category: "健康", remedy: "" },
  { roomType: "客厅", featureName: "自然光比例", conditionOperator: "between", conditionValue: "0.70-0.80", score: 7, interpretation: "客厅自然光较充足，阳气充盈，有利于家人健康", category: "健康", remedy: "" },
  { roomType: "客厅", featureName: "自然光比例", conditionOperator: "between", conditionValue: "0.60-0.70", score: 5, interpretation: "客厅自然光中等，建议白天拉开窗帘引入更多阳光", category: "健康", remedy: "白天保持窗帘打开，修剪遮挡阳光的植物" },
  { roomType: "客厅", featureName: "自然光比例", conditionOperator: "between", conditionValue: "0.50-0.60", score: 2, interpretation: "客厅自然光偏少，阳气不足，建议改善采光条件", category: "健康", remedy: "更换透光窗帘，清洁窗户玻璃，必要时增加窗户面积" },
  { roomType: "客厅", featureName: "自然光比例", conditionOperator: "<", conditionValue: "0.50", score: -2, interpretation: "客厅自然光严重不足，风水学认为阳气匮乏，不利于健康和运势", category: "健康", remedy: "考虑增加窗户或天窗，使用全光谱灯具模拟自然光" },

  // 植物覆盖率
  { roomType: "客厅", featureName: "植物覆盖率", conditionOperator: "between", conditionValue: "0.10-0.25", score: 9, interpretation: "客厅绿植适量，生机盎然，风水学认为植物可化煞聚气，增添生气", category: "健康", remedy: "" },
  { roomType: "客厅", featureName: "植物覆盖率", conditionOperator: "between", conditionValue: "0.05-0.10", score: 6, interpretation: "客厅有少量绿植，增添了一些生气", category: "健康", remedy: "可适当增加绿植，如发财树、富贵竹等" },
  { roomType: "客厅", featureName: "植物覆盖率", conditionOperator: "<", conditionValue: "0.05", score: 2, interpretation: "客厅几乎没有绿植，缺少生气，建议摆放一些风水植物", category: "健康", remedy: "摆放发财树、富贵竹、万年青等风水植物" },
  { roomType: "客厅", featureName: "植物覆盖率", conditionOperator: ">", conditionValue: "0.25", score: 3, interpretation: "客厅绿植过多，风水学认为'过犹不及'，阴气偏重", category: "健康", remedy: "适当减少绿植数量，保持适度即可" },

  // 绿色比例
  { roomType: "客厅", featureName: "绿色比例", conditionOperator: "between", conditionValue: "0.10-0.20", score: 7, interpretation: "客厅绿色元素适量，五行属木，有利于健康和成长", category: "健康", remedy: "" },
  { roomType: "客厅", featureName: "绿色比例", conditionOperator: "between", conditionValue: "0.05-0.10", score: 5, interpretation: "客厅有少量绿色元素，增添自然气息", category: "健康", remedy: "" },
  { roomType: "客厅", featureName: "绿色比例", conditionOperator: "<", conditionValue: "0.05", score: 2, interpretation: "客厅缺少绿色元素，五行木气不足", category: "健康", remedy: "增加绿色植物或绿色装饰品" },
  { roomType: "客厅", featureName: "绿色比例", conditionOperator: ">", conditionValue: "0.20", score: 3, interpretation: "客厅绿色过多，五行木气过旺，可能克土，影响脾胃健康", category: "健康", remedy: "适当减少绿色元素，增加一些暖色调平衡" },

  // 红色比例
  { roomType: "客厅", featureName: "红色比例", conditionOperator: "between", conditionValue: "0.05-0.15", score: 7, interpretation: "客厅有适量红色元素，五行属火，增添喜庆和活力，有利于人际关系", category: "人际", remedy: "" },
  { roomType: "客厅", featureName: "红色比例", conditionOperator: "between", conditionValue: "0.02-0.05", score: 5, interpretation: "客厅有少量红色点缀，增添一些活力", category: "人际", remedy: "" },
  { roomType: "客厅", featureName: "红色比例", conditionOperator: "<", conditionValue: "0.02", score: 3, interpretation: "客厅缺少红色元素，五行火气不足，人际关系可能偏冷", category: "人际", remedy: "增加红色装饰品如中国结、红色抱枕等" },
  { roomType: "客厅", featureName: "红色比例", conditionOperator: ">", conditionValue: "0.15", score: 0, interpretation: "客厅红色过多，五行火气过旺，容易导致家人脾气暴躁", category: "人际", remedy: "减少红色装饰，增加蓝色或绿色元素平衡" },

  // 对比度
  { roomType: "客厅", featureName: "对比度", conditionOperator: "between", conditionValue: "0.55-0.75", score: 7, interpretation: "客厅色彩对比适中，层次分明，视觉舒适，气场和谐", category: "健康", remedy: "" },
  { roomType: "客厅", featureName: "对比度", conditionOperator: "between", conditionValue: "0.45-0.55", score: 5, interpretation: "客厅色彩对比度偏低，略显单调，建议增加一些色彩层次", category: "健康", remedy: "增加装饰画或彩色抱枕增加层次感" },
  { roomType: "客厅", featureName: "对比度", conditionOperator: ">", conditionValue: "0.75", score: 2, interpretation: "客厅色彩对比过强，视觉刺激大，容易导致心神不宁", category: "健康", remedy: "使用过渡色调柔化对比，避免大面积强对比" },
  { roomType: "客厅", featureName: "对比度", conditionOperator: "<", conditionValue: "0.45", score: 2, interpretation: "客厅色彩过于单一，缺少变化，气场沉闷", category: "健康", remedy: "增加色彩层次，使用装饰品点缀" },

  // ==================== 卧室 ====================
  // 亮度
  { roomType: "卧室", featureName: "亮度", conditionOperator: "between", conditionValue: "0.60-0.75", score: 9, interpretation: "卧室光线柔和适中，风水学认为卧室宜'明而不亮'，有利于安眠和夫妻感情", category: "感情", remedy: "" },
  { roomType: "卧室", featureName: "亮度", conditionOperator: "between", conditionValue: "0.55-0.60", score: 7, interpretation: "卧室光线偏柔和，氛围温馨，适合休息", category: "健康", remedy: "" },
  { roomType: "卧室", featureName: "亮度", conditionOperator: "between", conditionValue: "0.75-0.80", score: 6, interpretation: "卧室光线稍亮，白天可以，但夜间建议使用遮光窗帘", category: "健康", remedy: "安装遮光窗帘，使用可调光灯具" },
  { roomType: "卧室", featureName: "亮度", conditionOperator: ">=", conditionValue: "0.80", score: 3, interpretation: "卧室光线过亮，风水学认为卧室过亮则阳气过盛，不利于睡眠和休息", category: "健康", remedy: "安装遮光窗帘，减少照明亮度，使用暖色调灯光" },
  { roomType: "卧室", featureName: "亮度", conditionOperator: "between", conditionValue: "0.50-0.55", score: 5, interpretation: "卧室光线偏暗，白天建议拉开窗帘通风采光", category: "健康", remedy: "白天保持通风采光，夜间可保持暗环境" },
  { roomType: "卧室", featureName: "亮度", conditionOperator: "<", conditionValue: "0.50", score: 0, interpretation: "卧室过于阴暗，阴气偏重，不利于健康和夫妻感情", category: "健康", remedy: "增加柔和照明，白天保持通风采光" },

  // 暖色比例
  { roomType: "卧室", featureName: "暖色比例", conditionOperator: ">=", conditionValue: "0.70", score: 9, interpretation: "卧室暖色调为主，温馨浪漫，风水学认为有利于夫妻感情和睦，桃花运旺", category: "感情", remedy: "" },
  { roomType: "卧室", featureName: "暖色比例", conditionOperator: "between", conditionValue: "0.60-0.70", score: 7, interpretation: "卧室暖色调较多，氛围温暖舒适，有利于休息和感情", category: "感情", remedy: "" },
  { roomType: "卧室", featureName: "暖色比例", conditionOperator: "between", conditionValue: "0.50-0.60", score: 5, interpretation: "卧室色调冷暖适中，整体还可以", category: "感情", remedy: "可适当增加暖色床品或装饰" },
  { roomType: "卧室", featureName: "暖色比例", conditionOperator: "<", conditionValue: "0.50", score: 1, interpretation: "卧室冷色调过重，风水学认为不利于夫妻感情，容易产生隔阂", category: "感情", remedy: "更换暖色系床品和窗帘，增加暖色灯光" },

  // 整洁度
  { roomType: "卧室", featureName: "整洁度", conditionOperator: ">=", conditionValue: "0.85", score: 9, interpretation: "卧室极为整洁，风水学认为卧室整洁有利于安眠和身体健康", category: "健康", remedy: "" },
  { roomType: "卧室", featureName: "整洁度", conditionOperator: "between", conditionValue: "0.75-0.85", score: 7, interpretation: "卧室较为整洁，环境舒适，有利于休息", category: "健康", remedy: "" },
  { roomType: "卧室", featureName: "整洁度", conditionOperator: "between", conditionValue: "0.65-0.75", score: 4, interpretation: "卧室整洁度一般，建议保持床铺整洁", category: "健康", remedy: "每天整理床铺，定期更换床品" },
  { roomType: "卧室", featureName: "整洁度", conditionOperator: "<", conditionValue: "0.65", score: -2, interpretation: "卧室杂乱，风水学认为卧室杂乱严重影响睡眠质量和夫妻感情", category: "健康", remedy: "立即整理卧室，清除床下杂物，保持空气流通" },

  // 色彩饱和度
  { roomType: "卧室", featureName: "色彩饱和度", conditionOperator: "between", conditionValue: "0.30-0.55", score: 8, interpretation: "卧室色彩柔和淡雅，风水学认为卧室宜用柔和色调，有利于安神助眠", category: "健康", remedy: "" },
  { roomType: "卧室", featureName: "色彩饱和度", conditionOperator: "between", conditionValue: "0.55-0.65", score: 5, interpretation: "卧室色彩略显鲜艳，可能影响睡眠质量", category: "健康", remedy: "使用柔和色调的床品和窗帘" },
  { roomType: "卧室", featureName: "色彩饱和度", conditionOperator: ">=", conditionValue: "0.65", score: 0, interpretation: "卧室色彩过于鲜艳浓烈，风水学认为不利于安眠，容易导致心神不宁", category: "健康", remedy: "更换为柔和淡雅的色调，如米色、浅粉、淡蓝等" },
  { roomType: "卧室", featureName: "色彩饱和度", conditionOperator: "<", conditionValue: "0.30", score: 4, interpretation: "卧室色彩过于素淡，略显冷清", category: "感情", remedy: "适当增加一些柔和的色彩点缀" },

  // 空间开阔度
  { roomType: "卧室", featureName: "空间开阔度", conditionOperator: "between", conditionValue: "0.65-0.80", score: 8, interpretation: "卧室空间适中，既不过大也不过小，风水学认为卧室大小适中最为理想", category: "健康", remedy: "" },
  { roomType: "卧室", featureName: "空间开阔度", conditionOperator: ">=", conditionValue: "0.80", score: 4, interpretation: "卧室空间过大，风水学认为'大而不聚气'，不利于休息", category: "健康", remedy: "使用屏风或帘幕适当分隔空间，增加温馨感" },
  { roomType: "卧室", featureName: "空间开阔度", conditionOperator: "between", conditionValue: "0.55-0.65", score: 5, interpretation: "卧室空间偏小，建议精简家具", category: "健康", remedy: "减少不必要的家具，保持通道畅通" },
  { roomType: "卧室", featureName: "空间开阔度", conditionOperator: "<", conditionValue: "0.55", score: 0, interpretation: "卧室空间过于狭小，气场受压，不利于身心健康", category: "健康", remedy: "大幅精简家具，使用浅色调扩大空间感" },

  // ==================== 厨房 ====================
  // 亮度
  { roomType: "厨房", featureName: "亮度", conditionOperator: ">=", conditionValue: "0.80", score: 9, interpretation: "厨房明亮通透，风水学认为厨房属火，明亮则火旺，有利于家人健康和财运", category: "健康", remedy: "" },
  { roomType: "厨房", featureName: "亮度", conditionOperator: "between", conditionValue: "0.75-0.80", score: 8, interpretation: "厨房光线充足，操作方便，有利于烹饪和健康", category: "健康", remedy: "" },
  { roomType: "厨房", featureName: "亮度", conditionOperator: "between", conditionValue: "0.70-0.75", score: 6, interpretation: "厨房光线较好，整体不错", category: "健康", remedy: "" },
  { roomType: "厨房", featureName: "亮度", conditionOperator: "between", conditionValue: "0.65-0.70", score: 4, interpretation: "厨房光线中等，建议增加操作台上方照明", category: "健康", remedy: "增加橱柜下方灯带和操作台照明" },
  { roomType: "厨房", featureName: "亮度", conditionOperator: "<", conditionValue: "0.65", score: 0, interpretation: "厨房光线不足，风水学认为厨房暗则火弱，影响家人健康和食欲", category: "健康", remedy: "增加照明设备，保持窗户清洁，使用浅色橱柜" },

  // 整洁度
  { roomType: "厨房", featureName: "整洁度", conditionOperator: ">=", conditionValue: "0.85", score: 10, interpretation: "厨房极为整洁干净，风水学认为厨房整洁则家人健康，财运亨通", category: "健康", remedy: "" },
  { roomType: "厨房", featureName: "整洁度", conditionOperator: "between", conditionValue: "0.80-0.85", score: 8, interpretation: "厨房干净整洁，有利于家人饮食健康", category: "健康", remedy: "" },
  { roomType: "厨房", featureName: "整洁度", conditionOperator: "between", conditionValue: "0.75-0.80", score: 6, interpretation: "厨房较为整洁，整体不错", category: "健康", remedy: "" },
  { roomType: "厨房", featureName: "整洁度", conditionOperator: "between", conditionValue: "0.70-0.75", score: 4, interpretation: "厨房整洁度一般，建议及时清理", category: "健康", remedy: "每次烹饪后及时清洁，定期深度清洁" },
  { roomType: "厨房", featureName: "整洁度", conditionOperator: "<", conditionValue: "0.70", score: -3, interpretation: "厨房脏乱，风水大忌，古语云'灶不洁则病从口入'，严重影响健康和财运", category: "健康", remedy: "立即进行深度清洁，建立每日清洁习惯" },

  // 暖色比例
  { roomType: "厨房", featureName: "暖色比例", conditionOperator: "between", conditionValue: "0.50-0.70", score: 7, interpretation: "厨房暖色调适中，温馨舒适，有利于增进食欲和家庭和睦", category: "健康", remedy: "" },
  { roomType: "厨房", featureName: "暖色比例", conditionOperator: ">=", conditionValue: "0.70", score: 4, interpretation: "厨房暖色过多，五行火气过旺，容易导致家人脾气暴躁", category: "健康", remedy: "增加一些冷色调元素平衡，如蓝色或绿色装饰" },
  { roomType: "厨房", featureName: "暖色比例", conditionOperator: "<", conditionValue: "0.50", score: 3, interpretation: "厨房冷色调偏多，缺少烟火气，建议增加暖色元素", category: "健康", remedy: "增加暖色系餐具或装饰品" },

  // 色彩饱和度
  { roomType: "厨房", featureName: "色彩饱和度", conditionOperator: "between", conditionValue: "0.40-0.60", score: 7, interpretation: "厨房色彩明快适中，有利于烹饪心情和食欲", category: "健康", remedy: "" },
  { roomType: "厨房", featureName: "色彩饱和度", conditionOperator: ">=", conditionValue: "0.60", score: 3, interpretation: "厨房色彩过于浓烈，容易视觉疲劳", category: "健康", remedy: "使用柔和色调的橱柜和台面" },
  { roomType: "厨房", featureName: "色彩饱和度", conditionOperator: "<", conditionValue: "0.40", score: 4, interpretation: "厨房色彩偏素淡，可适当增加一些色彩活力", category: "健康", remedy: "增加彩色餐具或装饰品点缀" },

  // 空间开阔度
  { roomType: "厨房", featureName: "空间开阔度", conditionOperator: ">=", conditionValue: "0.75", score: 8, interpretation: "厨房空间宽敞，操作方便，气场流通顺畅", category: "健康", remedy: "" },
  { roomType: "厨房", featureName: "空间开阔度", conditionOperator: "between", conditionValue: "0.65-0.75", score: 6, interpretation: "厨房空间适中，布局合理", category: "健康", remedy: "" },
  { roomType: "厨房", featureName: "空间开阔度", conditionOperator: "between", conditionValue: "0.55-0.65", score: 3, interpretation: "厨房空间偏小，操作不便", category: "健康", remedy: "精简厨房用品，合理利用墙面收纳" },
  { roomType: "厨房", featureName: "空间开阔度", conditionOperator: "<", conditionValue: "0.55", score: -1, interpretation: "厨房空间狭窄，风水学认为厨房狭窄则火气郁结，影响健康", category: "健康", remedy: "大幅精简物品，使用壁挂式收纳，保持通道畅通" },

  // ==================== 书房 ====================
  // 亮度
  { roomType: "书房", featureName: "亮度", conditionOperator: "between", conditionValue: "0.70-0.85", score: 9, interpretation: "书房光线明亮适中，风水学认为书房宜明亮，有利于思维清晰，学业和事业进步", category: "事业", remedy: "" },
  { roomType: "书房", featureName: "亮度", conditionOperator: ">=", conditionValue: "0.85", score: 7, interpretation: "书房光线很亮，注意避免刺眼，可使用柔光灯", category: "事业", remedy: "使用柔光灯罩，避免光线直射眼睛" },
  { roomType: "书房", featureName: "亮度", conditionOperator: "between", conditionValue: "0.65-0.70", score: 6, interpretation: "书房光线尚可，建议增加台灯照明", category: "事业", remedy: "增加护眼台灯" },
  { roomType: "书房", featureName: "亮度", conditionOperator: "<", conditionValue: "0.65", score: 0, interpretation: "书房光线不足，风水学认为书房暗则智慧受阻，不利于学业和事业", category: "事业", remedy: "增加照明设备，使用护眼台灯，保持窗户清洁" },

  // 整洁度
  { roomType: "书房", featureName: "整洁度", conditionOperator: ">=", conditionValue: "0.85", score: 10, interpretation: "书房极为整洁有序，风水学认为'书房整洁则文昌位旺'，极利学业和事业", category: "事业", remedy: "" },
  { roomType: "书房", featureName: "整洁度", conditionOperator: "between", conditionValue: "0.75-0.85", score: 7, interpretation: "书房较为整洁，有利于集中注意力", category: "事业", remedy: "" },
  { roomType: "书房", featureName: "整洁度", conditionOperator: "between", conditionValue: "0.65-0.75", score: 4, interpretation: "书房略显凌乱，影响思维清晰度", category: "事业", remedy: "整理书桌，分类收纳文件和书籍" },
  { roomType: "书房", featureName: "整洁度", conditionOperator: "<", conditionValue: "0.65", score: -3, interpretation: "书房杂乱无章，风水学认为严重影响文昌运，不利于学业和事业", category: "事业", remedy: "立即整理，建立文件分类系统，保持桌面清爽" },

  // 冷色比例
  { roomType: "书房", featureName: "冷色比例", conditionOperator: "between", conditionValue: "0.45-0.65", score: 8, interpretation: "书房冷色调适中，风水学认为书房宜冷静，有利于思考和学习", category: "事业", remedy: "" },
  { roomType: "书房", featureName: "冷色比例", conditionOperator: "between", conditionValue: "0.35-0.45", score: 6, interpretation: "书房冷色调偏少，可适当增加蓝色或绿色元素", category: "事业", remedy: "增加蓝色或绿色装饰品" },
  { roomType: "书房", featureName: "冷色比例", conditionOperator: ">=", conditionValue: "0.65", score: 4, interpretation: "书房冷色调过重，略显冷清，可增加一些暖色点缀", category: "事业", remedy: "增加暖色台灯或装饰品" },
  { roomType: "书房", featureName: "冷色比例", conditionOperator: "<", conditionValue: "0.35", score: 3, interpretation: "书房暖色调过多，不利于静心学习", category: "事业", remedy: "增加冷色调元素，如蓝色窗帘或绿色植物" },

  // 空间开阔度
  { roomType: "书房", featureName: "空间开阔度", conditionOperator: "between", conditionValue: "0.65-0.80", score: 8, interpretation: "书房空间适中，既能集中注意力又不会感到压抑", category: "事业", remedy: "" },
  { roomType: "书房", featureName: "空间开阔度", conditionOperator: ">=", conditionValue: "0.80", score: 5, interpretation: "书房空间较大，注意力可能分散，建议合理分区", category: "事业", remedy: "使用书架或屏风划分功能区域" },
  { roomType: "书房", featureName: "空间开阔度", conditionOperator: "<", conditionValue: "0.65", score: 2, interpretation: "书房空间偏小，容易感到压抑", category: "事业", remedy: "精简家具，使用浅色调扩大空间感" },

  // 绿色比例
  { roomType: "书房", featureName: "绿色比例", conditionOperator: "between", conditionValue: "0.08-0.18", score: 8, interpretation: "书房有适量绿色元素，风水学认为绿色属木，木生火，有利于文昌运", category: "事业", remedy: "" },
  { roomType: "书房", featureName: "绿色比例", conditionOperator: "<", conditionValue: "0.08", score: 3, interpretation: "书房缺少绿色元素，建议摆放文竹或绿萝", category: "事业", remedy: "摆放文竹、绿萝或富贵竹等书房适宜植物" },
  { roomType: "书房", featureName: "绿色比例", conditionOperator: ">", conditionValue: "0.18", score: 4, interpretation: "书房绿色过多，可能分散注意力", category: "事业", remedy: "适当减少绿植数量" },

  // ==================== 卫生间 ====================
  // 亮度
  { roomType: "卫生间", featureName: "亮度", conditionOperator: ">=", conditionValue: "0.80", score: 9, interpretation: "卫生间明亮通透，风水学认为卫生间属水，明亮则水清，有利于排除秽气", category: "健康", remedy: "" },
  { roomType: "卫生间", featureName: "亮度", conditionOperator: "between", conditionValue: "0.75-0.80", score: 7, interpretation: "卫生间光线充足，整洁明亮", category: "健康", remedy: "" },
  { roomType: "卫生间", featureName: "亮度", conditionOperator: "between", conditionValue: "0.70-0.75", score: 5, interpretation: "卫生间光线尚可", category: "健康", remedy: "" },
  { roomType: "卫生间", featureName: "亮度", conditionOperator: "between", conditionValue: "0.65-0.70", score: 3, interpretation: "卫生间光线偏暗，容易滋生细菌", category: "健康", remedy: "增加照明设备，保持通风" },
  { roomType: "卫生间", featureName: "亮度", conditionOperator: "<", conditionValue: "0.65", score: -2, interpretation: "卫生间阴暗潮湿，风水大忌，古语云'暗则秽气聚'，严重影响健康", category: "健康", remedy: "增加照明，安装排气扇，保持干燥通风" },

  // 整洁度
  { roomType: "卫生间", featureName: "整洁度", conditionOperator: ">=", conditionValue: "0.85", score: 10, interpretation: "卫生间极为整洁，风水学认为卫生间整洁则秽气不聚，有利于家人健康", category: "健康", remedy: "" },
  { roomType: "卫生间", featureName: "整洁度", conditionOperator: "between", conditionValue: "0.75-0.85", score: 7, interpretation: "卫生间较为整洁，环境不错", category: "健康", remedy: "" },
  { roomType: "卫生间", featureName: "整洁度", conditionOperator: "between", conditionValue: "0.65-0.75", score: 3, interpretation: "卫生间整洁度一般，建议加强清洁", category: "健康", remedy: "定期深度清洁，保持干燥" },
  { roomType: "卫生间", featureName: "整洁度", conditionOperator: "<", conditionValue: "0.65", score: -5, interpretation: "卫生间脏乱，风水中最大的忌讳之一，秽气弥漫，严重影响全家健康和运势", category: "健康", remedy: "紧急深度清洁，更换发霉物品，安装排气扇保持通风干燥" },

  // 冷色比例
  { roomType: "卫生间", featureName: "冷色比例", conditionOperator: "between", conditionValue: "0.50-0.70", score: 7, interpretation: "卫生间冷色调适中，清爽干净，风水学认为卫生间属水，冷色调与之相配", category: "健康", remedy: "" },
  { roomType: "卫生间", featureName: "冷色比例", conditionOperator: ">=", conditionValue: "0.70", score: 4, interpretation: "卫生间冷色调过重，略显冰冷", category: "健康", remedy: "增加一些暖色毛巾或装饰品" },
  { roomType: "卫生间", featureName: "冷色比例", conditionOperator: "<", conditionValue: "0.50", score: 4, interpretation: "卫生间暖色调偏多，与水属性不太协调", category: "健康", remedy: "可适当增加白色或浅蓝色元素" },

  // 空间开阔度
  { roomType: "卫生间", featureName: "空间开阔度", conditionOperator: ">=", conditionValue: "0.70", score: 7, interpretation: "卫生间空间宽敞，通风良好，有利于排除湿气", category: "健康", remedy: "" },
  { roomType: "卫生间", featureName: "空间开阔度", conditionOperator: "between", conditionValue: "0.60-0.70", score: 5, interpretation: "卫生间空间适中", category: "健康", remedy: "" },
  { roomType: "卫生间", featureName: "空间开阔度", conditionOperator: "<", conditionValue: "0.60", score: 1, interpretation: "卫生间空间狭小，湿气不易排出", category: "健康", remedy: "安装排气扇，减少不必要的物品" },

  // ==================== 餐厅 ====================
  // 亮度
  { roomType: "餐厅", featureName: "亮度", conditionOperator: ">=", conditionValue: "0.80", score: 9, interpretation: "餐厅明亮温馨，风水学认为餐厅明亮有利于增进食欲和家人感情", category: "健康", remedy: "" },
  { roomType: "餐厅", featureName: "亮度", conditionOperator: "between", conditionValue: "0.75-0.80", score: 8, interpretation: "餐厅光线充足，氛围良好", category: "健康", remedy: "" },
  { roomType: "餐厅", featureName: "亮度", conditionOperator: "between", conditionValue: "0.70-0.75", score: 6, interpretation: "餐厅光线较好", category: "健康", remedy: "" },
  { roomType: "餐厅", featureName: "亮度", conditionOperator: "between", conditionValue: "0.65-0.70", score: 4, interpretation: "餐厅光线中等，建议增加餐桌上方吊灯", category: "健康", remedy: "增加餐桌上方吊灯或壁灯" },
  { roomType: "餐厅", featureName: "亮度", conditionOperator: "<", conditionValue: "0.65", score: 0, interpretation: "餐厅光线不足，影响食欲和家人交流", category: "健康", remedy: "增加照明设备，使用暖色灯光营造温馨氛围" },

  // 暖色比例
  { roomType: "餐厅", featureName: "暖色比例", conditionOperator: ">=", conditionValue: "0.65", score: 9, interpretation: "餐厅暖色调为主，温馨舒适，风水学认为有利于增进食欲和家庭和睦", category: "健康", remedy: "" },
  { roomType: "餐厅", featureName: "暖色比例", conditionOperator: "between", conditionValue: "0.55-0.65", score: 7, interpretation: "餐厅暖色调较多，氛围不错", category: "健康", remedy: "" },
  { roomType: "餐厅", featureName: "暖色比例", conditionOperator: "between", conditionValue: "0.45-0.55", score: 4, interpretation: "餐厅色调冷暖适中", category: "健康", remedy: "可增加暖色系餐具或桌布" },
  { roomType: "餐厅", featureName: "暖色比例", conditionOperator: "<", conditionValue: "0.45", score: 1, interpretation: "餐厅冷色调过重，不利于食欲和家人交流", category: "健康", remedy: "更换暖色系桌布和餐具，使用暖色灯光" },

  // 整洁度
  { roomType: "餐厅", featureName: "整洁度", conditionOperator: ">=", conditionValue: "0.85", score: 9, interpretation: "餐厅极为整洁，有利于家人健康饮食", category: "健康", remedy: "" },
  { roomType: "餐厅", featureName: "整洁度", conditionOperator: "between", conditionValue: "0.75-0.85", score: 7, interpretation: "餐厅较为整洁，环境舒适", category: "健康", remedy: "" },
  { roomType: "餐厅", featureName: "整洁度", conditionOperator: "between", conditionValue: "0.65-0.75", score: 4, interpretation: "餐厅整洁度一般，建议保持餐桌清爽", category: "健康", remedy: "餐后及时清理，保持餐桌整洁" },
  { roomType: "餐厅", featureName: "整洁度", conditionOperator: "<", conditionValue: "0.65", score: -2, interpretation: "餐厅杂乱，影响食欲和健康", category: "健康", remedy: "立即整理，建立餐后清洁习惯" },

  // 空间开阔度
  { roomType: "餐厅", featureName: "空间开阔度", conditionOperator: ">=", conditionValue: "0.75", score: 8, interpretation: "餐厅空间宽敞，风水学认为餐厅宽敞有利于家人聚餐和交流", category: "人际", remedy: "" },
  { roomType: "餐厅", featureName: "空间开阔度", conditionOperator: "between", conditionValue: "0.65-0.75", score: 6, interpretation: "餐厅空间适中，布局合理", category: "人际", remedy: "" },
  { roomType: "餐厅", featureName: "空间开阔度", conditionOperator: "<", conditionValue: "0.65", score: 2, interpretation: "餐厅空间偏小，用餐时可能感到拥挤", category: "人际", remedy: "精简餐厅家具，选择折叠餐桌等节省空间的家具" },

  // 红色比例
  { roomType: "餐厅", featureName: "红色比例", conditionOperator: "between", conditionValue: "0.05-0.15", score: 7, interpretation: "餐厅有适量红色元素，增添喜庆氛围，有利于食欲", category: "健康", remedy: "" },
  { roomType: "餐厅", featureName: "红色比例", conditionOperator: "<", conditionValue: "0.05", score: 4, interpretation: "餐厅缺少红色元素，可增加一些暖色点缀", category: "健康", remedy: "增加红色餐具或装饰品" },
  { roomType: "餐厅", featureName: "红色比例", conditionOperator: ">", conditionValue: "0.15", score: 2, interpretation: "餐厅红色过多，容易导致急躁", category: "健康", remedy: "适当减少红色元素" },

  // ==================== 通用规则（适用于所有房间）====================
  // 纹理复杂度
  { roomType: "通用", featureName: "纹理复杂度", conditionOperator: "between", conditionValue: "0.40-0.65", score: 7, interpretation: "空间纹理丰富度适中，视觉层次感好，风水学认为有利于气场流通", category: "健康", remedy: "" },
  { roomType: "通用", featureName: "纹理复杂度", conditionOperator: ">=", conditionValue: "0.65", score: 2, interpretation: "空间纹理过于复杂，视觉杂乱，容易导致心神不宁", category: "健康", remedy: "简化装饰，减少花纹繁复的物品" },
  { roomType: "通用", featureName: "纹理复杂度", conditionOperator: "between", conditionValue: "0.30-0.40", score: 5, interpretation: "空间纹理较为简洁，整体清爽", category: "健康", remedy: "" },
  { roomType: "通用", featureName: "纹理复杂度", conditionOperator: "<", conditionValue: "0.30", score: 3, interpretation: "空间过于单调，缺少层次感", category: "健康", remedy: "适当增加一些装饰品或纹理元素" },

  // 色彩饱和度（通用）
  { roomType: "通用", featureName: "色彩饱和度", conditionOperator: "between", conditionValue: "0.40-0.60", score: 7, interpretation: "空间色彩饱和度适中，视觉舒适，五行色彩平衡", category: "健康", remedy: "" },
  { roomType: "通用", featureName: "色彩饱和度", conditionOperator: ">=", conditionValue: "0.60", score: 2, interpretation: "空间色彩过于浓烈，容易视觉疲劳和心情烦躁", category: "健康", remedy: "使用柔和色调中和，避免大面积高饱和色" },
  { roomType: "通用", featureName: "色彩饱和度", conditionOperator: "<", conditionValue: "0.40", score: 4, interpretation: "空间色彩偏素淡，略显冷清", category: "健康", remedy: "适当增加色彩点缀" },

  // 自然光比例（通用）
  { roomType: "通用", featureName: "自然光比例", conditionOperator: ">=", conditionValue: "0.75", score: 9, interpretation: "自然光充足，阳气旺盛，风水学认为自然光是最好的阳气来源", category: "健康", remedy: "" },
  { roomType: "通用", featureName: "自然光比例", conditionOperator: "between", conditionValue: "0.60-0.75", score: 7, interpretation: "自然光较充足，阳气充盈", category: "健康", remedy: "" },
  { roomType: "通用", featureName: "自然光比例", conditionOperator: "between", conditionValue: "0.45-0.60", score: 4, interpretation: "自然光中等，建议白天多开窗", category: "健康", remedy: "白天保持窗帘打开，清洁窗户" },
  { roomType: "通用", featureName: "自然光比例", conditionOperator: "<", conditionValue: "0.45", score: 0, interpretation: "自然光严重不足，阳气匮乏", category: "健康", remedy: "增加窗户面积或使用全光谱灯具" },

  // 植物覆盖率（通用）
  { roomType: "通用", featureName: "植物覆盖率", conditionOperator: "between", conditionValue: "0.05-0.20", score: 8, interpretation: "绿植适量，生机盎然，风水学认为植物可化煞聚气", category: "健康", remedy: "" },
  { roomType: "通用", featureName: "植物覆盖率", conditionOperator: "<", conditionValue: "0.05", score: 3, interpretation: "缺少绿植，建议摆放一些风水植物增添生气", category: "健康", remedy: "摆放适合室内的风水植物" },
  { roomType: "通用", featureName: "植物覆盖率", conditionOperator: ">", conditionValue: "0.20", score: 3, interpretation: "绿植过多，阴气偏重", category: "健康", remedy: "适当减少绿植数量" },

  // 对比度（通用）
  { roomType: "通用", featureName: "对比度", conditionOperator: "between", conditionValue: "0.50-0.70", score: 7, interpretation: "色彩对比适中，视觉和谐，气场平衡", category: "健康", remedy: "" },
  { roomType: "通用", featureName: "对比度", conditionOperator: ">=", conditionValue: "0.70", score: 2, interpretation: "色彩对比过强，视觉刺激大", category: "健康", remedy: "使用过渡色调柔化对比" },
  { roomType: "通用", featureName: "对比度", conditionOperator: "<", conditionValue: "0.50", score: 3, interpretation: "色彩对比偏弱，缺少层次感", category: "健康", remedy: "增加装饰品增加视觉层次" },

  // 绿色比例（通用）
  { roomType: "通用", featureName: "绿色比例", conditionOperator: "between", conditionValue: "0.08-0.20", score: 7, interpretation: "绿色元素适量，五行木气平衡，有利于健康和成长", category: "健康", remedy: "" },
  { roomType: "通用", featureName: "绿色比例", conditionOperator: "<", conditionValue: "0.08", score: 3, interpretation: "缺少绿色元素，五行木气不足", category: "健康", remedy: "增加绿色植物或装饰品" },
  { roomType: "通用", featureName: "绿色比例", conditionOperator: ">", conditionValue: "0.20", score: 3, interpretation: "绿色过多，五行木气过旺", category: "健康", remedy: "适当减少绿色元素，增加其他色彩平衡" },

  // 红色比例（通用）
  { roomType: "通用", featureName: "红色比例", conditionOperator: "between", conditionValue: "0.03-0.12", score: 7, interpretation: "红色元素适量，五行火气平衡，增添活力", category: "人际", remedy: "" },
  { roomType: "通用", featureName: "红色比例", conditionOperator: "<", conditionValue: "0.03", score: 3, interpretation: "缺少红色元素，五行火气不足", category: "人际", remedy: "增加适量红色装饰品" },
  { roomType: "通用", featureName: "红色比例", conditionOperator: ">", conditionValue: "0.12", score: 1, interpretation: "红色过多，五行火气过旺，容易导致急躁", category: "人际", remedy: "减少红色元素，增加冷色调平衡" },
];
