import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/landing.css';

interface FeedbackState {
  tipo: 'success' | 'error';
  texto: string;
}

export function LandingPage() {
  const [menuAbierto, setMenuAbierto] = useState<boolean>(false);
  const [nombre, setNombre] = useState<string>('');
  const [telefono, setTelefono] = useState<string>('');
  const [correo, setCorreo] = useState<string>('');
  const [municipio, setMunicipio] = useState<string>('');
  const [servicio, setServicio] = useState<string>('');
  const [mensaje, setMensaje] = useState<string>('');
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setMenuAbierto(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const seleccionarServicio = (valor: string): void => {
    setServicio(valor);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (
      !nombre.trim() ||
      !telefono.trim() ||
      !correo.trim() ||
      !municipio.trim() ||
      !servicio ||
      !mensaje.trim()
    ) {
      setFeedback({
        tipo: 'error',
        texto:
          'Por favor complete todos los campos obligatorios (*) para estructurar su solicitud técnica.',
      });
      return;
    }

    const etiquetasServicios: Record<string, string> = {
      avaluos: 'Avalúos Comerciales (Urbanos / Rurales - Res. 941 de 2026)',
      topografia: 'Topografía GNSS/RTK, Fotogrametría con Dron y SIG',
      'tramites-prediales':
        'Trámites Prediales y Gestión Catastral (Res. Conjunta 1101, Linderos, Englobes)',
      legalizacion: 'Legalización de Construcciones y Consultoría POT / Curadurías',
      'consultoria-integral': 'Consultoría Integral / Otro requerimiento predial',
    };

    const waMessage =
      `Hola INGEOPREDIAL S.A.S., solicito cotización / asesoría técnica:\n` +
      `• Nombre/Empresa: ${nombre.trim()}\n` +
      `• Teléfono: ${telefono.trim()}\n` +
      `• Correo: ${correo.trim()}\n` +
      `• Municipio/Predio: ${municipio.trim()}\n` +
      `• Especialidad: ${etiquetasServicios[servicio] || servicio}\n` +
      `• Detalles: ${mensaje.trim()}`;

    const waUrl = `https://wa.me/573106291208?text=${encodeURIComponent(waMessage)}`;

    setFeedback({
      tipo: 'success',
      texto:
        '✓ Solicitud técnica estructurada correctamente. Redirigiendo a atención directa por WhatsApp o comuníquese al 310-629-1208.',
    });

    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setNombre('');
    setTelefono('');
    setCorreo('');
    setMunicipio('');
    setServicio('');
    setMensaje('');
  };

  return (
    <>
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>

      {/* ENCABEZADO Y BARRA DE NAVEGACIÓN */}
      <header className="site-header" id="top">
        <div className="container header-container">
          <a href="#inicio" className="brand-logo" aria-label="Ir al inicio de INGEOPREDIAL S.A.S.">
            <img
              src="/assets/images/logo-ingeopredial.png"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/logo_ingeopredial.png';
              }}
              alt="Logo oficial de INGEOPREDIAL S.A.S. - Firma de Ingenieros Catastrales y Geodestas en Colombia"
              width={180}
              height={52}
            />
            <span className="brand-name">
              INGEOPREDIAL <small>S.A.S.</small>
            </span>
          </a>

          <button
            className={`nav-toggle ${menuAbierto ? 'is-active' : ''}`}
            type="button"
            aria-expanded={menuAbierto}
            aria-controls="primaryNav"
            aria-label="Abrir menú de navegación principal"
            onClick={() => setMenuAbierto((prev) => !prev)}
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>

          <nav
            className={`primary-nav ${menuAbierto ? 'is-open' : ''}`}
            id="primaryNav"
            aria-label="Navegación principal"
          >
            <ul className="nav-list">
              <li>
                <a href="#inicio" className="nav-link" onClick={() => setMenuAbierto(false)}>
                  Inicio
                </a>
              </li>
              <li>
                <a href="#nosotros" className="nav-link" onClick={() => setMenuAbierto(false)}>
                  Nosotros
                </a>
              </li>
              <li>
                <a href="#servicios" className="nav-link" onClick={() => setMenuAbierto(false)}>
                  Servicios
                </a>
              </li>
              <li>
                <a href="#galeria" className="nav-link" onClick={() => setMenuAbierto(false)}>
                  Galería
                </a>
              </li>
              <li>
                <a href="#contacto" className="nav-link" onClick={() => setMenuAbierto(false)}>
                  Contacto
                </a>
              </li>
            </ul>
            <a
              href="#contacto"
              className="btn btn-primary btn-header-cta"
              onClick={() => setMenuAbierto(false)}
            >
              Solicitar Cotización
            </a>
            <Link
              to="/portal"
              className="btn btn-portal-outline btn-header-cta"
              onClick={() => setMenuAbierto(false)}
            >
              Portal Socios
            </Link>
          </nav>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main id="main-content">
        {/* 1. SPLIT HERO SECTION */}
        <section id="inicio" className="hero-section" aria-labelledby="hero-title">
          <div className="hero-bg-wrapper">
            <img
              src="/assets/images/hero-topografia-colombia.jpg"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/assets/images/hero-topografia-colombia.png';
              }}
              alt="Ingenieros catastrales y geodestas ejecutando levantamientos topográficos de alta precisión con equipos GNSS RTK y fotogrametría con dron en Colombia"
              className="hero-bg-image"
            />
            <div className="hero-overlay"></div>
          </div>

          <div className="container hero-container">
            <div className="hero-split-grid">
              <div className="hero-content">
                <span className="eyebrow-badge">
                  INGENIERÍA CATASTRAL, GEODESIA Y CONSULTORÍA PREDIAL EN COLOMBIA
                </span>
                <h1 id="hero-title">
                  Seguridad Jurídica y Precisión Técnica para su Patrimonio Inmobiliario y Territorial
                </h1>
                <p className="hero-subtitle">
                  Respaldamos sus decisiones de inversión, infraestructura y saneamiento de la
                  propiedad mediante avalúos comerciales certificados, levantamientos topográficos de
                  alta precisión y gestión integral del territorio bajo estricto cumplimiento de la
                  normatividad IGAC y SNR.
                </p>

                <div className="hero-cta-group">
                  <a href="#contacto" className="btn btn-primary btn-lg">
                    Solicitar Asesoría Técnica
                  </a>
                  <a href="#servicios" className="btn btn-outline-light btn-lg">
                    Explorar Portafolio de Servicios
                  </a>
                </div>
              </div>

              <div className="hero-visual-showcase">
                <figure className="hero-featured-frame">
                  <img
                    src="/assets/images/hero-topografia-colombia.jpg"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/assets/images/hero-topografia-colombia.png';
                    }}
                    alt="Operación de receptor geodésico GNSS RTK de precisión milimétrica y estación total en Colombia por INGEOPREDIAL S.A.S."
                    className="hero-featured-img"
                    width={540}
                    height={420}
                  />

                  <div className="hero-floating-badge badge-top-right">
                    <span className="status-dot" aria-hidden="true"></span>
                    <div>
                      <strong>Precisión GNSS/RTK</strong>
                      <span>Georreferenciación MAGNA-SIRGAS</span>
                    </div>
                  </div>

                  <div className="hero-floating-badge badge-bottom-left">
                    <span className="badge-icon-check" aria-hidden="true">
                      ✓
                    </span>
                    <div>
                      <strong>Normativa IGAC 2026</strong>
                      <span>Res. 941 • Res. Conjunta 1101</span>
                    </div>
                  </div>
                </figure>
              </div>
            </div>

            <div className="hero-quick-access" aria-label="Accesos directos a servicios principales">
              <article className="quick-card">
                <div className="quick-card-header">
                  <span className="quick-icon" aria-hidden="true">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 21h18" />
                      <path d="M5 21V7l7-4 7 4v14" />
                      <path d="M9 14l2 2 4-4" />
                    </svg>
                  </span>
                  <h2>Avalúos Comerciales (IGAC / Res. 941 de 2026)</h2>
                </div>
                <p>
                  Dictámenes técnicos de valor comercial para predios urbanos, rurales y activos
                  especiales con rigor metodológico y validez oficial.
                </p>
                <a href="#servicio-avaluos" className="quick-link">
                  Ver alcance en Avalúos →
                </a>
              </article>

              <article className="quick-card">
                <div className="quick-card-header">
                  <span className="quick-icon" aria-hidden="true">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
                    </svg>
                  </span>
                  <h2>Topografía GNSS/RTK, Fotogrametría y SIG</h2>
                </div>
                <p>
                  Georreferenciación milimétrica, mapeo aerofotogramétrico con dron (RPAS) y
                  modelamiento cartográfico para proyectos urbanos y rurales.
                </p>
                <a href="#servicio-topografia" className="quick-link">
                  Ver alcance en Topografía →
                </a>
              </article>
            </div>

            <ul className="hero-trust-bar" aria-label="Garantías institucionales">
              <li>
                <span className="trust-check" aria-hidden="true">
                  ✓
                </span>{' '}
                Liderado por Ingenieros Catastrales y Geodestas
              </li>
              <li>
                <span className="trust-check" aria-hidden="true">
                  ✓
                </span>{' '}
                Normatividad Vigente IGAC &amp; SNR
              </li>
              <li>
                <span className="trust-check" aria-hidden="true">
                  ✓
                </span>{' '}
                Cobertura en Bogotá D.C. y a Nivel Nacional
              </li>
            </ul>
          </div>
        </section>

        {/* 2. SECCIÓN NOSOTROS */}
        <section id="nosotros" className="section about-section bg-light" aria-labelledby="about-title">
          <div className="container about-grid">
            <div className="about-content">
              <span className="section-eyebrow">RESPALDO INSTITUCIONAL Y RIGOR CIENTÍFICO</span>
              <h2 id="about-title" className="section-title">
                Autoridad Técnica Liderada por Ingenieros Catastrales y Geodestas Expertos
              </h2>
              <p className="about-lead">
                <strong>INGEOPREDIAL S.A.S.</strong> es una firma colombiana de ingeniería y
                consultoría especializada en la administración, valoración y ordenamiento
                físico-jurídico del territorio. Nuestra organización está{' '}
                <strong>
                  liderada por un equipo directivo de tres ingenieros catastrales y geodestas
                  expertos
                </strong>
                , cuya trayectoria combina el dominio de las ciencias geoespaciales, la valuación
                inmobiliaria y el derecho registral y catastral.
              </p>
              <p className="about-body">
                Entendemos que cada metro cuadrado y cada línea de lindero representan patrimonio,
                inversión y viabilidad de proyectos. Por ello, integramos instrumentación geodésica
                de última generación con un análisis riguroso de los títulos de propiedad y las
                disposiciones vigentes del Instituto Geográfico Agustín Codazzi (IGAC), la
                Superintendencia de Notariado y Registro (SNR), los Planes de Ordenamiento
                Territorial (POT) y las Curadurías Urbanas, garantizando{' '}
                <strong>seguridad jurídica y técnica en todo el territorio colombiano</strong>.
              </p>

              <div className="about-pillars">
                <article className="pillar-item">
                  <div className="pillar-marker" aria-hidden="true">
                    01
                  </div>
                  <div>
                    <h3>Rigor Técnico y Geodésico</h3>
                    <p>
                      Aplicación estricta de estándares posicionales MAGNA-SIRGAS, tecnología
                      GNSS/RTK y procesamiento fotogramétrico de alta resolución.
                    </p>
                  </div>
                </article>
                <article className="pillar-item">
                  <div className="pillar-marker" aria-hidden="true">
                    02
                  </div>
                  <div>
                    <h3>Blindaje Normativo y Registral</h3>
                    <p>
                      Articulación exacta entre la realidad física del terreno, la base catastral y
                      la tradición jurídica en los folios de matrícula inmobiliaria.
                    </p>
                  </div>
                </article>
                <article className="pillar-item">
                  <div className="pillar-marker" aria-hidden="true">
                    03
                  </div>
                  <div>
                    <h3>Cobertura Nacional Multipropósito</h3>
                    <p>
                      Capacidad operativa en Bogotá D.C. y despliegue técnico en zonas urbanas,
                      suburbanas y rurales de cualquier departamento del país.
                    </p>
                  </div>
                </article>
              </div>
            </div>

            <div className="about-visual-column">
              <div
                className="about-collage"
                role="group"
                aria-label="Registro visual de dirección de ingeniería catastral y operación geodésica en campo"
              >
                <figure className="about-collage-primary">
                  <img
                    src="/assets/images/nosotros-ingenieros-catastrales.jpg"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/assets/images/nosotros-ingenieros-catastrales.png';
                    }}
                    alt="Equipo directivo de tres ingenieros catastrales y geodestas analizando cartografía predial de Colombia"
                    loading="lazy"
                    width={540}
                    height={400}
                  />
                  <figcaption className="collage-tag">
                    Dirección de Ingeniería &amp; Cartografía SIG
                  </figcaption>
                </figure>

                <figure className="about-collage-secondary">
                  <img
                    src="/assets/images/servicio-topografia.jpg"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/assets/images/servicio-topografia.png';
                    }}
                    alt="Ingenieros geodestas realizando levantamiento topográfico en campo con antena GNSS RTK y dron RPAS"
                    loading="lazy"
                    width={340}
                    height={240}
                  />
                  <figcaption className="collage-tag collage-tag-green">
                    Operación Geodésica en Campo
                  </figcaption>
                </figure>
              </div>

              <div className="about-metrics-grid" aria-label="Indicadores de respaldo institucional">
                <div className="metric-card">
                  <strong className="metric-value">100%</strong>
                  <span className="metric-label">Cumplimiento IGAC / SNR</span>
                </div>
                <div className="metric-card">
                  <strong className="metric-value">Nacional</strong>
                  <span className="metric-label">Cobertura en Colombia</span>
                </div>
                <div className="metric-card">
                  <strong className="metric-value">3 Directores</strong>
                  <span className="metric-label">Ing. Catastrales y Geodestas</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. SECCIÓN DE SERVICIOS */}
        <section id="servicios" className="section services-section" aria-labelledby="services-title">
          <div className="container">
            <header className="section-header text-center">
              <span className="section-eyebrow">SOLUCIONES INTEGRALES EN INGENIERÍA DEL TERRITORIO</span>
              <h2 id="services-title" className="section-title">
                Nuestro Portafolio Especializado de Servicios
              </h2>
              <p className="section-description">
                Ejecutamos estudios, dictámenes y trámites técnicos con trazabilidad documental y
                precisión certificada, estructurados en cuatro líneas estratégicas de actuación
                predial:
              </p>
            </header>

            <div className="services-grid">
              {/* TARJETA 1: AVALÚOS */}
              <article id="servicio-avaluos" className="service-card">
                <div className="service-card-media">
                  <img
                    src="/assets/images/servicio-avaluos.jpg"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/assets/images/servicio-avaluos.png';
                    }}
                    alt="Ingeniero avaluador realizando inspección técnica para avalúos comerciales bajo Resolución 941 de 2026"
                    loading="lazy"
                    width={600}
                    height={240}
                  />
                  <div className="service-media-overlay"></div>
                  <span className="service-norm-tag">Normatividad IGAC • Resolución 941 de 2026</span>
                  <div className="service-icon-box service-icon-floating">
                    <svg
                      className="service-icon-svg"
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--verde-corporativo)"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 21h18" />
                      <path d="M5 21V7l7-4 7 4v14" />
                      <path d="M9 9h6" />
                      <path d="M9 13h6" />
                      <path d="M9 17l2 2 4-4" />
                    </svg>
                  </div>
                </div>

                <div className="service-card-body">
                  <h3 className="service-card-title">Avalúos Comerciales, Urbanos y Rurales</h3>
                  <p className="service-card-desc">
                    Elaboración de dictámenes valuatorios objetivos y sustentados estadísticamente
                    para determinar el valor comercial real de bienes inmuebles urbanos, rurales e
                    industriales bajo las metodologías oficiales del <strong>IGAC</strong> y la{' '}
                    <strong>Resolución 941 de 2026</strong>.
                  </p>
                  <ul className="service-chips" aria-label="Alcances en Avalúos">
                    <li className="service-chip">
                      <span className="chip-dot">✓</span> Inmuebles Urbanos y Lotes
                    </li>
                    <li className="service-chip">
                      <span className="chip-dot">✓</span> Predios Rurales y Agropecuarios
                    </li>
                    <li className="service-chip">
                      <span className="chip-dot">✓</span> Activos Industriales y NIIF
                    </li>
                    <li className="service-chip">
                      <span className="chip-dot">✓</span> Indemnizaciones y Servidumbres
                    </li>
                  </ul>
                  <a
                    href="#contacto"
                    className="service-card-cta"
                    onClick={() => seleccionarServicio('avaluos')}
                  >
                    Cotizar Avalúo Técnico →
                  </a>
                </div>
              </article>

              {/* TARJETA 2: TOPOGRAFÍA */}
              <article id="servicio-topografia" className="service-card">
                <div className="service-card-media">
                  <img
                    src="/assets/images/servicio-topografia.jpg"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/assets/images/servicio-topografia.png';
                    }}
                    alt="Levantamientos topográficos de alta precisión con equipos GNSS RTK y fotogrametría con dron"
                    loading="lazy"
                    width={600}
                    height={240}
                  />
                  <div className="service-media-overlay"></div>
                  <span className="service-norm-tag">
                    Equipos GNSS/RTK • Dron (RPAS) • Cartografía Digital
                  </span>
                  <div className="service-icon-box service-icon-floating">
                    <svg
                      className="service-icon-svg"
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--verde-corporativo)"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="10" r="3" />
                      <circle cx="12" cy="10" r="7" />
                      <path d="M12 2v2" />
                      <path d="M4 10H2" />
                      <path d="M22 10h-2" />
                      <path d="M12 17v5" />
                      <path d="M8 22l4-5 4 5" />
                    </svg>
                  </div>
                </div>

                <div className="service-card-body">
                  <h3 className="service-card-title">Topografía de Precisión, Fotogrametría y SIG</h3>
                  <p className="service-card-desc">
                    Ejecución de <strong>levantamientos topográficos</strong> urbanos y rurales
                    amarrados a la red geodésica nacional con receptores <strong>GNSS/RTK</strong>{' '}
                    de doble frecuencia, captura aerofotogramétrica con <strong>dron (RPAS)</strong>,
                    cartografía digital y estructuración en <strong>SIG</strong>.
                  </p>
                  <ul className="service-chips" aria-label="Alcances en Topografía">
                    <li className="service-chip">
                      <span className="chip-dot">✓</span> Georreferenciación GNSS/RTK
                    </li>
                    <li className="service-chip">
                      <span className="chip-dot">✓</span> Fotogrametría Dron (RPAS)
                    </li>
                    <li className="service-chip">
                      <span className="chip-dot">✓</span> Ortofotomosaicos y MDT/MDS
                    </li>
                    <li className="service-chip">
                      <span className="chip-dot">✓</span> Cartografía Oficial y SIG
                    </li>
                  </ul>
                  <a
                    href="#contacto"
                    className="service-card-cta"
                    onClick={() => seleccionarServicio('topografia')}
                  >
                    Solicitar Levantamiento →
                  </a>
                </div>
              </article>

              {/* TARJETA 3: TRÁMITES PREDIALES */}
              <article id="servicio-tramites-prediales" className="service-card">
                <div className="service-card-media">
                  <img
                    src="/assets/images/servicio-catastro.jpg"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/assets/images/servicio-catastro.png';
                    }}
                    alt="Ortofotomosaico aéreo con poligonales catastrales bajo Resolución Conjunta 1101 IGAC SNR"
                    loading="lazy"
                    width={600}
                    height={240}
                  />
                  <div className="service-media-overlay"></div>
                  <span className="service-norm-tag">
                    Resolución Conjunta 1101 (IGAC - SNR) • Saneamiento
                  </span>
                  <div className="service-icon-box service-icon-floating">
                    <svg
                      className="service-icon-svg"
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--verde-corporativo)"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                      <line x1="9" y1="3" x2="9" y2="18" />
                      <line x1="15" y1="6" x2="15" y2="21" />
                    </svg>
                  </div>
                </div>

                <div className="service-card-body">
                  <h3 className="service-card-title">Trámites Prediales y Gestión Catastral</h3>
                  <p className="service-card-desc">
                    Gestión integral ante gestores catastrales, notarías y Oficinas de Registro de
                    Instrumentos Públicos para armonizar la realidad física del inmueble con su
                    realidad jurídica bajo la <strong>Resolución Conjunta 1101</strong> (IGAC - SNR).
                  </p>
                  <ul className="service-chips" aria-label="Alcances en Trámites Prediales">
                    <li className="service-chip">
                      <span className="chip-dot">✓</span> Rectificación Áreas y Linderos (1101)
                    </li>
                    <li className="service-chip">
                      <span className="chip-dot">✓</span> Englobes, Desenglobes y Loteos
                    </li>
                    <li className="service-chip">
                      <span className="chip-dot">✓</span> Deslindes y Servidumbres
                    </li>
                    <li className="service-chip">
                      <span className="chip-dot">✓</span> Estudios Técnicos de Títulos
                    </li>
                  </ul>
                  <a
                    href="#contacto"
                    className="service-card-cta"
                    onClick={() => seleccionarServicio('tramites-prediales')}
                  >
                    Iniciar Trámite Predial →
                  </a>
                </div>
              </article>

              {/* TARJETA 4: LEGALIZACIÓN Y CONSULTORÍA */}
              <article id="servicio-legalizacion" className="service-card">
                <div className="service-card-media">
                  <img
                    src="/assets/images/servicio-legalizacion.jpg"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/assets/images/servicio-legalizacion.png';
                    }}
                    alt="Planos estructurales, legalización de construcciones y consultoría normativa POT"
                    loading="lazy"
                    width={600}
                    height={240}
                  />
                  <div className="service-media-overlay"></div>
                  <span className="service-norm-tag">
                    Normativa POT • Curadurías Urbanas • Viabilidad
                  </span>
                  <div className="service-icon-box service-icon-floating">
                    <svg
                      className="service-icon-svg"
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--verde-corporativo)"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <path d="M9 15l2 2 4-4" />
                    </svg>
                  </div>
                </div>

                <div className="service-card-body">
                  <h3 className="service-card-title">
                    Legalización Urbanística y Consultoría Técnica
                  </h3>
                  <p className="service-card-desc">
                    Asesoría técnica y jurídica especializada para la regularización de desarrollos
                    constructivos, revisión de folios de matrícula inmobiliaria, análisis de
                    determinantes del <strong>POT</strong> y estructuración de expedientes ante{' '}
                    <strong>Curadurías Urbanas</strong>.
                  </p>
                  <ul className="service-chips" aria-label="Alcances en Legalización">
                    <li className="service-chip">
                      <span className="chip-dot">✓</span> Legalización de Construcciones
                    </li>
                    <li className="service-chip">
                      <span className="chip-dot">✓</span> Consultoría Normativa POT
                    </li>
                    <li className="service-chip">
                      <span className="chip-dot">✓</span> Diagnóstico de Matrículas
                    </li>
                    <li className="service-chip">
                      <span className="chip-dot">✓</span> Análisis Estructural Básico
                    </li>
                  </ul>
                  <a
                    href="#contacto"
                    className="service-card-cta"
                    onClick={() => seleccionarServicio('legalizacion')}
                  >
                    Consultar Viabilidad →
                  </a>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* 4. GALERÍA BENTO GRID */}
        <section id="galeria" className="section gallery-section" aria-labelledby="gallery-title">
          <div className="container">
            <header className="section-header text-center">
              <span className="section-eyebrow">TECNOLOGÍA Y OPERACIÓN EN CAMPO</span>
              <h2 id="gallery-title" className="section-title">
                Ingeniería Geoespacial y Precisión Técnica en Acción
              </h2>
              <p className="section-description">
                Combinamos instrumentación satelital de última generación con rigor
                jurídico-catastral para entregar dictámenes y levantamientos con validez oficial en
                toda Colombia.
              </p>
            </header>

            <div className="bento-grid">
              <figure className="bento-item bento-item-featured">
                <img
                  src="/assets/images/hero-topografia-colombia.jpg"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/assets/images/hero-topografia-colombia.png';
                  }}
                  alt="Operación en campo con receptores satelitales GNSS RTK de precisión milimétrica"
                  loading="lazy"
                  width={700}
                  height={560}
                />
                <figcaption className="bento-overlay">
                  <span className="bento-tag">GEODESIA SATELITAL</span>
                  <h3>Operación GNSS/RTK de Precisión Milimétrica</h3>
                  <p>
                    Posicionamiento en tiempo real amarrado a la red MAGNA-SIRGAS para control
                    geodésico urbano y rural.
                  </p>
                </figcaption>
              </figure>

              <figure className="bento-item bento-item-wide">
                <img
                  src="/assets/images/servicio-topografia.jpg"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/assets/images/servicio-topografia.png';
                  }}
                  alt="Mapeo aerofotogramétrico con dron RPAS y Modelos Digitales de Terreno"
                  loading="lazy"
                  width={700}
                  height={320}
                />
                <figcaption className="bento-overlay">
                  <span className="bento-tag">AEROFOTOGRAMETRÍA RPAS</span>
                  <h3>Fotogrametría con Dron (RPAS) y Modelos Digitales de Terreno</h3>
                  <p>
                    Ortofotomosaicos centimétricos, cálculo volumétrico y modelamiento topográfico de
                    grandes extensiones.
                  </p>
                </figcaption>
              </figure>

              <figure className="bento-item">
                <img
                  src="/assets/images/servicio-catastro.jpg"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/assets/images/servicio-catastro.png';
                  }}
                  alt="Análisis espacial en Sistemas de Información Geográfica SIG"
                  loading="lazy"
                  width={500}
                  height={320}
                />
                <figcaption className="bento-overlay">
                  <span className="bento-tag">CATASTRO MULTIPROPÓSITO</span>
                  <h3>Cartografía Catastral y SIG (Resolución Conjunta 1101)</h3>
                  <p>
                    Estructuración de bases geográficas y planos protocolizables ante IGAC, gestores
                    catastrales y SNR.
                  </p>
                </figcaption>
              </figure>

              <figure className="bento-item">
                <img
                  src="/assets/images/servicio-avaluos.jpg"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/assets/images/servicio-avaluos.png';
                  }}
                  alt="Inspección técnica para avalúos comerciales bajo Resolución 941 de 2026"
                  loading="lazy"
                  width={500}
                  height={320}
                />
                <figcaption className="bento-overlay">
                  <span className="bento-tag">VALUACIÓN CERTIFICADA</span>
                  <h3>Avalúos Urbanos, Rurales e Industriales (Resolución 941 de 2026)</h3>
                  <p>
                    Dictámenes corporativos, comerciales y judiciales con rigor metodológico y
                    estadístico.
                  </p>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* 5. SECCIÓN DE CONTACTO */}
        <section id="contacto" className="section contact-section bg-light" aria-labelledby="contact-title">
          <div className="container contact-grid">
            <div className="contact-info">
              <span className="section-eyebrow">ATENCIÓN DIRECTA DE INGENIEROS ESPECIALISTAS</span>
              <h2 id="contact-title" className="section-title">
                Hable con Nuestro Equipo Directivo y Solicite su Propuesta Técnica
              </h2>
              <p className="contact-intro">
                Exponga el requerimiento técnico o jurídico de su predio. Nuestros tres ingenieros
                catastrales y geodestas directores evaluarán su caso de manera personalizada para
                ofrecerle una ruta de trabajo precisa, transparente y ajustada a la normatividad
                colombiana vigente.
              </p>

              <div className="contact-cards-stack">
                <div className="info-card">
                  <h3>Ubicación y Cobertura</h3>
                  <p>
                    Sede principal en <strong>Bogotá D.C.</strong> con capacidad de desplazamiento
                    técnico, operación de campo y gestión catastral{' '}
                    <strong>a nivel nacional</strong> en todos los municipios de Colombia.
                  </p>
                </div>

                <div className="info-card">
                  <h3>Líneas Directas — Dirección de Ingeniería</h3>
                  <ul className="phone-list">
                    <li>
                      <a href="tel:+573106291208" className="phone-link">
                        <span className="phone-badge">Línea Directiva 1</span>
                        <strong>+57 310-629-1208</strong>
                      </a>
                    </li>
                    <li>
                      <a href="tel:+573227389449" className="phone-link">
                        <span className="phone-badge">Línea Directiva 2</span>
                        <strong>+57 322-738-9449</strong>
                      </a>
                    </li>
                    <li>
                      <a href="tel:+573125338045" className="phone-link">
                        <span className="phone-badge">Línea Directiva 3</span>
                        <strong>+57 312-533-8045</strong>
                      </a>
                    </li>
                  </ul>
                  <p className="schedule-note">
                    Lunes a Viernes: 8:00 a.m. – 6:00 p.m. | Sábados: 8:00 a.m. – 1:00 p.m.
                  </p>
                </div>
              </div>
            </div>

            <div className="contact-form-wrapper">
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <h3 className="form-title">Formulario de Solicitud Técnica</h3>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre completo o Empresa *</label>
                    <input
                      type="text"
                      id="nombre"
                      required
                      placeholder="Ej. Ing. Carlos Mendoza / Constructora Andina S.A.S."
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="telefono">Teléfono móvil / WhatsApp *</label>
                    <input
                      type="tel"
                      id="telefono"
                      required
                      placeholder="Ej. 310 000 0000"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="correo">Correo electrónico corporativo o personal *</label>
                    <input
                      type="email"
                      id="correo"
                      required
                      placeholder="Ej. contacto@empresa.com"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="municipio">Municipio y Departamento del Predio *</label>
                    <input
                      type="text"
                      id="municipio"
                      required
                      placeholder="Ej. Bogotá D.C. / Chía, Cundinamarca"
                      value={municipio}
                      onChange={(e) => setMunicipio(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="servicio">Especialidad requerida *</label>
                  <select
                    id="servicio"
                    required
                    value={servicio}
                    onChange={(e) => setServicio(e.target.value)}
                  >
                    <option value="" disabled>
                      Seleccione el servicio de su interés...
                    </option>
                    <option value="avaluos">
                      Avalúos Comerciales (Urbanos / Rurales - Res. 941 de 2026)
                    </option>
                    <option value="topografia">
                      Topografía GNSS/RTK, Fotogrametría con Dron y SIG
                    </option>
                    <option value="tramites-prediales">
                      Trámites Prediales y Gestión Catastral (Res. Conjunta 1101, Linderos, Englobes)
                    </option>
                    <option value="legalizacion">
                      Legalización de Construcciones y Consultoría POT / Curadurías
                    </option>
                    <option value="consultoria-integral">
                      Consultoría Integral / Otro requerimiento predial
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="mensaje">Detalles técnicos del predio o requerimiento *</label>
                  <textarea
                    id="mensaje"
                    rows={4}
                    required
                    placeholder="Indique brevemente el área aproximada, número de matrícula inmobiliaria o cédula catastral (opcional) y el objetivo de su trámite o estudio."
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                  />
                </div>

                <p className="form-privacy">
                  Al enviar esta solicitud, autoriza el tratamiento confidencial de sus datos
                  conforme a la Ley 1581 de 2012, exclusivamente para fines de cotización y asesoría
                  técnica por parte de INGEOPREDIAL S.A.S.
                </p>

                {feedback && (
                  <div
                    className={`form-feedback ${
                      feedback.tipo === 'success' ? 'is-success' : 'is-error'
                    }`}
                    role="status"
                    aria-live="polite"
                  >
                    {feedback.texto}
                  </div>
                )}

                <button type="submit" className="btn btn-primary btn-block">
                  Enviar Solicitud al Equipo de Ingeniería
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* PIE DE PÁGINA */}
      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <a href="#inicio" className="footer-logo-link">
              <img
                src="/assets/images/logo-ingeopredial.png"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/logo_ingeopredial.png';
                }}
                alt="INGEOPREDIAL S.A.S. - Consultoría en Avalúos Comerciales, Topografía y Gestión Predial"
                width={160}
                height={46}
                loading="lazy"
              />
            </a>
            <p className="footer-about">
              <strong>INGEOPREDIAL S.A.S.</strong> — Firma especializada de ingenieros catastrales y
              geodestas. Brindamos seguridad jurídica, precisión topográfica y rigor valuatorio en
              Bogotá D.C. y en todo el territorio nacional colombiano.
            </p>
          </div>

          <nav className="footer-nav" aria-label="Enlaces del pie de página">
            <h4>Especialidades</h4>
            <ul>
              <li>
                <a href="#servicio-avaluos">Avalúos Comerciales (Res. 941 de 2026)</a>
              </li>
              <li>
                <a href="#servicio-topografia">Topografía GNSS/RTK y Dron</a>
              </li>
              <li>
                <a href="#servicio-tramites-prediales">Trámites Prediales (Res. Conjunta 1101)</a>
              </li>
              <li>
                <a href="#servicio-legalizacion">Legalización y Consultoría POT</a>
              </li>
              <li>
                <a href="#galeria">Tecnología y Operación en Campo</a>
              </li>
            </ul>
          </nav>

          <div className="footer-contact">
            <h4>Contacto Directivo</h4>
            <p>Ubicación: Bogotá D.C., Colombia — Cobertura a Nivel Nacional</p>
            <p className="footer-phones">
              Líneas Directivas: <a href="tel:+573106291208">310-629-1208</a> |{' '}
              <a href="tel:+573227389449">322-738-9449</a> |{' '}
              <a href="tel:+573125338045">312-533-8045</a>
            </p>
            <p style={{ marginTop: '0.85rem' }}>
              <Link to="/portal" style={{ color: '#86efac', fontWeight: 700 }}>
                → Ingresar al Portal Operativo (Socios y Colaboradores)
              </Link>
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container">
            <p>
              © 2026 INGEOPREDIAL S.A.S. Todos los derechos reservados. Ingeniería Catastral,
              Geodesia, Avalúos Comerciales y Gestión Predial en Colombia.
            </p>
          </div>
        </div>
      </footer>

      {/* BOTÓN FLOTANTE DE WHATSAPP */}
      <a
        href="https://wa.me/573106291208?text=Hola%20INGEOPREDIAL%20S.A.S.,%20solicito%20asesor%C3%ADa%20t%C3%A9cnica%20sobre%20un%20servicio%20predial."
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar a un ingeniero catastral de INGEOPREDIAL S.A.S. por WhatsApp"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
        <span className="whatsapp-tooltip">Asesoría en línea</span>
      </a>
    </>
  );
}