// ===== 商店街・店舗の描画 =====
import { TILE } from './rooms'

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

// ===== ラーメン屋の中 =====
export function drawRamenShop(rc: CanvasRenderingContext2D): void {
  // 壁を暖色に
  rc.fillStyle = '#f0e0cc'
  rc.fillRect(TILE, TILE, TILE * 13, TILE)

  // 壁の中央にのれん
  rc.fillStyle = '#fff'
  for (let ni = 0; ni < 4; ni++) {
    rc.fillRect(5 * TILE + 4 + ni * 12, 1 * TILE + 8, 10, 8)
  }
  rc.fillStyle = '#cc6633'
  rc.font = '7px sans-serif'
  rc.textAlign = 'center'
  rc.fillText('ラーメン', 7 * TILE, 1 * TILE + 7)

  // メニュー看板（壁左 col1-3）
  rc.fillStyle = '#553322'
  rc.fillRect(1 * TILE + 2, 1 * TILE + 1, TILE * 2 + 8, TILE)
  rc.fillStyle = '#f0e8d0'
  rc.fillRect(1 * TILE + 4, 1 * TILE + 3, TILE * 2 + 4, TILE - 4)
  rc.fillStyle = '#333'
  rc.font = '4px sans-serif'
  rc.textAlign = 'left'
  rc.fillText('しょうゆ 500', 1 * TILE + 5, 1 * TILE + 8)
  rc.fillText('みそ   600', 1 * TILE + 5, 1 * TILE + 14)

  // メニュー看板（壁右 col11-13）
  rc.fillStyle = '#553322'
  rc.fillRect(11 * TILE + 2, 1 * TILE + 1, TILE * 2 + 8, TILE)
  rc.fillStyle = '#f0e8d0'
  rc.fillRect(11 * TILE + 4, 1 * TILE + 3, TILE * 2 + 4, TILE - 4)
  rc.fillStyle = '#333'
  rc.fillText('しお   500', 11 * TILE + 5, 1 * TILE + 8)
  rc.fillText('とんこつ 700', 11 * TILE + 5, 1 * TILE + 14)

  // 壁の時計（中央右寄り）
  rc.fillStyle = '#6a4a22'
  rc.fillRect(10 * TILE - 1, 1 * TILE + 1, 10, 10)
  rc.fillStyle = '#f0ead8'
  rc.fillRect(10 * TILE, 1 * TILE + 2, 8, 8)
  rc.fillStyle = '#333'
  rc.fillRect(10 * TILE + 4, 1 * TILE + 3, 1, 3)
  rc.fillRect(10 * TILE + 4, 1 * TILE + 6, 3, 1)

  // カウンターの上に丼5つ（大きめ）
  for (let i = 0; i < 5; i++) {
    const dx = (3 + i * 2) * TILE
    // 丼（大きめ）
    rc.fillStyle = '#eee'
    rc.fillRect(dx + 1, 3 * TILE + 2, 12, 8)
    rc.fillStyle = '#cc3333'
    rc.fillRect(dx + 1, 3 * TILE + 2, 12, 3)
    // スープ
    rc.fillStyle = '#c8a060'
    rc.fillRect(dx + 2, 3 * TILE + 4, 10, 4)
    // 麺
    rc.fillStyle = '#eedd88'
    rc.fillRect(dx + 3, 3 * TILE + 4, 4, 3)
    // チャーシュー
    rc.fillStyle = '#aa6644'
    rc.fillRect(dx + 8, 3 * TILE + 5, 3, 2)
    // 湯気
    rc.fillStyle = 'rgba(255,255,255,0.3)'
    rc.fillRect(dx + 4, 3 * TILE, 1, 2)
    rc.fillRect(dx + 8, 3 * TILE - 1, 1, 3)
  }

  // 箸（カウンター上）
  for (let i = 0; i < 5; i++) {
    const dx = (3 + i * 2) * TILE
    rc.fillStyle = '#8a6a40'
    rc.fillRect(dx + 13, 3 * TILE + 4, 1, 6)
    rc.fillRect(dx + 14, 3 * TILE + 4, 1, 6)
  }

  // 調味料セット（丼と丼の間に3セット）
  const seasoningX = [4 * TILE + 6, 8 * TILE + 2, 10 * TILE + 6]
  for (const sx of seasoningX) {
    // 醤油
    rc.fillStyle = '#332211'
    rc.fillRect(sx, 3 * TILE + 2, 2, 6)
    rc.fillStyle = '#cc2222'
    rc.fillRect(sx, 3 * TILE + 1, 2, 2)
    // 酢
    rc.fillStyle = '#ddcc88'
    rc.fillRect(sx + 3, 3 * TILE + 3, 2, 5)
    // ラー油
    rc.fillStyle = '#cc4422'
    rc.fillRect(sx + 6, 3 * TILE + 3, 2, 5)
    rc.fillStyle = '#aa3311'
    rc.fillRect(sx + 6, 3 * TILE + 2, 2, 2)
  }

  // 調味料（左テーブル上）
  rc.fillStyle = '#332211'
  rc.fillRect(4 * TILE + 4, 6 * TILE + 3, 2, 5)
  rc.fillStyle = '#cc2222'
  rc.fillRect(4 * TILE + 4, 6 * TILE + 2, 2, 2)
  rc.fillStyle = '#ddcc88'
  rc.fillRect(4 * TILE + 7, 6 * TILE + 3, 2, 5)

  // 調味料（右テーブル上）
  rc.fillStyle = '#332211'
  rc.fillRect(11 * TILE + 4, 6 * TILE + 3, 2, 5)
  rc.fillStyle = '#cc2222'
  rc.fillRect(11 * TILE + 4, 6 * TILE + 2, 2, 2)
  rc.fillStyle = '#cc4422'
  rc.fillRect(11 * TILE + 7, 6 * TILE + 3, 2, 5)
  rc.fillStyle = '#aa3311'
  rc.fillRect(11 * TILE + 7, 6 * TILE + 2, 2, 2)

  // テーブル席（row6、タイルで配置済み）
  // 左テーブルの上に湯呑
  rc.fillStyle = 'rgba(200,220,255,0.6)'
  rc.fillRect(3 * TILE + 4, 6 * TILE + 3, 4, 5)
  rc.fillStyle = 'rgba(180,200,240,0.4)'
  rc.fillRect(3 * TILE + 5, 6 * TILE + 4, 2, 3)

  // 右テーブルの上に湯呑
  rc.fillStyle = 'rgba(200,220,255,0.6)'
  rc.fillRect(10 * TILE + 4, 6 * TILE + 3, 4, 5)
  rc.fillStyle = 'rgba(180,200,240,0.4)'
  rc.fillRect(10 * TILE + 5, 6 * TILE + 4, 2, 3)

  // 壁のポスター（ラーメン写真っぽい）
  rc.fillStyle = '#ffcc88'
  rc.fillRect(9 * TILE, 1 * TILE + 2, 8, 8)
  rc.fillStyle = '#cc9955'
  rc.fillRect(9 * TILE + 1, 1 * TILE + 3, 6, 6)

  // 暖かい光
  rc.fillStyle = 'rgba(255,200,100,0.05)'
  rc.fillRect(TILE, TILE * 2, TILE * 13, TILE * 8)
}

