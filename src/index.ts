import './native-bridge'

const IS_TEST = process.env.NODE_ENV === 'test'
const IS_DEV = process.env.NODE_ENV === 'development'

// Platform info interface
interface PlatformInfo {
  platform: string
  version?: string
  userId: string
  kidId: string
  kidName: string
  appBaseUrl: string
  token: string
  storyQuiz: string
  language: string
  pointsDescDoneBtn: string
  appVersion: string
  greyScaleMode: string
}

// Native call function type
type CallNativeFn = (plugin: string, method: string, params?: any) => Promise<any>

// Plugin interfaces
interface RouterPlugin {
  route(url: string): Promise<void>
  dismiss(): Promise<void>
  dismissLoading(): Promise<void>
}

interface PreferencePlugin {
  readValues(keys?: string[]): Promise<PlatformInfo>
}

// Plugin implementations
class RouterPluginImpl implements RouterPlugin {
  private callNative: CallNativeFn

  constructor(callNative: CallNativeFn) {
    this.callNative = callNative
  }

  public async route(url: string): Promise<void> {
    await this.callNative('Router', 'route', { url })
  }

  public async dismiss(): Promise<void> {
    await this.callNative('Router', 'dismiss', {})
  }

  public async dismissLoading(): Promise<void> {
    await this.callNative('Router', 'dismissLoading', {})
  }
}

class PreferencePluginImpl implements PreferencePlugin {
  private callNative: CallNativeFn

  constructor(callNative: CallNativeFn) {
    this.callNative = callNative
  }

  public async readValues(keys?: string[]): Promise<PlatformInfo> {
    try {
      const data = await this.callNative('Preference', 'readValues', { keys })
      return data || {}
    } catch (error) {
      console.error('Failed to read platform values:', error)
      throw error // 让Bridge层处理错误
    }
  }

}

// Global window interface - Bridge实例（业务层）
declare global {
  interface Window {
    GiggleBridgeAPI?: Bridge  // 重命名避免类型冲突
  }
}

class Bridge {
  private router: RouterPlugin
  private preference: PreferencePlugin

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
    greyScaleMode: ''
  }

  // Platform initialization status
  public isPlatformInited: boolean = false

  constructor() {
    // 初始化插件，传入callNative方法
    this.router = new RouterPluginImpl(this.callNative.bind(this))
    this.preference = new PreferencePluginImpl(this.callNative.bind(this))
  }

  /**
   * 统一的原生调用接口
   * @param plugin 插件名称 ('Router' | 'Preference')
   * @param method 方法名称
   * @param params 参数
   */
  public callNative(plugin: string, method: string, params?: any): Promise<any> {
    console.log(`🚀 GiggleBridge.callNative: ${plugin}.${method}`, params)
    
    // 检查原生Bridge是否可用
    if (typeof window !== 'undefined' && window.GiggleBridge?.callNative) {
      return window.GiggleBridge.callNative(plugin, method, params)
    }
    
    // Fallback: 如果没有原生桥接，返回默认值或模拟数据
    console.warn('Native bridge not available, using fallback')
    return Promise.resolve(null)
  }

  // Navigation methods using Router plugin
  public async inviteFriends(): Promise<void> {
    await this.router.route('giggleacademy://unity/inviteFriends')
  }

  public async playGame(): Promise<void> {
    await this.router.route('giggleacademy://unity/playGame')
  }

  public async finishChallenge(): Promise<void> {
    await this.router.route('giggleacademy://unity/finishChallenge')
  }

  public async flashcardLearning(): Promise<void> {
    await this.router.route('giggleacademy://unity/flashcardLearning')
  }

  // Loading control
  public async dismissLoading(): Promise<void> {
    await this.router.dismissLoading()
  }

  // Private method to fetch platform info from native
  private async _fetchPlatformInfo(): Promise<PlatformInfo> {
    // 获取PlatformInfo的所有key作为参数 - 业务逻辑在Bridge层处理
    
    const info = await this.preference.readValues()
    // Update bridge's platform info - 只更新从原生获取的有效数据
    this.platformInfo = { ...this.platformInfo, ...info }
    this.isPlatformInited = true
    return this.platformInfo
  }

  public async requestPlatformInfoAsync(): Promise<PlatformInfo> {
    // 如果已经初始化过，直接返回已有数据
    if (this.isPlatformInited) {
      console.log('🚀 Platform info already initialized, returning cached data')
      return this.platformInfo
    }
    
    try {
      await this._fetchPlatformInfo()
      console.log('✅ Platform info initialized successfully')
      return this.platformInfo
    } catch (error) {
      console.error('❌ Failed to request platform info:', error)
      throw error
    }
  }


  public requestPlatformInfo(success: (info: PlatformInfo) => void, fail?: (error: any) => void): void {
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

  // Navigation control
  public async dismiss(): Promise<void> {
    await this.router.dismiss()
  }
}

// 创建Bridge实例
const bridge = new Bridge()

// Export interfaces and classes
export { PlatformInfo, Bridge, RouterPlugin, PreferencePlugin }

// Export the bridge instance as default
export default bridge
