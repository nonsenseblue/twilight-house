import { forwardRef, useEffect, useRef } from 'react'

interface TvOverlayProps {
  active: boolean
}

export interface TvOverlayHandle {
  screenCanvas: HTMLCanvasElement | null
  gameFrame: HTMLIFrameElement | null
  chKnob: HTMLElement | null
  chDisplay: HTMLElement | null
  led: HTMLElement | null
  ovOff: HTMLElement | null
  btnPwr: HTMLElement | null
  spkBox: HTMLElement | null
}

export const TvOverlay = forwardRef<TvOverlayHandle, TvOverlayProps>(
  function TvOverlay({ active }, ref) {
    const screenRef = useRef<HTMLCanvasElement>(null)
    const gameFrameRef = useRef<HTMLIFrameElement>(null)
    const chKnobRef = useRef<HTMLDivElement>(null)
    const chDisplayRef = useRef<HTMLDivElement>(null)
    const ledRef = useRef<HTMLDivElement>(null)
    const ovOffRef = useRef<HTMLDivElement>(null)
    const btnPwrRef = useRef<HTMLDivElement>(null)
    const spkBoxRef = useRef<HTMLDivElement>(null)
    const backHintRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (typeof ref === 'function') return
      if (ref) {
        ref.current = {
          screenCanvas: screenRef.current,
          gameFrame: gameFrameRef.current,
          chKnob: chKnobRef.current,
          chDisplay: chDisplayRef.current,
          led: ledRef.current,
          ovOff: ovOffRef.current,
          btnPwr: btnPwrRef.current,
          spkBox: spkBoxRef.current,
        }
      }
    })

    // Speaker slats
    useEffect(() => {
      const box = spkBoxRef.current
      if (!box || box.children.length > 0) return
      for (let i = 0; i < 12; i++) {
        const s = document.createElement('div')
        s.className = 'spk-slat'
        box.appendChild(s)
      }
    }, [])

    return (
      <>
        <div className={`tv-overlay${active ? ' active' : ''}`}>
          <div className="tv-wrap">
            <div className="ant-area">
              <div className="ant ant-l" />
              <div className="ant ant-r" />
            </div>
            <div className="tv-body">
              <div className="scr-area">
                <div className="crt">
                  <canvas ref={screenRef} />
                  <iframe
                    ref={gameFrameRef}
                    className="hidden"
                    src="about:blank"
                    title="game"
                  />
                  <div className="ov-scan" />
                  <div className="ov-vig" />
                  <div className="ov-glass" />
                  <div className="ov-depth" />
                  <div ref={ovOffRef} className="ov-off">
                    <div className="hline" />
                  </div>
                </div>
              </div>
              <div className="rpanel">
                <div className="ctrl-panel">
                  <div className="ctrl-label">Channel</div>
                  <div className="ch-dial">
                    <div className="ch-num">1</div>
                    <div className="ch-num">2</div>
                    <div className="ch-num">3</div>
                    <div className="ch-num">4</div>
                    <div className="ch-num">5</div>
                    <div className="ch-num">6</div>
                    <div className="knob" ref={chKnobRef} />
                  </div>
                  <div className="ch-display" ref={chDisplayRef}>CH 1</div>
                </div>
                <div className="ctrl-panel">
                  <div className="ctrl-label">Volume</div>
                  <div style={{ width: 50, height: 50, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="knob" style={{ width: 32, height: 32 }} />
                  </div>
                </div>
                <div className="spk-box" ref={spkBoxRef} />
                <div className="pwr-row">
                  <div className="pwr-btn" ref={btnPwrRef} />
                  <div className="led on" ref={ledRef} />
                </div>
              </div>
              <div className="bstrip">
                <div>
                  <span className="brand-logo">National</span>
                  <span className="brand-model">TH-28R</span>
                </div>
              </div>
            </div>
          </div>
          <div ref={backHintRef} className={`back-hint${active ? ' active' : ''}`}>
            ESC : BACK TO ROOM
          </div>
        </div>
      </>
    )
  }
)
