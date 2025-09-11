# @giggle-academy/bridge

🌉 一个现代化的 JavaScript Bridge 库，用于 Web 与原生移动应用（iOS/Android）之间的通信。

## 📦 安装

### 从 GitHub Packages 安装

GitHub Packages 支持多种版本指定方式：

```bash
# 使用 pnpm (推荐)

# 最新版本
pnpm add github:GiggleAcademy/giggle-bridge

# 指定 semver 版本 (如果发布了包)
pnpm add @giggle-academy/bridge@^1.1.0

# 指定 git 标签
pnpm add github:GiggleAcademy/giggle-bridge#v1.1.0

# 指定 git 提交哈希
pnpm add github:GiggleAcademy/giggle-bridge#a0c5f97

# 指定分支
pnpm add github:GiggleAcademy/giggle-bridge#main
pnpm add github:GiggleAcademy/giggle-bridge#develop

# 使用 npm
npm install github:GiggleAcademy/giggle-bridge

# 使用 yarn
yarn add github:GiggleAcademy/giggle-bridge
```

## 🚀 快速开始

### 基础使用

```typescript
// 导入 Bridge
import bridge from '@giggle-academy/bridge'
```

### 平台信息获取

```typescript
// Promise 方式 (推荐)
try {
  const platformInfo = await bridge.requestPlatformInfoAsync()
  console.log('用户ID:', platformInfo.userId)
  console.log('应用版本:', platformInfo.appVersion)
} catch (error) {
  console.error('获取平台信息失败:', error)
}

// 回调方式
bridge.requestPlatformInfo(
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
// 🚀 推荐：业务友好的API
await bridge.playGame()
await bridge.inviteFriends()
await bridge.finishChallenge()
await bridge.flashcardLearning()

// 🎛️ 界面控制
await bridge.dismiss()
await bridge.dismissLoading()
```

### 高级插件访问

```typescript
// 🔧 高级用户：直接插件访问（当需要自定义行为时）
await bridge.router.route('giggleacademy://custom/action')
const platformData = await bridge.preference.readValues()

// 💡 通用原生调用
await bridge.callNative('Router', 'customMethod', { param: 'value' })
```

## 📚 API 文档

Bridge API 按功能分为四个主要类别，提供清晰的业务接口和高级插件访问模式：

### 🚀 Navigation APIs (业务导航接口)

推荐的业务友好接口，封装了常用的导航功能：

| 方法                  | 描述     | 返回值          |
| --------------------- | -------- | --------------- |
| `inviteFriends()`     | 邀请朋友 | `Promise<void>` |
| `playGame()`          | 启动游戏 | `Promise<void>` |
| `finishChallenge()`   | 完成挑战 | `Promise<void>` |
| `flashcardLearning()` | 闪卡学习 | `Promise<void>` |

### 🎛️ UI Control APIs (界面控制接口)

用于控制应用界面状态：

| 方法               | 描述         | 返回值          |
| ------------------ | ------------ | --------------- |
| `dismissLoading()` | 隐藏加载状态 | `Promise<void>` |
| `dismiss()`        | 关闭页面     | `Promise<void>` |

### 📱 Platform Info APIs (平台信息接口)

获取和管理平台相关信息：

| 方法                                  | 描述                    | 返回值                  |
| ------------------------------------- | ----------------------- | ----------------------- |
| `requestPlatformInfoAsync()`          | 获取平台信息（Promise） | `Promise<PlatformInfo>` |
| `requestPlatformInfo(success, fail?)` | 获取平台信息（回调）    | `void`                  |
| `forceRefreshPlatformInfo()`          | 强制刷新平台信息        | `Promise<PlatformInfo>` |
| `platformInfo`                        | 当前平台信息（只读）    | `PlatformInfo`          |
| `isPlatformInited`                    | 是否已初始化            | `boolean`               |
| `pointsDescDoneBtn`                   | 积分按钮状态            | `string`                |

### 🔧 Advanced Plugin Access (高级插件访问)

> ⚠️ **注意**: 直接使用插件需要了解底层实现细节。推荐使用上面的业务API，除非你需要自定义行为。

#### Router Plugin 访问

