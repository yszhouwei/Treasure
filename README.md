# Treasure 项目

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

## 开发环境搭建

1. 克隆项目
2. 安装依赖
3. 启动开发服务器

详细信息请参考 [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md)