# Treasure 项目

> GitHub仓库地址: [https://github.com/yszhouwei/Treasure.git](https://github.com/yszhouwei/Treasure.git)

Treasure 是一个包含H5客户端和PC管理后台的现代化Web应用程序。

## 项目概述

本项目采用前沿的技术栈构建，注重性能、可维护性和可扩展性。

## 技术栈

- **前端**: React 18.x + TypeScript 5.x + Vite 4.x
- **UI库**: Ant Design Mobile (H5客户端) / Ant Design (PC管理后台)
- **状态管理**: Redux Toolkit
- **后端**: Node.js 18.x + NestJS
- **数据库**: MySQL 8.0+
- **ORM**: TypeORM
- **构建工具**: Vite 4.x
- **包管理器**: pnpm 8.x

## 项目结构

```
treasure/
├── client-h5/              # H5客户端
├── admin-pc/               # PC管理后台
├── server/                 # 后端服务
├── docs/                   # 文档
├── tests/                  # 测试文件
└── DEVELOPMENT_GUIDE.md    # 开发指南
```

## 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/yszhouwei/Treasure.git
cd Treasure
```

### 2. 开发H5客户端

**方式1：使用启动脚本**
```bash
# 在项目根目录运行
start-h5.bat
```

**方式2：手动启动**
```bash
cd client-h5
pnpm install
pnpm dev
```

访问：`http://localhost:5173`

📖 详细说明：查看 [client-h5/README-首页开发.md](client-h5/README-首页开发.md)

### 3. 开发PC管理后台
```bash
cd admin-pc
pnpm install
pnpm dev
```

### 4. 后端服务(待开发)
```bash
cd server
pnpm install
pnpm dev
```

## GitHub操作指南

### 查看配置
运行 `setup-github.bat` 查看当前Git配置

### 推送代码
运行 `push-to-github.bat` 将代码推送到GitHub

详细信息请参考:
- [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md) - 完整开发文档
- [GitHub配置说明.md](GitHub配置说明.md) - GitHub使用指南

## 当前状态

- ✅ H5客户端首页开发完成（严格按照UI设计实现）
  - ✅ 顶部导航栏（带语言切换）
  - ✅ 轮播Banner区域
  - ✅ 新人优惠卡片
  - ✅ 团购类型选择（10/20/50/100人团）
  - ✅ 热门团购商品列表
  - ✅ AI推荐商品列表
  - ✅ 底部导航栏
  - ✅ 精美SVG图片资源（5张）
  - ✅ 🌍 国际化支持（中文/英文）
- ⏳ PC管理后台待开发
- ⏳ 后端服务待开发

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request