// CH4: ドラマ「たそがれ荘の住人たち」
import type { ChannelContext } from './types'

interface Line { who?: string; text: string }
interface Scene {
  chapter: string
  bg: 'living-evening' | 'kitchen-night' | 'engawa-dusk' | 'flashback'
  lines: Line[]
}

const SCENES: Scene[] = [
  {
    chapter: '第一章 帰り道',
    bg: 'living-evening',
    lines: [
      { who: 'みんみん', text: '...ここにいたのか。' },
      { who: 'ぽぽみ', text: 'うん。少しだけ、考えごと。' },
      { who: 'みんみん', text: 'お茶、淹れたよ。冷めないうちに。' },
    ],
  },
  {
    chapter: '第二章 ひとりの時間',
    bg: 'engawa-dusk',
    lines: [
      { who: 'すんすん', text: '夕焼け...きれいだな。' },
      { who: 'すんすん', text: 'こういう時間、好きなんだ。' },
      { who: 'すんすん', text: '...誰にも、言ったことないけどね。' },
    ],
  },
  {
    chapter: '第三章 台所にて',
    bg: 'kitchen-night',
    lines: [
      { who: 'ぽぽみ', text: '今日は...おでんにしようかな。' },
      { who: 'ぽぽみ', text: '昔、おばあちゃんが作ってくれたみたいに。' },
      { who: 'ぽぽみ', text: 'わたしも、頑張る。' },
    ],
  },
  {
    chapter: '第四章 思い出',
    bg: 'flashback',
    lines: [
      { who: '???', text: 'いつかまた、ここで会おうね。' },
      { who: '???', text: '夕日が沈んだら、また...' },
      { text: '― そんな約束、覚えてる？' },
    ],
  },
  {
    chapter: '第五章 食卓',
    bg: 'living-evening',
    lines: [
      { who: 'よいしょ', text: 'みんな、ごはんだよ！' },
      { who: 'みんみん', text: '今日は豪華だね。' },
      { who: 'すんすん', text: 'いただきます。' },
      { who: 'ぽぽみ', text: '...おいしい？' },
    ],
  },
]

const FRAMES_PER_LINE = 180  // 1セリフ3秒
const FRAMES_PER_SCENE = SCENES.reduce((acc) => acc, 0)

export class DramaChannel {
  private vt = 0
  private totalFrames = SCENES.reduce((sum, s) => sum + s.lines.length * FRAMES_PER_LINE, 0)

  constructor(private cc: ChannelContext) {
    void FRAMES_PER_SCENE
  }

