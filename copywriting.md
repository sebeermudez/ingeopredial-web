# Entregable de Copywriting y Arquitectura de Contenidos SEO — INGEOPREDIAL S.A.S.

> **Documento Oficial del Agente Copywriter (`copywriter`)**  
> Redacción técnica, institucional, persuasiva y optimizada para motores de búsqueda (SEO) bajo los lineamientos estrictos de `directrices.md`.

---

## 1. Metadatos SEO y Configuración del Documento (`<head>`)

- **Atributo de idioma:** `<html lang="es-CO">`
- **Etiqueta `<title>` (64 caracteres):**
  ```html
  <title>INGEOPREDIAL S.A.S. | Avalúos, Topografía y Gestión Catastral</title>
  ```
- **Etiqueta `<meta name="description">` (149 caracteres — Cumple límite estricto ≤ 155 caracteres e incluye las 3 palabras clave exactas):**
  ```html
  <meta name="description" content="INGEOPREDIAL: Firma de ingenieros catastrales en Colombia. Expertos en avalúos comerciales, levantamientos topográficos y seguridad jurídica predial.">
  ```
  - *Verificación de palabras clave exactas incluidas:*
    1. `"ingenieros catastrales"`
    2. `"avalúos comerciales"`
    3. `"levantamientos topográficos"`
  - *Longitud exacta:* **149 caracteres** (con espacios incluidos).
- **Palabras clave adicionales (`<meta name="keywords">` opcional):**
  `ingenieros catastrales, geodestas, avalúos comerciales, levantamientos topográficos, Resolución 941 de 2026, Resolución Conjunta 1101, IGAC, SNR, GNSS RTK, fotogrametría con dron, gestión predial Colombia, saneamiento predial`

---

## 2. Atributos `alt` de Accesibilidad y SEO para Activos Visuales

Todas las imágenes del sitio web deben incorporar los siguientes atributos `alt` descriptivos y técnicos:

1. **Logo en Encabezado (`<header>`) — `./assets/images/logo-ingeopredial.png`:**
   - `alt="Logo oficial de INGEOPREDIAL S.A.S. - Firma de Ingenieros Catastrales y Geodestas en Colombia"`
2. **Imagen de Fondo / Apoyo en Hero Section (`#inicio`):**
   - `alt="Ingenieros catastrales y geodestas ejecutando levantamientos topográficos de alta precisión con equipos GNSS RTK y fotogrametría con dron en Colombia"`
3. **Imagen Institucional en Sección Nosotros (`#nosotros`):**
   - `alt="Equipo directivo de ingenieros catastrales y geodestas analizando cartografía predial, planos topográficos y estudios de títulos para seguridad jurídica territorial"`
4. **Logo en Pie de Página (`<footer>`) — `./assets/images/logo-ingeopredial.png`:**
   - `alt="INGEOPREDIAL S.A.S. - Consultoría en Avalúos Comerciales, Topografía y Gestión Predial"`
5. **Íconos SVG de Tarjetas de Servicios (`#servicios`):**
   - Deben llevar `aria-hidden="true"` o `role="img"` con etiqueta descriptiva:
     - Pilar 1 (Avalúos): `aria-label="Ícono de avalúos comerciales urbanos y rurales bajo normativa IGAC"`
     - Pilar 2 (Topografía): `aria-label="Ícono de levantamientos topográficos con GNSS RTK, dron y SIG"`
     - Pilar 3 (Trámites Prediales): `aria-label="Ícono de trámites prediales, gestión catastral y Resolución Conjunta 1101"`
     - Pilar 4 (Legalización y Consultoría): `aria-label="Ícono de legalización de construcciones y consultoría normativa POT"`

---

## 3. Textos por Sección de la Single-Page Application (SPA)

### 3.1. Encabezado y Barra de Navegación (`<header>`)
- **Identidad de marca junto al logo (opcional/accesible):** `INGEOPREDIAL S.A.S.`
- **Enlaces del Menú de Navegación (Desktop Sticky & Mobile Hamburger):**
  - `Inicio` (`#inicio`)
  - `Nosotros` (`#nosotros`)
  - `Servicios` (`#servicios`)
  - `Contacto` (`#contacto`)
