function Contacto() {
  return (
    <section className="page">
      <h1>Contacto</h1>
      <p className="subtitle">
        Estoy abierto a colaboraciones y nuevos proyectos
      </p>

      <div className="contact-links">
        <a href="mailto:tu@email.com" className="contact-item">
          <span className="contact-icon">📧</span>
          <span>tu@email.com</span>
        </a>
        <a href="https://github.com/tuusuario" target="_blank" rel="noopener noreferrer" className="contact-item">
          <span className="contact-icon">🐙</span>
          <span>github.com/tuusuario</span>
        </a>
        <a href="https://linkedin.com/in/tuusuario" target="_blank" rel="noopener noreferrer" className="contact-item">
          <span className="contact-icon">💼</span>
          <span>linkedin.com/in/tuusuario</span>
        </a>
      </div>

      <h2>Envíame un mensaje</h2>
      <form className="contact-form">
        <label>
          Nombre
          <input type="text" placeholder="Tu nombre" />
        </label>
        <label>
          Email
          <input type="email" placeholder="tu@email.com" />
        </label>
        <label>
          Mensaje
          <textarea rows={5} placeholder="Escribí tu mensaje..." />
        </label>
        <button type="submit" className="btn-submit">Enviar</button>
      </form>
    </section>
  )
}

export default Contacto
