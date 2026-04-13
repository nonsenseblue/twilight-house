import { TILE } from '../../common/rooms'

// ===== 交番の中 =====
export function drawKoban(rc: CanvasRenderingContext2D): void {
  // 床
  rc.fillStyle = 'rgba(200,210,220,0.1)'
  rc.fillRect(TILE, 2 * TILE, TILE * 13, TILE * 8)
  // 壁
  rc.fillStyle = '#d8e0e8'
  rc.fillRect(TILE, TILE, TILE * 13, TILE)

  // 壁の看板「交番」
  rc.fillStyle = '#2244aa'
  rc.fillRect(6 * TILE, 1 * TILE + 2, TILE * 3, 10)
  rc.fillStyle = '#fff'
  rc.font = '7px sans-serif'
  rc.textAlign = 'center'
  rc.fillText('交番', 7 * TILE + 8, 1 * TILE + 10)

  // 壁の地図（左）
  rc.fillStyle = '#f0ead8'
  rc.fillRect(2 * TILE, 1 * TILE + 1, TILE * 2 + 4, TILE - 2)
  rc.fillStyle = '#aaa'
  rc.fillRect(2 * TILE + 2, 1 * TILE + 3, TILE * 2, TILE - 6)
  rc.fillStyle = '#88aa88'
  rc.fillRect(2 * TILE + 4, 1 * TILE + 5, 8, 4)
  rc.fillStyle = '#aabbcc'
  rc.fillRect(2 * TILE + 14, 1 * TILE + 4, 6, 6)
  // 道路（地図の中）
  rc.fillStyle = '#ddd'
  rc.fillRect(2 * TILE + 6, 1 * TILE + 7, 12, 1)
  rc.fillRect(2 * TILE + 10, 1 * TILE + 4, 1, 6)

  // 壁の掲示板（右）
  rc.fillStyle = '#8a6a40'
  rc.fillRect(10 * TILE, 1 * TILE + 1, TILE * 3, TILE - 2)
  rc.fillStyle = '#f0ead0'
  rc.fillRect(10 * TILE + 2, 1 * TILE + 3, TILE * 3 - 4, TILE - 6)
  rc.fillStyle = '#fff'
  rc.fillRect(10 * TILE + 4, 1 * TILE + 4, 8, 6)
  rc.fillRect(10 * TILE + 16, 1 * TILE + 4, 8, 6)
  rc.fillStyle = '#ddd'
  rc.fillRect(10 * TILE + 4, 1 * TILE + 5, 6, 1)
  rc.fillRect(10 * TILE + 4, 1 * TILE + 7, 6, 1)
  // 「指名手配」の文字
  rc.fillStyle = '#cc2222'
  rc.font = '3px sans-serif'
  rc.fillText('指名手配', 10 * TILE + 20, 1 * TILE + 10)

  // 壁の時計（看板の左）
  rc.fillStyle = '#6a4a22'
  rc.fillRect(4 * TILE + 4, 1 * TILE + 2, 8, 8)
  rc.fillStyle = '#f0ead8'
  rc.fillRect(4 * TILE + 5, 1 * TILE + 3, 6, 6)
  rc.fillStyle = '#333'
  rc.fillRect(4 * TILE + 8, 1 * TILE + 4, 1, 3)
  rc.fillRect(4 * TILE + 8, 1 * TILE + 6, 2, 1)

  // --- デスクの上（row5）---
  // 電話
  rc.fillStyle = '#333'
  rc.fillRect(5 * TILE + 2, 5 * TILE + 3, 6, 5)
  rc.fillStyle = '#444'
  rc.fillRect(5 * TILE + 3, 5 * TILE + 2, 4, 2)
  // 受話器
  rc.fillStyle = '#222'
  rc.fillRect(5 * TILE, 5 * TILE + 4, 2, 4)
  // 書類の山
  rc.fillStyle = '#fff'
  rc.fillRect(7 * TILE, 5 * TILE + 2, 10, 8)
  rc.fillStyle = '#f8f8f0'
  rc.fillRect(7 * TILE + 1, 5 * TILE + 1, 8, 2)
  rc.fillStyle = '#ddd'
  rc.fillRect(7 * TILE + 1, 5 * TILE + 4, 8, 1)
  rc.fillRect(7 * TILE + 1, 5 * TILE + 6, 8, 1)
  rc.fillRect(7 * TILE + 1, 5 * TILE + 8, 6, 1)
  // ペン立て
  rc.fillStyle = '#666'
  rc.fillRect(8 * TILE + 6, 5 * TILE + 2, 4, 6)
  rc.fillStyle = '#2244aa'
  rc.fillRect(8 * TILE + 7, 5 * TILE, 1, 3)
  rc.fillStyle = '#cc2222'
  rc.fillRect(8 * TILE + 9, 5 * TILE + 1, 1, 2)
  // パトランプ
  rc.fillStyle = '#cc2222'
  rc.fillRect(6 * TILE + 2, 5 * TILE + 2, 4, 4)
  rc.fillStyle = '#ff4444'
  rc.fillRect(6 * TILE + 3, 5 * TILE + 3, 2, 2)
  // スタンプ台
  rc.fillStyle = '#aa3333'
  rc.fillRect(4 * TILE + 4, 5 * TILE + 4, 5, 4)
  rc.fillStyle = '#cc4444'
  rc.fillRect(4 * TILE + 5, 5 * TILE + 5, 3, 2)

  // --- ロッカー（row3 右）---
  rc.fillStyle = '#999'
  rc.fillRect(11 * TILE + 2, 3 * TILE + 1, 10, 14)
  rc.fillRect(12 * TILE, 3 * TILE + 1, 10, 14)
  rc.fillStyle = '#aaa'
  rc.fillRect(11 * TILE + 3, 3 * TILE + 2, 8, 12)
  rc.fillRect(12 * TILE + 1, 3 * TILE + 2, 8, 12)
  rc.fillStyle = '#666'
  rc.fillRect(11 * TILE + 9, 3 * TILE + 7, 2, 2)
  rc.fillRect(12 * TILE + 2, 3 * TILE + 7, 2, 2)

  // --- ファイル棚（row3 左）---
  rc.fillStyle = '#8a7a60'
  rc.fillRect(2 * TILE + 2, 3 * TILE + 1, TILE * 2, 14)
  rc.fillStyle = '#9a8a70'
  rc.fillRect(2 * TILE + 3, 3 * TILE + 2, TILE * 2 - 2, 12)
  // ファイル（色分け）
  rc.fillStyle = '#4488cc'
  rc.fillRect(2 * TILE + 4, 3 * TILE + 3, 4, 10)
  rc.fillStyle = '#cc8844'
  rc.fillRect(2 * TILE + 9, 3 * TILE + 3, 4, 10)
  rc.fillStyle = '#44aa44'
  rc.fillRect(2 * TILE + 14, 3 * TILE + 3, 4, 10)
  rc.fillStyle = '#cc4444'
  rc.fillRect(2 * TILE + 19, 3 * TILE + 3, 4, 10)

  // --- 椅子（デスクの手前 row6）---
  rc.fillStyle = '#555'
  rc.fillRect(6 * TILE + 4, 6 * TILE + 2, 8, 8)
  rc.fillStyle = '#666'
  rc.fillRect(6 * TILE + 5, 6 * TILE + 3, 6, 6)
  // 脚
  rc.fillStyle = '#444'
  rc.fillRect(6 * TILE + 5, 6 * TILE + 10, 2, 3)
  rc.fillRect(6 * TILE + 9, 6 * TILE + 10, 2, 3)

  // --- ゴミ箱（row7 右）---
  rc.fillStyle = '#888'
  rc.fillRect(10 * TILE + 4, 7 * TILE + 4, 8, 8)
  rc.fillStyle = '#999'
  rc.fillRect(10 * TILE + 5, 7 * TILE + 5, 6, 6)
  rc.fillStyle = '#777'
  rc.fillRect(10 * TILE + 4, 7 * TILE + 3, 8, 2)

  // --- ウォーターサーバー（row4 右）---
  rc.fillStyle = '#ddeeff'
  rc.fillRect(10 * TILE + 2, 4 * TILE + 1, 6, 12)
  rc.fillStyle = '#bbccdd'
  rc.fillRect(10 * TILE + 3, 4 * TILE + 2, 4, 4)
  rc.fillStyle = '#88aacc'
  rc.fillRect(10 * TILE + 3, 4 * TILE + 3, 4, 2)
  // 蛇口
  rc.fillStyle = '#cc2222'
  rc.fillRect(10 * TILE + 2, 4 * TILE + 7, 2, 2)
  rc.fillStyle = '#2244aa'
  rc.fillRect(10 * TILE + 5, 4 * TILE + 7, 2, 2)

  // --- 観葉植物（row7 左）---
  rc.fillStyle = '#aa6633'
  rc.fillRect(2 * TILE + 4, 7 * TILE + 8, 8, 6)
  rc.fillStyle = '#bb7744'
  rc.fillRect(2 * TILE + 5, 7 * TILE + 9, 6, 4)
  rc.fillStyle = '#44aa33'
  rc.fillRect(2 * TILE + 2, 7 * TILE + 2, 5, 7)
  rc.fillRect(2 * TILE + 6, 7 * TILE + 1, 5, 8)
  rc.fillStyle = '#55bb44'
  rc.fillRect(2 * TILE + 4, 7 * TILE + 3, 4, 4)
}
