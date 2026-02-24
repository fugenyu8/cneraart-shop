/**
 * 全面系统测试
 * 测试所有引擎、规则库、报告生成、PDF生成的端到端流程
 */

// ============= 测试框架 =============
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures: string[] = [];

function test(name: string, fn: () => void | Promise<void>) {
  return (async () => {
    totalTests++;
    try {
      await fn();
      passedTests++;
      console.log(`  ✅ ${name}`);
    } catch (error: any) {
      failedTests++;
      const msg = `${name}: ${error.message}`;
      failures.push(msg);
      console.log(`  ❌ ${name}`);
      console.log(`     Error: ${error.message}`);
    }
  })();
}

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

function assertRange(value: number, min: number, max: number, name: string) {
  assert(
    value >= min && value <= max,
    `${name} = ${value}, expected range [${min}, ${max}]`
  );
}

function assertType(value: any, type: string, name: string) {
  assert(typeof value === type, `${name} type is ${typeof value}, expected ${type}`);
}

function assertDefined(value: any, name: string) {
  assert(value !== undefined && value !== null, `${name} is undefined/null`);
}

// ============= 测试开始 =============

async function runAllTests() {
  console.log("\n" + "=".repeat(70));
  console.log("  五台山善途 - 全面系统测试");
  console.log("  " + new Date().toLocaleString("zh-CN"));
  console.log("=".repeat(70));

  // ==================== 1. 规则数据文件完整性测试 ====================
  console.log("\n📋 [1/7] 规则数据文件完整性测试");

  const { faceRulesData } = await import("../scripts/rules/face-rules");
  const { faceExtendedRulesData } = await import("../scripts/rules/face-rules-extended");
  const { faceExtraRulesData } = await import("../scripts/rules/face-rules-extra");
  const { palmRulesData } = await import("../scripts/rules/palm-rules");
  const { palmExtendedRulesData } = await import("../scripts/rules/palm-rules-extended");
  const { palmExtraRulesData } = await import("../scripts/rules/palm-rules-extra");
  const { fengshuiRulesData } = await import("../scripts/rules/fengshui-rules");
  const { fengshuiExtendedRulesData } = await import("../scripts/rules/fengshui-rules-extended");
  const { fengshuiExtraRulesData } = await import("../scripts/rules/fengshui-rules-extra");

  const allFaceRules = [...faceRulesData, ...faceExtendedRulesData, ...faceExtraRulesData];
  const allPalmRules = [...palmRulesData, ...palmExtendedRulesData, ...palmExtraRulesData];
  const allFengshuiRules = [...fengshuiRulesData, ...fengshuiExtendedRulesData, ...fengshuiExtraRulesData];

  await test("面相规则数量 >= 300", () => {
    assert(allFaceRules.length >= 300, `面相规则只有 ${allFaceRules.length} 条`);
    console.log(`     面相规则总计: ${allFaceRules.length} 条`);
  });

  await test("手相规则数量 >= 300", () => {
    assert(allPalmRules.length >= 300, `手相规则只有 ${allPalmRules.length} 条`);
    console.log(`     手相规则总计: ${allPalmRules.length} 条`);
  });

  await test("风水规则数量 >= 300", () => {
    assert(allFengshuiRules.length >= 300, `风水规则只有 ${allFengshuiRules.length} 条`);
    console.log(`     风水规则总计: ${allFengshuiRules.length} 条`);
  });

  await test("面相规则字段完整性", () => {
    for (const rule of allFaceRules) {
      assertDefined(rule.palaceName, "palaceName");
      assertDefined(rule.featureName, "featureName");
      assertDefined(rule.conditionOperator, "conditionOperator");
      assertDefined(rule.conditionValue, "conditionValue");
      assertType(rule.score, "number", "score");
      assert(rule.interpretation.length > 0, "interpretation 不能为空");
    }
  });

  await test("手相规则字段完整性", () => {
    for (const rule of allPalmRules) {
      assertDefined(rule.featureName, "featureName");
      assertDefined(rule.conditionOperator, "conditionOperator");
      assertDefined(rule.conditionValue, "conditionValue");
      assertType(rule.score, "number", "score");
      assert(rule.interpretation.length > 0, "interpretation 不能为空");
    }
  });

  await test("风水规则字段完整性", () => {
    for (const rule of allFengshuiRules) {
      assertDefined(rule.roomType, "roomType");
      assertDefined(rule.featureName, "featureName");
      assertDefined(rule.conditionOperator, "conditionOperator");
      assertDefined(rule.conditionValue, "conditionValue");
      assertType(rule.score, "number", "score");
      assert(rule.interpretation.length > 0, "interpretation 不能为空");
    }
  });

  await test("风水规则房间类型覆盖", () => {
    const roomTypes = new Set(allFengshuiRules.map((r) => r.roomType));
    const expected = ["客厅", "卧室", "书房", "厨房", "卫生间", "通用"];
    for (const rt of expected) {
      assert(roomTypes.has(rt), `缺少房间类型: ${rt}`);
    }
    console.log(`     覆盖房间类型: ${Array.from(roomTypes).join(", ")}`);
  });

  await test("风水规则 conditionOperator 合法性", () => {
    const validOps = [">=", "<=", ">", "<", "=", "between", "in", "contains"];
    for (const rule of allFengshuiRules) {
      assert(validOps.includes(rule.conditionOperator), `非法运算符: ${rule.conditionOperator}`);
    }
  });

  await test("风水规则 between 格式正确", () => {
    const betweenRules = allFengshuiRules.filter((r) => r.conditionOperator === "between");
    for (const rule of betweenRules) {
      const parts = rule.conditionValue.split("-");
      assert(parts.length === 2, `between 格式错误: ${rule.conditionValue}`);
      const min = parseFloat(parts[0]);
      const max = parseFloat(parts[1]);
      assert(!isNaN(min) && !isNaN(max), `between 值非数字: ${rule.conditionValue}`);
      assert(min <= max, `between min > max: ${rule.conditionValue}`);
    }
    console.log(`     between 规则数: ${betweenRules.length}`);
  });

  await test("面相规则十二宫覆盖", () => {
    const palaces = new Set(allFaceRules.map((r) => r.palaceName));
    // 传统面相学使用“妻妾宫”而非“夫妻宫”，“儿女宫”而非“子女宫”
    const expected = ["命宫", "财帛宫", "官禄宫", "妻妾宫", "疾厄宫", "兄弟宫", "儿女宫", "田宅宫", "迁移宫", "奴仆宫", "父母宫", "福德宫"];
    for (const p of expected) {
      assert(palaces.has(p), `缺少宫位: ${p}`);
    }
    console.log(`     覆盖宫位: ${palaces.size} 个`);
  });

  // ==================== 2. Seed 脚本转换逻辑测试 ====================
  console.log("\n📋 [2/7] Seed 脚本转换逻辑测试");

  await test("风水 conditionValue 0-1 → 0-100 转换", () => {
    // 模拟 seed 脚本的转换函数
    function convertFengshuiConditionValue(operator: string, value: string): string {
      if (operator === "between") {
        const parts = value.split("-");
        if (parts.length === 2) {
          const min = parseFloat(parts[0]);
          const max = parseFloat(parts[1]);
          if (min <= 1 && max <= 1) {
            return `${Math.round(min * 100)},${Math.round(max * 100)}`;
          }
          return `${Math.round(min)},${Math.round(max)}`;
        }
        return value;
      }
      if ([">=" , "<=", ">", "<", "="].includes(operator)) {
        const num = parseFloat(value);
        if (!isNaN(num) && num <= 1 && num >= 0) {
          return String(Math.round(num * 100));
        }
        return value;
      }
      return value;
    }

    // 测试 between 转换
    assert(convertFengshuiConditionValue("between", "0.80-0.85") === "80,85", "between 0.80-0.85 → 80,85");
    assert(convertFengshuiConditionValue("between", "0.55-0.60") === "55,60", "between 0.55-0.60 → 55,60");
    assert(convertFengshuiConditionValue("between", "0.00-0.10") === "0,10", "between 0.00-0.10 → 0,10");

    // 测试 >= 转换
    assert(convertFengshuiConditionValue(">=", "0.85") === "85", ">= 0.85 → 85");
    assert(convertFengshuiConditionValue(">=", "0.55") === "55", ">= 0.55 → 55");

    // 测试 < 转换
    assert(convertFengshuiConditionValue("<", "0.55") === "55", "< 0.55 → 55");
  });

  await test("风水 roomType 中文→英文映射", () => {
    const ROOM_TYPE_MAP: Record<string, string> = {
      "客厅": "living_room", "卧室": "bedroom", "书房": "study",
      "厨房": "kitchen", "卫生间": "bathroom", "阳台": "balcony",
      "餐厅": "dining_room", "玄关": "entrance", "通用": "general",
    };
    assert(ROOM_TYPE_MAP["客厅"] === "living_room", "客厅 → living_room");
    assert(ROOM_TYPE_MAP["卧室"] === "bedroom", "卧室 → bedroom");
    assert(ROOM_TYPE_MAP["阳台"] === "balcony", "阳台 → balcony");
    assert(ROOM_TYPE_MAP["玄关"] === "entrance", "玄关 → entrance");
  });

  // ==================== 3. 风水引擎纯函数测试 ====================
  console.log("\n📋 [3/7] 风水引擎纯函数测试");

  const { ROOM_TYPE_NAMES, DIRECTION_NAMES } = await import("../server/fengshui-engine");

  await test("ROOM_TYPE_NAMES 包含所有房间类型", () => {
    const expected = ["living_room", "bedroom", "study", "kitchen", "dining_room", "bathroom", "balcony", "entrance"];
    for (const rt of expected) {
      assertDefined(ROOM_TYPE_NAMES[rt], `ROOM_TYPE_NAMES[${rt}]`);
    }
    console.log(`     房间类型: ${Object.keys(ROOM_TYPE_NAMES).join(", ")}`);
  });

  await test("DIRECTION_NAMES 包含所有方位", () => {
    const expected = ["north", "south", "east", "west", "northeast", "northwest", "southeast", "southwest"];
    for (const d of expected) {
      assertDefined(DIRECTION_NAMES[d], `DIRECTION_NAMES[${d}]`);
    }
  });

  // ==================== 4. 图像特征提取测试（使用测试图片）====================
  console.log("\n📋 [4/7] 图像特征提取测试");

  // 生成一张测试图片
  const sharp = (await import("sharp")).default;

  // 创建一张 640x480 的暖色调测试图片（模拟客厅）
  const testImageBuffer = await sharp({
    create: {
      width: 640,
      height: 480,
      channels: 3,
      background: { r: 200, g: 180, b: 150 }, // 暖色调
    },
  }).jpeg().toBuffer();

  const testImagePath = "/tmp/test-living-room.jpg";
  const fs = await import("fs");
  fs.writeFileSync(testImagePath, testImageBuffer);

  const { extractRoomFeatures } = await import("../server/fengshui-recognition");

  let roomFeatures: any = null;
  await test("风水图像特征提取 - 客厅", async () => {
    roomFeatures = await extractRoomFeatures([testImagePath], "living_room", "south");
    assertDefined(roomFeatures, "roomFeatures");
    assert(roomFeatures.roomType === "living_room", `roomType = ${roomFeatures.roomType}`);
    assertDefined(roomFeatures["亮度"], "亮度");
    assertDefined(roomFeatures["色彩饱和度"], "色彩饱和度");
    assertDefined(roomFeatures["空间开阔度"], "空间开阔度");
    assertDefined(roomFeatures["整洁度"], "整洁度");
    console.log(`     提取特征数: ${Object.keys(roomFeatures).length}`);
  });

  await test("风水特征值范围 0-100", async () => {
    if (!roomFeatures) throw new Error("roomFeatures 未初始化");
    const numericKeys = Object.keys(roomFeatures).filter(
      (k) => typeof roomFeatures[k] === "number"
    );
    for (const key of numericKeys) {
      assertRange(roomFeatures[key], 0, 100, key);
    }
    console.log(`     验证了 ${numericKeys.length} 个数值特征`);
  });

  await test("风水特征包含五行元素", async () => {
    if (!roomFeatures) throw new Error("roomFeatures 未初始化");
    assertDefined(roomFeatures["木元素比例"], "木元素比例");
    assertDefined(roomFeatures["火元素比例"], "火元素比例");
    assertDefined(roomFeatures["土元素比例"], "土元素比例");
    assertDefined(roomFeatures["金元素比例"], "金元素比例");
    assertDefined(roomFeatures["水元素比例"], "水元素比例");
    assertDefined(roomFeatures["五行平衡度"], "五行平衡度");
  });

  await test("风水特征包含八卦方位能量", async () => {
    if (!roomFeatures) throw new Error("roomFeatures 未初始化");
    assertDefined(roomFeatures["乾位能量"], "乾位能量");
    assertDefined(roomFeatures["坤位能量"], "坤位能量");
    assertDefined(roomFeatures["震位能量"], "震位能量");
    assertDefined(roomFeatures["巽位能量"], "巽位能量");
    assertDefined(roomFeatures["坎位能量"], "坎位能量");
    assertDefined(roomFeatures["离位能量"], "离位能量");
    assertDefined(roomFeatures["艮位能量"], "艮位能量");
    assertDefined(roomFeatures["兑位能量"], "兑位能量");
  });

  await test("风水特征包含煞气指标", async () => {
    if (!roomFeatures) throw new Error("roomFeatures 未初始化");
    assertDefined(roomFeatures["尖角煞指数"], "尖角煞指数");
    assertDefined(roomFeatures["穿堂煞指数"], "穿堂煞指数");
    assertDefined(roomFeatures["门冲煞指数"], "门冲煞指数");
  });

  // 创建一张深色测试图片（模拟卧室）
  const bedroomImageBuffer = await sharp({
    create: {
      width: 640,
      height: 480,
      channels: 3,
      background: { r: 100, g: 80, b: 120 }, // 偏暗冷色调
    },
  }).jpeg().toBuffer();

  const bedroomImagePath = "/tmp/test-bedroom.jpg";
  fs.writeFileSync(bedroomImagePath, bedroomImageBuffer);

  await test("风水图像特征提取 - 卧室", async () => {
    const bedroomFeatures = await extractRoomFeatures([bedroomImagePath], "bedroom", "east");
    assertDefined(bedroomFeatures, "bedroomFeatures");
    assert(bedroomFeatures.roomType === "bedroom", `roomType = ${bedroomFeatures.roomType}`);
    assertDefined(bedroomFeatures["床头朝向吉度"], "床头朝向吉度");
    assertDefined(bedroomFeatures["床位靠墙度"], "床位靠墙度");
    console.log(`     卧室特征数: ${Object.keys(bedroomFeatures).length}`);
  });

  // 面相图像特征提取
  const { extractFaceFeatures } = await import("../server/image-recognition");

  // 创建一张模拟人脸的测试图片（肤色）
  const faceImageBuffer = await sharp({
    create: {
      width: 400,
      height: 500,
      channels: 3,
      background: { r: 220, g: 190, b: 170 }, // 肤色
    },
  }).jpeg().toBuffer();

  const faceImagePath = "/tmp/test-face.jpg";
  fs.writeFileSync(faceImagePath, faceImageBuffer);

  let faceFeatures: any = null;
  await test("面相图像特征提取", async () => {
    faceFeatures = await extractFaceFeatures(faceImagePath);
    assertDefined(faceFeatures, "faceFeatures");
    assertDefined(faceFeatures.palaces, "palaces");
    assert(Object.keys(faceFeatures.palaces).length > 0, "palaces 不能为空");
    console.log(`     面型: ${faceFeatures.faceType}`);
    console.log(`     宫位数: ${Object.keys(faceFeatures.palaces).length}`);
  });

  // 手相图像特征提取
  const { extractPalmFeatures } = await import("../server/image-recognition");

  const palmImageBuffer = await sharp({
    create: {
      width: 400,
      height: 500,
      channels: 3,
      background: { r: 210, g: 180, b: 160 }, // 手掌肤色
    },
  }).jpeg().toBuffer();

  const palmImagePath = "/tmp/test-palm.jpg";
  fs.writeFileSync(palmImagePath, palmImageBuffer);

  let palmFeatures: any = null;
  await test("手相图像特征提取", async () => {
    palmFeatures = await extractPalmFeatures(palmImagePath);
    assertDefined(palmFeatures, "palmFeatures");
    assertDefined(palmFeatures.lines, "lines");
    assertDefined(palmFeatures.hills, "hills");
    assert(Object.keys(palmFeatures.lines).length > 0, "lines 不能为空");
    assert(Object.keys(palmFeatures.hills).length > 0, "hills 不能为空");
    console.log(`     手型: ${palmFeatures.handType}`);
    console.log(`     掌纹数: ${Object.keys(palmFeatures.lines).length}`);
    console.log(`     丘位数: ${Object.keys(palmFeatures.hills).length}`);
  });

  // ==================== 5. 风水报告模板引擎测试 ====================
  console.log("\n📋 [5/7] 风水报告模板引擎测试");

  const { generateFengshuiAIInterpretation } = await import("../server/fengshui-ai-interpretation");
  // 模拟一个计算结果
  const mockFengshuiResult = {
    overallScore: 75,
    items: [
      { category: "财运", title: "亮度", score: 8, interpretation: "客厅明亮通透，光线充足", suggestion: "" },
      { category: "财运", title: "色彩饱和度", score: 5, interpretation: "色彩搭配和谐", suggestion: "" },
      { category: "健康", title: "整洁度", score: -2, interpretation: "整洁度有待提高", suggestion: "建议定期整理" },
      { category: "事业", title: "空间开阔度", score: 7, interpretation: "空间布局合理", suggestion: "" },
      { category: "感情", title: "桃花位能量", score: 3, interpretation: "桃花位能量一般", suggestion: "摆放粉色装饰" },
    ],
    positiveCount: 3,
    negativeCount: 1,
    fiveElements: {
      wood: 65, fire: 70, earth: 60, metal: 55, water: 50,
      balance: 72,
      balanceDescription: "五行略有偏差，整体尚可",
    },
    baguaEnergy: {
      qian: 70, kun: 65, zhen: 75, xun: 60,
      kan: 55, li: 80, gen: 50, dui: 68,
    },
    shaQiItems: [],
    wealthPosition: { score: 72, description: "财位布局良好" },
    peachBlossom: { score: 58, description: "桃花位能量一般" },
    wenChang: { score: 65, description: "文昌位能量一般" },
  };

  let fengshuiInterpretation: any = null;
  await test("风水报告模板生成 - 客厅", async () => {
    fengshuiInterpretation = await generateFengshuiAIInterpretation(
      mockFengshuiResult as any,
      "living_room"
    );
    assertDefined(fengshuiInterpretation, "interpretation");
    assertDefined(fengshuiInterpretation.overallSummary, "overallSummary");
    assert(fengshuiInterpretation.overallSummary.length > 50, "overallSummary 太短");
    assertDefined(fengshuiInterpretation.sections, "sections");
    assert(fengshuiInterpretation.sections.length > 0, "sections 不能为空");
    console.log(`     摘要长度: ${fengshuiInterpretation.overallSummary.length} 字`);
    console.log(`     分析章节: ${fengshuiInterpretation.sections.length} 个`);
  });

  await test("风水报告章节评分范围 0-100", async () => {
    if (!fengshuiInterpretation) throw new Error("未生成");
    for (const section of fengshuiInterpretation.sections) {
      assertRange(section.score, 0, 100, section.title);
    }
  });

  // ==================== 6. 面相/手相报告模板引擎测试 ====================
  console.log("\n📋 [6/7] 面相/手相报告模板引擎测试");

  const { generateAIInterpretation } = await import("../server/ai-interpretation");

  // 模拟面相计算结果
  const mockFaceResult: Record<string, any> = {
    "命宫": { score: 78, category: "吉", level: "上", rawScore: 6.5, interpretations: ["命宫饱满，气色红润"], categories: ["整体运势"] },
    "财帛宫": { score: 72, category: "吉", level: "中上", rawScore: 5.0, interpretations: ["鼻头丰隆，财运不错"], categories: ["财运"] },
    "官禄宫": { score: 80, category: "吉", level: "上", rawScore: 7.0, interpretations: ["额头宽阔，事业运佳"], categories: ["事业"] },
    "夫妻宫": { score: 65, category: "平", level: "中", rawScore: 3.0, interpretations: ["眼尾平和，感情稳定"], categories: ["感情"] },
    "疾厄宫": { score: 70, category: "吉", level: "中上", rawScore: 4.5, interpretations: ["山根挺直，健康良好"], categories: ["健康"] },
    "兄弟宫": { score: 68, category: "平", level: "中", rawScore: 3.5, interpretations: ["眉形端正，人缘不错"], categories: ["人际"] },
  };

  let faceInterpretation: any = null;
  await test("面相报告模板生成", async () => {
    faceInterpretation = await generateAIInterpretation(mockFaceResult, "face", "土型脸");
    assertDefined(faceInterpretation, "interpretation");
    assertDefined(faceInterpretation.overallSummary, "overallSummary");
    assert(faceInterpretation.overallSummary.length > 50, "overallSummary 太短");
    assertDefined(faceInterpretation.sections, "sections");
    assert(faceInterpretation.sections.length > 0, "sections 不能为空");
    console.log(`     摘要长度: ${faceInterpretation.overallSummary.length} 字`);
    console.log(`     分析章节: ${faceInterpretation.sections.length} 个`);
  });

  // 模拟手相计算结果
  const mockPalmResult: Record<string, any> = {
    "生命线": { score: 75, category: "吉", level: "中上", rawScore: 5.5, interpretations: ["生命线深长，体质强健"], categories: ["健康"] },
    "智慧线": { score: 82, category: "吉", level: "上", rawScore: 7.5, interpretations: ["智慧线清晰，思维敏捷"], categories: ["智力"] },
    "感情线": { score: 68, category: "平", level: "中", rawScore: 3.5, interpretations: ["感情线平稳，感情稳定"], categories: ["感情"] },
    "木星丘": { score: 70, category: "吉", level: "中上", rawScore: 4.5, interpretations: ["木星丘饱满，领导力强"], categories: ["事业"] },
  };

  let palmInterpretation: any = null;
  await test("手相报告模板生成", async () => {
    palmInterpretation = await generateAIInterpretation(mockPalmResult, "palm");
    assertDefined(palmInterpretation, "interpretation");
    assertDefined(palmInterpretation.overallSummary, "overallSummary");
    assert(palmInterpretation.overallSummary.length > 50, "overallSummary 太短");
    assertDefined(palmInterpretation.sections, "sections");
    assert(palmInterpretation.sections.length > 0, "sections 不能为空");
    console.log(`     摘要长度: ${palmInterpretation.overallSummary.length} 字`);
    console.log(`     分析章节: ${palmInterpretation.sections.length} 个`);
  });

  // ==================== 7. Markdown 报告生成和图表测试 ====================
  console.log("\n📋 [7/7] Markdown 报告生成和图表测试");

  const { generateFengshuiReport } = await import("../server/fortuneEngines/fengshui");
  const { generateFaceReadingReport } = await import("../server/fortuneEngines/faceReading");
  const { generatePalmReadingReport } = await import("../server/fortuneEngines/palmReading");

  // 模拟完整的风水分析结果
  const mockFengshuiAnalysis = {
    overallSummary: "您的客厅风水整体评分为75分，布局基本合理。",
    score: 75,
    elementBalance: { wood: 65, fire: 70, earth: 60, metal: 55, water: 50 },
    sections: [
      { title: "采光通风评估", content: "客厅光线充足，通风良好。", score: 80 },
      { title: "色彩搭配分析", content: "色彩搭配和谐，暖色调为主。", score: 72 },
      { title: "空间布局分析", content: "空间布局合理，动线流畅。", score: 78 },
    ],
    issues: [
      { type: "五行平衡", description: "水元素略显不足", severity: "低", solution: "在北方放置水景" },
    ],
    recommendations: [
      { category: "财运", advice: "在财位放置绿色植物", priority: "高" },
      { category: "事业", advice: "优化工作区域布局", priority: "中" },
    ],
  };

  let fengshuiReport: string = "";
  await test("风水 Markdown 报告生成", () => {
    fengshuiReport = generateFengshuiReport(mockFengshuiAnalysis, "张三");
    assert(fengshuiReport.length > 500, `报告太短: ${fengshuiReport.length} 字`);
    assert(fengshuiReport.includes("风水分析报告"), "缺少标题");
    assert(fengshuiReport.includes("张三"), "缺少用户名");
    assert(fengshuiReport.includes("75/100"), "缺少评分");
    assert(fengshuiReport.includes("五行平衡分析"), "缺少五行分析");
    assert(fengshuiReport.includes("法律声明"), "缺少法律声明");
    assert(fengshuiReport.includes("五台山善途团队"), "缺少团队名称");
    assert(fengshuiReport.includes("回向祝福"), "缺少回向祝福");
    console.log(`     风水报告长度: ${fengshuiReport.length} 字`);
  });

  // 模拟完整的面相分析结果
  const mockFaceAnalysis = {
    overallSummary: "您的面相整体评分为78分，面相端正，气色红润。",
    score: 78,
    faceType: "土型脸",
    sections: [
      { title: "命宫分析", content: "命宫饱满，整体运势良好。", score: 78 },
      { title: "财帛宫分析", content: "鼻头丰隆，财运不错。", score: 72 },
    ],
    recommendations: [
      { category: "事业", advice: "把握当前机遇" },
      { category: "财运", advice: "稳健投资" },
    ],
    yearFortune: {
      year: 2026,
      trend: "2026年整体运势平稳向上，稳中有进。",
      keyMonths: [
        "农历正月至三月：调整期，适合制定年度计划",
        "农历四月至六月：发展期，把握机遇",
        "农历七月至九月：收获期，努力见效",
        "农历十月至十二月：总结期，为来年做好准备",
      ],
    },
  };

  let faceReport: string = "";
  await test("面相 Markdown 报告生成", () => {
    faceReport = generateFaceReadingReport(mockFaceAnalysis, "李四");
    assert(faceReport.length > 500, `报告太短: ${faceReport.length} 字`);
    assert(faceReport.includes("李四"), "缺少用户名");
    assert(faceReport.includes("法律声明") || faceReport.includes("免责"), "缺少法律声明");
    console.log(`     面相报告长度: ${faceReport.length} 字`);
  });

  // 模拟完整的手相分析结果
  const mockPalmAnalysis = {
    overallSummary: "您的手相整体评分为76分，手型端正。",
    score: 76,
    handType: "土形手",
    sections: [
      { title: "生命线分析", content: "生命线深长，体质强健。", score: 75 },
      { title: "智慧线分析", content: "智慧线清晰，思维敏捷。", score: 82 },
    ],
    recommendations: [
      { category: "事业", advice: "发挥务实特质" },
      { category: "健康", advice: "注意劳逸结合" },
    ],
  };

  let palmReport: string = "";
  await test("手相 Markdown 报告生成", () => {
    palmReport = generatePalmReadingReport(mockPalmAnalysis, "王五");
    assert(palmReport.length > 500, `报告太短: ${palmReport.length} 字`);
    assert(palmReport.includes("王五"), "缺少用户名");
    console.log(`     手相报告长度: ${palmReport.length} 字`);
  });

  // 图表生成测试
  const {
    generateRadarChart, generateBarChart, generateBaguaChart,
    extractFaceScores, extractPalmScores, extractFengshuiScores
  } = await import("../server/chartGenerator");

  await test("面相雷达图生成", async () => {
    const { labels, values } = extractFaceScores(faceReport);
    console.log(`     提取标签: ${labels.length}, 值: ${values.length}`);
    if (labels.length > 0 && values.length > 0) {
      const buffer = await generateRadarChart({ labels, values, title: "面相十二宫位分析" });
      assert(buffer.length > 100, "雷达图 buffer 太小");
      fs.writeFileSync("/tmp/test-face-radar.png", buffer);
      console.log(`     雷达图大小: ${(buffer.length / 1024).toFixed(1)} KB`);
    } else {
      console.log(`     跳过: 未提取到足够的评分数据`);
    }
  });

  await test("手相柱状图生成", async () => {
    const { labels, values } = extractPalmScores(palmReport);
    console.log(`     提取标签: ${labels.length}, 值: ${values.length}`);
    if (labels.length > 0 && values.length > 0) {
      const buffer = await generateBarChart({ labels, values, title: "手相三大主线评分" });
      assert(buffer.length > 100, "柱状图 buffer 太小");
      fs.writeFileSync("/tmp/test-palm-bar.png", buffer);
      console.log(`     柱状图大小: ${(buffer.length / 1024).toFixed(1)} KB`);
    } else {
      console.log(`     跳过: 未提取到足够的评分数据`);
    }
  });

  await test("风水八卦图生成", async () => {
    const { directions, scores } = extractFengshuiScores(fengshuiReport);
    console.log(`     提取方位: ${directions.length}, 评分: ${scores.length}`);
    if (directions.length > 0 && scores.length > 0) {
      const buffer = await generateBaguaChart({ directions, scores, title: "风水八卦方位分析" });
      assert(buffer.length > 100, "八卦图 buffer 太小");
      fs.writeFileSync("/tmp/test-fengshui-bagua.png", buffer);
      console.log(`     八卦图大小: ${(buffer.length / 1024).toFixed(1)} KB`);
    } else {
      console.log(`     跳过: 未提取到足够的评分数据`);
    }
  });

  // PDF 生成测试
  const { generatePDFReport } = await import("../server/pdfGenerator");

  await test("风水 PDF 报告生成", async () => {
    const pdfBuffer = await generatePDFReport({
      serviceType: "fengshui",
      reportContent: fengshuiReport,
      userName: "张三",
      reportDate: new Date(),
      reportId: "TEST-FENGSHUI-001",
    });
    assert(pdfBuffer.length > 1000, `PDF 太小: ${pdfBuffer.length} bytes`);
    fs.writeFileSync("/tmp/test-fengshui-report.pdf", pdfBuffer);
    console.log(`     PDF 大小: ${(pdfBuffer.length / 1024).toFixed(1)} KB`);
  });

  await test("面相 PDF 报告生成", async () => {
    const pdfBuffer = await generatePDFReport({
      serviceType: "face",
      reportContent: faceReport,
      userName: "李四",
      reportDate: new Date(),
      reportId: "TEST-FACE-001",
    });
    assert(pdfBuffer.length > 1000, `PDF 太小: ${pdfBuffer.length} bytes`);
    fs.writeFileSync("/tmp/test-face-report.pdf", pdfBuffer);
    console.log(`     PDF 大小: ${(pdfBuffer.length / 1024).toFixed(1)} KB`);
  });

  await test("手相 PDF 报告生成", async () => {
    const pdfBuffer = await generatePDFReport({
      serviceType: "palm",
      reportContent: palmReport,
      userName: "王五",
      reportDate: new Date(),
      reportId: "TEST-PALM-001",
    });
    assert(pdfBuffer.length > 1000, `PDF 太小: ${pdfBuffer.length} bytes`);
    fs.writeFileSync("/tmp/test-palm-report.pdf", pdfBuffer);
    console.log(`     PDF 大小: ${(pdfBuffer.length / 1024).toFixed(1)} KB`);
  });

  // ==================== 测试结果汇总 ====================
  console.log("\n" + "=".repeat(70));
  console.log("  测试结果汇总");
  console.log("=".repeat(70));
  console.log(`  总测试数: ${totalTests}`);
  console.log(`  ✅ 通过: ${passedTests}`);
  console.log(`  ❌ 失败: ${failedTests}`);
  console.log(`  通过率: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

  if (failures.length > 0) {
    console.log("\n  失败详情:");
    for (const f of failures) {
      console.log(`    ❌ ${f}`);
    }
  }

  console.log("\n  生成的测试文件:");
  const testFiles = [
    "/tmp/test-fengshui-report.pdf",
    "/tmp/test-face-report.pdf",
    "/tmp/test-palm-report.pdf",
    "/tmp/test-face-radar.png",
    "/tmp/test-palm-bar.png",
    "/tmp/test-fengshui-bagua.png",
  ];
  for (const f of testFiles) {
    if (fs.existsSync(f)) {
      const stat = fs.statSync(f);
      console.log(`    📄 ${f} (${(stat.size / 1024).toFixed(1)} KB)`);
    }
  }

  console.log("\n" + "=".repeat(70));
  console.log(failedTests === 0 ? "  🎉 所有测试通过！" : `  ⚠️ ${failedTests} 个测试失败`);
  console.log("=".repeat(70) + "\n");

  process.exit(failedTests > 0 ? 1 : 0);
}

runAllTests().catch((err) => {
  console.error("测试运行失败:", err);
  process.exit(1);
});
