import { forwardRef } from 'react'
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
  return (
    <HTMLFlipBook
      ref={ref}
      width={800}
      height={600}
      size="stretch"
      autoSize={false}
      flippingTime={900}
      startPage={startPage ?? 0}
      onFlip={onFlip}
      drawShadow
      showCover={false}
      usePortrait
      singlePage
      swipeDistance={30}
      clickEventForward
      mobileScrollSupport={false}
      style={{ flex: 1, width: '100%', height: '100%' }}
    >
      {pageComponents.map((Page, i) => (
        <div key={i} className="flip-page">
          <Page />
        </div>
      ))}
    </HTMLFlipBook>
  )
})

FlipBookView.displayName = 'FlipBookView'

export default FlipBookView
