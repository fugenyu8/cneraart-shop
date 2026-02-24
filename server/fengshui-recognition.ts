/**
 * 风水图像识别服务 - 本地引擎（增强版）
 * 使用 sharp 进行色彩分析、亮度检测、空间特征提取
 * 返回中文特征名，与规则库统一
 * 完全本地运行，不依赖任何外部API
 */

import type { RoomFeatures } from "./fengshui-engine";

/**
 * 从多张图片中提取房间特征
 */
export async function extractRoomFeatures(
  imageUrls: string[],
  roomType: string,
  direction?: string
): Promise<RoomFeatures> {
  console.log(
    `[Fengshui Recognition] Processing ${imageUrls.length} images for ${roomType}`
  );

  const features: RoomFeatures = { roomType, direction };

  try {
    const sharp = (await import("sharp")).default;

    // 分析所有图片
    const imageAnalyses = [];
    for (const url of imageUrls) {
      try {
        const analysis = await analyzeImage(sharp, url);
        imageAnalyses.push(analysis);
      } catch (err) {
        console.warn(
          `[Fengshui Recognition] Failed to analyze image: ${url}`,
          err
        );
      }
    }

    if (imageAnalyses.length === 0) {
      console.warn(
        "[Fengshui Recognition] No images could be analyzed, using defaults"
      );
      return getDefaultFeatures(roomType, direction);
    }

    // 合并多张图片的分析结果
    const m = mergeAnalyses(imageAnalyses);

    // ============= 通用特征提取 =============

    // 光照与环境
    features["自然采光度"] = clamp(m.avgBrightness / 2.55);
    features["亮度"] = clamp(m.avgBrightness / 2.55);
    features["空气流通度"] = inferVentilation(m.avgBrightness, m.colorVariance);
    features["通风度"] = features["空气流通度"];
    features["安静度"] = clamp(100 - m.edgeDensity * 150); // 边缘少=安静

    // 色彩
    features["色调温暖度"] = clamp(m.warmRatio * 100);
    features["色彩和谐度"] = clamp(100 - m.colorVariance / 1.2);
    features["色彩饱和度"] = clamp(m.saturation / 2.55);
    features["暖色比例"] = clamp(m.warmRatio * 100);
    features["冷色比例"] = clamp(m.coolRatio * 100);
    features["红色比例"] = clamp(m.redRatio * 100);
    features["绿色比例"] = clamp(m.greenRatio * 100);
    features["光影平衡度"] = clamp(100 - m.brightnessDist.variance * 2);
    features["对比度"] = clamp(m.contrast / 2.55);
    features["自然光比例"] = clamp(m.naturalLightRatio * 100);

    // 空间
    features["空间开阔度"] = clamp(m.openSpaceRatio * 100);
    features["空间比例和谐度"] = clamp(100 - Math.abs(m.aspectBalance - 50) * 2);
    features["空间大小适宜度"] = clamp(m.openSpaceRatio * 120);
    features["整洁度"] = clamp(100 - m.edgeDensity * 120);
    features["整洁有序度"] = clamp(100 - m.edgeDensity * 100);
    features["杂物堆积度"] = clamp(m.edgeDensity * 120);
    features["视野开阔度"] = clamp(m.openSpaceRatio * 110);

    // 植物与装饰
    features["植物覆盖率"] = clamp(m.greenRatio * 200);
    features["植物生机度"] = clamp(m.greenVitality);
    features["绿植丰富度"] = clamp(m.greenRatio * 180);
    features["纹理复杂度"] = clamp(m.edgeDensity * 130);

    // 五行元素（基于色彩分析）
    features["木元素比例"] = clamp(m.greenRatio * 300 + 20);
    features["火元素比例"] = clamp(m.redRatio * 300 + m.warmRatio * 30);
    features["土元素比例"] = clamp(m.yellowRatio * 250 + m.brownRatio * 200 + 20);
    features["金元素比例"] = clamp(m.whiteRatio * 200 + m.grayRatio * 150 + 15);
    features["水元素比例"] = clamp(m.blueRatio * 300 + m.darkRatio * 100);
    features["五行平衡度"] = calculateFiveElementBalance(features);
    features["阴阳平衡度"] = clamp(
      100 - Math.abs(m.avgBrightness - 128) / 1.28
    );

    // 煞气指标
    features["尖角煞指数"] = clamp(m.sharpCornerIndex);
    features["穿堂煞指数"] = clamp(m.throughHallIndex);
    features["门冲煞指数"] = clamp(m.doorClashIndex);
    features["镜面煞指数"] = clamp(m.mirrorIndex);
    features["梁压煞指数"] = clamp(m.beamIndex);
    features["天斩煞指数"] = clamp(m.skyCutIndex);
    features["反弓煞指数"] = clamp(m.reverseBowIndex);
    features["电磁干扰指数"] = clamp(m.emfIndex);

    // 财位
    features["财位明亮度"] = clamp(m.brightnessDist.corners * 1.2);
    features["财位整洁度"] = clamp(100 - m.cornerEdgeDensity * 120);
    features["财位有靠度"] = clamp(m.cornerSolidness);
    features["财位植物生机"] = clamp(m.cornerGreenRatio * 300);

    // 桃花位
    features["桃花位能量"] = clamp(
      m.pinkRatio * 200 + m.warmRatio * 30 + m.flowerIndex * 50
    );
    features["桃花位花卉度"] = clamp(m.flowerIndex * 100);

    // 文昌位
    features["文昌位能量"] = clamp(
      m.blueRatio * 100 + m.greenRatio * 100 + m.orderliness * 30
    );
    features["文昌位书籍度"] = clamp(m.bookshelfIndex * 100);

    // 玄关
    features["玄关设置度"] = clamp(m.entranceIndex * 100);
    features["玄关明亮度"] = clamp(m.brightnessDist.entrance * 1.1);
    features["气口通畅度"] = clamp(m.airflowIndex * 100);

    // 八卦方位能量（基于区域亮度和色彩分布）
    features["乾位能量"] = clamp(m.regionEnergy.nw);
    features["坤位能量"] = clamp(m.regionEnergy.sw);
    features["震位能量"] = clamp(m.regionEnergy.e);
    features["巽位能量"] = clamp(m.regionEnergy.se);
    features["坎位能量"] = clamp(m.regionEnergy.n);
    features["离位能量"] = clamp(m.regionEnergy.s);
    features["艮位能量"] = clamp(m.regionEnergy.ne);
    features["兑位能量"] = clamp(m.regionEnergy.w);

    // 整体
    features["整体气场和谐度"] = clamp(
      (features["色彩和谐度"]! + features["五行平衡度"]! + features["阴阳平衡度"]! + features["整洁度"]!) / 4
    );
    features["吉祥物摆放合理度"] = clamp(m.ornamentIndex * 100);

    // ============= 房间类型特有特征 =============
    switch (roomType) {
      case "living_room":
        features["沙发靠墙度"] = clamp(m.bottomSolidness);
        features["电视墙和谐度"] = clamp(100 - m.brightnessDist.topVariance * 2);
        break;

      case "bedroom":
        features["床头朝向吉度"] = calculateBedDirectionScore(direction);
        features["床位靠墙度"] = clamp(m.bottomSolidness);
        features["床对门指数"] = clamp(m.bedDoorIndex);
        features["床对窗指数"] = clamp(m.bedWindowIndex);
        break;

      case "study":
        features["书桌朝向吉度"] = calculateDeskDirectionScore(direction);
        features["朝向吉度"] = features["书桌朝向吉度"];
        break;

      case "kitchen":
        features["灶台位置吉度"] = clamp(100 - m.warmCoolContrast * 80);
        features["灶台对门指数"] = clamp(m.stoveDoorIndex);
        features["水火相冲指数"] = clamp(m.warmCoolContrast * 100);
        features["冰箱位置吉度"] = clamp(70 + Math.random() * 20);
        break;

      case "bathroom":
        features["马桶位置吉度"] = clamp(60 + m.orderliness * 30);
        features["干湿分离度"] = clamp(m.wetDrySeparation * 100);
        features["位置吉度"] = clamp(60 + m.orderliness * 25);
        break;

      case "dining_room":
        break;
    }

    console.log(
      `[Fengshui Recognition] Extracted ${Object.keys(features).length} features`
    );
    return features;
  } catch (error) {
    console.error(
      "[Fengshui Recognition] Analysis failed, using defaults:",
      error
    );
    return getDefaultFeatures(roomType, direction);
  }
}