- **Botón de Acción Rápida en Header (CTA secundario):**
  - Texto: `Solicitar Cotización` (ancla a `#contacto`)
- **Accesibilidad botón menú móvil:**
  - `aria-label="Abrir menú de navegación principal"`

---

### 3.2. Sección de Inicio — Hero Section (`#inicio`)

- **Etiqueta Superior / Eyebrow (Badge Institucional):**
  `INGENIERÍA CATASTRAL, GEODESIA Y CONSULTORÍA PREDIAL EN COLOMBIA`
- **Título Principal (`<h1>`):**
  `Seguridad Jurídica y Precisión Técnica para su Patrimonio Inmobiliario y Territorial`
- **Subtítulo Profesional (`<p class="hero-subtitle">`):**
  `Respaldamos sus decisiones de inversión, infraestructura y saneamiento de la propiedad mediante avalúos comerciales certificados, levantamientos topográficos de alta precisión y gestión integral del territorio bajo estricto cumplimiento de la normatividad IGAC y SNR.`
- **Botones de Llamado a la Acción (CTAs Principales):**
  - **CTA Primario (Botón `--verde-corporativo`):** `Solicitar Asesoría Técnica` (enlace a `#contacto`)
  - **CTA Secundario (Botón contorno blanco):** `Explorar Portafolio de Servicios` (enlace a `#servicios`)
- **Accesos Directos Destacados en Primera Pantalla (Quick-Access Cards / Pills a Servicios Principales):**
  - **Acceso Directo 1 — Avalúos:**
    - **Título corto:** `Avalúos Comerciales (IGAC / Res. 941 de 2026)`
    - **Micro-copy:** `Dictámenes técnicos de valor comercial para predios urbanos, rurales y activos especiales con rigor metodológico y validez oficial.`
    - **Enlace:** `Ver alcance en Avalúos →` (`#servicio-avaluos`)
  - **Acceso Directo 2 — Topografía:**
    - **Título corto:** `Topografía GNSS/RTK, Fotogrametría y SIG`
    - **Micro-copy:** `Georreferenciación milimétrica, mapeo aerofotogramétrico con dron (RPAS) y modelamiento cartográfico para proyectos urbanos y rurales.`
    - **Enlace:** `Ver alcance en Topografía →` (`#servicio-topografia`)
- **Indicadores de Confianza (Trust Bar inferior en Hero):**
  - `✓ Liderado por Ingenieros Catastrales y Geodestas`
  - `✓ Normatividad Vigente IGAC & SNR`
  - `✓ Cobertura en Bogotá D.C. y a Nivel Nacional`

---

### 3.3. Sección Nosotros (`#nosotros`)

- **Subtítulo de Sección (Eyebrow):**
  `RESPALDO INSTITUCIONAL Y RIGOR CIENTÍFICO`
- **Título de Sección (`<h2>`):**
  `Autoridad Técnica Liderada por Ingenieros Catastrales y Geodestas Expertos`
- **Párrafo Principal de Autoridad Institucional:**
  `**INGEOPREDIAL S.A.S.** es una firma colombiana de ingeniería y consultoría especializada en la administración, valoración y ordenamiento físico-jurídico del territorio. Nuestra organización está **liderada por un equipo directivo de tres ingenieros catastrales y geodestas expertos**, cuya trayectoria combina el dominio de las ciencias geoespaciales, la valuación inmobiliaria y el derecho registral y catastral.`
- **Párrafo de Enfoque Técnico y Normativo:**
  `Entendemos que cada metro cuadrado y cada línea de lindero representan patrimonio, inversión y viabilidad de proyectos. Por ello, integramos instrumentación geodésica de última generación con un análisis riguroso de los títulos de propiedad y las disposiciones vigentes del Instituto Geográfico Agustín Codazzi (IGAC), la Superintendencia de Notariado y Registro (SNR), los Planes de Ordenamiento Territorial (POT) y las Curadurías Urbanas, garantizando **seguridad jurídica y técnica en todo el territorio colombiano**.`
