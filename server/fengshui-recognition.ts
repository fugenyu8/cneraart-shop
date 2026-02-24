/**
 * 风水图像识别服务 - 本地引擎
 * 使用 sharp 进行色彩分析、亮度检测、空间特征提取
 * 完全本地运行，不依赖任何外部API
 */

import type { RoomFeatures } from "./fengshui-engine";

// 色彩分类映射
const COLOR_NAMES: Record<string, string> = {
  warm_light: "beige",
  warm_medium: "light_yellow",
  warm_dark: "dark_brown",
  cool_light: "light_blue",
  cool_medium: "gray",
  cool_dark: "dark_blue",
  neutral_light: "white",
  neutral_medium: "beige",
  neutral_dark: "dark_gray",
  red_toned: "light_pink",
  green_toned: "light_green",
};

/**
 * 从多张图片中提取房间特征
 * 使用 sharp 进行真实的图像分析
 */
export async function extractRoomFeatures(
  imageUrls: string[],
  roomType: string,
  direction?: string
): Promise<RoomFeatures> {
  console.log(`[Fengshui Recognition] Processing ${imageUrls.length} images for ${roomType}`);

  const features: RoomFeatures = {
    roomType,
    direction,
  };

  try {
    const sharp = (await import("sharp")).default;

    // 分析所有图片的色彩和亮度
    const imageAnalyses = [];
    for (const url of imageUrls) {
      try {
        const analysis = await analyzeImage(sharp, url);
        imageAnalyses.push(analysis);
      } catch (err) {
        console.warn(`[Fengshui Recognition] Failed to analyze image: ${url}`, err);
      }
    }

    if (imageAnalyses.length === 0) {
      console.warn("[Fengshui Recognition] No images could be analyzed, using defaults");
      return getDefaultFeatures(roomType, direction);
    }

    // 合并多张图片的分析结果
    const merged = mergeAnalyses(imageAnalyses);

    // 通用特征
    features.dominant_color = merged.dominantColor;
    features.lighting_quality = merged.lightingQuality;
    features.ventilation_quality = inferVentilationFromBrightness(merged.avgBrightness);

    // 根据色彩分布判断色彩平衡
    features.color_balance = merged.colorVariance < 30 ? "balanced" : "unbalanced";

    // 根据边缘密度推断是否有尖角物品
    features.has_sharp_corners = merged.edgeDensity > 0.35;

    // 根据绿色通道占比推断植物数量
    features.plant_count = Math.round(merged.greenRatio * 10);
    features.plant_at_wealth_position = merged.greenRatio > 0.15;

    // 根据蓝色通道占比推断是否有水景
    features.has_water_feature = merged.blueRatio > 0.25;

    // 根据房间类型设置特定特征
    switch (roomType) {
      case "bedroom":
        // 床的方向使用用户提供的方向
        features.bed_direction = direction || "east";
        // 通过图像亮度分布推断床是否面向门/窗
        features.bed_facing_door = merged.brightnessDist.bottom > merged.brightnessDist.top;
        features.bed_facing_window = merged.brightnessDist.right > 0.6 || merged.brightnessDist.left > 0.6;
        // 通过顶部暗区推断是否有横梁
        features.beam_above_bed = merged.brightnessDist.topCenter < merged.avgBrightness * 0.7;
        features.has_nightstand = true; // 默认有床头柜
        // 通过高反射区域推断是否有镜子对床
        features.mirror_facing_bed = merged.highReflectRatio > 0.08;
        break;

      case "living_room":
        // 通过底部区域的均匀度推断沙发是否靠墙
        features.sofa_against_wall = merged.brightnessDist.bottomEdge < merged.brightnessDist.center;
        // 通过角落亮度推断财位是否明亮
        features.wealth_position_bright = merged.brightnessDist.corners > merged.avgBrightness * 0.8;
        // 通过中心区域大小推断茶几尺寸
        features.coffee_table_size = merged.centerObjectRatio > 0.3 ? "too_large" : merged.centerObjectRatio < 0.1 ? "too_small" : "appropriate";
        break;

      case "study":
        features.desk_direction = direction || "northeast";
        // 通过中下部区域推断书桌是否靠墙
        features.desk_against_wall = merged.brightnessDist.bottomEdge < merged.avgBrightness * 0.9;
        // 通过特定物品的存在推断文昌塔
        features.has_wenchang_tower = merged.verticalObjectRatio > 0.05;
        break;

      case "kitchen":
        // 通过热色调和冷色调区域的相对位置推断灶台是否对水槽
        features.stove_facing_sink = merged.warmCoolContrast > 0.3;
        break;

      default:
        break;
    }

    console.log(`[Fengshui Recognition] Extracted features:`, features);
    return features;

  } catch (error) {
    console.error("[Fengshui Recognition] Analysis failed, using defaults:", error);
    return getDefaultFeatures(roomType, direction);
  }
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

  // 缩放到标准尺寸进行分析
  const resized = sharp(imageBuffer).resize(400, 400, { fit: "cover" });

  // 获取统计信息
  const stats = await resized.stats();

  // 获取原始像素数据
  const rawBuffer = await resized.raw().toBuffer();
  const channels = 3; // RGB
  const width = 400;
  const height = 400;
  const totalPixels = width * height;

  // 计算各通道平均值
  const avgR = stats.channels[0].mean;
  const avgG = stats.channels[1].mean;
  const avgB = stats.channels[2].mean;
  const avgBrightness = (avgR + avgG + avgB) / 3;

  // 计算色彩方差
  const stdR = stats.channels[0].stdev;
  const stdG = stats.channels[1].stdev;
  const stdB = stats.channels[2].stdev;
  const colorVariance = (stdR + stdG + stdB) / 3;

  // 分析区域亮度分布
  const brightnessDist = analyzeRegionBrightness(rawBuffer, width, height, channels);

  // 计算绿色和蓝色占比
  let greenCount = 0;
  let blueCount = 0;
  let highReflectCount = 0;

  for (let i = 0; i < totalPixels; i++) {
    const r = rawBuffer[i * channels];
    const g = rawBuffer[i * channels + 1];
    const b = rawBuffer[i * channels + 2];

    if (g > r * 1.2 && g > b * 1.1 && g > 80) greenCount++;
    if (b > r * 1.1 && b > g * 1.1 && b > 100) blueCount++;
    if (r > 220 && g > 220 && b > 220) highReflectCount++;
  }

  // 计算边缘密度（简单梯度）
  let edgeCount = 0;
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

  // 推断主色调
  const dominantColor = classifyDominantColor(avgR, avgG, avgB, colorVariance);

  // 计算中心物体占比和垂直物体占比
  const centerRegion = analyzeCenterRegion(rawBuffer, width, height, channels, avgBrightness);

  // 计算冷暖色对比
  let warmPixels = 0;
  let coolPixels = 0;
  for (let i = 0; i < totalPixels; i++) {
    const r = rawBuffer[i * channels];
    const b = rawBuffer[i * channels + 2];
    if (r > b + 20) warmPixels++;
    else if (b > r + 20) coolPixels++;
  }

  return {
    avgBrightness,
    colorVariance,
    dominantColor,
    greenRatio: greenCount / totalPixels,
    blueRatio: blueCount / totalPixels,
    highReflectRatio: highReflectCount / totalPixels,
    edgeDensity: edgeCount / ((width - 2) * (height - 2)),
    brightnessDist,
    centerObjectRatio: centerRegion.objectRatio,
    verticalObjectRatio: centerRegion.verticalRatio,
    warmCoolContrast: Math.abs(warmPixels - coolPixels) / totalPixels,
  };
}