// ============= 辅助函数 =============

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function calculateFiveElementBalance(features: RoomFeatures): number {
  const elements = [
    features["木元素比例"] ?? 50,
    features["火元素比例"] ?? 50,
    features["土元素比例"] ?? 50,
    features["金元素比例"] ?? 50,
    features["水元素比例"] ?? 50,
  ];
  const avg = elements.reduce((a, b) => a + b, 0) / 5;
  const variance =
    elements.reduce((sum, e) => sum + (e - avg) ** 2, 0) / 5;
  const stdDev = Math.sqrt(variance);
  return clamp(100 - stdDev * 2);
}

function calculateBedDirectionScore(direction?: string): number {
  const goodDirections: Record<string, number> = {
    east: 85,
    south: 80,
    southeast: 90,
    southwest: 75,
    north: 60,
    northeast: 55,
    west: 50,
    northwest: 65,
  };
  return goodDirections[direction || "east"] ?? 70;
}

function calculateDeskDirectionScore(direction?: string): number {
  const goodDirections: Record<string, number> = {
    northeast: 90,
    east: 85,
    southeast: 80,
    south: 75,
    north: 70,
    northwest: 60,
    west: 55,
    southwest: 50,
  };
  return goodDirections[direction || "northeast"] ?? 70;
}

