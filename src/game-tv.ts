import Phaser from 'phaser'

/* ============================================================
   GM BUTSU — Phaser 3  (portrait 360×640)
   ============================================================ */

/* ── Types ── */
interface CareLines {
  feed: string
  pet: string
  clean: string
}

interface CharData {
  id: string
  name: string
  displayName: string
  title: string
  hp: number
  atk: number
  def: number
  spd: number
  specialName: string
  specialMult: number
  bodyColor: number
  lightColor: number
  darkColor: number
  eyeColor: number
  pupilColor: number
  blushColor: number
  accentColor: number
  cheerColor: number
  tauntLines: string[]
  hitLines: string[]
  winLine: string
  loseOutcry: string
  careLines: CareLines
}

interface StageData {
  name: string
  sub: string
  skyTop: number
  skyBot: number
  groundColor: number
  groundDark: number
  speed: number
  spawnRate: number
  desc: string
}

interface Obstacle {
  gfx: Phaser.GameObjects.Graphics
  x: number
  y: number
  w: number
  h: number
  flying?: boolean
  scored?: boolean
}

interface CoinObj {
  gfx: Phaser.GameObjects.Graphics
  x: number
  y: number
  collected: boolean
}

interface PowerUp {
  gfx: Phaser.GameObjects.Graphics
  x: number
  y: number
  type: string
}

interface CloudObj {
  gfx: Phaser.GameObjects.Graphics
  speed: number
  x: number
}

/* ── Character Data ── */
const CHARS: CharData[] = [
  {
    id: 'minmincchi', name: 'minmincchi',
    displayName: 'みんみんっち', title: 'THE BLACK & WHITE CAT',
    hp: 100, atk: 18, def: 16, spd: 14,
    specialName: 'SHADOW STRIKE', specialMult: 2.2,
    bodyColor: 0x111111, lightColor: 0xffffff, darkColor: 0x000000,
    eyeColor: 0xffee22, pupilColor: 0x000000, blushColor: 0xdddddd,
    accentColor: 0xffffff, cheerColor: 0x88ff88,
    tauntLines: ['keikaku doori.', 'seikaku ni yare!', 'zatsu wa yurusanai.'],
    hitLines: ['ku...!', 'mada mada!', 'itai...demo makenai!'],
    winLine: 'keikaku doori.', loseOutcry: 'uso...maketa...',
    careLines: { feed: 'oishii...!', pet: 'ehehe...', clean: 'sukkiri.' }
  },
  {
    id: 'popomicchi', name: 'popomicchi',
    displayName: 'ぽぽみっち', title: 'THE SHY CANNON',
    hp: 85, atk: 22, def: 12, spd: 18,
    specialName: 'SHY BURST', specialMult: 2.8,
    bodyColor: 0xcc5599, lightColor: 0xffccee, darkColor: 0x993366,
    eyeColor: 0xffccee, pupilColor: 0x993366, blushColor: 0xff6699,
    accentColor: 0xff88bb, cheerColor: 0xffaadd,
    tauntLines: ['e, etto...ganbaru...!', 'kowakunai mon...!', '...fun!'],
    hitLines: ['kya!', 'i, itai...', 'uu...'],
    winLine: 'ya, yatta...!', loseOutcry: 'gomen nasai...',
    careLines: { feed: 'a...arigatou...', pet: 'un, suki...', clean: 'k-kimochi ii...' }
  },
  {
    id: 'sunsuncchi', name: 'sunsuncchi',
    displayName: 'すんすんっち', title: 'THE HAMSTER',
    hp: 110, atk: 20, def: 13, spd: 22,
    specialName: 'CHEEK BURST', specialMult: 2.5,
    bodyColor: 0xeebb88, lightColor: 0xffddbb, darkColor: 0xaa7744,
    eyeColor: 0x442211, pupilColor: 0x000000, blushColor: 0xffaaaa,
    accentColor: 0xffffff, cheerColor: 0xffddaa,
    tauntLines: ['mukii~!! yatterunne!', 'hoppe ippai da yo!', 'watashi okotteru yo!'],
    hitLines: ['kyuu~!', 'ita...', 'mukii...!'],
    winLine: 'muncha muncha~!', loseOutcry: 'kyuu...makechi....',
    careLines: { feed: 'muncha muncha~!', pet: 'kyuu~...', clean: 'fuwa fuwa~!' }
  },
  {
    id: 'yoishocchi', name: 'yoishocchi',
    displayName: 'よいしょっち', title: 'THE SLOW BURNER',
    hp: 95, atk: 25, def: 14, spd: 10,
    specialName: 'LAZY BLAST', specialMult: 3.0,
    bodyColor: 0xddbb88, lightColor: 0xfff0cc, darkColor: 0xaa8855,
    eyeColor: 0x886644, pupilColor: 0x442200, blushColor: 0xffddaa,
    accentColor: 0xfff5e0, cheerColor: 0xffeebb,
    tauntLines: ['yoisho...', '...nn?', 'maa ii ka~'],
    hitLines: ['a...itai...', 'nn...', 'yoisho...?'],
    winLine: 'yoisho yoisho~', loseOutcry: 'a...maketa...',
    careLines: { feed: 'yoisho~...oishii', pet: 'nn~...kimochii...', clean: 'fuwa~...' }
  }
]