/**
 * 分析区域亮度分布
 */
function analyzeRegionBrightness(
  buffer: Buffer,
  width: number,
  height: number,
  channels: number
) {
  const getAvgBrightness = (x1: number, y1: number, x2: number, y2: number) => {
    let sum = 0;
    let count = 0;
    for (let y = y1; y < y2 && y < height; y++) {
      for (let x = x1; x < x2 && x < width; x++) {
        const idx = (y * width + x) * channels;
        sum += (buffer[idx] + buffer[idx + 1] + buffer[idx + 2]) / 3;
        count++;
      }
    }
    return count > 0 ? sum / count : 128;
  };

  const halfW = Math.floor(width / 2);
  const halfH = Math.floor(height / 2);
  const quarterW = Math.floor(width / 4);
  const quarterH = Math.floor(height / 4);

  return {
    top: getAvgBrightness(0, 0, width, halfH),
    bottom: getAvgBrightness(0, halfH, width, height),
    left: getAvgBrightness(0, 0, halfW, height),
    right: getAvgBrightness(halfW, 0, width, height),
    center: getAvgBrightness(quarterW, quarterH, width - quarterW, height - quarterH),
    topCenter: getAvgBrightness(quarterW, 0, width - quarterW, quarterH),
    bottomEdge: getAvgBrightness(0, height - quarterH, width, height),
    corners: (
      getAvgBrightness(0, 0, quarterW, quarterH) +
      getAvgBrightness(width - quarterW, 0, width, quarterH) +
      getAvgBrightness(0, height - quarterH, quarterW, height) +
      getAvgBrightness(width - quarterW, height - quarterH, width, height)
    ) / 4,
  };
}

/**
 * 分析中心区域物体特征
 */
