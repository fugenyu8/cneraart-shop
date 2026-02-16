import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { products, categories } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

const connection = await mysql.createConnection(DATABASE_URL);
const db = drizzle(connection);

console.log('🌟 开始添加命理服务产品...\n');

// 1. 创建或获取"命理服务"分类
let serviceCategory = await db.select().from(categories).where(eq(categories.slug, 'fortune-services')).limit(1);

if (serviceCategory.length === 0) {
  console.log('📁 创建"命理服务"分类...');
  const [newCategory] = await db.insert(categories).values({
    name: '命理服务',
    slug: 'fortune-services',
    description: '专业的面相、手相、风水分析服务',
    displayOrder: 100,
  });
  serviceCategory = await db.select().from(categories).where(eq(categories.id, newCategory.insertId));
  console.log('✅ 分类创建成功\n');
} else {
  console.log('✅ "命理服务"分类已存在\n');
}

const categoryId = serviceCategory[0].id;

// 2. 定义3个服务产品
const services = [
  {
    name: '面相分析服务',
    slug: 'face-reading-service',
    shortDescription: '传承千年相术，观面知命，解析事业财运、健康婚姻之运势起伏',
    description: `## 面相分析服务

传承千年相术，观面知命，解析事业财运、健康婚姻之运势起伏。

### 服务内容
- **十二宫位分析**: 全面解读面部十二宫位的吉凶
- **流年运势**: 分析未来一年的运势走向
- **事业财运**: 深度解析事业发展和财富机遇
- **健康婚姻**: 洞察健康状况和婚姻感情

### 服务流程
1. 上传清晰的正面照片
2. 填写问题描述(可选)
3. 完成支付
4. 48小时内收到详细报告(PDF格式)

### 报告内容
- 面相总体评价
- 十二宫位详细解读
- 事业财运分析
- 健康婚姻建议
- 改善建议和注意事项`,
    regularPrice: '9.90',
    categoryId,
    sku: 'FORTUNE-FACE-001',
    stock: 9999, // 虚拟产品,库存设置为大数
    status: 'published',
    featured: true,
    blessingTemple: '五台山',
    blessingMaster: '五台山大师',
    blessingDescription: '结合传统面相学与现代分析技术',
  },
  {
    name: '手相分析服务',
    slug: 'palm-reading-service',
    shortDescription: '掌中乾坤，纹理藏玄机，洞悉人生轨迹，指引命运方向',
    description: `## 手相分析服务

掌中乾坤，纹理藏玄机，洞悉人生轨迹，指引命运方向。

### 服务内容
- **三大主线**: 生命线、智慧线、感情线深度解读
- **财运线**: 分析财富积累和投资运势
- **事业线**: 洞察职业发展和事业成就
- **婚姻线**: 解读感情婚姻和人际关系

### 服务流程
1. 上传清晰的手掌照片(左右手各一张)
2. 填写问题描述(可选)
3. 完成支付
4. 48小时内收到详细报告(PDF格式)

### 报告内容
- 手相总体评价
- 三大主线详细解读
- 财运事业分析
- 婚姻感情建议
- 改善建议和注意事项`,
    regularPrice: '9.90',
    categoryId,
    sku: 'FORTUNE-PALM-001',
    stock: 9999,
    status: 'published',
    featured: true,
    blessingTemple: '五台山',
    blessingMaster: '五台山大师',
    blessingDescription: '结合传统手相学与现代分析技术',
  },
  {
    name: '家居风水服务',
    slug: 'fengshui-service',
    shortDescription: '五台山大师堪舆之道，调和气场能量，化解煞气，招财旺运',
    description: `## 家居风水服务

五台山大师堪舆之道，调和气场能量，化解煞气，招财旺运。

### 服务内容
- **布局分析**: 全面分析房间布局的风水吉凶
- **色彩搭配**: 根据五行理论推荐最佳色彩方案
- **化解煞气**: 识别并提供化解方案
- **招财旺运**: 提供招财旺运的风水布局建议

### 服务流程
1. 上传房间照片(多角度,最多3张)
2. 描述房间类型和具体问题
3. 完成支付
4. 48小时内收到详细报告(PDF格式)

### 报告内容
- 风水总体评价
- 布局优缺点分析
- 色彩搭配建议
- 煞气化解方案
- 招财旺运布局指导`,
    regularPrice: '11.90',
    categoryId,
    sku: 'FORTUNE-FENGSHUI-001',
    stock: 9999,
    status: 'published',
    featured: true,
    blessingTemple: '五台山',
    blessingMaster: '五台山大师',
    blessingDescription: '结合传统风水学与现代居家设计',
  },
];

// 3. 插入或更新服务产品
for (const service of services) {
  const existing = await db.select().from(products).where(eq(products.slug, service.slug)).limit(1);
  
  if (existing.length === 0) {
    console.log(`➕ 添加产品: ${service.name}`);
    await db.insert(products).values(service);
    console.log(`✅ ${service.name} 添加成功`);
  } else {
    console.log(`🔄 更新产品: ${service.name}`);
    await db.update(products).set(service).where(eq(products.slug, service.slug));
    console.log(`✅ ${service.name} 更新成功`);
  }
  console.log('');
}

console.log('🎉 所有命理服务产品已成功添加!\n');

await connection.end();
