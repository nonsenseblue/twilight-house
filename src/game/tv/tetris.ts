// CH5: テトリス
import type { ChannelContext } from './types'

const COLS = 10
const ROWS = 20
const CELL = 21

const PIECES: number[][][][] = [
  // I
  [[[1,1,1,1]], [[1],[1],[1],[1]]],
  // O
  [[[1,1],[1,1]]],
  // T
  [[[0,1,0],[1,1,1]], [[1,0],[1,1],[1,0]], [[1,1,1],[0,1,0]], [[0,1],[1,1],[0,1]]],
  // S
  [[[0,1,1],[1,1,0]], [[1,0],[1,1],[0,1]]],
  // Z
  [[[1,1,0],[0,1,1]], [[0,1],[1,1],[1,0]]],
  // L
  [[[1,0,0],[1,1,1]], [[1,1],[1,0],[1,0]], [[1,1,1],[0,0,1]], [[0,1],[0,1],[1,1]]],
  // J
  [[[0,0,1],[1,1,1]], [[1,0],[1,0],[1,1]], [[1,1,1],[1,0,0]], [[1,1],[0,1],[0,1]]],
]
// ゲームボーイ風 4階調（暗→明）
const GB_DARKEST = '#0f380f'
const GB_DARK    = '#306230'
const GB_LIGHT   = '#8bac0f'
const GB_LIGHTEST = '#9bbc0f'

export type TetrisAction =
  | 'left-down' | 'left-up'
  | 'right-down' | 'right-up'
  | 'down-down' | 'down-up'
  | 'rotate' | 'space' | 'drop'

export class TetrisChannel {
  private state = {
    grid: [] as number[][],
    cur: { type: 0, rot: 0, x: 0, y: 0 },
    next: 0,
    started: false,
    gameOver: false,
    score: 0,
    lines: 0,
    fallTimer: 0,
    fallSpeed: 30,
    leftHeld: false, rightHeld: false, downHeld: false,
    moveTimer: 0,
  }

  constructor(private cc: ChannelContext) {
    this.reset()
  }

  reset(): void {
    const grid: number[][] = []
    for (let y = 0; y < ROWS; y++) grid.push(new Array(COLS).fill(0))
    const s = this.state
    s.grid = grid
    s.cur = { type: Math.floor(Math.random() * 7), rot: 0, x: 3, y: 0 }
    s.next = Math.floor(Math.random() * 7)
    s.started = false
    s.gameOver = false
    s.score = 0
    s.lines = 0
    s.fallTimer = 0
    s.fallSpeed = 30
  }

  key(action: TetrisAction): void {
    const s = this.state
    if (action === 'left-down') { s.leftHeld = true; this.move(-1) }
    else if (action === 'left-up') { s.leftHeld = false; s.moveTimer = 0 }
    else if (action === 'right-down') { s.rightHeld = true; this.move(1) }
    else if (action === 'right-up') { s.rightHeld = false; s.moveTimer = 0 }
    else if (action === 'down-down') s.downHeld = true
    else if (action === 'down-up') s.downHeld = false
    else if (action === 'rotate') this.rotate()
    else if (action === 'drop') this.hardDrop()
    else if (action === 'space') {
      if (s.gameOver) this.reset()
      else if (!s.started) s.started = true
      else this.rotate()
    }
  }

  private check(type: number, rot: number, x: number, y: number): boolean {
    const piece = PIECES[type][rot % PIECES[type].length]
    for (let py = 0; py < piece.length; py++) {
      for (let px = 0; px < piece[py].length; px++) {
        if (!piece[py][px]) continue
        const nx = x + px, ny = y + py
        if (nx < 0 || nx >= COLS || ny >= ROWS) return false
        if (ny >= 0 && this.state.grid[ny][nx]) return false
      }
    }
    return true
  }

  private move(dx: number): void {
    const s = this.state
    if (!s.started || s.gameOver) return
    if (this.check(s.cur.type, s.cur.rot, s.cur.x + dx, s.cur.y)) s.cur.x += dx
  }

  private rotate(): void {
    const s = this.state
    if (!s.started || s.gameOver) return
    const c = s.cur
    const newRot = (c.rot + 1) % PIECES[c.type].length
    if (this.check(c.type, newRot, c.x, c.y)) c.rot = newRot
    else if (this.check(c.type, newRot, c.x - 1, c.y)) { c.rot = newRot; c.x -= 1 }
    else if (this.check(c.type, newRot, c.x + 1, c.y)) { c.rot = newRot; c.x += 1 }
  }

