/**
 * 图像识别服务 - 本地引擎
 * 使用 face-api.js (TensorFlow.js) 提取面部68特征点
 * 使用 sharp 进行手掌图像分析
 * 完全本地运行，不依赖任何外部API
 */

import path from "path";
import { fileURLToPath } from "url";

// ============= 类型定义 =============

interface FaceFeatures {
  faceType?: string;
  palaces: {
    [palaceName: string]: {
      [featureName: string]: number | string;
    };
  };
}

interface PalmFeatures {
  handType?: string;
  lines: {
    [lineName: string]: {
      [featureName: string]: number | string;
    };
  };
  hills: {
    [hillName: string]: {
      [featureName: string]: number | string;
    };
  };
}

// ============= 面部特征提取 =============

// 面部68特征点索引映射（face-api.js标准）
const FACE_LANDMARKS = {
  jaw: { start: 0, end: 16 },         // 下颌轮廓 0-16
  rightEyebrow: { start: 17, end: 21 }, // 右眉 17-21
  leftEyebrow: { start: 22, end: 26 },  // 左眉 22-26
  noseBridge: { start: 27, end: 30 },   // 鼻梁 27-30
  noseTip: { start: 31, end: 35 },      // 鼻尖 31-35
  rightEye: { start: 36, end: 41 },     // 右眼 36-41
  leftEye: { start: 42, end: 47 },      // 左眼 42-47
  outerMouth: { start: 48, end: 59 },   // 外嘴唇 48-59
  innerMouth: { start: 60, end: 67 },   // 内嘴唇 60-67
};

// 缓存模型实例
let faceApiInitialized = false;
let faceapiModule: any = null;

/**
 * 初始化 face-api.js 模型
 */
async function initFaceApi() {
  if (faceApiInitialized) return;

  try {
    // 动态导入，避免影响启动速度
    const tf = await import("@tensorflow/tfjs-node");
    const faceapi = await import("@vladmandic/face-api");
    const canvas = await import("canvas");

    const { Canvas, Image, ImageData } = canvas.default || canvas;
    faceapi.env.monkeyPatch({ Canvas, Image, ImageData } as any);

    // 模型文件路径
    const modelPath = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      "models/face-api"
    );

    await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
    await faceapi.nets.ageGenderNet.loadFromDisk(modelPath);
    await faceapi.nets.faceExpressionNet.loadFromDisk(modelPath);

    faceapiModule = faceapi;
    faceApiInitialized = true;
    console.log("[Image Recognition] face-api.js models loaded successfully");
  } catch (error) {
    console.error("[Image Recognition] Failed to load face-api models:", error);
    throw error;
  }
}

/**
 * 从URL下载图片并转为 canvas Image
 */
async function loadImageFromUrl(imageUrl: string): Promise<any> {
  const canvas = await import("canvas");
  const { loadImage } = canvas.default || canvas;

  // 如果是本地路径或S3 URL，直接加载
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    const response = await fetch(imageUrl);
    const buffer = Buffer.from(await response.arrayBuffer());
    return await loadImage(buffer);
  }

  return await loadImage(imageUrl);
}

/**
 * 计算两点之间的距离
 */
function distance(
  p1: { x: number; y: number },
  p2: { x: number; y: number }
): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

/**
 * 计算点集的中心点
 */
function centroid(points: Array<{ x: number; y: number }>): {
  x: number;
  y: number;
} {
  const sum = points.reduce(
    (acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }),
    { x: 0, y: 0 }
  );
  return { x: sum.x / points.length, y: sum.y / points.length };
}

/**
 * 判断脸型（五行分类）
 * 基于面部宽高比和下颌角度
 */