// ===== 各店舗の個別外観描画 =====

// たいやき屋（瓦屋根風、煙突つき）
function drawShopTaiyaki(rc: CanvasRenderingContext2D, cx: number, w: number) {
  const sy = 1 * TILE
  // 瓦屋根（段々）
  rc.fillStyle = '#8a5533'
  rc.fillRect(cx - 2, sy - 4, w + 4, 6)
  rc.fillStyle = '#7a4a28'
  for (let i = 0; i < Math.floor((w + 4) / 6); i++) {
    rc.fillRect(cx - 2 + i * 6, sy - 5, 5, 2)
  }
  // 煙突
  rc.fillStyle = '#6a4a2a'
  rc.fillRect(cx + w - 10, sy - 12, 6, 9)
  rc.fillStyle = '#5a3a1a'
  rc.fillRect(cx + w - 11, sy - 13, 8, 2)
  // 煙
  rc.fillStyle = 'rgba(200,200,200,0.3)'
  rc.fillRect(cx + w - 9, sy - 16, 2, 3)
  rc.fillRect(cx + w - 7, sy - 18, 2, 2)
  // 外壁（暖色土壁）
  rc.fillStyle = '#c8a060'
  rc.fillRect(cx, sy, w, TILE * 2)
  // 壁の横線（土壁感）
  rc.fillStyle = '#b89050'
  rc.fillRect(cx, sy + 8, w, 1)
  rc.fillRect(cx, sy + 20, w, 1)
  // 外壁下端
  rc.fillStyle = '#a88040'
  rc.fillRect(cx, sy + TILE * 2 - 2, w, 2)
  // 看板（木の縦看板）
  rc.fillStyle = '#6a4422'
  rc.fillRect(cx + 4, sy + 1, 12, TILE * 2 - 4)
  rc.fillStyle = '#7a5432'
  rc.fillRect(cx + 5, sy + 2, 10, TILE * 2 - 6)
  rc.fillStyle = '#fff'
  rc.font = '5px sans-serif'
  rc.textAlign = 'center'
  rc.fillText('た', cx + 10, sy + 8)
  rc.fillText('い', cx + 10, sy + 14)
  rc.fillText('焼', cx + 10, sy + 20)
  // のれん（紺）
  rc.fillStyle = '#334477'
  const nW = Math.floor((w - 20) / 3)
  for (let ni = 0; ni < 3; ni++) {
    rc.fillRect(cx + 18 + ni * (nW + 1), sy + TILE * 2 - 8, nW, 8)
  }
  // のれんの白い模様
  rc.fillStyle = 'rgba(255,255,255,0.3)'
  for (let ni = 0; ni < 3; ni++) {
    rc.fillRect(cx + 18 + ni * (nW + 1) + 2, sy + TILE * 2 - 6, nW - 4, 1)
  }
}

