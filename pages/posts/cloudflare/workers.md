---
title: Cloudflare workers 构建和部署无服务器功能、站点和全栈应用程序。
date: 2025-09-03
updated: 2025-09-03
categories: Cloudflare
tags:
  - Cloudflare
  - workers
  - d1
---

Cloudflare Workers 是一个强大的无服务器计算平台，能让你在 Cloudflare 的全球边缘网络上运行代码，无需管理服务器。轻松构建和部署无服务器功能、站点和全栈应用程序。

---

## 一、前期准备

1.  **注册 Cloudflare 账户**：访问 https://www.cloudflare.com/ 注册一个账户。
1.  **注册 github 账户**：访问 https://www.github.com/ 注册一个账户。

## 二、部署静态网站

### 1. 进入 Cloudflare 控制台
登录 Cloudflare 账户后，进入 **Workers & Pages** 服务页面。

### 2. 选择部署方式
Cloudflare 提供两种部署方案：
- **Pages**：专为静态网站优化，提供自动化构建流程
- **Workers**：支持更复杂的服务器逻辑，兼容静态页面部署

### 3. 连接 GitHub 仓库
点击"从Git仓库创建"后，系统将跳转至 GitHub 进行授权：
- 🔐 **安全建议**：选择"仅授权特定仓库"，限制访问权限
- 选择您要部署的具体仓库

### 4. 配置构建设置
在项目设置界面，需要完成以下配置：

**基本设置**：
- 输入项目名称（将用于生成临时访问域名）

**构建配置**（根据项目类型选择）：
- **Node.js 项目**（React/Vue等框架）：
  ```bash
  构建命令：npm run build
  输出目录：dist（或根据实际构建输出目录调整）
  ```
  代码根目录添加 `wrangler.toml` 配置文件用来指定输入目录
  ```toml
    name = "项目名称"
    compatibility_date = "2025-09-03"
    # 核心配置：绑定静态资源目录
    [assets]
    directory = "./dist"  # 指向编译后的目录
    not_found_handling = "single-page-application"  # 可选：SPA 模式，所有路径返回 index.html
  ```
- **纯 HTML 项目**：
  - 构建命令留空
  - 输出目录设置为包含 HTML 文件的目录

### 5. 开始部署
点击"部署"按钮后，系统将：
- 自动拉取代码库内容
- 执行构建命令（如已配置）
- 将生成的文件部署至全球 CDN 网络
- 提供 `*.pages.dev` 临时域名用于访问

## 三、serverless 云函数
worker的功能不止能部署静态网站，还可以配合D1 SQL数据库实现全栈应用程序。
官方提供了多个模板，下面是 Cloudflare Workers 项目的标准目录结构：

```
my-worker-project/
├── src/                   # 源代码目录
│   ├── index.ts           # 主入口文件
│   ├── utils/             # 工具函数目录
│   │   ├── db.ts          # 数据库操作工具
│   │   └── auth.ts        # 认证工具
│   └── routes/            # 路由目录
│       ├── api.ts         # API路由
│       └── static.ts      # 静态文件路由
│
├── public/                # 静态资源目录（可选）
│   ├── index.html
│   ├── styles.css
│   └── images/
│
├── migrations/            # 数据库迁移脚本（使用D1时）
│   ├── 0001_initial.sql
│   └── 0002_add_feature.sql
│
├── tests/                  # 测试目录
│   ├── unit/              # 单元测试
│   └── integration/       # 集成测试
│
├── wrangler.toml           # Wrangler配置文件
├── package.json            # 项目依赖和脚本
├── tsconfig.json           # TypeScript配置
├── .gitignore              # Git忽略文件
└── README.md               # 项目文档
```

### 1. `src/index.ts` - 主入口文件
```typescript
import { Hono } from 'hono';

const app = new Hono();

// 基本路由
app.get('/', (c) => c.text('Hello Cloudflare Workers!'));

// 导入其他路由
import api from './routes/api';
app.route('/api', api);

export default app;
```

### 2. `wrangler.toml` - 配置文件
```toml
name = "my-worker"
main = "src/index.ts"
compatibility_date = "2024-01-01"

# D1数据库配置
[[d1_databases]]
binding = "DB"
database_name = "my-database"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

# KV命名空间配置
[[kv_namespaces]]
binding = "MY_KV"
id = "yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy"

# 环境变量
[vars]
API_KEY = "secret-value"
ENVIRONMENT = "production"
```

### 3. `src/routes/api.ts` - API路由示例
```typescript
import { Hono } from 'hono';

const api = new Hono();

api.get('/users', async (c) => {
  const db = c.env.DB;
  const { results } = await db.prepare("SELECT * FROM users").all();
  return c.json(results);
});

api.post('/users', async (c) => {
  const { name, email } = await c.req.json();
  const db = c.env.DB;
  await db.prepare("INSERT INTO users (name, email) VALUES (?, ?)")
          .bind(name, email)
          .run();
  return c.text('User created', 201);
});

export default api;
```


## 四、后续操作

### 自定义域名
部署完成后，您可以在设置中添加自定义域名：
- 支持根域名（example.com）
- 支持子域名（www.example.com）
- 自动配置 SSL 证书

### 环境变量配置
如项目需要环境变量：
- 在项目设置中添加环境变量
- 区分生产环境和预览环境
- 保护敏感信息不被泄露

### 自动部署
开启后，每次向主分支推送代码时将：
- 自动触发重新构建
- 完成全自动部署流程
- 保持网站内容最新

---
