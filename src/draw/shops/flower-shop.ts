import { TILE } from '../../common/rooms'

// ===== 花屋の中 =====
export function drawFlowerShop(rc: CanvasRenderingContext2D): void {
  // 床を薄緑タイルに
  rc.fillStyle = 'rgba(200,240,200,0.12)'
  rc.fillRect(TILE, 2 * TILE, TILE * 13, TILE * 8)

  // 壁を薄緑に
  rc.fillStyle = '#ddeedd'
  rc.fillRect(TILE, TILE, TILE * 13, TILE)

  // 花ヘルパー（大きめ）
  const drawBigFlower = (fx: number, fy: number, color: string, size: number) => {
    // 花びら
    rc.fillStyle = color
    rc.fillRect(fx, fy, size, size)
    rc.fillRect(fx - 1, fy + 1, size + 2, size - 2)
    rc.fillRect(fx + 1, fy - 1, size - 2, size + 2)
    // 中心
    rc.fillStyle = '#ffee55'
    rc.fillRect(fx + Math.floor(size/2) - 1, fy + Math.floor(size/2) - 1, 2, 2)
    // 茎
    rc.fillStyle = '#338833'
    rc.fillRect(fx + Math.floor(size/2), fy + size, 1, 6)
    // 葉っぱ
    rc.fillStyle = '#44aa44'
    rc.fillRect(fx + Math.floor(size/2) + 1, fy + size + 2, 2, 2)
  }

  // --- 棚の上に花（row1、大きめで華やか）---
  const shelfColors = ['#cc2244', '#ff6688', '#ffcc00', '#ff88cc', '#aa44ff', '#44ddaa', '#ffaa44', '#4488ff', '#ff4466', '#88ccff']
  for (let i = 0; i < 10; i++) {
    drawBigFlower(TILE + 8 + i * 20, TILE + 2, shelfColors[i], 5)
  }

  // --- 左右に大きな花瓶（row3）---
  // 左の花瓶
  rc.fillStyle = '#6688cc'
  rc.fillRect(3 * TILE, 3 * TILE + 4, 12, 12)
  rc.fillStyle = '#7799dd'
  rc.fillRect(3 * TILE + 1, 3 * TILE + 5, 10, 10)
  drawBigFlower(3 * TILE - 1, 2 * TILE + 10, '#ff4466', 6)
  drawBigFlower(3 * TILE + 6, 2 * TILE + 8, '#ffaa44', 5)

  // 右の花瓶
  rc.fillStyle = '#cc88aa'
  rc.fillRect(11 * TILE + 4, 3 * TILE + 4, 12, 12)
  rc.fillStyle = '#dd99bb'
  rc.fillRect(11 * TILE + 5, 3 * TILE + 5, 10, 10)
  drawBigFlower(11 * TILE + 3, 2 * TILE + 10, '#aaccff', 6)
  drawBigFlower(11 * TILE + 10, 2 * TILE + 8, '#44ddaa', 5)

  // --- 花束ディスプレイ（row4、カウンター手前）---
  const bouquetData = [
    { x: 3, color: '#ff4466' },
    { x: 5, color: '#ffcc00' },
    { x: 9, color: '#aa44ff' },
    { x: 11, color: '#44ddaa' },
  ]
  for (const b of bouquetData) {
    const bx = b.x * TILE + 2, by = 4 * TILE + 2
    // 包み紙
    rc.fillStyle = '#f0e8d0'
    rc.fillRect(bx, by + 5, 12, 8)
    rc.fillStyle = '#e0d8c0'
    rc.fillRect(bx + 1, by + 6, 10, 6)
    // リボン
    rc.fillStyle = '#cc6688'
    rc.fillRect(bx + 4, by + 5, 4, 2)
    // 花（大きめ）
    drawBigFlower(bx + 2, by - 2, b.color, 5)
  }

  // --- カウンター上にレジ+花束（row5）---
  // レジ
  rc.fillStyle = '#ddd'
  rc.fillRect(7 * TILE, 5 * TILE + 2, 14, 10)
  rc.fillStyle = '#ccc'
  rc.fillRect(7 * TILE + 1, 5 * TILE + 3, 12, 6)
  rc.fillStyle = '#44aa44'
  rc.fillRect(7 * TILE + 3, 5 * TILE + 5, 8, 3)

  // --- 下半分に鉢植え（row7、左右に2つずつ）---
  const potData = [
    { x: 2, color: '#ff4444' },
    { x: 4, color: '#ffaa00' },
    { x: 10, color: '#44aaff' },
    { x: 12, color: '#44dd44' },
  ]
  for (const p of potData) {
    const ppx = p.x * TILE + 4, ppy = 7 * TILE + 2
    rc.fillStyle = '#aa6633'
    rc.fillRect(ppx, ppy + 6, 10, 8)
    rc.fillStyle = '#bb7744'
    rc.fillRect(ppx + 1, ppy + 7, 8, 6)
    rc.fillStyle = '#996622'
    rc.fillRect(ppx - 1, ppy + 6, 12, 2)
    drawBigFlower(ppx + 2, ppy - 2, p.color, 5)
  }
}
