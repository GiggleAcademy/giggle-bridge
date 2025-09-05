// Platform info interface
export interface PlatformInfo {
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
type CallNativeFn = (
  plugin: string,
  method: string,
  params?: any
) => Promise<any>

// Preference plugin interface
export interface PreferencePlugin {
  readValues(keys?: string[]): Promise<Partial<PlatformInfo>>
}

// Preference plugin implementation
export class PreferencePluginImpl implements PreferencePlugin {
  private callNative: CallNativeFn

  constructor(callNative: CallNativeFn) {
    this.callNative = callNative
  }

  public async readValues(keys?: string[]): Promise<Partial<PlatformInfo>> {
    try {
      const data = await this.callNative('Preference', 'readValues', { keys })

      // 处理原生返回的可能是JSON字符串的情况
      if (typeof data === 'string') {
        try {
          return JSON.parse(data) || {}
        } catch (parseError) {
          console.error('Failed to parse JSON response:', parseError, data)
          return {}
        }
      }

      return data
    } catch (error) {
      console.error('Failed to read platform values:', error)
      throw error // 让Bridge层处理错误
    }
  }
}
