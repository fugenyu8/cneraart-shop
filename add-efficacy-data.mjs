import { getDb } from "./server/db.ts";
import { products } from "./drizzle/schema.ts";
import { eq, inArray } from "drizzle-orm";

// 效用说明数据映射
const efficacyData = {
  // 生肖守护(分类60002)
  zodiac: {
    suitableFor: "本命生肖人群、运势低迷者、寻求守护能量者",
    efficacy: "守护本命、增强运势、化解太岁、招财纳福、保佑平安",
    wearingGuide: "建议贴身佩戴,可戴于颈部或手腕。每月农历十五可用清水净化,晾干后继续佩戴。避免接触化学物品,洗澡时建议取下。"
  },
  
  // 太阳星座守护(分类60003)
  sunSign: {
    suitableFor: "本命星座人群、性格迷茫者、寻求人生方向者",
    efficacy: "守护外在性格、指引人生方向、增强行动力、提升自信心、促进人际和谐",
    wearingGuide: "建议日常佩戴,可戴于颈部或手腕。每月满月之夜可置于月光下净化。避免长时间暴晒,保持清洁干燥。"
  },
  
  // 月亮星座守护(分类60004)
  moonSign: {
    suitableFor: "情感运势薄弱者、内心焦虑者、人际关系紧张者",
    efficacy: "守护内心世界、平复情绪波动、增强情感能量、改善人际关系、提升桃花运",
    wearingGuide: "建议夜间或情绪低落时佩戴。每月新月之夜可置于月光下净化。睡眠时可放于枕边,帮助安神入眠。"
  },
  
  // 招财旺运(分类60005)
  wealth: {
    suitableFor: "事业受阻者、财运不佳者、求职困难者、创业人士",
    efficacy: "招财纳福、事业顺遂、贵人相助、化解财务困境、提升偏财运",
    wearingGuide: "建议佩戴于左手腕,左进右出。每月初一十五可用檀香熏香净化。可随身携带或放置于办公桌、收银台等财位。"
  },
  
  // 平安健康(分类60006)
  health: {
    suitableFor: "健康运势不佳者、体弱多病者、易有意外者、老人小孩",
    efficacy: "祛病消灾、保佑平安、增强体质、化解病痛、延年益寿",
    wearingGuide: "建议贴身佩戴,可戴于颈部或手腕。身体不适时可握于手中默念经文。每周可用清水净化,自然晾干后继续佩戴。"
  },
  
  // 智慧学业(分类60007)
  wisdom: {
    suitableFor: "学业受阻者、考试不利者、思维混沌者、学生群体",
    efficacy: "开启智慧、增强记忆、提升专注力、考试顺利、破除迷障",
    wearingGuide: "建议学习或考试时佩戴。可戴于左手腕或颈部。每月可用清水净化,配合诵读经文效果更佳。避免放置于杂乱环境。"
  },
  
  // 心灵平和(分类60008)
  peace: {
    suitableFor: "压力过大者、焦虑烦躁者、失眠多梦者、修行人士",
    efficacy: "平复内心、消除烦恼、安神助眠、提升定力、心灵净化",
    wearingGuide: "建议冥想或睡前佩戴。可戴于颈部或手腕,也可握于手中诵读心经。每日可用清水净化,保持心境平和。"
  }
};

