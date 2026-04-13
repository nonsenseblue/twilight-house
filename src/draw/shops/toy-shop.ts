import { TILE } from '../../common/rooms'

// ===== おもちゃ屋の中 =====
export function drawToyShop(rc: CanvasRenderingContext2D): void {
  // 床（明るいクリーム）
  rc.fillStyle = 'rgba(255,240,200,0.12)'
  rc.fillRect(TILE, 2 * TILE, TILE * 13, TILE * 8)
  // 壁
  rc.fillStyle = '#ffe0c0'
  rc.fillRect(TILE, TILE, TILE * 13, TILE)
  // かわいい看板（丸みのある背景+星）
  rc.fillStyle = '#ff8844'
  rc.fillRect(5 * TILE + 4, 1 * TILE + 1, TILE * 4, 12)
  rc.fillRect(5 * TILE + 6, 1 * TILE, TILE * 4 - 4, 14)
  rc.fillStyle = '#ffaa66'
  rc.fillRect(5 * TILE + 6, 1 * TILE + 2, TILE * 4 - 4, 10)
  // 星（左右）
  rc.fillStyle = '#ffee44'
  rc.fillRect(5 * TILE + 6, 1 * TILE + 4, 3, 3)
  rc.fillRect(5 * TILE + 7, 1 * TILE + 3, 1, 5)
  rc.fillRect(9 * TILE + 4, 1 * TILE + 4, 3, 3)
  rc.fillRect(9 * TILE + 5, 1 * TILE + 3, 1, 5)
  // 文字
  rc.fillStyle = '#fff'
  rc.font = '7px sans-serif'
  rc.textAlign = 'center'
  rc.fillText('おもちゃ', 7 * TILE + 8, 1 * TILE + 10)

  // --- 壁の棚（row1）看板の左右におもちゃ ---
  // ロボット（col2）
  rc.fillStyle = '#dd3333'
  rc.fillRect(2 * TILE, 1 * TILE + 4, 6, 8)
  rc.fillStyle = '#ffcc44'
  rc.fillRect(2 * TILE + 2, 1 * TILE + 5, 2, 2)
  rc.fillRect(2 * TILE + 1, 1 * TILE + 8, 4, 2)
  // くま（col3）
  rc.fillStyle = '#ffaacc'
  rc.fillRect(3 * TILE + 4, 1 * TILE + 3, 8, 8)
  rc.fillRect(3 * TILE + 5, 1 * TILE + 2, 6, 10)
  rc.fillStyle = '#222'
  rc.fillRect(3 * TILE + 6, 1 * TILE + 5, 1, 1)
  rc.fillRect(3 * TILE + 9, 1 * TILE + 5, 1, 1)
  rc.fillStyle = '#ff88aa'
  rc.fillRect(3 * TILE + 7, 1 * TILE + 7, 2, 1)
  // 積み木（col10-11）
  rc.fillStyle = '#4488ff'
  rc.fillRect(10 * TILE, 1 * TILE + 6, 6, 6)
  rc.fillStyle = '#ff4444'
  rc.fillRect(10 * TILE + 6, 1 * TILE + 8, 6, 4)
  rc.fillStyle = '#44dd44'
  rc.fillRect(10 * TILE + 2, 1 * TILE + 3, 5, 4)
  // ボール（col12）
  rc.fillStyle = '#ff8844'
  rc.fillRect(12 * TILE + 2, 1 * TILE + 6, 5, 5)
  rc.fillRect(12 * TILE + 3, 1 * TILE + 5, 3, 7)
  rc.fillStyle = '#fff'
  rc.fillRect(12 * TILE + 3, 1 * TILE + 7, 1, 1)

  // --- 左の棚にぬいぐるみ3体（row3） ---
  // うさぎ
  rc.fillStyle = '#fff'
  rc.fillRect(2 * TILE + 2, 3 * TILE + 2, 6, 8)
  rc.fillRect(2 * TILE + 3, 3 * TILE, 2, 3)
  rc.fillRect(2 * TILE + 6, 3 * TILE, 2, 3)
  rc.fillStyle = '#ffaaaa'
  rc.fillRect(2 * TILE + 3, 3 * TILE + 1, 1, 2)
  rc.fillRect(2 * TILE + 6, 3 * TILE + 1, 1, 2)
  rc.fillStyle = '#cc2244'
  rc.fillRect(2 * TILE + 4, 3 * TILE + 5, 1, 1)
  rc.fillRect(2 * TILE + 6, 3 * TILE + 5, 1, 1)
  // ねこ（黒）
  rc.fillStyle = '#333'
  rc.fillRect(2 * TILE + 2, 4 * TILE + 2, 6, 7)
  rc.fillRect(2 * TILE + 1, 4 * TILE + 1, 2, 2)
  rc.fillRect(2 * TILE + 7, 4 * TILE + 1, 2, 2)
  rc.fillStyle = '#ffcc44'
  rc.fillRect(2 * TILE + 3, 4 * TILE + 4, 1, 1)
  rc.fillRect(2 * TILE + 6, 4 * TILE + 4, 1, 1)

  // --- 右の棚にぬいぐるみ（row3） ---
  // いぬ
  rc.fillStyle = '#ddaa66'
  rc.fillRect(12 * TILE + 2, 3 * TILE + 2, 6, 8)
  rc.fillRect(12 * TILE + 1, 3 * TILE + 3, 2, 4)
  rc.fillStyle = '#222'
  rc.fillRect(12 * TILE + 3, 3 * TILE + 5, 1, 1)
  rc.fillRect(12 * TILE + 6, 3 * TILE + 5, 1, 1)
  // パンダ
  rc.fillStyle = '#fff'
  rc.fillRect(12 * TILE + 2, 4 * TILE + 2, 6, 7)
  rc.fillRect(12 * TILE + 3, 4 * TILE + 1, 4, 9)
  rc.fillStyle = '#333'
  rc.fillRect(12 * TILE + 3, 4 * TILE + 3, 2, 2)
  rc.fillRect(12 * TILE + 6, 4 * TILE + 3, 2, 2)

  // --- カウンター＋レジ（row5） ---
  rc.fillStyle = '#ddd'
  rc.fillRect(7 * TILE, 5 * TILE + 2, 14, 10)
  rc.fillStyle = '#ccc'
  rc.fillRect(7 * TILE + 1, 5 * TILE + 3, 12, 6)
  rc.fillStyle = '#44aa44'
  rc.fillRect(7 * TILE + 3, 5 * TILE + 5, 8, 3)

  // --- おもちゃ棚（左右 row5） ---
  // 左: ガチャガチャ
  rc.fillStyle = '#dd4444'
  rc.fillRect(2 * TILE + 2, 5 * TILE + 1, 10, 12)
  rc.fillStyle = '#ee5555'
  rc.fillRect(2 * TILE + 3, 5 * TILE + 2, 8, 5)
  rc.fillStyle = 'rgba(200,220,255,0.5)'
  rc.fillRect(2 * TILE + 4, 5 * TILE + 3, 6, 3)
  // カプセル
  rc.fillStyle = '#ffcc00'
  rc.fillRect(2 * TILE + 5, 5 * TILE + 3, 2, 2)
  rc.fillStyle = '#44dd44'
  rc.fillRect(2 * TILE + 7, 5 * TILE + 4, 2, 2)
  // 取り出し口
  rc.fillStyle = '#333'
  rc.fillRect(2 * TILE + 4, 5 * TILE + 9, 6, 2)

  // 右: おもちゃの棚
  rc.fillStyle = '#8a6a40'
  rc.fillRect(11 * TILE, 5 * TILE + 1, TILE * 2 + 4, 12)
  rc.fillStyle = '#9a7a50'
  rc.fillRect(11 * TILE + 1, 5 * TILE + 2, TILE * 2 + 2, 10)
  // プラレール
  rc.fillStyle = '#3366cc'
  rc.fillRect(11 * TILE + 2, 5 * TILE + 3, 8, 3)
  rc.fillStyle = '#333'
  rc.fillRect(11 * TILE + 2, 5 * TILE + 6, 2, 2)
  rc.fillRect(11 * TILE + 6, 5 * TILE + 6, 2, 2)
  // カードの束
  rc.fillStyle = '#ffee44'
  rc.fillRect(11 * TILE + 14, 5 * TILE + 3, 6, 8)
  rc.fillStyle = '#ff8844'
  rc.fillRect(11 * TILE + 15, 5 * TILE + 4, 4, 6)

  // --- 床のおもちゃ散らばり ---
  // ミニカー（red, row7 左）
  rc.fillStyle = '#cc2222'
  rc.fillRect(5 * TILE + 2, 7 * TILE + 6, 8, 4)
  rc.fillRect(5 * TILE + 3, 7 * TILE + 5, 6, 2)
  rc.fillStyle = '#333'
  rc.fillRect(5 * TILE + 3, 7 * TILE + 10, 2, 2)
  rc.fillRect(5 * TILE + 7, 7 * TILE + 10, 2, 2)
  // ミニカー（blue, row7）
  rc.fillStyle = '#3366cc'
  rc.fillRect(7 * TILE + 2, 7 * TILE + 8, 8, 4)
  rc.fillRect(7 * TILE + 3, 7 * TILE + 7, 6, 2)
  rc.fillStyle = '#333'
  rc.fillRect(7 * TILE + 3, 7 * TILE + 12, 2, 2)
  rc.fillRect(7 * TILE + 7, 7 * TILE + 12, 2, 2)

  // けん玉（row7 右）
  rc.fillStyle = '#8a4422'
  rc.fillRect(10 * TILE + 4, 7 * TILE + 4, 3, 8)
  rc.fillStyle = '#dd2222'
  rc.fillRect(10 * TILE + 2, 7 * TILE + 2, 5, 5)
  rc.fillRect(10 * TILE + 3, 7 * TILE + 1, 3, 7)

  // こま（row8 左）
  rc.fillStyle = '#ee8844'
  rc.fillRect(3 * TILE + 4, 8 * TILE + 4, 5, 5)
  rc.fillRect(3 * TILE + 5, 8 * TILE + 3, 3, 7)
  rc.fillStyle = '#fff'
  rc.fillRect(3 * TILE + 5, 8 * TILE + 5, 1, 1)
  // 軸
  rc.fillStyle = '#6a4422'
  rc.fillRect(3 * TILE + 6, 8 * TILE + 9, 1, 3)

  // 風船（row4 中央）
  rc.fillStyle = '#ff4466'
  rc.fillRect(7 * TILE + 2, 4 * TILE, 5, 6)
  rc.fillRect(7 * TILE + 3, 3 * TILE + 14, 3, 8)
  rc.fillStyle = '#886'
  rc.fillRect(7 * TILE + 4, 4 * TILE + 6, 1, 6)

  // 暖かい光
  rc.fillStyle = 'rgba(255,230,150,0.05)'
  rc.fillRect(TILE, TILE * 2, TILE * 13, TILE * 8)
}