// 花屋（丸みのある屋根、ツタが這う）
function drawShopFlower(rc: CanvasRenderingContext2D, cx: number, w: number) {
  const sy = 1 * TILE
  // アーチ型の屋根
  rc.fillStyle = '#558855'
  rc.fillRect(cx, sy - 2, w, 4)
  rc.fillRect(cx + 2, sy - 4, w - 4, 3)
  rc.fillRect(cx + 6, sy - 6, w - 12, 3)
  // 外壁（白っぽいレンガ）
  rc.fillStyle = '#e8e0d0'
  rc.fillRect(cx, sy, w, TILE * 2)
  // レンガ模様
  rc.fillStyle = '#d8d0c0'
  for (let row = 0; row < 4; row++) {
    const offset = row % 2 === 0 ? 0 : 5
    for (let bx = 0; bx < Math.floor(w / 10); bx++) {
      rc.fillRect(cx + offset + bx * 10, sy + row * 7, 9, 6)
    }
  }
  rc.fillStyle = '#c8c0b0'
  for (let row = 0; row < 4; row++) {
    rc.fillRect(cx, sy + row * 7 + 6, w, 1)
  }
  // 外壁下端
  rc.fillStyle = '#aab8aa'
  rc.fillRect(cx, sy + TILE * 2 - 2, w, 2)
  // 看板（緑の楕円風）
  rc.fillStyle = '#448844'
  rc.fillRect(cx + (w - 40) / 2, sy + 2, 40, 11)
  rc.fillRect(cx + (w - 42) / 2, sy + 3, 42, 9)
  rc.fillStyle = '#fff'
  rc.font = '7px sans-serif'
  rc.textAlign = 'center'
  rc.fillText('はなや', cx + w / 2, sy + 11)
  // ツタ（右壁に）
  rc.fillStyle = '#55aa44'
  rc.fillRect(cx + w - 3, sy + 2, 2, TILE * 2 - 4)
  rc.fillRect(cx + w - 5, sy + 6, 3, 2)
  rc.fillRect(cx + w - 6, sy + 12, 3, 2)
  rc.fillRect(cx + w - 4, sy + 18, 2, 3)
  // 小さい花（ツタに）
  rc.fillStyle = '#ff88aa'
  rc.fillRect(cx + w - 6, sy + 5, 2, 2)
  rc.fillStyle = '#ffcc44'
  rc.fillRect(cx + w - 5, sy + 11, 2, 2)
  rc.fillStyle = '#ff6688'
  rc.fillRect(cx + w - 5, sy + 17, 2, 2)
  // のれん（薄緑）
  rc.fillStyle = '#88cc88'
  const nW = Math.floor((w - 8) / 3)
  for (let ni = 0; ni < 3; ni++) {
    rc.fillRect(cx + 4 + ni * (nW + 1), sy + TILE * 2 - 6, nW, 6)
  }
}

// 駄菓子屋（古い木造、深いひさし）
function drawShopDagashi(rc: CanvasRenderingContext2D, cx: number, w: number) {
  const sy = 1 * TILE
  // 深いひさし（波板トタン風）
  rc.fillStyle = '#8899aa'
  rc.fillRect(cx - 3, sy - 2, w + 6, 5)
  rc.fillStyle = '#7788aa'
  for (let i = 0; i < Math.floor((w + 6) / 4); i++) {
    rc.fillRect(cx - 3 + i * 4, sy - 3, 3, 1)
  }
  // ひさしの影
  rc.fillStyle = 'rgba(0,0,0,0.1)'
  rc.fillRect(cx, sy + 2, w, 2)
  // 外壁（古い木造）
  rc.fillStyle = '#b89060'
  rc.fillRect(cx, sy, w, TILE * 2)
  // 木目の縦線
  rc.fillStyle = '#a88050'
  for (let i = 0; i < Math.floor(w / 8); i++) {
    rc.fillRect(cx + 3 + i * 8, sy, 1, TILE * 2)
  }
  // 外壁下端
  rc.fillStyle = '#8a6a40'
  rc.fillRect(cx, sy + TILE * 2 - 3, w, 3)
  // 看板（古い木板、斜め掛け風）
  rc.fillStyle = '#6a4a22'
  rc.fillRect(cx + (w - 38) / 2, sy + 1, 38, 12)
  rc.fillStyle = '#7a5a32'
  rc.fillRect(cx + (w - 36) / 2, sy + 2, 36, 10)
  rc.fillStyle = '#ffee88'
  rc.font = '7px sans-serif'
  rc.textAlign = 'center'
  rc.fillText('だがし', cx + w / 2, sy + 10)
  // 吊り看板の紐
  rc.fillStyle = '#886'
  rc.fillRect(cx + (w - 38) / 2 + 2, sy - 1, 1, 3)
  rc.fillRect(cx + (w - 38) / 2 + 35, sy - 1, 1, 3)
  // ガラス引き戸（中が見える風）
  rc.fillStyle = 'rgba(180,200,220,0.4)'
  rc.fillRect(cx + 6, sy + 14, w - 12, 10)
  rc.fillStyle = '#6a5a3a'
  rc.fillRect(cx + 6 + Math.floor((w - 12) / 2), sy + 14, 2, 10)
  // 引き戸の枠
  rc.fillStyle = '#5a4a2a'
  rc.fillRect(cx + 6, sy + 14, w - 12, 1)
  rc.fillRect(cx + 6, sy + 23, w - 12, 1)
}

