// ===== ROOM DRAWING FUNCTIONS =====
import { ROOMS, ROOM_CHARS, COLORS, TILE, COLS, ROWS, SCALE, selectChars } from './rooms'
import { type TimeOfDay, getOverlay, getWindowColor, getWindowGlow } from './time-of-day'
import { drawStreetFront, drawStreetBack, drawFlowerShop, drawRamenShop } from './street-draw'

export interface Player {
  x: number
  y: number
  dir: number
  frame: number
  walkTimer: number
  charIdx: number
}

export interface DrawState {
  rc: CanvasRenderingContext2D
  currentRoom: number
  room: number[]
  player: Player
  selectIdx: number
  RW: number
  RH: number
  mapScale: number
  mapOpen: boolean
  timeOfDay: TimeOfDay
}

// ミニマップのヘッダー（トグルボタン）の矩形を返す（論理座標系）
export function getMapHeaderRect(mapScale: number): { x: number; y: number; w: number; h: number } {
  const ms = mapScale
  const bw = Math.floor(24 * ms)
  const gap = Math.floor(2 * ms)
  const mTotalW = bw * 2 + gap
  const headerH = Math.max(8, Math.floor(9 * ms))
  const mapX = COLS * TILE - mTotalW - 4
  return { x: mapX, y: 3, w: mTotalW, h: headerH }
}

function getTile(room: number[], tx: number, ty: number): number {
  if (tx < 0 || tx >= COLS || ty < 0 || ty >= ROWS) return 1
  return room[ty * COLS + tx]
}

