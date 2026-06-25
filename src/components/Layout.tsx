import { useRef, useCallback, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import FlipBookView, { PAGE_PATHS } from './FlipBookView'
import './Layout.css'

const navItems = [
  { to: '/', label: 'Inicio' },
  { to: '/acerca-de-mi', label: 'Acerca de mí' },
  { to: '/modelos-3d', label: 'Modelado 3D' },
  { to: '/desarrollo-videojuegos', label: 'Desarrollo de videojuegos' },
  { to: '/contacto', label: 'Contacto' },
]

const ringPositions = [15, 50, 85]

function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const bookRef = useRef<{ pageFlip: () => any }>(null)

  const [currentPage] = useState(() => {
    const idx = PAGE_PATHS.indexOf(location.pathname)
    return idx >= 0 ? idx : 0
  })

  const handleNavClick = useCallback(
    (e: React.MouseEvent, path: string) => {
      e.preventDefault()
      const idx = PAGE_PATHS.indexOf(path)
      if (idx >= 0 && bookRef.current) {
        bookRef.current.pageFlip().flip(idx)
      }
    },
    [],
  )

  const handleFlip = useCallback(
    (e: any) => {
      const pageIdx = e.data as number
      if (pageIdx >= 0 && pageIdx < PAGE_PATHS.length) {
        navigate(PAGE_PATHS[pageIdx], { replace: true })
      }
    },
    [navigate],
  )

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="sidebar-inner">
          <div className="sidebar-header">
            <h2>Portafolio</h2>
          </div>
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.to}>
                <a
                  href={item.to}
                  onClick={(e) => handleNavClick(e, item.to)}
                  className={
                    location.pathname === item.to
                      ? 'nav-link active'
                      : 'nav-link'
                  }
                >
                  <span className="nav-label">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="book-container">
        <div className="rings">
          {ringPositions.map((pos) => (
            <div key={pos} className="ring" style={{ top: `${pos}%` }}>
              <div className="ring-inner" />
            </div>
          ))}
        </div>
        <FlipBookView
          ref={bookRef}
          startPage={currentPage}
          onFlip={handleFlip}
        />
      </div>
    </div>
  )
}

export default Layout