// ラーメン屋（和風瓦屋根、大きなのれん）
function drawShopRamen(rc: CanvasRenderingContext2D, cx: number, w: number) {
  const sy = 1 * TILE
  // 和風瓦屋根（反り返り）
  rc.fillStyle = '#444'
  rc.fillRect(cx - 3, sy - 3, w + 6, 5)
  rc.fillRect(cx - 1, sy - 5, w + 2, 3)
  // 瓦の線
  rc.fillStyle = '#555'
  for (let i = 0; i < Math.floor((w + 6) / 5); i++) {
    rc.fillRect(cx - 3 + i * 5, sy - 4, 4, 1)
  }
  // 屋根の反り（両端を少し上げる）
  rc.fillStyle = '#444'
  rc.fillRect(cx - 4, sy - 5, 3, 2)
  rc.fillRect(cx + w + 1, sy - 5, 3, 2)
  // 外壁（赤茶色）
  rc.fillStyle = '#b85533'
  rc.fillRect(cx, sy, w, TILE * 2)
  // 壁の横線
  rc.fillStyle = '#a84a28'
  rc.fillRect(cx, sy + 10, w, 1)
  // 外壁下端
  rc.fillStyle = '#8a3a18'
  rc.fillRect(cx, sy + TILE * 2 - 2, w, 2)
  // 看板（提灯型 — 赤い丸に白文字）
  rc.fillStyle = '#cc2222'
  rc.fillRect(cx + (w - 30) / 2, sy + 1, 30, 12)
  rc.fillRect(cx + (w - 32) / 2, sy + 2, 32, 10)
  rc.fillStyle = '#fff'
  rc.font = '7px sans-serif'
  rc.textAlign = 'center'
  rc.fillText('ラーメン', cx + w / 2, sy + 10)
  // 大きなのれん（白、4枚）
  rc.fillStyle = '#fff'
  const nW = Math.floor((w - 6) / 4)
  for (let ni = 0; ni < 4; ni++) {
    rc.fillRect(cx + 3 + ni * (nW + 1), sy + TILE * 2 - 10, nW, 10)
  }
  // のれんに赤い線
  rc.fillStyle = '#cc3333'
  for (let ni = 0; ni < 4; ni++) {
    rc.fillRect(cx + 3 + ni * (nW + 1), sy + TILE * 2 - 10, nW, 2)
  }
}

