import { TILE } from '../../common/rooms'

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