function analyzeCenterRegion(
  buffer: Buffer,
  width: number,
  height: number,
  channels: number,
  avgBrightness: number
) {
  const centerX1 = Math.floor(width * 0.3);
  const centerX2 = Math.floor(width * 0.7);
  const centerY1 = Math.floor(height * 0.3);
  const centerY2 = Math.floor(height * 0.7);

  let objectPixels = 0;
  let totalCenter = 0;

  for (let y = centerY1; y < centerY2; y++) {
    for (let x = centerX1; x < centerX2; x++) {
      const idx = (y * width + x) * channels;
      const brightness = (buffer[idx] + buffer[idx + 1] + buffer[idx + 2]) / 3;
      totalCenter++;
      if (Math.abs(brightness - avgBrightness) > 40) objectPixels++;
    }
  }

  // 检测垂直物体（上半部分中心的暗色区域）
  let verticalPixels = 0;
  const vx1 = Math.floor(width * 0.4);
  const vx2 = Math.floor(width * 0.6);
  const vy1 = Math.floor(height * 0.1);
  const vy2 = Math.floor(height * 0.5);
  let totalVertical = 0;

  for (let y = vy1; y < vy2; y++) {
    for (let x = vx1; x < vx2; x++) {
      const idx = (y * width + x) * channels;
      const brightness = (buffer[idx] + buffer[idx + 1] + buffer[idx + 2]) / 3;
      totalVertical++;
      if (brightness < avgBrightness * 0.6) verticalPixels++;
    }
  }

  return {
    objectRatio: totalCenter > 0 ? objectPixels / totalCenter : 0,
    verticalRatio: totalVertical > 0 ? verticalPixels / totalVertical : 0,
  };
}

/**
 * 分类主色调
 */
function classifyDominantColor(
  r: number,
  g: number,
  b: number,
  variance: number
): string {
  const brightness = (r + g + b) / 3;

  // 判断色温
  if (r > g + 30 && r > b + 30) {
    return brightness > 180 ? "light_pink" : "dark_brown";
  }
  if (g > r + 20 && g > b + 20) {
    return "light_green";
  }
  if (b > r + 20 && b > g + 20) {
    return brightness > 150 ? "light_blue" : "dark_blue";
  }

  // 中性色
  if (brightness > 200) return "white";
  if (brightness > 160) return "beige";
  if (brightness > 120) return "gray";
  if (brightness > 80) return "dark_gray";

  // 暖色调
  if (r > b) {
    return brightness > 150 ? "light_yellow" : "beige";
  }

  return "gray";
}

/**
 * 根据亮度推断通风质量
 */
function inferVentilationFromBrightness(avgBrightness: number): string {
  if (avgBrightness > 160) return "good";
  if (avgBrightness > 100) return "moderate";
  return "poor";
}

/**
 * 合并多张图片的分析结果
 */
function mergeAnalyses(analyses: any[]) {
  const n = analyses.length;

  const avg = (key: string) =>
    analyses.reduce((sum, a) => sum + (a[key] || 0), 0) / n;

  // 取出现最多的主色调
  const colorCounts: Record<string, number> = {};
  analyses.forEach((a) => {
    colorCounts[a.dominantColor] = (colorCounts[a.dominantColor] || 0) + 1;
  });
  const dominantColor = Object.entries(colorCounts).sort(
    (a, b) => b[1] - a[1]
  )[0][0];

  // 合并亮度分布
  const brightnessDist: Record<string, number> = {};
  const distKeys = Object.keys(analyses[0].brightnessDist);
  for (const key of distKeys) {
    brightnessDist[key] =
      analyses.reduce((sum, a) => sum + a.brightnessDist[key], 0) / n;
  }

  const avgBrightness = avg("avgBrightness");

  return {
    avgBrightness,
    colorVariance: avg("colorVariance"),
    dominantColor,
    greenRatio: avg("greenRatio"),
    blueRatio: avg("blueRatio"),
    highReflectRatio: avg("highReflectRatio"),
    edgeDensity: avg("edgeDensity"),
    brightnessDist,
    centerObjectRatio: avg("centerObjectRatio"),
    verticalObjectRatio: avg("verticalObjectRatio"),
    warmCoolContrast: avg("warmCoolContrast"),
    lightingQuality:
      avgBrightness > 160 ? "good" : avgBrightness > 100 ? "moderate" : "poor",
  };
}

/**
 * 默认特征（当分析失败时使用）
 */
function getDefaultFeatures(roomType: string, direction?: string): RoomFeatures {
  const features: RoomFeatures = {
    roomType,
    direction,
    dominant_color: "beige",
    lighting_quality: "moderate",
    ventilation_quality: "moderate",
    color_balance: "balanced",
    has_sharp_corners: false,
    plant_count: 1,
  };

  switch (roomType) {
    case "bedroom":
      features.bed_direction = direction || "east";
      features.bed_facing_door = false;
      features.bed_facing_window = false;
      features.beam_above_bed = false;
      features.has_nightstand = true;
      features.mirror_facing_bed = false;
      break;
    case "living_room":
      features.sofa_against_wall = true;
      features.wealth_position_bright = true;
      features.coffee_table_size = "appropriate";
      features.plant_at_wealth_position = false;
      features.has_water_feature = false;
      break;
    case "study":
      features.desk_direction = direction || "northeast";
      features.desk_against_wall = true;
      features.has_wenchang_tower = false;
      break;
    case "kitchen":
      features.stove_facing_sink = false;
      break;
  }

  return features;
}

/**
 * 验证图片是否有效
 */
export async function validateImages(imageUrls: string[]): Promise<boolean> {
  if (imageUrls.length === 0) {
    return false;
  }

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
      if (!metadata.width || !metadata.height) {
        return false;
      }
    }

    return true;
  } catch (error) {
    console.warn("[Fengshui Recognition] Image validation failed:", error);
    return true; // 验证失败不阻塞流程
  }
}
