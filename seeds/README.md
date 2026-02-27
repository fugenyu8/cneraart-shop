# 数据库种子文件 / Database Seed Files

## 文件说明

### products-and-images.sql (222KB)
包含所有产品、产品图片和分类数据：
- **67个产品**（开光护佑法物、命理运势、面相手相风水等分类）
- **132张产品图片**（CDN URL）
- **11个分类**

### reviews.sql.gz (61MB 压缩包 → 271MB 解压后)
包含所有产品评论数据：
- **816,730条多语言评论**（中文、英文、日文、韩文、阿拉伯文等15种语言）

由于文件过大，reviews.sql.gz 托管在 CDN：
```
https://files.manuscdn.com/user_upload_by_module/session_file/310519663348895853/VUVvyjPIUEBuIdJu.gz
```

---

## 导入方法

### 1. 导入产品和图片数据
```bash
mysql -u root -p your_database_name < seeds/products-and-images.sql
```

### 2. 下载并导入评论数据
```bash
# 下载评论数据
curl -L "https://files.manuscdn.com/user_upload_by_module/session_file/310519663348895853/VUVvyjPIUEBuIdJu.gz" -o seeds/reviews.sql.gz

# 解压
gunzip seeds/reviews.sql.gz

# 导入（时间较长，约5-10分钟）
mysql -u root -p your_database_name < seeds/reviews.sql
```

### 3. 验证导入结果
```sql
SELECT COUNT(*) FROM products;        -- 应为 67
SELECT COUNT(*) FROM product_images;  -- 应为 132
SELECT COUNT(*) FROM reviews;         -- 应为 816730
SELECT COUNT(*) FROM categories;      -- 应为 11
```

---

## 注意事项

1. 请先运行 `pnpm db:push` 创建数据库表结构，再导入种子数据
2. 导入前确保数据库字符集为 `utf8mb4`
3. 产品图片使用 CDN URL，无需下载图片文件
4. 如遇重复键错误，可在 SQL 语句中将 `INSERT INTO` 改为 `INSERT IGNORE INTO`