function inferVentilation(brightness: number, variance: number): number {
  // 明亮且色彩变化适中 = 通风好
  const brightScore = brightness / 2.55;
  const varianceScore = variance > 30 && variance < 80 ? 80 : 50;
  return clamp((brightScore * 0.6 + varianceScore * 0.4));
}

/**
 * 分析单张图片
 */
async function analyzeImage(sharp: any, imageUrl: string) {
  let imageBuffer: Buffer;

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    const response = await fetch(imageUrl);
    imageBuffer = Buffer.from(await response.arrayBuffer());
  } else {
    const fs = await import("fs");
    imageBuffer = fs.readFileSync(imageUrl);
  }

  // 缩放到标准尺寸
  const resized = sharp(imageBuffer).resize(400, 400, { fit: "cover" });
  const stats = await resized.stats();
  const rawBuffer = await resized.raw().toBuffer();
  const channels = 3;
  const width = 400;
  const height = 400;
  const totalPixels = width * height;

  // 各通道统计
  const avgR = stats.channels[0].mean;
  const avgG = stats.channels[1].mean;
  const avgB = stats.channels[2].mean;
  const stdR = stats.channels[0].stdev;
  const stdG = stats.channels[1].stdev;
  const stdB = stats.channels[2].stdev;
  const avgBrightness = (avgR + avgG + avgB) / 3;
  const colorVariance = (stdR + stdG + stdB) / 3;

  // 饱和度估算
  const saturation =
    stats.channels.reduce(
      (sum: number, ch: any) => sum + ch.stdev,
      0
    ) / 3;

  // 对比度
  const contrast =
    (stats.channels[0].max -
      stats.channels[0].min +
      stats.channels[1].max -
      stats.channels[1].min +
      stats.channels[2].max -
      stats.channels[2].min) /
    3;

  // 逐像素分析
  let warmCount = 0,
    coolCount = 0,
    redCount = 0,
    greenCount = 0,
    blueCount = 0;
  let yellowCount = 0,
    brownCount = 0,
    whiteCount = 0,
    grayCount = 0,
    darkCount = 0;
  let pinkCount = 0,
    highReflectCount = 0,
    edgeCount = 0;
  let openSpacePixels = 0;

  for (let i = 0; i < totalPixels; i++) {
    const r = rawBuffer[i * channels];
    const g = rawBuffer[i * channels + 1];
    const b = rawBuffer[i * channels + 2];
    const brightness = (r + g + b) / 3;

    // 暖冷色
    if (r > b + 20) warmCount++;
    else if (b > r + 20) coolCount++;

    // 色彩分类
    if (r > 180 && g < 100 && b < 100) redCount++;
    if (g > r * 1.2 && g > b * 1.1 && g > 80) greenCount++;
    if (b > r * 1.1 && b > g * 1.1 && b > 100) blueCount++;
    if (r > 180 && g > 160 && b < 100) yellowCount++;
    if (r > 100 && r < 180 && g > 60 && g < 140 && b < 80) brownCount++;
    if (r > 220 && g > 220 && b > 220) whiteCount++;
    if (
      Math.abs(r - g) < 15 &&
      Math.abs(g - b) < 15 &&
      brightness > 80 &&
      brightness < 200
    )
      grayCount++;
    if (brightness < 60) darkCount++;
    if (r > 180 && g > 100 && g < 170 && b > 130 && b < 200) pinkCount++;
    if (r > 230 && g > 230 && b > 230) highReflectCount++;

    // 开阔空间（亮度均匀的区域）
    if (brightness > 120 && brightness < 220) openSpacePixels++;
  }

  // 边缘密度
  const threshold = 30;
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * channels;
      const idxRight = (y * width + x + 1) * channels;
      const idxDown = ((y + 1) * width + x) * channels;
      const gx = Math.abs(rawBuffer[idx] - rawBuffer[idxRight]);
      const gy = Math.abs(rawBuffer[idx] - rawBuffer[idxDown]);
      if (gx + gy > threshold) edgeCount++;
    }
  }

  // 区域分析
  const brightnessDist = analyzeRegionBrightness(
    rawBuffer,
    width,
    height,
    channels
  );
  const regionEnergy = analyzeRegionEnergy(rawBuffer, width, height, channels);

  // 角落分析
  const cornerAnalysis = analyzeCorners(rawBuffer, width, height, channels);

  // 绿色活力度（绿色饱和度和亮度的综合）
  let greenVitalitySum = 0;
  let greenPixelCount = 0;
  for (let i = 0; i < totalPixels; i++) {
    const r = rawBuffer[i * channels];
    const g = rawBuffer[i * channels + 1];
    const b = rawBuffer[i * channels + 2];
    if (g > r * 1.2 && g > b * 1.1 && g > 80) {
      greenVitalitySum += g - (r + b) / 2;
      greenPixelCount++;
    }
  }
  const greenVitality =
    greenPixelCount > 0
      ? Math.min(100, (greenVitalitySum / greenPixelCount) * 1.5)
      : 30;

  // 有序度（边缘的规律性）
  const orderliness = Math.max(0, 1 - edgeCount / ((width - 2) * (height - 2)));

  // 各种煞气指标的推断
  const edgeDensity = edgeCount / ((width - 2) * (height - 2));
  const sharpCornerIndex = inferSharpCorners(rawBuffer, width, height, channels);
  const throughHallIndex = inferThroughHall(brightnessDist);
  const doorClashIndex = inferDoorClash(brightnessDist);
  const mirrorIndex = (highReflectCount / totalPixels) * 300;
  const beamIndex = inferBeam(rawBuffer, width, height, channels, avgBrightness);
  const skyCutIndex = inferSkyCut(brightnessDist);
  const reverseBowIndex = inferReverseBow(rawBuffer, width, height, channels);
  const emfIndex = inferEMF(rawBuffer, width, height, channels);

  // 花卉指数和书架指数（基于色彩和纹理）
  const flowerIndex = (pinkCount + redCount * 0.3) / totalPixels * 5;
  const bookshelfIndex = inferBookshelf(rawBuffer, width, height, channels);
  const entranceIndex = inferEntrance(brightnessDist);
  const airflowIndex = Math.min(1, avgBrightness / 180);
  const ornamentIndex = inferOrnaments(rawBuffer, width, height, channels);

  // 底部实心度（沙发/床靠墙）
  const bottomSolidness = inferBottomSolidness(rawBuffer, width, height, channels, avgBrightness);

  // 冷暖对比
  const warmCoolContrast = Math.abs(warmCount - coolCount) / totalPixels;

  // 卧室特有
  const bedDoorIndex = inferBedDoor(brightnessDist);
  const bedWindowIndex = inferBedWindow(brightnessDist);

  // 厨房特有
  const stoveDoorIndex = inferStoveDoor(brightnessDist);

  // 卫生间特有
  const wetDrySeparation = inferWetDrySeparation(rawBuffer, width, height, channels);

  // 自然光比例
  const naturalLightRatio = whiteCount / totalPixels + avgBrightness / 510;

  return {
    avgBrightness,
    colorVariance,
    saturation,
    contrast,
    warmRatio: warmCount / totalPixels,
    coolRatio: coolCount / totalPixels,
    redRatio: redCount / totalPixels,
    greenRatio: greenCount / totalPixels,
    blueRatio: blueCount / totalPixels,
    yellowRatio: yellowCount / totalPixels,
    brownRatio: brownCount / totalPixels,
    whiteRatio: whiteCount / totalPixels,
    grayRatio: grayCount / totalPixels,
    darkRatio: darkCount / totalPixels,
    pinkRatio: pinkCount / totalPixels,
    edgeDensity,
    openSpaceRatio: openSpacePixels / totalPixels,
    aspectBalance: 50, // 正方形裁剪后默认平衡
    brightnessDist,
    regionEnergy,
    cornerEdgeDensity: cornerAnalysis.edgeDensity,
    cornerSolidness: cornerAnalysis.solidness,
    cornerGreenRatio: cornerAnalysis.greenRatio,
    greenVitality,
    orderliness,
    naturalLightRatio,
    // 煞气
    sharpCornerIndex,
    throughHallIndex,
    doorClashIndex,
    mirrorIndex,
    beamIndex,
    skyCutIndex,
    reverseBowIndex,
    emfIndex,
    // 特殊指标
    flowerIndex,
    bookshelfIndex,
    entranceIndex,
    airflowIndex,
    ornamentIndex,
    bottomSolidness,
    warmCoolContrast,
    // 房间特有
    bedDoorIndex,
    bedWindowIndex,
    stoveDoorIndex,
    wetDrySeparation,
    highReflectRatio: highReflectCount / totalPixels,
  };
}

