// Lightweight client-side realtime broadcaster using BroadcastChannel with localStorage fallback

type RealtimeMessage = {
  type: string
  payload?: any
  timestamp?: string
}

const CHANNEL_NAME = 'exam_registration_realtime'

class RealtimeService {
  private bc: BroadcastChannel | null = null
  private handlers: Array<(msg: RealtimeMessage) => void> = []

  constructor() {
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        this.bc = new BroadcastChannel(CHANNEL_NAME)
        this.bc.onmessage = (ev) => this.handleMessage(ev.data)
      } catch (e) {
        this.bc = null
      }
    }

    // storage event fallback for other tabs
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('storage', (ev: StorageEvent) => {
        if (!ev.key) return
        try {
          if (ev.key === '__realtime_message__' && ev.newValue) {
            const m = JSON.parse(ev.newValue) as RealtimeMessage
            this.handleMessage(m)
          }
        } catch (e) {
          // ignore
        }
      })
    }
  }

  private handleMessage(msg: RealtimeMessage) {
    try {
      this.handlers.forEach((h) => h(msg))
    } catch (e) {
      // ignore handler errors
    }
  }

  publish(type: string, payload?: any) {
    const msg: RealtimeMessage = { type, payload, timestamp: new Date().toISOString() }
    try {
      if (this.bc) {
        this.bc.postMessage(msg)
      } else if (typeof localStorage !== 'undefined') {
        // write-then-delete to trigger storage event listeners
        localStorage.setItem('__realtime_message__', JSON.stringify(msg))
        // remove quickly
        setTimeout(() => {
          try { localStorage.removeItem('__realtime_message__') } catch (e) {}
        }, 50)
      }
      // always call local handlers in same tab
      this.handleMessage(msg)
    } catch (e) {
      // ignore
    }
  }

  subscribe(fn: (msg: RealtimeMessage) => void) {
    this.handlers.push(fn)
    return () => {
      const i = this.handlers.indexOf(fn)
      if (i !== -1) this.handlers.splice(i, 1)
    }
  }
}

export const realtimeService = new RealtimeService()
export type { RealtimeMessage }