  private lockPiece(): void {
    const s = this.state
    const c = s.cur
    const piece = PIECES[c.type][c.rot % PIECES[c.type].length]
    for (let py = 0; py < piece.length; py++) {
      for (let px = 0; px < piece[py].length; px++) {
        if (!piece[py][px]) continue
        const nx = c.x + px, ny = c.y + py
        if (ny >= 0 && ny < ROWS) s.grid[ny][nx] = c.type + 1
      }
    }
    let cleared = 0
    for (let y = ROWS - 1; y >= 0; y--) {
      if (s.grid[y].every(v => v !== 0)) {
        s.grid.splice(y, 1)
        s.grid.unshift(new Array(COLS).fill(0))
        cleared++
        y++
      }
    }
    if (cleared > 0) {
      const points = [0, 100, 300, 500, 800][cleared] || 0
      s.score += points
      s.lines += cleared
      s.fallSpeed = Math.max(5, 30 - Math.floor(s.lines / 10) * 3)
    }
    s.cur = { type: s.next, rot: 0, x: 3, y: 0 }
    s.next = Math.floor(Math.random() * 7)
    if (!this.check(s.cur.type, 0, s.cur.x, s.cur.y)) {
      s.gameOver = true
    }
  }

  private hardDrop(): void {
    const s = this.state
    if (!s.started || s.gameOver) return
    const c = s.cur
    while (this.check(c.type, c.rot, c.x, c.y + 1)) c.y++
    this.lockPiece()
  }

  private update(): void {
    const s = this.state
    if (!s.started || s.gameOver) return
    if (s.leftHeld || s.rightHeld) {
      s.moveTimer++
      if (s.moveTimer > 8) {
        if (s.leftHeld) this.move(-1)
        if (s.rightHeld) this.move(1)
        s.moveTimer = 5
      }
    }
    s.fallTimer++
    const speed = s.downHeld ? 2 : s.fallSpeed
    if (s.fallTimer >= speed) {
      s.fallTimer = 0
      const c = s.cur
      if (this.check(c.type, c.rot, c.x, c.y + 1)) c.y++
      else this.lockPiece()
    }
  }

  draw(): void {
    this.update()
    const { ctx, W, H } = this.cc
    const s = this.state

    // ゲームボーイ風背景（薄緑）
    ctx.fillStyle = GB_LIGHTEST
    ctx.fillRect(0, 0, W, H)

    // ドットマトリクス風の格子（極薄）
    ctx.fillStyle = 'rgba(15,56,15,0.05)'
    for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 1)
    for (let x = 0; x < W; x += 4) ctx.fillRect(x, 0, 1, H)

    const fieldW = COLS * CELL
    const fieldH = ROWS * CELL
    const fx = (W - fieldW) / 2 - 80
    const fy = 28