  draw(): void {
    const { ctx, W, H } = this.cc
    this.vt++

    // 現在のシーンとセリフ
    const t = this.vt % this.totalFrames
    let scIdx = 0, lineIdx = 0
    {
      let acc = 0
      for (let i = 0; i < SCENES.length; i++) {
        const len = SCENES[i].lines.length * FRAMES_PER_LINE
        if (t < acc + len) {
          scIdx = i
          lineIdx = Math.floor((t - acc) / FRAMES_PER_LINE)
          break
        }
        acc += len
      }
    }
    const sc = SCENES[scIdx]
    const line = sc.lines[lineIdx]

    // シーン別背景
    if (sc.bg === 'living-evening') this.drawLivingRoom(ctx, W, H, 'evening')
    else if (sc.bg === 'kitchen-night') this.drawKitchen(ctx, W, H)
    else if (sc.bg === 'engawa-dusk') this.drawEngawa(ctx, W, H)
    else if (sc.bg === 'flashback') this.drawFlashback(ctx, W, H)

    // キャラ配置
    if (sc.bg === 'living-evening') {
      if (scIdx === 0) {
        // みんみん × ぽぽみ
        this.drawChar(W * 0.3, H * 0.7, '#222', '#fff', '#ee2', '#fff', 1, line?.who === 'みんみん')
        this.drawChar(W * 0.6, H * 0.72, '#c59', '#fce', '#fce', '#f8b', 0, line?.who === 'ぽぽみ')
      } else {
        // 全員集合
        this.drawChar(W * 0.18, H * 0.7, '#222', '#fff', '#ee2', '#fff', 1, line?.who === 'みんみん')
        this.drawChar(W * 0.38, H * 0.72, '#c59', '#fce', '#fce', '#f8b', 1, line?.who === 'ぽぽみ')
        this.drawChar(W * 0.58, H * 0.68, '#eb8', '#fdb', '#421', '#faa', 0, line?.who === 'すんすん')
        this.drawChar(W * 0.78, H * 0.7, '#db8', '#ffc', '#864', '#fe0', 0, line?.who === 'よいしょ')
      }
    } else if (sc.bg === 'engawa-dusk') {
      this.drawChar(W * 0.5, H * 0.65, '#eb8', '#fdb', '#421', '#faa', 0, line?.who === 'すんすん')
    } else if (sc.bg === 'kitchen-night') {
      this.drawChar(W * 0.45, H * 0.62, '#c59', '#fce', '#fce', '#f8b', 0, line?.who === 'ぽぽみ')
    } else if (sc.bg === 'flashback') {
      // モノクロシルエットで2人並ぶ
      ctx.globalAlpha = 0.6
      this.drawChar(W * 0.4, H * 0.7, '#888', '#bbb', '#666', '#aaa', 0, false)
      this.drawChar(W * 0.6, H * 0.7, '#888', '#bbb', '#666', '#aaa', 1, false)
      ctx.globalAlpha = 1
    }

    // 字幕
    if (line) {
      ctx.fillStyle = 'rgba(0,0,0,0.78)'
      ctx.fillRect(W * 0.08, H * 0.84, W * 0.84, 50)
      ctx.fillStyle = '#ffdd88'
      ctx.font = 'bold 12px monospace'
      ctx.textAlign = 'left'
      if (line.who) {
        ctx.fillText(line.who, W * 0.08 + 12, H * 0.84 + 16)
      }
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 16px monospace'
      ctx.textAlign = 'center'
      ctx.fillText('「' + line.text + '」', W / 2, H * 0.84 + 36)
    }

    // 番組タイトル + 章タイトル
    ctx.fillStyle = 'rgba(0,0,0,0.55)'
    ctx.fillRect(0, 0, W, 28)
    ctx.fillStyle = '#ffcc44'
    ctx.font = 'bold 13px monospace'
    ctx.textAlign = 'left'
    ctx.fillText('木曜ドラマ「たそがれ荘の住人たち」#8', 14, 18)
    ctx.fillStyle = '#aaa'
    ctx.textAlign = 'right'
    ctx.font = '11px monospace'
    ctx.fillText('JOAK-TV  ON AIR', W - 14, 18)

    // 章タイトル（左下、控えめに）
    ctx.fillStyle = 'rgba(0,0,0,0.5)'
    ctx.fillRect(0, H * 0.78, 180, 18)
    ctx.fillStyle = '#ffdd88'
    ctx.font = '11px monospace'
    ctx.textAlign = 'left'
    ctx.fillText('▶ ' + sc.chapter, 10, H * 0.78 + 13)

    // 進行バー（番組の進行）
    const progress = t / this.totalFrames
    ctx.fillStyle = 'rgba(0,0,0,0.4)'
    ctx.fillRect(0, H - 4, W, 4)
    ctx.fillStyle = '#cc3333'
    ctx.fillRect(0, H - 4, W * progress, 4)

    // ノイズ
    const id = ctx.getImageData(0, 0, W, H), d = id.data
    for (let i = 0; i < d.length; i += 8) {
      const n = ((Math.random()-0.5)*7)|0
      d[i]+=n; d[i+1]+=n; d[i+2]+=n
    }
    ctx.putImageData(id, 0, 0)
  }