export function drawRoom(s: DrawState): void {
  const { rc, currentRoom, player, RW, RH } = s
  const rtype = ROOMS[currentRoom].type
  rc.fillStyle = rtype === 'tatami' ? COLORS.floor1 : rtype === 'engawa' ? '#c0a070' : rtype === 'bath' ? '#d0e0e8' : rtype === 'street' ? '#555555' : '#b09070'
  rc.fillRect(0, 0, RW/SCALE, RH/SCALE)

  // Draw tiles
  for (let ty = 0; ty < ROWS; ty++) {
    for (let tx = 0; tx < COLS; tx++) {
      const t = getTile(s.room, tx, ty)
      const px = tx * TILE, py = ty * TILE

      if (t === 0 || t === 4 || t === 7) {
        const isAlt = ((tx + ty) % 2 === 0)
        rc.fillStyle = isAlt ? COLORS.floor1 : COLORS.floor2
        rc.fillRect(px, py, TILE, TILE)
        rc.fillStyle = COLORS.tatami_edge
        rc.fillRect(px, py, TILE, 1)
        rc.fillRect(px, py, 1, TILE)
        rc.fillStyle = isAlt ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)'
        for (let dx = 1; dx < TILE; dx += 3) rc.fillRect(px + dx, py + 1, 1, TILE - 2)

        if (t === 4) {
          rc.fillStyle = '#8a7a8a'
          rc.fillRect(px + 1, py + 1, 14, 14)
          rc.fillStyle = '#6a5a6a'
          rc.fillRect(px + 1, py + 11, 14, 4)
          rc.fillRect(px + 12, py + 1, 3, 14)
          rc.fillStyle = '#9a8a9a'
          rc.fillRect(px + 2, py + 2, 10, 4)
          rc.fillStyle = '#a89a80'
          rc.fillRect(px + 1, py + 1, 2, 2)
          rc.fillRect(px + 13, py + 1, 2, 2)
          rc.fillRect(px + 1, py + 13, 2, 2)
          rc.fillRect(px + 13, py + 13, 2, 2)
          rc.fillStyle = '#7a6a7a'
          rc.fillRect(px + 6, py + 6, 4, 4)
          rc.fillStyle = '#8a7a8a'
          rc.fillRect(px + 7, py + 7, 2, 2)
        }
        if (t === 7) {
          rc.fillStyle = '#8a5533'
          rc.fillRect(px, py, TILE, TILE)
          rc.fillStyle = '#9a6540'
          rc.fillRect(px + 1, py + 1, TILE - 2, TILE - 2)
          rc.fillStyle = '#7a4828'
          rc.fillRect(px + 3, py + 3, TILE - 6, 1)
          rc.fillRect(px + 3, py + TILE - 4, TILE - 6, 1)
          rc.fillRect(px + 3, py + 3, 1, TILE - 6)
          rc.fillRect(px + TILE - 4, py + 3, 1, TILE - 6)
        }
      } else if (t === 1) {
        const wc1 = rtype === 'bath' ? '#b0c4cc' : rtype === 'wood' ? '#5a4a3a' : rtype === 'engawa' ? '#6a5a40' : rtype === 'street' ? '#8a7a6a' : '#4a3a22'
        const wc2 = rtype === 'bath' ? '#90a4ac' : rtype === 'wood' ? '#4a3a2a' : rtype === 'engawa' ? '#5a4a30' : rtype === 'street' ? '#7a6a5a' : '#3a2a18'
        if (ty === 0 || ty === ROWS - 1) {
          rc.fillStyle = wc1
          rc.fillRect(px, py, TILE, TILE)
          rc.fillStyle = wc2
          rc.fillRect(px, py + TILE - 2, TILE, 2)
        } else if (tx === 0 || tx === COLS - 1) {
          rc.fillStyle = wc1
          rc.fillRect(px, py, TILE, TILE)
          rc.fillStyle = wc2
          rc.fillRect(px + 4, py + 2, 1, 12)
        } else {
          rc.fillStyle = wc1
          rc.fillRect(px, py, TILE, TILE)
        }
      } else if (t === 2) {
        rc.fillStyle = '#4a3a22'
        rc.fillRect(px, py, TILE, TILE)
        rc.fillStyle = '#554830'
        rc.fillRect(px + 6, py + 3, 1, 10)
      } else if (t === 3) {
        rc.fillStyle = COLORS.floor1
        rc.fillRect(px, py, TILE, TILE)
        rc.fillStyle = '#7a5830'
        rc.fillRect(px, py + 2, TILE, TILE - 4)
        rc.fillStyle = '#8a6838'
        rc.fillRect(px, py + 2, TILE, 3)
        rc.fillStyle = '#6a4820'
        rc.fillRect(px, py + TILE - 4, TILE, 2)
        if (tx === 6 && ty === 5) {
          rc.fillStyle = '#eee'
          rc.fillRect(px + 5, py + 5, 4, 5)
          rc.fillStyle = '#bbd'
          rc.fillRect(px + 5, py + 5, 4, 2)
          rc.fillStyle = '#daa'
          rc.fillRect(px + 6, py + 3, 2, 3)
        }
      } else if (t === 5) {
        rc.fillStyle = '#4a3a22'
        rc.fillRect(px, py, TILE, TILE)
        rc.fillStyle = '#6a5030'
        rc.fillRect(px, py + 2, TILE, 13)
        rc.fillStyle = '#7a6038'
        rc.fillRect(px, py + 2, TILE, 2)
        rc.fillStyle = '#5a4028'
        rc.fillRect(px, py + 8, TILE, 1)
        rc.fillStyle = '#cc3333'
        rc.fillRect(px + 1, py + 3, 3, 5)
        rc.fillStyle = '#3366cc'
        rc.fillRect(px + 5, py + 4, 3, 4)
        rc.fillStyle = '#339933'
        rc.fillRect(px + 9, py + 3, 3, 5)
        rc.fillStyle = '#cc9933'
        rc.fillRect(px + 13, py + 4, 2, 4)
        rc.fillStyle = '#9944aa'
        rc.fillRect(px + 2, py + 9, 4, 5)
        rc.fillStyle = '#cc6633'
        rc.fillRect(px + 7, py + 10, 3, 4)
        rc.fillStyle = '#448899'
        rc.fillRect(px + 11, py + 9, 3, 5)
      } else if (t === 6) {
        rc.fillStyle = COLORS.floor1
        rc.fillRect(px, py, TILE, TILE)
        rc.fillStyle = '#aa5522'
        rc.fillRect(px + 3, py + 9, 10, 6)
        rc.fillStyle = '#cc6633'
        rc.fillRect(px + 2, py + 9, 12, 2)
        rc.fillStyle = '#553311'
        rc.fillRect(px + 4, py + 9, 8, 2)
        rc.fillStyle = '#33aa33'
        rc.fillRect(px + 5, py + 1, 6, 9)
        rc.fillRect(px + 2, py + 3, 4, 6)
        rc.fillRect(px + 10, py + 2, 4, 7)
        rc.fillStyle = '#44cc44'
        rc.fillRect(px + 6, py + 2, 4, 4)
        rc.fillRect(px + 3, py + 4, 3, 3)
        rc.fillRect(px + 11, py + 3, 2, 4)
        rc.fillStyle = '#227722'
        rc.fillRect(px + 7, py + 5, 2, 5)
      } else if (t === 8) {
        rc.fillStyle = rtype === 'tatami' ? COLORS.floor1 : '#b09070'
        rc.fillRect(px, py, TILE, TILE)
        rc.fillStyle = '#666'
        rc.fillRect(px + 7, py + 5, 2, 10)
        rc.fillStyle = '#555'
        rc.fillRect(px + 4, py + 13, 8, 3)
        rc.fillStyle = '#e8d0a0'
        rc.fillRect(px + 3, py + 1, 10, 6)
        rc.fillStyle = '#d4c088'
        rc.fillRect(px + 3, py + 5, 10, 2)
        rc.fillStyle = 'rgba(255,240,200,0.15)'
        rc.fillRect(px - 2, py - 2, TILE + 4, TILE + 4)
      } else if (t >= 9 && t <= 12) {
        const flr = rtype === 'tatami' ? COLORS.floor1 : rtype === 'engawa' ? '#c0a070' : '#b09070'
        rc.fillStyle = flr
        rc.fillRect(px, py, TILE, TILE)
        if (currentRoom === 0 && t === 12) {
          rc.fillStyle = '#6a5030'
          rc.fillRect(px, py, TILE, TILE)
          rc.fillStyle = '#88bbee'
          rc.fillRect(px+2, py+2, 5, 12)
          rc.fillRect(px+9, py+2, 5, 12)
          rc.fillStyle = '#7a6038'
          rc.fillRect(px+7, py+1, 2, 14)
          rc.fillRect(px+1, py+7, 14, 2)
          rc.fillStyle = '#55aa55'
          rc.fillRect(px+2, py+9, 5, 5)
          rc.fillRect(px+9, py+9, 5, 5)
        } else {
          rc.fillStyle = '#886644'
          rc.fillRect(px + 2, py + 2, 12, 12)
          rc.fillStyle = '#775533'
          rc.fillRect(px + 3, py + 3, 10, 10)
          rc.fillStyle = '#ddc'
          if (t===9) { rc.fillRect(px+9,py+6,4,4); rc.fillRect(px+7,py+7,3,2) }
          if (t===10) { rc.fillRect(px+3,py+6,4,4); rc.fillRect(px+6,py+7,3,2) }
          if (t===11) { rc.fillRect(px+6,py+9,4,4); rc.fillRect(px+7,py+7,2,3) }
          if (t===12) { rc.fillRect(px+6,py+3,4,4); rc.fillRect(px+7,py+6,2,3) }
        }
      } else if (t === 20) {
        rc.fillStyle = '#b09070'
        rc.fillRect(px, py, TILE, TILE)
        rc.fillStyle = '#a08060'
        rc.fillRect(px, py, TILE, 1)
        rc.fillStyle = '#c0a080'
        rc.fillRect(px, py + TILE - 1, TILE, 1)
        rc.fillStyle = 'rgba(0,0,0,0.03)'
        rc.fillRect(px + ((tx * 5) % 7) + 2, py, 1, TILE)
      } else if (t === 21) {
        rc.fillStyle = '#b09070'
        rc.fillRect(px, py, TILE, TILE)
        rc.fillStyle = '#6a4430'
        rc.fillRect(px + 1, py + 1, 14, 5)
        rc.fillStyle = '#7a5440'
        rc.fillRect(px + 2, py + 2, 12, 3)
        rc.fillStyle = '#8a6450'
        rc.fillRect(px + 1, py + 6, 14, 8)
        rc.fillStyle = '#9a7460'
        rc.fillRect(px + 2, py + 7, 5, 6)
        rc.fillRect(px + 9, py + 7, 5, 6)
        rc.fillStyle = '#aa8470'
        rc.fillRect(px + 3, py + 8, 3, 2)
        rc.fillRect(px + 10, py + 8, 3, 2)
        rc.fillStyle = '#5a3420'
        rc.fillRect(px + 0, py + 1, 2, 13)
        rc.fillRect(px + 14, py + 1, 2, 13)
      } else if (t === 22) {
        rc.fillStyle = '#b09070'
        rc.fillRect(px, py, TILE, TILE)
        rc.fillStyle = '#5a4020'
        rc.fillRect(px + 1, py + 4, 14, 10)
        rc.fillStyle = '#6a5030'
        rc.fillRect(px + 1, py + 4, 14, 2)
        rc.fillStyle = '#222'
        rc.fillRect(px + 3, py + 6, 8, 7)
        rc.fillStyle = '#111'
        rc.fillRect(px + 4, py + 7, 6, 5)
        rc.fillStyle = '#c44'
        rc.fillRect(px + 6, py + 9, 2, 2)
        rc.fillStyle = '#aaa'
        rc.fillRect(px + 11, py + 5, 1, 6)
        rc.fillRect(px + 10, py + 5, 2, 1)
      } else if (t === 23) {
        rc.fillStyle = '#c0a070'
        rc.fillRect(px, py, TILE, TILE)
        rc.fillStyle = '#b09060'
        rc.fillRect(px, py, TILE, 1)
        rc.fillStyle = '#a08050'
        rc.fillRect(px, py + 8, TILE, 1)
      } else if (t === 24) {
        // 庭の草（時間帯で色が変わる）
        const gardenBase = s.timeOfDay === 'evening' ? '#558833' : s.timeOfDay === 'night' ? '#223322' : '#55aa44'
        const gardenLight = s.timeOfDay === 'evening' ? '#669944' : s.timeOfDay === 'night' ? '#334433' : '#66bb55'
        rc.fillStyle = gardenBase
        rc.fillRect(px, py, TILE, TILE)
        rc.fillStyle = gardenLight
        rc.fillRect(px + ((tx*3+ty*5)%5), py + ((tx+ty*3)%6), 4, 3)
        rc.fillRect(px + ((tx*7)%9), py + ((ty*4)%8)+4, 3, 4)
        if ((tx + ty) % 5 === 0) {
          rc.fillStyle = '#ff88aa'
          rc.fillRect(px + 6, py + 4, 3, 3)
          rc.fillStyle = '#ffaa66'
          rc.fillRect(px + 7, py + 5, 1, 1)
        }
        if ((tx * 3 + ty) % 7 === 0) {
          rc.fillStyle = '#999'
          rc.fillRect(px + 3, py + 8, 5, 4)
          rc.fillStyle = '#aaa'
          rc.fillRect(px + 3, py + 8, 5, 2)
        }
      } else if (t === 25) {
        rc.fillStyle = '#b09070'
        rc.fillRect(px, py, TILE, TILE)
        rc.fillStyle = '#e0ddd5'
        rc.fillRect(px + 1, py + 0, 14, 16)
        rc.fillStyle = '#d5d0c8'
        rc.fillRect(px + 1, py + 0, 14, 6)
        rc.fillStyle = '#bbb'
        rc.fillRect(px + 1, py + 6, 14, 1)
        rc.fillStyle = '#888'
        rc.fillRect(px + 13, py + 2, 2, 3)
        rc.fillRect(px + 13, py + 8, 2, 5)
        rc.fillStyle = '#eee'
        rc.fillRect(px + 2, py + 1, 10, 1)
        rc.fillRect(px + 2, py + 7, 10, 1)
        rc.fillStyle = '#e44'
        rc.fillRect(px + 3, py + 8, 3, 2)
        rc.fillStyle = '#44a'
        rc.fillRect(px + 7, py + 9, 3, 2)
      } else if (t === 26) {
        rc.fillStyle = '#b09070'
        rc.fillRect(px, py, TILE, TILE)
        rc.fillStyle = '#c0bbb5'
        rc.fillRect(px + 0, py + 1, 16, 14)
        rc.fillStyle = '#aaa5a0'
        rc.fillRect(px + 0, py + 12, 16, 3)
        rc.fillStyle = '#444'
        rc.fillRect(px + 1, py + 2, 6, 6)
        rc.fillStyle = '#666'
        rc.fillRect(px + 2, py + 3, 4, 4)
        rc.fillStyle = '#555'
        rc.fillRect(px + 3, py + 4, 2, 2)
        rc.fillStyle = '#444'
        rc.fillRect(px + 9, py + 2, 6, 6)
        rc.fillStyle = '#666'
        rc.fillRect(px + 10, py + 3, 4, 4)
        rc.fillStyle = '#555'
        rc.fillRect(px + 11, py + 4, 2, 2)
        rc.fillStyle = '#48f'
        rc.fillRect(px + 3, py + 3, 1, 1)
        rc.fillRect(px + 11, py + 3, 1, 1)
        rc.fillStyle = '#333'
        rc.fillRect(px + 3, py + 10, 3, 2)
        rc.fillRect(px + 10, py + 10, 3, 2)
      } else if (t === 27) {
        rc.fillStyle = '#b09070'
        rc.fillRect(px, py, TILE, TILE)
        rc.fillStyle = '#c0bbb5'
        rc.fillRect(px + 0, py + 1, 16, 14)
        rc.fillStyle = '#99bbdd'
        rc.fillRect(px + 2, py + 3, 12, 9)
        rc.fillStyle = '#88aacc'
        rc.fillRect(px + 3, py + 4, 10, 7)
        rc.fillStyle = '#aaddee'
        rc.fillRect(px + 5, py + 5, 3, 1)
        rc.fillRect(px + 9, py + 7, 2, 1)
        rc.fillStyle = '#999'
        rc.fillRect(px + 7, py + 0, 3, 4)
        rc.fillStyle = '#bbb'
        rc.fillRect(px + 6, py + 0, 5, 1)
        rc.fillStyle = '#aaddff'
        rc.fillRect(px + 8, py + 4, 1, 1)
      } else if (t === 28) {
        const engFlr = '#c0a070'
        rc.fillStyle = engFlr
        rc.fillRect(px, py, TILE, TILE)
        rc.fillStyle = '#f90'
        rc.fillRect(px + 3, py + 6, 10, 6)
        rc.fillRect(px + 2, py + 8, 3, 4)
        rc.fillRect(px + 10, py + 4, 5, 5)
        rc.fillRect(px + 10, py + 3, 2, 2)
        rc.fillRect(px + 13, py + 3, 2, 2)
        rc.fillStyle = '#e80'
        rc.fillRect(px + 1, py + 7, 3, 2)
        rc.fillStyle = '#333'
        rc.fillRect(px + 11, py + 6, 2, 1)
        rc.fillRect(px + 13, py + 6, 1, 1)
      } else if (t === 32) {
        const tAlt = ((tx + ty) % 2 === 0)
        rc.fillStyle = tAlt ? '#d8e8f0' : '#c0d4e0'
        rc.fillRect(px, py, TILE, TILE)
        rc.fillStyle = '#b0c4d0'
        rc.fillRect(px, py, TILE, 1)
        rc.fillRect(px, py, 1, TILE)
      } else if (t === 29) {
        const tAlt2 = ((tx + ty) % 2 === 0)
        rc.fillStyle = tAlt2 ? '#d8e8f0' : '#c0d4e0'
        rc.fillRect(px, py, TILE, TILE)
        rc.fillStyle = '#ddd'
        rc.fillRect(px + 1, py + 1, 14, 14)
        rc.fillStyle = '#eee'
        rc.fillRect(px + 2, py + 2, 12, 12)
        rc.fillStyle = '#a0d8f0'
        rc.fillRect(px + 3, py + 3, 10, 10)
        rc.fillStyle = '#b0e0f8'
        rc.fillRect(px + 4, py + 4, 4, 3)
        rc.fillStyle = 'rgba(255,255,255,0.3)'
        rc.fillRect(px + 5, py + 0, 2, 3)
        rc.fillRect(px + 9, py + 1, 2, 2)
      } else if (t === 30) {
        const tAlt3 = ((tx + ty) % 2 === 0)
        rc.fillStyle = tAlt3 ? '#d8e8f0' : '#c0d4e0'
        rc.fillRect(px, py, TILE, TILE)
        // 上タイル=タンク部分、下タイル=便座部分
        const isTop = (getTile(s.room, tx, ty - 1) !== 30)
        if (isTop) {
          // タンク（奥側）
          rc.fillStyle = '#e0e0e0'
          rc.fillRect(px + 3, py + 2, 10, 12)
          rc.fillStyle = '#eee'
          rc.fillRect(px + 4, py + 3, 8, 10)
          // タンクの蓋ライン
          rc.fillStyle = '#ccc'
          rc.fillRect(px + 3, py + 2, 10, 2)
          // レバー
          rc.fillStyle = '#aaa'
          rc.fillRect(px + 11, py + 4, 2, 3)
          rc.fillStyle = '#bbb'
          rc.fillRect(px + 11, py + 4, 2, 1)
        } else {
          // 便座（手前側）
          rc.fillStyle = '#eee'
          rc.fillRect(px + 2, py + 0, 12, 14)
          // 便座の丸み（角を削る）
          rc.fillStyle = tAlt3 ? '#d8e8f0' : '#c0d4e0'
          rc.fillRect(px + 2, py + 0, 2, 2)
          rc.fillRect(px + 12, py + 0, 2, 2)
          rc.fillRect(px + 2, py + 12, 2, 2)
          rc.fillRect(px + 12, py + 12, 2, 2)
          // 便座リング
          rc.fillStyle = '#f4f4f4'
          rc.fillRect(px + 3, py + 1, 10, 12)
          // 中（穴）
          rc.fillStyle = '#bbddee'
          rc.fillRect(px + 5, py + 2, 6, 8)
          rc.fillStyle = '#aaccdd'
          rc.fillRect(px + 6, py + 3, 4, 6)
          // 蓋のヒンジ
          rc.fillStyle = '#ccc'
          rc.fillRect(px + 6, py + 0, 4, 1)
        }
      } else if (t === 31) {
        const tAlt4 = ((tx + ty) % 2 === 0)
        rc.fillStyle = tAlt4 ? '#d8e8f0' : '#c0d4e0'
        rc.fillRect(px, py, TILE, TILE)
        rc.fillStyle = '#ddd'
        rc.fillRect(px + 1, py + 3, 14, 10)
        rc.fillStyle = '#eee'
        rc.fillRect(px + 2, py + 4, 12, 8)
        rc.fillStyle = '#b8d8e8'
        rc.fillRect(px + 4, py + 6, 8, 5)
        rc.fillStyle = '#a0c8d8'
        rc.fillRect(px + 5, py + 7, 6, 3)
        rc.fillStyle = '#aaa'
        rc.fillRect(px + 7, py + 3, 2, 4)
        rc.fillStyle = '#ccc'
        rc.fillRect(px + 6, py + 3, 4, 1)
        rc.fillStyle = '#aaccdd'
        rc.fillRect(px + 4, py + 0, 8, 4)
        rc.fillStyle = '#bbddee'
        rc.fillRect(px + 5, py + 1, 6, 2)
      } else if (t === 40) {
        // 道路（アスファルト）
        rc.fillStyle = '#555'
        rc.fillRect(px, py, TILE, TILE)
        rc.fillStyle = '#4a4a4a'
        rc.fillRect(px, py, TILE, 1)
        // 中央線（点線）
        if (tx % 3 === 0) {
          rc.fillStyle = '#cc8'
          rc.fillRect(px + 4, py + 7, 8, 2)
        }
      } else if (t === 41) {
        // 歩道（レンガ風）
        rc.fillStyle = '#c8b8a0'
        rc.fillRect(px, py, TILE, TILE)
        rc.fillStyle = '#b8a890'
        rc.fillRect(px, py, TILE, 1)
        rc.fillRect(px, py, 1, TILE)
        // レンガパターン
        rc.fillStyle = '#baa888'
        const offset = (ty % 2 === 0) ? 0 : 8
        rc.fillRect(px + offset, py + 4, 8, 1)
        rc.fillRect(px + offset, py + 12, 8, 1)
        rc.fillRect(px + offset + 8, py, 1, TILE)
      }
    }
  }

  // ===== Room-specific decorations =====
  if (currentRoom === 0) {
    // TV (pixel art, 2 tiles wide, at cols 5-6 row 2)
    const tvX = 5 * TILE, tvY = 2 * TILE - 2
    const tvW = 32, tvH = 18
    rc.fillStyle = '#5a4028'
    rc.fillRect(tvX - 2, tvY + tvH - 2, tvW + 4, 8)
    rc.fillStyle = '#6a5030'
    rc.fillRect(tvX - 2, tvY + tvH - 2, tvW + 4, 2)
    rc.fillStyle = '#4a3018'
    rc.fillRect(tvX, tvY + tvH + 5, 4, 3)
    rc.fillRect(tvX + tvW - 4, tvY + tvH + 5, 4, 3)
    rc.fillStyle = '#5c3a20'
    rc.fillRect(tvX, tvY, tvW, tvH)
    rc.fillStyle = '#6a4828'
    rc.fillRect(tvX, tvY, tvW, 2)
    rc.fillRect(tvX, tvY, 2, tvH)
    rc.fillStyle = '#3a2210'
    rc.fillRect(tvX, tvY + tvH - 2, tvW, 2)
    rc.fillRect(tvX + tvW - 2, tvY, 2, tvH)
    rc.fillStyle = '#0a1a0a'
    rc.fillRect(tvX + 2, tvY + 2, 20, 14)
    rc.fillStyle = '#2a5a3a'
    rc.fillRect(tvX + 3, tvY + 3, 18, 12)
    rc.fillStyle = 'rgba(150,255,180,0.1)'
    rc.fillRect(tvX + 3, tvY + 3, 18, 4)
    for (let sl = tvY + 4; sl < tvY + 15; sl += 2) {
      rc.fillStyle = 'rgba(0,0,0,0.1)'
      rc.fillRect(tvX + 3, sl, 18, 1)
    }
    rc.fillStyle = '#b0a898'
    rc.fillRect(tvX + 24, tvY + 2, 6, 14)
    rc.fillStyle = '#c8c0b0'
    rc.fillRect(tvX + 24, tvY + 2, 6, 2)
    rc.fillStyle = '#777'
    rc.fillRect(tvX + 25, tvY + 5, 4, 4)
    rc.fillStyle = '#aaa'
    rc.fillRect(tvX + 26, tvY + 6, 2, 2)
    rc.fillStyle = '#777'
    rc.fillRect(tvX + 25, tvY + 11, 4, 3)
    rc.fillStyle = '#999'
    rc.fillRect(tvX + 26, tvY + 12, 2, 1)
    rc.fillStyle = '#e33'
    rc.fillRect(tvX + 26, tvY + 15, 2, 1)
    rc.fillStyle = '#888'
    rc.fillRect(tvX + 6, tvY - 8, 1, 9)
    rc.fillRect(tvX + 22, tvY - 8, 1, 9)
    rc.fillStyle = '#bbb'
    rc.fillRect(tvX + 5, tvY - 9, 3, 2)
    rc.fillRect(tvX + 21, tvY - 9, 3, 2)

    // 壁掛け時計
    const clkX = 10 * TILE + 3, clkY = 1 * TILE + 2
    rc.fillStyle = '#6a4a22'
    rc.fillRect(clkX - 1, clkY - 1, 12, 12)
    rc.fillStyle = '#f0ead8'
    rc.fillRect(clkX, clkY, 10, 10)
    rc.fillStyle = '#333'
    rc.fillRect(clkX + 5, clkY + 1, 1, 4)
    rc.fillRect(clkX + 5, clkY + 4, 3, 1)
    rc.fillStyle = '#888'
    rc.fillRect(clkX + 5, clkY + 1, 1, 1)
    rc.fillRect(clkX + 8, clkY + 5, 1, 1)
    rc.fillRect(clkX + 5, clkY + 8, 1, 1)
    rc.fillRect(clkX + 1, clkY + 5, 1, 1)

    // 窓からの光（時間帯連動）
    const wGlow = getWindowGlow(s.timeOfDay)
    rc.fillStyle = wGlow.color
    rc.globalAlpha = wGlow.alpha
    rc.fillRect(3*TILE - 4, 1*TILE + TILE, TILE + 8, TILE * 2)
    rc.globalAlpha = 1

    // Interaction prompt
    const ptx = Math.floor(player.x / TILE)
    const pty = Math.floor(player.y / TILE)
    const nearTv = (pty === 3) && ptx >= 4 && ptx <= 7
    if (nearTv) {
      rc.fillStyle = '#fff'
      rc.font = '7px monospace'
      rc.textAlign = 'center'
      rc.fillText('SPACE', tvX + tvW / 2, tvY - 12)
    }

    // --- 掛け軸（壁、col2 row1-2） ---
    const kkx = 2 * TILE, kky = 1 * TILE
    // 紐
    rc.fillStyle = '#886'
    rc.fillRect(kkx + 7, kky - 2, 1, 3)
    // 軸
    rc.fillStyle = '#f0e8d0'
    rc.fillRect(kkx + 3, kky + 1, 10, 20)
    rc.fillStyle = '#e8dcc0'
    rc.fillRect(kkx + 4, kky + 2, 8, 18)
    // 墨絵（竹）
    rc.fillStyle = '#4a6a3a'
    rc.fillRect(kkx + 7, kky + 3, 1, 14)
    rc.fillRect(kkx + 8, kky + 5, 3, 1)
    rc.fillRect(kkx + 8, kky + 9, 4, 1)
    rc.fillRect(kkx + 6, kky + 12, 3, 1)
    // 葉っぱ
    rc.fillRect(kkx + 9, kky + 4, 2, 2)
    rc.fillRect(kkx + 10, kky + 8, 2, 2)
    rc.fillRect(kkx + 5, kky + 11, 2, 2)
    // 軸棒
    rc.fillStyle = '#8a6a40'
    rc.fillRect(kkx + 2, kky + 1, 12, 1)
    rc.fillRect(kkx + 2, kky + 20, 12, 2)

    // --- みかん皿（ちゃぶ台の上、col6 row5あたり） ---
    const mkx = 6 * TILE + 2, mky = 5 * TILE + 2
    // 皿
    rc.fillStyle = '#ddd'
    rc.fillRect(mkx, mky + 2, 10, 5)
    rc.fillStyle = '#eee'
    rc.fillRect(mkx + 1, mky + 2, 8, 3)
    // みかん
    rc.fillStyle = '#ee8811'
    rc.fillRect(mkx + 2, mky, 3, 3)
    rc.fillRect(mkx + 5, mky + 1, 3, 3)
    // ヘタ
    rc.fillStyle = '#3a6a22'
    rc.fillRect(mkx + 3, mky - 1, 1, 1)
    rc.fillRect(mkx + 6, mky, 1, 1)

    // --- 毛糸玉（col9 row7 の床） ---
    const kex = 9 * TILE + 4, key2 = 7 * TILE + 8
    rc.fillStyle = '#dd4466'
    rc.fillRect(kex, key2, 6, 5)
    rc.fillRect(kex + 1, key2 - 1, 4, 7)
    // 糸の線
    rc.fillStyle = '#cc3355'
    rc.fillRect(kex + 1, key2 + 1, 4, 1)
    rc.fillRect(kex + 2, key2 + 3, 3, 1)
    // 垂れた糸
    rc.fillStyle = '#dd4466'
    rc.fillRect(kex + 5, key2 + 5, 1, 3)
    rc.fillRect(kex + 6, key2 + 7, 2, 1)
  }

  // ===== 台所のデコレーション =====
  if (currentRoom === 3) {
    // --- 換気扇（コンロの上の壁、row1 col7-8あたり） ---
    const vfx = 7 * TILE, vfy = 1 * TILE
    rc.fillStyle = '#c0bbb5'
    rc.fillRect(vfx + 1, vfy + 2, 14, 12)
    rc.fillStyle = '#aaa5a0'
    rc.fillRect(vfx + 2, vfy + 3, 12, 10)
    // ファン
    rc.fillStyle = '#888'
    rc.fillRect(vfx + 5, vfy + 5, 6, 6)
    rc.fillStyle = '#999'
    rc.fillRect(vfx + 6, vfy + 6, 4, 4)
    rc.fillStyle = '#777'
    rc.fillRect(vfx + 7, vfy + 7, 2, 2)
    // グリル線
    rc.fillStyle = '#aaa'
    rc.fillRect(vfx + 5, vfy + 7, 6, 1)
    rc.fillRect(vfx + 7, vfy + 5, 1, 6)
    const vfx2 = 8 * TILE
    rc.fillStyle = '#c0bbb5'
    rc.fillRect(vfx2 + 1, vfy + 2, 14, 12)
    rc.fillStyle = '#aaa5a0'
    rc.fillRect(vfx2 + 2, vfy + 3, 12, 10)
    rc.fillStyle = '#888'
    rc.fillRect(vfx2 + 5, vfy + 5, 6, 6)
    rc.fillStyle = '#999'
    rc.fillRect(vfx2 + 6, vfy + 6, 4, 4)
    rc.fillStyle = '#777'
    rc.fillRect(vfx2 + 7, vfy + 7, 2, 2)
    rc.fillStyle = '#aaa'
    rc.fillRect(vfx2 + 5, vfy + 7, 6, 1)
    rc.fillRect(vfx2 + 7, vfy + 5, 1, 6)

    // --- コンロの上に鍋 (col7, row3) ---
    const potX = 7 * TILE, potY = 3 * TILE
    rc.fillStyle = '#555'
    rc.fillRect(potX + 2, potY + 3, 12, 8)
    rc.fillStyle = '#666'
    rc.fillRect(potX + 3, potY + 4, 10, 6)
    // 蓋
    rc.fillStyle = '#777'
    rc.fillRect(potX + 1, potY + 3, 14, 2)
    // 取っ手
    rc.fillStyle = '#888'
    rc.fillRect(potX + 7, potY + 1, 2, 3)
    // 湯気
    rc.fillStyle = 'rgba(255,255,255,0.25)'
    rc.fillRect(potX + 5, potY - 1, 1, 2)
    rc.fillRect(potX + 9, potY - 2, 1, 3)

    // --- 流しの上にまな板+包丁 (col4, row3の上あたり, row2) ---
    const cbx = 4 * TILE, cby = 2 * TILE
    // まな板
    rc.fillStyle = '#c8b888'
    rc.fillRect(cbx + 2, cby + 6, 10, 7)
    rc.fillStyle = '#d8c898'
    rc.fillRect(cbx + 3, cby + 7, 8, 5)
    // 包丁
    rc.fillStyle = '#ccc'
    rc.fillRect(cbx + 8, cby + 4, 1, 6)
    rc.fillStyle = '#6a4422'
    rc.fillRect(cbx + 8, cby + 9, 1, 4)

    // --- テーブルの上の食事 ---
    // ごはん茶碗（テーブル中央左 col5, row6）
    const rx = 5 * TILE, ry = 6 * TILE
    rc.fillStyle = '#eee'
    rc.fillRect(rx + 4, ry + 4, 6, 5)
    rc.fillStyle = '#ddd'
    rc.fillRect(rx + 4, ry + 4, 6, 2)
    rc.fillStyle = '#fff'
    rc.fillRect(rx + 5, ry + 5, 4, 3)
    // ごはん（白）
    rc.fillStyle = '#f8f8f0'
    rc.fillRect(rx + 5, ry + 4, 4, 2)
    // 湯気
    rc.fillStyle = 'rgba(255,255,255,0.2)'
    rc.fillRect(rx + 6, ry + 2, 1, 2)
    rc.fillRect(rx + 8, ry + 1, 1, 3)

    // 味噌汁（col6, row6）
    const mx = 6 * TILE, my = 6 * TILE
    rc.fillStyle = '#c33'
    rc.fillRect(mx + 5, my + 4, 6, 5)
    rc.fillStyle = '#d44'
    rc.fillRect(mx + 5, my + 4, 6, 2)
    // 味噌汁の中身（茶色）
    rc.fillStyle = '#c8a060'
    rc.fillRect(mx + 6, my + 5, 4, 3)
    // 豆腐
    rc.fillStyle = '#f0edd8'
    rc.fillRect(mx + 7, my + 6, 2, 1)
    // 湯気
    rc.fillStyle = 'rgba(255,255,255,0.2)'
    rc.fillRect(mx + 7, my + 2, 1, 2)

    // おかず皿（col7, row6）
    const ox = 7 * TILE, oy = 6 * TILE
    rc.fillStyle = '#ddd'
    rc.fillRect(ox + 3, oy + 5, 8, 5)
    rc.fillStyle = '#eee'
    rc.fillRect(ox + 4, oy + 6, 6, 3)
    // 焼き魚
    rc.fillStyle = '#c89050'
    rc.fillRect(ox + 4, oy + 6, 6, 2)
    rc.fillStyle = '#b88040'
    rc.fillRect(ox + 5, oy + 7, 4, 1)

    // 箸（col5, row6の右下）
    rc.fillStyle = '#6a4422'
    rc.fillRect(rx + 11, ry + 5, 1, 7)
    rc.fillRect(rx + 13, ry + 5, 1, 7)

    // --- お酒（食器棚の上、row2 col11-12） ---
    const bx1 = 11*TILE, by1 = 2*TILE
    // ボトル1（赤ワイン）
    rc.fillStyle = '#882233'
    rc.fillRect(bx1 + 2, by1 + 4, 3, 7)
    rc.fillStyle = '#aa3344'
    rc.fillRect(bx1 + 3, by1 + 2, 1, 3)
    // ボトル2（ウイスキー）
    rc.fillStyle = '#cc8833'
    rc.fillRect(bx1 + 7, by1 + 5, 3, 6)
    rc.fillStyle = '#aa6622'
    rc.fillRect(bx1 + 8, by1 + 3, 1, 3)
    // ボトル3（日本酒）
    const bx2 = 12*TILE
    rc.fillStyle = '#eee'
    rc.fillRect(bx2 + 2, by1 + 3, 4, 8)
    rc.fillStyle = '#ddd'
    rc.fillRect(bx2 + 3, by1 + 1, 2, 3)
    // ラベル
    rc.fillStyle = '#c33'
    rc.fillRect(bx2 + 3, by1 + 6, 2, 3)
    // グラス
    rc.fillStyle = 'rgba(200,220,255,0.6)'
    rc.fillRect(bx2 + 8, by1 + 6, 3, 5)
    rc.fillRect(bx2 + 9, by1 + 4, 1, 3)

    // --- 冷蔵庫の上にレンジ (col1, row2) ---
    const mgx = 1 * TILE, mgy = 2 * TILE
    rc.fillStyle = '#ddd'
    rc.fillRect(mgx + 1, mgy + 4, 14, 10)
    rc.fillStyle = '#ccc'
    rc.fillRect(mgx + 2, mgy + 5, 9, 7)
    // 窓
    rc.fillStyle = '#223'
    rc.fillRect(mgx + 3, mgy + 6, 7, 5)
    // ボタン
    rc.fillStyle = '#888'
    rc.fillRect(mgx + 12, mgy + 6, 2, 2)
    rc.fillRect(mgx + 12, mgy + 9, 2, 2)

    // --- ゴミ箱 (col10, row9あたり) ---
    const gbx = 10 * TILE, gby = 9 * TILE
    rc.fillStyle = '#667'
    rc.fillRect(gbx + 4, gby + 3, 8, 10)
    rc.fillStyle = '#778'
    rc.fillRect(gbx + 5, gby + 4, 6, 8)
    // 蓋
    rc.fillStyle = '#889'
    rc.fillRect(gbx + 3, gby + 2, 10, 2)
    // 取っ手
    rc.fillStyle = '#99a'
    rc.fillRect(gbx + 7, gby + 1, 2, 2)

    // --- 壁掛け時計 (col10, row1) ---
    const kcx = 10 * TILE + 3, kcy = 1 * TILE + 3
    rc.fillStyle = '#eee'
    rc.fillRect(kcx, kcy, 10, 10)
    rc.fillStyle = '#ddd'
    rc.fillRect(kcx - 1, kcy - 1, 12, 12)
    rc.fillStyle = '#f8f8f0'
    rc.fillRect(kcx, kcy, 10, 10)
    rc.fillStyle = '#333'
    rc.fillRect(kcx + 5, kcy + 2, 1, 3)
    rc.fillRect(kcx + 5, kcy + 5, 4, 1)
    rc.fillStyle = '#888'
    rc.fillRect(kcx + 5, kcy + 1, 1, 1)
    rc.fillRect(kcx + 8, kcy + 5, 1, 1)
    rc.fillRect(kcx + 5, kcy + 8, 1, 1)
    rc.fillRect(kcx + 1, kcy + 5, 1, 1)

    // --- やかん（コンロ上、col8 row3） ---
    const ykx = 8 * TILE, yky = 3 * TILE
    rc.fillStyle = '#bbb'
    rc.fillRect(ykx + 3, yky + 5, 10, 7)
    rc.fillStyle = '#ccc'
    rc.fillRect(ykx + 4, yky + 5, 8, 5)
    // 注ぎ口
    rc.fillStyle = '#aaa'
    rc.fillRect(ykx + 12, yky + 6, 3, 2)
    rc.fillRect(ykx + 14, yky + 5, 1, 2)
    // 取っ手
    rc.fillStyle = '#444'
    rc.fillRect(ykx + 6, yky + 2, 4, 1)
    rc.fillRect(ykx + 5, yky + 3, 1, 2)
    rc.fillRect(ykx + 10, yky + 3, 1, 2)
    // 湯気
    rc.fillStyle = 'rgba(255,255,255,0.2)'
    rc.fillRect(ykx + 14, yky + 3, 1, 2)
    rc.fillRect(ykx + 15, yky + 2, 1, 2)

    // --- フライパン（壁掛け、col3 row1） ---
    const fpx = 3 * TILE, fpy = 1 * TILE
    // フック
    rc.fillStyle = '#888'
    rc.fillRect(fpx + 7, fpy + 1, 2, 2)
    // 取っ手
    rc.fillStyle = '#553322'
    rc.fillRect(fpx + 7, fpy + 3, 2, 5)
    // パン本体
    rc.fillStyle = '#444'
    rc.fillRect(fpx + 3, fpy + 7, 10, 4)
    rc.fillStyle = '#555'
    rc.fillRect(fpx + 4, fpy + 8, 8, 2)

    // --- 果物かご（テーブル横、col9 row5） ---
    const fkx = 9 * TILE, fky = 5 * TILE
    // かご
    rc.fillStyle = '#b89050'
    rc.fillRect(fkx + 2, fky + 6, 12, 6)
    rc.fillStyle = '#c8a060'
    rc.fillRect(fkx + 3, fky + 7, 10, 4)
    // 編み目
    rc.fillStyle = '#a88040'
    rc.fillRect(fkx + 5, fky + 8, 1, 2)
    rc.fillRect(fkx + 8, fky + 8, 1, 2)
    // りんご
    rc.fillStyle = '#cc2233'
    rc.fillRect(fkx + 4, fky + 4, 3, 3)
    rc.fillStyle = '#3a6a22'
    rc.fillRect(fkx + 5, fky + 3, 1, 1)
    // バナナ
    rc.fillStyle = '#eecc33'
    rc.fillRect(fkx + 8, fky + 5, 4, 2)
    rc.fillStyle = '#ddbb22'
    rc.fillRect(fkx + 9, fky + 5, 2, 1)
  }

  // ===== 洋室の壁飾り =====
  if (currentRoom === 1) {
    const artX = 12 * TILE + 2, artY = 1 * TILE + 2
    rc.fillStyle = '#6a5030'
    rc.fillRect(artX - 1, artY - 1, 12, 12)
    rc.fillStyle = '#ddeeff'
    rc.fillRect(artX, artY, 10, 10)
    rc.fillStyle = '#6688aa'
    rc.fillRect(artX + 1, artY + 5, 8, 5)
    rc.fillStyle = '#7799bb'
    rc.fillRect(artX + 2, artY + 3, 3, 4)
    rc.fillRect(artX + 6, artY + 4, 3, 3)
    rc.fillStyle = '#fff'
    rc.fillRect(artX + 3, artY + 3, 1, 1)
    rc.fillRect(artX + 7, artY + 4, 1, 1)

    const clkX2 = 1 * TILE + 3, clkY2 = 1 * TILE + 2
    rc.fillStyle = '#555'
    rc.fillRect(clkX2 - 1, clkY2 - 1, 12, 12)
    rc.fillStyle = '#fff'
    rc.fillRect(clkX2, clkY2, 10, 10)
    rc.fillStyle = '#222'
    rc.fillRect(clkX2 + 5, clkY2 + 2, 1, 3)
    rc.fillRect(clkX2 + 5, clkY2 + 5, 3, 1)

    // --- 音楽ポスター（壁、col7 row1） ---
    const psx = 7 * TILE, psy = 1 * TILE
    rc.fillStyle = '#333'
    rc.fillRect(psx + 1, psy + 1, 14, 12)
    rc.fillStyle = '#2244aa'
    rc.fillRect(psx + 2, psy + 2, 12, 10)
    // 星
    rc.fillStyle = '#ffcc00'
    rc.fillRect(psx + 5, psy + 4, 2, 2)
    rc.fillRect(psx + 9, psy + 3, 1, 1)
    rc.fillRect(psx + 11, psy + 6, 1, 1)
    // 文字っぽいライン
    rc.fillStyle = '#fff'
    rc.fillRect(psx + 4, psy + 8, 8, 1)
    rc.fillRect(psx + 5, psy + 10, 6, 1)

    // --- クッション（ソファの上、col5 row4） ---
    const csx = 5 * TILE + 2, csy = 4 * TILE + 4
    rc.fillStyle = '#cc6644'
    rc.fillRect(csx, csy, 8, 6)
    rc.fillStyle = '#dd7755'
    rc.fillRect(csx + 1, csy + 1, 6, 4)
    // タッセル
    rc.fillStyle = '#aa5533'
    rc.fillRect(csx + 3, csy, 2, 1)

    // --- ランプの光（フロアランプcol13 row5 周囲のグロー） ---
    rc.fillStyle = 'rgba(255,220,150,0.07)'
    rc.fillRect(12 * TILE, 4 * TILE, TILE * 3, TILE * 3)
    rc.fillStyle = 'rgba(255,220,150,0.04)'
    rc.fillRect(11 * TILE, 3 * TILE, TILE * 4, TILE * 5)
  }

  // ===== お風呂のデコレーション =====
  // 左エリア（col1-5）= 浴室、右エリア（col8-13）= 脱衣・トイレ・洗面
  if (currentRoom === 4) {
    // --- 浴槽の湯気（col1-4 row2-4 の上） ---
    rc.fillStyle = 'rgba(255,255,255,0.2)'
    for (let i = 0; i < 6; i++) {
      const sx = 1 * TILE + 4 + i * 10
      const sy = 1 * TILE + 4 + Math.sin(Date.now() * 0.003 + i) * 2
      rc.fillRect(sx, sy, 2, 3)
      rc.fillRect(sx + 1, sy - 2, 1, 2)
    }

    // --- 蛇口（浴槽の頭側、col5 row3 の壁面） ---
    const fcx = 5 * TILE, fcy = 3 * TILE
    rc.fillStyle = '#bbb'
    rc.fillRect(fcx + 2, fcy + 6, 4, 2)  // 横バー
    rc.fillRect(fcx + 4, fcy + 8, 2, 4)  // 蛇口本体
    rc.fillStyle = '#888'
    rc.fillRect(fcx + 1, fcy + 5, 2, 2)  // ハンドル左
    rc.fillRect(fcx + 5, fcy + 5, 2, 2)  // ハンドル右

    // --- 洗い場：椅子（col1 row6） ---
    const stx = 1 * TILE, sty = 6 * TILE
    rc.fillStyle = '#4488aa'
    rc.fillRect(stx + 3, sty + 6, 10, 4)
    rc.fillStyle = '#55aacc'
    rc.fillRect(stx + 4, sty + 6, 8, 2)
    // 脚
    rc.fillStyle = '#336688'
    rc.fillRect(stx + 4, sty + 10, 2, 4)
    rc.fillRect(stx + 11, sty + 10, 2, 4)

    // --- 洗い場：風呂桶（col2 row6） ---
    const bkx = 2 * TILE, bky = 6 * TILE
    rc.fillStyle = '#c8a060'
    rc.fillRect(bkx + 3, bky + 7, 10, 6)
    rc.fillStyle = '#d8b070'
    rc.fillRect(bkx + 4, bky + 8, 8, 4)
    // タガ
    rc.fillStyle = '#888'
    rc.fillRect(bkx + 3, bky + 9, 10, 1)

    // --- シャンプー＆リンス（col4 row6 の壁際） ---
    const spx = 4 * TILE, spy = 6 * TILE
    // シャンプー（白）
    rc.fillStyle = '#eee'
    rc.fillRect(spx + 2, spy + 6, 4, 8)
    rc.fillStyle = '#ddd'
    rc.fillRect(spx + 3, spy + 4, 2, 3)
    rc.fillStyle = '#ccc'
    rc.fillRect(spx + 3, spy + 3, 2, 2)
    // リンス（ピンク）
    rc.fillStyle = '#e8a0b0'
    rc.fillRect(spx + 8, spy + 7, 4, 7)
    rc.fillStyle = '#d890a0'
    rc.fillRect(spx + 9, spy + 5, 2, 3)
    rc.fillStyle = '#c880a0'
    rc.fillRect(spx + 9, spy + 4, 2, 2)

    // --- 鏡（洗面台 col11 row2 の上、col11 row1） ---
    const mrx = 11 * TILE, mry = 1 * TILE
    rc.fillStyle = '#888'
    rc.fillRect(mrx + 2, mry + 2, 12, 12)
    rc.fillStyle = '#aaccdd'
    rc.fillRect(mrx + 3, mry + 3, 10, 10)
    rc.fillStyle = '#bbddee'
    rc.fillRect(mrx + 4, mry + 4, 5, 5)
    // 光の反射
    rc.fillStyle = 'rgba(255,255,255,0.3)'
    rc.fillRect(mrx + 4, mry + 4, 3, 2)

    // --- タオル掛け（col13 row2 の壁、洗面台の右） ---
    const twx = 13 * TILE, twy = 2 * TILE
    rc.fillStyle = '#aaa'
    rc.fillRect(twx + 3, twy + 2, 10, 2)
    rc.fillRect(twx + 3, twy + 2, 1, 4)
    rc.fillRect(twx + 12, twy + 2, 1, 4)
    // タオル（白）
    rc.fillStyle = '#f0f0e8'
    rc.fillRect(twx + 4, twy + 3, 8, 9)
    rc.fillStyle = '#e8e8e0'
    rc.fillRect(twx + 4, twy + 9, 8, 3)
    // タオルのストライプ
    rc.fillStyle = '#aaccdd'
    rc.fillRect(twx + 4, twy + 5, 8, 1)
    rc.fillRect(twx + 4, twy + 8, 8, 1)

    // --- トイレットペーパー（トイレ col10 row6-7 の右、col11 row6） ---
    const tpx = 11 * TILE, tpy = 6 * TILE
    rc.fillStyle = '#888'
    rc.fillRect(tpx + 5, tpy + 4, 1, 8)  // 壁掛けの軸
    rc.fillStyle = '#f8f4e8'
    rc.fillRect(tpx + 3, tpy + 6, 8, 6)
    rc.fillStyle = '#fff'
    rc.fillRect(tpx + 4, tpy + 7, 6, 4)
    rc.fillStyle = '#ccc'
    rc.fillRect(tpx + 6, tpy + 9, 2, 1)  // 中央の穴
    // たれてるペーパー
    rc.fillStyle = '#f8f4e8'
    rc.fillRect(tpx + 4, tpy + 12, 2, 3)

    // --- バスマット（ドア col1 row9 の手前、col2 row9） ---
    const bmx = 2 * TILE, bmy = 9 * TILE
    rc.fillStyle = '#88aa88'
    rc.fillRect(bmx + 1, bmy + 4, TILE * 2 - 2, 8)
    rc.fillStyle = '#99bb99'
    rc.fillRect(bmx + 2, bmy + 5, TILE * 2 - 4, 6)
    rc.fillStyle = '#77aa77'
    for (let fx = 0; fx < TILE * 2 - 4; fx += 3) {
      rc.fillRect(bmx + 2 + fx, bmy + 4, 2, 1)
      rc.fillRect(bmx + 2 + fx, bmy + 11, 2, 1)
    }

    // --- 体重計（脱衣エリアの隅、col13 row8） ---
    const scx = 13 * TILE, scy = 8 * TILE
    rc.fillStyle = '#ddd'
    rc.fillRect(scx + 2, scy + 4, 12, 8)
    rc.fillStyle = '#eee'
    rc.fillRect(scx + 3, scy + 5, 10, 6)
    rc.fillStyle = '#aaccbb'
    rc.fillRect(scx + 5, scy + 6, 6, 4)
    rc.fillStyle = '#333'
    rc.fillRect(scx + 7, scy + 7, 2, 2)

    // --- アヒルのおもちゃ（浴槽内、col3 row3） ---
    const dkx = 3 * TILE + 4, dky = 3 * TILE + 4
    // 体
    rc.fillStyle = '#ffdd00'
    rc.fillRect(dkx, dky, 5, 4)
    rc.fillRect(dkx + 1, dky - 1, 3, 6)
    // 頭
    rc.fillRect(dkx + 4, dky - 2, 3, 3)
    // くちばし
    rc.fillStyle = '#ee8800'
    rc.fillRect(dkx + 6, dky - 1, 2, 1)
    // 目
    rc.fillStyle = '#111'
    rc.fillRect(dkx + 5, dky - 2, 1, 1)
    // 波紋
    rc.fillStyle = 'rgba(255,255,255,0.15)'
    rc.fillRect(dkx - 2, dky + 3, 9, 1)

    // --- スリッパ（脱衣エリア、col9 row9） ---
    const spx2 = 9 * TILE, spy2 = 9 * TILE
    // 左
    rc.fillStyle = '#dd8899'
    rc.fillRect(spx2 + 1, spy2 + 6, 5, 8)
    rc.fillStyle = '#cc7788'
    rc.fillRect(spx2 + 1, spy2 + 6, 5, 3)
    // 右
    rc.fillStyle = '#dd8899'
    rc.fillRect(spx2 + 8, spy2 + 5, 5, 8)
    rc.fillStyle = '#cc7788'
    rc.fillRect(spx2 + 8, spy2 + 5, 5, 3)

    // --- 洗濯かご（脱衣エリア、col12 row5） ---
    const wbx = 12 * TILE, wby = 5 * TILE
    rc.fillStyle = '#887755'
    rc.fillRect(wbx + 2, wby + 4, 12, 10)
    rc.fillStyle = '#998866'
    rc.fillRect(wbx + 3, wby + 5, 10, 8)
    // 編み目
    rc.fillStyle = '#776644'
    rc.fillRect(wbx + 5, wby + 6, 1, 6)
    rc.fillRect(wbx + 9, wby + 6, 1, 6)
    // はみ出たタオル
    rc.fillStyle = '#aaddee'
    rc.fillRect(wbx + 4, wby + 3, 5, 3)
    rc.fillRect(wbx + 3, wby + 4, 3, 1)
  }

  // ===== 縁側の庭デコレーション =====
  if (currentRoom === 2) {
    // --- 木を描くヘルパー ---
    const drawTree = (tx: number, ty: number, size: 'big' | 'mid' | 'small', leafHue: string, leafLight: string, leafBright: string) => {
      const trunkW = size === 'big' ? 4 : size === 'mid' ? 3 : 2
      const trunkH = size === 'big' ? 10 : size === 'mid' ? 8 : 6
      const crownR = size === 'big' ? 9 : size === 'mid' ? 7 : 5
      // 幹
      rc.fillStyle = '#6a4422'
      rc.fillRect(tx + 8 - Math.floor(trunkW/2), ty + crownR - 2, trunkW, trunkH)
      rc.fillStyle = '#7a5432'
      rc.fillRect(tx + 8 - Math.floor(trunkW/2) + 1, ty + crownR - 2, Math.max(1, trunkW - 2), trunkH)
      // 樹冠（丸っぽく）
      rc.fillStyle = leafHue
      rc.fillRect(tx + 8 - crownR + 2, ty - crownR + 4, (crownR - 2) * 2, crownR * 2 - 4)
      rc.fillRect(tx + 8 - crownR + 4, ty - crownR + 2, (crownR - 4) * 2, crownR * 2)
      rc.fillStyle = leafLight
      rc.fillRect(tx + 8 - crownR + 4, ty - crownR + 4, (crownR - 4) * 2, crownR - 2)
      rc.fillStyle = leafBright
      rc.fillRect(tx + 6, ty - crownR + 5, 3, 2)
      // 影
      rc.fillStyle = 'rgba(0,0,0,0.08)'
      rc.fillRect(tx + 4, ty + crownR + trunkH - 4, 10, 3)
    }

    // 木5本
    drawTree(1 * TILE, 1 * TILE, 'big', '#228833', '#33aa44', '#44cc55')
    drawTree(5 * TILE, 1 * TILE, 'mid', '#2a7744', '#3a9955', '#55bb66')
    drawTree(8 * TILE, 2 * TILE, 'small', '#338844', '#44aa55', '#55cc66')
    drawTree(11 * TILE, 1 * TILE, 'big', '#1a7733', '#2a9944', '#44bb55')
    drawTree(13 * TILE, 2 * TILE, 'mid', '#2a8844', '#3aaa55', '#55cc66')

    // --- 花 ---
    const flowers = [
      { x: 3, y: 3, c1: '#ff6688', c2: '#ffaa44' },
      { x: 4, y: 2, c1: '#ff88aa', c2: '#ffcc66' },
      { x: 6, y: 1, c1: '#ffdd44', c2: '#ff8844' },
      { x: 7, y: 3, c1: '#ff5577', c2: '#ffaa33' },
      { x: 9, y: 1, c1: '#aa66ff', c2: '#ffee55' },
      { x: 9, y: 3, c1: '#ff88cc', c2: '#ffcc44' },
      { x: 4, y: 4, c1: '#ff6688', c2: '#ffaa44' },
      { x: 6, y: 4, c1: '#ffdd44', c2: '#ff8844' },
      { x: 10, y: 4, c1: '#ff88aa', c2: '#ffcc66' },
      { x: 12, y: 3, c1: '#aa66ff', c2: '#ffee55' },
    ]
    for (const f of flowers) {
      const fx = f.x * TILE, fy = f.y * TILE
      rc.fillStyle = '#338833'
      rc.fillRect(fx + 7, fy + 8, 1, 5)
      rc.fillStyle = f.c1
      rc.fillRect(fx + 6, fy + 6, 3, 3)
      rc.fillRect(fx + 5, fy + 7, 5, 1)
      rc.fillRect(fx + 7, fy + 5, 1, 5)
      rc.fillStyle = f.c2
      rc.fillRect(fx + 7, fy + 7, 1, 1)
      rc.fillStyle = '#44aa44'
      rc.fillRect(fx + 5, fy + 10, 2, 2)
      rc.fillRect(fx + 9, fy + 9, 2, 2)
    }

    // --- 丸い石 ---
    const drawRoundStone = (sx: number, sy: number, w: number, h: number) => {
      // 角を削って丸っぽく
      rc.fillStyle = '#999'
      rc.fillRect(sx + 1, sy, w - 2, h)
      rc.fillRect(sx, sy + 1, w, h - 2)
      // ハイライト
      rc.fillStyle = '#bbb'
      rc.fillRect(sx + 2, sy + 1, w - 4, Math.max(1, Math.floor(h / 3)))
      // 影
      rc.fillStyle = '#777'
      rc.fillRect(sx + 1, sy + h - 2, w - 2, 1)
    }
    drawRoundStone(7 * TILE + 3, 3 * TILE + 5, 10, 7)
    drawRoundStone(7 * TILE + 1, 4 * TILE + 3, 12, 8)
    drawRoundStone(6 * TILE + 6, 4 * TILE + 8, 7, 5)

    // --- 庭の門（col6 row1、商店街への入口） ---
    const gatX = 6 * TILE, gatY = 0 * TILE
    // 左柱
    rc.fillStyle = '#7a5a30'
    rc.fillRect(gatX - 2, gatY + 4, 3, 12)
    rc.fillStyle = '#8a6a40'
    rc.fillRect(gatX - 1, gatY + 5, 2, 10)
    // 右柱
    rc.fillStyle = '#7a5a30'
    rc.fillRect(gatX + TILE - 1, gatY + 4, 3, 12)
    rc.fillStyle = '#8a6a40'
    rc.fillRect(gatX + TILE - 1, gatY + 5, 2, 10)
    // 横梁
    rc.fillStyle = '#6a4a20'
    rc.fillRect(gatX - 3, gatY + 3, TILE + 6, 2)
    // 屋根
    rc.fillStyle = '#554433'
    rc.fillRect(gatX - 4, gatY + 1, TILE + 8, 3)
    // 開いた扉
    rc.fillStyle = '#5a3a18'
    rc.fillRect(gatX + 1, gatY + 6, 3, 10)
    rc.fillRect(gatX + TILE - 4, gatY + 6, 3, 10)

    // --- 風鈴（軒先、col5 row4あたり） ---
    const frx = 5 * TILE + 6, fry = 4 * TILE
    // 紐
    rc.fillStyle = '#886'
    rc.fillRect(frx + 2, fry - 4, 1, 5)
    // ガラス本体
    rc.fillStyle = 'rgba(150,200,255,0.6)'
    rc.fillRect(frx, fry + 1, 5, 6)
    rc.fillRect(frx + 1, fry, 3, 8)
    // 模様
    rc.fillStyle = 'rgba(100,150,220,0.4)'
    rc.fillRect(frx + 1, fry + 3, 3, 1)
    // 舌（短冊）
    rc.fillStyle = '#ee4444'
    rc.fillRect(frx + 2, fry + 8, 1, 5)
    rc.fillRect(frx + 1, fry + 12, 3, 1)
    // 揺れ（フレームで微妙にずれ）
    const swing = Math.sin(Date.now() * 0.002) * 0.5
    rc.fillStyle = '#ee4444'
    rc.fillRect(frx + 2 + Math.round(swing), fry + 13, 1, 1)

    // --- 蝶々（庭を飛ぶ、アニメーション） ---
    const bfTime = Date.now() * 0.001
    const bfx = 4 * TILE + Math.sin(bfTime * 0.7) * 20
    const bfy = 3 * TILE + Math.cos(bfTime * 0.5) * 10
    const wingOpen = Math.sin(bfTime * 4) > 0
    rc.fillStyle = '#ffcc44'
    if (wingOpen) {
      rc.fillRect(bfx - 2, bfy, 2, 2)
      rc.fillRect(bfx + 1, bfy, 2, 2)
    } else {
      rc.fillRect(bfx - 1, bfy, 1, 2)
      rc.fillRect(bfx + 1, bfy, 1, 2)
    }
    // 体
    rc.fillStyle = '#333'
    rc.fillRect(bfx, bfy, 1, 3)

    // --- 石灯籠（庭、col8 row3） ---
    const slx = 8 * TILE + 3, sly = 3 * TILE
    // 台座
    rc.fillStyle = '#888'
    rc.fillRect(slx, sly + 10, 10, 3)
    rc.fillStyle = '#999'
    rc.fillRect(slx + 1, sly + 10, 8, 2)
    // 柱
    rc.fillStyle = '#999'
    rc.fillRect(slx + 3, sly + 4, 4, 6)
    rc.fillStyle = '#aaa'
    rc.fillRect(slx + 4, sly + 5, 2, 5)
    // 火袋
    rc.fillStyle = '#aaa'
    rc.fillRect(slx + 1, sly + 1, 8, 4)
    rc.fillStyle = '#bbb'
    rc.fillRect(slx + 2, sly + 2, 6, 2)
    // 光（暖色）
    rc.fillStyle = 'rgba(255,200,100,0.2)'
    rc.fillRect(slx + 3, sly + 2, 4, 2)
    // 笠
    rc.fillStyle = '#777'
    rc.fillRect(slx - 1, sly, 12, 2)
    rc.fillRect(slx + 1, sly - 1, 8, 1)
  }

  // ===== 商店街デコレーション（street-draw.ts） =====
  if (currentRoom === 5) drawStreetFront(rc)
  if (currentRoom === 6) drawStreetBack(rc)
  if (currentRoom === 7) drawFlowerShop(rc)
  if (currentRoom === 8) drawRamenShop(rc)

  // ===== 時間帯オーバーレイ =====
  const ovl = getOverlay(s.timeOfDay)
  if (ovl.alpha > 0) {
    rc.fillStyle = ovl.color
    rc.globalAlpha = ovl.alpha
    rc.fillRect(0, 0, COLS * TILE, ROWS * TILE)
    rc.globalAlpha = 1
  }

  // 夜は石灯籠とランプが光る
  if (s.timeOfDay === 'night') {
    // 和室のランプ(col1 row8)
    if (currentRoom === 0) {
      rc.fillStyle = 'rgba(255,220,150,0.12)'
      rc.fillRect(0, 7 * TILE, 3 * TILE, 3 * TILE)
    }
    // 縁側の石灯籠の光
    if (currentRoom === 2) {
      rc.fillStyle = 'rgba(255,200,100,0.1)'
      rc.fillRect(7 * TILE, 2 * TILE, 3 * TILE, 3 * TILE)
    }
  }

  // ===== ミニマップ =====
  const ms = s.mapScale
  const bw = Math.floor(24 * ms), bh = Math.floor(14 * ms), gap = Math.floor(2 * ms)
  const mTotalW = bw * 2 + gap
  const mTotalH = bh * 3 + gap * 2
  const headerH = Math.max(8, Math.floor(9 * ms))
  const mapX = COLS * TILE - mTotalW - 4
  const headerY = 3
  const mapY = headerY + headerH + 1

  // ヘッダー（MAPラベル + 開閉矢印）
  rc.fillStyle = 'rgba(0,0,0,0.55)'
  rc.fillRect(mapX - 2, headerY - 2, mTotalW + 4, headerH + 4)
  rc.fillStyle = 'rgba(15,12,8,0.92)'
  rc.fillRect(mapX, headerY, mTotalW, headerH)
  rc.strokeStyle = '#ffdd44'
  rc.lineWidth = 0.5
  rc.strokeRect(mapX + 0.5, headerY + 0.5, mTotalW - 1, headerH - 1)

  const hfs = Math.max(5, Math.floor(6 * ms))
  rc.font = 'bold ' + hfs + 'px monospace'
  rc.fillStyle = '#ffdd44'
  rc.textAlign = 'left'
  rc.textBaseline = 'middle'
  rc.fillText('MAP', mapX + 3, headerY + headerH / 2 + 1)
  rc.textAlign = 'right'
  rc.fillText(s.mapOpen ? '\u25B2' : '\u25BC', mapX + mTotalW - 3, headerY + headerH / 2 + 1)
  rc.textBaseline = 'alphabetic'

  if (!s.mapOpen) {
    // 閉じてる場合はヘッダーだけでドアヒントへスキップ
  } else {
    // 家マップ or 街マップを切り替え
    const isStreet = currentRoom >= 5
    const roomBoxes = isStreet ? [
      { idx: 5, x: mapX,            y: mapY,          w: bw, h: bh, name: '手前' },
      { idx: 6, x: mapX + bw + gap, y: mapY,          w: bw, h: bh, name: '奥' },
      { idx: 2, x: mapX,            y: mapY + bh + gap, w: mTotalW, h: bh, name: '庭へ戻る' },
    ] : [
      { idx: 0, x: mapX,            y: mapY + bh + gap,        w: bw, h: bh, name: '和室' },
      { idx: 1, x: mapX + bw + gap, y: mapY + bh + gap,        w: bw, h: bh, name: '洋室' },
      { idx: 2, x: mapX,            y: mapY,                    w: mTotalW, h: bh, name: '縁側' },
      { idx: 3, x: mapX,            y: mapY + (bh + gap) * 2,   w: bw, h: bh, name: '台所' },
      { idx: 4, x: mapX + bw + gap, y: mapY + (bh + gap) * 2,  w: bw, h: bh, name: '風呂' },
    ]

    const mapH = isStreet ? bh * 2 + gap : mTotalH
    rc.fillStyle = 'rgba(0,0,0,0.55)'
    rc.fillRect(mapX - 2, mapY - 2, mTotalW + 4, mapH + 4)
    rc.fillStyle = 'rgba(15,12,8,0.85)'
    rc.fillRect(mapX, mapY, mTotalW, mapH)

    for (let ri = 0; ri < roomBoxes.length; ri++) {
      const rb = roomBoxes[ri]
      const isCurrent = (rb.idx === currentRoom)
      rc.fillStyle = isCurrent ? (isStreet ? '#3a5a8a' : '#886a3a') : '#2a2418'
      rc.fillRect(rb.x, rb.y, rb.w, rb.h)
      rc.strokeStyle = isCurrent ? '#ffdd44' : '#554'
      rc.lineWidth = isCurrent ? 1 : 0.5
      rc.strokeRect(rb.x, rb.y, rb.w, rb.h)
      const fs = Math.max(4, Math.floor(5 * ms))
      rc.fillStyle = isCurrent ? '#ffdd44' : '#887'
      rc.font = (isCurrent ? 'bold ' : '') + fs + 'px monospace'
      rc.textAlign = 'center'
      rc.fillText(rb.name, rb.x + rb.w / 2, rb.y + rb.h / 2 + Math.floor(fs * 0.4))
      if (isCurrent && Math.sin(Date.now() * 0.008) > 0) {
        rc.fillStyle = '#ff4444'
        rc.fillRect(rb.x + rb.w / 2 - 1, rb.y + 1, 3, 3)
      }
    }
  }

  // Door hints
  {
    const ptx = Math.floor(player.x / TILE)
    const pty = Math.floor(player.y / TILE)
    const curTile = getTile(s.room, ptx, pty)
    if (curTile >= 9 && curTile <= 12) {
      const doors = ROOMS[currentRoom].doors
      let destName = ''
      for (let di = 0; di < doors.length; di++) {
        if (doors[di].tile === curTile) { destName = ROOMS[doors[di].toRoom].name; break }
      }
      rc.fillStyle = '#ffdd44'
      rc.font = '6px monospace'
      rc.textAlign = 'center'
      rc.fillText('SPACE \u2192 ' + destName, player.x, player.y - 16)
    }
  }
}