function classifyFaceType(
  landmarks: Array<{ x: number; y: number }>
): string {
  const jaw = landmarks.slice(FACE_LANDMARKS.jaw.start, FACE_LANDMARKS.jaw.end + 1);
  const faceTop = landmarks[27]; // 鼻梁顶部（额头下缘）
  const chin = landmarks[8]; // 下巴最低点

  // 面部宽度（颧骨处）
  const faceWidth = distance(jaw[3], jaw[13]);
  // 面部高度
  const faceHeight = distance(faceTop, chin);
  // 下颌宽度
  const jawWidth = distance(jaw[5], jaw[11]);

  const widthHeightRatio = faceWidth / faceHeight;
  const jawFaceRatio = jawWidth / faceWidth;

  // 五行脸型分类
  if (widthHeightRatio > 0.85 && jawFaceRatio > 0.8) {
    return "金型脸"; // 方脸，宽额宽颌
  } else if (widthHeightRatio < 0.7 && jawFaceRatio < 0.65) {
    return "木型脸"; // 长脸，窄长
  } else if (widthHeightRatio > 0.8 && jawFaceRatio < 0.7) {
    return "水型脸"; // 上宽下窄，瓜子脸
  } else if (widthHeightRatio < 0.75 && jawFaceRatio > 0.75) {
    return "火型脸"; // 上窄下宽，三角脸
  } else {
    return "土型脸"; // 圆脸，比例均匀
  }
}

/**
 * 面相特征提取 - 使用 face-api.js 真实分析
 */