  // ===== 背景: リビング（夕方）=====
  private drawLivingRoom(ctx: CanvasRenderingContext2D, W: number, H: number, _t: 'evening'): void {
    // 壁
    ctx.fillStyle = '#6a5a40'
    ctx.fillRect(0, 0, W, H * 0.55)
    // 床
    ctx.fillStyle = '#4a3a22'
    ctx.fillRect(0, H * 0.55, W, H * 0.45)
    ctx.fillStyle = '#544a2a'
    for (let i = 0; i < 8; i++) ctx.fillRect(0, H * 0.55 + i * 25, W, 1)

    // 窓（夕焼け）
    const winX = W * 0.6, winY = H * 0.08, winW = W * 0.28, winH = H * 0.32
    ctx.fillStyle = '#cc6633'
    ctx.fillRect(winX, winY, winW, winH)
    ctx.fillStyle = '#ee8844'
    ctx.fillRect(winX + 4, winY + 4, winW - 8, winH - 8)
    ctx.fillStyle = '#ffaa55'
    ctx.fillRect(winX + 12, winY + 14, winW - 24, winH * 0.4)
    // 太陽
    ctx.fillStyle = '#ffdd66'
    ctx.fillRect(winX + winW - 30, winY + winH * 0.6, 18, 18)
    // 窓枠
    ctx.fillStyle = '#5a4a30'
    ctx.fillRect(winX, winY + winH / 2 - 2, winW, 4)
    ctx.fillRect(winX + winW / 2 - 2, winY, 4, winH)
    // カーテン
    ctx.fillStyle = '#8a6644'
    ctx.fillRect(winX - 14, winY - 4, 14, winH + 8)
    ctx.fillRect(winX + winW, winY - 4, 14, winH + 8)
    ctx.fillStyle = '#9a7654'
    ctx.fillRect(winX - 14, winY - 4, 14, 8)
    ctx.fillRect(winX + winW, winY - 4, 14, 8)

    // 壁掛け時計
    const clkX = W * 0.15, clkY = H * 0.08, clkS = 38
    ctx.fillStyle = '#5a3a20'
    ctx.fillRect(clkX, clkY, clkS, clkS)
    ctx.fillStyle = '#f0ead8'
    ctx.fillRect(clkX + 4, clkY + 4, clkS - 8, clkS - 8)
    const clkCx = clkX + clkS / 2, clkCy = clkY + clkS / 2
    // 時刻マーカー（4方向）
    ctx.fillStyle = '#444'
    ctx.fillRect(clkCx - 1, clkY + 5, 2, 2)
    ctx.fillRect(clkCx - 1, clkY + clkS - 7, 2, 2)
    ctx.fillRect(clkX + 5, clkCy - 1, 2, 2)
    ctx.fillRect(clkX + clkS - 7, clkCy - 1, 2, 2)
    // 針（針が動く）
    const minAngle = (this.vt * 0.02) % (Math.PI * 2)
    const hourAngle = (this.vt * 0.0017) % (Math.PI * 2)
    ctx.strokeStyle = '#222'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(clkCx, clkCy)
    ctx.lineTo(clkCx + Math.sin(minAngle) * 11, clkCy - Math.cos(minAngle) * 11)
    ctx.stroke()
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(clkCx, clkCy)
    ctx.lineTo(clkCx + Math.sin(hourAngle) * 7, clkCy - Math.cos(hourAngle) * 7)
    ctx.stroke()
    ctx.fillStyle = '#222'
    ctx.fillRect(clkCx - 1, clkCy - 1, 3, 3)

    // 額縁
    ctx.fillStyle = '#6a5030'
    ctx.fillRect(W * 0.32, H * 0.1, 50, 38)
    ctx.fillStyle = '#aaddee'
    ctx.fillRect(W * 0.32 + 4, H * 0.1 + 4, 42, 30)
    ctx.fillStyle = '#88bbcc'
    ctx.fillRect(W * 0.32 + 8, H * 0.1 + 18, 34, 16)
    // 山シルエット
    ctx.fillStyle = '#7a9a8a'
    ctx.beginPath()
    ctx.moveTo(W * 0.32 + 8, H * 0.1 + 30)
    ctx.lineTo(W * 0.32 + 18, H * 0.1 + 22)
    ctx.lineTo(W * 0.32 + 28, H * 0.1 + 26)
    ctx.lineTo(W * 0.32 + 38, H * 0.1 + 20)
    ctx.lineTo(W * 0.32 + 42, H * 0.1 + 30)
    ctx.closePath()
    ctx.fill()

    // ちゃぶ台
    const tblX = W * 0.35, tblY = H * 0.6, tblW = W * 0.3, tblH = 10
    ctx.fillStyle = '#7a5a30'
    ctx.fillRect(tblX, tblY, tblW, tblH)
    ctx.fillStyle = '#8a6a38'
    ctx.fillRect(tblX, tblY, tblW, 3)
    ctx.fillStyle = '#6a4a20'
    ctx.fillRect(tblX, tblY + tblH - 2, tblW, 2)
    ctx.fillRect(tblX + 8, tblY + tblH, 5, 14)
    ctx.fillRect(tblX + tblW - 13, tblY + tblH, 5, 14)

    // 湯呑み
    ctx.fillStyle = '#eee'
    ctx.fillRect(tblX + 30, tblY - 12, 11, 12)
    ctx.fillStyle = '#bbd'
    ctx.fillRect(tblX + 30, tblY - 12, 11, 4)
    ctx.fillStyle = '#5a3a1a'
    ctx.fillRect(tblX + 32, tblY - 9, 7, 4)
    // 急須
    ctx.fillStyle = '#664422'
    ctx.fillRect(tblX + 78, tblY - 13, 16, 13)
    ctx.fillStyle = '#775533'
    ctx.fillRect(tblX + 78, tblY - 13, 16, 4)
    ctx.fillRect(tblX + 74, tblY - 9, 4, 6)
    ctx.fillRect(tblX + 86, tblY - 16, 4, 4)
    // 湯気（アニメ）
    ctx.fillStyle = 'rgba(255,255,255,0.2)'
    const stm = Math.sin(this.vt * 0.05) * 2
    ctx.fillRect(tblX + 35 + stm, tblY - 18, 1, 4)
    ctx.fillRect(tblX + 38 - stm, tblY - 16, 1, 3)
    ctx.fillRect(tblX + 84 + stm, tblY - 19, 1, 4)
    ctx.fillRect(tblX + 88 - stm, tblY - 17, 1, 3)

    // フロアランプ（笠→棒→台座を縦に揃える）
    const lampCx = W * 0.05 + 4
    const shadeY = H * 0.28
    const shadeH = 18
    // 笠
    ctx.fillStyle = '#e8d0a0'
    ctx.fillRect(lampCx - 12, shadeY, 24, shadeH)
    ctx.fillStyle = '#d4c088'
    ctx.fillRect(lampCx - 12, shadeY + shadeH - 4, 24, 4)
    // 棒（笠の下端から床近くまで）
    const poleTop = shadeY + shadeH
    const poleBottom = H * 0.55
    ctx.fillStyle = '#555'
    ctx.fillRect(lampCx - 2, poleTop, 4, poleBottom - poleTop)
    // 台座
    ctx.fillStyle = '#444'
    ctx.fillRect(lampCx - 8, poleBottom - 3, 16, 4)
    // 光
    ctx.fillStyle = 'rgba(255,220,150,0.08)'
    ctx.fillRect(0, H * 0.2, W * 0.2, H * 0.4)

    // 本棚（修正：本のサイズと棚段の整合性を取る）
    this.drawBookshelf(ctx, W * 0.91, H * 0.06, W * 0.085, H * 0.5)

    // 座布団
    ctx.fillStyle = '#8a3a4a'
    ctx.fillRect(W * 0.22, H * 0.74, 32, 18)
    ctx.fillStyle = '#9a4a5a'
    ctx.fillRect(W * 0.23, H * 0.75, 30, 8)
    ctx.fillStyle = '#8a3a4a'
    ctx.fillRect(W * 0.6, H * 0.76, 32, 18)
    ctx.fillStyle = '#9a4a5a'
    ctx.fillRect(W * 0.61, H * 0.77, 30, 8)
  }