export function drawPlayer(s: DrawState): void {
  drawCharSprite(s.rc, s.player)
}

export function drawNpc(rc: CanvasRenderingContext2D, npc: Player): void {
  drawCharSprite(rc, npc)
  // NPC名前表示
  const ch = ROOM_CHARS[npc.charIdx]
  rc.fillStyle = '#ffdd44'
  rc.font = '5px sans-serif'
  rc.textAlign = 'center'
  rc.fillText(ch.name, Math.floor(npc.x), Math.floor(npc.y) - 14)
}

function drawCharSprite(rc: CanvasRenderingContext2D, player: Player): void {
  const ch = ROOM_CHARS[player.charIdx]
  const px = Math.floor(player.x) - 5
  const py = Math.floor(player.y) - 12
  const wobble = (player.walkTimer > 0) ? (Math.floor(player.frame / 4) % 2) : 0

  rc.fillStyle = 'rgba(0,0,0,0.2)'
  rc.fillRect(px + 2, py + 12, 8, 3)
  rc.fillStyle = ch.body
  rc.fillRect(px + 2, py + 4, 8, 7)
  rc.fillRect(px + 1, py + 1, 10, 6)
  rc.fillRect(px + 2, py, 8, 2)
  if (player.charIdx === 5) {
    // わたるっち: うさぎの長い耳
    rc.fillRect(px + 1, py - 4, 2, 6)
    rc.fillRect(px + 9, py - 4, 2, 6)
    rc.fillStyle = ch.accent
    rc.fillRect(px + 1, py - 3, 1, 4)
    rc.fillRect(px + 10, py - 3, 1, 4)
  } else {
    rc.fillRect(px + 1, py - 1, 3, 3)
    rc.fillRect(px + 8, py - 1, 3, 3)
    rc.fillStyle = ch.accent
    rc.fillRect(px + 2, py, 1, 2)
    rc.fillRect(px + 9, py, 1, 2)
  }
  rc.fillStyle = ch.light
  rc.fillRect(px + 3, py + 4, 6, 3)
  rc.fillStyle = ch.eye
  if (player.dir === 0) {
    rc.fillRect(px + 3, py + 3, 2, 2)
    rc.fillRect(px + 7, py + 3, 2, 2)
    rc.fillStyle = '#111'
    rc.fillRect(px + 4, py + 3, 1, 1)
    rc.fillRect(px + 7, py + 3, 1, 1)
  } else if (player.dir === 1) {
    rc.fillStyle = ch.body
    rc.fillRect(px + 3, py + 3, 6, 4)
  } else if (player.dir === 2) {
    rc.fillRect(px + 2, py + 3, 2, 2)
    rc.fillRect(px + 6, py + 3, 2, 2)
    rc.fillStyle = '#111'
    rc.fillRect(px + 2, py + 3, 1, 1)
    rc.fillRect(px + 6, py + 3, 1, 1)
  } else {
    rc.fillRect(px + 4, py + 3, 2, 2)
    rc.fillRect(px + 8, py + 3, 2, 2)
    rc.fillStyle = '#111'
    rc.fillRect(px + 5, py + 3, 1, 1)
    rc.fillRect(px + 9, py + 3, 1, 1)
  }
  rc.fillStyle = ch.body
  rc.fillRect(px + 5, py + 6, 2, 1)
  rc.fillStyle = ch.accent
  rc.globalAlpha = 0.3
  rc.fillRect(px + 2, py + 5, 2, 1)
  rc.fillRect(px + 8, py + 5, 2, 1)
  rc.globalAlpha = 1
  rc.fillStyle = ch.body
  rc.fillRect(px + 2, py + 11 + wobble, 3, 2)
  rc.fillRect(px + 7, py + 11 - wobble, 3, 2)
}

