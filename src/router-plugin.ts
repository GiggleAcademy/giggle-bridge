// Native call function type
type CallNativeFn = (
  plugin: string,
  method: string,
  params?: any
) => Promise<any>

// Router plugin interface
export interface RouterPlugin {
  route(url: string): Promise<void>
  dismiss(): Promise<void>
  dismissLoading(): Promise<void>
}

// Router plugin implementation
export class RouterPluginImpl implements RouterPlugin {
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
