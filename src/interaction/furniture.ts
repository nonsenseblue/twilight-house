// ===== 家具との会話判定 =====
import { FURNITURE_LINES, TILE, COLS, ROWS } from '../common/rooms'

export interface FurnitureHit {
  tile: number
  /** 吹き出しの基準点（タイル中央上） */
  anchorX: number
  anchorY: number
  text: string
}

function getTile(room: number[], tx: number, ty: number): number {
  if (tx < 0 || tx >= COLS || ty < 0 || ty >= ROWS) return 1
  return room[ty * COLS + tx]
}

// プレイヤー位置の周囲4マス（+自分のマス）から話しかけられる家具を探す
export function findAdjacentFurniture(room: number[], ptx: number, pty: number): FurnitureHit | null {
  const dirs: { dx: number; dy: number }[] = [
    { dx: 0, dy: 0 },
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 },
  ]
  for (const d of dirs) {
    const tx = ptx + d.dx
    const ty = pty + d.dy
    const t = getTile(room, tx, ty)
    const lines = FURNITURE_LINES[t]
    if (lines && lines.length > 0) {
      const text = lines[Math.floor(Math.random() * lines.length)]
      return {
        tile: t,
        anchorX: tx * TILE + TILE / 2,
        anchorY: ty * TILE,
        text,
      }
    }
  }
  return null
}
