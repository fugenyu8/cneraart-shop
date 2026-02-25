/**
 * 产品推荐系统
 * 根据服务类型和报告内容推荐相关的文化信物
 */

import * as db from './db';
import QRCode from 'qrcode';

export type ServiceType = 'face' | 'palm' | 'fengshui';

export interface RecommendedProduct {
  id: number;
  name: string;
  imageUrl: string;
  price: string;
  description: string;
  productUrl: string;
  qrCodeBuffer?: Buffer;
}

/**
 * 根据服务类型获取推荐产品
 */
export async function getRecommendedProducts(
  serviceType: ServiceType,
  limit: number = 3
): Promise<RecommendedProduct[]> {
  // 定义每个服务类型推荐的产品关键词
  const recommendationRules: Record<ServiceType, string[]> = {
    face: ['智慧', '事业', '平安', '守护', '文殊'],
    palm: ['手链', '手串', '财运', '招财', '守护'],
    fengshui: ['摆件', '守护', '招财', '镇宅', '平安']
  };

  const keywords = recommendationRules[serviceType];
  
  // 获取所有已发布的精选产品
  const allProducts = await db.getPublishedProducts({
    featured: true,
    blessedOnly: true,
    limit: 50
  });

  // 根据关键词匹配产品
  const scoredProducts = allProducts.map(product => {
    let score = 0;
    
    // 检查产品名称和描述中是否包含关键词
    const searchText = `${product.name} ${product.description || ''} ${product.efficacy || ''}`.toLowerCase();
    
    for (const keyword of keywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        score += 1;
      }
    }
    
    // 如果是精选产品,额外加分
    if (product.featured) {
      score += 0.5;
    }
    
    return { product, score };
  });

  // 按分数排序并取前N个
  const topProducts = scoredProducts
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  // 如果匹配的产品不足,补充其他精选产品
  if (topProducts.length < limit) {
    const remainingCount = limit - topProducts.length;
    const usedIds = new Set(topProducts.map(item => item.product.id));
    const additionalProducts = allProducts
      .filter(p => !usedIds.has(p.id))
      .slice(0, remainingCount);
    
    topProducts.push(...additionalProducts.map(product => ({ product, score: 0 })));
  }

  // 获取产品图片并构建推荐列表
  const recommendations: RecommendedProduct[] = [];
  
  for (const { product } of topProducts) {
    const images = await db.getProductImages(product.id);
    const primaryImage = images.find(img => img.isPrimary) || images[0];
    
    // 获取产品价格(优先使用促销价)
    const price = product.salePrice || product.regularPrice;
    
    // 构建产品URL(假设前端域名)
    const productUrl = `${process.env.VITE_APP_LOGO || 'https://www.cneraart.com'}/products/${product.slug}`;
    
    // 生成二维码
    let qrCodeBuffer: Buffer | undefined;
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(productUrl, {
        width: 100,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      qrCodeBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64');
    } catch (error) {
      console.error('二维码生成失败:', error);
    }

    recommendations.push({
      id: product.id,
      name: product.name,
      imageUrl: primaryImage?.url || '',
      price: price.toString(),
      description: product.shortDescription || product.description?.substring(0, 100) || '',
      productUrl,
      qrCodeBuffer
    });
  }

  return recommendations;
}

/**
 * 根据用户生肖推荐守护信物
 */
export async function getZodiacRecommendations(birthYear: number): Promise<RecommendedProduct[]> {
  // 计算生肖
  const zodiacAnimals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
  const zodiacIndex = (birthYear - 1900) % 12;
  const zodiacAnimal = zodiacAnimals[zodiacIndex];
  
  // 生肖对应的守护文化象征
  const zodiacBuddha: Record<string, string> = {
    '鼠': '千手观音',
    '牛': '虚空藏',
    '虎': '虚空藏',
    '兔': '文殊',
    '龙': '普贤',
    '蛇': '普贤',
    '马': '大势至',
    '羊': '大日如来',
    '猴': '大日如来',
    '鸡': '不动尊',
    '狗': '阿弥陀',
    '猪': '阿弥陀'
  };
  
  const buddha = zodiacBuddha[zodiacAnimal];
  
  // 搜索包含本命佛名称的产品
  const products = await db.getPublishedProducts({
    search: buddha,
    blessedOnly: true,
    limit: 10
  });
  
  // 构建推荐列表
  const recommendations: RecommendedProduct[] = [];
  
  for (const product of products.slice(0, 2)) {
    const images = await db.getProductImages(product.id);
    const primaryImage = images.find(img => img.isPrimary) || images[0];
    const price = product.salePrice || product.regularPrice;
    const productUrl = `${process.env.VITE_APP_LOGO || 'https://www.cneraart.com'}/products/${product.slug}`;
    
    // 生成二维码
    let qrCodeBuffer: Buffer | undefined;
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(productUrl, {
        width: 100,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      qrCodeBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64');
    } catch (error) {
      console.error('二维码生成失败:', error);
    }

    recommendations.push({
      id: product.id,
      name: product.name,
      imageUrl: primaryImage?.url || '',
      price: price.toString(),
      description: `${zodiacAnimal}年生人守护信物 · ${product.shortDescription || ''}`,
      productUrl,
      qrCodeBuffer
    });
  }
  
  return recommendations;
}
