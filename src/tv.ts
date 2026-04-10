// ===== TV CONTROLLER =====

export interface TvDeps {
  setMode: (mode: 'tv' | 'room') => void
  roomCanvas: HTMLCanvasElement
}

export interface TvElements {
  screen: HTMLCanvasElement
  gameFrame: HTMLIFrameElement
  chKnob: HTMLElement
  chDisplay: HTMLElement
  led: HTMLElement
  ovOff: HTMLElement
  btnPwr: HTMLElement
}

export class TvController {
  // DOM
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private gameFrame: HTMLIFrameElement
  private chKnob: HTMLElement
  private chDisp: HTMLElement
  private led: HTMLElement
  private ovOff: HTMLElement

  // State
  ch = 0
  tvOn = true
  switching = false
  private swTimer = 0
  private frame = 0
  private gameLoaded = false
  private chRot = 0
  private gf = 0
  private vt = 0
  private cdv = 10
  private cdf = 0

  // Constants
  private readonly W = 640
  private readonly H = 480
  private readonly SW_DUR = 15
  private readonly TOTAL_CH = 6
  readonly GAME_CH = 5
  private readonly ROT_PER = 360 / 6
  private staticImg: ImageData

  private renderers: Array<(int?: number) => void>

  constructor(private deps: TvDeps, els?: TvElements) {
    if (els) {
      this.canvas = els.screen
      this.gameFrame = els.gameFrame
      this.chKnob = els.chKnob
      this.chDisp = els.chDisplay
      this.led = els.led
      this.ovOff = els.ovOff
    } else {
      this.canvas = document.getElementById('screen') as HTMLCanvasElement
      this.gameFrame = document.getElementById('game-frame') as HTMLIFrameElement
      this.chKnob = document.getElementById('ch-knob')!
      this.chDisp = document.getElementById('ch-display')!
      this.led = document.getElementById('led')!
      this.ovOff = document.getElementById('ov-off')!
    }

    this.ctx = this.canvas.getContext('2d')!
    this.canvas.width = this.W
    this.canvas.height = this.H

    this.staticImg = this.ctx.createImageData(this.W, this.H)

    this.renderers = [
      (int?: number) => this.drawStatic(int),
      () => this.drawBars(),
      () => this.drawNews(),
      () => this.drawDrama(),
      () => this.drawAnime(),
    ]

    // Event listeners
    this.chKnob.addEventListener('click', (e: MouseEvent) => {
      const r = this.chKnob.getBoundingClientRect()
      this.switchCh((e.clientX - r.left - r.width / 2) > 0 ? 1 : -1)
    })
    this.chKnob.addEventListener('wheel', (e: WheelEvent) => {
      e.preventDefault()
      this.switchCh(e.deltaY > 0 ? 1 : -1)
    }, { passive: false })
    const btnPwr = els ? els.btnPwr : document.getElementById('btn-pwr')!
    btnPwr.addEventListener('click', () => this.togglePwr())
  }

  enterTvMode(): void {
    this.deps.setMode('tv')
  }

  exitTvMode(): void {
    this.deps.setMode('room')
    if (this.ch === this.GAME_CH) this.hideGame()
    this.deps.roomCanvas.focus()
  }

  switchCh(dir: number): void {
    if (!this.tvOn || this.switching) return
    if (this.ch === this.GAME_CH) this.hideGame()
    this.ch = (this.ch + dir + this.TOTAL_CH) % this.TOTAL_CH
    this.chRot = this.ch * this.ROT_PER
    this.chKnob.style.transform = 'rotate(' + this.chRot + 'deg)'
    this.chDisp.textContent = 'CH ' + (this.ch + 1)
    this.switching = true
    this.swTimer = 0
  }

  togglePwr(): void {
    this.tvOn = !this.tvOn
    if (this.tvOn) {
      this.led.classList.add('on')
      this.ovOff.classList.remove('active', 'shrink')
      this.canvas.style.opacity = '1'
      if (this.ch === this.GAME_CH) this.showGame()
    } else {
      if (this.ch === this.GAME_CH) this.hideGame()
      this.led.classList.remove('on')
      this.ctx.fillStyle = '#000'
      this.ctx.fillRect(0, 0, this.W, this.H)
      this.canvas.style.display = 'block'
      this.canvas.style.opacity = '0'
      this.ovOff.classList.add('active')
      setTimeout(() => { this.ovOff.classList.add('shrink') }, 50)
    }
  }

  render(): void {
    this.frame++
    if (!this.tvOn) return
    if (this.ch === this.GAME_CH && !this.switching) return
    if (this.switching) {
      this.drawStatic(0.7 + Math.random() * 0.3)
      this.swTimer++
      if (this.swTimer >= this.SW_DUR) {
        this.switching = false
        this.swTimer = 0
        if (this.ch === this.GAME_CH) this.showGame()
      }
    } else {
      this.renderers[this.ch]()
      if (this.frame % 2 === 0) this.applyCRT()
    }
  }

  hideGame(): void {
    this.gameFrame.classList.add('hidden')
    this.canvas.style.display = 'block'
  }

  resetGame(): void {
    this.gameLoaded = false
    this.gameFrame.src = 'about:blank'
  }

  // ===== Private =====

  private showGame(): void {
    if (!this.gameLoaded) {
      this.gameFrame.src = 'game.html'
      this.gameLoaded = true
    }
    this.canvas.style.display = 'none'
    this.gameFrame.classList.remove('hidden')
    this.gameFrame.focus()
  }

