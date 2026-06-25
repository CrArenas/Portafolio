function DesarrolloVideojuegos() {
  return (
    <section className="page">
      <h1>Desarrollo de videojuegos</h1>
      <p className="subtitle">
        Proyectos interactivos y mecánicas de juego
      </p>

      <div className="project-grid">
        <div className="project-card">
          <div className="project-placeholder">🎮</div>
          <h3>Plataformero 2D</h3>
          <p>Juego de plataformas en Unity con físicas, partículas y niveles dinámicos.</p>
        </div>
        <div className="project-card">
          <div className="project-placeholder">👾</div>
          <h3>Shooter Arcade</h3>
          <p>Prototipo en Unreal Engine con sistema de oleadas y power-ups.</p>
        </div>
        <div className="project-card">
          <div className="project-placeholder">🧩</div>
          <h3>Puzzle 3D</h3>
          <p>Mecánicas de manipulación de objetos con feedback visual y sonoro.</p>
        </div>
        <div className="project-card">
          <div className="project-placeholder">🏎️</div>
          <h3>Racing Prototype</h3>
          <p>Prototipo de carreras con físicas vehiculares y pista procedural.</p>
        </div>
      </div>
    </section>
  )
}

export default DesarrolloVideojuegos