export function drawBubble(rc: CanvasRenderingContext2D, x: number, y: number, text: string): void {
  const fontSize = 6
  rc.font = fontSize + 'px sans-serif'
  rc.textAlign = 'left'
  rc.textBaseline = 'top'
  const padX = 3, padY = 2
  const textW = rc.measureText(text).width
  const bw = Math.ceil(textW) + padX * 2
  const bh = fontSize + padY * 2
  // 画面端にはみ出さないようクランプ
  const maxX = COLS * TILE - bw - 2
  let bx = Math.max(2, Math.min(Math.floor(x - bw / 2), maxX))
  const by = Math.max(2, Math.floor(y - bh - 5))
  // 影
  rc.fillStyle = 'rgba(0,0,0,0.3)'
  rc.fillRect(bx + 1, by + 1, bw, bh)
  // 本体
  rc.fillStyle = '#fff'
  rc.fillRect(bx, by, bw, bh)
  // 枠
  rc.strokeStyle = '#222'
  rc.lineWidth = 1
  rc.strokeRect(bx + 0.5, by + 0.5, bw - 1, bh - 1)
  // しっぽ（下向き三角）
  const tailX = Math.floor(Math.max(bx + 3, Math.min(x, bx + bw - 4)))
  rc.fillStyle = '#fff'
  rc.fillRect(tailX - 1, by + bh, 3, 1)
  rc.fillRect(tailX, by + bh + 1, 1, 1)
  rc.fillStyle = '#222'
  rc.fillRect(tailX - 2, by + bh, 1, 1)
  rc.fillRect(tailX + 2, by + bh, 1, 1)
  rc.fillRect(tailX - 1, by + bh + 1, 1, 1)
  rc.fillRect(tailX + 1, by + bh + 1, 1, 1)
  // テキスト
  rc.fillStyle = '#222'
  rc.fillText(text, bx + padX, by + padY)
  rc.textBaseline = 'alphabetic'
}

