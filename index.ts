interface BridgeMessage {
  action: string
  data?: unknown
}

interface WebKitMessageHandlers {
  aitutorCallback: {
    postMessage: (message: BridgeMessage) => void
  }
}

interface WindowWithWebKit {
  webkit?: {
    messageHandlers?: WebKitMessageHandlers
  }
  MSStream?: unknown
}

interface WindowWithAndroid {
  aitutorCallback?: {
    postMessage: (message: BridgeMessage | string) => void
  }
}

class Bridge {
  

  public sendMessage(message: BridgeMessage): void {
    const win = window as WindowWithWebKit
    console.log('🚀 bridge-sendMessage:', message)
    if (win.webkit) {
      if (win.webkit?.messageHandlers?.aitutorCallback) {
        win.webkit.messageHandlers.aitutorCallback.postMessage(message)
      }
    } else {
      const win = window as WindowWithAndroid
      if (win.aitutorCallback) {
        try {
          win.aitutorCallback.postMessage(JSON.stringify(message))
        } catch (error) {
          console.error('处理 Android 消息时出错:', error)
        }
      }
    }
  }

  public playGame(): void {
    this.sendMessage({ action: 'playGame' })
  }
}

// 导出带有版本检查的 bridge 实例
const bridge = new Bridge()
export { bridge }