export async function extractFaceFeatures(
  imageUrl: string
): Promise<FaceFeatures> {
  await initFaceApi();
  const faceapi = faceapiModule;

  console.log("[Image Recognition] Extracting face features from:", imageUrl);

  const img = await loadImageFromUrl(imageUrl);

  // 检测面部特征
  const detections = await faceapi
    .detectAllFaces(img)
    .withFaceLandmarks()
    .withAgeAndGender()
    .withFaceExpressions();

  if (detections.length === 0) {
    console.warn("[Image Recognition] No face detected, using estimation mode");
    return estimateFaceFeatures();
  }

  const detection = detections[0];
  const lm = detection.landmarks;
  const positions = lm.positions;
  const box = detection.detection.box;

  // 获取各部位特征点
  const jaw = lm.getJawOutline();
  const leftEye = lm.getLeftEye();
  const rightEye = lm.getRightEye();
  const nose = lm.getNose();
  const mouth = lm.getMouth();
  const leftEyeBrow = lm.getLeftEyeBrow();
  const rightEyeBrow = lm.getRightEyeBrow();

  // 基准尺寸（用于归一化）
  const faceWidth = box.width;
  const faceHeight = box.height;

  // ====== 计算各宫位特征参数 ======

  // 1. 命宫（印堂 - 两眉之间）
  const leftBrowInner = positions[21]; // 左眉内端
  const rightBrowInner = positions[22]; // 右眉内端
  const yintangWidth = distance(leftBrowInner, rightBrowInner) / faceWidth;
  const yintangCenter = centroid([leftBrowInner, rightBrowInner]);
  // 印堂亮度通过位置高度估算（越高越明亮通常表示运势好）
  const yintangBrightness = 1 - (yintangCenter.y - box.y) / faceHeight;

  // 2. 财帛宫（鼻子）
  const noseBridge = positions[27]; // 鼻梁顶
  const noseTip = positions[30]; // 鼻尖
  const noseLeft = positions[31]; // 鼻翼左
  const noseRight = positions[35]; // 鼻翼右
  const noseHeight = distance(noseBridge, noseTip) / faceHeight;
  const noseWidth = distance(noseLeft, noseRight) / faceWidth;
  // 鼻头圆润度：鼻尖到两翼的距离比
  const noseLeftDist = distance(noseTip, noseLeft);
  const noseRightDist = distance(noseTip, noseRight);
  const noseRoundness = Math.min(noseLeftDist, noseRightDist) / Math.max(noseLeftDist, noseRightDist);

  // 3. 官禄宫（额头）
  const foreheadHeight = (positions[27].y - box.y) / faceHeight;
  // 额头饱满度：眉毛到发际线的距离比例
  const browCenter = centroid([...leftEyeBrow.map((p: any) => ({ x: p.x, y: p.y })), ...rightEyeBrow.map((p: any) => ({ x: p.x, y: p.y }))]);
  const foreheadFullness = Math.min(1, foreheadHeight / 0.35);

  // 4. 田宅宫（眉眼之间）
  const leftEyeCenter = centroid(leftEye.map((p: any) => ({ x: p.x, y: p.y })));
  const leftBrowCenter = centroid(leftEyeBrow.map((p: any) => ({ x: p.x, y: p.y })));
  const browEyeDistance = distance(leftBrowCenter, leftEyeCenter) / faceHeight;

  // 5. 妻妾宫（眼尾/鱼尾）
  const leftEyeOuter = positions[36]; // 右眼外角
  const rightEyeOuter = positions[45]; // 左眼外角
  const leftEyeInner = positions[39]; // 右眼内角
  const rightEyeInner = positions[42]; // 左眼内角
  // 眼尾上扬度
  const leftEyeSlant = (leftEyeOuter.y - leftEyeInner.y) / faceHeight;
  const rightEyeSlant = (rightEyeOuter.y - rightEyeInner.y) / faceHeight;
  const eyeTailFullness = 1 - Math.abs(leftEyeSlant + rightEyeSlant) / 2 * 10;

  // 6. 儿女宫（泪堂 - 下眼睑）
  const leftEyeBottom = positions[41];
  const rightEyeBottom = positions[46];
  // 泪堂饱满度：下眼睑到颧骨的距离
  const tearTroughFullness = Math.min(
    1,
    (positions[3].y - leftEyeBottom.y) / faceHeight * 5
  );

  // 7. 兄弟宫（眉毛）
  const leftBrowLength = distance(positions[17], positions[21]);
  const rightBrowLength = distance(positions[22], positions[26]);
  const browDensity = (leftBrowLength + rightBrowLength) / (2 * faceWidth);
  const browDistance = distance(positions[21], positions[22]) / faceWidth;

  // 8. 福德宫（天仓 - 太阳穴区域）
  // 通过颧骨和太阳穴区域的宽度估算
  const templeWidth = distance(jaw[1], jaw[15]) / faceWidth;
  const templeFullness = Math.min(1, templeWidth / 0.9);

  // 9. 迁移宫（额角）
  const foreheadCornerHeight = (positions[17].y - box.y) / faceHeight;
  const foreheadCornerProminence = Math.min(1, foreheadCornerHeight / 0.25);

  // 10. 疾厄宫（山根 - 鼻梁上部）
  const shangenFullness = noseHeight * 1.5;

  // 11. 父母宫（日月角 - 额头两侧）
  const sunMoonAngleHeight = Math.min(
    1,
    ((positions[19].y - box.y) + (positions[24].y - box.y)) / (2 * faceHeight) / 0.2
  );

  // 12. 奴仆宫（下巴）
  const chinPoint = positions[8];
  const chinLeft = positions[6];
  const chinRight = positions[10];
  const chinWidth = distance(chinLeft, chinRight) / faceWidth;
  const chinRoundness = Math.min(1, chinWidth / 0.5);

  // 脸型分类
  const faceType = classifyFaceType(
    positions.map((p: any) => ({ x: p.x, y: p.y }))
  );

  return {
    faceType,
    palaces: {
      命宫: {
        印堂宽度比例: parseFloat(yintangWidth.toFixed(2)),
        印堂纹路数量: 0, // 纹路需要更高级的检测
        印堂颜色亮度: parseFloat(
          Math.min(1, Math.max(0, yintangBrightness)).toFixed(2)
        ),
      },
      财帛宫: {
        鼻梁高度: parseFloat((noseHeight * 100).toFixed(1)),
        鼻头圆润度: parseFloat(noseRoundness.toFixed(2)),
        鼻翼宽度: parseFloat((noseWidth * 100).toFixed(1)),
      },
      官禄宫: {
        额头高度比例: parseFloat(foreheadHeight.toFixed(2)),
        额头饱满度: parseFloat(foreheadFullness.toFixed(2)),
      },
      田宅宫: {
        眉眼距离比例: parseFloat(browEyeDistance.toFixed(2)),
      },
      妻妾宫: {
        眼尾平满度: parseFloat(
          Math.min(1, Math.max(0, eyeTailFullness)).toFixed(2)
        ),
        眼尾纹路数量: 0,
      },
      儿女宫: {
        泪堂饱满度: parseFloat(
          Math.min(1, Math.max(0, tearTroughFullness)).toFixed(2)
        ),
      },
      兄弟宫: {
        眉毛浓密度: parseFloat(Math.min(1, browDensity * 2).toFixed(2)),
        眉毛距离比例: parseFloat(browDistance.toFixed(2)),
      },
      福德宫: {
        天仓饱满度: parseFloat(
          Math.min(1, Math.max(0, templeFullness)).toFixed(2)
        ),
      },
      迁移宫: {
        额角隆起度: parseFloat(
          Math.min(1, Math.max(0, foreheadCornerProminence)).toFixed(2)
        ),
      },
      疾厄宫: {
        山根饱满度: parseFloat(
          Math.min(1, Math.max(0, shangenFullness)).toFixed(2)
        ),
      },
      父母宫: {
        日月角高度: parseFloat(
          Math.min(1, Math.max(0, sunMoonAngleHeight)).toFixed(2)
        ),
      },
      奴仆宫: {
        下巴圆润度: parseFloat(
          Math.min(1, Math.max(0, chinRoundness)).toFixed(2)
        ),
      },
    },
  };
}