async function addEfficacyData() {
  console.log("开始为开光法物添加效用说明数据...\n");
  
  const db = await getDb();
  if (!db) {
    console.error("数据库连接失败");
    process.exit(1);
  }
  
  try {
    // 1. 更新生肖守护商品(分类90001)
    const zodiacProducts = await db.select().from(products).where(eq(products.categoryId, 90001));
    console.log(`找到${zodiacProducts.length}个生肖守护商品`);
    
    for (const product of zodiacProducts) {
      await db.update(products)
        .set({
          suitableFor: efficacyData.zodiac.suitableFor,
          efficacy: efficacyData.zodiac.efficacy,
          wearingGuide: efficacyData.zodiac.wearingGuide
        })
        .where(eq(products.id, product.id));
    }
    console.log("✓ 生肖守护商品更新完成\n");
    
    // 2. 更新太阳星座守护商品(分类90002)
    const sunSignProducts = await db.select().from(products).where(eq(products.categoryId, 90002));
    console.log(`找到${sunSignProducts.length}个太阳星座守护商品`);
    
    for (const product of sunSignProducts) {
      await db.update(products)
        .set({
          suitableFor: efficacyData.sunSign.suitableFor,
          efficacy: efficacyData.sunSign.efficacy,
          wearingGuide: efficacyData.sunSign.wearingGuide
        })
        .where(eq(products.id, product.id));
    }
    console.log("✓ 太阳星座守护商品更新完成\n");
    
    // 3. 更新月亮星座守护商品(分类90003)
    const moonSignProducts = await db.select().from(products).where(eq(products.categoryId, 90003));
    console.log(`找到${moonSignProducts.length}个月亮星座守护商品`);
    
    for (const product of moonSignProducts) {
      await db.update(products)
        .set({
          suitableFor: efficacyData.moonSign.suitableFor,
          efficacy: efficacyData.moonSign.efficacy,
          wearingGuide: efficacyData.moonSign.wearingGuide
        })
        .where(eq(products.id, product.id));
    }
    console.log("✓ 月亮星座守护商品更新完成\n");
    
    // 4. 更新招财旺运商品(分类90004)
    const wealthProducts = await db.select().from(products).where(eq(products.categoryId, 90004));
    console.log(`找到${wealthProducts.length}个招财旺运商品`);
    
    for (const product of wealthProducts) {
      await db.update(products)
        .set({
          suitableFor: efficacyData.wealth.suitableFor,
          efficacy: efficacyData.wealth.efficacy,
          wearingGuide: efficacyData.wealth.wearingGuide
        })
        .where(eq(products.id, product.id));
    }
    console.log("✓ 招财旺运商品更新完成\n");
    
    // 5. 更新平安健康商品(分类90005)
    const healthProducts = await db.select().from(products).where(eq(products.categoryId, 90005));
    console.log(`找到${healthProducts.length}个平安健康商品`);
    
    for (const product of healthProducts) {
      await db.update(products)
        .set({
          suitableFor: efficacyData.health.suitableFor,
          efficacy: efficacyData.health.efficacy,
          wearingGuide: efficacyData.health.wearingGuide
        })
        .where(eq(products.id, product.id));
    }
    console.log("✓ 平安健康商品更新完成\n");
    
    // 6. 更新智慧学业商品(分类90006)
    const wisdomProducts = await db.select().from(products).where(eq(products.categoryId, 90006));
    console.log(`找到${wisdomProducts.length}个智慧学业商品`);
    
    for (const product of wisdomProducts) {
      await db.update(products)
        .set({
          suitableFor: efficacyData.wisdom.suitableFor,
          efficacy: efficacyData.wisdom.efficacy,
          wearingGuide: efficacyData.wisdom.wearingGuide
        })
        .where(eq(products.id, product.id));
    }
    console.log("✓ 智慧学业商品更新完成\n");
    
    // 7. 更新心灵平和商品(分类90007)
    const peaceProducts = await db.select().from(products).where(eq(products.categoryId, 90007));
    console.log(`找到${peaceProducts.length}个心灵平和商品`);
    
    for (const product of peaceProducts) {
      await db.update(products)
        .set({
          suitableFor: efficacyData.peace.suitableFor,
          efficacy: efficacyData.peace.efficacy,
          wearingGuide: efficacyData.peace.wearingGuide
        })
        .where(eq(products.id, product.id));
    }
    console.log("✓ 心灵平和商品更新完成\n");
    
    console.log("===所有开光法物效用说明数据添加完成!===");
    process.exit(0);
  } catch (error) {
    console.error("错误:", error);
    process.exit(1);
  }
}

addEfficacyData();
