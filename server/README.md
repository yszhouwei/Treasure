# Treasure 后端服务

基于 NestJS 的后端 API 服务。

## 技术栈

- **框架**: NestJS 10.x
- **数据库**: MySQL 8.0+
- **ORM**: TypeORM
- **认证**: JWT + Passport
- **语言**: TypeScript

## 环境要求

- Node.js >= 18.0.0
- MySQL >= 8.0
- npm 或 pnpm

## 安装步骤

1. 安装依赖：
```bash
cd server
npm install
# 或
pnpm install
```

2. 配置环境变量：
```bash
cp .env.example .env
```

编辑 `.env` 文件，配置数据库连接信息：
```
DB_HOST=47.97.106.181
DB_PORT=3306
DB_USERNAME=treasurex
DB_PASSWORD=R5ZFBkyWF5JNdWFa
DB_DATABASE=treasurex
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
```

3. 初始化数据库：
```bash
# 连接到MySQL数据库，执行以下SQL文件创建表结构
mysql -h 47.97.106.181 -u treasurex -p treasurex < database/schema.sql
```

4. 启动开发服务器：
```bash
npm run start:dev
# 或
pnpm start:dev
```

服务器将在 `http://localhost:3000` 启动。

## API 接口

### 认证相关

- `POST /auth/register` - 用户注册
- `POST /auth/login` - 用户登录
- `POST /auth/profile` - 获取用户信息（需要JWT认证）

### 用户相关

- `GET /users/profile` - 获取当前用户信息（需要JWT认证）
- `PUT /users/profile` - 更新用户信息（需要JWT认证）
- `GET /users/:id` - 获取指定用户信息（需要JWT认证）

### 商品相关

- `GET /products` - 获取商品列表（支持分页、筛选）
- `GET /products/hot` - 获取热门商品
- `GET /products/recommend` - 获取推荐商品
- `GET /products/:id` - 获取商品详情
- `POST /products` - 创建商品（需要JWT认证）
- `PUT /products/:id` - 更新商品（需要JWT认证）
- `DELETE /products/:id` - 删除商品（需要JWT认证）

### 订单相关

- `GET /orders` - 获取订单列表（需要JWT认证）
- `GET /orders/:id` - 获取订单详情（需要JWT认证）
- `POST /orders` - 创建订单（需要JWT认证）

### 团队相关

- `GET /teams` - 获取团队列表
- `GET /teams/:id` - 获取团队详情
- `GET /teams/my/overview` - 获取我的团队概览（需要JWT认证）

### 支付相关

- `POST /payments/recharge` - 充值（需要JWT认证）
- `POST /payments/withdraw` - 提现（需要JWT认证）

### 内容相关

- `GET /contents/trending` - 获取热门内容
- `GET /contents/insights` - 获取灵感清单
- `GET /contents/stories` - 获取故事
- `GET /contents/:id` - 获取内容详情

### 轮播图相关

- `GET /banners` - 获取轮播图列表

## 数据库表结构

数据库包含以下主要表：

- `users` - 用户表
- `teams` - 团队表
- `products` - 商品表
- `product_categories` - 商品分类表
- `orders` - 订单表
- `payments` - 支付记录表
- `group_buying` - 团购活动表
- `group_participants` - 团购参与记录表
- `lottery_records` - 开奖记录表
- `dividends` - 分红记录表
- `contents` - 内容表
- `banners` - 轮播图表
- `user_addresses` - 用户地址表
- `financial_records` - 财务流水表
- `notifications` - 消息通知表
- `suppliers` - 供应商表
- `purchase_orders` - 采购订单表
- `logistics_companies` - 物流公司表
- `system_configs` - 系统配置表
- `operation_logs` - 操作日志表

详细表结构请查看 `database/schema.sql` 文件。

## 开发命令

```bash
# 开发模式（热重载）
npm run start:dev

# 生产模式
npm run start:prod

# 构建
npm run build

# 代码格式化
npm run format

# 代码检查
npm run lint

# 运行测试
npm run test
```

## 项目结构

```
server/
├── src/
│   ├── config/          # 配置文件
│   ├── database/        # 数据库模块
│   ├── entities/        # 数据库实体
│   ├── modules/         # 业务模块
│   │   ├── auth/        # 认证模块
│   │   ├── users/       # 用户模块
│   │   ├── products/    # 商品模块
│   │   ├── orders/      # 订单模块
│   │   ├── teams/        # 团队模块
│   │   ├── payments/     # 支付模块
│   │   ├── contents/    # 内容模块
│   │   └── banners/     # 轮播图模块
│   ├── app.module.ts    # 根模块
│   ├── app.controller.ts # 根控制器
│   ├── app.service.ts   # 根服务
│   └── main.ts          # 入口文件
├── database/            # 数据库脚本
│   └── schema.sql       # 数据库表结构
├── .env.example         # 环境变量示例
├── package.json         # 项目配置
└── tsconfig.json        # TypeScript配置
```

## 注意事项

1. 生产环境请修改 `JWT_SECRET` 为强随机字符串
2. 生产环境请设置 `NODE_ENV=production` 并关闭 `synchronize`
3. 建议使用环境变量管理敏感信息
4. 定期备份数据库

## 后续开发计划

- [ ] 完善支付模块（微信支付、支付宝集成）
- [ ] 实现开奖和分红机制
- [ ] 完善内容管理模块
- [ ] 实现消息通知系统
- [ ] 添加数据统计功能
- [ ] 实现文件上传功能
- [ ] 添加单元测试和集成测试