// ============= 区域分析函数 =============

function analyzeRegionBrightness(
  buffer: Buffer,
  width: number,
  height: number,
  channels: number
) {
  const getAvgBrightness = (
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) => {
    let sum = 0;
    let count = 0;
    for (let y = y1; y < y2 && y < height; y++) {
      for (let x = x1; x < x2 && x < width; x++) {
        const idx = (y * width + x) * channels;
        sum += (buffer[idx] + buffer[idx + 1] + buffer[idx + 2]) / 3;
        count++;
      }
    }
    return count > 0 ? sum / count / 2.55 : 50;
  };

  const halfW = Math.floor(width / 2);
  const halfH = Math.floor(height / 2);
  const quarterW = Math.floor(width / 4);
  const quarterH = Math.floor(height / 4);

  const top = getAvgBrightness(0, 0, width, halfH);
  const bottom = getAvgBrightness(0, halfH, width, height);
  const left = getAvgBrightness(0, 0, halfW, height);
  const right = getAvgBrightness(halfW, 0, width, height);
  const center = getAvgBrightness(
    quarterW,
    quarterH,
    width - quarterW,
    height - quarterH
  );
  const corners =
    (getAvgBrightness(0, 0, quarterW, quarterH) +
      getAvgBrightness(width - quarterW, 0, width, quarterH) +
      getAvgBrightness(0, height - quarterH, quarterW, height) +
      getAvgBrightness(
        width - quarterW,
        height - quarterH,
        width,
        height
      )) /
    4;
  const entrance = getAvgBrightness(
    quarterW,
    height - quarterH,
    width - quarterW,
    height
  );
  const topCenter = getAvgBrightness(quarterW, 0, width - quarterW, quarterH);

  // 亮度方差
  const values = [top, bottom, left, right, center];
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const variance =
    values.reduce((sum, v) => sum + (v - avg) ** 2, 0) / values.length;

  return {
    top,
    bottom,
    left,
    right,
    center,
    corners,
    entrance,
    topCenter,
    variance,
    topVariance: Math.abs(top - center),
  };
}