/* ── Pixel Art ── */
function drawChar(graphics: Phaser.GameObjects.Graphics, char: CharData, x: number, y: number, scale: number, accessory: string | null) {
  scale = scale || 4
  const s = scale, c = char
  const px = (ppx: number, py: number, w: number, h: number, color: number) => {
    graphics.fillStyle(color)
    graphics.fillRect(x + ppx * s, y + py * s, w * s, h * s)
  }
  // Body
  px(8,15,8,5,c.bodyColor); px(7,16,10,3,c.bodyColor); px(9,14,6,1,c.bodyColor)
  px(10,16,4,3,c.lightColor); px(11,17,2,1,0xffffff)
  px(5,15,3,3,c.bodyColor); px(16,15,3,3,c.bodyColor)
  px(5,17,2,1,c.darkColor); px(17,17,2,1,c.darkColor)
  // Head
  px(5,4,14,10,c.bodyColor); px(4,5,16,8,c.bodyColor)
  px(6,3,12,1,c.bodyColor); px(7,2,10,1,c.bodyColor)
  // Ears
  px(6,1,3,3,c.bodyColor); px(5,2,1,2,c.bodyColor)
  px(15,1,3,3,c.bodyColor); px(18,2,1,2,c.bodyColor)
  px(7,2,1,2,c.accentColor); px(16,2,1,2,c.accentColor)
  // Eyes
  px(7,6,4,5,c.eyeColor); px(13,6,4,5,c.eyeColor)
  px(8,7,2,3,c.pupilColor); px(14,7,2,3,c.pupilColor)
  px(8,7,1,1,0xffffff); px(14,7,1,1,0xffffff)
  px(10,9,1,1,0xffffff); px(16,9,1,1,0xffffff)
  // Mouth
  px(10,12,4,1,c.eyeColor); px(10,11,1,1,c.bodyColor); px(13,11,1,1,c.bodyColor)
  // Blush
  px(5,11,3,2,c.blushColor); px(16,11,3,2,c.blushColor)
  // Feet
  px(7,20,4,2,c.bodyColor); px(13,20,4,2,c.bodyColor)
  px(7,21,3,1,c.darkColor); px(14,21,3,1,c.darkColor)

  // Character-specific
  if (c.id === 'popomicchi') {
    px(6,5,5,6,c.eyeColor); px(13,5,5,6,c.eyeColor)
    px(7,6,4,5,c.pupilColor); px(14,6,4,5,c.pupilColor)
    px(7,6,1,1,0xffffff); px(14,6,1,1,0xffffff)
    px(9,9,1,1,0xffffff); px(16,9,1,1,0xffffff)
    px(8,8,1,1,0xddddff); px(15,8,1,1,0xddddff)
    px(7,8,1,1,0xffffff); px(17,8,1,1,0xffffff)
    px(4,11,4,2,c.blushColor); px(16,11,4,2,c.blushColor)
    px(3,1,5,3,c.accentColor); px(16,1,5,3,c.accentColor)
    px(9,0,6,3,c.accentColor); px(11,1,2,1,0xffffff)
    px(5,2,1,1,0xffffff); px(17,2,1,1,0xffffff)
    px(10,12,4,1,0xff6699); px(11,11,2,1,0xff6699)
  } else if (c.id === 'sunsuncchi') {
    px(1,7,6,8,c.lightColor); px(17,7,6,8,c.lightColor)
    px(1,6,5,1,c.lightColor); px(18,6,5,1,c.lightColor)
    px(1,15,5,1,c.lightColor); px(18,15,5,1,c.lightColor)
    px(2,9,3,4,c.blushColor); px(19,9,3,4,c.blushColor)
    px(3,8,2,1,c.blushColor); px(19,8,2,1,c.blushColor)
    px(3,13,2,1,c.blushColor); px(19,13,2,1,c.blushColor)
    px(4,4,16,11,c.bodyColor); px(3,5,18,9,c.bodyColor)
    px(6,1,4,3,c.bodyColor); px(5,2,2,2,c.bodyColor)
    px(7,2,2,2,c.darkColor); px(6,2,1,1,c.blushColor)
    px(14,1,4,3,c.bodyColor); px(17,2,2,2,c.bodyColor)
    px(15,2,2,2,c.darkColor); px(17,2,1,1,c.blushColor)
    px(7,5,3,1,c.darkColor); px(14,5,3,1,c.darkColor)
    px(9,4,1,1,c.darkColor); px(14,4,1,1,c.darkColor)
    px(7,6,1,1,c.darkColor); px(9,6,1,1,c.darkColor); px(11,6,1,1,c.darkColor)
    px(13,6,1,1,c.darkColor); px(15,6,1,1,c.darkColor); px(17,6,1,1,c.darkColor)
    px(7,7,4,4,c.eyeColor); px(13,7,4,4,c.eyeColor)
    px(8,7,2,2,c.pupilColor); px(14,7,2,2,c.pupilColor)
    px(8,7,1,1,0xffffff); px(14,7,1,1,0xffffff)
    px(11,10,2,1,c.darkColor); px(10,11,1,1,c.darkColor); px(13,11,1,1,c.darkColor)
    px(10,12,4,1,c.darkColor)
    px(10,11,1,1,c.bodyColor); px(13,11,1,1,c.bodyColor)
    px(11,12,2,2,0xffffff); px(11,13,1,1,c.darkColor)
    px(10,16,4,1,c.lightColor); px(9,17,6,1,c.lightColor)
    px(10,18,4,1,c.lightColor); px(11,16,2,1,c.blushColor)
    px(18,19,3,2,c.lightColor); px(19,19,2,1,0xffffff)
  } else if (c.id === 'yoishocchi') {
    px(6,0,2,2,c.bodyColor); px(16,0,2,2,c.bodyColor)
    px(7,0,1,2,c.lightColor); px(16,0,1,2,c.lightColor)
    px(7,1,1,2,c.lightColor); px(16,1,1,2,c.lightColor)
    px(7,6,4,2,c.bodyColor); px(13,6,4,2,c.bodyColor)
    px(7,8,4,3,c.eyeColor); px(13,8,4,3,c.eyeColor)
    px(8,9,2,2,c.pupilColor); px(14,9,2,2,c.pupilColor)
    px(8,9,1,1,0xffffff); px(14,9,1,1,0xffffff)
    px(7,8,4,1,c.darkColor); px(13,8,4,1,c.darkColor)
    px(4,10,4,3,c.blushColor); px(16,10,4,3,c.blushColor)
    px(10,12,4,1,c.darkColor)
    px(10,13,1,1,c.darkColor); px(13,13,1,1,c.darkColor)
    px(9,15,6,5,c.lightColor); px(8,16,8,3,c.lightColor)
    px(18,16,4,2,c.bodyColor); px(17,17,5,3,c.bodyColor); px(18,20,3,1,c.bodyColor)
    px(19,17,3,2,c.lightColor); px(18,18,3,2,c.lightColor); px(20,19,1,1,0xffffff)
  } else {
    px(7,0,2,2,c.bodyColor)
    px(16,0,2,2,c.bodyColor)
    px(7,1,1,1,0xffccdd); px(16,1,1,1,0xffccdd)
    px(7,4,1,1,c.darkColor); px(9,4,1,1,c.darkColor); px(11,4,1,1,c.darkColor)
    px(13,4,1,1,c.darkColor); px(15,4,1,1,c.darkColor); px(17,4,1,1,c.darkColor)
    px(7,5,4,1,0x333333); px(13,5,4,1,0x333333)
    px(7,5,4,6,c.eyeColor); px(13,5,4,6,c.eyeColor)
    px(9,5,1,6,c.pupilColor); px(15,5,1,6,c.pupilColor)
    px(8,6,1,1,0xffffff); px(14,6,1,1,0xffffff)
    px(10,8,1,1,0xffffaa); px(16,8,1,1,0xffffaa)
    px(8,10,8,3,c.lightColor)
    px(7,11,10,2,c.lightColor)
    px(5,10,3,2,0x888899); px(16,10,3,2,0x888899)
    px(0,9,4,1,c.lightColor); px(0,11,4,1,c.lightColor)
    px(20,9,4,1,c.lightColor); px(20,11,4,1,c.lightColor)
    px(10,12,4,1,c.eyeColor)
    px(9,15,6,5,c.lightColor); px(8,16,8,3,c.lightColor)
    px(10,16,2,1,c.darkColor); px(12,16,2,1,c.darkColor)
    px(9,17,6,1,c.darkColor)
    px(10,18,4,1,c.darkColor)
    px(11,19,2,1,c.darkColor)
  }

  // Accessories
  if (accessory === 'ribbon') {
    px(4,1,3,2,0xff88bb); px(17,1,3,2,0xff88bb)
    px(9,0,6,2,0xff88bb); px(11,1,2,1,0xffffff)
    px(5,1,1,1,0xffffff); px(18,1,1,1,0xffffff)
  } else if (accessory === 'hat') {
    px(6,1,12,1,0x7744aa); px(8,0,8,2,0x9955cc)
    px(10,0,4,1,0xbb77ee); px(10,1,1,1,0xffffff)
  } else if (accessory === 'scarf') {
    px(6,13,12,2,0xff4455); px(7,14,10,1,0xcc2233)
    px(11,15,3,3,0xff4455); px(12,15,1,2,0xcc2233)
  } else if (accessory === 'glasses') {
    px(6,8,5,3,0x333333); px(13,8,5,3,0x333333)
    px(11,9,2,1,0x333333); px(7,9,3,2,0x88ccff)
    px(14,9,3,2,0x88ccff); px(4,9,2,1,0x333333); px(18,9,2,1,0x333333)
  } else if (accessory === 'crown') {
    px(7,0,10,2,0xffcc00); px(8,0,2,1,0xff3333)
    px(12,0,2,1,0x3333ff); px(16,0,2,1,0x33cc33)
  }
}

function makeCharTexture(scene: Phaser.Scene, charData: CharData, key: string, scale: number, accessory?: string | null) {
  scale = scale || 4
  const g = scene.make.graphics({ x: 0, y: 0, add: false } as any)
  drawChar(g, charData, 0, 0, scale, accessory || null)
  g.generateTexture(key, 24 * scale, 24 * scale)
  g.destroy()
}

function makeBtn(scene: Phaser.Scene, x: number, y: number, w: number, h: number, color: number, label: string, fs?: string) {
  const g = scene.add.graphics()
  const lc = Phaser.Display.Color.ValueToColor(color).lighten(30).color
  const dc = Phaser.Display.Color.ValueToColor(color).darken(25).color
  g.fillStyle(0x000000, 0.5); g.fillRect(x - w / 2 + 3, y - h / 2 + 3, w, h)
  g.fillStyle(color); g.fillRect(x - w / 2, y - h / 2, w, h)
  g.fillStyle(dc); g.fillRect(x - w / 2, y + h / 2 - h * 0.35, w, h * 0.35)
  g.fillStyle(lc, 0.9); g.fillRect(x - w / 2, y - h / 2, 3, h)
  g.fillStyle(0xffffff, 0.18); g.fillRect(x - w / 2 + 3, y - h / 2 + 1, w - 3, h * 0.28)
  g.lineStyle(1.5, lc, 0.85)
  g.strokeRect(x - w / 2, y - h / 2, w, h)
  g.fillStyle(lc, 0.7)
  g.fillRect(x - w / 2, y - h / 2, 2, 2); g.fillRect(x + w / 2 - 2, y - h / 2, 2, 2)
  g.fillRect(x - w / 2, y + h / 2 - 2, 2, 2); g.fillRect(x + w / 2 - 2, y + h / 2 - 2, 2, 2)
  scene.add.text(x, y, label, { fontSize: fs || '15px', fontFamily: 'Courier New', fontStyle: 'bold', color: '#fff', stroke: '#000', strokeThickness: 2 }).setOrigin(0.5)
  return g
}

