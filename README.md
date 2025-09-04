# @giggle-academy/bridge

🌉 一个现代化的 JavaScript Bridge 库，用于 Web 与原生移动应用（iOS/Android）之间的通信。

## 📦 安装

### 从 GitHub Packages 安装

安装包：

```bash
# 使用 pnpm (推荐)
pnpm install @giggle-academy/bridge

# 或使用 npm
npm install @giggle-academy/bridge

# 或使用 yarn
yarn add @giggle-academy/bridge
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
```