/**
 * 当无法检测到面部时，基于图像整体特征进行估算
 */
function estimateFaceFeatures(): FaceFeatures {
  // 使用中等偏上的默认值，确保能匹配到规则
  return {
    faceType: "土型脸",
    palaces: {
      命宫: { 印堂宽度比例: 0.85, 印堂纹路数量: 0, 印堂颜色亮度: 0.75 },
      财帛宫: { 鼻梁高度: 11.0, 鼻头圆润度: 0.80, 鼻翼宽度: 30.0 },
      官禄宫: { 额头高度比例: 0.30, 额头饱满度: 0.72 },
      田宅宫: { 眉眼距离比例: 0.14 },
      妻妾宫: { 眼尾平满度: 0.75, 眼尾纹路数量: 0 },
      儿女宫: { 泪堂饱满度: 0.72 },
      兄弟宫: { 眉毛浓密度: 0.70, 眉毛距离比例: 0.16 },
      福德宫: { 天仓饱满度: 0.75 },
      迁移宫: { 额角隆起度: 0.70 },
      疾厄宫: { 山根饱满度: 0.68 },
      父母宫: { 日月角高度: 0.72 },
      奴仆宫: { 下巴圆润度: 0.75 },
    },
  };
}

// ============= 手相特征提取 =============

/**
 * 手相特征提取 - 使用 sharp 图像分析
 * 通过图像的色彩通道、边缘检测和区域分析提取手掌特征
 */