  // ===== 背景: 台所（夜）=====
  private drawKitchen(ctx: CanvasRenderingContext2D, W: number, H: number): void {
    // 壁（暖色のタイル）
    ctx.fillStyle = '#e8dcc4'
    ctx.fillRect(0, 0, W, H * 0.55)
    // タイルの目地
    ctx.fillStyle = '#c8b894'
    for (let y = 0; y < H * 0.55; y += 18) ctx.fillRect(0, y, W, 1)
    for (let x = 0; x < W; x += 28) ctx.fillRect(x, 0, 1, H * 0.55)
    // 床（板張り）
    ctx.fillStyle = '#6a4a30'
    ctx.fillRect(0, H * 0.55, W, H * 0.45)
    ctx.fillStyle = '#5a3a20'
    for (let i = 0; i < 6; i++) ctx.fillRect(0, H * 0.55 + i * 20, W, 1)

    // 窓（夜空）
    const winX = W * 0.7, winY = H * 0.08, winW = W * 0.22, winH = H * 0.26
    ctx.fillStyle = '#1a1a3a'
    ctx.fillRect(winX, winY, winW, winH)
    ctx.fillStyle = '#0a0a1a'
    ctx.fillRect(winX + 4, winY + 4, winW - 8, winH - 8)
    // 月
    ctx.fillStyle = '#fff'
    ctx.fillRect(winX + winW * 0.6, winY + winH * 0.2, 14, 14)
    ctx.fillStyle = '#0a0a1a'
    ctx.fillRect(winX + winW * 0.6 + 3, winY + winH * 0.2, 12, 12)
    // 星
    ctx.fillStyle = '#fff'
    ctx.fillRect(winX + winW * 0.2, winY + winH * 0.3, 1, 1)
    ctx.fillRect(winX + winW * 0.4, winY + winH * 0.6, 1, 1)
    ctx.fillRect(winX + winW * 0.85, winY + winH * 0.7, 1, 1)
    // 窓枠
    ctx.fillStyle = '#5a3a20'
    ctx.fillRect(winX, winY, winW, 3)
    ctx.fillRect(winX, winY + winH - 3, winW, 3)
    ctx.fillRect(winX, winY, 3, winH)
    ctx.fillRect(winX + winW - 3, winY, 3, winH)
    ctx.fillRect(winX, winY + winH / 2 - 1, winW, 2)

    // 吊り棚（壁の上部、横長）
    const upX = W * 0.08, upY = H * 0.1, upW = W * 0.55, upH = 36
    ctx.fillStyle = '#7a5a30'
    ctx.fillRect(upX, upY, upW, upH)
    ctx.fillStyle = '#8a6a38'
    ctx.fillRect(upX, upY, upW, 3)
    ctx.fillStyle = '#5a3a18'
    ctx.fillRect(upX, upY + upH - 3, upW, 3)
    // 棚の中の食器（瓶やマグ）
    const dishes = [
      { c: '#fff', sub: '#ddd', top: '#bbb' },          // 白い瓶
      { c: '#ffaaaa', sub: '#ee8888', top: '#cc6666' }, // ピンクマグ
      { c: '#aaccff', sub: '#88aaee', top: '#6688cc' }, // 青マグ
      { c: '#88dd88', sub: '#66bb66', top: '#449944' }, // 緑瓶
      { c: '#ffdd66', sub: '#ddbb44', top: '#bb9922' }, // 黄瓶
      { c: '#ddaaff', sub: '#bb88dd', top: '#9966bb' }, // 紫マグ
    ]
    const dishW = 16
    const dishGap = (upW - dishes.length * dishW) / (dishes.length + 1)
    for (let i = 0; i < dishes.length; i++) {
      const dx = upX + dishGap + i * (dishW + dishGap)
      const dy = upY + 7
      ctx.fillStyle = dishes[i].c
      ctx.fillRect(dx, dy, dishW, 22)
      ctx.fillStyle = dishes[i].sub
      ctx.fillRect(dx + dishW - 3, dy, 3, 22)
      ctx.fillStyle = dishes[i].top
      ctx.fillRect(dx, dy, dishW, 3)
    }

    // === カウンター（床から立ち上がる調理台）===
    const counterY = H * 0.55 - 2  // 床のすぐ上
    const counterH = 4
    const cabY = counterY + counterH
    const cabH = H - cabY  // 床まで
    // カウンタートップ（天板）
    ctx.fillStyle = '#aa9988'
    ctx.fillRect(0, counterY, W, counterH)
    ctx.fillStyle = '#cc9988'
    ctx.fillRect(0, counterY, W, 2)
    // キャビネット（下の収納）
    ctx.fillStyle = '#cc9966'
    ctx.fillRect(0, cabY, W, cabH)
    ctx.fillStyle = '#aa7744'
    ctx.fillRect(0, cabY, W, 2)
    // キャビネットの扉
    const doorW = 60
    for (let i = 0; i < Math.floor(W / doorW); i++) {
      const dx = i * doorW
      ctx.fillStyle = '#bb8855'
      ctx.fillRect(dx + 4, cabY + 6, doorW - 8, cabH - 12)
      ctx.fillStyle = '#aa7744'
      ctx.fillRect(dx + 4, cabY + 6, doorW - 8, 1)
      ctx.fillRect(dx + 4, cabY + cabH - 7, doorW - 8, 1)
      // 取っ手
      ctx.fillStyle = '#5a3a1a'
      ctx.fillRect(dx + doorW - 12, cabY + cabH * 0.45, 4, 6)
    }

    // === カウンターの上にコンロ ===
    const stW = 72, stH = 12
    const stX = W * 0.08
    const stY = counterY - stH
    ctx.fillStyle = '#222'
    ctx.fillRect(stX, stY, stW, stH)
    ctx.fillStyle = '#333'
    ctx.fillRect(stX + 2, stY + 2, stW - 4, stH - 4)
    // バーナー2つ
    for (const bx of [stX + 10, stX + stW - 26]) {
      ctx.fillStyle = '#111'
      ctx.fillRect(bx, stY + 2, 16, 8)
      ctx.fillStyle = '#3a8aff'
      ctx.fillRect(bx + 2, stY + 4, 12, 4)
      ctx.fillStyle = '#88bbff'
      ctx.fillRect(bx + 4, stY + 5, 8, 2)
    }
    // 鍋（コンロの上、カウンターより上）
    const potX = stX + 14, potY = stY - 14
    ctx.fillStyle = '#555'
    ctx.fillRect(potX, potY, 28, 14)
    ctx.fillStyle = '#777'
    ctx.fillRect(potX, potY, 28, 3)
    // 鍋の取っ手
    ctx.fillStyle = '#444'
    ctx.fillRect(potX - 4, potY + 5, 4, 3)
    ctx.fillRect(potX + 28, potY + 5, 4, 3)
    // 蓋のつまみ
    ctx.fillStyle = '#888'
    ctx.fillRect(potX + 12, potY - 3, 4, 4)
    // 湯気（アニメ）
    ctx.fillStyle = 'rgba(255,255,255,0.3)'
    const sm = Math.sin(this.vt * 0.05) * 2
    ctx.fillRect(potX + 6 + sm, potY - 12, 2, 6)
    ctx.fillRect(potX + 12 - sm, potY - 16, 2, 7)
    ctx.fillRect(potX + 20 + sm, potY - 10, 2, 5)

    // === カウンターの上にシンク（埋め込み）===
    const skX = W * 0.4, skW = 110, skH = 18
    const skY = counterY - 1  // カウンタートップに埋め込み
    ctx.fillStyle = '#222'
    ctx.fillRect(skX, skY - 1, skW, 2)  // 縁
    ctx.fillStyle = '#888'
    ctx.fillRect(skX + 3, skY, skW - 6, skH)
    ctx.fillStyle = '#aaa'
    ctx.fillRect(skX + 6, skY + 2, skW - 12, skH - 5)
    ctx.fillStyle = '#666'
    ctx.fillRect(skX + 6, skY + skH - 3, skW - 12, 2)
    // 排水口
    ctx.fillStyle = '#222'
    ctx.fillRect(skX + skW / 2 - 3, skY + 6, 6, 4)
    // 蛇口
    const fctX = skX + skW * 0.25
    ctx.fillStyle = '#aaa'
    ctx.fillRect(fctX, stY + 4, 4, 16)  // 縦パイプ
    ctx.fillRect(fctX, stY + 4, 14, 4)  // 横パイプ
    ctx.fillStyle = '#888'
    ctx.fillRect(fctX + 12, stY + 8, 3, 6)  // 出水口
    // ハンドル
    ctx.fillStyle = '#cc4444'
    ctx.fillRect(fctX - 6, stY + 2, 5, 5)
    ctx.fillStyle = '#4488cc'
    ctx.fillRect(fctX + 5, stY + 2, 5, 5)
    // 食器（シンク横）
    ctx.fillStyle = '#fff'
    ctx.fillRect(skX + skW + 6, counterY - 8, 18, 8)
    ctx.fillStyle = '#ddd'
    ctx.fillRect(skX + skW + 6, counterY - 8, 18, 2)

    // === 右側に冷蔵庫 ===
    const fgX = W * 0.86, fgY = H * 0.4, fgW = W * 0.13, fgH = H * 0.55
    ctx.fillStyle = '#ddd'
    ctx.fillRect(fgX, fgY, fgW, fgH)
    ctx.fillStyle = '#eee'
    ctx.fillRect(fgX, fgY, fgW, 4)
    ctx.fillStyle = '#bbb'
    ctx.fillRect(fgX + fgW - 4, fgY, 4, fgH)
    // 上下分割線（冷凍/冷蔵）
    ctx.fillStyle = '#aaa'
    ctx.fillRect(fgX, fgY + fgH * 0.3, fgW, 2)
    // 取っ手
    ctx.fillStyle = '#555'
    ctx.fillRect(fgX + fgW - 8, fgY + 12, 3, 12)
    ctx.fillRect(fgX + fgW - 8, fgY + fgH * 0.3 + 12, 3, 14)
    // メモやマグネット
    ctx.fillStyle = '#ffeb88'
    ctx.fillRect(fgX + 6, fgY + 12, 14, 18)
    ctx.fillStyle = '#cc6666'
    ctx.fillRect(fgX + 8, fgY + 50, 6, 6)
  }

