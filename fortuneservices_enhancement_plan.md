# FortuneServices功能优化技术方案

## 一、服务预约表单和支付集成

### 1.1 数据库表设计

#### fortune_bookings表
```sql
CREATE TABLE fortune_bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  service_type ENUM('face', 'palm', 'fengshui') NOT NULL,
  booking_date DATETIME NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  question_description TEXT,
  image_urls JSON, -- 存储上传的图片URL数组
  payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  payment_id VARCHAR(255), -- PayPal支付ID
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
  report_url VARCHAR(500), -- 生成的报告URL
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);
```

### 1.2 文件上传流程
1. 用户在表单中选择图片
2. 前端调用`storagePut`上传到S3
3. 获取图片URL并保存到数据库的`image_urls`字段(JSON数组)
4. 限制: 每个服务最多上传3张图片,单张图片最大5MB

### 1.3 支付集成(PayPal)
- 使用现有的PayPal配置(`VITE_PAYPAL_CLIENT_ID`)
- 支付流程:
  1. 用户填写预约表单
  2. 点击"立即预约"创建PayPal订单
  3. 跳转到PayPal支付页面
  4. 支付成功后回调,更新`payment_status`为`completed`
  5. 发送确认邮件给用户

### 1.4 UI组件设计
- 创建`BookingDialog.tsx`组件(shadcn Dialog)
- 表单字段:
  - 服务类型(自动填充,不可修改)
  - 预约日期(DatePicker)
  - 姓名(必填)
  - 邮箱(必填)
  - 电话(选填)
  - 问题描述(Textarea,选填)
  - 图片上传(最多3张)
- 使用react-hook-form进行表单验证

---

## 二、客户评价模块

### 2.1 数据库表设计

#### fortune_reviews表
```sql
CREATE TABLE fortune_reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  booking_id INT,
  service_type ENUM('face', 'palm', 'fengshui') NOT NULL,
  customer_name VARCHAR(100) NOT NULL, -- 匿名显示(如"张**")
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  review_date DATE NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE, -- 是否精选展示
  is_approved BOOLEAN DEFAULT FALSE, -- 管理员审核
  language VARCHAR(10) DEFAULT 'zh', -- 评价语言
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES fortune_bookings(id) ON DELETE SET NULL
);
```

### 2.2 评价展示逻辑
- 只显示`is_approved=true`的评价
- 优先显示`is_featured=true`的评价
- 每个服务类型显示2-3条评价
- 客户姓名匿名处理(如"张**"、"John D.")
- 评价按日期倒序排列

### 2.3 UI组件设计
- 创建`ReviewsSection.tsx`组件
- 显示内容:
  - 5星评分(星星图标)
  - 评价文字
  - 客户姓名(匿名)
  - 服务类型标签
  - 评价日期
- 使用Card组件展示,每行3个评价(移动端1个)

### 2.4 管理后台
- 在Admin面板添加"评价管理"页面
- 功能:
  - 查看所有评价
  - 审核/拒绝评价
  - 设置精选评价
  - 删除不当评价

---

## 三、移动端响应式优化

### 3.1 断点设计
- 手机: < 768px
- 平板: 768px - 1024px
- 桌面: > 1024px

### 3.2 优化重点

#### 服务卡片
```css
/* 移动端 */
@media (max-width: 767px) {
  - grid-cols-1 (单列布局)
  - padding: 1rem (减少内边距)
  - text-2xl → text-xl (标题字体)
  - text-lg → text-base (描述字体)
  - gap-8 → gap-4 (减少间距)
}
```

#### 预约表单
- 移动端全屏显示Dialog
- 输入框高度增加(min-h-12)
- 按钮高度增加(h-12)
- 字体大小适配(text-base)

#### 评价模块
- 移动端单列显示
- 评价卡片宽度100%
- 字体大小适配

### 3.3 触摸优化
- 按钮最小触摸区域: 44px x 44px
- 增加按钮间距: gap-4
- 优化表单输入框触摸体验

---

## 四、i18n翻译

### 4.1 需要添加的翻译key
```json
{
  "booking": {
    "title": "预约服务",
    "selectDate": "选择日期",
    "name": "姓名",
    "email": "邮箱",
    "phone": "电话(选填)",
    "question": "问题描述",
    "uploadImages": "上传图片",
    "maxImages": "最多上传3张",
    "submit": "确认预约并支付",
    "success": "预约成功!",
    "failed": "预约失败,请重试"
  },
  "reviews": {
    "title": "客户评价",
    "rating": "评分",
    "verified": "已验证",
    "anonymous": "匿名用户"
  }
}
```

---

## 五、实施步骤

### Phase 1: 数据库和后端
1. 更新`drizzle/schema.ts`添加两个新表
2. 运行`pnpm db:push`
3. 创建`server/booking.ts`处理预约逻辑
4. 创建`server/review.ts`处理评价逻辑
5. 在`server/routers.ts`中添加相关procedures

### Phase 2: 前端UI
1. 创建`BookingDialog.tsx`组件
2. 创建`ReviewsSection.tsx`组件
3. 更新`FortuneServices.tsx`集成新组件
4. 添加移动端响应式样式

### Phase 3: 支付集成
1. 集成PayPal SDK
2. 实现支付回调处理
3. 添加支付成功/失败页面

### Phase 4: 测试和优化
1. 编写vitest测试
2. 测试移动端体验
3. 测试支付流程
4. i18n翻译验证

---

## 六、技术栈

- **表单**: react-hook-form + zod
- **支付**: PayPal JavaScript SDK
- **文件上传**: S3 (storagePut)
- **UI组件**: shadcn/ui (Dialog, DatePicker, Card)
- **数据库**: MySQL/TiDB (Drizzle ORM)
- **状态管理**: tRPC + React Query
