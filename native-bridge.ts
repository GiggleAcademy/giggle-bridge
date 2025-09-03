// 原生Bridge接口定义
interface NativeBridge {
  callbacks: { [key: string]: { resolve: (value: any) => void; reject: (reason?: any) => void } }
  callbackId: number
  callNative(plugin: string, method: string, params?: any): Promise<any>
  handleCallback(callbackId: string, response: any): void
  receiveNativeCall(method: string, data: any): any
}

// 扩展window类型
declare global {
  interface Window {
    GiggleBridge: NativeBridge
    __nativeCallBack?: { [key: string]: (data: any) => any }
    webkit?: {
      messageHandlers?: {
        giggleBridge?: {
          postMessage: (message: any) => void
        }
        giggleCallback?: {
          addMessageListener: (callback: (message: any) => void) => void
        }
      }
    }
  }
}

/**
 * 初始化原生Bridge
 * 这段代码由客户端提供，用于与原生应用通信
 */
export function initializeNativeBridge(): void {
  if (typeof window === 'undefined') return

  window.GiggleBridge = {
    callbacks: {},
    callbackId: 0,
    
    callNative: function(plugin: string, method: string, params?: any): Promise<any> {
      return new Promise((resolve, reject) => {
        const callbackId = 'cb_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5)
        
        this.callbacks[callbackId] = { resolve, reject }
        
        const message = {
          plugin: plugin,
          method: method,
          params: params || {},
          callbackId: callbackId
        }
        
        // iOS WebKit 调用
        if (window.webkit?.messageHandlers?.giggleBridge) {
          window.webkit.messageHandlers.giggleBridge.postMessage(message)
        } 
        // Android 调用 - 假设Android也有类似的giggleBridge接口
        else if ((window as any).giggleBridge && (window as any).giggleBridge.postMessage) {
          try {
            (window as any).giggleBridge.postMessage(JSON.stringify(message))
          } catch (error) {
            console.error('处理 Android 消息时出错:', error)
            reject(error)
            return
          }
        }
        // 如果没有找到任何接口
        else {
          console.warn('Native bridge not available')
          reject(new Error('Native bridge not available'))
        }
      })
    },
    
    handleCallback: function(callbackId: string, response: any): void {
      const callback = this.callbacks[callbackId]
      if (callback) {
        if (response.error) {
          callback.reject(response.error)
        } else {
          callback.resolve(response.data)
        }
        delete this.callbacks[callbackId]
      }
    },
    
    receiveNativeCall: function(method: string, data: any): any {
      if (window.__nativeCallBack && window.__nativeCallBack[method]) {
        return window.__nativeCallBack[method](data)
      }
      return null
    }
  }
  
  // 设置回调监听器
  
  // iOS WebKit 回调监听
  if (window.webkit?.messageHandlers?.giggleCallback) {
    window.webkit.messageHandlers.giggleCallback.addMessageListener(function(message: any) {
      if (message.callbackId && message.response) {
        window.GiggleBridge.handleCallback(message.callbackId, message.response)
      }
    })
  }
  
  // Android 回调监听 - 设置全局回调处理函数
  (window as any).handleGiggleCallback = function(message: string) {
    try {
      const parsedMessage = JSON.parse(message)
      if (parsedMessage.callbackId && parsedMessage.response) {
        window.GiggleBridge.handleCallback(parsedMessage.callbackId, parsedMessage.response)
      }
    } catch (error) {
      console.error('处理 Android 回调时出错:', error)
    }
  }
}



// 自动初始化
if (typeof window !== 'undefined') {
  initializeNativeBridge()
}
