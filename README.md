# @giggle-academy/bridge

🌉 一个现代化的 JavaScript Bridge 库，用于 Web 与原生移动应用（iOS/Android）之间的通信。

## 📦 安装

### 从 GitHub Packages 安装

首先，配置 npm/pnpm 以使用 GitHub Packages：

```bash
# 创建 .npmrc 文件
echo "@giggle-academy:registry=https://npm.pkg.github.com" >> .npmrc
```

然后安装包：

```bash
# 使用 pnpm (推荐)
pnpm install @giggle-academy/bridge

# 或使用 npm
npm install @giggle-academy/bridge

# 或使用 yarn
yarn add @giggle-academy/bridge
```

### 身份验证

如果仓库是私有的，需要 GitHub Personal Access Token：

1. 创建 GitHub Personal Access Token (需要 `read:packages` 权限)
2. 配置身份验证：

```bash
# 方法1: 通过 .npmrc 配置
echo "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN" >> .npmrc

# 方法2: 通过环境变量
export NPM_TOKEN=YOUR_GITHUB_TOKEN
```

## 🚀 快速开始

### 基础使用

```typescript
// 导入 Bridge
import bridge from '@giggle-academy/bridge'

// 或者使用全局访问
console.log(window.GiggleBridge)
```

### 平台信息获取

```typescript
// Promise 方式 (推荐)
try {
  const platformInfo = await window.GiggleBridge.requestPlatformInfoAsync()
  console.log('用户ID:', platformInfo.userId)
  console.log('应用版本:', platformInfo.appVersion)
} catch (error) {
  console.error('获取平台信息失败:', error)
}

// 回调方式
window.GiggleBridge.requestPlatformInfo(
  (info) => {
    console.log('平台信息:', info)
  },
  (error) => {
    console.error('获取失败:', error)
  }
)
```

### 路由导航

```typescript
// 游戏功能
await window.GiggleBridge.playGame()
await window.GiggleBridge.inviteFriends()
await window.GiggleBridge.finishChallenge()
await window.GiggleBridge.flashcardLearning()

// 页面控制
await window.GiggleBridge.dismiss({ reason: 'user_cancel' })
await window.GiggleBridge.dismissLoading()
```

## 📚 API 文档

### Bridge 主要方法

#### 平台信息

| 方法 | 描述 | 返回值 |
|------|------|--------|
| `requestPlatformInfoAsync()` | 获取平台信息（Promise） | `Promise<PlatformInfo>` |
| `requestPlatformInfo(success, fail?)` | 获取平台信息（回调） | `void` |
| `forceRefreshPlatformInfo()` | 强制刷新平台信息 | `Promise<PlatformInfo>` |
| `platformInfo` | 当前平台信息（只读） | `PlatformInfo` |
| `isPlatformInited` | 是否已初始化 | `boolean` |
| `pointsDescDoneBtn` | 积分按钮状态 | `string` |

#### 路由控制

| 方法 | 描述 | 参数 | 返回值 |
|------|------|------|--------|
| `playGame()` | 启动游戏 | - | `Promise<void>` |
| `inviteFriends()` | 邀请朋友 | - | `Promise<void>` |
| `finishChallenge()` | 完成挑战 | - | `Promise<void>` |
| `flashcardLearning()` | 闪卡学习 | - | `Promise<void>` |
| `dismiss(data?)` | 关闭页面 | `data?: any` | `Promise<void>` |
| `dismissLoading()` | 隐藏加载状态 | - | `Promise<void>` |

#### 通用调用

| 方法 | 描述 | 参数 | 返回值 |
|------|------|------|--------|
| `callNative(plugin, method, params?)` | 直接调用原生方法 | `plugin: string, method: string, params?: any` | `Promise<any>` |

### PlatformInfo 接口

```typescript
interface PlatformInfo {
  platform: string           // 平台类型，默认 'web'
  version?: string           // 版本号
  userId: string             // 用户ID
  kidId: string             // 儿童ID
  kidName: string           // 儿童姓名
  appBaseUrl: string        // API基础URL
  token: string             // JWT Token
  storyQuiz: string         // 故事测验状态
  language: string          // 语言设置
  pointsDescDoneBtn: string // 积分按钮状态
  appVersion: string        // 应用版本
  greyScaleMode: string     // 灰度模式
}
```

