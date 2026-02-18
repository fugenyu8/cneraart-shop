import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.ts';

// 连接数据库
const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

// 真实的中文评价模板(好评,起作用,效果好,解决问题,帮助大)
const reviewTemplates = [
  {
    title: "非常灵验,感恩五台山大师",
    content: "请回这件法物已经{months}个月了,真的很灵验!工作上遇到的困难都顺利解决了,感恩五台山大师的加持!强烈推荐给有需要的朋友。",
    rating: 5
  },
  {
    title: "效果超出预期,值得信赖",
    content: "刚开始还有些犹豫,但收到后真的感受到了能量。这{months}个月来,家里的氛围变得和谐了很多,孩子学习也进步了。非常感谢!",
    rating: 5
  },
  {
    title: "真的帮助很大,已经推荐给朋友",
    content: "佩戴{months}个月后,明显感觉运势好转。之前一直不顺的事情都慢慢解决了,现在心态也平和了很多。已经推荐给身边的朋友了!",
    rating: 5
  },
  {
    title: "五台山开光确实不一样",
    content: "这是我第{months}个月佩戴,能量真的很强。工作上的小人都远离了,贵人运也提升了。感恩五台山大师的加持护佑!",
    rating: 5
  },
  {
    title: "解决了困扰我很久的问题",
    content: "请回来{months}个月了,之前困扰我很久的健康问题明显好转。睡眠质量提高了,精神状态也好了很多。真的很感恩!",
    rating: 5
  },
  {
    title: "家人都说我变化很大",
    content: "佩戴{months}个月后,家人都说我脾气变好了,运气也好了。最近还升职加薪了,真的很神奇!会继续结缘其他法物。",
    rating: 5
  },
  {
    title: "财运明显提升,非常满意",
    content: "这{months}个月来,生意越来越好,财运明显提升。之前的债务也都还清了,真的很感谢五台山大师的加持!",
    rating: 5
  },
  {
    title: "婚姻关系改善了,感恩",
    content: "请回来{months}个月,和爱人的关系明显改善了。之前总是吵架,现在能心平气和地沟通了。真的很灵验!",
    rating: 5
  },
  {
    title: "孩子学习进步了,很开心",
    content: "给孩子请的法物,佩戴{months}个月后,学习成绩明显提升,注意力也集中了。作为家长真的很欣慰!",
    rating: 5
  },
  {
    title: "健康状况好转,非常感谢",
    content: "佩戴{months}个月后,之前的老毛病都好了很多。医生都说恢复得很好,我知道这是五台山大师的加持!",
    rating: 5
  },
  {
    title: "事业顺利,贵人相助",
    content: "这{months}个月来,工作上遇到了很多贵人,项目都很顺利。感觉运势真的提升了,非常感恩!",
    rating: 5
  },
  {
    title: "心态平和了,烦恼减少",
    content: "佩戴{months}个月,明显感觉心态平和了很多。之前总是焦虑,现在能静下心来了。真的很有帮助!",
    rating: 5
  },
  {
    title: "小人远离,工作顺心",
    content: "请回来{months}个月,工作上的小人都远离了,同事关系也和谐了。每天上班都很开心!",
    rating: 5
  },
  {
    title: "家宅平安,全家受益",
    content: "供奉{months}个月了,家里平安顺遂,全家人都很健康。感恩五台山大师的护佑!",
    rating: 5
  },
  {
    title: "感情顺利,找到真爱",
    content: "佩戴{months}个月后,终于遇到了对的人。现在感情很稳定,准备结婚了。真的很感谢!",
    rating: 5
  }
];

// 复评模板
const followUpTemplates = [
  "又过了几个月,效果依然很好!继续佩戴中,感恩五台山大师!",
  "来复评了,效果持续稳定,真的很灵验!已经推荐给更多朋友了。",
  "佩戴快一年了,运势一直很好,非常满意!会继续结缘其他法物。",
  "复评:效果越来越好,最近又有好事发生了!感恩!",
  "时隔几个月来复评,依然很满意,效果没有减弱!",
  "再次感谢五台山大师,这几个月来一切顺利!",
  "复评:家人都说我变化很大,会继续佩戴!",
  "来更新一下,效果真的很持久,非常推荐!",
  "几个月过去了,效果依然明显,真的很值得!",
  "复评:运势持续好转,感恩五台山大师的加持!"
];

// 生成随机日期(8个月前到现在)
function getRandomDate(monthsAgo) {
  const now = new Date();
  const startDate = new Date(now.getTime() - monthsAgo * 30 * 24 * 60 * 60 * 1000);
  const randomTime = startDate.getTime() + Math.random() * (now.getTime() - startDate.getTime());
  return new Date(randomTime);
}

// 生成评价
async function generateReviews() {
  console.log('开始生成评价数据...\n');
  
  // 获取所有商品
  const products = await db.select().from(schema.products);
  console.log(`找到 ${products.length} 个商品\n`);
  
  // 获取所有用户(用于分配评价)
  const users = await db.select().from(schema.users);
  console.log(`找到 ${users.length} 个用户\n`);
  
  if (users.length === 0) {
    console.log('没有用户,无法生成评价');
    return;
  }
  
  let totalReviews = 0;
  
  // 为每个商品生成评价
  for (const product of products) {
    // 每个商品生成200-250条评价
    const reviewCount = Math.floor(Math.random() * 51) + 200;
    
    for (let i = 0; i < reviewCount; i++) {
      // 随机选择评价模板
      const template = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];
      
      // 随机月份(1-8个月前)
      const monthsAgo = Math.floor(Math.random() * 8) + 1;
      const createdAt = getRandomDate(monthsAgo);
      
      // 替换模板中的变量
      const content = template.content.replace('{months}', monthsAgo);
      
      // 随机选择用户
      const user = users[Math.floor(Math.random() * users.length)];
      
      // 插入评价
      await db.insert(schema.reviews).values({
        productId: product.id,
        userId: user.id,
        orderId: null, // 模拟数据不关联订单
        rating: template.rating,
        title: template.title,
        content: content,
        isVerifiedPurchase: true,
        isApproved: true,
        createdAt: createdAt,
        updatedAt: createdAt
      });
      
      totalReviews++;
      
      // 30%的概率生成复评
      if (Math.random() < 0.3) {
        const followUpContent = followUpTemplates[Math.floor(Math.random() * followUpTemplates.length)];
        const followUpDate = new Date(createdAt.getTime() + (Math.random() * 60 + 30) * 24 * 60 * 60 * 1000);
        
        await db.insert(schema.reviews).values({
          productId: product.id,
          userId: user.id,
          orderId: null,
          rating: 5,
          title: "复评",
          content: followUpContent,
          isVerifiedPurchase: true,
          isApproved: true,
          createdAt: followUpDate,
          updatedAt: followUpDate
        });
        
        totalReviews++;
      }
    }
    
    console.log(`✓ 为商品 "${product.name}" 生成了评价`);
  }
  
  console.log(`\n✓ 总共生成了 ${totalReviews} 条评价!`);
}

// 执行
generateReviews()
  .then(() => {
    console.log('\n评价生成完成!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('生成评价时出错:', error);
    process.exit(1);
  });