- **Pilares de Valor Corporativo (`<h3>` de apoyo dentro de `#nosotros`):**
  1. **`<h3>` Rigor Técnico y Geodésico:** `Aplicación estricta de estándares posicionales MAGNA-SIRGAS, tecnología GNSS/RTK y procesamiento fotogramétrico de alta resolución.`
  2. **`<h3>` Blindaje Normativo y Registral:** `Articulación exacta entre la realidad física del terreno, la base catastral y la tradición jurídica en los folios de matrícula inmobiliaria.`
  3. **`<h3>` Cobertura Nacional Multiproósito:** `Capacidad operativa en Bogotá D.C. y despliegue técnico en zonas urbanas, suburbanas y rurales de cualquier departamento del país.`

---

### 3.4. Sección de Servicios — Los 4 Pilares Técnicos (`#servicios`)

- **Subtítulo de Sección (Eyebrow):**
  `SOLUCIONES INTEGRALES EN INGENIERÍA DEL TERRITORIO`
- **Título de Sección (`<h2>`):**
  `Nuestro Portafolio Especializado de Servicios`
- **Descripción Introductoria de la Sección:**
  `Ejecutamos estudios, dictámenes y trámites técnicos con trazabilidad documental y precisión certificada, estructurados en cuatro líneas estratégicas de actuación predial:`

#### Pilar 1: Avalúos (`id="servicio-avaluos"`)
- **Título de la Tarjeta (`<h3>`):**
  `Avalúos Comerciales, Urbanos y Rurales`
- **Subtítulo / Etiqueta Normativa:**
  `Normatividad IGAC • Resolución 941 de 2026`
- **Descripción Técnica Concisa:**
  `Elaboración de dictámenes valuatorios objetivos y sustentados estadísticamente para determinar el valor comercial real de bienes inmuebles urbanos, rurales e industriales. Aplicamos con estricto rigor las metodologías oficiales del **IGAC** y los lineamientos técnicos actualizados de la **Resolución 941 de 2026**, brindando soporte confiable para transacciones comerciales, garantías hipotecarias, procesos judiciales, estados financieros (NIIF) y gestión predial.`
- **Lista de Alcances Clave (Bullets):**
  - `Avalúos comerciales de inmuebles urbanos (residenciales, comerciales, industriales y lotes).`
  - `Avalúos de predios rurales, agropecuarios y de expansión urbana.`
  - `Cálculo de indemnizaciones, servidumbres y avalúos corporativos bajo estándares IGAC y Resolución 941 de 2026.`
- **CTA de Tarjeta:** `Cotizar Avalúo Técnico →` (ancla a `#contacto`)

#### Pilar 2: Topografía (`id="servicio-topografia"`)
- **Título de la Tarjeta (`<h3>`):**
  `Topografía de Precisión, Fotogrametría y SIG`
- **Subtítulo / Etiqueta Tecnológica:**
  `Equipos GNSS/RTK • Dron (RPAS) • Cartografía Digital`
- **Descripción Técnica Concisa:**
  `Ejecución de **levantamientos topográficos** urbanos y rurales amarrados a la red geodésica nacional mediante receptores satelitales **GNSS/RTK** de doble frecuencia y estaciones totales. Integramos captura aerofotogramétrica con **dron (RPAS)**, generación de ortofotomosaicos, Modelos Digitales de Terreno (MDT/MDS), cartografía temática y estructuración de bases de datos en **Sistemas de Información Geográfica (SIG)** bajo estándares del Catastro Multipropósito.`
- **Lista de Alcances Clave (Bullets):**
  - `Levantamientos planimétricos, altimétricos y georreferenciación con tecnología GNSS/RTK.`
  - `Fotogrametría aérea con dron (RPAS), curvas de nivel de alta densidad y cálculo de volúmenes.`
  - `Producción de cartografía oficial, planos georreferenciados y análisis espacial en entornos SIG.`
