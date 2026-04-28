// CH3: ブロック崩し
import type { ChannelContext } from './types'

const SPEEDS = [
  { name: 'SLOW',   v: 3 },
  { name: 'NORMAL', v: 4 },
  { name: 'FAST',   v: 6 },
]

export type BreakoutAction = 'left-down' | 'left-up' | 'right-down' | 'right-up' | 'space'

export class BreakoutChannel {
  private state = {
    paddleX: 270,
    paddleW: 100,
    ballX: 320,
    ballY: 350,
    ballVX: 4,
    ballVY: -4,
    blocks: [] as Array<{ x: number; y: number; alive: boolean; color: string }>,
    started: false,
    gameOver: false,
    cleared: false,
    score: 0,
    leftHeld: false,
    rightHeld: false,
    speedIdx: 1,
  }

  constructor(private cc: ChannelContext) {
    this.reset()
  }

  reset(): void {
    const { W } = this.cc
    const blocks: Array<{ x: number; y: number; alive: boolean; color: string }> = []
    const cols = 10, rows = 5
    const blockW = 56, blockH = 18, margin = 4
    const startX = (W - (cols * (blockW + margin) - margin)) / 2
    const startY = 60
    // ビーチ/夕焼け パレット
    const colors = ['#7a3a8a', '#cc4466', '#ff7744', '#ffaa55', '#ffdd88']
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        blocks.push({
          x: startX + c * (blockW + margin),
          y: startY + r * (blockH + margin),
          alive: true,
          color: colors[r],
        })
      }
    }
    const s = this.state
    s.blocks = blocks
    s.paddleX = (W - s.paddleW) / 2
    s.ballX = W / 2
    s.ballY = 380
    const v = SPEEDS[s.speedIdx].v
    s.ballVX = v
    s.ballVY = -v
    s.started = false
    s.gameOver = false
    s.cleared = false
    s.score = 0
  }

  speedChange(dir: 1 | -1): void {
    const s = this.state
    if (s.started && !s.gameOver && !s.cleared) return
    s.speedIdx = (s.speedIdx + dir + SPEEDS.length) % SPEEDS.length
    const v = SPEEDS[s.speedIdx].v
    s.ballVX = Math.sign(s.ballVX || 1) * v
    s.ballVY = Math.sign(s.ballVY || -1) * v
  }

  key(action: BreakoutAction): void {
    const s = this.state
    if (action === 'left-down') s.leftHeld = true
    else if (action === 'left-up') s.leftHeld = false
    else if (action === 'right-down') s.rightHeld = true
    else if (action === 'right-up') s.rightHeld = false
    else if (action === 'space') {
      if (s.gameOver || s.cleared) this.reset()
      else if (!s.started) s.started = true
    }
  }

  private update(): void {
    const s = this.state
    const { W, H } = this.cc
    const paddleSpeed = 7
    if (s.leftHeld) s.paddleX -= paddleSpeed
    if (s.rightHeld) s.paddleX += paddleSpeed
    s.paddleX = Math.max(0, Math.min(W - s.paddleW, s.paddleX))

    if (!s.started || s.gameOver || s.cleared) return

    s.ballX += s.ballVX
    s.ballY += s.ballVY

    if (s.ballX <= 6) { s.ballX = 6; s.ballVX *= -1 }
    if (s.ballX >= W - 6) { s.ballX = W - 6; s.ballVX *= -1 }
    if (s.ballY <= 6) { s.ballY = 6; s.ballVY *= -1 }

    if (s.ballY >= H - 6) {
      s.gameOver = true
      return
    }

    const paddleY = H - 30
    if (s.ballY >= paddleY - 4 && s.ballY <= paddleY + 12 &&
        s.ballX >= s.paddleX && s.ballX <= s.paddleX + s.paddleW &&
        s.ballVY > 0) {
      s.ballVY *= -1
      const hit = (s.ballX - (s.paddleX + s.paddleW / 2)) / (s.paddleW / 2)
      s.ballVX = hit * 6
      s.ballY = paddleY - 4
    }

    let aliveCount = 0
    for (const blk of s.blocks) {
      if (!blk.alive) continue
      aliveCount++
      const blockW = 56, blockH = 18
      if (s.ballX >= blk.x - 6 && s.ballX <= blk.x + blockW + 6 &&
          s.ballY >= blk.y - 6 && s.ballY <= blk.y + blockH + 6) {
        blk.alive = false
        aliveCount--
        s.score += 10
        const overlapX = Math.min(Math.abs(s.ballX - blk.x), Math.abs(s.ballX - (blk.x + blockW)))
        const overlapY = Math.min(Math.abs(s.ballY - blk.y), Math.abs(s.ballY - (blk.y + blockH)))
        if (overlapY < overlapX) s.ballVY *= -1
        else s.ballVX *= -1
        break
      }
    }
    if (aliveCount === 0) s.cleared = true
  }

  draw(): void {
    this.update()
    const { ctx, W, H } = this.cc
    const s = this.state

    // 夕焼けグラデ背景
    const grd = ctx.createLinearGradient(0, 0, 0, H)
    grd.addColorStop(0, '#3a1a4a')
    grd.addColorStop(0.35, '#aa3a6a')
    grd.addColorStop(0.6, '#ee6644')
    grd.addColorStop(0.85, '#ffaa66')
    grd.addColorStop(1, '#ffd488')
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, W, H)

    // 太陽（地平線あたり）
    ctx.fillStyle = '#ffee88'
    const sunY = H * 0.55
    ctx.fillRect(W / 2 - 30, sunY - 28, 60, 60)
    ctx.fillStyle = '#ffcc55'
    ctx.fillRect(W / 2 - 25, sunY - 24, 50, 50)
    ctx.fillStyle = '#ffaa44'
    ctx.fillRect(W / 2 - 18, sunY - 18, 36, 36)
    // 太陽の光（水平線の反射）
    ctx.fillStyle = 'rgba(255,200,100,0.3)'
    ctx.fillRect(W / 2 - 80, sunY + 6, 160, 2)
    ctx.fillStyle = 'rgba(255,200,100,0.2)'
    ctx.fillRect(W / 2 - 60, sunY + 12, 120, 1)
    ctx.fillRect(W / 2 - 100, sunY + 18, 200, 1)

    // 海/砂浜（下部）
    ctx.fillStyle = '#aa5544'
    ctx.fillRect(0, H * 0.78, W, H * 0.22)
    ctx.fillStyle = '#cc7755'
    ctx.fillRect(0, H * 0.78, W, 4)

    // ヤシの木シルエット（左右）
    const drawPalm = (px: number) => {
      ctx.fillStyle = '#1a0a1a'
      ctx.fillRect(px, H * 0.55, 4, H * 0.25)
      // 葉
      for (let i = 0; i < 5; i++) {
        const a = (i / 4) * Math.PI - Math.PI / 2
        const lx = px + 2 + Math.cos(a) * 24
        const ly = H * 0.55 + Math.sin(a) * 18
        ctx.fillRect(Math.min(px, lx), Math.min(H * 0.55, ly), Math.abs(lx - px) + 2, Math.abs(ly - H * 0.55) + 2)
      }
    }
    drawPalm(40)
    drawPalm(W - 50)

    // ヘッダー
    ctx.fillStyle = 'rgba(58,26,74,0.85)'
    ctx.fillRect(0, 0, W, 36)
    ctx.fillStyle = '#ffdd88'
    ctx.font = 'bold 14px monospace'
    ctx.textAlign = 'left'
    ctx.fillText('SUNSET BREAKER', 15, 23)
    ctx.fillStyle = '#fff'
    ctx.textAlign = 'right'
    ctx.fillText('SCORE: ' + String(s.score).padStart(4, '0'), W - 15, 23)
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.font = '10px monospace'
    ctx.fillText('JOAK-TV', W - 10, H - 8)

    for (const blk of s.blocks) {
      if (!blk.alive) continue
      ctx.fillStyle = blk.color
      ctx.fillRect(blk.x, blk.y, 56, 18)
      ctx.fillStyle = 'rgba(255,255,255,0.35)'
      ctx.fillRect(blk.x, blk.y, 56, 3)
      ctx.fillStyle = 'rgba(0,0,0,0.25)'
      ctx.fillRect(blk.x, blk.y + 15, 56, 3)
    }

    // パドル（サーフボード風）
    const paddleY = H - 30
    ctx.fillStyle = '#fff8e8'
    ctx.fillRect(s.paddleX, paddleY, s.paddleW, 8)
    ctx.fillStyle = '#ee7744'
    ctx.fillRect(s.paddleX, paddleY, s.paddleW, 2)
    ctx.fillStyle = '#cc5533'
    ctx.fillRect(s.paddleX + s.paddleW / 2 - 1, paddleY, 2, 8)

    // ボール（暖色系）
    ctx.fillStyle = '#ffee88'
    ctx.fillRect(s.ballX - 5, s.ballY - 5, 10, 10)
    ctx.fillStyle = '#fff8c8'
    ctx.fillRect(s.ballX - 4, s.ballY - 5, 4, 4)

    // 下枠
    ctx.fillStyle = 'rgba(58,26,74,0.85)'
    ctx.fillRect(0, H - 18, W, 18)

    ctx.textAlign = 'center'
    ctx.font = 'bold 24px monospace'
    if (!s.started && !s.gameOver && !s.cleared) {
      ctx.fillStyle = 'rgba(0,0,0,0.7)'
      ctx.fillRect(W / 2 - 200, H / 2 - 60, 400, 120)
      ctx.fillStyle = '#ffee44'
      ctx.fillText('PRESS SPACE', W / 2, H / 2 - 18)
      ctx.font = '14px monospace'
      ctx.fillStyle = '#aaa'
      ctx.fillText('SPEED: ' + SPEEDS[s.speedIdx].name + '  (↑↓ to change)', W / 2, H / 2 + 12)
      ctx.fillStyle = '#888'
      ctx.fillText('←→ PADDLE  ESC EXIT', W / 2, H / 2 + 36)
    } else if (s.gameOver) {
      ctx.fillStyle = 'rgba(0,0,0,0.7)'
      ctx.fillRect(W / 2 - 180, H / 2 - 50, 360, 100)
      ctx.fillStyle = '#ff5566'
      ctx.fillText('GAME OVER', W / 2, H / 2 - 10)
      ctx.fillStyle = '#fff'
      ctx.font = '14px monospace'
      ctx.fillText('PRESS SPACE TO RESTART', W / 2, H / 2 + 20)
    } else if (s.cleared) {
      ctx.fillStyle = 'rgba(0,0,0,0.7)'
      ctx.fillRect(W / 2 - 180, H / 2 - 50, 360, 100)
      ctx.fillStyle = '#88ff88'
      ctx.fillText('CLEAR!', W / 2, H / 2 - 10)
      ctx.fillStyle = '#fff'
      ctx.font = '14px monospace'
      ctx.fillText('PRESS SPACE TO RESTART', W / 2, H / 2 + 20)
    }

    const id = ctx.getImageData(0, 0, W, H), d = id.data
    for (let i = 0; i < d.length; i += 16) {
      const n = ((Math.random()-0.5)*4)|0
      d[i]+=n; d[i+1]+=n; d[i+2]+=n
    }
    ctx.putImageData(id, 0, 0)
  }
}
