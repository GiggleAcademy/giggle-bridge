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
  dismiss(data?: any): Promise<void>
}

interface PreferencePlugin {
  readValues(keys: string[]): Promise<PlatformInfo>
  getPointsDescDoneBtn(): string
  updatePlatformInfo(newInfo: Partial<PlatformInfo>): void
  getPlatformInfo(): PlatformInfo
}

// Plugin implementations
class RouterPluginImpl implements RouterPlugin {
  private callNative: CallNativeFn

  constructor(callNative: CallNativeFn) {
    this.callNative = callNative
  }

  public async route(url: string): Promise<void> {
    await this.callNative('Router', 'route', url)
  }

  public async dismiss(data?: any): Promise<void> {
    await this.callNative('Router', 'dismiss', data)
  }
}

class PreferencePluginImpl implements PreferencePlugin {
  private callNative: CallNativeFn
  private platformInfo: PlatformInfo

  constructor(callNative: CallNativeFn, defaultPlatformInfo: PlatformInfo) {
    this.callNative = callNative
    this.platformInfo = { ...defaultPlatformInfo }
  }

  public async readValues(keys: string[]): Promise<PlatformInfo> {
    try {
      const data = await this.callNative('Preference', 'readValues', keys)
      if (data) {
        this.platformInfo = { ...this.platformInfo, ...data }
      }
      return this.platformInfo
    } catch (error) {
      console.error('Failed to read platform values:', error)
      return this.platformInfo // 返回当前值作为fallback
    }
  }

  public getPointsDescDoneBtn(): string {
    return this.platformInfo.pointsDescDoneBtn
  }

  public updatePlatformInfo(newInfo: Partial<PlatformInfo>): void {
    this.platformInfo = { ...this.platformInfo, ...newInfo }
  }

  public getPlatformInfo(): PlatformInfo {
    return { ...this.platformInfo }
  }
}

// Global window interface
declare global {
  interface Window {
    GiggleBridge: Bridge
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
    // 初始化插件，传入callNative方法和默认平台信息
    this.router = new RouterPluginImpl(this.callNative.bind(this))
    this.preference = new PreferencePluginImpl(this.callNative.bind(this), this.platformInfo)
  }

  /**
   * 统一的原生调用接口
   * @param plugin 插件名称 ('Router' | 'Preference')
   * @param method 方法名称
   * @param params 参数
   */
  public callNative(plugin: string, method: string, params?: any): Promise<any> {
    console.log(`🚀 GiggleBridge.callNative: ${plugin}.${method}`, params)
    
    return new Promise((resolve, reject) => {
      try {
        // 这里是调用原生代码的入口点
        // 具体实现由原生端提供
        if (typeof (window as any).webkit !== 'undefined') {
          // iOS WebKit 调用
          const message = {
            plugin,
            method,
            params
          }
          const result = ((window as any).webkit?.messageHandlers?.aitutorCallback as any)?.postMessage?.(message)
          // 假设原生返回Promise或立即resolve
          resolve(result)
        } else if (typeof (window as any).aitutorCallback !== 'undefined') {
          // Android 调用
          const message = JSON.stringify({
            plugin,
            method,
            params
          })
          const result = ((window as any).aitutorCallback as any)?.postMessage?.(message)
          // 假设原生返回Promise或立即resolve
          resolve(result)
        } else {
          // 没有找到原生接口，返回默认值
          resolve(null)
        }
      } catch (error) {
        reject(error)
      }
    })
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

  // Private method to fetch platform info from native
  private async _fetchPlatformInfo(): Promise<PlatformInfo> {
    // 获取PlatformInfo的所有key作为参数 - 业务逻辑在Bridge层处理
    const platformInfoKeys = Object.keys(this.platformInfo)
    
    const info = await this.preference.readValues(platformInfoKeys)
    // Update bridge's platform info
    this.platformInfo = { ...this.platformInfo, ...info }
    this.isPlatformInited = true
    return this.platformInfo
  }

  // Platform info methods using Preference plugin
  public async requestPlatformInfo(): Promise<PlatformInfo> {
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

  // Navigation control
  public async dismiss(data?: any): Promise<void> {
    await this.router.dismiss(data)
  }
}

// 创建全局Bridge实例
const bridge = new Bridge()

// 设置全局访问
if (typeof window !== 'undefined') {
  window.GiggleBridge = bridge
}

// Export interfaces and classes
export { PlatformInfo, Bridge, RouterPlugin, PreferencePlugin }

// Export the bridge instance as default
export default bridge