function makeBg(scene: Phaser.Scene, stageData?: StageData) {
  const W = scene.cameras.main.width, H = scene.cameras.main.height
  const bg = scene.add.graphics()
  const st = stageData || STAGES[0]
  bg.fillGradientStyle(st.skyTop, st.skyTop, st.skyBot, st.skyBot); bg.fillRect(0, 0, W, H)

  bg.fillStyle(0x4a7acc, 0.5)
  bg.beginPath(); bg.moveTo(0, H - 100)
  bg.lineTo(80, H - 160); bg.lineTo(180, H - 120); bg.lineTo(280, H - 180)
  bg.lineTo(380, H - 130); bg.lineTo(500, H - 170); bg.lineTo(600, H - 140); bg.lineTo(W, H - 110)
  bg.lineTo(W, H - 70); bg.lineTo(0, H - 70); bg.closePath(); bg.fill()

  bg.fillStyle(0x5aaa30, 0.4)
  bg.beginPath(); bg.moveTo(0, H - 60)
  bg.lineTo(120, H - 85); bg.lineTo(250, H - 70); bg.lineTo(400, H - 90)
  bg.lineTo(520, H - 75); bg.lineTo(W, H - 65); bg.lineTo(W, H - 40); bg.lineTo(0, H - 40)
  bg.closePath(); bg.fill()

  const cloud = (cx: number, cy: number, s: number) => {
    bg.fillStyle(0xffffff, 0.85)
    bg.fillCircle(cx, cy, s * 1.0)
    bg.fillCircle(cx + s * 1.2, cy, s * 0.8)
    bg.fillCircle(cx - s * 1.1, cy, s * 0.75)
    bg.fillCircle(cx + s * 0.4, cy - s * 0.7, s * 0.9)
    bg.fillStyle(0xddddff, 0.3)
    bg.fillCircle(cx, cy + s * 0.3, s * 0.9)
  }
  cloud(80, 45, 20); cloud(260, 35, 16); cloud(440, 55, 18); cloud(580, 40, 13); cloud(170, 75, 11)

  bg.fillStyle(st.groundColor, 1); bg.fillRect(0, H - 35, W, 35)
  bg.fillStyle(st.groundDark, 1); bg.fillRect(0, H - 35, W, 6)
  bg.fillStyle(st.groundColor, 0.4)
  for (let dx = 0; dx < W; dx += 20) { bg.fillRect(dx, H - 30, 10, 4) }
  bg.fillStyle(0x55dd22, 0.7)
  for (let gx = 12; gx < W; gx += 40 + Math.random() * 30) {
    bg.fillTriangle(gx, H - 35, gx + 4, H - 45, gx + 8, H - 35)
    bg.fillTriangle(gx + 5, H - 35, gx + 8, H - 42, gx + 11, H - 35)
  }
  return bg
}

/* ── Runner Constants ── */
const COIN_VALUE = 10

/* ── High Score ── */
const HighScore = {
  get(charId: string): number {
    return parseInt(localStorage.getItem('runner_hs_' + charId) || '0')
  },
  set(charId: string, score: number): boolean {
    if (score > this.get(charId)) {
      localStorage.setItem('runner_hs_' + charId, String(score))
      return true
    }
    return false
  }
}

const runnerState = {
  selectedChar: 0,
  selectedStage: 0,
  finalScore: 0,
  finalCoins: 0,
  finalDistance: 0,
  finalMaxCombo: 0,
  isNewRecord: false
}