```typescript
// 自定义路由
await bridge.router.route('custom://scheme/action')

// 直接调用原生方法
await bridge.router.dismiss()
await bridge.router.dismissLoading()
```

#### Preference Plugin 访问

```typescript
// 直接读取原生数据
const data = await bridge.preference.readValues()
```

#### 通用原生调用

| 方法                                  | 描述             | 参数                                           | 返回值         |
| ------------------------------------- | ---------------- | ---------------------------------------------- | -------------- |
| `callNative(plugin, method, params?)` | 直接调用原生方法 | `plugin: string, method: string, params?: any` | `Promise<any>` |

### PlatformInfo 接口

```typescript
interface PlatformInfo {
  platform: string // 平台类型，默认 'web'
  version?: string // 版本号
  userId: string // 用户ID
  kidId: string // 儿童ID
  kidName: string // 儿童姓名
  appBaseUrl: string // API基础URL
  token: string // JWT Token
  storyQuiz: string // 故事测验状态
  language: string // 语言设置
  pointsDescDoneBtn: string // 积分按钮状态
  appVersion: string // 应用版本
  greyScaleMode: string // 灰度模式
}
```

## 🔄 版本管理

### 版本指定方式

| 方式           | 语法                                         | 说明             | 推荐场景     |
| -------------- | -------------------------------------------- | ---------------- | ------------ |
| **最新版本**   | `github:GiggleAcademy/giggle-bridge`         | 始终获取最新提交 | 开发环境测试 |
| **语义化版本** | `@giggle-academy/bridge@^1.1.0`              | 使用发布的版本号 | 生产环境     |
| **Git 标签**   | `github:GiggleAcademy/giggle-bridge#v1.1.0`  | 指定具体版本标签 | 稳定版本锁定 |
| **提交哈希**   | `github:GiggleAcademy/giggle-bridge#a0c5f97` | 锁定特定提交     | 精确版本控制 |
| **分支名**     | `github:GiggleAcademy/giggle-bridge#develop` | 跟踪开发分支     | 测试新特性   |

### 检查和更新

```bash
# 检查当前版本
pnpm list @giggle-academy/bridge

# 检查可用更新 (如果使用 semver)
pnpm outdated @giggle-academy/bridge

# 更新到最新版本
pnpm update @giggle-academy/bridge

# 重新安装最新提交 (git 方式)
pnpm remove @giggle-academy/bridge
pnpm add github:GiggleAcademy/giggle-bridge
```

### 推荐实践

✅ **生产环境**: 使用 Git 标签或语义化版本

```bash
pnpm add github:GiggleAcademy/giggle-bridge#v1.1.0
```

✅ **测试环境**: 使用特定分支

```bash
pnpm add github:GiggleAcademy/giggle-bridge#develop
```

✅ **开发环境**: 使用最新提交

```bash
pnpm add github:GiggleAcademy/giggle-bridge
```

## 💡 使用建议和最佳实践

### API 选择指南

#### 🎯 业务开发者（推荐）

使用封装好的业务API，简洁易懂：

```typescript
// ✅ 推荐：语义清晰，易于维护
await bridge.playGame()
await bridge.inviteFriends()
await bridge.dismissLoading()
```

#### 🔧 高级开发者

当需要自定义行为或新功能时，使用插件访问：

```typescript
// ✅ 高级：灵活但需要了解底层细节
await bridge.router.route('custom://scheme/newFeature')
const customData = await bridge.preference.readValues()
```

### 架构优势

- **🎯 业务友好**: 上层API直接表达业务意图
- **🔧 灵活扩展**: 底层插件支持自定义需求
- **🛡️ 类型安全**: 完整的TypeScript类型定义
- **📦 模块化**: 清晰的插件分离架构
- **🔄 向后兼容**: 支持回调和Promise两种模式

### 迁移指南

如果你之前使用的是直接插件访问，现在推荐迁移到业务API：

```typescript
// ❌ 旧方式：直接使用插件
await bridge.router.route('giggleacademy://unity/playGame')

// ✅ 新方式：业务API
await bridge.playGame()
```

但高级插件访问依然可用，适合需要自定义行为的场景。