    // フィールド枠（GBダークフレーム）
    ctx.fillStyle = GB_DARKEST
    ctx.fillRect(fx - 6, fy - 6, fieldW + 12, fieldH + 12)
    ctx.fillStyle = GB_DARK
    ctx.fillRect(fx - 4, fy - 4, fieldW + 8, fieldH + 8)
    ctx.fillStyle = GB_LIGHTEST
    ctx.fillRect(fx, fy, fieldW, fieldH)
    // フィールド内のドットマトリクス
    ctx.fillStyle = GB_LIGHT
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        ctx.fillRect(fx + x * CELL + CELL - 1, fy + y * CELL + CELL - 1, 1, 1)
      }
    }

    // セル描画（4階調パターン）
    const drawCell = (x: number, y: number) => {
      const cx = fx + x * CELL, cy = fy + y * CELL
      // 外側
      ctx.fillStyle = GB_DARKEST
      ctx.fillRect(cx, cy, CELL - 1, CELL - 1)
      // 内側
      ctx.fillStyle = GB_DARK
      ctx.fillRect(cx + 2, cy + 2, CELL - 5, CELL - 5)
      // 中央ハイライト
      ctx.fillStyle = GB_LIGHTEST
      ctx.fillRect(cx + 5, cy + 5, CELL - 11, CELL - 11)
    }

    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (s.grid[y][x]) drawCell(x, y)
      }
    }

    if (s.started && !s.gameOver) {
      const c = s.cur
      const piece = PIECES[c.type][c.rot % PIECES[c.type].length]
      // ゴースト（薄い枠だけ）
      let ghostY = c.y
      while (this.check(c.type, c.rot, c.x, ghostY + 1)) ghostY++
      for (let py = 0; py < piece.length; py++) {
        for (let px = 0; px < piece[py].length; px++) {
          if (!piece[py][px]) continue
          ctx.strokeStyle = GB_DARKEST
          ctx.lineWidth = 1
          ctx.strokeRect(fx + (c.x + px) * CELL + 0.5, fy + (ghostY + py) * CELL + 0.5, CELL - 2, CELL - 2)
        }
      }
      // 本体
      for (let py = 0; py < piece.length; py++) {
        for (let px = 0; px < piece[py].length; px++) {
          if (!piece[py][px]) continue
          drawCell(c.x + px, c.y + py)
        }
      }
    }

    // サイドパネル（GB風スコアボード）
    const sx = fx + fieldW + 30
    ctx.fillStyle = GB_DARKEST
    ctx.font = 'bold 14px monospace'
    ctx.textAlign = 'left'
    ctx.fillText('TETRIS', sx, 50)
    ctx.fillStyle = GB_DARK
    ctx.font = '11px monospace'
    ctx.fillText('SCORE', sx, 88)
    ctx.fillStyle = GB_DARKEST
    ctx.font = 'bold 16px monospace'
    ctx.fillText(String(s.score).padStart(6, '0'), sx, 108)
    ctx.fillStyle = GB_DARK
    ctx.font = '11px monospace'
    ctx.fillText('LINES', sx, 138)
    ctx.fillStyle = GB_DARKEST
    ctx.font = 'bold 16px monospace'
    ctx.fillText(String(s.lines).padStart(4, '0'), sx, 158)
    ctx.fillStyle = GB_DARK
    ctx.font = '11px monospace'
    ctx.fillText('NEXT', sx, 198)
    // NEXTボックス
    ctx.fillStyle = GB_DARKEST
    ctx.fillRect(sx - 6, 206, 84, 64)
    ctx.fillStyle = GB_LIGHTEST
    ctx.fillRect(sx - 4, 208, 80, 60)
    const nextPiece = PIECES[s.next][0]
    const offsetX = sx + 8 + (4 - nextPiece[0].length) * 7
    for (let py = 0; py < nextPiece.length; py++) {
      for (let px = 0; px < nextPiece[py].length; px++) {
        if (!nextPiece[py][px]) continue
        // 小さいGBセル
        ctx.fillStyle = GB_DARKEST
        ctx.fillRect(offsetX + px * 14, 218 + py * 14, 13, 13)
        ctx.fillStyle = GB_DARK
        ctx.fillRect(offsetX + px * 14 + 2, 218 + py * 14 + 2, 9, 9)
        ctx.fillStyle = GB_LIGHTEST
        ctx.fillRect(offsetX + px * 14 + 5, 218 + py * 14 + 5, 3, 3)
      }
    }

    ctx.fillStyle = GB_DARK
    ctx.font = '10px monospace'
    ctx.fillText('←→ MOVE', sx, 320)
    ctx.fillText('↑ ROTATE', sx, 335)
    ctx.fillText('↓ SOFT DROP', sx, 350)
    ctx.fillText('SPACE ROT', sx, 365)
    ctx.fillText('ESC EXIT', sx, 380)

    // 「GAME BOY」風ロゴ
    ctx.fillStyle = GB_DARK
    ctx.font = 'bold 11px monospace'
    ctx.fillText('GAME BOY', sx, H - 30)
    ctx.fillStyle = GB_DARKEST
    ctx.font = '8px monospace'
    ctx.fillText('Nintendo', sx, H - 18)

    ctx.fillStyle = GB_DARK
    ctx.font = '10px monospace'
    ctx.textAlign = 'right'
    ctx.fillText('JOAK-TV', W - 10, H - 8)

    ctx.textAlign = 'center'
    if (!s.started && !s.gameOver) {
      ctx.fillStyle = GB_DARKEST
      ctx.fillRect(fx, fy + fieldH / 2 - 30, fieldW, 60)
      ctx.fillStyle = GB_LIGHTEST
      ctx.font = 'bold 18px monospace'
      ctx.fillText('PRESS SPACE', fx + fieldW / 2, fy + fieldH / 2 + 6)
    } else if (s.gameOver) {
      ctx.fillStyle = GB_DARKEST
      ctx.fillRect(fx, fy + fieldH / 2 - 50, fieldW, 100)
      ctx.fillStyle = GB_LIGHTEST
      ctx.font = 'bold 22px monospace'
      ctx.fillText('GAME OVER', fx + fieldW / 2, fy + fieldH / 2 - 8)
      ctx.fillStyle = GB_LIGHT
      ctx.font = '12px monospace'
      ctx.fillText('PRESS SPACE', fx + fieldW / 2, fy + fieldH / 2 + 20)
    }

    // 軽いノイズ
    const id = ctx.getImageData(0, 0, W, H), d = id.data
    for (let i = 0; i < d.length; i += 16) {
      const n = ((Math.random()-0.5)*4)|0
      d[i]+=n; d[i+1]+=n; d[i+2]+=n
    }
    ctx.putImageData(id, 0, 0)
  }
}
