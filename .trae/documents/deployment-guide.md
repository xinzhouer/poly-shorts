# Web应用部署指南

## 1. 项目构建流程

### 1.1 环境准备
确保你的开发环境已安装：
- Node.js (推荐 v18 或更高版本)
- npm 或 yarn 包管理器

### 1.2 构建命令
```bash
# 安装依赖
npm install

# 开发环境运行
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### 1.3 构建输出
构建完成后，会在项目根目录生成 `dist/` 文件夹，包含所有静态资源文件。

## 2. 部署选项

### 2.1 Vercel (推荐)
**优点**: 零配置部署、自动HTTPS、全球CDN、Git集成

**部署步骤**：
1. 注册 [Vercel](https://vercel.com) 账号
2. 连接你的GitHub/GitLab仓库
3. 导入项目，选择React框架
4. 保持默认设置，点击Deploy
5. 获得 `.vercel.app` 域名，可自定义域名

**配置文件** (`vercel.json`):
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

### 2.2 Netlify
**优点**: 拖拽部署、表单处理、无服务器函数

**部署步骤**：
1. 注册 [Netlify](https://netlify.com) 账号
2. 拖拽 `dist/` 文件夹到Netlify控制台
3. 自动获得 `.netlify.app` 域名
4. 可在设置中绑定自定义域名

### 2.3 GitHub Pages
**优点**: 免费、与GitHub集成、适合静态站点

**部署步骤**：
1. 在GitHub仓库设置中启用GitHub Pages
2. 选择部署源为GitHub Actions
3. 创建 `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    - run: npm install
    - run: npm run build
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## 3. 后端数据持久化考虑

### 3.1 当前localStorage限制
你的应用目前使用localStorage存储用户观看历史：
- **优点**: 简单易用、无需服务器
- **缺点**: 
  - 数据只在当前浏览器有效
  - 无法跨设备同步
  - 存储容量有限（通常5-10MB）
  - 用户清除浏览器数据时会丢失

### 3.2 推荐解决方案：Supabase

**Supabase优势**:
- 免费额度充足（500MB数据库 + 1GB文件存储）
- 内置身份验证
- 实时数据同步
- PostgreSQL数据库
- RESTful API自动生成

**集成步骤**：
1. 注册 [Supabase](https://supabase.com) 账号
2. 创建新项目
3. 安装依赖：`npm install @supabase/supabase-js`
4. 创建数据库表：

```sql
-- 用户观看历史表
CREATE TABLE watch_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  series_id VARCHAR(255),
  episode_number INTEGER,
  watched_at TIMESTAMP DEFAULT NOW()
);

-- 设置访问权限
GRANT ALL ON watch_history TO authenticated;
GRANT SELECT ON watch_history TO anon;
```

5. 创建Supabase客户端：
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 3.3 替代方案：Firebase

**Firebase优势**:
- Google产品，稳定性好
- 实时数据库
- 丰富的SDK
- 分析功能

**选择建议**:
- 需要PostgreSQL关系型数据库 → 选择Supabase
- 需要NoSQL文档数据库 → 选择Firebase
- 需要Google生态集成 → 选择Firebase

## 4. 域名设置

### 4.1 购买域名
推荐域名注册商：
- [Namecheap](https://namecheap.com) - 价格透明
- [Cloudflare](https://cloudflare.com) - 无溢价续费
- [阿里云](https://wanwang.aliyun.com) - 国内用户

### 4.2 域名解析配置

**Vercel域名绑定**：
1. 在Vercel项目设置中添加域名
2. 在域名DNS设置中添加CNAME记录：
   - 主机记录: `@` 或 `www`
   - 记录类型: `CNAME`
   - 记录值: `cname.vercel-dns.com`

**Netlify域名绑定**：
1. 在Netlify项目设置中添加自定义域名
2. 添加CNAME记录指向你的Netlify站点

### 4.3 HTTPS配置
所有现代部署平台都自动提供HTTPS证书，无需额外配置。

## 5. 维护与优化

### 5.1 性能优化
- **图片优化**: 使用WebP格式，添加懒加载
- **代码分割**: 使用动态导入减少首屏包大小
- **缓存策略**: 配置合理的缓存头
- **CDN使用**: 利用平台提供的全球CDN

### 5.2 监控与分析
- **Vercel Analytics**: 内置Web性能监控
- **Google Analytics**: 用户行为分析
- **Sentry**: 错误监控和报告

### 5.3 定期维护
- **依赖更新**: 每月检查并更新依赖包
- **安全审计**: 使用 `npm audit` 检查安全漏洞
- **备份策略**: 如果使用自建数据库，定期备份
- **性能监控**: 定期检查Core Web Vitals指标

### 5.4 成本控制
- **免费额度监控**: 关注Supabase/Firebase的使用量
- **图片优化**: 压缩图片减少存储和传输成本
- **代码优化**: 减少不必要的API调用

## 6. 部署检查清单

部署前确认：
- [ ] 所有环境变量已正确配置
- [ ] 构建命令能够成功执行
- [ ] 生产环境测试通过
- [ ] 域名解析已生效
- [ ] HTTPS证书正常工作
- [ ] 移动端适配良好
- [ ] 加载速度在可接受范围内

部署后确认：
- [ ] 所有功能正常工作
- [ ] 用户数据能够正确保存
- [ ] 错误处理机制有效
- [ ] 监控工具正常运行

通过以上步骤，你的Web应用就可以成功部署并让用户正常使用了。建议先从Vercel开始，因为它提供了最简单的部署流程和最完善的功能支持。