  // ===== 背景: 縁側（夕方）=====
  private drawEngawa(ctx: CanvasRenderingContext2D, W: number, H: number): void {
    // 夕焼け空（グラデ）
    const grd = ctx.createLinearGradient(0, 0, 0, H * 0.5)
    grd.addColorStop(0, '#3a1a4a')
    grd.addColorStop(0.4, '#aa3a6a')
    grd.addColorStop(0.7, '#ee6644')
    grd.addColorStop(1, '#ffaa66')
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, W, H * 0.5)
    // 太陽（沈みかけ）
    ctx.fillStyle = '#ffdd66'
    ctx.fillRect(W * 0.6, H * 0.42, 36, 36)
    ctx.fillStyle = '#ffaa44'
    ctx.fillRect(W * 0.62, H * 0.44, 32, 32)
    // 雲
    ctx.fillStyle = 'rgba(40,20,50,0.4)'
    ctx.fillRect(W * 0.1, H * 0.18, 80, 8)
    ctx.fillRect(W * 0.4, H * 0.12, 100, 6)
    ctx.fillRect(W * 0.7, H * 0.22, 70, 8)

    // 庭（草）
    ctx.fillStyle = '#3a5a30'
    ctx.fillRect(0, H * 0.5, W, H * 0.15)
    ctx.fillStyle = '#4a6a38'
    for (let i = 0; i < 30; i++) {
      ctx.fillRect((i * 23) % W, H * 0.5 + (i % 3) * 4, 2, 5)
    }