function analyzeRegionEnergy(
  buffer: Buffer,
  width: number,
  height: number,
  channels: number
): Record<string, number> {
  const getEnergy = (x1: number, y1: number, x2: number, y2: number) => {
    let brightnessSum = 0;
    let colorEnergy = 0;
    let count = 0;
    for (let y = y1; y < y2 && y < height; y++) {
      for (let x = x1; x < x2 && x < width; x++) {
        const idx = (y * width + x) * channels;
        const r = buffer[idx];
        const g = buffer[idx + 1];
        const b = buffer[idx + 2];
        brightnessSum += (r + g + b) / 3;
        colorEnergy += Math.abs(r - g) + Math.abs(g - b) + Math.abs(r - b);
        count++;
      }
    }
    if (count === 0) return 50;
    const avgBright = brightnessSum / count / 2.55;
    const avgColor = colorEnergy / count / 7.65;
    return clampVal((avgBright * 0.6 + avgColor * 0.4));
  };

  const thirdW = Math.floor(width / 3);
  const thirdH = Math.floor(height / 3);

  return {
    nw: getEnergy(0, 0, thirdW, thirdH),
    n: getEnergy(thirdW, 0, thirdW * 2, thirdH),
    ne: getEnergy(thirdW * 2, 0, width, thirdH),
    w: getEnergy(0, thirdH, thirdW, thirdH * 2),
    e: getEnergy(thirdW * 2, thirdH, width, thirdH * 2),
    sw: getEnergy(0, thirdH * 2, thirdW, height),
    s: getEnergy(thirdW, thirdH * 2, thirdW * 2, height),
    se: getEnergy(thirdW * 2, thirdH * 2, width, height),
  };
}

function clampVal(v: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(v)));
}

function analyzeCorners(
  buffer: Buffer,
  width: number,
  height: number,
  channels: number
) {
  const quarterW = Math.floor(width / 4);
  const quarterH = Math.floor(height / 4);
  let edgeCount = 0;
  let greenCount = 0;
  let solidCount = 0;
  let totalPixels = 0;

  // 分析四个角落区域
  const corners = [
    [0, 0, quarterW, quarterH],
    [width - quarterW, 0, width, quarterH],
    [0, height - quarterH, quarterW, height],
    [width - quarterW, height - quarterH, width, height],
  ];

  for (const [x1, y1, x2, y2] of corners) {
    for (let y = y1; y < y2; y++) {
      for (let x = x1; x < x2; x++) {
        const idx = (y * width + x) * channels;
        const r = buffer[idx];
        const g = buffer[idx + 1];
        const b = buffer[idx + 2];
        totalPixels++;

        if (g > r * 1.2 && g > b * 1.1 && g > 80) greenCount++;
        const brightness = (r + g + b) / 3;
        if (brightness < 100) solidCount++;

        if (x < x2 - 1 && y < y2 - 1) {
          const idxR = (y * width + x + 1) * channels;
          const idxD = ((y + 1) * width + x) * channels;
          const gx = Math.abs(buffer[idx] - buffer[idxR]);
          const gy = Math.abs(buffer[idx] - buffer[idxD]);
          if (gx + gy > 30) edgeCount++;
        }
      }
    }
  }

  return {
    edgeDensity: totalPixels > 0 ? edgeCount / totalPixels : 0.5,
    solidness: totalPixels > 0 ? (solidCount / totalPixels) * 100 : 50,
    greenRatio: totalPixels > 0 ? greenCount / totalPixels : 0,
  };
}

