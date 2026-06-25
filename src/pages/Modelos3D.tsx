function Modelos3D() {
  return (
    <section className="page">
      <h1>Modelos 3D</h1>
      <p className="subtitle">
        Galería de trabajos de modelado y texturizado
      </p>

      <div className="project-grid">
        <div className="project-card">
          <div className="project-placeholder">🧊</div>
          <h3>Personaje Stylized</h3>
          <p>Modelado low-poly con texturas PBR en Substance Painter.</p>
        </div>
        <div className="project-card">
          <div className="project-placeholder">🏛️</div>
          <h3>Escenario Medieval</h3>
          <p>Entorno completo modelado en Blender con iluminación dinámica.</p>
        </div>
        <div className="project-card">
          <div className="project-placeholder">🔫</div>
          <h3>Arma Sci-Fi</h3>
          <p>Asset de arma con retopología, UV mapping y materiales realistas.</p>
        </div>
        <div className="project-card">
          <div className="project-placeholder">🌿</div>
          <h3>Entorno Natural</h3>
          <p>Vegetación y terreno procedural con shaders personalizados.</p>
        </div>
      </div>
    </section>
  )
}

export default Modelos3D
