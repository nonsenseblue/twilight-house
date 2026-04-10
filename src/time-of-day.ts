// ===== 時間帯システム =====

export type TimeOfDay = 'morning' | 'noon' | 'evening' | 'night'

// 手動オーバーライド（null=PC時計に従う）
// HMRで消えないようwindowに保存
const w = window as any
if (w.__todOverride === undefined) w.__todOverride = null
function getOverrideVal(): TimeOfDay | null { return w.__todOverride }
function setOverrideVal(v: TimeOfDay | null) { w.__todOverride = v }

export function getTimeOfDay(): TimeOfDay {
  const ov = getOverrideVal()
  if (ov) return ov
  const h = new Date().getHours()
  if (h >= 6 && h < 11) return 'morning'
  if (h >= 11 && h < 16) return 'noon'
  if (h >= 16 && h < 19) return 'evening'
  return 'night'
}

const order: TimeOfDay[] = ['morning', 'noon', 'evening', 'night']

// Tキーで切り替え用。null→morning→noon→evening→night→null(自動)
export function cycleTimeOfDay(): string {
  const current = getOverrideVal()
  if (current === null) {
    setOverrideVal(order[0])
    return order[0]
  }
  const idx = order.indexOf(current)
  if (idx >= order.length - 1) {
    setOverrideVal(null)
    return 'auto (' + getTimeOfDay() + ')'
  }
  setOverrideVal(order[idx + 1])
  return order[idx + 1]
}

// 部屋全体にかけるオーバーレイ色
export function getOverlay(tod: TimeOfDay): { color: string; alpha: number } {
  switch (tod) {
    case 'morning': return { color: '#aaccff', alpha: 0.04 }
    case 'noon':    return { color: '#000000', alpha: 0 }
    case 'evening': return { color: '#ff8833', alpha: 0.08 }
    case 'night':   return { color: '#0a0a2a', alpha: 0.15 }
  }
}

// 窓の色（和室の窓タイル描画に使う）
export function getWindowColor(tod: TimeOfDay): string {
  switch (tod) {
    case 'morning': return '#aaddff'
    case 'noon':    return '#88ccff'
    case 'evening': return '#ee8844'
    case 'night':   return '#1a1a3a'
  }
}

// 窓の光の色（部屋に差し込む光）
export function getWindowGlow(tod: TimeOfDay): { color: string; alpha: number } {
  switch (tod) {
    case 'morning': return { color: '#ccddff', alpha: 0.06 }
    case 'noon':    return { color: '#ffffcc', alpha: 0.06 }
    case 'evening': return { color: '#ffaa44', alpha: 0.1 }
    case 'night':   return { color: '#4444aa', alpha: 0.04 }
  }
}