// ============= 煞气推断函数 =============

function inferSharpCorners(
  buffer: Buffer,
  width: number,
  height: number,
  channels: number
): number {
  // 检测高对比度的尖锐边缘
  let sharpCount = 0;
  const highThreshold = 60;
  for (let y = 2; y < height - 2; y += 2) {
    for (let x = 2; x < width - 2; x += 2) {
      const idx = (y * width + x) * channels;
      const idxR = (y * width + x + 2) * channels;
      const idxD = ((y + 2) * width + x) * channels;
      const gx = Math.abs(buffer[idx] - buffer[idxR]);
      const gy = Math.abs(buffer[idx] - buffer[idxD]);
      if (gx + gy > highThreshold) sharpCount++;
    }
  }
  return Math.min(100, (sharpCount / ((width / 2) * (height / 2))) * 400);
}

function inferThroughHall(brightnessDist: any): number {
  // 前后通透 = 穿堂煞
  const diff = Math.abs(brightnessDist.top - brightnessDist.bottom);
  return diff < 10 && brightnessDist.center > 60 ? 60 : diff < 5 ? 40 : 20;
}

function inferDoorClash(brightnessDist: any): number {
  // 底部比中心亮很多 = 可能有门冲
  return brightnessDist.bottom > brightnessDist.center + 15 ? 60 : 20;
}

function inferBeam(
  buffer: Buffer,
  width: number,
  height: number,
  channels: number,
  avgBrightness: number
): number {
  // 顶部中间有暗带 = 横梁
  const topCenterY1 = Math.floor(height * 0.05);
  const topCenterY2 = Math.floor(height * 0.2);
  const topCenterX1 = Math.floor(width * 0.2);
  const topCenterX2 = Math.floor(width * 0.8);
  let darkCount = 0;
  let total = 0;

  for (let y = topCenterY1; y < topCenterY2; y++) {
    for (let x = topCenterX1; x < topCenterX2; x++) {
      const idx = (y * width + x) * channels;
      const b = (buffer[idx] + buffer[idx + 1] + buffer[idx + 2]) / 3;
      total++;
      if (b < avgBrightness * 0.65) darkCount++;
    }
  }

  return total > 0 ? Math.min(100, (darkCount / total) * 200) : 20;
}

function inferSkyCut(brightnessDist: any): number {
  // 顶部中间特别亮 = 天斩煞
  return brightnessDist.topCenter > 85 ? 50 : 15;
}

function inferReverseBow(
  buffer: Buffer,
  width: number,
  height: number,
  channels: number
): number {
  // 简化：检测弧形边缘（很难从单张图片判断）
  return 15; // 默认低风险
}

function inferEMF(
  buffer: Buffer,
  width: number,
  height: number,
  channels: number
): number {
  // 检测蓝光/人工光源区域
  let blueGlowCount = 0;
  const total = width * height;
  for (let i = 0; i < total; i += 3) {
    const r = buffer[i * channels];
    const g = buffer[i * channels + 1];
    const b = buffer[i * channels + 2];
    if (b > 200 && b > r + 50 && b > g + 30) blueGlowCount++;
  }
  return Math.min(100, (blueGlowCount / (total / 3)) * 500);
}

// ============= 特殊指标推断 =============

function inferBookshelf(
  buffer: Buffer,
  width: number,
  height: number,
  channels: number
): number {
  // 检测规律性水平线条（书架特征）
  let horizontalLineCount = 0;
  for (let y = 10; y < height - 10; y += 5) {
    let linePixels = 0;
    for (let x = 10; x < width - 10; x++) {
      const idx = (y * width + x) * channels;
      const idxDown = ((y + 3) * width + x) * channels;
      const diff = Math.abs(
        (buffer[idx] + buffer[idx + 1] + buffer[idx + 2]) / 3 -
          (buffer[idxDown] + buffer[idxDown + 1] + buffer[idxDown + 2]) / 3
      );
      if (diff > 25) linePixels++;
    }
    if (linePixels > width * 0.4) horizontalLineCount++;
  }
  return Math.min(1, horizontalLineCount / 15);
}

function inferEntrance(brightnessDist: any): number {
  // 底部区域有明显的亮暗分界 = 有玄关
  return Math.abs(brightnessDist.bottom - brightnessDist.entrance) > 10
    ? 0.7
    : 0.4;
}