## 💡 使用示例

### 1. 应用初始化

```typescript
class App {
  async initialize() {
    try {
      // 获取平台信息
      const info = await window.GiggleBridge.requestPlatformInfoAsync()
      
      // 设置用户上下文
      this.setUserContext({
        userId: info.userId,
        token: info.token,
        language: info.language
      })
      
      console.log('✅ 应用初始化完成')
    } catch (error) {
      console.warn('⚠️ 使用默认配置')
    }
  }
}
```

### 2. 错误处理

```typescript
async function handleGameLaunch() {
  try {
    await window.GiggleBridge.playGame()
    console.log('🎮 游戏启动成功')
  } catch (error) {
    console.error('❌ 游戏启动失败:', error)
    // 显示错误提示给用户
    showError('游戏暂时无法启动，请稍后重试')
  } finally {
    // 确保隐藏加载状态
    await window.GiggleBridge.dismissLoading()
  }
}
```

### 3. 性能优化

```typescript
class PlatformService {
  private static instance: PlatformService
  private infoCache?: PlatformInfo
  
  async getPlatformInfo(): Promise<PlatformInfo> {
    // 利用内置缓存机制
    if (!this.infoCache) {
      this.infoCache = await window.GiggleBridge.requestPlatformInfoAsync()
    }
    return this.infoCache
  }
  
  async refreshInfo(): Promise<PlatformInfo> {
    // 强制刷新缓存
    this.infoCache = await window.GiggleBridge.forceRefreshPlatformInfo()
    return this.infoCache
  }
}
```

## 🔄 更新包

### 检查更新

```bash
# 检查可用更新
pnpm outdated @giggle-academy/bridge
```

### 更新到最新版本

```bash
# 更新到最新版本
pnpm update @giggle-academy/bridge

# 或指定版本
pnpm update @giggle-academy/bridge@1.2.0
```

### 版本锁定

```json
// package.json
{
  "dependencies": {
    "@giggle-academy/bridge": "^1.0.0"  // 自动更新小版本
    // "@giggle-academy/bridge": "1.0.0"   // 锁定确切版本
  }
}
```

## 🛠️ 环境配置

Bridge 会根据不同环境自动配置默认值：

### 测试环境 (`IS_TEST = true`)
- userId: `624100027826245`
- kidId: `658400463949893`
- token: JWT测试token
- appVersion: `1.16.0`

### 开发环境 (`IS_DEV = true`)
- userId: `669347175456837`
- kidId: `695694780444741`
- token: JWT开发token
- appVersion: `999.0.0`
- appBaseUrl: `/api`

### 生产环境 (默认)
- 使用空值，由原生应用提供实际数据

## 🏗️ 架构设计

```
Bridge Layer (业务逻辑)
    ├── RouterPlugin (路由控制)
    │   ├── route() 
    │   ├── dismiss()
    │   └── dismissLoading()
    └── PreferencePlugin (偏好设置)
        └── readValues()

Native Layer (原生调用)
    ├── iOS WebKit
    └── Android WebView
```

## 🐛 故障排除

### 常见问题

1. **安装失败**
   ```bash
   # 清除缓存重试
   pnpm store prune
   pnpm install @giggle-academy/bridge
   ```

2. **原生调用无响应**
   ```typescript
   // 检查原生接口是否可用
   console.log('WebKit:', typeof window.webkit)
   console.log('Android:', typeof window.aitutorCallback)
   ```

3. **平台信息为空**
   ```typescript
   // 检查初始化状态
   console.log('Is inited:', window.GiggleBridge.isPlatformInited)
   
   // 强制刷新
   await window.GiggleBridge.forceRefreshPlatformInfo()
   ```

## 📝 变更日志

### v1.0.0
- ✅ 基础 Bridge 功能
- ✅ Promise 化 API
- ✅ 插件系统架构
- ✅ 平台信息缓存
- ✅ TypeScript 支持

## 📄 许可证

ISC License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

📧 如有问题，请联系开发团队
