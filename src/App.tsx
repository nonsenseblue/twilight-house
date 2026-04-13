import { useEffect, useRef, useState, useCallback } from 'react'
import { ROOMS, TILE, COLS, ROWS, SCALE, NPC_LINES } from './common/rooms'
import { drawRoom, drawPlayer, drawNpc, drawSelectMode, drawInteractHint, getMapHeaderRect, type DrawState, type Player } from './draw/room-draw'
import { TvController } from './game/tv'
import { RoomCanvas, type RoomCanvasHandle } from './components/RoomCanvas'
import { TvOverlay, type TvOverlayHandle } from './components/TvOverlay'
import { initNpcs, findNearestNpc, type Npc } from './interaction/npc'
import { findAdjacentFurniture } from './interaction/furniture'
import { BubbleManager } from './interaction/bubble'
import { getTimeOfDay, cycleTimeOfDay } from './common/time-of-day'

type Mode = 'select' | 'room' | 'tv'

const RW = 480, RH = 384

export function App() {
  const [mode, setMode] = useState<Mode>('select')
  const modeRef = useRef<Mode>('select')
  const roomCanvasRef = useRef<RoomCanvasHandle>(null)
  const tvOverlayRef = useRef<TvOverlayHandle>(null)
  const tvRef = useRef<TvController | null>(null)
  const playerRef = useRef<Player>({ x: 120, y: 150, dir: 0, frame: 0, walkTimer: 0, charIdx: 0 })
  const keysRef = useRef<Record<string, boolean>>({})
  const selectIdxRef = useRef(0)
  const currentRoomRef = useRef(0)
  const roomRef = useRef(ROOMS[0].tiles)
  const mapScaleRef = useRef(1.0)
  const mapOpenRef = useRef(true)
  const roomCooldownRef = useRef(0)
  const initRef = useRef(false)
  const npcsRef = useRef<Npc[]>([])
  const bubbleMgrRef = useRef<BubbleManager>(new BubbleManager())

  // Keep modeRef in sync
  const updateMode = useCallback((m: Mode) => {
    modeRef.current = m
    setMode(m)
  }, [])

  // Initialize TV controller after mount
  useEffect(() => {
    if (initRef.current) return
    initRef.current = true

    const waitForRefs = () => {
      const tvHandle = tvOverlayRef.current
      const roomHandle = roomCanvasRef.current
      if (!tvHandle?.screenCanvas || !roomHandle?.canvas) {
        requestAnimationFrame(waitForRefs)
        return
      }

      tvRef.current = new TvController({
        setMode: (m) => updateMode(m as Mode),
        roomCanvas: roomHandle.canvas,
      }, {
        screen: tvHandle.screenCanvas,
        gameFrame: tvHandle.gameFrame!,
        chKnob: tvHandle.chKnob!,
        chDisplay: tvHandle.chDisplay!,
        led: tvHandle.led!,
        ovOff: tvHandle.ovOff!,
        btnPwr: tvHandle.btnPwr!,
      })

      // デバッグ: ?room=7 で直接その部屋から開始
      const params = new URLSearchParams(window.location.search)
      const debugRoom = params.get('room')
      if (debugRoom !== null) {
        const roomIdx = parseInt(debugRoom)
        if (roomIdx >= 0 && roomIdx < ROOMS.length) {
          playerRef.current.charIdx = 0
          npcsRef.current = initNpcs(0)
          changeRoom(roomIdx, 7*16+8, 6*16+8)
          updateMode('room')
        }
      }

      startGameLoop()
    }
    waitForRefs()
  }, [updateMode])

  function getDrawState(): DrawState {
    const { ctx } = roomCanvasRef.current!
    return {
      rc: ctx,
      currentRoom: currentRoomRef.current,
      room: roomRef.current,
      player: playerRef.current,
      selectIdx: selectIdxRef.current,
      RW, RH,
      mapScale: mapScaleRef.current,
      mapOpen: mapOpenRef.current,
      timeOfDay: getTimeOfDay(),
    }
  }

  function getTile(tx: number, ty: number): number {
    if (tx < 0 || tx >= COLS || ty < 0 || ty >= ROWS) return 1
    return roomRef.current[ty * COLS + tx]
  }

  function isSolid(tx: number, ty: number): boolean {
    const t = getTile(tx, ty)
    return t===1||t===2||t===3||t===5||t===6||t===8||t===21||t===22||t===25||t===26||t===27||t===29||t===30||t===31
  }

  function changeRoom(roomIdx: number, sx: number, sy: number) {
    currentRoomRef.current = roomIdx
    roomRef.current = ROOMS[roomIdx].tiles
    playerRef.current.x = sx
    playerRef.current.y = sy
    keysRef.current = {}
    roomCooldownRef.current = 30
    const url = new URL(window.location.href)
    url.searchParams.set('room', String(roomIdx))
    window.history.replaceState(null, '', url)
  }

  function startGameLoop() {
    const { ctx } = roomCanvasRef.current!
    const player = playerRef.current
    const keys = () => keysRef.current

    function updateSelect() {
      if (modeRef.current !== 'select') return
      ctx.clearRect(0, 0, RW, RH)
      ctx.save(); ctx.scale(SCALE, SCALE)
      drawSelectMode(getDrawState())
      ctx.restore()
    }

    function updateRoom() {
      if (modeRef.current !== 'room') return
      if (roomCooldownRef.current > 0) roomCooldownRef.current--

      const speed = 1.2
      let dx = 0, dy = 0
      const k = keys()
      if (k['ArrowUp'] || k['w']) { dy = -speed; player.dir = 1 }
      if (k['ArrowDown'] || k['s']) { dy = speed; player.dir = 0 }
      if (k['ArrowLeft'] || k['a']) { dx = -speed; player.dir = 2 }
      if (k['ArrowRight'] || k['d']) { dx = speed; player.dir = 3 }

      if (dx !== 0 || dy !== 0) {
        player.walkTimer = 10
        player.frame++
        const nx = player.x + dx
        const ny = player.y + dy
        if (!isSolid(Math.floor(nx / TILE), Math.floor(player.y / TILE))) player.x = nx
        if (!isSolid(Math.floor(player.x / TILE), Math.floor(ny / TILE))) player.y = ny
        player.x = Math.max(TILE + 4, Math.min(player.x, (COLS - 1) * TILE - 4))
        player.y = Math.max(TILE + 12, Math.min(player.y, (ROWS - 1) * TILE - 2))
      } else {
        if (player.walkTimer > 0) player.walkTimer--
      }

      bubbleMgrRef.current.tick()

      ctx.clearRect(0, 0, RW, RH)
      ctx.save(); ctx.scale(SCALE, SCALE)
      drawRoom(getDrawState())
      // 同じ部屋の NPC を描画（プレイヤーより先）
      for (const npc of npcsRef.current) {
        if (npc.roomIdx === currentRoomRef.current) {
          drawNpc(ctx, npc)
        }
      }
      drawPlayer(getDrawState())
      // 「!」マーク: NPCまたは家具が近くにある時
      const ptx = Math.floor(player.x / TILE)
      const pty = Math.floor(player.y / TILE)
      const hasNpc = findNearestNpc(npcsRef.current, player, currentRoomRef.current) !== null
      const hasFurniture = !hasNpc && findAdjacentFurniture(roomRef.current, ptx, pty) !== null
      if (hasNpc || hasFurniture) {
        drawInteractHint(ctx, player.x, player.y)
      }
      bubbleMgrRef.current.draw(ctx, npcsRef.current, currentRoomRef.current)
      ctx.restore()
    }

    function mainLoop() {
      if (modeRef.current === 'select') updateSelect()
      else if (modeRef.current === 'room') updateRoom()
      if (modeRef.current === 'tv') tvRef.current?.render()
      requestAnimationFrame(mainLoop)
    }
    mainLoop()
  }

  // Input handler
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return
      keysRef.current[e.key] = true
      const tv = tvRef.current
      const player = playerRef.current

      if (e.key === 'm' || e.key === 'M') { mapOpenRef.current = !mapOpenRef.current; return }
      if (e.key === 't' || e.key === 'T') { cycleTimeOfDay(); return }

      if (modeRef.current === 'select') {
        e.preventDefault()
        if (e.key === 'ArrowLeft') selectIdxRef.current = (selectIdxRef.current + 3) % 4
        else if (e.key === 'ArrowRight') selectIdxRef.current = (selectIdxRef.current + 1) % 4
        else if (e.key === ' ' || e.key === 'Enter') {
          player.charIdx = selectIdxRef.current
          npcsRef.current = initNpcs(player.charIdx)
          updateMode('room')
        }
        return
      }

      if (modeRef.current === 'room') {
        if (e.key === 'Escape') {
          // キャラ選択に戻る
          currentRoomRef.current = 0
          roomRef.current = ROOMS[0].tiles
          player.x = 120
          player.y = 150
          npcsRef.current = []
          updateMode('select')
          return
        }
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault()
          const ptx = Math.floor(player.x / TILE)
          const pty = Math.floor(player.y / TILE)
          const curTile = getTile(ptx, pty)

          if (currentRoomRef.current === 0 && (pty === 3) && ptx >= 4 && ptx <= 7) {
            tv?.enterTvMode()
            return
          }

          if (roomCooldownRef.current <= 0 && curTile >= 9 && curTile <= 14) {
            const doors = ROOMS[currentRoomRef.current].doors
            for (let di = 0; di < doors.length; di++) {
              if (doors[di].tile === curTile) {
                changeRoom(doors[di].toRoom, doors[di].spawnX, doors[di].spawnY)
                break
              }
            }
            return
          }

          // ドアでもTVでもなければ NPC との会話判定
          const npc = findNearestNpc(npcsRef.current, player, currentRoomRef.current)
          if (npc) {
            const lines = NPC_LINES[npc.charIdx] || ['...']
            const text = lines[Math.floor(Math.random() * lines.length)]
            bubbleMgrRef.current.showNpc(npc.charIdx, text)
            return
          }

          // NPCがいなければ周囲4マスの家具に話しかけ判定
          const hit = findAdjacentFurniture(roomRef.current, ptx, pty)
          if (hit) {
            bubbleMgrRef.current.showFurniture(hit.anchorX, hit.anchorY, hit.text)
          }
        }
      } else if (modeRef.current === 'tv' && tv) {
        if (e.key === 'Escape') {
          if (tv.ch === tv.GAME_CH && !tvOverlayRef.current?.gameFrame?.classList.contains('hidden')) {
            tv.hideGame()
            tv.resetGame()
            tv.switchCh(0 - tv.ch)
          } else {
            tv.exitTvMode()
          }
          return
        } else if (tv.ch === tv.GAME_CH && !tv.switching) {
          return
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
          tv.switchCh(1)
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
          tv.switchCh(-1)
        } else if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault()
          tv.togglePwr()
        }
      }
    }

    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('keyup', onKeyUp)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('keyup', onKeyUp)
    }
  }, [updateMode])

  const handleCanvasClick = useCallback((logicalX: number, logicalY: number) => {
    if (modeRef.current === 'tv') return
    const r = getMapHeaderRect(mapScaleRef.current)
    if (logicalX >= r.x && logicalX <= r.x + r.w &&
        logicalY >= r.y && logicalY <= r.y + r.h) {
      mapOpenRef.current = !mapOpenRef.current
    }
  }, [])

  return (
    <>
      <RoomCanvas ref={roomCanvasRef} onCanvasClick={handleCanvasClick} />
      <TvOverlay ref={tvOverlayRef} active={mode === 'tv'} />
    </>
  )
}