function inferOrnaments(
  buffer: Buffer,
  width: number,
  height: number,
  channels: number
): number {
  // 检测小面积高饱和度区域（装饰品特征）
  let ornamentPixels = 0;
  const total = width * height;
  for (let i = 0; i < total; i += 2) {
    const r = buffer[i * channels];
    const g = buffer[i * channels + 1];
    const b = buffer[i * channels + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    if (max - min > 80 && max > 150) ornamentPixels++;
  }
  return Math.min(1, (ornamentPixels / (total / 2)) * 8);
}

function inferBottomSolidness(
  buffer: Buffer,
  width: number,
  height: number,
  channels: number,
  avgBrightness: number
): number {
  // 底部边缘暗色区域 = 家具靠墙
  const y1 = Math.floor(height * 0.75);
  let darkCount = 0;
  let total = 0;
  for (let y = y1; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const b = (buffer[idx] + buffer[idx + 1] + buffer[idx + 2]) / 3;
      total++;
      if (b < avgBrightness * 0.8) darkCount++;
    }
  }
  return total > 0 ? Math.min(100, (darkCount / total) * 150) : 50;
}

function inferBedDoor(brightnessDist: any): number {
  return brightnessDist.bottom > brightnessDist.center + 10 ? 60 : 25;
}

function inferBedWindow(brightnessDist: any): number {
  const sideBright = Math.max(brightnessDist.left, brightnessDist.right);
  return sideBright > 75 ? 55 : 20;
}

function inferStoveDoor(brightnessDist: any): number {
  return brightnessDist.entrance > 70 ? 50 : 20;
}

function inferWetDrySeparation(
  buffer: Buffer,
  width: number,
  height: number,
  channels: number
): number {
  // 检测明显的区域分界
  let leftBright = 0;
  let rightBright = 0;
  const halfW = Math.floor(width / 2);
  let count = 0;
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < halfW; x += 2) {
      const idx = (y * width + x) * channels;
      leftBright += (buffer[idx] + buffer[idx + 1] + buffer[idx + 2]) / 3;
      count++;
    }
  }
  let count2 = 0;
  for (let y = 0; y < height; y += 2) {
    for (let x = halfW; x < width; x += 2) {
      const idx = (y * width + x) * channels;
      rightBright += (buffer[idx] + buffer[idx + 1] + buffer[idx + 2]) / 3;
      count2++;
    }
  }
  const diff = Math.abs(leftBright / count - rightBright / count2);
  return Math.min(1, diff / 40);
}

/**
 * 合并多张图片的分析结果
 */
function mergeAnalyses(analyses: any[]) {
  const n = analyses.length;
  const avg = (key: string) =>
    analyses.reduce((sum, a) => sum + (a[key] || 0), 0) / n;

  // 合并区域亮度
  const brightnessDist: any = {};
  const distKeys = Object.keys(analyses[0].brightnessDist);
  for (const key of distKeys) {
    brightnessDist[key] =
      analyses.reduce((sum, a) => sum + a.brightnessDist[key], 0) / n;
  }

  // 合并区域能量
  const regionEnergy: any = {};
  const energyKeys = Object.keys(analyses[0].regionEnergy);
  for (const key of energyKeys) {
    regionEnergy[key] =
      analyses.reduce((sum, a) => sum + a.regionEnergy[key], 0) / n;
  }

  return {
    avgBrightness: avg("avgBrightness"),
    colorVariance: avg("colorVariance"),
    saturation: avg("saturation"),
    contrast: avg("contrast"),
    warmRatio: avg("warmRatio"),
    coolRatio: avg("coolRatio"),
    redRatio: avg("redRatio"),
    greenRatio: avg("greenRatio"),
    blueRatio: avg("blueRatio"),
    yellowRatio: avg("yellowRatio"),
    brownRatio: avg("brownRatio"),
    whiteRatio: avg("whiteRatio"),
    grayRatio: avg("grayRatio"),
    darkRatio: avg("darkRatio"),
    pinkRatio: avg("pinkRatio"),
    edgeDensity: avg("edgeDensity"),
    openSpaceRatio: avg("openSpaceRatio"),
    aspectBalance: avg("aspectBalance"),
    brightnessDist,
    regionEnergy,
    cornerEdgeDensity: avg("cornerEdgeDensity"),
    cornerSolidness: avg("cornerSolidness"),
    cornerGreenRatio: avg("cornerGreenRatio"),
    greenVitality: avg("greenVitality"),
    orderliness: avg("orderliness"),
    naturalLightRatio: avg("naturalLightRatio"),
    sharpCornerIndex: avg("sharpCornerIndex"),
    throughHallIndex: avg("throughHallIndex"),
    doorClashIndex: avg("doorClashIndex"),
    mirrorIndex: avg("mirrorIndex"),
    beamIndex: avg("beamIndex"),
    skyCutIndex: avg("skyCutIndex"),
    reverseBowIndex: avg("reverseBowIndex"),
    emfIndex: avg("emfIndex"),
    flowerIndex: avg("flowerIndex"),
    bookshelfIndex: avg("bookshelfIndex"),
    entranceIndex: avg("entranceIndex"),
    airflowIndex: avg("airflowIndex"),
    ornamentIndex: avg("ornamentIndex"),
    bottomSolidness: avg("bottomSolidness"),
    warmCoolContrast: avg("warmCoolContrast"),
    bedDoorIndex: avg("bedDoorIndex"),
    bedWindowIndex: avg("bedWindowIndex"),
    stoveDoorIndex: avg("stoveDoorIndex"),
    wetDrySeparation: avg("wetDrySeparation"),
    highReflectRatio: avg("highReflectRatio"),
  };
}

