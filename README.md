# OpenList 美化配置生成器

基于Vue3的可视化配置工具，帮助用户轻松生成OpenList美化文件。

## ✨ 项目特性

- 🎨 **可视化配置界面** - 无需编写代码，通过图形界面配置美化参数
- 📋 **一键复制/下载** - 支持复制到剪贴板或下载生成的文件
- 🔧 **配置导入/导出** - 支持配置文件的备份和迁移
- 📱 **响应式设计** - 完美适配桌面端和移动端
- 🚀 **现代技术栈** - 基于Vue3+TypeScript+Vite开发

## 🛠️ 技术栈

- **前端框架**: Vue 3.5 + TypeScript
- **UI组件**: Element Plus
- **状态管理**: Pinia
- **构建工具**: Vite 6
- **开发工具**: ESLint + Vue TSC

## 📦 安装使用

### 开发环境

```bash
# 克隆项目
git clone <repository-url>
cd openlist-beautifier-generator

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 类型检查
pnpm type-check

# 构建生产版本
pnpm build
```

### 生产部署

```bash
# 构建项目
pnpm build

# 部署 dist 目录到您的Web服务器
```

## 🎯 功能模块

### 配置面板
- **颜色配置**: 浅色/深色主题背景色设置
- **选择器配置**: CSS选择器和忽略规则管理
- **路径配置**: 排除美化的页面路径设置
- **性能配置**: 观察器和节流参数调优

### 输出面板
- **文件预览**: head.html和body.html内容预览
- **复制功能**: 单个文件或全部文件复制到剪贴板
- **下载功能**: 支持单独下载或ZIP包下载
- **配置管理**: JSON配置导入导出

## 📋 使用指南

### 基本流程

1. **配置参数** - 在左侧配置面板调整美化参数
2. **预览效果** - 在右侧输出面板查看生成的文件内容
3. **获取文件** - 选择复制或下载生成的文件
4. **部署到OpenList** - 将文件内容粘贴到OpenList设置中

### 配置说明

#### 颜色配置
- **浅色主题**: 设置浅色模式下的背景色
- **深色主题**: 设置深色模式下的背景色  
- **忽略前缀**: 包含此前缀的颜色不会被替换

#### 选择器配置
- **主题选择器**: Hope UI的浅色/深色主题根选择器
- **根元素**: MutationObserver观察的根元素
- **忽略列表**: 不进行美化的CSS选择器列表

#### 路径配置
- **排除路径**: 不启用美化的页面路径前缀列表

#### 性能配置
- **节流延迟**: 美化操作的节流时间，影响性能和响应速度
- **观察器**: DOM变化监听的配置选项

## 📁 项目结构

```
src/
├── components/          # Vue组件
│   ├── ColorConfig.vue     # 颜色配置组件
│   ├── SelectorConfig.vue  # 选择器配置组件
│   ├── PathConfig.vue      # 路径配置组件
│   ├── PerformanceConfig.vue # 性能配置组件
│   └── OutputPanel.vue     # 输出面板组件
├── stores/             # Pinia状态管理
│   └── config.ts          # 配置状态管理
├── templates/          # 文件模板
│   ├── head.ts            # head.html模板
│   └── body.ts            # body.html模板
├── types/              # TypeScript类型定义
│   └── config.ts          # 配置类型定义
├── utils/              # 工具函数
│   ├── clipboard.ts       # 剪贴板操作
│   ├── download.ts        # 文件下载
│   ├── fileGenerator.ts   # 文件生成器
│   └── defaults.ts        # 默认配置
├── views/              # 页面组件
│   └── Home.vue           # 主页面
├── router/             # 路由配置
│   └── index.ts
├── App.vue             # 根组件
└── main.ts            # 入口文件
```

## 🔧 配置文件格式

生成器支持的配置文件格式：

```json
{
  "colors": {
    "light": "rgba(255, 255, 255, 0.8)",
    "dark": "rgb(32, 36, 37)",
    "specificPrefix": "rgba(132, 133, 141"
  },
  "selectors": {
    "lightTheme": ".hope-ui-light",
    "darkTheme": ".hope-ui-dark",
    "ignored": [".hope-tooltip", "button", "svg"],
    "rootElement": "#root"
  },
  "paths": {
    "excluded": ["/@manage", "/@login"]
  },
  "observer": {
    "childList": true,
    "subtree": true,
    "throttleDelay": 16
  },
  "debug": false
}
```

## 🚀 部署到OpenList

1. 生成美化文件后，登录OpenList管理后台
2. 进入 **设置** → **全局** 页面
3. 将 **head.html** 内容复制到 "自定义头部" 中
4. 将 **body.html** 内容复制到 "自定义内容" 中
5. 保存设置并刷新页面查看效果

## 🐛 故障排除

### 常见问题

1. **美化效果不生效**
   - 检查OpenList版本是否支持自定义HTML
   - 在浏览器控制台查看是否有错误信息
   - 尝试 `window.beautifier.restart()` 重启美化器

2. **性能问题**
   - 调整节流延迟到更高的值（如100ms）
   - 关闭调试模式
   - 减少忽略选择器的数量

3. **配置丢失**
   - 配置自动保存到浏览器本地存储
   - 可导出配置文件进行备份

### 调试命令

在浏览器控制台中可用的调试命令：

```javascript
// 查看美化器状态
window.beautifier.getState()

// 查看统计信息
window.beautifier.getStats()

// 重启美化器
window.beautifier.restart()

// 查看当前配置
window.beautifier.getConfig()
```

## 📄 开源协议

本项目基于 MIT 协议开源，详见 [LICENSE](./LICENSE) 文件。

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📞 支持

如果您在使用过程中遇到问题，可以通过以下方式获取帮助：

- 提交 [GitHub Issue](../../issues)
- 查看[使用文档](./docs)
- 查看[常见问题](./docs/FAQ.md)

---

**由 OpenList 社区维护 ❤️**