// プレイヤー頭上に「!」マーク（SPACEで反応できるものが近い時）
export function drawInteractHint(rc: CanvasRenderingContext2D, x: number, y: number): void {
  const bx = Math.floor(x) - 3
  const by = Math.floor(y) - 26
  // 背景丸
  rc.fillStyle = '#ffdd00'
  rc.fillRect(bx - 1, by - 1, 8, 10)
  // 「!」
  rc.fillStyle = '#222'
  rc.font = 'bold 8px sans-serif'
  rc.textAlign = 'center'
  rc.textBaseline = 'top'
  rc.fillText('!', Math.floor(x), by)
  rc.textBaseline = 'alphabetic'
}

export function drawCharInRoom(s: DrawState, idx: number, cx: number, cy: number, bounce: number): void {
  const { rc } = s
  const ch = ROOM_CHARS[idx]
  const px = cx - 5, py = cy - 12 + (bounce || 0)
  rc.fillStyle = ch.body
  rc.fillRect(px + 2, py + 4, 8, 7)
  rc.fillRect(px + 1, py + 1, 10, 6)
  rc.fillRect(px + 2, py, 8, 2)
  rc.fillRect(px + 1, py - 1, 3, 3)
  rc.fillRect(px + 8, py - 1, 3, 3)
  rc.fillStyle = ch.accent
  rc.fillRect(px + 2, py, 1, 2)
  rc.fillRect(px + 9, py, 1, 2)
  rc.fillStyle = ch.light
  rc.fillRect(px + 3, py + 4, 6, 3)
  rc.fillStyle = ch.eye
  rc.fillRect(px + 3, py + 3, 2, 2)
  rc.fillRect(px + 7, py + 3, 2, 2)
  rc.fillStyle = '#111'
  rc.fillRect(px + 4, py + 3, 1, 1)
  rc.fillRect(px + 7, py + 3, 1, 1)
  rc.fillStyle = ch.body
  rc.fillRect(px + 2, py + 11, 3, 2)
  rc.fillRect(px + 7, py + 11, 3, 2)
}

export function drawSelectMode(s: DrawState): void {
  const { rc, selectIdx, RW, RH } = s
  drawRoom(s)

  for (let i = 0; i < 4; i++) {
    const sc = selectChars[i]
    const bounce = (i === selectIdx) ? Math.sin(Date.now() * 0.006) * 2 : 0
    rc.fillStyle = 'rgba(0,0,0,0.2)'
    rc.fillRect(sc.x - 4, sc.y + 1, 8, 3)
    drawCharInRoom(s, i, sc.x, sc.y, bounce)
    if (i === selectIdx) {
      const arrowY = Math.sin(Date.now() * 0.008) * 2
      rc.fillStyle = '#ffdd44'
      rc.fillRect(sc.x - 2, sc.y - 20 + arrowY, 5, 3)
      rc.fillRect(sc.x - 1, sc.y - 17 + arrowY, 3, 2)
      rc.font = '6px monospace'
      rc.textAlign = 'center'
      rc.fillText(ROOM_CHARS[i].name, sc.x, sc.y - 24)
    }
  }

  rc.fillStyle = '#fff'
  rc.font = '7px monospace'
  rc.textAlign = 'center'
  rc.fillText('< > SELECT    SPACE OK', RW / 2, RH - 6)
}