// レコード屋（モダン平屋根、大きなショーウィンドウ）
function drawShopRecords(rc: CanvasRenderingContext2D, cx: number, w: number) {
  const sy = 1 * TILE
  // モダンな平屋根（パラペット）
  rc.fillStyle = '#5a4a30'
  rc.fillRect(cx - 1, sy - 2, w + 2, 4)
  rc.fillStyle = '#4a3a20'
  rc.fillRect(cx, sy - 3, w, 2)
  // 外壁（レンガ調の暖色）
  rc.fillStyle = '#8a6a40'
  rc.fillRect(cx, sy, w, TILE * 2)
  // 外壁下端
  rc.fillStyle = '#6a4a20'
  rc.fillRect(cx, sy + TILE * 2 - 2, w, 2)
  // ネオン風看板（光る枠）
  rc.fillStyle = '#ffcc44'
  rc.fillRect(cx + (w - 50) / 2 - 1, sy + 1, 52, 13)
  rc.fillStyle = '#2a1a10'
  rc.fillRect(cx + (w - 50) / 2, sy + 2, 50, 11)
  rc.fillStyle = '#ffcc44'
  rc.font = '7px sans-serif'
  rc.textAlign = 'center'
  rc.fillText('RECORDS', cx + w / 2, sy + 11)
  // 大きなショーウィンドウ
  rc.fillStyle = '#f0e0c0'
  rc.fillRect(cx + 4, sy + 14, w - 8, 12)
  rc.fillStyle = '#6a4a20'
  rc.fillRect(cx + 4 + Math.floor((w - 8) / 2), sy + 14, 1, 12)
  // ウィンドウの枠
  rc.fillStyle = '#5a3a10'
  rc.fillRect(cx + 4, sy + 14, w - 8, 1)
  rc.fillRect(cx + 4, sy + 25, w - 8, 1)
  // レコード盤（ウィンドウ内）
  rc.fillStyle = '#111'
  rc.fillRect(cx + 8, sy + 16, 6, 6)
  rc.fillRect(cx + 9, sy + 15, 4, 8)
  rc.fillStyle = '#cc3333'
  rc.fillRect(cx + 10, sy + 18, 2, 2)
  rc.fillStyle = '#111'
  rc.fillRect(cx + Math.floor(w / 2) + 4, sy + 16, 6, 6)
  rc.fillRect(cx + Math.floor(w / 2) + 5, sy + 15, 4, 8)
  rc.fillStyle = '#3366cc'
  rc.fillRect(cx + Math.floor(w / 2) + 6, sy + 18, 2, 2)
  // のれん（木目調の短いひさし）
  rc.fillStyle = '#aa7744'
  rc.fillRect(cx + 4, sy + TILE * 2 - 4, w - 8, 4)
}

// 交番（三角屋根、青い公的施設）
function drawShopKoban(rc: CanvasRenderingContext2D, cx: number, w: number) {
  const sy = 1 * TILE
  // 三角屋根
  rc.fillStyle = '#3355aa'
  rc.fillRect(cx + 2, sy - 6, w - 4, 3)
  rc.fillRect(cx + 6, sy - 8, w - 12, 3)
  rc.fillRect(cx + 10, sy - 10, w - 20, 3)
  // 屋根の縁
  rc.fillStyle = '#2244aa'
  rc.fillRect(cx - 2, sy - 3, w + 4, 4)
  // 外壁（薄い灰色）
  rc.fillStyle = '#d0d0d0'
  rc.fillRect(cx, sy, w, TILE * 2)
  // 壁の横線（コンクリ風）
  rc.fillStyle = '#c4c4c4'
  rc.fillRect(cx, sy + 10, w, 1)
  rc.fillRect(cx, sy + 20, w, 1)
  // 外壁下端
  rc.fillStyle = '#aaaaaa'
  rc.fillRect(cx, sy + TILE * 2 - 2, w, 2)
  // 看板（青い公式看板）
  rc.fillStyle = '#2244aa'
  rc.fillRect(cx + (w - 36) / 2, sy + 2, 36, 11)
  rc.fillStyle = '#fff'
  rc.font = '7px sans-serif'
  rc.textAlign = 'center'
  rc.fillText('交番', cx + w / 2, sy + 11)
  // 赤ランプ
  rc.fillStyle = '#dd3333'
  rc.fillRect(cx + Math.floor(w / 2) - 2, sy - 12, 5, 4)
  rc.fillStyle = '#ff4444'
  rc.fillRect(cx + Math.floor(w / 2) - 1, sy - 11, 3, 2)
  // 窓（格子付き）
  rc.fillStyle = 'rgba(180,200,230,0.5)'
  rc.fillRect(cx + 6, sy + 14, 10, 10)
  rc.fillStyle = '#888'
  rc.fillRect(cx + 6, sy + 18, 10, 1)
  rc.fillRect(cx + 10, sy + 14, 1, 10)
  // 星マーク
  rc.fillStyle = '#ffdd00'
  rc.fillRect(cx + w - 14, sy + 16, 5, 5)
  rc.fillRect(cx + w - 13, sy + 15, 3, 1)
  rc.fillRect(cx + w - 13, sy + 21, 3, 1)
}