    // 庭木（左側シルエット）
    ctx.fillStyle = '#1a2a18'
    ctx.fillRect(W * 0.05, H * 0.32, 4, H * 0.2)
    ctx.fillRect(W * 0.0, H * 0.25, 28, 24)
    ctx.fillRect(W * 0.02, H * 0.21, 22, 16)

    // 縁側（板敷き）
    ctx.fillStyle = '#8a6a40'
    ctx.fillRect(0, H * 0.65, W, H * 0.25)
    // 板の継ぎ目
    ctx.fillStyle = '#6a4a20'
    for (let i = 0; i < 8; i++) ctx.fillRect(0, H * 0.65 + i * 14, W, 1)
    ctx.fillRect(0, H * 0.65, W, 2)
    ctx.fillRect(0, H * 0.9, W, 2)

    // 障子（背景）
    ctx.fillStyle = '#f0e8d0'
    ctx.fillRect(0, 0, W, H * 0.05)
    ctx.fillRect(0, H * 0.05, W * 0.05, H * 0.6)
    ctx.fillRect(W * 0.95, H * 0.05, W * 0.05, H * 0.6)
    // 障子の格子
    ctx.fillStyle = '#8a6a40'
    ctx.fillRect(0, 0, W, 2)
    ctx.fillRect(0, H * 0.65 - 2, W, 2)
    for (let x = 0; x < W * 0.05; x += 14) ctx.fillRect(x, 0, 1, H * 0.65)
    for (let x = W * 0.95; x < W; x += 14) ctx.fillRect(x, 0, 1, H * 0.65)

