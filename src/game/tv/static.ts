// CH1: 砂嵐 / CH2: カラーバー
import type { ChannelContext } from './types'

export class StaticChannel {
  private staticImg: ImageData

  constructor(private cc: ChannelContext) {
    this.staticImg = cc.ctx.createImageData(cc.W, cc.H)
  }

  drawStatic(intensity = 1): void {
    const { ctx, W, H } = this.cc
    const d = this.staticImg.data
    for (let i = 0; i < d.length; i += 4) {
      let v = (Math.random() * 200 * intensity) | 0
      if (Math.random() < 0.02) v = 200 + (Math.random() * 55) | 0
      d[i] = v; d[i+1] = v; d[i+2] = v; d[i+3] = 255
    }
    ctx.putImageData(this.staticImg, 0, 0)
    ctx.fillStyle = 'rgba(255,255,255,0.15)'
    ctx.font = '14px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('受信できません', W / 2, H / 2)
  }
}

export class BarsChannel {
  constructor(private cc: ChannelContext) {}

  draw(): void {
    const { ctx, W, H } = this.cc
    const mc = [[192,192,192],[192,192,0],[0,192,192],[0,192,0],[192,0,192],[192,0,0],[0,0,192]]
    const bw = W / 7, mh = H * 0.65
    mc.forEach((c, i) => { ctx.fillStyle = 'rgb('+c+')'; ctx.fillRect(i*bw, 0, bw+1, mh) })
    const bt = mh
    ctx.fillStyle = '#111'; ctx.fillRect(0, bt, W, H - bt)
    ctx.fillStyle = '#ccc'
    ctx.font = 'bold 20px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('JOAK-TV', W/2, bt + 30)
    ctx.font = '12px monospace'
    ctx.fillText('本日の放送は終了しました', W/2, bt + 52)
    const now = new Date()
    ctx.font = 'bold 24px monospace'
    ctx.fillStyle = '#ffcc44'
    ctx.fillText(now.getHours() + ':' + String(now.getMinutes()).padStart(2,'0'), W/2, bt + 85)
    const id = ctx.getImageData(0, 0, W, H), d = id.data
    for (let i = 0; i < d.length; i += 8) {
      const n = ((Math.random()-0.5)*10)|0
      d[i]+=n; d[i+1]+=n; d[i+2]+=n
    }
    ctx.putImageData(id, 0, 0)
  }
}
