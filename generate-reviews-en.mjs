import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.ts';

// 连接数据库
const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

// 英文评价模板(好评,起作用,效果好,解决问题,帮助大)
const reviewTemplates = [
  {
    title: "Truly miraculous, grateful to Wutai Mountain masters",
    content: "I've had this blessed item for {months} months now, and it's truly miraculous! All the difficulties at work have been smoothly resolved. I'm so grateful for the blessings from Wutai Mountain masters! Highly recommend to anyone in need.",
    rating: 5
  },
  {
    title: "Results exceeded expectations, trustworthy",
    content: "I was hesitant at first, but after receiving it, I really felt the energy. Over these {months} months, the atmosphere at home has become much more harmonious, and my child's studies have improved. Thank you so much!",
    rating: 5
  },
  {
    title: "Really helpful, already recommended to friends",
    content: "After wearing it for {months} months, I clearly feel my fortune has improved. Things that weren't going well before are gradually being resolved, and my mindset has become much more peaceful. I've already recommended it to my friends!",
    rating: 5
  },
  {
    title: "Wutai Mountain consecration is truly different",
    content: "This is my {months}th month wearing it, and the energy is really strong. Troublemakers at work have stayed away, and my benefactor luck has improved. Grateful for the blessings and protection from Wutai Mountain masters!",
    rating: 5
  },
  {
    title: "Solved problems that troubled me for a long time",
    content: "I've had it for {months} months, and the health issues that troubled me for a long time have significantly improved. My sleep quality has increased, and my mental state is much better. I'm truly grateful!",
    rating: 5
  },
  {
    title: "My family says I've changed a lot",
    content: "After wearing it for {months} months, my family says my temper has improved and my luck has gotten better. I even got a promotion and raise recently, it's truly amazing! I'll continue to acquire other blessed items.",
    rating: 5
  },
  {
    title: "Wealth fortune significantly improved, very satisfied",
    content: "Over these {months} months, business has been getting better and better, and my wealth fortune has significantly improved. Previous debts have all been paid off. I'm really thankful for the blessings from Wutai Mountain masters!",
    rating: 5
  },
  {
    title: "Marriage relationship improved, grateful",
    content: "I've had it for {months} months, and my relationship with my spouse has significantly improved. We used to argue all the time, but now we can communicate calmly. It's truly miraculous!",
    rating: 5
  },
  {
    title: "My child's studies improved, very happy",
    content: "I got this blessed item for my child. After wearing it for {months} months, academic performance has significantly improved and concentration has increased. As a parent, I'm really pleased!",
    rating: 5
  },
  {
    title: "Health condition improved, very thankful",
    content: "After wearing it for {months} months, my old ailments have improved a lot. The doctor says I'm recovering very well. I know this is the blessing from Wutai Mountain masters!",
    rating: 5
  },
  {
    title: "Career going smoothly, benefactors helping",
    content: "Over these {months} months, I've met many benefactors at work, and projects have been going smoothly. I feel my fortune has truly improved. Very grateful!",
    rating: 5
  },
  {
    title: "Mindset became peaceful, worries reduced",
    content: "After wearing it for {months} months, I clearly feel my mindset has become much more peaceful. I used to be anxious all the time, but now I can calm down. It's really helpful!",
    rating: 5
  },
  {
    title: "Troublemakers stayed away, work is pleasant",
    content: "I've had it for {months} months, troublemakers at work have stayed away, and colleague relationships have become harmonious. I'm happy to go to work every day!",
    rating: 5
  },
  {
    title: "Home safe and peaceful, whole family benefits",
    content: "I've been offering it for {months} months, and everything at home is safe and smooth. The whole family is very healthy. Grateful for the protection from Wutai Mountain masters!",
    rating: 5
  },
  {
    title: "Relationship going smoothly, found true love",
    content: "After wearing it for {months} months, I finally met the right person. Now our relationship is very stable, and we're preparing to get married. I'm really thankful!",
    rating: 5
  },
  {
    title: "Amazing energy, life-changing experience",
    content: "I've been using this for {months} months and the positive changes in my life have been remarkable. My career has taken off and relationships have improved dramatically. The blessings are real!",
    rating: 5
  },
  {
    title: "Best decision I ever made",
    content: "After {months} months, I can confidently say this was one of the best decisions I've ever made. The protection and guidance I feel is incredible. Thank you Wutai Mountain!",
    rating: 5
  },
  {
    title: "Powerful protection, highly recommend",
    content: "The energy from this blessed item is powerful and protective. In these {months} months, I've avoided several potential disasters and my intuition has sharpened. Absolutely recommend!",
    rating: 5
  },
  {
    title: "Financial breakthrough after {months} months",
    content: "My financial situation has completely turned around since I started using this {months} months ago. Opportunities keep appearing and my income has doubled. Truly blessed!",
    rating: 5
  },
  {
    title: "Peace and clarity like never before",
    content: "For {months} months I've experienced a level of inner peace and mental clarity I've never had before. Meditation is deeper, decisions are clearer. Amazing!",
    rating: 5
  }
];

