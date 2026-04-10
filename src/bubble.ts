// ===== 吹き出し管理 =====
import { drawBubble } from './room-draw'
import type { Npc } from './npc'

export type Bubble =
  | { kind: 'npc'; npcCharIdx: number; text: string; ttl: number }
  | { kind: 'furniture'; anchorX: number; anchorY: number; text: string; ttl: number }

const DEFAULT_TTL = 180

export class BubbleManager {
  private current: Bubble | null = null

  showNpc(npcCharIdx: number, text: string): void {
    this.current = { kind: 'npc', npcCharIdx, text, ttl: DEFAULT_TTL }
  }

  showFurniture(anchorX: number, anchorY: number, text: string): void {
    this.current = { kind: 'furniture', anchorX, anchorY, text, ttl: DEFAULT_TTL }
  }

  // 毎フレーム呼んでTTLを進める
  tick(): void {
    if (!this.current) return
    this.current.ttl--
    if (this.current.ttl <= 0) this.current = null
  }

  // 描画。NPC吹き出しは話者の最新位置を追跡する
  draw(rc: CanvasRenderingContext2D, npcs: Npc[], currentRoom: number): void {
    const b = this.current
    if (!b) return
    if (b.kind === 'npc') {
      const speaker = npcs.find(n => n.charIdx === b.npcCharIdx && n.roomIdx === currentRoom)
      if (speaker) {
        drawBubble(rc, speaker.x, speaker.y - 14, b.text)
      }
    } else {
      drawBubble(rc, b.anchorX, b.anchorY, b.text)
    }
  }
}