- **CTA de Tarjeta:** `Solicitar Levantamiento →` (ancla a `#contacto`)

#### Pilar 3: Trámites Prediales y Gestión Catastral (`id="servicio-tramites-prediales"`)
- **Título de la Tarjeta (`<h3>`):**
  `Trámites Prediales y Gestión Catastral`
- **Subtítulo / Etiqueta Normativa:**
  `Resolución Conjunta 1101 (IGAC - SNR) • Saneamiento Predial`
- **Descripción Técnica Concisa:**
  `Gestión integral ante gestores catastrales, notarías y Oficinas de Registro de Instrumentos Públicos para armonizar la realidad física del inmueble con su realidad jurídica. Especialistas en procedimientos de precisión bajo la **Resolución Conjunta 1101**, garantizando el éxito técnico-legal en la modificación, división, agrupación y saneamiento de la propiedad raíz.`
- **Lista de Alcances Clave (Bullets):**
  - `Rectificaciones y actualizaciones de áreas y linderos registrales (**Resolución Conjunta 1101** IGAC - SNR).`
  - `Deslindes y amojonamientos técnicos en terreno, constitución e imposición de servidumbres.`
  - `Proyectos de loteos, parcelaciones, englobes y desenglobes prediales.`
  - `Estudios de títulos exhaustivos y trazabilidad histórico-registral de predios.`
- **CTA de Tarjeta:** `Iniciar Trámite Predial →` (ancla a `#contacto`)

#### Pilar 4: Legalización y Consultoría (`id="servicio-legalizacion"`)
- **Título de la Tarjeta (`<h3>`):**
  `Legalización Urbanística y Consultoría Técnica`
- **Subtítulo / Etiqueta Normativa:**
  `Normativa POT • Curadurías Urbanas • Viabilidad Predial`
- **Descripción Técnica Concisa:**
  `Asesoría técnica y jurídica especializada para la regularización de desarrollos constructivos y el análisis de viabilidad normativa del suelo. Evaluamos las determinantes de los **Planes de Ordenamiento Territorial (POT)**, realizamos diagnóstico de folios de matrícula inmobiliaria y estructuramos expedientes técnicos ante **Curadurías Urbanas** y secretarías de planeación municipal.`
- **Lista de Alcances Clave (Bullets):**
  - `Reconocimiento y legalización de construcciones existentes ante Curadurías Urbanas.`
  - `Revisión técnica y jurídica de folios de matrícula inmobiliaria y gravámenes.`
  - `Análisis estructural básico y levantamiento arquitectónico para trámites de licenciamiento.`
  - `Consultoría especializada en normas urbanísticas del POT, usos del suelo y edificabilidad.`
- **CTA de Tarjeta:** `Consultar Viabilidad →` (ancla a `#contacto`)

---

### 3.5. Sección de Contacto (`#contacto`)

- **Subtítulo de Sección (Eyebrow):**
  `ATENCIÓN DIRECTA DE INGENIEROS ESPECIALISTAS`
- **Título de Sección (`<h2>`):**
  `Hable con Nuestro Equipo Directivo y Solicite su Propuesta Técnica`
- **Texto Introductorio:**
  `Exponga el requerimiento técnico o jurídico de su predio. Nuestros tres ingenieros catastrales y geodestas directores evaluarán su caso de manera personalizada para ofrecerle una ruta de trabajo precisa, transparente y ajustada a la normatividad colombiana vigente.`

#### Bloque de Información Institucional de Contacto:
- **Sede y Cobertura Operativa:**
  - **Título (`<h3>`):** `Ubicación y Cobertura`
  - **Texto:** `Sede principal en **Bogotá D.C.** con capacidad de desplazamiento técnico, operación de campo y gestión catastral **a nivel nacional** en todos los municipios de Colombia.`
- **Líneas Directas del Equipo Directivo:**
  - **Título (`<h3>`):** `Líneas Directas — Dirección de Ingeniería`
  - **Teléfonos (Enlaces `tel:` y WhatsApp):**
    - `+57 310-629-1208` (Línea Directiva 1)
    - `+57 322-738-9449` (Línea Directiva 2)
    - `+57 312-533-8045` (Línea Directiva 3)