/* ── TitleScene ── */
class TitleScene extends Phaser.Scene {
  constructor() { super('TitleScene') }
  create() {
    const W = this.cameras.main.width, H = this.cameras.main.height
    makeBg(this)

    const overlay = this.add.graphics()
    overlay.fillStyle(0x000000, 0.35); overlay.fillRect(0, 0, W, H)

    for (let i = 0; i < 4; i++) makeCharTexture(this, CHARS[i], 'tc' + i, 4)
    const pxs = [W * 0.2, W * 0.38, W * 0.56, W * 0.74]
    for (let i = 0; i < 4; i++) {
      const sp = this.add.image(pxs[i], H + 50, 'tc' + i).setAlpha(0)
      this.tweens.add({
        targets: sp, y: H * 0.72, alpha: 1,
        duration: 500, delay: i * 120, ease: 'Back.easeOut'
      })
      this.tweens.add({
        targets: sp, y: H * 0.72 - 6,
        duration: 350 + i * 40, yoyo: true, repeat: -1,
        ease: 'Sine.easeInOut', delay: i * 120 + 600
      })
    }

    const title = this.add.text(W / 2, H * 0.15, 'ジーエムブツ', {
      fontSize: '42px', fontFamily: 'Arial', fontStyle: 'bold',
      color: '#ffffff', stroke: '#000000', strokeThickness: 7
    }).setOrigin(0.5).setAlpha(0).setScale(1.3)
    this.tweens.add({ targets: title, alpha: 1, scale: 1, duration: 500, delay: 200, ease: 'Back.easeOut' })

    const sub = this.add.text(W / 2, H * 0.28, '- RUNNER -', {
      fontSize: '18px', fontFamily: 'Courier New', fontStyle: 'bold',
      color: '#ffdd00', stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5).setAlpha(0)
    this.tweens.add({ targets: sub, alpha: 1, duration: 400, delay: 500 })

    makeBtn(this, W / 2, H * 0.42, 240, 54, 0xdd2200, 'START', '22px')
    this.add.zone(W / 2, H * 0.42, 240, 54).setInteractive().on('pointerdown', () => {
      this.cameras.main.flash(200, 255, 255, 255)
      this.time.delayedCall(180, () => { this.scene.start('CharSelectScene') })
    })

    const hint = this.add.text(W / 2, H * 0.52, 'PRESS ANY KEY / TAP', {
      fontSize: '10px', fontFamily: 'Courier New',
      color: '#aaccff', stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5)
    this.tweens.add({ targets: hint, alpha: 0.3, duration: 600, yoyo: true, repeat: -1 })

    this.input.keyboard!.once('keydown', () => {
      this.cameras.main.flash(200, 255, 255, 255)
      this.time.delayedCall(180, () => { this.scene.start('CharSelectScene') })
    })
  }
}

/* ── CharSelectScene ── */
class CharSelectScene extends Phaser.Scene {
  selectedIdx = 0
  cardBgs: Phaser.GameObjects.Graphics[] = []
  cards: { bg: Phaser.GameObjects.Graphics; cx: number; cy: number; w: number; h: number }[] = []
  charSprites: Phaser.GameObjects.Image[] = []

  constructor() { super('CharSelectScene') }
  create() {
    const W = this.cameras.main.width, H = this.cameras.main.height
    makeBg(this)

    this.add.text(W / 2, 28, 'SELECT YOUR FIGHTER', {
      fontSize: '20px', fontFamily: 'Courier New', fontStyle: 'bold',
      color: '#ffdd00', stroke: '#000000', strokeThickness: 4
    }).setOrigin(0.5)

    for (let i = 0; i < 4; i++) makeCharTexture(this, CHARS[i], 'cs' + i, 4)

    const charHPs = [3, 2, 4, 3]
    const specialLabels = ['SHIELD', 'D-JUMP', 'MAGNET', 'SLOW']
    const cW = 130, cH = 170, colGap = 14
    const totalW = cW * 4 + colGap * 3
    const sx = (W - totalW) / 2
    const cy0 = H * 0.48
    this.selectedIdx = 0
    this.cardBgs = []
    this.cards = []
    this.charSprites = []

    for (let i = 0; i < 4; i++) {
      const cx = sx + i * (cW + colGap) + cW / 2
      const cy = cy0
      const c = CHARS[i]

      const cbg = this.add.graphics()
      this._drawCard(cbg, cx, cy, cW, cH, i === 0)
      this.cardBgs.push(cbg)

      const charImg = this.add.image(cx, cy - 40, 'cs' + i).setOrigin(0.5)
      this.charSprites.push(charImg)

      this.add.text(cx, cy + 25, c.displayName, {
        fontSize: '12px', fontStyle: 'bold', color: '#ffffff',
        stroke: '#000000', strokeThickness: 2
      }).setOrigin(0.5)

      let hpStr = ''
      for (let h = 0; h < charHPs[i]; h++) hpStr += '\u2665'
      this.add.text(cx, cy + 42, hpStr, {
        fontSize: '13px', color: '#ff4444', stroke: '#000', strokeThickness: 1
      }).setOrigin(0.5)

      this.add.text(cx, cy + 58, specialLabels[i], {
        fontSize: '9px', fontFamily: 'Courier New', fontStyle: 'bold',
        color: '#ffcc44', stroke: '#000', strokeThickness: 1
      }).setOrigin(0.5)

      const statG = this.add.graphics()
      const barX = cx - 40, barY = cy + 70
      statG.fillStyle(0x444444); statG.fillRect(barX, barY, 80, 5)
      statG.fillStyle(0xff4444); statG.fillRect(barX, barY, (c.atk / 25) * 80, 5)
      this.add.text(barX - 2, barY - 1, 'ATK', { fontSize: '6px', color: '#aaa' }).setOrigin(1, 0)
      statG.fillStyle(0x444444); statG.fillRect(barX, barY + 10, 80, 5)
      statG.fillStyle(0x44bbff); statG.fillRect(barX, barY + 10, (c.spd / 22) * 80, 5)
      this.add.text(barX - 2, barY + 9, 'SPD', { fontSize: '6px', color: '#aaa' }).setOrigin(1, 0)

      const zone = this.add.zone(cx, cy, cW, cH).setInteractive()
      ;(zone as any).ci = i
      zone.on('pointerdown', function (this: any) { (scene as CharSelectScene).selectCard(this.ci) })
      this.cards.push({ bg: cbg, cx, cy, w: cW, h: cH })
    }

    const scene = this
    // Fix zone click handlers
    for (let i = 0; i < 4; i++) {
      const idx = i
      const cx = sx + i * (cW + colGap) + cW / 2
      const cy = cy0
      // Re-create zone with closure
      this.add.zone(cx, cy, cW, cH).setInteractive().on('pointerdown', () => {
        this.selectCard(idx)
      })
    }

    this._bounceSelected()

    makeBtn(this, W / 2, H * 0.92, 200, 40, 0xdd2200, 'GO!', '18px')
    this.add.zone(W / 2, H * 0.92, 200, 40).setInteractive().on('pointerdown', () => {
      runnerState.selectedChar = this.selectedIdx
      this.cameras.main.flash(200, 255, 255, 255)
      this.time.delayedCall(180, () => { this.scene.start('StageSelectScene') })
    })

    this.input.keyboard!.on('keydown-LEFT', () => { this.selectCard(Math.max(0, this.selectedIdx - 1)) })
    this.input.keyboard!.on('keydown-RIGHT', () => { this.selectCard(Math.min(3, this.selectedIdx + 1)) })
    this.input.keyboard!.on('keydown-ENTER', () => {
      runnerState.selectedChar = this.selectedIdx
      this.cameras.main.flash(200, 255, 255, 255)
      this.time.delayedCall(180, () => { this.scene.start('StageSelectScene') })
    })
  }

  _drawCard(cbg: Phaser.GameObjects.Graphics, cx: number, cy: number, w: number, h: number, sel: boolean) {
    cbg.clear()
    if (sel) {
      cbg.fillStyle(0xffdd00, 0.25)
      cbg.fillRoundedRect(cx - w / 2 - 5, cy - h / 2 - 5, w + 10, h + 10, 12)
    }
    cbg.fillStyle(sel ? 0x1a2244 : 0x0e1530, 0.92)
    cbg.fillRoundedRect(cx - w / 2, cy - h / 2, w, h, 10)
    cbg.fillStyle(0xffffff, sel ? 0.1 : 0.04)
    cbg.fillRoundedRect(cx - w / 2 + 2, cy - h / 2 + 2, w - 4, h * 0.2, 8)
    cbg.lineStyle(sel ? 3 : 2, sel ? 0xffdd00 : 0x445588)
    cbg.strokeRoundedRect(cx - w / 2, cy - h / 2, w, h, 10)
  }

  _bounceSelected() {
    for (let i = 0; i < this.charSprites.length; i++) {
      this.tweens.killTweensOf(this.charSprites[i])
      if (i === this.selectedIdx) {
        this.tweens.add({
          targets: this.charSprites[i],
          y: this.charSprites[i].y - 8,
          duration: 300, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
        })
      }
    }
  }

  selectCard(idx: number) {
    this.selectedIdx = idx
    for (let i = 0; i < this.cards.length; i++) {
      const c = this.cards[i]
      this._drawCard(c.bg, c.cx, c.cy, c.w, c.h, i === idx)
      this.charSprites[i].y = c.cy - 40
    }
    this._bounceSelected()
  }
}

/* ── Stage Data ── */
const STAGES: StageData[] = [
  {
    name: 'くさはら', sub: 'GRASSLAND',
    skyTop: 0x5c94fc, skyBot: 0x3a6fd8,
    groundColor: 0x3cb800, groundDark: 0x2a9900,
    speed: 260, spawnRate: 1.0,
    desc: 'やさしい草原'
  },
  {
    name: 'さばく', sub: 'DESERT',
    skyTop: 0xf0c860, skyBot: 0xd4a030,
    groundColor: 0xd4a840, groundDark: 0xb08830,
    speed: 290, spawnRate: 0.85,
    desc: '熱い砂漠'
  },
  {
    name: 'よぞら', sub: 'NIGHT SKY',
    skyTop: 0x0a0a2e, skyBot: 0x1a1a4e,
    groundColor: 0x2a2a3a, groundDark: 0x1a1a2a,
    speed: 320, spawnRate: 0.7,
    desc: '危険な夜'
  }
]

/* ── StageSelectScene ── */
class StageSelectScene extends Phaser.Scene {
  selectedStage = 0
  stageBgs: Phaser.GameObjects.Graphics[] = []
  stageCards: { cx: number; cy: number; w: number; h: number }[] = []

  constructor() { super('StageSelectScene') }
  create() {
    const W = this.cameras.main.width, H = this.cameras.main.height

    const bg = this.add.graphics()
    bg.fillGradientStyle(0x1a1a3a, 0x1a1a3a, 0x0a0a1a, 0x0a0a1a)
    bg.fillRect(0, 0, W, H)

    for (let si = 0; si < 40; si++) {
      bg.fillStyle(0xffffff, 0.3 + Math.random() * 0.5)
      bg.fillCircle(Math.random() * W, Math.random() * H * 0.7, 1 + Math.random())
    }

    this.add.text(W / 2, 30, 'STAGE SELECT', {
      fontSize: '22px', fontFamily: 'Courier New', fontStyle: 'bold',
      color: '#ffffff', stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5)

    this.selectedStage = 0
    this.stageBgs = []
    this.stageCards = []
    const cardW = 180, cardH = 180, gap = 16
    const totalW = cardW * 3 + gap * 2
    const sx = (W - totalW) / 2

    for (let i = 0; i < 3; i++) {
      const cx = sx + i * (cardW + gap) + cardW / 2
      const cy = H * 0.48
      const st = STAGES[i]

      const cbg = this.add.graphics()
      this._drawStageCard(cbg, cx, cy, cardW, cardH, i === 0)
      this.stageBgs.push(cbg)

      const preview = this.add.graphics()
      preview.fillGradientStyle(st.skyTop, st.skyTop, st.skyBot, st.skyBot)
      preview.fillRect(cx - 70, cy - 65, 140, 70)
      preview.fillStyle(st.groundColor); preview.fillRect(cx - 70, cy + 5, 140, 18)
      preview.fillStyle(st.groundDark); preview.fillRect(cx - 70, cy + 5, 140, 4)
      if (i === 2) {
        for (let s = 0; s < 8; s++) {
          preview.fillStyle(0xffffff, 0.6)
          preview.fillCircle(cx - 60 + Math.random() * 120, cy - 55 + Math.random() * 50, 1)
        }
        preview.fillStyle(0xffffcc, 0.8)
        preview.fillCircle(cx + 40, cy - 50, 10)
        preview.fillStyle(st.skyTop)
        preview.fillCircle(cx + 44, cy - 52, 9)
      } else {
        preview.fillStyle(0xffffff, 0.7)
        preview.fillCircle(cx - 30, cy - 45, 8)
        preview.fillCircle(cx - 22, cy - 45, 6)
        preview.fillCircle(cx - 26, cy - 50, 7)
      }

      this.add.text(cx, cy + 35, st.name, {
        fontSize: '16px', fontFamily: 'Arial', fontStyle: 'bold',
        color: '#ffffff', stroke: '#000', strokeThickness: 3
      }).setOrigin(0.5)

      this.add.text(cx, cy + 52, st.sub, {
        fontSize: '10px', fontFamily: 'Courier New',
        color: '#aabbcc', stroke: '#000', strokeThickness: 1
      }).setOrigin(0.5)

      const diffColors = [0x44ff44, 0xffdd00, 0xff4444]
      for (let d = 0; d <= i; d++) {
        this.add.graphics().fillStyle(diffColors[i]).fillCircle(cx - 10 + d * 12, cy + 70, 4)
      }
      this.add.text(cx + 20, cy + 67, i === 0 ? 'EASY' : i === 1 ? 'NORMAL' : 'HARD', {
        fontSize: '7px', fontFamily: 'Courier New', fontStyle: 'bold',
        color: i === 0 ? '#44ff44' : i === 1 ? '#ffdd00' : '#ff4444'
      })

      const idx = i
      this.add.zone(cx, cy, cardW, cardH).setInteractive().on('pointerdown', () => {
        this.selectStage(idx)
      })
      this.stageCards.push({ cx, cy, w: cardW, h: cardH })
    }

    makeBtn(this, W / 2, H * 0.9, 200, 42, 0x22aa44, 'GO!', '18px')
    this.add.zone(W / 2, H * 0.9, 200, 42).setInteractive().on('pointerdown', () => {
      runnerState.selectedStage = this.selectedStage
      this.cameras.main.flash(200, 255, 255, 255)
      this.time.delayedCall(180, () => { this.scene.start('GameScene') })
    })

    this.input.keyboard!.on('keydown-LEFT', () => { this.selectStage(Math.max(0, this.selectedStage - 1)) })
    this.input.keyboard!.on('keydown-RIGHT', () => { this.selectStage(Math.min(2, this.selectedStage + 1)) })
    this.input.keyboard!.on('keydown-ENTER', () => {
      runnerState.selectedStage = this.selectedStage
      this.cameras.main.flash(200, 255, 255, 255)
      this.time.delayedCall(180, () => { this.scene.start('GameScene') })
    })
  }

  _drawStageCard(cbg: Phaser.GameObjects.Graphics, cx: number, cy: number, w: number, h: number, sel: boolean) {
    cbg.clear()
    if (sel) {
      cbg.fillStyle(0x44ff88, 0.2)
      cbg.fillRoundedRect(cx - w / 2 - 4, cy - h / 2 - 4, w + 8, h + 8, 12)
    }
    cbg.fillStyle(sel ? 0x223355 : 0x1a2a44, 0.95)
    cbg.fillRoundedRect(cx - w / 2, cy - h / 2, w, h, 10)
    cbg.fillStyle(0xffffff, sel ? 0.08 : 0.03)
    cbg.fillRoundedRect(cx - w / 2 + 2, cy - h / 2 + 2, w - 4, h * 0.2, 8)
    cbg.lineStyle(sel ? 3 : 1, sel ? 0x44ffaa : 0x335577)
    cbg.strokeRoundedRect(cx - w / 2, cy - h / 2, w, h, 10)
  }

  selectStage(idx: number) {
    this.selectedStage = idx
    for (let i = 0; i < this.stageCards.length; i++) {
      const c = this.stageCards[i]
      this._drawStageCard(this.stageBgs[i], c.cx, c.cy, c.w, c.h, i === idx)
    }
  }
}

/* ── GameScene ── */
class GameScene extends Phaser.Scene {
  stage!: StageData
  GROUND_Y = 410
  CHAR_X = 80
  GRAVITY = 1200
  scrollSpeed = 0
  baseScrollSpeed = 0
  gameOver = false
  gameStarted = false
  score = 0
  coins = 0
  elapsed = 0
  charIdx = 0
  charHPMax = 3
  charHP = 3
  jumpVY = -720
  charVY = 0
  onGround = true
  invincible = false
  hasDoubleJump = false
  canDoubleJump = false
  specialUsed = false
  specialActive = false
  magnetActive = false
  combo = 0
  maxCombo = 0
  distance = 0
  lastLevelUp = 0
  isSliding = false
  slideTimer = 0
  starActive = false
  starCountdown = 0

  charSprite!: Phaser.GameObjects.Image
  clouds: CloudObj[] = []
  groundTiles: Phaser.GameObjects.Graphics[] = []
  obstacles: Obstacle[] = []
  coinObjs: CoinObj[] = []
  powerUps: PowerUp[] = []
  powerUpTimer = 0
  hpGroup: Phaser.GameObjects.Text[] = []
  scoreTxt!: Phaser.GameObjects.Text
  coinTxt!: Phaser.GameObjects.Text
  speedTxt!: Phaser.GameObjects.Text
  distTxt!: Phaser.GameObjects.Text
  specialBtnBg!: Phaser.GameObjects.Graphics
  specialBtnTxt!: Phaser.GameObjects.Text
  jumpKey!: Phaser.Input.Keyboard.Key
  upKey!: Phaser.Input.Keyboard.Key
  downKey!: Phaser.Input.Keyboard.Key

  constructor() { super('GameScene') }

  create() {
    const W = this.cameras.main.width

    const stageIdx = runnerState.selectedStage || 0
    this.stage = STAGES[stageIdx]

    this.GROUND_Y = 410
    this.CHAR_X = 80
    this.GRAVITY = 1200
    this.scrollSpeed = this.stage.speed
    this.gameOver = false
    this.score = 0
    this.coins = 0
    this.elapsed = 0

    const ci = runnerState.selectedChar
    this.charIdx = ci
    const charDef = CHARS[ci]
    this.charHPMax = [3, 2, 4, 3][ci]
    this.charHP = this.charHPMax
    this.jumpVY = [-720, -780, -750, -660][ci]
    this.charVY = 0
    this.onGround = true
    this.invincible = false
    this.hasDoubleJump = ci === 1
    this.canDoubleJump = false
    this.specialUsed = false
    this.specialActive = false
    this.magnetActive = false
    this.combo = 0
    this.maxCombo = 0
    this.distance = 0
    this.lastLevelUp = 0
    this.isSliding = false
    this.slideTimer = 0

    makeBg(this, this.stage)

    this.clouds = []
    for (let ci2 = 0; ci2 < 5; ci2++) {
      const cg = this.add.graphics()
      const cs = 12 + Math.random() * 16
      cg.fillStyle(0xffffff, 0.85)
      cg.fillCircle(0, 0, cs)
      cg.fillCircle(cs * 1.1, 0, cs * 0.75)
      cg.fillCircle(-cs * 0.9, 0, cs * 0.65)
      cg.fillCircle(cs * 0.4, -cs * 0.6, cs * 0.8)
      cg.fillCircle(-cs * 0.3, -cs * 0.4, cs * 0.6)
      cg.fillStyle(0xddddff, 0.3)
      cg.fillCircle(0, cs * 0.25, cs * 0.9)
      cg.fillCircle(cs * 0.8, cs * 0.2, cs * 0.6)
      cg.x = Math.random() * W
      cg.y = 40 + Math.random() * 80
      this.clouds.push({ gfx: cg, speed: 15 + Math.random() * 25, x: cg.x })
    }
    this.starActive = false
    this.starCountdown = 0

    this.groundTiles = []
    for (let t = 0; t < 2; t++) {
      const gt = this.add.graphics()
      gt.fillStyle(this.stage.groundColor); gt.fillRect(0, 0, W, 20)
      gt.fillStyle(this.stage.groundDark); gt.fillRect(0, 0, W, 5)
      gt.x = t * W
      gt.y = this.GROUND_Y + 4
      this.groundTiles.push(gt)
    }

    makeCharTexture(this, charDef, 'runner', 3)
    this.charSprite = this.add.image(this.CHAR_X, this.GROUND_Y, 'runner').setOrigin(0.5, 1)
    this._startBobTween()

    this.obstacles = []
    this.coinObjs = []
    this.powerUps = []
    this.powerUpTimer = 0

    this._buildHUD()
    this._buildSpecialBtn(ci)
    this._setupInput()

    this.obstacles = []
    this.coinObjs = []
    this.gameStarted = false
    this.scrollSpeed = 0

    const cdBg = this.add.graphics()
    cdBg.fillStyle(0x000000, 0.5); cdBg.fillRect(0, 0, W, this.cameras.main.height)
    cdBg.setDepth(100)

    const nums = ['3', '2', '1', 'GO!']
    const colors = ['#ffffff', '#ffdd00', '#ff4400', '#44ff44']
    for (let ni = 0; ni < nums.length; ni++) {
      ((idx: number) => {
        this.time.delayedCall(idx * 600, () => {
          const nt = this.add.text(W / 2, this.cameras.main.height / 2, nums[idx], {
            fontSize: idx === 3 ? '60px' : '80px', fontFamily: 'Arial', fontStyle: 'bold',
            color: colors[idx], stroke: '#000000', strokeThickness: 6
          }).setOrigin(0.5).setDepth(101).setScale(2)
          this.tweens.add({
            targets: nt, scale: 1, alpha: 0.3, duration: 500, ease: 'Power2',
            onComplete: () => { nt.destroy() }
          })
          if (idx === 3) {
            this.cameras.main.flash(200, 255, 255, 255)
          }
        })
      })(ni)
    }

    this.time.delayedCall(2400, () => {
      cdBg.destroy()
      this.gameStarted = true
      this.scrollSpeed = this.stage.speed
      this.time.delayedCall(1500, () => {
        this._scheduleNextObstacle()
      })
    })
  }

  _startBobTween() {
    this.tweens.killTweensOf(this.charSprite)
    this.charSprite.setAlpha(1)
    this.tweens.add({
      targets: this.charSprite,
      y: this.GROUND_Y - 4,
      duration: 200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
    })
  }

  _buildHUD() {
    const W = this.cameras.main.width
    const hud = this.add.graphics()
    hud.fillStyle(0x000000, 0.45); hud.fillRect(0, 0, W, 56)

    this.scoreTxt = this.add.text(W / 2, 14, 'SCORE: 0', {
      fontSize: '16px', fontFamily: 'Courier New', fontStyle: 'bold',
      color: '#ffdd00', stroke: '#000', strokeThickness: 2
    }).setOrigin(0.5, 0)

    this.coinTxt = this.add.text(W - 12, 14, 'x0', {
      fontSize: '14px', fontFamily: 'Courier New',
      color: '#ffcc44', stroke: '#000', strokeThickness: 2
    }).setOrigin(1, 0)

    this.speedTxt = this.add.text(W / 2, 36, 'SPEED: 1x', {
      fontSize: '10px', fontFamily: 'Courier New',
      color: '#88ccff', stroke: '#000', strokeThickness: 1
    }).setOrigin(0.5, 0)

    this.distTxt = this.add.text(W / 2, 48, '0m', {
      fontSize: '9px', fontFamily: 'Courier New',
      color: '#aaddaa', stroke: '#000', strokeThickness: 1
    }).setOrigin(0.5, 0)

    this.hpGroup = []
    for (let i = 0; i < this.charHPMax; i++) {
      const heart = this.add.text(12 + i * 22, 14, '\u2665', {
        fontSize: '18px', color: '#ff3344', stroke: '#000', strokeThickness: 2
      })
      this.hpGroup.push(heart)
    }
  }

  _buildSpecialBtn(ci: number) {
    const W = this.cameras.main.width, H = this.cameras.main.height
    const labels = ['SHIELD', 'D-JUMP', 'MAGNET', 'SLOW']
    const colors = [0x2244cc, 0xcc2244, 0x44aa00, 0x887700]

    this.specialBtnBg = this.add.graphics()
    this.specialBtnBg.fillStyle(colors[ci], 0.9)
    this.specialBtnBg.fillRoundedRect(W - 88, H - 62, 80, 48, 8)
    this.specialBtnBg.lineStyle(2, 0xffffff, 0.6)
    this.specialBtnBg.strokeRoundedRect(W - 88, H - 62, 80, 48, 8)

    this.specialBtnTxt = this.add.text(W - 48, H - 38, labels[ci], {
      fontSize: '11px', fontFamily: 'Courier New', fontStyle: 'bold',
      color: '#ffffff', stroke: '#000', strokeThickness: 2
    }).setOrigin(0.5)

    this.add.zone(W - 48, H - 38, 80, 48).setInteractive()
      .on('pointerdown', () => { this._activateSpecial() })
  }

  _setupInput() {
    const W = this.cameras.main.width, H = this.cameras.main.height

    this.input.on('pointerdown', (ptr: Phaser.Input.Pointer) => {
      if (ptr.x > W - 88 && ptr.y > H - 62) return
      this._doJump()
    })

    this.jumpKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.upKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
    this.downKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
  }

  _doJump() {
    if (this.gameOver) return
    if (this.onGround) {
      this.charVY = this.jumpVY
      this.onGround = false
      this.canDoubleJump = this.hasDoubleJump
      this.tweens.killTweensOf(this.charSprite)
      this.charSprite.setAlpha(1)
    } else if (this.canDoubleJump) {
      this.charVY = this.jumpVY * 0.85
      this.canDoubleJump = false
    }
  }

  _scheduleNextObstacle() {
    if (this.gameOver) return
    const diff = Math.floor(this.elapsed / 10000)
    const stageRate = this.stage ? this.stage.spawnRate : 1
    const delay = Math.max(700, (1400 + Math.random() * 1000 - diff * 80) * stageRate)
    this.time.delayedCall(delay, () => {
      this._spawnObstacle()
      this._scheduleNextObstacle()
    })
  }

  _spawnObstacle() {
    const W = this.cameras.main.width
    const H = this.GROUND_Y
    const type = Math.random()
    let startX: number

    if (type < 0.6) {
      const heights = [45, 55, 70, 90]
      const ph = heights[Math.floor(Math.random() * heights.length)]
      const pw = 32
      startX = W + pw
      const py = H - ph

      const g = this.add.graphics()
      g.fillStyle(0x44bb00); g.fillRect(0, 0, pw, ph)
      g.fillStyle(0x33aa00); g.fillRect(pw - 8, 0, 8, ph)
      g.fillStyle(0x66dd22); g.fillRect(0, 0, 5, ph)
      g.fillStyle(0x55cc11); g.fillRect(5, 0, 3, ph)
      g.fillStyle(0x33aa00); g.fillRect(-6, 0, pw + 12, 16)
      g.fillStyle(0x44bb00); g.fillRect(-4, 0, pw + 8, 14)
      g.fillStyle(0x66dd22); g.fillRect(-4, 0, 5, 14)
      g.fillStyle(0x88ee44, 0.3); g.fillRect(6, 16, 3, ph - 16)
      g.fillStyle(0x228800, 0.5); g.fillRect(pw - 3, 16, 3, ph - 16)
      g.x = startX; g.y = py
      this.obstacles.push({ gfx: g, x: startX, y: py, w: pw + 8, h: ph })

    } else if (type < 0.8) {
      startX = W + 30
      const flyY = H - 80 - Math.random() * 80
      const g = this.add.graphics()
      g.fillStyle(0xcc3333); g.fillRect(4, 8, 22, 14)
      g.fillStyle(0xdd4444); g.fillRect(0, 4, 10, 6)
      g.fillRect(20, 4, 10, 6)
      g.fillStyle(0xffffff); g.fillRect(22, 10, 4, 4)
      g.fillStyle(0x000000); g.fillRect(24, 11, 2, 2)
      g.fillStyle(0xff8800); g.fillRect(28, 14, 4, 3)
      g.x = startX; g.y = flyY
      this.obstacles.push({ gfx: g, x: startX, y: flyY, w: 30, h: 22, flying: true })

    } else {
      startX = W + 30
      const rw = 40, rh = 35
      const py = H - rh
      const g = this.add.graphics()
      g.fillStyle(0x888888); g.fillRect(5, 5, rw - 10, rh - 5)
      g.fillStyle(0x777777); g.fillRect(0, 10, rw, rh - 10)
      g.fillStyle(0x999999); g.fillRect(8, 0, rw - 16, 12)
      g.fillStyle(0xaaaaaa, 0.4); g.fillRect(10, 3, 8, 5)
      g.fillStyle(0x666666); g.fillRect(2, rh - 4, rw - 4, 4)
      g.x = startX; g.y = py
      this.obstacles.push({ gfx: g, x: startX, y: py, w: rw, h: rh })
    }

    const coinCount = 3 + Math.floor(Math.random() * 5)
    const coinStartX = W + 100 + Math.random() * 100
    const pattern = Math.random()
    for (let ci = 0; ci < coinCount; ci++) {
      const coinX = coinStartX + ci * 30
      let coinY: number
      if (pattern < 0.4) {
        const t = ci / (coinCount - 1 || 1)
        coinY = this.GROUND_Y - 60 - Math.sin(t * Math.PI) * 120
      } else if (pattern < 0.7) {
        coinY = this.GROUND_Y - 80 - Math.sin(ci * 0.8) * 60
      } else {
        coinY = this.GROUND_Y - 140 - Math.random() * 40
      }
      const cg = this.add.graphics()
      cg.fillStyle(0xffcc00); cg.fillCircle(10, 10, 10)
      cg.fillStyle(0xffee66, 0.7); cg.fillCircle(8, 7, 6)
      cg.fillStyle(0xffffff, 0.4); cg.fillCircle(6, 6, 3)
      cg.lineStyle(2, 0xcc8800); cg.strokeCircle(10, 10, 10)
      cg.fillStyle(0xcc8800, 0.6); cg.fillRect(8, 5, 4, 1); cg.fillRect(8, 9, 4, 1); cg.fillRect(8, 13, 4, 1)
      cg.fillRect(10, 4, 1, 12)
      cg.x = coinX - 10
      cg.y = coinY - 10
      this.coinObjs.push({ gfx: cg, x: coinX, y: coinY, collected: false })
    }

    if (Math.random() < 0.15) {
      const puTypes = ['heart', 'speed']
      const puType = puTypes[Math.floor(Math.random() * puTypes.length)]
      const puX = startX + 150 + Math.random() * 200
      const puY = this.GROUND_Y - 100 - Math.random() * 80
      const pg = this.add.graphics()
      if (puType === 'heart') {
        pg.fillStyle(0xff4488); pg.fillRect(3, 6, 14, 10); pg.fillCircle(6, 6, 5); pg.fillCircle(14, 6, 5)
        pg.fillTriangle(3, 12, 17, 12, 10, 20)
      } else if (puType === 'star') {
        pg.fillStyle(0xffdd00); pg.fillRect(7, 0, 6, 20); pg.fillRect(0, 6, 20, 6)
        pg.fillStyle(0xffff88, 0.5); pg.fillRect(8, 2, 4, 4)
      } else {
        pg.fillStyle(0x44ccff); pg.fillRect(2, 6, 16, 8); pg.fillTriangle(18, 4, 18, 16, 24, 10)
        pg.fillStyle(0x88eeff, 0.5); pg.fillRect(4, 7, 6, 3)
      }
      pg.x = puX; pg.y = puY
      this.powerUps.push({ gfx: pg, x: puX, y: puY, type: puType })
    }
  }

  _activateSpecial() {
    if (this.specialUsed || this.gameOver || this.specialActive) return
    this.specialUsed = true
    this.specialActive = true
    const ci = runnerState.selectedChar
    const W = this.cameras.main.width

    this.specialBtnBg.setAlpha(0.4)
    this.specialBtnTxt.setAlpha(0.4)

    const ring = this.add.graphics()
    ring.lineStyle(3, 0xffffff, 0.9)
    ring.strokeCircle(this.CHAR_X, this.charSprite.y - 36, 50)
    this.tweens.add({
      targets: ring, alpha: 0, duration: 600,
      onComplete: () => { ring.destroy() }
    })

    if (ci === 0) {
      this.invincible = true
      const aura = this.add.graphics()
      aura.fillStyle(0x2244ff, 0.25); aura.fillCircle(0, 0, 50)
      aura.x = this.CHAR_X; aura.y = this.charSprite.y - 36
      this.tweens.add({
        targets: aura, alpha: 0.1, duration: 400, yoyo: true, repeat: 3,
        onComplete: () => { aura.destroy() }
      })
      this.time.delayedCall(3000, () => {
        this.invincible = false; this.specialActive = false
      })

    } else if (ci === 1) {
      this.canDoubleJump = true
      const popup = this.add.text(this.CHAR_X, this.charSprite.y - 80, 'DOUBLE!', {
        fontSize: '14px', fontStyle: 'bold', color: '#ff88cc',
        stroke: '#000', strokeThickness: 2
      }).setOrigin(0.5)
      this.tweens.add({
        targets: popup, y: popup.y - 30, alpha: 0, duration: 800,
        onComplete: () => { popup.destroy() }
      })
      this.time.delayedCall(100, () => { this.specialActive = false })

    } else if (ci === 2) {
      this.magnetActive = true
      const popup2 = this.add.text(this.CHAR_X, this.charSprite.y - 80, 'MAGNET!', {
        fontSize: '14px', fontStyle: 'bold', color: '#ffcc44',
        stroke: '#000', strokeThickness: 2
      }).setOrigin(0.5)
      this.tweens.add({
        targets: popup2, y: popup2.y - 30, alpha: 0, duration: 800,
        onComplete: () => { popup2.destroy() }
      })
      this.time.delayedCall(5000, () => {
        this.magnetActive = false; this.specialActive = false
      })

    } else if (ci === 3) {
      this.scrollSpeed = this.scrollSpeed * 0.4
      const overlay = this.add.graphics()
      overlay.fillStyle(0xffdd00, 0.15)
      overlay.fillRect(0, 0, W, this.cameras.main.height)
      const slowTxt = this.add.text(W / 2, 120, 'SLOW TIME!', {
        fontSize: '20px', fontStyle: 'bold', color: '#ffdd00',
        stroke: '#000', strokeThickness: 3
      }).setOrigin(0.5).setAlpha(0)
      this.tweens.add({
        targets: slowTxt, alpha: 1, duration: 200, yoyo: true, hold: 1000,
        onComplete: () => { slowTxt.destroy() }
      })
      this.time.delayedCall(3000, () => {
        this.scrollSpeed = this.baseScrollSpeed
        overlay.destroy()
        this.specialActive = false
      })
    }
  }

  _takeDamage() {
    if (this.invincible || this.gameOver) return
    this.charHP--
    this._updateHPDisplay()
    if (this.charHP <= 0) {
      this._triggerGameOver()
      return
    }
    this.invincible = true
    this.cameras.main.flash(300, 255, 0, 0)
    this.tweens.add({
      targets: this.charSprite, alpha: 0,
      duration: 120, yoyo: true, repeat: 6,
      onComplete: () => { this.charSprite.setAlpha(1) }
    })
    // bobTweenにkillされても確実にalpha復帰
    this.time.delayedCall(1500, () => {
      this.invincible = false
      this.charSprite.setAlpha(1)
    })
  }

  _updateHPDisplay() {
    for (let i = 0; i < this.hpGroup.length; i++) {
      this.hpGroup[i].setColor(i < this.charHP ? '#ff3344' : '#333355')
    }
  }

  _triggerGameOver() {
    this.gameOver = true
    if (this.charSprite) this.charSprite.clearTint()
    this.charSprite.scaleY = 1
    this.isSliding = false
    this.invincible = false
    this.starActive = false
    this.starCountdown = 0
    const ci = runnerState.selectedChar
    const isNewRecord = HighScore.set(CHARS[ci].id, this.score)
    runnerState.finalScore = this.score
    runnerState.finalCoins = this.coins
    runnerState.finalDistance = Math.floor(this.distance)
    runnerState.finalMaxCombo = this.maxCombo
    runnerState.isNewRecord = isNewRecord
    this.tweens.timeScale = 0.3
    this.time.delayedCall(800, () => {
      this.tweens.timeScale = 1
      this.cameras.main.fade(400, 0, 0, 0)
      this.time.delayedCall(400, () => {
        this.scene.start('GameOverScene')
      })
    })
  }

  update(_time: number, delta: number) {
    if (this.gameOver || !this.gameStarted) return
    const W = this.cameras.main.width
    const H = this.cameras.main.height
    const dt = delta / 1000

    if (Phaser.Input.Keyboard.JustDown(this.jumpKey) ||
        Phaser.Input.Keyboard.JustDown(this.upKey)) {
      this._doJump()
    }

    if (this.downKey.isDown && this.onGround && !this.isSliding) {
      this.isSliding = true
      this.slideTimer = 25
      this.tweens.killTweensOf(this.charSprite)
      this.charSprite.setAlpha(1)
      this.charSprite.scaleY = 0.5
      this.charSprite.y = this.GROUND_Y
    }
    if (this.isSliding) {
      this.slideTimer--
      if (this.slideTimer <= 0 || !this.downKey.isDown) {
        this.isSliding = false
        this.charSprite.scaleY = 1
        if (this.onGround) this._startBobTween()
      }
    }

    for (let ci3 = 0; ci3 < this.clouds.length; ci3++) {
      const cl = this.clouds[ci3]
      cl.x -= cl.speed * dt * 0.3
      if (cl.x < -60) cl.x = W + 60
      cl.gfx.x = cl.x
    }

    if (!this.onGround) {
      this.charVY += this.GRAVITY * dt
      this.charSprite.y += this.charVY * dt
      if (this.charSprite.y >= this.GROUND_Y) {
        this.charSprite.y = this.GROUND_Y
        this.charVY = 0
        this.onGround = true
        this._startBobTween()
      }
    }

    const spd = this.scrollSpeed * dt
    for (let i = 0; i < this.groundTiles.length; i++) {
      this.groundTiles[i].x -= spd
      if (this.groundTiles[i].x <= -W) this.groundTiles[i].x += W * 2
    }

    this.elapsed += delta
    this.baseScrollSpeed = this.stage.speed + Math.floor(this.elapsed / 10000) * 15
    if (!this.specialActive || this.charIdx !== 3) {
      this.scrollSpeed = this.baseScrollSpeed
    }
    this.scoreTxt.setText('SCORE: ' + this.score)
    if (this.combo > 1) {
      this.scoreTxt.setText('SCORE: ' + this.score + '  x' + this.combo + ' COMBO!')
    }
    const speedLevel = Math.floor((this.scrollSpeed - 260) / 30) + 1
    this.speedTxt.setText('SPEED: ' + Math.max(1, speedLevel) + 'x')

    this.distance += this.scrollSpeed * dt * 0.1
    this.distTxt.setText(Math.floor(this.distance) + 'm')

    const lvl = Math.floor(this.score / 1000)
    if (lvl > this.lastLevelUp && this.score > 0) {
      this.lastLevelUp = lvl
      this.cameras.main.flash(150, 100, 255, 100)
      const lvTxt = this.add.text(W / 2, H / 2 - 40, 'LEVEL ' + (lvl + 1) + '!', {
        fontSize: '28px', fontStyle: 'bold', color: '#44ff88',
        stroke: '#000', strokeThickness: 4
      }).setOrigin(0.5).setAlpha(0)
      this.tweens.add({ targets: lvTxt, alpha: 1, y: H / 2 - 60, duration: 400, ease: 'Back.easeOut' })
      this.time.delayedCall(1000, () => {
        this.tweens.add({
          targets: lvTxt, alpha: 0, duration: 400,
          onComplete: () => { lvTxt.destroy() }
        })
      })
    }

    if (this.starActive) {
      this.starCountdown--
      if (this.starCountdown > 60 || this.starCountdown % 6 < 3) {
        this.charSprite.setTint(0xffff44)
      } else {
        this.charSprite.clearTint()
      }
      if (this.starCountdown <= 0) {
        this.starActive = false
        this.invincible = false
        this.charSprite.clearTint()
      }
    }

    for (let oi = this.obstacles.length - 1; oi >= 0; oi--) {
      const obs = this.obstacles[oi]
      obs.x -= spd
      obs.gfx.x = obs.x
      if (!obs.scored && obs.x + obs.w < this.CHAR_X) {
        obs.scored = true
        this.combo++
        if (this.combo > this.maxCombo) this.maxCombo = this.combo
        const pts = 100 * Math.min(this.combo, 5)
        this.score += pts
        if (this.combo >= 3) {
          this.cameras.main.flash(100, 255, 255, 100)
        }
        const pTxt = this.add.text(this.CHAR_X + 40, this.charSprite.y - 60,
          '+' + pts + (this.combo > 1 ? ' x' + this.combo + '!' : ''), {
          fontSize: (this.combo > 2 ? '22px' : '15px'), fontStyle: 'bold',
          color: this.combo >= 4 ? '#ff2222' : this.combo >= 2 ? '#ff8844' : '#ffdd00',
          stroke: '#000', strokeThickness: 3
        }).setOrigin(0.5)
        this.tweens.add({
          targets: pTxt, y: pTxt.y - 50, alpha: 0, duration: 800,
          onComplete: () => { pTxt.destroy() }
        })
      }
      if (obs.x + obs.w < 0) {
        obs.gfx.destroy()
        this.obstacles.splice(oi, 1)
        continue
      }
      if (!this.invincible) {
        const ppx = this.CHAR_X, py = this.charSprite.y
        const pw2 = 20, ph2 = this.isSliding ? 25 : 55
        const charLeft = ppx - pw2, charRight = ppx + pw2
        const charTop = py - ph2, charBottom = py
        const obsLeft = obs.x, obsRight = obs.x + obs.w
        const obsTop = obs.y, obsBottom = obs.y + obs.h
        if (charRight > obsLeft && charLeft < obsRight &&
            charBottom > obsTop && charTop < obsBottom) {
          this._takeDamage()
          this.combo = 0
        }
      }
    }

    for (let ci2 = this.coinObjs.length - 1; ci2 >= 0; ci2--) {
      const coin = this.coinObjs[ci2]
      if (coin.collected) continue
      coin.x -= spd
      coin.gfx.x = coin.x - 10
      if (coin.x < -20) {
        coin.gfx.destroy()
        this.coinObjs.splice(ci2, 1)
        continue
      }
      if (this.magnetActive) {
        const mdx = this.CHAR_X - coin.x
        const mdy = (this.charSprite.y - 36) - coin.y
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy)
        if (mdist < 200) {
          coin.x += mdx * 0.12
          coin.y += mdy * 0.12
        }
      }
      const ccx = this.CHAR_X, ccy = this.charSprite.y - 36
      if (Math.abs(coin.x - ccx) < 36 && Math.abs(coin.y - ccy) < 36) {
        coin.collected = true
        coin.gfx.destroy()
        this.coinObjs.splice(ci2, 1)
        this.coins++
        this.score += COIN_VALUE
        this.coinTxt.setText('x' + this.coins)
        const popup = this.add.text(this.CHAR_X + 20, this.charSprite.y - 60, '+' + COIN_VALUE, {
          fontSize: '16px', fontStyle: 'bold', color: '#ffdd00',
          stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5)
        this.tweens.add({
          targets: popup, y: popup.y - 40, alpha: 0, duration: 600,
          onComplete: () => { popup.destroy() }
        })
      }
    }

    for (let pi = this.powerUps.length - 1; pi >= 0; pi--) {
      const pu = this.powerUps[pi]
      pu.x -= spd
      pu.gfx.x = pu.x
      if (pu.x < -30) {
        pu.gfx.destroy()
        this.powerUps.splice(pi, 1)
        continue
      }
      const pdx = Math.abs(pu.x - this.CHAR_X)
      const pdy = Math.abs(pu.y - (this.charSprite.y - 36))
      if (pdx < 30 && pdy < 30) {
        pu.gfx.destroy()
        this.powerUps.splice(pi, 1)
        let puLabel = ''
        if (pu.type === 'heart' && this.charHP < this.charHPMax) {
          this.charHP++
          this._updateHPDisplay()
          puLabel = 'HP UP!'
          this.cameras.main.flash(100, 255, 100, 100)
        } else if (pu.type === 'star') {
          this.invincible = true
          this.starActive = true
          this.starCountdown = 180
          puLabel = 'STAR!'
          this.cameras.main.flash(100, 255, 255, 100)
        } else if (pu.type === 'speed') {
          this.score += 200
          puLabel = '+200!'
          this.cameras.main.flash(100, 100, 200, 255)
        } else {
          puLabel = 'GET!'
        }
        const puTxt = this.add.text(this.CHAR_X, this.charSprite.y - 70, puLabel, {
          fontSize: '18px', fontStyle: 'bold', color: '#44ffaa',
          stroke: '#000', strokeThickness: 3
        }).setOrigin(0.5)
        this.tweens.add({
          targets: puTxt, y: puTxt.y - 40, alpha: 0, duration: 700,
          onComplete: () => { puTxt.destroy() }
        })
      }
    }
  }
}

/* ── GameOverScene ── */
class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOverScene') }
  create() {
    const W = this.cameras.main.width, H = this.cameras.main.height
    const ci = runnerState.selectedChar
    const charDef = CHARS[ci]
    makeBg(this)

    makeCharTexture(this, charDef, 'go_char', 4)
    this.add.image(W * 0.22, H * 0.45, 'go_char').setOrigin(0.5)

    const goTxt = this.add.text(W * 0.6, H * 0.15, 'GAME OVER', {
      fontSize: '36px', fontFamily: 'Arial', fontStyle: 'bold',
      color: '#ff2200', stroke: '#000000', strokeThickness: 6
    }).setOrigin(0.5).setAlpha(0)
    this.tweens.add({ targets: goTxt, alpha: 1, duration: 400, ease: 'Back.easeOut' })

    this.add.text(W * 0.6, H * 0.32, 'SCORE: ' + runnerState.finalScore, {
      fontSize: '26px', fontFamily: 'Courier New', fontStyle: 'bold',
      color: '#ffdd00', stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5)

    this.add.text(W * 0.6, H * 0.42, 'COINS: ' + runnerState.finalCoins + '    DIST: ' + runnerState.finalDistance + 'm', {
      fontSize: '12px', fontFamily: 'Courier New',
      color: '#ffcc44', stroke: '#000', strokeThickness: 2
    }).setOrigin(0.5)

    this.add.text(W * 0.6, H * 0.50, 'MAX COMBO: x' + runnerState.finalMaxCombo, {
      fontSize: '12px', fontFamily: 'Courier New',
      color: runnerState.finalMaxCombo >= 5 ? '#ff4488' : '#88ccff', stroke: '#000', strokeThickness: 2
    }).setOrigin(0.5)

    const hs = HighScore.get(charDef.id)
    const hsColor = runnerState.isNewRecord ? '#44ff88' : '#aabbdd'
    const hsLabel = runnerState.isNewRecord ? '\u2605 NEW RECORD! ' : 'BEST: '
    this.add.text(W * 0.6, H * 0.58, hsLabel + hs, {
      fontSize: '14px', fontFamily: 'Courier New',
      color: hsColor, stroke: '#000', strokeThickness: 2
    }).setOrigin(0.5)

    makeBtn(this, W * 0.6, H * 0.72, 180, 46, 0xdd2200, 'RETRY', '16px')
    this.add.zone(W * 0.6, H * 0.72, 180, 46).setInteractive().on('pointerdown', () => {
      this.cameras.main.flash(200, 255, 255, 255)
      this.time.delayedCall(180, () => { this.scene.start('GameScene') })
    })

    makeBtn(this, W * 0.6, H * 0.86, 180, 40, 0x1a3a8f, 'キャラ変更', '13px')
    this.add.zone(W * 0.6, H * 0.86, 180, 40).setInteractive().on('pointerdown', () => {
      this.scene.start('CharSelectScene')
    })
  }
}

/* ── Phaser Config ── */
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 640,
  height: 480,
  backgroundColor: '#5c94fc',
  scene: [TitleScene, CharSelectScene, StageSelectScene, GameScene, GameOverScene],
  parent: document.body,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
}

new Phaser.Game(config)