  private applyCRT(): void {
    const { ctx, W, H } = this
    const id = ctx.getImageData(0, 0, W, H), d = id.data, c = new Uint8ClampedArray(d)
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4
        d[i] = c[(y * W + Math.min(W - 1, x + 3)) * 4]
        d[i + 2] = c[(y * W + Math.max(0, x - 3)) * 4 + 2]
      }
    }
    for (let i = 0; i < d.length; i += 4) {
      d[i] = Math.min(255, d[i] * 1.05)
      d[i + 2] = Math.min(255, d[i + 2] * 0.92)
    }
    ctx.putImageData(id, 0, 0)
  }

  // CH0: 砂嵐
  private drawStatic(int?: number): void {
    const intensity = int ?? 1
    const { ctx, W, H } = this
    const d = this.staticImg.data
    for (let i = 0; i < d.length; i += 4) {
      let v = (Math.random() * 200 * intensity) | 0
      if (Math.random() < 0.02) v = 200 + (Math.random() * 55) | 0
      d[i] = v; d[i+1] = v; d[i+2] = v; d[i+3] = 255
    }
    ctx.putImageData(this.staticImg, 0, 0)
    ctx.fillStyle = 'rgba(255,255,255,0.15)'
    ctx.font = '14px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('受信できません', W / 2, H / 2)
  }

  // CH1: カラーバー + 時刻表示
  private drawBars(): void {
    const { ctx, W, H } = this
    const mc = [[192,192,192],[192,192,0],[0,192,192],[0,192,0],[192,0,192],[192,0,0],[0,0,192]]
    const bw = W / 7, mh = H * 0.65
    mc.forEach((c, i) => { ctx.fillStyle = 'rgb('+c+')'; ctx.fillRect(i*bw, 0, bw+1, mh) })
    const bt = mh
    ctx.fillStyle = '#111'; ctx.fillRect(0, bt, W, H - bt)
    ctx.fillStyle = '#ccc'
    ctx.font = 'bold 20px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('JOAK-TV', W/2, bt + 30)
    ctx.font = '12px monospace'
    ctx.fillText('本日の放送は終了しました', W/2, bt + 52)
    const now = new Date()
    ctx.font = 'bold 24px monospace'
    ctx.fillStyle = '#ffcc44'
    ctx.fillText(now.getHours() + ':' + String(now.getMinutes()).padStart(2,'0'), W/2, bt + 85)
    const id = ctx.getImageData(0, 0, W, H), d = id.data
    for (let i = 0; i < d.length; i += 8) {
      const n = ((Math.random()-0.5)*10)|0
      d[i]+=n; d[i+1]+=n; d[i+2]+=n
    }
    ctx.putImageData(id, 0, 0)
  }

  // CH2: ニュース番組
  private drawNews(): void {
    const { ctx, W, H } = this
    this.gf++
    const story = Math.floor(this.gf / 360) % 3

    // スタジオ背景（青系）
    ctx.fillStyle = '#1a2a4a'
    ctx.fillRect(0, 0, W, H)
    // 背景パネル（グラデーション風）
    ctx.fillStyle = '#223355'
    ctx.fillRect(0, 0, W, H * 0.65)
    ctx.fillStyle = '#2a3a5a'
    ctx.fillRect(20, 20, W - 40, H * 0.6)
    // 世界地図シルエット（背景装飾）
    ctx.fillStyle = 'rgba(100,150,255,0.08)'
    ctx.fillRect(W * 0.1, H * 0.05, W * 0.3, H * 0.25)
    ctx.fillRect(W * 0.15, H * 0.1, W * 0.2, H * 0.3)
    ctx.fillRect(W * 0.5, H * 0.08, W * 0.15, H * 0.2)
    ctx.fillRect(W * 0.55, H * 0.15, W * 0.2, H * 0.25)
    ctx.fillRect(W * 0.7, H * 0.2, W * 0.15, H * 0.15)

    // ニュースデスク
    ctx.fillStyle = '#5a4030'
    ctx.fillRect(0, H * 0.58, W, H * 0.12)
    ctx.fillStyle = '#6a5040'
    ctx.fillRect(0, H * 0.58, W, 4)
    // デスクの上のもの
    // マイク
    ctx.fillStyle = '#333'
    ctx.fillRect(W * 0.42, H * 0.52, 6, 20)
    ctx.fillStyle = '#555'
    ctx.fillRect(W * 0.4, H * 0.49, 10, 8)
    // 紙の束
    ctx.fillStyle = '#eee'
    ctx.fillRect(W * 0.3, H * 0.56, 30, 20)
    ctx.fillStyle = '#ddd'
    ctx.fillRect(W * 0.31, H * 0.55, 28, 20)
    // ペン
    ctx.fillStyle = '#224'
    ctx.fillRect(W * 0.36, H * 0.54, 2, 18)
    // コップ
    ctx.fillStyle = 'rgba(200,220,255,0.5)'
    ctx.fillRect(W * 0.55, H * 0.54, 10, 14)
    ctx.fillStyle = 'rgba(180,200,240,0.4)'
    ctx.fillRect(W * 0.56, H * 0.55, 8, 10)

    // キャスター（みんみんっち = 黒白猫）
    const ax = W * 0.48, ay = H * 0.38
    const s = 4
    // 体（スーツ）
    ctx.fillStyle = '#334'
    ctx.fillRect(ax - 4*s, ay + 5*s, 10*s, 8*s)
    // ネクタイ
    ctx.fillStyle = '#c33'
    ctx.fillRect(ax + 0*s, ay + 5*s, 2*s, 6*s)
    // しっぽ（右側にはみ出す）
    ctx.fillStyle = '#222'
    ctx.fillRect(ax + 6*s, ay + 8*s, 3*s, 2*s)
    ctx.fillRect(ax + 8*s, ay + 7*s, 2*s, 2*s)
    ctx.fillRect(ax + 9*s, ay + 6*s, 2*s, 2*s)
    // 頭（丸い猫顔）
    ctx.fillStyle = '#222'
    ctx.fillRect(ax - 4*s, ay + 0*s, 10*s, 6*s)
    ctx.fillRect(ax - 3*s, ay - 1*s, 8*s, 8*s)
    // 三角耳（大きめ、猫らしく）
    ctx.fillRect(ax - 5*s, ay - 3*s, 3*s, 4*s)
    ctx.fillRect(ax - 4*s, ay - 4*s, 2*s, 2*s)
    ctx.fillRect(ax + 4*s, ay - 3*s, 3*s, 4*s)
    ctx.fillRect(ax + 4*s, ay - 4*s, 2*s, 2*s)
    // 耳の中（白）
    ctx.fillStyle = '#fff'
    ctx.fillRect(ax - 4*s, ay - 2*s, 1*s, 2*s)
    ctx.fillRect(ax + 5*s, ay - 2*s, 1*s, 2*s)
    // 白い顔部分（逆三角）
    ctx.fillStyle = '#fff'
    ctx.fillRect(ax - 2*s, ay + 2*s, 6*s, 4*s)
    ctx.fillRect(ax - 1*s, ay + 1*s, 4*s, 2*s)
    // 目（黄色い猫目）
    ctx.fillStyle = '#ee2'
    ctx.fillRect(ax - 2*s, ay + 1*s, 2*s, 2*s)
    ctx.fillRect(ax + 2*s, ay + 1*s, 2*s, 2*s)
    // 瞳（縦長スリット）
    ctx.fillStyle = '#111'
    ctx.fillRect(ax - 1*s, ay + 1*s, 1*s, 2*s)
    ctx.fillRect(ax + 3*s, ay + 1*s, 1*s, 2*s)
    // 鼻
    ctx.fillStyle = '#f8a'
    ctx.fillRect(ax + 0*s, ay + 3*s, 2*s, 1*s)
    // ヒゲ（3本ずつ）
    ctx.fillStyle = '#ccc'
    ctx.fillRect(ax - 5*s, ay + 3*s, 3*s, 1*s)
    ctx.fillRect(ax - 5*s, ay + 4*s, 4*s, 1*s)
    ctx.fillRect(ax - 4*s, ay + 5*s, 3*s, 1*s)
    ctx.fillRect(ax + 4*s, ay + 3*s, 3*s, 1*s)
    ctx.fillRect(ax + 3*s, ay + 4*s, 4*s, 1*s)
    ctx.fillRect(ax + 3*s, ay + 5*s, 3*s, 1*s)
    // 口（喋る）
    if (this.gf % 16 < 8) {
      ctx.fillStyle = '#300'
      ctx.fillRect(ax + 0*s, ay + 4*s, 2*s, 1*s)
    }

    // テロップ下段
    ctx.fillStyle = '#cc2222'
    ctx.fillRect(0, H * 0.72, W, 36)
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 12px monospace'
    ctx.textAlign = 'left'
    ctx.fillRect(0, H * 0.72, 80, 36)
    ctx.fillStyle = '#c22'
    ctx.fillText('速 報', 15, H * 0.72 + 23)
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 16px monospace'

    if (story === 0) {
      ctx.fillText('まるまる町で大規模お花見大会　住民たち歓喜', 90, H * 0.72 + 24)
    } else if (story === 1) {
      ctx.fillText('よいしょっち 町内料理コンテストで優勝　秘伝のレシピ公開', 90, H * 0.72 + 24)
    } else {
      ctx.fillText('ぽぽみっち 新記録達成　かくれんぼ3時間の壁を突破', 90, H * 0.72 + 24)
    }

    // ニュースティッカー（下）
    ctx.fillStyle = '#112244'
    ctx.fillRect(0, H * 0.82, W, 24)
    ctx.fillStyle = '#8ac'
    ctx.font = '11px monospace'
    const tickerText = '▶ 明日の天気：晴れのち曇り　最高気温22℃　▶ すんすんっち行方不明→縁側で昼寝してた　▶ 特集：たそがれ荘の秘密に迫る'
    const tickerX = W - (this.gf * 1.5) % (tickerText.length * 8 + W)
    ctx.fillText(tickerText, tickerX, H * 0.82 + 16)

    // 時刻表示
    const now = new Date()
    ctx.fillStyle = 'rgba(0,0,0,0.6)'
    ctx.fillRect(W - 100, H * 0.88, 90, 22)
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 14px monospace'
    ctx.textAlign = 'right'
    ctx.fillText(now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0'), W - 15, H * 0.88 + 16)

    // 局ロゴ
    ctx.fillStyle = 'rgba(255,255,255,0.3)'
    ctx.font = '10px monospace'
    ctx.fillText('JOAK-TV', W - 10, 16)

    // ノイズ
    const id = ctx.getImageData(0, 0, W, H), d = id.data
    for (let i = 0; i < d.length; i += 8) {
      const n = ((Math.random()-0.5)*6)|0
      d[i]+=n; d[i+1]+=n; d[i+2]+=n
    }
    ctx.putImageData(id, 0, 0)
  }

  // CH3: ドラマ「たそがれ荘の住人たち」
  private drawDrama(): void {
    const { ctx, W, H } = this
    this.vt++
    const scene = Math.floor(this.vt / 300) % 3 // シーン切り替え

    // 背景（夕暮れの部屋）
    ctx.fillStyle = '#2a1a10'
    ctx.fillRect(0, 0, W, H)
    // 壁
    ctx.fillStyle = '#6a5a40'
    ctx.fillRect(0, 0, W, H * 0.55)
    // 窓（夕焼け）
    const winX = W * 0.6, winY = H * 0.08, winW = W * 0.3, winH = H * 0.35
    ctx.fillStyle = '#cc6633'
    ctx.fillRect(winX, winY, winW, winH)
    ctx.fillStyle = '#ee8844'
    ctx.fillRect(winX + 4, winY + 4, winW - 8, winH - 8)
    ctx.fillStyle = '#ffaa55'
    ctx.fillRect(winX + 12, winY + 14, winW - 24, winH * 0.4)
    // 窓枠（十字を窓中心に配置）
    ctx.fillStyle = '#5a4a30'
    ctx.fillRect(winX, winY + winH / 2 - 2, winW, 4)
    ctx.fillRect(winX + winW / 2 - 2, winY, 4, winH)
    // カーテン
    ctx.fillStyle = '#8a6644'
    ctx.fillRect(W * 0.58, H * 0.05, 16, H * 0.4)
    ctx.fillRect(W * 0.89, H * 0.05, 16, H * 0.4)
    ctx.fillStyle = '#9a7654'
    ctx.fillRect(W * 0.58, H * 0.05, 16, 8)
    ctx.fillRect(W * 0.89, H * 0.05, 16, 8)
    // 壁掛け時計
    const clkX = W * 0.15, clkY = H * 0.08, clkS = 40
    ctx.fillStyle = '#5a3a20'
    ctx.fillRect(clkX, clkY, clkS, clkS)
    ctx.fillStyle = '#f0ead8'
    ctx.fillRect(clkX + 4, clkY + 4, clkS - 8, clkS - 8)
    // 針（時計中心から）
    const clkCx = clkX + clkS / 2, clkCy = clkY + clkS / 2
    ctx.fillStyle = '#333'
    ctx.fillRect(clkCx - 1, clkCy - 12, 2, 12) // 長針（12時方向）
    ctx.fillRect(clkCx, clkCy - 1, 10, 2)      // 短針（3時方向）
    ctx.fillRect(clkCx - 1, clkCy - 1, 3, 3)   // 中心点
    // 額縁（壁の左端）
    ctx.fillStyle = '#6a5030'
    ctx.fillRect(W * 0.35, H * 0.1, 50, 40)
    ctx.fillStyle = '#aaddee'
    ctx.fillRect(W * 0.35 + 4, H * 0.1 + 4, 42, 32)
    ctx.fillStyle = '#88bbcc'
    ctx.fillRect(W * 0.35 + 10, H * 0.1 + 18, 30, 18)
    // 床
    ctx.fillStyle = '#4a3a22'
    ctx.fillRect(0, H * 0.55, W, H * 0.45)
    // 畳模様
    ctx.fillStyle = '#544a2a'
    for (let i = 0; i < 8; i++) {
      ctx.fillRect(0, H * 0.55 + i * 25, W, 1)
    }
    // ちゃぶ台
    const tblX = W * 0.35, tblY = H * 0.6, tblW = W * 0.3, tblH = H * 0.08
    ctx.fillStyle = '#7a5a30'
    ctx.fillRect(tblX, tblY, tblW, tblH)
    ctx.fillStyle = '#8a6a38'
    ctx.fillRect(tblX, tblY, tblW, 4)
    ctx.fillStyle = '#6a4a20'
    ctx.fillRect(tblX, tblY + tblH - 3, tblW, 3)
    // ちゃぶ台の脚
    ctx.fillStyle = '#6a4a20'
    ctx.fillRect(tblX + 8, tblY + tblH, 6, 16)
    ctx.fillRect(tblX + tblW - 14, tblY + tblH, 6, 16)
    // ちゃぶ台の上：湯呑み（天面に乗せる）
    const cupH = 14
    ctx.fillStyle = '#eee'
    ctx.fillRect(tblX + 32, tblY - cupH, 12, cupH)
    ctx.fillStyle = '#bbd'
    ctx.fillRect(tblX + 32, tblY - cupH, 12, 5)
    // 急須
    const potH = 14
    ctx.fillStyle = '#664422'
    ctx.fillRect(tblX + 80, tblY - potH, 16, potH)
    ctx.fillStyle = '#775533'
    ctx.fillRect(tblX + 80, tblY - potH, 16, 5)
    ctx.fillRect(tblX + 76, tblY - potH + 4, 4, 6) // 取っ手
    // 湯気
    ctx.fillStyle = 'rgba(255,255,255,0.15)'
    ctx.fillRect(tblX + 37, tblY - cupH - 6, 2, 5)
    ctx.fillRect(tblX + 87, tblY - potH - 6, 2, 6)
    // フロアランプ（左端）
    const lampCx = W * 0.05 + 2 // 棒の中心
    ctx.fillStyle = '#555'
    ctx.fillRect(lampCx - 2, H * 0.35, 4, H * 0.2)
    ctx.fillStyle = '#e8d0a0'
    ctx.fillRect(lampCx - 10, H * 0.28, 20, 18)
    ctx.fillStyle = '#d4c088'
    ctx.fillRect(lampCx - 10, H * 0.31, 20, 6)
    // ランプの光
    ctx.fillStyle = 'rgba(255,220,150,0.06)'
    ctx.fillRect(0, H * 0.2, W * 0.2, H * 0.4)
    // 本棚（右端の壁）
    ctx.fillStyle = '#5a3a20'
    ctx.fillRect(W * 0.92, H * 0.08, W * 0.07, H * 0.47)
    ctx.fillStyle = '#6a4a30'
    ctx.fillRect(W * 0.93, H * 0.1, W * 0.05, H * 0.12)
    ctx.fillRect(W * 0.93, H * 0.25, W * 0.05, H * 0.12)
    ctx.fillRect(W * 0.93, H * 0.4, W * 0.05, H * 0.12)
    // 本
    ctx.fillStyle = '#c33'
    ctx.fillRect(W * 0.935, H * 0.11, 8, 20)
    ctx.fillStyle = '#36c'
    ctx.fillRect(W * 0.95, H * 0.12, 8, 18)
    ctx.fillStyle = '#3a3'
    ctx.fillRect(W * 0.935, H * 0.26, 8, 20)
    ctx.fillStyle = '#cc9'
    ctx.fillRect(W * 0.95, H * 0.27, 8, 18)
    // 座布団（床に）
    ctx.fillStyle = '#8a3a4a'
    ctx.fillRect(W * 0.25, H * 0.72, 30, 20)
    ctx.fillStyle = '#9a4a5a'
    ctx.fillRect(W * 0.26, H * 0.73, 28, 10)
    ctx.fillStyle = '#8a3a4a'
    ctx.fillRect(W * 0.58, H * 0.74, 30, 20)
    ctx.fillStyle = '#9a4a5a'
    ctx.fillRect(W * 0.59, H * 0.75, 28, 10)

    // キャラ描画ヘルパー（大きめピクセルアート）
    const drawChar = (cx: number, cy: number, body: string, light: string, eye: string, accent: string, dir: number, talk: boolean) => {
      const s = 4 // スケール
      const bx = cx - 5 * s, by = cy - 12 * s
      // 影
      ctx.fillStyle = 'rgba(0,0,0,0.2)'
      ctx.fillRect(bx + 2*s, by + 13*s, 8*s, 2*s)
      // 体
      ctx.fillStyle = body
      ctx.fillRect(bx + 2*s, by + 4*s, 8*s, 7*s)
      // 頭
      ctx.fillRect(bx + 1*s, by + 1*s, 10*s, 6*s)
      ctx.fillRect(bx + 2*s, by, 8*s, 2*s)
      // 耳
      ctx.fillRect(bx + 1*s, by - 1*s, 3*s, 3*s)
      ctx.fillRect(bx + 8*s, by - 1*s, 3*s, 3*s)
      ctx.fillStyle = accent
      ctx.fillRect(bx + 2*s, by, 1*s, 2*s)
      ctx.fillRect(bx + 9*s, by, 1*s, 2*s)
      // 顔
      ctx.fillStyle = light
      ctx.fillRect(bx + 3*s, by + 4*s, 6*s, 3*s)
      // 目
      ctx.fillStyle = eye
      if (dir === 0) {
        ctx.fillRect(bx + 3*s, by + 3*s, 2*s, 2*s)
        ctx.fillRect(bx + 7*s, by + 3*s, 2*s, 2*s)
      } else {
        ctx.fillRect(bx + 2*s, by + 3*s, 2*s, 2*s)
        ctx.fillRect(bx + 6*s, by + 3*s, 2*s, 2*s)
      }
      // 瞳
      ctx.fillStyle = '#111'
      ctx.fillRect(bx + (dir === 0 ? 4 : 2)*s, by + 3*s, 1*s, 1*s)
      ctx.fillRect(bx + (dir === 0 ? 7 : 6)*s, by + 3*s, 1*s, 1*s)
      // 口（喋ってる時開く）
      if (talk && this.vt % 20 < 10) {
        ctx.fillStyle = '#300'
        ctx.fillRect(bx + 5*s, by + 6*s, 2*s, 1*s)
      }
      // 足
      ctx.fillStyle = body
      ctx.fillRect(bx + 2*s, by + 11*s, 3*s, 2*s)
      ctx.fillRect(bx + 7*s, by + 11*s, 3*s, 2*s)
    }

    if (scene === 0) {
      // シーン1: みんみんっち と ぽぽみっち の会話
      drawChar(W * 0.3, H * 0.7, '#222', '#fff', '#ee2', '#fff', 1, true)
      drawChar(W * 0.65, H * 0.72, '#c59', '#fce', '#fce', '#f8b', 0, false)
      // 字幕
      ctx.fillStyle = 'rgba(0,0,0,0.7)'
      ctx.fillRect(W * 0.1, H * 0.85, W * 0.8, 40)
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 16px monospace'
      ctx.textAlign = 'center'
      ctx.fillText('「...ここにいたのか。」', W / 2, H * 0.85 + 27)
    } else if (scene === 1) {
      // シーン2: すんすんっち 一人、窓際
      drawChar(W * 0.65, H * 0.65, '#eb8', '#fdb', '#421', '#faa', 1, false)
      // 夕日に照らされるエフェクト
      ctx.fillStyle = 'rgba(255,150,50,0.08)'
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = 'rgba(0,0,0,0.7)'
      ctx.fillRect(W * 0.1, H * 0.85, W * 0.8, 40)
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 16px monospace'
      ctx.textAlign = 'center'
      ctx.fillText('「夕焼け...きれいだな。」', W / 2, H * 0.85 + 27)
    } else {
      // シーン3: 全員集合
      drawChar(W * 0.15, H * 0.7, '#222', '#fff', '#ee2', '#fff', 1, false)
      drawChar(W * 0.38, H * 0.72, '#c59', '#fce', '#fce', '#f8b', 1, false)
      drawChar(W * 0.58, H * 0.68, '#eb8', '#fdb', '#421', '#faa', 0, false)
      drawChar(W * 0.78, H * 0.7, '#db8', '#ffc', '#864', '#fe0', 0, true)
      ctx.fillStyle = 'rgba(0,0,0,0.7)'
      ctx.fillRect(W * 0.1, H * 0.85, W * 0.8, 40)
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 16px monospace'
      ctx.textAlign = 'center'
      ctx.fillText('「みんな、ごはんだよ！」', W / 2, H * 0.85 + 27)
    }

    // 番組タイトル（上）
    ctx.fillStyle = 'rgba(0,0,0,0.5)'
    ctx.fillRect(0, 0, W, 28)
    ctx.fillStyle = '#ffcc44'
    ctx.font = 'bold 14px monospace'
    ctx.textAlign = 'left'
    ctx.fillText('木曜ドラマ「たそがれ荘の住人たち」 #8', 15, 18)
    ctx.fillStyle = '#aaa'
    ctx.textAlign = 'right'
    ctx.font = '12px monospace'
    ctx.fillText('JOAK-TV', W - 15, 18)

    // 軽いノイズ
    const id = ctx.getImageData(0, 0, W, H), d = id.data
    for (let i = 0; i < d.length; i += 8) {
      const n = ((Math.random()-0.5)*8)|0
      d[i]+=n; d[i+1]+=n; d[i+2]+=n
    }
    ctx.putImageData(id, 0, 0)
  }

  // CH4: アニメ「まるまるフレンズ」
  private drawAnime(): void {
    const { ctx, W, H } = this
    this.cdf++
    const scene = Math.floor(this.cdf / 240) % 4

    // アニメキャラ描画（丸っこくデフォルメ）
    const drawAnimeChar = (cx: number, cy: number, body: string, light: string, eye: string, accent: string, bounce: number, emote: 'normal' | 'happy' | 'surprise') => {
      const s = 5
      const boff = Math.sin(this.cdf * 0.1 + bounce) * 4
      const bx = cx - 5 * s, by = cy - 10 * s + boff

      // 体（丸っこく）
      ctx.fillStyle = body
      ctx.fillRect(bx + 2*s, by + 5*s, 8*s, 5*s)
      ctx.fillRect(bx + 3*s, by + 4*s, 6*s, 7*s)
      // 頭（大きめ）
      ctx.fillRect(bx + 0*s, by + 0*s, 12*s, 6*s)
      ctx.fillRect(bx + 1*s, by - 1*s, 10*s, 8*s)
      // 耳
      ctx.fillRect(bx + 0*s, by - 2*s, 3*s, 4*s)
      ctx.fillRect(bx + 9*s, by - 2*s, 3*s, 4*s)
      ctx.fillStyle = accent
      ctx.fillRect(bx + 1*s, by - 1*s, 1*s, 2*s)
      ctx.fillRect(bx + 10*s, by - 1*s, 1*s, 2*s)
      // 顔面
      ctx.fillStyle = light
      ctx.fillRect(bx + 2*s, by + 3*s, 8*s, 4*s)
      // 目（大きめアニメ目）
      ctx.fillStyle = '#fff'
      ctx.fillRect(bx + 2*s, by + 2*s, 3*s, 3*s)
      ctx.fillRect(bx + 7*s, by + 2*s, 3*s, 3*s)
      ctx.fillStyle = eye
      ctx.fillRect(bx + 3*s, by + 2*s, 2*s, 2*s)
      ctx.fillRect(bx + 8*s, by + 2*s, 2*s, 2*s)
      // ハイライト
      ctx.fillStyle = '#fff'
      ctx.fillRect(bx + 3*s, by + 2*s, 1*s, 1*s)
      ctx.fillRect(bx + 8*s, by + 2*s, 1*s, 1*s)

      if (emote === 'happy') {
        // にっこり目
        ctx.fillStyle = eye
        ctx.fillRect(bx + 2*s, by + 3*s, 3*s, 1*s)
        ctx.fillRect(bx + 7*s, by + 3*s, 3*s, 1*s)
        // 口
        ctx.fillStyle = '#f88'
        ctx.fillRect(bx + 4*s, by + 5*s, 4*s, 2*s)
        ctx.fillStyle = '#fff'
        ctx.fillRect(bx + 5*s, by + 5*s, 2*s, 1*s)
      } else if (emote === 'surprise') {
        // びっくり目（大きく）
        ctx.fillStyle = '#fff'
        ctx.fillRect(bx + 1*s, by + 1*s, 4*s, 4*s)
        ctx.fillRect(bx + 7*s, by + 1*s, 4*s, 4*s)
        ctx.fillStyle = eye
        ctx.fillRect(bx + 2*s, by + 2*s, 2*s, 2*s)
        ctx.fillRect(bx + 8*s, by + 2*s, 2*s, 2*s)
        // 口
        ctx.fillStyle = '#300'
        ctx.fillRect(bx + 5*s, by + 5*s, 2*s, 2*s)
      } else {
        ctx.fillStyle = body
        ctx.fillRect(bx + 5*s, by + 5*s, 2*s, 1*s)
      }
      // チーク
      ctx.fillStyle = accent
      ctx.globalAlpha = 0.4
      ctx.fillRect(bx + 1*s, by + 4*s, 2*s, 1*s)
      ctx.fillRect(bx + 9*s, by + 4*s, 2*s, 1*s)
      ctx.globalAlpha = 1
      // 足
      ctx.fillStyle = body
      ctx.fillRect(bx + 3*s, by + 10*s, 2*s, 2*s)
      ctx.fillRect(bx + 7*s, by + 10*s, 2*s, 2*s)
    }

    if (scene === 0) {
      // OP風：空背景 + キャラ走ってくる
      ctx.fillStyle = '#88ccff'
      ctx.fillRect(0, 0, W, H * 0.7)
      ctx.fillStyle = '#55aa44'
      ctx.fillRect(0, H * 0.7, W, H * 0.3)
      // 太陽
      ctx.fillStyle = '#ffee44'
      ctx.fillRect(W * 0.8, 30, 40, 40)
      ctx.fillRect(W * 0.8 - 5, 35, 50, 30)
      ctx.fillRect(W * 0.8 + 5, 25, 30, 50)
      // 雲
      ctx.fillStyle = '#fff'
      ctx.fillRect(80 + (this.cdf % 800) * 0.3, 60, 80, 25)
      ctx.fillRect(90 + (this.cdf % 800) * 0.3, 50, 60, 35)
      ctx.fillRect(400 - (this.cdf % 600) * 0.2, 90, 70, 20)
      ctx.fillRect(410 - (this.cdf % 600) * 0.2, 80, 50, 30)
      ctx.fillRect(200 + (this.cdf % 700) * 0.15, 40, 60, 20)
      ctx.fillRect(210 + (this.cdf % 700) * 0.15, 30, 40, 30)
      // 花（草原に）
      for (let i = 0; i < 12; i++) {
        const fx = (i * 55 + 20) % W
        const fy = H * 0.72 + (i % 3) * 15
        ctx.fillStyle = i % 3 === 0 ? '#ff6688' : i % 3 === 1 ? '#ffcc44' : '#aa66ff'
        ctx.fillRect(fx, fy, 8, 8)
        ctx.fillRect(fx - 2, fy + 3, 12, 3)
        ctx.fillStyle = '#44aa44'
        ctx.fillRect(fx + 3, fy + 8, 2, 8)
      }
      // 木（背景）
      ctx.fillStyle = '#6a4422'
      ctx.fillRect(50, H * 0.5, 10, H * 0.2)
      ctx.fillStyle = '#228833'
      ctx.fillRect(30, H * 0.35, 50, 40)
      ctx.fillRect(35, H * 0.3, 40, 50)
      ctx.fillStyle = '#33aa44'
      ctx.fillRect(40, H * 0.35, 30, 25)
      ctx.fillStyle = '#6a4422'
      ctx.fillRect(W - 80, H * 0.48, 10, H * 0.22)
      ctx.fillStyle = '#228833'
      ctx.fillRect(W - 100, H * 0.32, 50, 40)
      ctx.fillRect(W - 95, H * 0.28, 40, 48)
      // 蝶々
      const bfx = W * 0.5 + Math.sin(this.cdf * 0.03) * 80
      const bfy = H * 0.4 + Math.cos(this.cdf * 0.04) * 30
      ctx.fillStyle = '#ffaadd'
      ctx.fillRect(bfx - 6, bfy, 5, 4)
      ctx.fillRect(bfx + 2, bfy, 5, 4)
      ctx.fillStyle = '#ff88bb'
      ctx.fillRect(bfx - 4, bfy + 1, 3, 2)
      ctx.fillRect(bfx + 3, bfy + 1, 3, 2)
      // キャラたち
      const offset = (this.cdf * 2) % (W + 300) - 150
      drawAnimeChar(offset, H * 0.6, '#222', '#fff', '#ee2', '#fff', 0, 'happy')
      drawAnimeChar(offset + 100, H * 0.62, '#c59', '#fce', '#fce', '#f8b', 1, 'happy')
      drawAnimeChar(offset + 200, H * 0.58, '#eb8', '#fdb', '#421', '#faa', 2, 'happy')
      drawAnimeChar(offset + 300, H * 0.6, '#db8', '#ffc', '#864', '#fe0', 3, 'happy')
      // タイトル
      ctx.fillStyle = '#fff'
      ctx.strokeStyle = '#ff5577'
      ctx.lineWidth = 4
      ctx.font = '900 42px "Zen Maru Gothic"'
      ctx.textAlign = 'center'
      ctx.strokeText('まるまるフレンズ', W / 2, 180)
      ctx.fillText('まるまるフレンズ', W / 2, 180)
      // サブタイトル
      ctx.fillStyle = '#ffcc44'
      ctx.strokeStyle = '#aa5500'
      ctx.lineWidth = 2
      ctx.font = '700 16px "Zen Maru Gothic"'
      ctx.strokeText('~ みんなでいっしょ! ~', W / 2, 210)
      ctx.fillText('~ みんなでいっしょ! ~', W / 2, 210)
    } else if (scene === 1) {
      // みんみんっち vs よいしょっち バトル風
      ctx.fillStyle = '#330022'
      ctx.fillRect(0, 0, W, H)
      // 集中線
      for (let i = 0; i < 20; i++) {
        const a = (i / 20) * Math.PI * 2
        ctx.strokeStyle = 'rgba(255,200,100,0.15)'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(W/2, H/2)
        ctx.lineTo(W/2 + Math.cos(a) * 500, H/2 + Math.sin(a) * 500)
        ctx.stroke()
      }
      // バトルステージ（床）
      ctx.fillStyle = '#442233'
      ctx.fillRect(0, H * 0.7, W, H * 0.3)
      ctx.fillStyle = '#553344'
      ctx.fillRect(W * 0.1, H * 0.7, W * 0.8, 3)
      drawAnimeChar(W * 0.25, H * 0.55, '#222', '#fff', '#ee2', '#fff', 0, 'surprise')
      drawAnimeChar(W * 0.7, H * 0.55, '#db8', '#ffc', '#864', '#fe0', 2, 'surprise')
      // エフェクト（稲妻）
      ctx.strokeStyle = '#ffee44'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(W * 0.4, H * 0.2)
      ctx.lineTo(W * 0.45, H * 0.35)
      ctx.lineTo(W * 0.42, H * 0.35)
      ctx.lineTo(W * 0.48, H * 0.5)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(W * 0.6, H * 0.15)
      ctx.lineTo(W * 0.55, H * 0.3)
      ctx.lineTo(W * 0.58, H * 0.3)
      ctx.lineTo(W * 0.52, H * 0.48)
      ctx.stroke()
      // 星エフェクト
      ctx.fillStyle = '#ffee44'
      for (let i = 0; i < 6; i++) {
        const sx = W * 0.3 + Math.sin(this.cdf * 0.1 + i * 2) * 100
        const sy = H * 0.2 + Math.cos(this.cdf * 0.08 + i * 3) * 60
        ctx.fillRect(sx, sy, 4, 4)
        ctx.fillRect(sx - 2, sy + 1, 8, 2)
        ctx.fillRect(sx + 1, sy - 2, 2, 8)
      }
      // VS
      ctx.textAlign = 'center'
      if (this.cdf % 30 < 15) {
        ctx.fillStyle = '#ff3344'
        ctx.strokeStyle = '#ffee44'
        ctx.lineWidth = 3
        ctx.font = '900 56px "Zen Maru Gothic"'
        ctx.strokeText('VS', W / 2, H * 0.45)
        ctx.fillText('VS', W / 2, H * 0.45)
      }
      // 観客シルエット（下部）
      ctx.fillStyle = 'rgba(0,0,0,0.5)'
      for (let i = 0; i < 15; i++) {
        const ox = i * 45 + 10
        ctx.fillRect(ox, H * 0.82, 20, 25)
        ctx.fillRect(ox + 3, H * 0.78, 14, 10)
      }
    } else if (scene === 2) {
      // ぽぽみっち と すんすんっち ほのぼのシーン（カフェ）
      ctx.fillStyle = '#ffeedd'
      ctx.fillRect(0, 0, W, H)
      // カフェの壁
      ctx.fillStyle = '#f5e0c8'
      ctx.fillRect(0, 0, W, H * 0.5)
      // 窓
      ctx.fillStyle = '#aaddff'
      ctx.fillRect(W * 0.1, H * 0.08, W * 0.25, H * 0.3)
      ctx.fillStyle = '#88bbee'
      ctx.fillRect(W * 0.12, H * 0.1, W * 0.21, H * 0.26)
      ctx.fillStyle = '#f5e0c8'
      ctx.fillRect(W * 0.22, H * 0.08, 4, H * 0.3)
      ctx.fillRect(W * 0.1, H * 0.22, W * 0.25, 4)
      // 花（窓の外に見える+室内の花瓶）
      for (let i = 0; i < 8; i++) {
        const fx = (i * 90 + this.cdf * 0.5) % (W + 40) - 20
        const fy = 50 + Math.sin(i * 2 + this.cdf * 0.02) * 30
        ctx.fillStyle = '#ffaacc'
        ctx.fillRect(fx, fy, 12, 12)
        ctx.fillRect(fx - 4, fy + 4, 20, 4)
        ctx.fillStyle = '#ffcc44'
        ctx.fillRect(fx + 4, fy + 4, 4, 4)
      }
      // 床（木目）
      ctx.fillStyle = '#c8a878'
      ctx.fillRect(0, H * 0.5, W, H * 0.5)
      ctx.fillStyle = '#b89868'
      for (let i = 0; i < 5; i++) ctx.fillRect(0, H * 0.5 + i * 22, W, 1)
      // テーブル
      ctx.fillStyle = '#aa7744'
      ctx.fillRect(W * 0.3, H * 0.52, W * 0.35, H * 0.06)
      ctx.fillStyle = '#bb8855'
      ctx.fillRect(W * 0.3, H * 0.52, W * 0.35, 3)
      // テーブル脚
      ctx.fillStyle = '#996633'
      ctx.fillRect(W * 0.35, H * 0.58, 6, H * 0.15)
      ctx.fillRect(W * 0.58, H * 0.58, 6, H * 0.15)
      // ケーキ
      ctx.fillStyle = '#f8e8c8'
      ctx.fillRect(W * 0.38, H * 0.47, 22, 18)
      ctx.fillStyle = '#fff'
      ctx.fillRect(W * 0.38, H * 0.47, 22, 6)
      ctx.fillStyle = '#ff6666'
      ctx.fillRect(W * 0.39 + 8, H * 0.44, 6, 6)
      // コーヒーカップ x2
      ctx.fillStyle = '#eee'
      ctx.fillRect(W * 0.46, H * 0.48, 14, 12)
      ctx.fillStyle = '#8a5533'
      ctx.fillRect(W * 0.47, H * 0.49, 12, 8)
      ctx.fillStyle = '#ddd'
      ctx.fillRect(W * 0.54, H * 0.48, 14, 12)
      ctx.fillStyle = '#8a5533'
      ctx.fillRect(W * 0.55, H * 0.49, 12, 8)
      // 花瓶（テーブル上）
      ctx.fillStyle = '#88aacc'
      ctx.fillRect(W * 0.33, H * 0.46, 10, 16)
      ctx.fillStyle = '#ff88aa'
      ctx.fillRect(W * 0.32, H * 0.4, 6, 8)
      ctx.fillRect(W * 0.37, H * 0.39, 6, 8)
      ctx.fillStyle = '#44aa44'
      ctx.fillRect(W * 0.36, H * 0.43, 2, 8)
      // 壁の絵
      ctx.fillStyle = '#8a6a44'
      ctx.fillRect(W * 0.6, H * 0.08, 50, 40)
      ctx.fillStyle = '#ddeeff'
      ctx.fillRect(W * 0.6 + 4, H * 0.08 + 4, 42, 32)
      ctx.fillStyle = '#88bbaa'
      ctx.fillRect(W * 0.6 + 8, H * 0.08 + 16, 34, 20)

      drawAnimeChar(W * 0.35, H * 0.6, '#c59', '#fce', '#fce', '#f8b', 1, 'happy')
      drawAnimeChar(W * 0.6, H * 0.62, '#eb8', '#fdb', '#421', '#faa', 0, 'happy')
      // ハートエフェクト
      ctx.fillStyle = '#ff6699'
      ctx.font = '24px "Zen Maru Gothic"'
      ctx.textAlign = 'center'
      ctx.fillText('\u2665', W * 0.48, H * 0.35 + Math.sin(this.cdf * 0.05) * 8)
      ctx.fillText('\u2665', W * 0.42, H * 0.3 + Math.cos(this.cdf * 0.04) * 6)
      ctx.font = '14px "Zen Maru Gothic"'
      ctx.fillText('\u2665', W * 0.52, H * 0.32 + Math.sin(this.cdf * 0.06) * 5)
      ctx.fillText('\u2665', W * 0.55, H * 0.37 + Math.cos(this.cdf * 0.07) * 7)
    } else {
      // エンドカード（部屋の中、全員集合）
      ctx.fillStyle = '#ffe8cc'
      ctx.fillRect(0, 0, W, H)
      // 壁
      ctx.fillStyle = '#f5ddb8'
      ctx.fillRect(0, 0, W, H * 0.5)
      // 窓（夕焼け）
      ctx.fillStyle = '#ffaa66'
      ctx.fillRect(W * 0.35, H * 0.05, W * 0.3, H * 0.3)
      ctx.fillStyle = '#ffcc88'
      ctx.fillRect(W * 0.37, H * 0.07, W * 0.26, H * 0.26)
      ctx.fillStyle = '#f5ddb8'
      ctx.fillRect(W * 0.49, H * 0.05, 4, H * 0.3)
      ctx.fillRect(W * 0.35, H * 0.18, W * 0.3, 4)
      // ソファ
      ctx.fillStyle = '#cc8855'
      ctx.fillRect(W * 0.15, H * 0.5, W * 0.7, H * 0.12)
      ctx.fillStyle = '#dd9966'
      ctx.fillRect(W * 0.15, H * 0.5, W * 0.7, 6)
      ctx.fillStyle = '#bb7744'
      ctx.fillRect(W * 0.12, H * 0.45, W * 0.08, H * 0.2)
      ctx.fillRect(W * 0.8, H * 0.45, W * 0.08, H * 0.2)
      // クッション
      ctx.fillStyle = '#ee8866'
      ctx.fillRect(W * 0.2, H * 0.48, 30, 22)
      ctx.fillStyle = '#88bbcc'
      ctx.fillRect(W * 0.72, H * 0.48, 30, 22)
      // テーブル
      ctx.fillStyle = '#aa7744'
      ctx.fillRect(W * 0.3, H * 0.7, W * 0.4, 10)
      // おやつ
      ctx.fillStyle = '#ffcc88'
      ctx.fillRect(W * 0.42, H * 0.66, 20, 12)
      ctx.fillStyle = '#ff8866'
      ctx.fillRect(W * 0.52, H * 0.67, 16, 10)
      // ジュース
      ctx.fillStyle = '#ffaa33'
      ctx.fillRect(W * 0.46, H * 0.63, 8, 12)
      ctx.fillStyle = 'rgba(255,255,255,0.3)'
      ctx.fillRect(W * 0.47, H * 0.64, 3, 4)

      drawAnimeChar(W * 0.2, H * 0.55, '#222', '#fff', '#ee2', '#fff', 0, 'happy')
      drawAnimeChar(W * 0.4, H * 0.53, '#c59', '#fce', '#fce', '#f8b', 1, 'happy')
      drawAnimeChar(W * 0.6, H * 0.55, '#eb8', '#fdb', '#421', '#faa', 2, 'normal')
      drawAnimeChar(W * 0.8, H * 0.53, '#db8', '#ffc', '#864', '#fe0', 3, 'happy')
      ctx.fillStyle = '#ff5566'
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2
      ctx.font = '900 28px "Zen Maru Gothic"'
      ctx.textAlign = 'center'
      ctx.strokeText('つづく', W / 2, H * 0.9)
      ctx.fillText('つづく', W / 2, H * 0.9)
    }

    // 局ロゴ
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.font = '700 11px "Zen Maru Gothic"'
    ctx.textAlign = 'right'
    ctx.fillText('JOAK-TV', W - 10, H - 10)

    // 軽いノイズ
    const id = ctx.getImageData(0, 0, W, H), d = id.data
    for (let i = 0; i < d.length; i += 12) {
      const n = ((Math.random()-0.5)*6)|0
      d[i]+=n; d[i+1]+=n; d[i+2]+=n
    }
    ctx.putImageData(id, 0, 0)
  }
}
