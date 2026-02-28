import mysql from 'mysql2/promise';

const DB_URL = 'mysql://3sTgkhNymxcGJsq.dc2e5ef9e23e:3i3JNeXks4422BKffDiV@gateway03.us-east-1.prod.aws.tidbcloud.com:4000/c8K47cxkpiofT46rxSignU?ssl={"rejectUnauthorized":true}';

const hasChinese = (str) => /[\u4e00-\u9fff]/.test(str || '');
const isJson = (str) => { try { JSON.parse(str); return true; } catch { return false; } };

async function main() {
  const conn = await mysql.createConnection(DB_URL);

  // 今天新增的产品：Health&Safety(630001-630022), Inner Peace(700001+), Wealth&Fortune(800001+), Wisdom&Study(900001+)
  // 实际上用分类ID来筛选更准确
  const [products] = await conn.execute(`
    SELECT p.id, p.name, p.description, p.shortDescription, p.salePrice as price, p.regularPrice as originalPrice,
           p.slug, p.categoryId, p.status, p.stock,
           c.name as categoryName,
           (SELECT COUNT(*) FROM product_images pi WHERE pi.productId = p.id) as imageCount,
           (SELECT COUNT(*) FROM reviews r WHERE r.productId = p.id) as reviewCount
    FROM products p
    LEFT JOIN categories c ON p.categoryId = c.id
    WHERE p.categoryId IN (
      SELECT id FROM categories WHERE name IN ('Health & Safety', 'Inner Peace', 'Wealth & Fortune', 'Wisdom & Study')
    )
    ORDER BY p.categoryId, p.id
  `);

  console.log(`\n${'='.repeat(80)}`);
  console.log(`📦 今日新增商品全面自检报告`);
  console.log(`${'='.repeat(80)}`);
  console.log(`总计: ${products.length} 个产品\n`);

  const issues = [];
  const stats = {
    total: products.length,
    priceOk: 0,
    imagesOk: 0,
    descOk: 0,
    langOk: 0,
    reviewsOk: 0,
    statusOk: 0,
  };

  // 按分类分组
  const byCategory = {};
  for (const p of products) {
    if (!byCategory[p.categoryName]) byCategory[p.categoryName] = [];
    byCategory[p.categoryName].push(p);
  }

  for (const [catName, catProducts] of Object.entries(byCategory)) {
    console.log(`\n📂 ${catName} (${catProducts.length} 个产品)`);
    console.log(`${'─'.repeat(60)}`);

    for (const p of catProducts) {
      const productIssues = [];

      // 1. 价格检查
      const price = parseFloat(p.price);
      const origPrice = parseFloat(p.originalPrice);
      if (!price || price <= 0) productIssues.push(`❌ 价格异常: ${p.price}`);
      else if (price < 10) productIssues.push(`⚠️ 价格偏低: $${price}`);
      else if (price > 500) productIssues.push(`⚠️ 价格偏高: $${price}`);
      else stats.priceOk++;

      if (origPrice && origPrice <= price) productIssues.push(`⚠️ 原价(${origPrice})≤现价(${price})`);

      // 2. 图片检查
      if (p.imageCount === 0) productIssues.push(`❌ 无图片`);
      else if (p.imageCount < 2) productIssues.push(`⚠️ 图片数量少(${p.imageCount}张)`);
      else stats.imagesOk++;

      // 3. 描述检查
      if (!p.description || p.description.length < 50) {
        productIssues.push(`❌ 描述过短或为空(${p.description?.length || 0}字)`);
      } else if (isJson(p.description)) {
        productIssues.push(`❌ 描述是JSON格式，需提取英文`);
      } else {
        stats.descOk++;
      }

      if (!p.shortDescription || p.shortDescription.length < 10) {
        productIssues.push(`⚠️ 短描述为空或过短`);
      }

      // 4. 语言一致性
      const nameChinese = hasChinese(p.name);
      const descChinese = hasChinese(p.description);
      const shortDescChinese = hasChinese(p.shortDescription);
      const slugChinese = hasChinese(p.slug);

      if (nameChinese) productIssues.push(`❌ 名称含中文: ${p.name}`);
      if (descChinese) productIssues.push(`❌ 描述含中文`);
      if (shortDescChinese) productIssues.push(`❌ 短描述含中文`);
      if (slugChinese) productIssues.push(`❌ slug含中文: ${p.slug}`);
      if (!nameChinese && !descChinese && !shortDescChinese && !slugChinese) stats.langOk++;

      // 5. 评论检查
      if (p.reviewCount < 100) productIssues.push(`❌ 评论数量不足: ${p.reviewCount}条`);
      else if (p.reviewCount < 30000) productIssues.push(`⚠️ 评论数量少于30000: ${p.reviewCount}条`);
      else stats.reviewsOk++;

      // 6. 状态检查
      // 生产库使用 'published' 表示已上架，开发库使用 'active'，两者都是正常状态
      if (p.status !== 'active' && p.status !== 'published') productIssues.push(`❌ 状态异常: ${p.status}`);
      else stats.statusOk++;

      // 7. slug检查
      if (!p.slug || p.slug.length < 3) productIssues.push(`❌ slug为空或过短`);
      if (p.slug && /[A-Z\s]/.test(p.slug)) productIssues.push(`⚠️ slug含大写或空格: ${p.slug}`);

      // 输出结果
      const statusIcon = productIssues.length === 0 ? '✅' : (productIssues.some(i => i.startsWith('❌')) ? '❌' : '⚠️');
      console.log(`\n${statusIcon} [${p.id}] ${p.name}`);
      console.log(`   价格: $${price} (原价: $${origPrice || 'N/A'}) | 图片: ${p.imageCount}张 | 评论: ${p.reviewCount}条 | 状态: ${p.status}`);

      if (productIssues.length > 0) {
        productIssues.forEach(issue => console.log(`   ${issue}`));
        issues.push({ id: p.id, name: p.name, category: catName, issues: productIssues });
      }
    }
  }

  // 汇总报告
  console.log(`\n${'='.repeat(80)}`);
  console.log(`📊 自检汇总`);
  console.log(`${'='.repeat(80)}`);
  console.log(`总产品数: ${stats.total}`);
  console.log(`价格正常: ${stats.priceOk}/${stats.total}`);
  console.log(`图片充足: ${stats.imagesOk}/${stats.total}`);
  console.log(`描述完整: ${stats.descOk}/${stats.total}`);
  console.log(`语言一致: ${stats.langOk}/${stats.total}`);
  console.log(`评论充足(30000+): ${stats.reviewsOk}/${stats.total}`);
  console.log(`状态正常: ${stats.statusOk}/${stats.total}`);

  if (issues.length === 0) {
    console.log(`\n🎉 所有产品检查通过，无问题！`);
  } else {
    const critical = issues.filter(i => i.issues.some(x => x.startsWith('❌')));
    const warnings = issues.filter(i => !i.issues.some(x => x.startsWith('❌')));
    console.log(`\n❌ 严重问题: ${critical.length} 个产品`);
    console.log(`⚠️ 警告: ${warnings.length} 个产品`);
    console.log(`✅ 完全正常: ${stats.total - issues.length} 个产品`);
  }

  await conn.end();
}

main().catch(console.error);
