import { forwardRef, useRef, useState, useEffect } from 'react'
import HTMLFlipBook from 'react-pageflip-enhanced'
import Inicio from '../pages/Inicio'
import AcercaDeMi from '../pages/AcercaDeMi'
import Modelos3D from '../pages/Modelos3D'
import DesarrolloVideojuegos from '../pages/DesarrolloVideojuegos'
import Contacto from '../pages/Contacto'
import './BookLayout.css'

const pageComponents = [
  Inicio, AcercaDeMi, Modelos3D, DesarrolloVideojuegos, Contacto,
]

const PAGE_PATHS = [
  '/', '/acerca-de-mi', '/modelos-3d', '/desarrollo-videojuegos', '/contacto',
]

export { PAGE_PATHS }

const FlipBookView = forwardRef<
  { pageFlip: () => any },
  { startPage?: number; onFlip?: (e: any) => void }
>(({ startPage, onFlip }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    if (rect.width > 0 && rect.height > 0) {
      setSize({ width: rect.width, height: rect.height })
      setReady(true)
    }

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      if (width > 0 && height > 0) {
        setSize({ width, height })
        setReady(true)
      }
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="flip-book-container">
      {ready ? (
        <HTMLFlipBook
          ref={ref}
          width={size.width}
          height={size.height}
          size="fixed"
          autoSize={false}
          flippingTime={900}
          startPage={startPage ?? 0}
          onFlip={onFlip}
          drawShadow
          showCover={false}
          usePortrait={false}
          singlePage
          swipeDistance={30}
          clickEventForward
          mobileScrollSupport={false}
          style={{ width: '100%', height: '100%' }}
        >
          {pageComponents.map((Page, i) => (
            <div key={i} className="flip-page">
              <Page />
            </div>
          ))}
        </HTMLFlipBook>
      ) : null}
    </div>
  )
})

FlipBookView.displayName = 'FlipBookView'

export default FlipBookView
