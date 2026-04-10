import { forwardRef, useEffect, useRef, useImperativeHandle } from 'react'

const RW = 480, RH = 384

export interface RoomCanvasHandle {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
}

interface RoomCanvasProps {
  onCanvasClick?: (logicalX: number, logicalY: number) => void
}

export const RoomCanvas = forwardRef<RoomCanvasHandle, RoomCanvasProps>(
  function RoomCanvas({ onCanvasClick }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useImperativeHandle(ref, () => ({
      canvas: canvasRef.current!,
      ctx: canvasRef.current!.getContext('2d')!,
    }))

    useEffect(() => {
      const canvas = canvasRef.current!
      canvas.width = RW
      canvas.height = RH

      const scaleRoom = () => {
        const vw = window.innerWidth, vh = window.innerHeight
        const s = Math.min(vw / RW, vh / RH)
        canvas.style.width = Math.floor(RW * s) + 'px'
        canvas.style.height = Math.floor(RH * s) + 'px'
      }
      scaleRoom()
      window.addEventListener('resize', scaleRoom)
      canvas.focus()

      return () => window.removeEventListener('resize', scaleRoom)
    }, [])

    return (
      <canvas
        ref={canvasRef}
        tabIndex={0}
        onClick={(e) => {
          const canvas = e.currentTarget
          canvas.focus()
          const rect = canvas.getBoundingClientRect()
          // CSS pixel -> 内部 canvas pixel
          const canvasX = (e.clientX - rect.left) * (canvas.width / rect.width)
          const canvasY = (e.clientY - rect.top) * (canvas.height / rect.height)
          // 内部 pixel -> 論理座標（drawRoomはSCALE倍で描画してるので逆変換）
          const logicalX = canvasX / 2
          const logicalY = canvasY / 2
          onCanvasClick?.(logicalX, logicalY)
        }}
      />
    )
  }
)
