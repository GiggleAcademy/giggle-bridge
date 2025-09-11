import './native-bridge'
import { RouterPlugin, RouterPluginImpl } from './router-plugin'
import {
  PreferencePlugin,
  PreferencePluginImpl,
  PlatformInfo,
} from './preference-plugin'

const IS_TEST = process.env.NODE_ENV === 'test'
const IS_DEV = process.env.NODE_ENV === 'development'

/**
 * 检测是否在容器化环境中（原生应用的webview）
 */
export const isInContainerization: boolean =
  // iOS WebKit 环境检测
  !!(window as any).webkit?.messageHandlers?.giggleBridge ||
  // Android 环境检测
  !!(window as any).giggleBridge

// Global window interface - Bridge实例（业务层）
declare global {
  interface Window {
    GiggleBridgeAPI?: Bridge // 重命名避免类型冲突
  }
}

class Bridge {
  private _router: RouterPlugin
  private _preference: PreferencePlugin

  // Public platform info with default values
  public platformInfo: PlatformInfo = {
    platform: 'web',
    userId: IS_TEST ? '624100027826245' : IS_DEV ? '669347175456837' : '',
    kidId: IS_TEST ? '658400463949893' : IS_DEV ? '695694780444741' : '',
    kidName: 'me',
    appBaseUrl: IS_DEV ? '/api' : '',
    token: IS_TEST
      ? 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0aW1lU3RhbXAiOjE3NDc4OTcyNDk0ODEsInVzZXJJZCI6NjI0MTAwMDI3ODI2MjQ1LCJlbWFpbCI6IjE1OTc4ODc2MjBAcXEuY29tIiwidXNlcm5hbWUiOiJkYXJyZW4ifQ.FDgTG2t5pvrhdbmqS3MItA2-eyk3YUYB0DDYdrI4X4U'
      : IS_DEV
        ? 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0aW1lU3RhbXAiOjE3NTM3NTY0MzMwNTUsInVzZXJJZCI6NjY5MzQ3MTc1NDU2ODM3LCJlbWFpbCI6Imp1bi5sQGdpZ2dsZWFjYWRlbXkubWUiLCJ1c2VybmFtZSI6ImwganVuIn0.Fyal_HiQu5HB3T2py3svD_4i_NTd8uY6wZ0Npg5tnRc'
        : '',
    storyQuiz: '',
    language: 'en',
    pointsDescDoneBtn: '0,0,0,0',
    appVersion: IS_DEV ? '999.0.0' : '1.16.0',
    greyScaleMode: '',
  }

  // Platform initialization status
  public isPlatformInited: boolean = false

  constructor() {
    // 初始化插件，传入callNative方法
    this._router = new RouterPluginImpl(this.callNative.bind(this))
    this._preference = new PreferencePluginImpl(this.callNative.bind(this))
  }

  /**
   * 统一的原生调用接口
   * @param plugin 插件名称 ('Router' | 'Preference')
   * @param method 方法名称
   * @param params 参数
   */
  public callNative(
    plugin: string,
    method: string,
    params?: any
  ): Promise<any> {
    console.log(`🚀 GiggleBridge.callNative: ${plugin}.${method}`, params)

    // 检查原生Bridge是否可用
    if (typeof window !== 'undefined' && window.GiggleBridge?.callNative) {
      return window.GiggleBridge.callNative(plugin, method, params)
    }

    // Fallback: 如果没有原生桥接，返回默认值或模拟数据
    console.warn('Native bridge not available, using fallback')
    return Promise.resolve(null)
  }

  // ========================================
  // 🚀 Navigation APIs (业务导航接口)
  // ========================================

  public async inviteFriends(): Promise<void> {
    await this._router.route('giggleacademy://unity/inviteFriends')
  }

  public async playGame(): Promise<void> {
    await this._router.route('giggleacademy://unity/playGame')
  }

  public async finishChallenge(): Promise<void> {
    await this._router.route('giggleacademy://unity/finishChallenge')
  }

  public async flashcardLearning(): Promise<void> {
    await this._router.route('giggleacademy://unity/flashcardLearning')
  }

  // ========================================
  // 🎛️ UI Control APIs (界面控制接口)
  // ========================================

  public async dismissLoading(): Promise<void> {
    await this._router.dismissLoading()
  }

  public async dismiss(): Promise<void> {
    await this._router.dismiss()
  }

  // ========================================
  // 📱 Platform Info APIs (平台信息接口)
  // ========================================

  // Private method to fetch platform info from native
  private async _fetchPlatformInfo(): Promise<PlatformInfo> {
    // 获取PlatformInfo的所有key作为参数 - 业务逻辑在Bridge层处理

    const info = await this._preference.readValues()
    // Update bridge's platform info - 只更新从原生获取的有效数据
    this.platformInfo = { ...this.platformInfo, ...info }
    this.isPlatformInited = true
    return this.platformInfo
  }

  public async requestPlatformInfoAsync(): Promise<PlatformInfo> {
    // 如果已经初始化过，直接返回已有数据
    if (this.isPlatformInited) {
      console.log(
        '🚀 Platform info already initialized, returning cached data',
        this.platformInfo
      )
      return this.platformInfo
    }

    try {
      await this._fetchPlatformInfo()
      console.log(
        '✅ Platform info initialized successfully',
        this.platformInfo
      )
      return this.platformInfo
    } catch (error) {
      console.error('❌ Failed to request platform info:', error)
      throw error
    }
  }

  public requestPlatformInfo(
    success: (info: PlatformInfo) => void,
    fail?: (error: any) => void
  ): void {
    this.requestPlatformInfoAsync().then(success).catch(fail)
  }

  // 强制重新初始化平台信息（忽略缓存）
  public async forceRefreshPlatformInfo(): Promise<PlatformInfo> {
    console.log('🔄 Force refreshing platform info...')

    try {
      await this._fetchPlatformInfo()
      console.log('✅ Platform info force refreshed successfully')
      return this.platformInfo
    } catch (error) {
      console.error('❌ Failed to force refresh platform info:', error)
      throw error
    }
  }

  public get pointsDescDoneBtn(): string {
    return this.platformInfo.pointsDescDoneBtn
  }

  // ========================================
  // 🔧 Advanced Plugin Access (高级插件访问)
  // ========================================
  // 注意：直接使用插件可能需要了解底层实现细节
  // 推荐使用上面的业务API，除非你需要自定义行为

  /**
   * 获取Router插件实例，用于高级路由控制
   * @example
   * // 自定义路由
   * bridge.router.route('custom://scheme/action')
   *
   * // 直接调用原生方法
   * bridge.router.dismiss()
   */
  public get router(): RouterPlugin {
    return this._router
  }

  /**
   * 获取Preference插件实例，用于高级偏好设置操作
   * @example
   * // 直接读取原生数据
   * const data = await bridge.preference.readValues()
   */
  public get preference(): PreferencePlugin {
    return this._preference
  }
}

// 创建Bridge实例
const bridge = new Bridge()

// Export interfaces and classes
export { RouterPlugin } from './router-plugin'
export { PreferencePlugin, PlatformInfo } from './preference-plugin'
export { Bridge }

// Export the bridge instance as default
export default bridge
