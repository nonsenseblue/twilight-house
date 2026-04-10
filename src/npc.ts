// ===== NPC ロジック =====
import { NPC_HOME_ROOM, NPC_HOME_POS, ROOM_CHARS } from './rooms'
import type { Player } from './room-draw'

export interface Npc extends Player {
  roomIdx: number
}

// プレイヤーキャラ以外の3匹を定位置に配置
export function initNpcs(playerCharIdx: number): Npc[] {
  const npcs: Npc[] = []
  for (let i = 0; i < ROOM_CHARS.length; i++) {
    if (i === playerCharIdx) continue
    const roomIdx = NPC_HOME_ROOM[i]
    const pos = NPC_HOME_POS[i]
    if (roomIdx === undefined || pos === undefined) continue
    npcs.push({
      charIdx: i,
      roomIdx,
      x: pos.x,
      y: pos.y,
      dir: pos.dir,
      frame: 0,
      walkTimer: 0,
    })
  }
  return npcs
}

// プレイヤーから24px以内、同じ部屋にいる一番近いNPC
export function findNearestNpc(npcs: Npc[], player: Player, currentRoom: number): Npc | null {
  let best: Npc | null = null
  let bestDist = 24
  for (const npc of npcs) {
    if (npc.roomIdx !== currentRoom) continue
    const dx = npc.x - player.x
    const dy = npc.y - player.y
    const d = Math.sqrt(dx * dx + dy * dy)
    if (d < bestDist) { bestDist = d; best = npc }
  }
  return best
}
