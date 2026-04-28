// TVController本体: チャンネル切替、電源、CRT効果
import type { ChannelContext } from './types'
import { StaticChannel, BarsChannel } from './static'
import { BreakoutChannel, type BreakoutAction } from './breakout'
import { DramaChannel } from './drama'
import { TetrisChannel, type TetrisAction } from './tetris'

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
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private gameFrame: HTMLIFrameElement
  private chKnob: HTMLElement
  private chDisp: HTMLElement
  private led: HTMLElement
  private ovOff: HTMLElement

  ch = 0
  tvOn = true
  switching = false
  private swTimer = 0
  private frame = 0
  private gameLoaded = false
  private chRot = 0

  private readonly W = 640
  private readonly H = 480
  private readonly SW_DUR = 15
  private readonly TOTAL_CH = 6
  readonly GAME_CH = 5
  private readonly ROT_PER = 360 / 6

  // チャンネル
  private staticCh: StaticChannel
  private barsCh: BarsChannel
  private breakoutCh: BreakoutChannel
  private dramaCh: DramaChannel
  private tetrisCh: TetrisChannel

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

    const cc: ChannelContext = { ctx: this.ctx, W: this.W, H: this.H }
    this.staticCh = new StaticChannel(cc)
    this.barsCh = new BarsChannel(cc)
    this.breakoutCh = new BreakoutChannel(cc)
    this.dramaCh = new DramaChannel(cc)
    this.tetrisCh = new TetrisChannel(cc)

    this.chKnob.addEventListener('click', (e: MouseEvent) => {
      e.stopPropagation()
      const r = this.chKnob.getBoundingClientRect()
      this.switchCh((e.clientX - r.left - r.width / 2) > 0 ? 1 : -1)
    })
    this.chKnob.addEventListener('wheel', (e: WheelEvent) => {
      e.preventDefault()
      this.switchCh(e.deltaY > 0 ? 1 : -1)
    }, { passive: false })
    // 数字（1-6）をクリックしたらそのチャンネルに直接ジャンプ
    const dial = this.chKnob.parentElement
    if (dial) {
      dial.querySelectorAll<HTMLElement>('.ch-num').forEach((el) => {
        el.style.cursor = 'pointer'
        el.addEventListener('click', (e) => {
          e.stopPropagation()
          const target = parseInt(el.dataset.ch || '0', 10)
          this.jumpCh(target)
        })
      })
    }
    const btnPwr = els ? els.btnPwr : document.getElementById('btn-pwr')!
    btnPwr.addEventListener('click', () => this.togglePwr())
  }

  /** 指定チャンネルへ直接ジャンプ */
  jumpCh(target: number): void {
    if (!this.tvOn || this.switching) return
    if (target < 0 || target >= this.TOTAL_CH) return
    if (target === this.ch) return
    if (this.ch === this.GAME_CH) this.hideGame()
    this.ch = target
    this.chRot = this.ch * this.ROT_PER
    this.chKnob.style.transform = 'rotate(' + this.chRot + 'deg)'
    this.chDisp.textContent = 'CH ' + (this.ch + 1)
    this.switching = true
    this.swTimer = 0
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
      this.staticCh.drawStatic(0.7 + Math.random() * 0.3)
      this.swTimer++
      if (this.swTimer >= this.SW_DUR) {
        this.switching = false
        this.swTimer = 0
        if (this.ch === this.GAME_CH) this.showGame()
      }
    } else {
      this.renderChannel(this.ch)
      if (this.frame % 2 === 0) this.applyCRT()
    }
  }

  private renderChannel(ch: number): void {
    switch (ch) {
      case 0: this.staticCh.drawStatic(); break
      case 1: this.barsCh.draw(); break
      case 2: this.breakoutCh.draw(); break
      case 3: this.dramaCh.draw(); break
      case 4: this.tetrisCh.draw(); break
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

  // ===== ゲーム入力（外部から呼ぶ） =====
  breakoutKey(action: BreakoutAction): void {
    this.breakoutCh.key(action)
  }

  breakoutSpeedChange(dir: 1 | -1): void {
    this.breakoutCh.speedChange(dir)
  }

  tetrisKey(action: TetrisAction): void {
    this.tetrisCh.key(action)
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
}