    // 風鈴（左上）
    ctx.fillStyle = '#888'
    ctx.fillRect(W * 0.1, 0, 1, 30)
    ctx.fillStyle = '#aaccdd'
    ctx.fillRect(W * 0.1 - 6, 28, 13, 12)
    ctx.fillStyle = '#88aabb'
    ctx.fillRect(W * 0.1 - 6, 28, 13, 3)

    // 全体に夕日のオーバーレイ
    ctx.fillStyle = 'rgba(255,150,50,0.06)'
    ctx.fillRect(0, 0, W, H)
  }

  // ===== 背景: 回想（モノクロ）=====
  private drawFlashback(ctx: CanvasRenderingContext2D, W: number, H: number): void {
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(0, 0, W, H)
    // 上半分: 古い空（モノクロ）
    ctx.fillStyle = '#3a3a3a'
    ctx.fillRect(0, 0, W, H * 0.5)
    ctx.fillStyle = '#4a4a4a'
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(W * (0.15 + i * 0.18), H * (0.1 + (i % 2) * 0.06), 50, 4)
    }
    // 下半分: 道
    ctx.fillStyle = '#2a2a2a'
    ctx.fillRect(0, H * 0.5, W, H * 0.5)
    ctx.fillStyle = '#3a3a3a'
    for (let i = 0; i < 5; i++) ctx.fillRect(0, H * 0.55 + i * 30, W, 1)
    // 街灯
    ctx.fillStyle = '#4a4a4a'
    ctx.fillRect(W * 0.15, H * 0.3, 3, H * 0.3)
    ctx.fillRect(W * 0.85, H * 0.3, 3, H * 0.3)
    ctx.fillStyle = '#aaa'
    ctx.fillRect(W * 0.15 - 4, H * 0.28, 11, 5)
    ctx.fillRect(W * 0.85 - 4, H * 0.28, 11, 5)
    // ノイズフィルム風（フィルムの傷）
    ctx.fillStyle = 'rgba(255,255,255,0.04)'
    for (let i = 0; i < 6; i++) {
      const fy = (i * 89 + this.vt) % H
      ctx.fillRect((i * 137) % W, fy, 1, 30)
    }
    // 「FLASHBACK」テロップ
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.font = 'bold 11px monospace'
    ctx.textAlign = 'right'
    ctx.fillText('—— FLASHBACK ——', W - 14, H * 0.06)
  }

  // ===== 本棚（独立ヘルパー、サイズ整合）=====
  private drawBookshelf(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    // 外枠（木）
    ctx.fillStyle = '#5a3a20'
    ctx.fillRect(x, y, w, h)
    // 内側
    const inset = 3
    ctx.fillStyle = '#3a2418'
    ctx.fillRect(x + inset, y + inset, w - inset * 2, h - inset * 2)
    // 棚板（3段）
    const shelves = 3
    const shelfH = (h - inset * 2) / shelves
    const innerY = y + inset
    for (let i = 1; i < shelves; i++) {
      ctx.fillStyle = '#6a4a30'
      ctx.fillRect(x + inset, innerY + i * shelfH - 2, w - inset * 2, 3)
    }
    // 棚の底
    ctx.fillStyle = '#6a4a30'
    ctx.fillRect(x + inset, y + h - inset - 3, w - inset * 2, 3)

    // 各段に本を配置
    const bookColors = [
      ['#cc3333', '#3366cc', '#33aa44'],
      ['#cccc44', '#aa3399', '#dd9933'],
      ['#3399cc', '#cc6633', '#999'],
    ]
    const bookW = (w - inset * 2 - 6) / 3 - 1
    const bookGap = 1
    for (let s = 0; s < shelves; s++) {
      const segY = innerY + s * shelfH
      const bookH = shelfH - 5
      for (let b = 0; b < 3; b++) {
        const bx = x + inset + 2 + b * (bookW + bookGap)
        const by = segY + 2
        // ランダムに高さ違い
        const hOff = (s + b) % 2 === 0 ? 0 : 2
        ctx.fillStyle = bookColors[s][b]
        ctx.fillRect(bx, by + hOff, bookW, bookH - hOff - 2)
        // 背表紙の線
        ctx.fillStyle = 'rgba(0,0,0,0.3)'
        ctx.fillRect(bx, by + hOff, bookW, 1)
        ctx.fillRect(bx, by + bookH - 3, bookW, 1)
      }
    }
  }

  // ===== キャラ描画 =====
  private drawChar(cx: number, cy: number, body: string, light: string, eye: string, accent: string, dir: number, talk: boolean): void {
    const ctx = this.cc.ctx
    const s = 4
    const bx = cx - 5 * s, by = cy - 12 * s
    ctx.fillStyle = 'rgba(0,0,0,0.2)'
    ctx.fillRect(bx + 2*s, by + 13*s, 8*s, 2*s)
    ctx.fillStyle = body
    ctx.fillRect(bx + 2*s, by + 4*s, 8*s, 7*s)
    ctx.fillRect(bx + 1*s, by + 1*s, 10*s, 6*s)
    ctx.fillRect(bx + 2*s, by, 8*s, 2*s)
    ctx.fillRect(bx + 1*s, by - 1*s, 3*s, 3*s)
    ctx.fillRect(bx + 8*s, by - 1*s, 3*s, 3*s)
    ctx.fillStyle = accent
    ctx.fillRect(bx + 2*s, by, 1*s, 2*s)
    ctx.fillRect(bx + 9*s, by, 1*s, 2*s)
    ctx.fillStyle = light
    ctx.fillRect(bx + 3*s, by + 4*s, 6*s, 3*s)
    // 瞬き
    const blink = (this.vt + Math.floor(cx)) % 180 < 6
    if (blink) {
      ctx.fillStyle = body
      ctx.fillRect(bx + 2*s, by + 3*s, 7*s, 1*s)
    } else {
      ctx.fillStyle = eye
      if (dir === 0) {
        ctx.fillRect(bx + 3*s, by + 3*s, 2*s, 2*s)
        ctx.fillRect(bx + 7*s, by + 3*s, 2*s, 2*s)
      } else {
        ctx.fillRect(bx + 2*s, by + 3*s, 2*s, 2*s)
        ctx.fillRect(bx + 6*s, by + 3*s, 2*s, 2*s)
      }
      ctx.fillStyle = '#111'
      ctx.fillRect(bx + (dir === 0 ? 4 : 2)*s, by + 3*s, 1*s, 1*s)
      ctx.fillRect(bx + (dir === 0 ? 7 : 6)*s, by + 3*s, 1*s, 1*s)
    }
    if (talk && this.vt % 18 < 9) {
      ctx.fillStyle = '#300'
      ctx.fillRect(bx + 5*s, by + 6*s, 2*s, 1*s)
    }
    ctx.fillStyle = body
    ctx.fillRect(bx + 2*s, by + 11*s, 3*s, 2*s)
    ctx.fillRect(bx + 7*s, by + 11*s, 3*s, 2*s)
  }
}