// 商店街・手前（たいやき屋・花屋・駄菓子屋）
export function drawStreetFront(rc: CanvasRenderingContext2D): void {
  drawShopTaiyaki(rc, 1 * TILE, TILE * 4)
  // たいやき屋: 日よけテント（赤白ストライプ）
  for (let si = 0; si < 8; si++) {
    rc.fillStyle = si % 2 === 0 ? '#cc3333' : '#fff'
    rc.fillRect(1 * TILE + si * 8, 3 * TILE - 2, 8, 3)
  }

  drawShopFlower(rc, 5 * TILE, TILE * 4)

  drawShopDagashi(rc, 9 * TILE, TILE * 4)

  // --- 店先の商品（歩道 row3-4 に表示、大きめ）---
  const shopY = 3 * TILE

  // たいやき屋: 屋台トレイ（大きめ）
  rc.fillStyle = '#8a6a40'
  rc.fillRect(1 * TILE + 2, shopY + 2, TILE * 3 + 4, 12)
  rc.fillStyle = '#9a7a50'
  rc.fillRect(1 * TILE + 3, shopY + 3, TILE * 3 + 2, 10)
  // たいやき3個（魚の形）
  for (let ti = 0; ti < 3; ti++) {
    const tx = 1 * TILE + 6 + ti * 14, ty = shopY + 3
    // 体（楕円っぽく）
    rc.fillStyle = '#dda844'
    rc.fillRect(tx + 1, ty, 6, 6)
    rc.fillRect(tx, ty + 1, 8, 4)
    // しっぽ
    rc.fillRect(tx + 8, ty + 2, 2, 2)
    rc.fillRect(tx + 9, ty + 1, 1, 4)
    // 焼き色
    rc.fillStyle = '#cc9933'
    rc.fillRect(tx + 2, ty + 2, 4, 2)
    // 目
    rc.fillStyle = '#553311'
    rc.fillRect(tx + 2, ty + 1, 1, 1)
  }
  // 湯気
  rc.fillStyle = 'rgba(255,255,255,0.3)'
  rc.fillRect(1 * TILE + 10, shopY, 1, 3)
  rc.fillRect(1 * TILE + 22, shopY - 1, 1, 3)
  rc.fillRect(1 * TILE + 36, shopY, 1, 2)


  // 花屋: 花バケツ2つ（col5, col6）
  for (const fb of [
    { x: 5 * TILE + 4, colors: ['#ff4466', '#ff88aa'] },
    { x: 6 * TILE + 4, colors: ['#ffcc00', '#ffee66'] },
  ]) {
    rc.fillStyle = '#666'
    rc.fillRect(fb.x, shopY + 4, 10, 10)
    rc.fillStyle = '#777'
    rc.fillRect(fb.x + 1, shopY + 5, 8, 8)
    rc.fillStyle = fb.colors[0]
    rc.fillRect(fb.x + 1, shopY, 4, 5)
    rc.fillStyle = fb.colors[1]
    rc.fillRect(fb.x + 5, shopY + 1, 4, 4)
  }

  // 駄菓子屋: 棚+お菓子（それぞれ違う形）
  rc.fillStyle = '#8a6a40'
  rc.fillRect(9 * TILE + 2, shopY + 2, TILE * 3 + 4, 12)
  rc.fillStyle = '#9a7a50'
  rc.fillRect(9 * TILE + 3, shopY + 3, TILE * 3 + 2, 10)
  const dx = 9 * TILE + 4, dy = shopY + 4
  // うまい棒（赤い筒）
  rc.fillStyle = '#ff4444'
  rc.fillRect(dx, dy + 1, 3, 6)
  rc.fillStyle = '#cc2222'
  rc.fillRect(dx, dy, 3, 1)
  // ラムネ瓶（青）
  rc.fillStyle = '#44aaff'
  rc.fillRect(dx + 8, dy + 2, 4, 5)
  rc.fillRect(dx + 9, dy, 2, 3)
  rc.fillStyle = '#88ccff'
  rc.fillRect(dx + 9, dy + 3, 2, 2)
  // ガム（緑の丸）
  rc.fillStyle = '#44dd44'
  rc.fillRect(dx + 17, dy + 1, 4, 4)
  rc.fillRect(dx + 18, dy, 2, 6)
  rc.fillStyle = '#33cc33'
  rc.fillRect(dx + 18, dy + 2, 2, 2)
  // あめ玉（オレンジ）
  rc.fillStyle = '#ffaa00'
  rc.fillRect(dx + 25, dy + 1, 4, 4)
  rc.fillRect(dx + 26, dy, 2, 6)
  rc.fillStyle = '#fff'
  rc.fillRect(dx + 26, dy + 2, 1, 1)
  // チョコ（ピンクの包み）
  rc.fillStyle = '#ff88cc'
  rc.fillRect(dx + 33, dy + 1, 5, 4)
  rc.fillStyle = '#ffaadd'
  rc.fillRect(dx + 34, dy + 2, 3, 2)
  rc.fillStyle = '#cc66aa'
  rc.fillRect(dx + 33, dy + 1, 1, 4)
  rc.fillRect(dx + 37, dy + 1, 1, 4)

  // --- 下側の歩道に自販機（col3-4 row7）---
  const vmx = 3 * TILE, vmy = 7 * TILE
  // 自販機1（赤）
  rc.fillStyle = '#dd3333'
  rc.fillRect(vmx + 1, vmy + 2, 12, 12)
  rc.fillStyle = '#ee4444'
  rc.fillRect(vmx + 2, vmy + 3, 10, 5)
  // ドリンク
  rc.fillStyle = '#fff'
  rc.fillRect(vmx + 3, vmy + 4, 2, 3)
  rc.fillStyle = '#88ccff'
  rc.fillRect(vmx + 6, vmy + 4, 2, 3)
  rc.fillStyle = '#ffcc00'
  rc.fillRect(vmx + 9, vmy + 4, 2, 3)
  // 取り出し口
  rc.fillStyle = '#333'
  rc.fillRect(vmx + 3, vmy + 10, 8, 2)
  // 光
  rc.fillStyle = 'rgba(255,255,200,0.15)'
  rc.fillRect(vmx + 1, vmy + 1, 12, 1)

  // 自販機2（青、隣）
  const vm2x = 4 * TILE
  rc.fillStyle = '#3366cc'
  rc.fillRect(vm2x + 3, vmy + 2, 12, 12)
  rc.fillStyle = '#4477dd'
  rc.fillRect(vm2x + 4, vmy + 3, 10, 5)
  // ドリンク
  rc.fillStyle = '#44dd44'
  rc.fillRect(vm2x + 5, vmy + 4, 2, 3)
  rc.fillStyle = '#ff88aa'
  rc.fillRect(vm2x + 8, vmy + 4, 2, 3)
  rc.fillStyle = '#fff'
  rc.fillRect(vm2x + 11, vmy + 4, 2, 3)
  rc.fillStyle = '#333'
  rc.fillRect(vm2x + 5, vmy + 10, 8, 2)

  // --- 歩道の装飾（row7-8）---

  // ベンチ2つ（col7, col11）
  for (const bCol of [7, 11]) {
    const bnx = bCol * TILE + 2, bny = 7 * TILE + 6
    rc.fillStyle = '#8a6a40'
    rc.fillRect(bnx, bny, 12, 4)
    rc.fillStyle = '#555'
    rc.fillRect(bnx + 1, bny + 4, 2, 4)
    rc.fillRect(bnx + 9, bny + 4, 2, 4)
  }

  // 街灯2つ（col2, col9）
  for (const lCol of [2, 9]) {
    const slx = lCol * TILE + 7, sly = 7 * TILE
    rc.fillStyle = '#888'
    rc.fillRect(slx, sly + 2, 2, 14)
    rc.fillStyle = '#ffcc44'
    rc.fillRect(slx - 2, sly + 2, 6, 3)
    // 光
    rc.fillStyle = 'rgba(255,220,100,0.06)'
    rc.fillRect(slx - 8, sly, 20, 16)
  }

  // --- 森（row9-11）---
  rc.fillStyle = '#338833'
  rc.fillRect(TILE, 9 * TILE, TILE * 13, TILE * 3)
  // 木を並べる
  const treeX = [2, 4, 6, 8, 10, 12]
  for (const tx of treeX) {
    const ttx = tx * TILE, tty = 9 * TILE
    // 幹
    rc.fillStyle = '#6a4422'
    rc.fillRect(ttx + 6, tty + 14, 4, 10)
    rc.fillStyle = '#7a5432'
    rc.fillRect(ttx + 7, tty + 14, 2, 10)
    // 葉（丸い）
    rc.fillStyle = '#44aa44'
    rc.fillRect(ttx + 2, tty + 6, 12, 10)
    rc.fillRect(ttx + 4, tty + 4, 8, 14)
    rc.fillStyle = '#55bb55'
    rc.fillRect(ttx + 4, tty + 6, 8, 6)
    rc.fillStyle = '#66cc66'
    rc.fillRect(ttx + 5, tty + 7, 4, 3)
  }
  // 草
  rc.fillStyle = '#44aa44'
  for (let gx = TILE + 4; gx < 14 * TILE; gx += 6) {
    rc.fillRect(gx, 9 * TILE + 2, 2, 3)
  }
}

