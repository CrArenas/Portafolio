function AcercaDeMi() {
  return (
    <section className="page">
      <h1>Acerca de mí</h1>
      <p className="subtitle">
        Un poco sobre mi trayectoria y lo que me apasiona
      </p>

      <div className="about-content">
        <p>
          Soy un artista 3D y desarrollador de videojuegos con experiencia en
          la creación de assets y experiencias interactivas. Me especializo en
          modelado poligonal, texturizado PBR y desarrollo de gameplay.
        </p>
        <p>
          Trabajo con herramientas como <strong>Blender</strong>,{' '}
          <strong>Substance Painter</strong>, <strong>Unity</strong> y{' '}
          <strong>Unreal Engine</strong>. También tengo experiencia en
          programación con C#, Python y TypeScript.
        </p>
      </div>

      <h2>Habilidades</h2>
      <div className="skills-grid">
        <div className="skill-tag">Blender</div>
        <div className="skill-tag">Maya</div>
        <div className="skill-tag">Substance Painter</div>
        <div className="skill-tag">Unity</div>
        <div className="skill-tag">Unreal Engine</div>
        <div className="skill-tag">C#</div>
        <div className="skill-tag">Python</div>
        <div className="skill-tag">TypeScript</div>
      </div>
    </section>
  )
}

export default AcercaDeMi