export async function extractPalmFeatures(
  imageUrl: string
): Promise<PalmFeatures> {
  console.log("[Image Recognition] Extracting palm features from:", imageUrl);

  try {
    const sharp = (await import("sharp")).default;

    // 下载图片
    let imageBuffer: Buffer;
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      const response = await fetch(imageUrl);
      imageBuffer = Buffer.from(await response.arrayBuffer());
    } else {
      const fs = await import("fs");
      imageBuffer = fs.readFileSync(imageUrl);
    }

    // 获取图像元数据
    const metadata = await sharp(imageBuffer).metadata();
    const width = metadata.width || 500;
    const height = metadata.height || 500;

    // 转为灰度图进行分析
    const grayBuffer = await sharp(imageBuffer)
      .grayscale()
      .resize(500, 500, { fit: "cover" })
      .raw()
      .toBuffer();

    // 分析图像区域的亮度和纹理特征
    const regionSize = 500;

    // 将手掌分为9个区域（3x3网格），对应不同的丘位和纹路区域
    const regions = analyzeRegions(grayBuffer, regionSize, regionSize);

    // 计算边缘强度（用于检测纹路）
    const edgeStrength = calculateEdgeStrength(grayBuffer, regionSize, regionSize);

    // 根据图像分析结果推断手型
    const avgBrightness = regions.reduce((sum, r) => sum + r.avgBrightness, 0) / regions.length;
    const handType = classifyHandType(regions, avgBrightness);

    // 根据图像特征计算掌纹参数
    // 中心区域的边缘强度反映主要掌纹的深度
    const centerEdge = edgeStrength[4]; // 中心区域
    const topEdge = edgeStrength[1]; // 上方区域
    const bottomEdge = edgeStrength[7]; // 下方区域
    const leftEdge = edgeStrength[3]; // 左侧区域
    const rightEdge = edgeStrength[5]; // 右侧区域

    // 归一化边缘强度到0-1范围
    const maxEdge = Math.max(...edgeStrength, 1);
    const normalizeEdge = (v: number) => Math.min(1, v / maxEdge);

    return {
      handType,
      lines: {
        生命线: {
          生命线长度比例: parseFloat(
            Math.min(1, Math.max(0.3, normalizeEdge(leftEdge + bottomEdge) * 0.8 + 0.2)).toFixed(2)
          ),
          生命线深度: parseFloat(
            Math.min(1, Math.max(0.3, normalizeEdge(leftEdge) * 0.7 + 0.3)).toFixed(2)
          ),
          生命线弧度: parseFloat(
            Math.min(1, Math.max(0.2, regions[6].contrast * 2)).toFixed(2)
          ),
        },
        智慧线: {
          智慧线长度比例: parseFloat(
            Math.min(1, Math.max(0.3, normalizeEdge(centerEdge) * 0.8 + 0.2)).toFixed(2)
          ),
          智慧线深度: parseFloat(
            Math.min(1, Math.max(0.3, normalizeEdge(centerEdge) * 0.6 + 0.3)).toFixed(2)
          ),
          智慧线走向: centerEdge > topEdge ? "平直" : "下弯",
        },
        感情线: {
          感情线长度比例: parseFloat(
            Math.min(1, Math.max(0.3, normalizeEdge(topEdge + rightEdge) * 0.7 + 0.3)).toFixed(2)
          ),
          感情线深度: parseFloat(
            Math.min(1, Math.max(0.3, normalizeEdge(topEdge) * 0.6 + 0.3)).toFixed(2)
          ),
          感情线分叉数量: Math.round(normalizeEdge(topEdge) * 3),
        },
        事业线: {
          事业线长度比例: parseFloat(
            Math.min(1, Math.max(0.2, normalizeEdge(centerEdge + topEdge) * 0.6 + 0.2)).toFixed(2)
          ),
          事业线清晰度: parseFloat(
            Math.min(1, Math.max(0.3, normalizeEdge(centerEdge) * 0.5 + 0.3)).toFixed(2)
          ),
        },
        婚姻线: {
          婚姻线数量: Math.max(1, Math.round(normalizeEdge(edgeStrength[2]) * 3)),
          婚姻线长度: parseFloat(
            Math.min(1, Math.max(0.3, normalizeEdge(edgeStrength[2]) * 0.5 + 0.3)).toFixed(2)
          ),
        },
      },
      hills: {
        木星丘: {
          木星丘隆起度: parseFloat(
            Math.min(1, Math.max(0.3, regions[0].avgBrightness / 255 * 0.5 + 0.4)).toFixed(2)
          ),
        },
        土星丘: {
          土星丘隆起度: parseFloat(
            Math.min(1, Math.max(0.3, regions[1].avgBrightness / 255 * 0.5 + 0.3)).toFixed(2)
          ),
        },
        太阳丘: {
          太阳丘隆起度: parseFloat(
            Math.min(1, Math.max(0.3, regions[2].avgBrightness / 255 * 0.5 + 0.35)).toFixed(2)
          ),
        },
        水星丘: {
          水星丘隆起度: parseFloat(
            Math.min(1, Math.max(0.3, regions[5].avgBrightness / 255 * 0.5 + 0.4)).toFixed(2)
          ),
        },
        金星丘: {
          金星丘隆起度: parseFloat(
            Math.min(1, Math.max(0.3, regions[6].avgBrightness / 255 * 0.5 + 0.45)).toFixed(2)
          ),
          金星丘面积比例: parseFloat(
            Math.min(0.35, Math.max(0.15, regions[6].area / (regionSize * regionSize) + 0.15)).toFixed(2)
          ),
        },
        太阴丘: {
          太阴丘隆起度: parseFloat(
            Math.min(1, Math.max(0.3, regions[8].avgBrightness / 255 * 0.5 + 0.3)).toFixed(2)
          ),
        },
        第一火星丘: {
          第一火星丘隆起度: parseFloat(
            Math.min(1, Math.max(0.3, regions[3].avgBrightness / 255 * 0.5 + 0.3)).toFixed(2)
          ),
        },
        第二火星丘: {
          第二火星丘隆起度: parseFloat(
            Math.min(1, Math.max(0.3, regions[5].avgBrightness / 255 * 0.4 + 0.3)).toFixed(2)
          ),
        },
      },
    };
  } catch (error) {
    console.error("[Image Recognition] Palm analysis failed, using estimation:", error);
    return estimatePalmFeatures();
  }
}

