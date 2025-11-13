# GitHub 配置说明

## 当前配置状态 ✅

### 1. Git 用户信息
- **用户名**: Treasure Developer
- **邮箱**: developer@treasure.com

### 2. 远程仓库
- **仓库地址**: https://github.com/yszhouwei/Treasure.git
- **远程名称**: origin
- **当前分支**: master

### 3. 配置文件位置
- **仓库配置**: `.git/config`
- **忽略文件**: `.gitignore`

## 使用指南

### 快速检查配置
运行配置检查脚本:
```bash
setup-github.bat
```

### 推送代码到GitHub
运行推送脚本:
```bash
push-to-github.bat
```

### 手动Git命令

#### 1. 查看配置
```bash
git config user.name
git config user.email
git remote -v
```

#### 2. 添加文件并提交
```bash
# 添加所有文件
git add .

# 或添加指定文件
git add client-h5/

# 创建提交
git commit -m "提交说明"
```

#### 3. 推送到GitHub
```bash
# 首次推送(设置上游分支)
git push -u origin master

# 后续推送
git push
```

#### 4. 拉取更新
```bash
# 从GitHub拉取最新代码
git pull

# 或分步操作
git fetch origin
git merge origin/master
```

### 常用Git操作

#### 查看状态
```bash
git status
```

#### 查看提交历史
```bash
git log
git log --oneline
git log --graph --oneline --all
```

#### 查看差异
```bash
# 查看工作区与暂存区的差异
git diff

# 查看暂存区与最后一次提交的差异
git diff --staged
```

#### 分支管理
```bash
# 查看所有分支
git branch -a

# 创建新分支
git branch feature-name

# 切换分支
git checkout feature-name

# 或创建并切换(推荐)
git checkout -b feature-name

# 合并分支
git merge feature-name

# 删除分支
git branch -d feature-name
```

## 注意事项

### 1. 首次推送
如果是首次推送,需要进行GitHub身份验证:
- 使用个人访问令牌(Personal Access Token)代替密码
- 或配置SSH密钥

### 2. 生成GitHub个人访问令牌
1. 登录GitHub
2. 点击右上角头像 → Settings
3. 左侧菜单选择 Developer settings
4. 选择 Personal access tokens → Tokens (classic)
5. 点击 Generate new token
6. 设置权限(至少需要repo权限)
7. 生成后保存令牌(只显示一次)

### 3. 配置凭据存储
```bash
# 配置凭据存储(已配置)
git config credential.helper store

# Windows可以使用
git config credential.helper wincred
```

### 4. SSH密钥配置(可选,更安全)
```bash
# 生成SSH密钥
ssh-keygen -t ed25519 -C "developer@treasure.com"

# 查看公钥
cat ~/.ssh/id_ed25519.pub

# 复制公钥内容到GitHub
# Settings → SSH and GPG keys → New SSH key

# 修改远程仓库URL为SSH
git remote set-url origin git@github.com:yszhouwei/Treasure.git
```

## 当前待提交文件

根据 `git status` 显示,以下文件待提交:
- `client-h5/` - H5客户端完整目录

## 推荐提交信息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type类型
- **feat**: 新功能
- **fix**: 修复bug
- **docs**: 文档更新
- **style**: 代码格式调整(不影响功能)
- **refactor**: 代码重构
- **test**: 测试相关
- **chore**: 构建工具或辅助工具的变动

### 示例
```bash
feat(client-h5): 完成基础架构搭建

- 配置React + Vite + TypeScript开发环境
- 集成TailwindCSS样式框架
- 实现基础组件(Button, Input)
- 创建MainLayout主布局
- 完成Home主页界面
```

## 项目结构
```
Treasure/
├── .git/                   # Git配置目录
├── .gitignore             # Git忽略文件配置
├── client-h5/             # H5客户端(待提交)
│   ├── src/               # 源代码
│   ├── public/            # 静态资源
│   ├── package.json       # 依赖配置
│   └── vite.config.ts     # 构建配置
├── admin-pc/              # PC管理后台(待开发)
├── server/                # 后端服务(待开发)
├── DEVELOPMENT_GUIDE.md   # 开发文档
├── README.md              # 项目说明
├── setup-github.bat       # GitHub配置检查脚本
├── push-to-github.bat     # 代码推送脚本
└── GitHub配置说明.md      # 本文档
```

## 联系方式
如有问题,请查阅 `DEVELOPMENT_GUIDE.md` 或联系项目负责人。

---

*最后更新: 2025-11-12*