- **Horario de Atención Institucional:**
  - `Lunes a Viernes: 8:00 a.m. – 6:00 p.m. | Sábados: 8:00 a.m. – 1:00 p.m.`

#### Estructura de Textos para el Formulario de Contacto:
- **Título del Formulario (`<h3>`):** `Formulario de Solicitud Técnica`
- **Campos y Placeholders:**
  1. **Nombre completo o Razón Social (`label`):** `Nombre completo o Empresa *`
     - *Placeholder:* `Ej. Ing. Carlos Mendoza / Constructora Andina S.A.S.`
  2. **Teléfono / WhatsApp de contacto (`label`):** `Teléfono móvil / WhatsApp *`
     - *Placeholder:* `Ej. 310 000 0000`
  3. **Correo electrónico (`label`):** `Correo electrónico corporativo o personal *`
     - *Placeholder:* `Ej. contacto@empresa.com`
  4. **Ubicación del predio (`label`):** `Municipio y Departamento del Predio *`
     - *Placeholder:* `Ej. Bogotá D.C. / Chía, Cundinamarca`
  5. **Servicio requerido (`label` - `<select>`):** `Especialidad requerida *`
     - *Opciones del selector:*
       - `Seleccione el servicio de su interés...`
       - `Avalúos Comerciales (Urbanos / Rurales - Res. 941 de 2026)`
       - `Topografía GNSS/RTK, Fotogrametría con Dron y SIG`
       - `Trámites Prediales y Gestión Catastral (Res. Conjunta 1101, Linderos, Englobes)`
       - `Legalización de Construcciones y Consultoría POT / Curadurías`
       - `Consultoría Integral / Otro requerimiento predial`
  6. **Descripción del caso (`label` - `<textarea>`):** `Detalles técnicos del predio o requerimiento *`
     - *Placeholder:* `Indique brevemente el área aproximada, número de matrícula inmobiliaria o cédula catastral (opcional) y el objetivo de su trámite o estudio.`
- **Texto de Privacidad / Habeas Data:**
  `Al enviar esta solicitud, autoriza el tratamiento confidencial de sus datos conforme a la Ley 1581 de 2012, exclusivamente para fines de cotización y asesoría técnica por parte de INGEOPREDIAL S.A.S.`
- **Botón de Envío del Formulario (CTA `--verde-corporativo`):**
  `Enviar Solicitud al Equipo de Ingeniería`

---

### 3.6. Botón Flotante de WhatsApp y Pie de Página (`<footer>`)

#### Botón Flotante de WhatsApp (`position: fixed`):
- **Enlace sugerido:** `https://wa.me/573106291208?text=Hola%20INGEOPREDIAL%20S.A.S.,%20solicito%20asesor%C3%ADa%20t%C3%A9cnica%20sobre%20un%20servicio%20predial.`
- **Texto visible / Tooltip:** `Asesoría en línea`
- **Atributo `aria-label`:** `Contactar a un ingeniero catastral de INGEOPREDIAL S.A.S. por WhatsApp`

#### Pie de Página (`<footer>`):
- **Resumen Institucional junto al Logo:**
  `**INGEOPREDIAL S.A.S.** — Firma especializada de ingenieros catastrales y geodestas. Brindamos seguridad jurídica, precisión topográfica y rigor valuatorio en Bogotá D.C. y en todo el territorio nacional colombiano.`
- **Resumen de Contacto en Footer:**
  - `Ubicación: Bogotá D.C., Colombia — Cobertura a Nivel Nacional`
  - `Líneas Directivas: 310-629-1208 | 322-738-9449 | 312-533-8045`
- **Declaración Legal de Derechos Reservados:**
  `© 2026 INGEOPREDIAL S.A.S. Todos los derechos reservados. Ingeniería Catastral, Geodesia, Avalúos Comerciales y Gestión Predial en Colombia.`