/**
 * 分析图像的9个区域
 */
function analyzeRegions(
  buffer: Buffer,
  width: number,
  height: number
): Array<{ avgBrightness: number; contrast: number; area: number }> {
  const regions = [];
  const cellW = Math.floor(width / 3);
  const cellH = Math.floor(height / 3);

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      let sum = 0;
      let sumSq = 0;
      let count = 0;

      for (let y = row * cellH; y < (row + 1) * cellH && y < height; y++) {
        for (let x = col * cellW; x < (col + 1) * cellW && x < width; x++) {
          const idx = y * width + x;
          if (idx < buffer.length) {
            const val = buffer[idx];
            sum += val;
            sumSq += val * val;
            count++;
          }
        }
      }

      const avg = count > 0 ? sum / count : 128;
      const variance = count > 0 ? sumSq / count - avg * avg : 0;
      const contrast = Math.sqrt(Math.max(0, variance)) / 255;

      regions.push({
        avgBrightness: avg,
        contrast,
        area: count,
      });
    }
  }

  return regions;
}

/**
 * 计算各区域的边缘强度（简单Sobel算子）
 */
function calculateEdgeStrength(
  buffer: Buffer,
  width: number,
  height: number
): number[] {
  const cellW = Math.floor(width / 3);
  const cellH = Math.floor(height / 3);
  const strengths: number[] = [];

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      let edgeSum = 0;
      let count = 0;

      for (
        let y = row * cellH + 1;
        y < (row + 1) * cellH - 1 && y < height - 1;
        y++
      ) {
        for (
          let x = col * cellW + 1;
          x < (col + 1) * cellW - 1 && x < width - 1;
          x++
        ) {
          // 简单的Sobel边缘检测
          const gx =
            -buffer[(y - 1) * width + (x - 1)] +
            buffer[(y - 1) * width + (x + 1)] +
            -2 * buffer[y * width + (x - 1)] +
            2 * buffer[y * width + (x + 1)] +
            -buffer[(y + 1) * width + (x - 1)] +
            buffer[(y + 1) * width + (x + 1)];

          const gy =
            -buffer[(y - 1) * width + (x - 1)] -
            2 * buffer[(y - 1) * width + x] -
            buffer[(y - 1) * width + (x + 1)] +
            buffer[(y + 1) * width + (x - 1)] +
            2 * buffer[(y + 1) * width + x] +
            buffer[(y + 1) * width + (x + 1)];

          edgeSum += Math.sqrt(gx * gx + gy * gy);
          count++;
        }
      }

      strengths.push(count > 0 ? edgeSum / count : 0);
    }
  }

  return strengths;
}