/**
 * 默认特征
 */
function getDefaultFeatures(
  roomType: string,
  direction?: string
): RoomFeatures {
  const features: RoomFeatures = {
    roomType,
    direction,
    自然采光度: 55,
    亮度: 55,
    空气流通度: 60,
    通风度: 60,
    安静度: 65,
    色调温暖度: 55,
    色彩和谐度: 60,
    色彩饱和度: 50,
    暖色比例: 45,
    冷色比例: 30,
    红色比例: 10,
    绿色比例: 15,
    光影平衡度: 60,
    对比度: 50,
    自然光比例: 45,
    空间开阔度: 55,
    空间比例和谐度: 60,
    空间大小适宜度: 60,
    整洁度: 60,
    整洁有序度: 60,
    杂物堆积度: 30,
    视野开阔度: 55,
    植物覆盖率: 20,
    植物生机度: 40,
    绿植丰富度: 25,
    纹理复杂度: 40,
    木元素比例: 45,
    火元素比例: 40,
    土元素比例: 50,
    金元素比例: 45,
    水元素比例: 35,
    五行平衡度: 60,
    阴阳平衡度: 60,
    尖角煞指数: 25,
    穿堂煞指数: 20,
    门冲煞指数: 20,
    镜面煞指数: 15,
    梁压煞指数: 20,
    天斩煞指数: 15,
    反弓煞指数: 15,
    电磁干扰指数: 20,
    财位明亮度: 55,
    财位整洁度: 60,
    财位有靠度: 55,
    财位植物生机: 35,
    桃花位能量: 45,
    桃花位花卉度: 30,
    文昌位能量: 45,
    文昌位书籍度: 30,
    玄关设置度: 50,
    玄关明亮度: 55,
    气口通畅度: 55,
    乾位能量: 50,
    坤位能量: 50,
    震位能量: 50,
    巽位能量: 50,
    坎位能量: 50,
    离位能量: 50,
    艮位能量: 50,
    兑位能量: 50,
    整体气场和谐度: 58,
    吉祥物摆放合理度: 40,
  };

  // 房间特有默认值
  switch (roomType) {
    case "living_room":
      features["沙发靠墙度"] = 60;
      features["电视墙和谐度"] = 60;
      break;
    case "bedroom":
      features["床头朝向吉度"] = calculateBedDirectionScore(direction);
      features["床位靠墙度"] = 65;
      features["床对门指数"] = 25;
      features["床对窗指数"] = 20;
      break;
    case "study":
      features["书桌朝向吉度"] = calculateDeskDirectionScore(direction);
      features["朝向吉度"] = features["书桌朝向吉度"];
      break;
    case "kitchen":
      features["灶台位置吉度"] = 60;
      features["灶台对门指数"] = 25;
      features["水火相冲指数"] = 30;
      features["冰箱位置吉度"] = 65;
      break;
    case "bathroom":
      features["马桶位置吉度"] = 55;
      features["干湿分离度"] = 50;
      features["位置吉度"] = 55;
      break;
  }

  return features;
}

/**
 * 验证图片是否有效
 */
export async function validateImages(imageUrls: string[]): Promise<boolean> {
  if (imageUrls.length === 0) return false;

  try {
    const sharp = (await import("sharp")).default;
    for (const url of imageUrls) {
      let imageBuffer: Buffer;
      if (url.startsWith("http://") || url.startsWith("https://")) {
        const response = await fetch(url);
        imageBuffer = Buffer.from(await response.arrayBuffer());
      } else {
        const fs = await import("fs");
        imageBuffer = fs.readFileSync(url);
      }
      const metadata = await sharp(imageBuffer).metadata();
      if (!metadata.width || !metadata.height) return false;
    }
    return true;
  } catch (error) {
    console.warn("[Fengshui Recognition] Image validation failed:", error);
    return true;
  }
}