// 复评模板
const followUpTemplates = [
  "Update after several more months: the effects are still amazing! Continuing to wear it, grateful to Wutai Mountain masters!",
  "Coming back to review again, the effects continue to be stable, truly miraculous! I've recommended it to even more friends.",
  "I've been wearing it for almost a year now, my fortune has been consistently good, very satisfied! Will continue to acquire other blessed items.",
  "Follow-up review: the effects keep getting better, more good things have happened recently! Grateful!",
  "After several months, still very satisfied, the effects haven't diminished!",
  "Once again thanking Wutai Mountain masters, everything has been going smoothly these past months!",
  "Follow-up: my family all say I've changed a lot, will continue wearing it!",
  "Coming to update, the effects are really lasting, highly recommend!",
  "Several months have passed, the effects are still obvious, really worth it!",
  "Follow-up review: fortune continues to improve, grateful for Wutai Mountain masters' blessings!",
  "Still working wonderfully after all this time. The energy never fades!",
  "Update: My life keeps getting better. This is a permanent part of my daily routine now.",
  "Follow-up: Even my skeptical friends are now believers after seeing my transformation!",
  "Months later and I'm still amazed. The blessings compound over time!",
  "Coming back to say this continues to exceed my expectations. Worth every penny!"
];

// 生成随机日期(8个月前到现在)
function getRandomDate() {
  const now = new Date();
  const eightMonthsAgo = new Date(now.getTime() - 8 * 30 * 24 * 60 * 60 * 1000);
  const randomTime = eightMonthsAgo.getTime() + Math.random() * (now.getTime() - eightMonthsAgo.getTime());
  return new Date(randomTime);
}

// 生成评价
async function generateReviews() {
  console.log('开始生成英文评价数据...\n');
  
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
    console.log(`正在为商品 "${product.name}" 生成 ${reviewCount} 条评价...`);
    
    for (let i = 0; i < reviewCount; i++) {
      // 随机选择评价模板
      const template = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];
      
      // 随机月份(1-8个月前)
      const monthsAgo = Math.floor(Math.random() * 8) + 1;
      const createdAt = getRandomDate();
      
      // 替换模板中的变量
      const content = template.content.replace('{months}', monthsAgo);
      
      // 随机选择用户
      const user = users[Math.floor(Math.random() * users.length)];
      
      // 插入评价
      await db.insert(schema.reviews).values({
        productId: product.id,
        userId: user.id,
        orderId: null,
        rating: template.rating,
        title: template.title,
        content: content,
        isVerifiedPurchase: true,
        isApproved: true,
        createdAt: createdAt,
        updatedAt: createdAt
      });
      
      totalReviews++;
      
      // 每50条显示进度
      if ((i + 1) % 50 === 0) {
        console.log(`  进度: ${i + 1}/${reviewCount}`);
      }
      
      // 30%的概率生成复评
      if (Math.random() < 0.3) {
        const followUpContent = followUpTemplates[Math.floor(Math.random() * followUpTemplates.length)];
        const followUpDate = new Date(createdAt.getTime() + (Math.random() * 60 + 30) * 24 * 60 * 60 * 1000);
        
        await db.insert(schema.reviews).values({
          productId: product.id,
          userId: user.id,
          orderId: null,
          rating: 5,
          title: "Follow-up Review",
          content: followUpContent,
          isVerifiedPurchase: true,
          isApproved: true,
          createdAt: followUpDate,
          updatedAt: followUpDate
        });
        
        totalReviews++;
      }
    }
    
    console.log(`✓ 完成商品 "${product.name}"\n`);
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