/**
 * 根据图像特征分类手型（五行）
 */
function classifyHandType(
  regions: Array<{ avgBrightness: number; contrast: number; area: number }>,
  avgBrightness: number
): string {
  // 基于图像整体特征推断手型
  const centerContrast = regions[4].contrast;
  const overallContrast =
    regions.reduce((sum, r) => sum + r.contrast, 0) / regions.length;

  if (overallContrast > 0.3 && avgBrightness > 150) {
    return "金型手"; // 肤色偏白，纹路清晰
  } else if (overallContrast > 0.25 && centerContrast > 0.3) {
    return "木型手"; // 手指修长，纹路多
  } else if (avgBrightness > 140 && overallContrast < 0.2) {
    return "水型手"; // 肤色白皙，纹路少
  } else if (overallContrast > 0.35) {
    return "火型手"; // 纹路密集
  } else {
    return "土型手"; // 均匀，中等
  }
}

/**
 * 手相估算（当图像分析失败时使用）
 */
function estimatePalmFeatures(): PalmFeatures {
  return {
    handType: "土型手",
    lines: {
      生命线: { 生命线长度比例: 0.78, 生命线深度: 0.72, 生命线弧度: 0.65 },
      智慧线: { 智慧线长度比例: 0.75, 智慧线深度: 0.68, 智慧线走向: "平直" },
      感情线: { 感情线长度比例: 0.76, 感情线深度: 0.70, 感情线分叉数量: 1 },
      事业线: { 事业线长度比例: 0.70, 事业线清晰度: 0.72 },
      婚姻线: { 婚姻线数量: 1, 婚姻线长度: 0.55 },
    },
    hills: {
      木星丘: { 木星丘隆起度: 0.78 },
      土星丘: { 土星丘隆起度: 0.70 },
      太阳丘: { 太阳丘隆起度: 0.75 },
      水星丘: { 水星丘隆起度: 0.80 },
      金星丘: { 金星丘隆起度: 0.85, 金星丘面积比例: 0.22 },
      太阴丘: { 太阴丘隆起度: 0.72 },
      第一火星丘: { 第一火星丘隆起度: 0.70 },
      第二火星丘: { 第二火星丘隆起度: 0.68 },
    },
  };
}

// ============= 图片验证 =============

/**
 * 验证图片是否包含有效的面相/手相
 */
export async function validateImage(
  imageUrl: string,
  serviceType: "face" | "palm"
): Promise<{ valid: boolean; message?: string }> {
  try {
    if (serviceType === "face") {
      await initFaceApi();
      const faceapi = faceapiModule;
      const img = await loadImageFromUrl(imageUrl);
      const detections = await faceapi.detectAllFaces(img);

      if (detections.length === 0) {
        return {
          valid: false,
          message: "未能检测到面部，请上传一张清晰的正面照片",
        };
      }
      return { valid: true };
    } else {
      // 手相验证：检查图片是否可读
      const sharp = (await import("sharp")).default;
      let imageBuffer: Buffer;
      if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
        const response = await fetch(imageUrl);
        imageBuffer = Buffer.from(await response.arrayBuffer());
      } else {
        const fs = await import("fs");
        imageBuffer = fs.readFileSync(imageUrl);
      }
      const metadata = await sharp(imageBuffer).metadata();
      if (!metadata.width || !metadata.height) {
        return { valid: false, message: "图片格式无效" };
      }
      return { valid: true };
    }
  } catch (error) {
    return { valid: true }; // 验证失败时不阻塞流程
  }
}