// 商店街・奥（ラーメン屋・レコード屋・交番）
export function drawStreetBack(rc: CanvasRenderingContext2D): void {
  drawShopRamen(rc, 1 * TILE, TILE * 4)
  // ラーメン屋: 提灯2つ（看板の両側、屋根の縁から吊り下げ）
  const signLeft = 1 * TILE + (TILE * 4 - 30) / 2  // 看板左端
  const roofBottom = 1 * TILE - 1                    // 屋根の縁の下端
  for (const lx of [signLeft - 12, signLeft + 36]) {
    // 紐（屋根の縁から短く）
    rc.fillStyle = '#886'
    rc.fillRect(lx + 2, roofBottom, 1, 4)
    // 提灯本体
    const ly = roofBottom + 4
    rc.fillStyle = '#cc2222'
    rc.fillRect(lx + 1, ly, 4, 7)
    rc.fillRect(lx, ly + 1, 6, 5)
    // 上下の金具
    rc.fillStyle = '#aa8833'
    rc.fillRect(lx + 1, ly, 4, 1)
    rc.fillRect(lx + 1, ly + 6, 4, 1)
  }

  drawShopRecords(rc, 5 * TILE, TILE * 5)

  drawShopKoban(rc, 10 * TILE, TILE * 3 + 8)


  // --- 店先の商品（歩道 row3-4）---
  const shopY = 3 * TILE

  // ラーメン屋: のぼり旗（提灯の間）
  rc.fillStyle = '#888'
  rc.fillRect(2 * TILE + 8, shopY, 1, 14)
  rc.fillStyle = '#cc2222'
  rc.fillRect(2 * TILE + 9, shopY + 1, 8, 12)
  rc.fillStyle = '#fff'
  rc.font = '6px sans-serif'
  rc.textAlign = 'center'
  rc.fillText('中', 2 * TILE + 13, shopY + 6)
  rc.fillText('華', 2 * TILE + 13, shopY + 12)
  // 湯気
  rc.fillStyle = 'rgba(255,255,255,0.25)'
  rc.fillRect(3 * TILE + 6, shopY - 1, 1, 3)
  rc.fillRect(3 * TILE + 12, shopY - 2, 1, 4)


  // 交番: パトランプの光（点滅、もっと強く）
  if (Math.sin(Date.now() * 0.005) > 0) {
    rc.fillStyle = 'rgba(255,50,50,0.12)'
    rc.fillRect(10 * TILE + 10, shopY - 2, TILE * 3 - 6, 16)
  }

  // --- 歩道の装飾（row7-8）---

  // 自転車（row7 col3）
  const bkx = 3 * TILE, bky = 7 * TILE
  rc.fillStyle = '#888'
  rc.fillRect(bkx + 2, bky + 6, 12, 8)
  rc.fillStyle = '#444'
  rc.fillRect(bkx + 2, bky + 8, 4, 4)
  rc.fillRect(bkx + 10, bky + 8, 4, 4)
  rc.fillStyle = '#cc4444'
  rc.fillRect(bkx + 5, bky + 4, 6, 4)

  // ベンチ2つ（col6, col11）
  for (const bCol of [6, 11]) {
    const bnx2 = bCol * TILE + 2, bny2 = 7 * TILE + 6
    rc.fillStyle = '#8a6a40'
    rc.fillRect(bnx2, bny2, 12, 4)
    rc.fillStyle = '#555'
    rc.fillRect(bnx2 + 1, bny2 + 4, 2, 4)
    rc.fillRect(bnx2 + 9, bny2 + 4, 2, 4)
  }

  // 街灯2つ（col2, col9）
  for (const lCol of [2, 9]) {
    const slx2 = lCol * TILE + 7, sly2 = 7 * TILE
    rc.fillStyle = '#888'
    rc.fillRect(slx2, sly2 + 2, 2, 14)
    rc.fillStyle = '#ffcc44'
    rc.fillRect(slx2 - 2, sly2 + 2, 6, 3)
    rc.fillStyle = 'rgba(255,220,100,0.06)'
    rc.fillRect(slx2 - 8, sly2, 20, 16)
  }

  // ポスト（col12 row8）
  const psx = 12 * TILE, psy = 8 * TILE
  rc.fillStyle = '#cc2222'
  rc.fillRect(psx + 4, psy + 2, 8, 10)
  rc.fillStyle = '#dd3333'
  rc.fillRect(psx + 3, psy + 1, 10, 2)
  rc.fillStyle = '#333'
  rc.fillRect(psx + 5, psy + 5, 6, 1)

  // --- 森（row9-11）---
  rc.fillStyle = '#338833'
  rc.fillRect(TILE, 9 * TILE, TILE * 13, TILE * 3)
  const treeX2 = [2, 4, 6, 8, 10, 12]
  for (const tx of treeX2) {
    const ttx = tx * TILE, tty = 9 * TILE
    rc.fillStyle = '#6a4422'
    rc.fillRect(ttx + 6, tty + 14, 4, 10)
    rc.fillStyle = '#7a5432'
    rc.fillRect(ttx + 7, tty + 14, 2, 10)
    rc.fillStyle = '#44aa44'
    rc.fillRect(ttx + 2, tty + 6, 12, 10)
    rc.fillRect(ttx + 4, tty + 4, 8, 14)
    rc.fillStyle = '#55bb55'
    rc.fillRect(ttx + 4, tty + 6, 8, 6)
    rc.fillStyle = '#66cc66'
    rc.fillRect(ttx + 5, tty + 7, 4, 3)
  }
  rc.fillStyle = '#44aa44'
  for (let gx = TILE + 4; gx < 14 * TILE; gx += 6) {
    rc.fillRect(gx, 9 * TILE + 2, 2, 3)
  }
}
