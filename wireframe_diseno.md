# Especificación de Diseño UI/UX y Arquitectura Semántica (Wireframe v2.0 — Rediseño Rico en Imágenes) — INGEOPREDIAL S.A.S.

> **Documento Oficial del Agente Diseñador UI/UX (`disenador`)**  
> Arquitectura de información, diagnóstico de densidad visual, jerarquía Mobile-First, sistema de tokens CSS3, catálogo ampliado de activos fotográficos e implementación semántica HTML5 alineada estrictamente con `directrices.md` y `copywriting.md`.

---

## 0. Diagnóstico UX/UI: ¿Por qué la versión anterior se percibía cargada de texto?

Tras auditar la primera iteración del sitio a partir del feedback del usuario (*"siento que a la página le hacen falta más imágenes, me gusta, pero siento que se ve como si todo fuera texto"*), se identificaron **4 causas estructurales de fatiga visual**:

1. **Baja proporción Imagen vs. Texto (Ratio 15/85):** Toda la página contaba únicamente con **2 fotografías visibles** (una oculta tras el overlay oscuro del Hero al 78% y una sola imagen lateral en `#nosotros`). El 85% restante del scroll vertical consistía en bloques tipográficos extensos.
2. **Hero Section plano en pantallas grandes:** Aunque existía una imagen de fondo con overlay `--azul-corporativo`, la ausencia de una imagen nítida en primer plano (Split Hero) hacía que la primera pantalla se percibiera como un cartel de solo texto.
3. **Tarjetas de Servicios (`#servicios`) con efecto "Muro de Texto":** Las 4 tarjetas carecían de apoyo fotográfico superior y acumulaban simultáneamente etiqueta normativa, título `<h3>`, un párrafo denso de 45+ palabras y una lista de 3 a 4 viñetas largas.
4. **Ausencia de pausa visual entre Servicios y Contacto:** Pasar directamente de 4 tarjetas llenas de texto técnico a un formulario de 6 campos con bloques informativos saturaba la lectura sin mostrar la **operación real en campo** (equipos GNSS/RTK, vuelos de dron RPAS, cartografía SIG y dictámenes valuatorios).

### Solución de Rediseño Visual (v2.0 — Equilibrio 50% Visual / 50% Técnico):
- **Split Hero con Tarjeta Fotográfica Nítida Lateral:** Mantiene el fondo inmersivo con overlay `--azul-corporativo` (78%), pero añade a la derecha una composición fotográfica nítida de operación geodésica con *badges* flotantes de telemetría y normativa (`Precisión RTK`, `Normativa IGAC 2026`).
- **Collage Técnico de Doble Imagen + Métricas Visuales en `#nosotros`:** Sustituye la imagen única por una composición superpuesta (planos catastrales + levantamiento GNSS en campo) acompañada de **3 tarjetas de métricas de impacto visual** (`100% Cumplimiento IGAC/SNR`, `Cobertura Nacional`, `3 Directores Ingenieros Catastrales y Geodestas`).
- **Tarjetas de Servicios (`#servicios`) con Cabecera Fotográfica + Badge SVG Flotante + Chips Escaneables:** Cada tarjeta incorpora un header fotográfico de `210px` de alto (`./assets/images/servicio-avaluos.png`, `servicio-topografia.png`, `servicio-catastro.png`, `servicio-legalizacion.png`), conserva el ícono vectorial minimalista SVG en `--verde-corporativo` dentro de un badge flotante sobre la esquina de la foto, y sintetiza los alcances mediante **chips/etiquetas visuales** limpias y escaneables.
- **Nueva Sección Galería Bento Grid (`#galeria` — "Tecnología y Operación en Campo"):** Un mosaico visual de 4 fotografías técnicas de alto impacto con leyendas breves sobre gradiente `--azul-corporativo` ubicado estratégicamente entre `#servicios` y `#contacto`.

---

## 1. Sistema de Diseño y Tokens Visuales (CSS3 Custom Properties)

El rediseño preserva de forma **estricta e inalterable** las 4 variables corporativas oficiales en `:root`, complementándolas con tokens para contenedores multimedia, superposiciones fotográficas y etiquetas tipo *chip*:

```css
:root {
  /* Paleta Corporativa Estricta (Obligatoria por Directrices) */
  --blanco-fondo: #ffffff;       /* Fondo principal de la página, tarjetas y textos sobre fondos oscuros */
  --gris-claro: #f4f7f6;         /* Alternancia de fondo en secciones (#nosotros, #contacto) y chips técnicos */
  --azul-corporativo: #0d2b45;   /* Títulos (h1-h4), textos principales, Header, Overlays y Footer */
  --verde-corporativo: #2d8a39;  /* Exclusivo para botones CTA, íconos SVG de servicios, badges y acentos */

  /* Variaciones Funcionales Derivadas (Transparencias de la misma paleta oficial) */
  --azul-overlay-hero: rgba(13, 43, 69, 0.78);      /* Overlay de Hero Section entre 75% y 80% de opacidad */
  --azul-gradiente-bento: linear-gradient(180deg, rgba(13, 43, 69, 0.08) 0%, rgba(13, 43, 69, 0.90) 100%);
  --azul-gradiente-card: linear-gradient(180deg, rgba(13, 43, 69, 0.05) 0%, rgba(13, 43, 69, 0.55) 100%);
  --azul-texto-secundario: rgba(13, 43, 69, 0.82);  /* Párrafos de cuerpo para lectura descansada */
  --azul-borde-sutil: rgba(13, 43, 69, 0.12);       /* Bordes de tarjetas, chips e inputs */
  --verde-acento-suave: rgba(45, 138, 57, 0.10);    /* Fondo tenue para chips y badges normativos */
  --verde-hover: #236e2d;                           /* Estado :hover / :focus para botones en --verde-corporativo */

  /* Tipografía, Dimensiones y Sombras */
  --font-principal: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-titulos: 'Montserrat', 'Inter', sans-serif;
  --max-width-container: 1240px;
  --header-height-mobile: 72px;
  --header-height-desktop: 84px;
  --border-radius-card: 14px;
  --border-radius-media: 12px;
  --border-radius-chip: 999px;
  --border-radius-btn: 8px;
  --shadow-card: 0 8px 28px rgba(13, 43, 69, 0.08);
  --shadow-card-hover: 0 16px 38px rgba(13, 43, 69, 0.15);
  --shadow-floating-badge: 0 10px 25px rgba(13, 43, 69, 0.22);
  --transition-base: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Alternancia Cromática y Ritmo Visual de Secciones
1. `<header>`: Fondo `--blanco-fondo` (`#ffffff`) Sticky con sombra sutil.
2. `<section id="inicio">` (**Split Hero**): Fondo fotográfico con overlay `--azul-corporativo` al 78% + **Tarjeta Fotográfica Destacada Lateral** a todo color con indicadores técnicos flotantes.
3. `<section id="nosotros">` (**Collage + Métricas**): Fondo `--gris-claro` (`#f4f7f6`), composición de **doble imagen** a la derecha y barra de **3 tarjetas de métricas visuales**.
4. `<section id="servicios">` (**Cards Fotográficas + SVG Flotante + Chips**): Fondo `--blanco-fondo` (`#ffffff`), cuadrícula 2x2 de tarjetas con cabecera fotográfica (`210px`), badge flotante con ícono SVG en `--verde-corporativo` y síntesis por chips.
5. `<section id="galeria">` (**Bento Grid "Tecnología y Operación en Campo"**): Fondo `--blanco-fondo` con contenedor envolvente en `--gris-claro` o transición limpia hacia un **mosaico Bento de 4 fotografías técnicas** con leyendas superpuestas en gradiente `--azul-corporativo`.
6. `<section id="contacto">`: Fondo `--gris-claro` (`#f4f7f6`), tarjetas informativas directivas y formulario en `--blanco-fondo` (`#ffffff`).
7. `<footer>`: Fondo `--azul-corporativo` (`#0d2b45`), textos en `--blanco-fondo` (`#ffffff`) y acentos en `--verde-corporativo` (`#2d8a39`).

---

## 2. Catálogo Ampliado de Activos Visuales (11 Imágenes Técnicas + Logo Transparente)

Para eliminar la sensación de "página de solo texto", el sitio pasa de 2 a **11 activos fotográficos técnicos** distribuidos estratégicamente. Se especifican tanto las rutas locales en `./assets/images/` como las URLs de alta resolución de Unsplash (estrictamente sobre `topography`, `surveying`, `GNSS`, `blueprints`, `real estate` y `drone mapping`) para que el Agente Desarrollador descargue o vincule los archivos locales garantizando carga al 100%:

| # | Activo Visual | Ubicación en DOM | Ruta Local Obligatoria (`./assets/images/...`) | Fuente Fotográfica Técnica (Unsplash Fallback / Origen) | Atributo `alt` Técnico y SEO |
| :- | :--- | :--- | :--- | :--- | :--- |
| **0** | **Logo Corporativo (Header, Footer, Favicon)** | `<header>`, `<footer>`, `<head>` | `./assets/images/logo-ingeopredial.png` *(con respaldo `.svg`)* | Activo local oficial PNG RGBA (`398×412 px`, fondo 100% transparente) | `"Logo oficial de INGEOPREDIAL S.A.S. - Firma de Ingenieros Catastrales y Geodestas en Colombia"` |
| **1** | **Fondo Hero Section (`#inicio`)** | `.hero-bg-wrapper img` | `./assets/images/hero-topografia-bg.jpg` *(o URL directa)* | `https://images.unsplash.com/photo-1541888946425-d09bb18086f6?auto=format&fit=crop&w=1920&q=85` | `"Ingenieros catastrales y geodestas ejecutando levantamientos topográficos de alta precisión con equipos GNSS RTK y fotogrametría con dron en Colombia"` |
| **2** | **Imagen Destacada Lateral Hero (Split Hero Desktop)** | `.hero-visual-showcase img` | `./assets/images/hero-gnss-destacada.jpg` *(o `./assets/images/servicio-topografia.png`)* | `https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=85` | `"Operación de receptor geodésico GNSS RTK de precisión milimétrica y control topográfico en campo por INGEOPREDIAL S.A.S."` |
| **3** | **Nosotros — Imagen Principal (Planos / Ingeniería)** | `.about-collage-primary img` | `./assets/images/nosotros-planos-catastro.jpg` *(o URL directa)* | `https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=85` | `"Equipo directivo de ingenieros catastrales y geodestas analizando cartografía predial, planos topográficos y estudios de títulos para seguridad jurídica territorial"` |
| **4** | **Nosotros — Imagen Secundaria (Campo / Geodesia)** | `.about-collage-secondary img` | `./assets/images/nosotros-operacion-campo.jpg` *(o URL directa)* | `https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=85` | `"Ingenieros geodestas realizando verificación técnica de linderos y control geodésico en terreno colombiano"` |
| **5** | **Tarjeta Servicio 1: Avalúos (`#servicio-avaluos`)** | `.service-card-media img` | `./assets/images/servicio-avaluos.png` | `https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=85` | `"Avalúos comerciales de inmuebles urbanos, rurales e industriales en Colombia bajo normatividad IGAC y Resolución 941 de 2026"` |
| **6** | **Tarjeta Servicio 2: Topografía (`#servicio-topografia`)** | `.service-card-media img` | `./assets/images/servicio-topografia.png` | `https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=85` | `"Levantamientos topográficos de alta precisión con equipos GNSS RTK, fotogrametría con dron RPAS y cartografía SIG"` |
| **7** | **Tarjeta Servicio 3: Trámites Prediales (`#servicio-tramites-prediales`)** | `.service-card-media img` | `./assets/images/servicio-catastro.png` | `https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=900&q=85` | `"Cartografía catastral, actualización de linderos y trámites prediales bajo Resolución Conjunta 1101 IGAC SNR"` |
| **8** | **Tarjeta Servicio 4: Legalización (`#servicio-legalizacion`)** | `.service-card-media img` | `./assets/images/servicio-legalizacion.png` | `https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=85` | `"Planos arquitectónicos, legalización de construcciones y consultoría normativa POT ante Curadurías Urbanas"` |
| **9** | **Bento Grid 1: Operación GNSS/RTK (`#galeria`)** | `.bento-item-gnss img` | `./assets/images/galeria-gnss.jpg` *(o reutilizar activo de campo de alta resolución)* | `https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=85` | `"Operación en campo con receptores satelitales GNSS RTK de precisión milimétrica amarrados a la red MAGNA-SIRGAS"` |
| **10** | **Bento Grid 2: Fotogrametría con Dron RPAS (`#galeria`)** | `.bento-item-dron img` | `./assets/images/galeria-dron.jpg` | `https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1000&q=85` | `"Mapeo aerofotogramétrico con dron RPAS y generación de Modelos Digitales de Terreno para topografía rural y urbana"` |
| **11** | **Bento Grid 3: Cartografía Catastral y SIG (`#galeria`)** | `.bento-item-sig img` | `./assets/images/galeria-sig.jpg` | `https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=900&q=85` *(o `photo-1524661135-423995f22d0b`)* | `"Análisis espacial en Sistemas de Información Geográfica SIG y cartografía predial bajo Resolución Conjunta 1101"` |
| **12** | **Bento Grid 4: Avalúos Urbanos, Rurales e Industriales (`#galeria`)** | `.bento-item-avaluos img` | `./assets/images/galeria-avaluos.jpg` | `https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=85` | `"Inspección técnica para avalúos comerciales urbanos, rurales e industriales bajo Resolución 941 de 2026 del IGAC"` |

---

## 3. Wireframe Esquemático Actualizado (v2.0 — Rico en Imágenes)

### 3.1. Vista Mobile (`< 768px` — 1 Columna, Tarjetas Fotográficas y Bento Apilado)
```text
+----------------------------------------------------+
| [LOGO INGEOPREDIAL]                          [ ☰ ] | <-- <header> Sticky (72px)
+----------------------------------------------------+
| [BADGE: INGENIERÍA CATASTRAL, GEODESIA...]         | <-- #inicio (Overlay Azul 78%)
| H1: Seguridad Jurídica y Precisión Técnica...      |
| P: Respaldamos sus decisiones de inversión...      |
| [ Solicitar Asesoría (--verde) ] [ Ver Servicios ] |
| +------------------------------------------------+ |
| | [ FOTO DESTACADA HERO: Operación GNSS/RTK ]    | | <-- Imagen nítida en primer plano
| | [Badge: Precisión RTK] [Badge: Res. 941 / 2026]| |
| +------------------------------------------------+ |
| | ★ Pill Acceso Rápido 1: Avalúos Comerciales →  | |
| | ★ Pill Acceso Rápido 2: Topografía GNSS/RTK →  | |
| +------------------------------------------------+ |
+----------------------------------------------------+
| EYEBROW: RESPALDO INSTITUCIONAL                    | <-- #nosotros (Fondo --gris-claro)
| H2: Autoridad Técnica Liderada por 3 Ingenieros    |
| +------------------------------------------------+ |
| | [ COLLAGE DOBLE IMAGEN: Planos + Campo GNSS ]  | | <-- Collage visual de 2 fotos
| +------------------------------------------------+ |
| | [100% IGAC/SNR] [Cobertura Nal] [3 Directores] | | <-- Tarjetas de métricas visuales
| +------------------------------------------------+ |
| P síntesis + 3 Pilares con iconos de verificación  |
+----------------------------------------------------+
| EYEBROW: SOLUCIONES INTEGRALES                     | <-- #servicios (Fondo --blanco-fondo)
| H2: Nuestro Portafolio Especializado               |
| +------------------------------------------------+ |
| | [ FOTO CABECERA: ./assets/images/servicio-...] | | <-- Foto técnica superior (210px)
| |                              (( [SVG Verde] )) | | <-- Badge flotante con SVG oficial
| | H3: Avalúos Comerciales, Urbanos y Rurales     | |
| | [Chip: Urbano/Rural] [Chip: Res. 941] [NIIF]   | | <-- Chips escaneables (menos texto)
| | Descripción concisa + [ Cotizar Avalúo → ]     | |
| +------------------------------------------------+ |
| (Se repite para Topografía, Catastro y Legaliz.)   |
+----------------------------------------------------+
| EYEBROW: TECNOLOGÍA Y OPERACIÓN EN CAMPO           | <-- #galeria (NUEVO Bento Grid)
| H2: Ingeniería Geoespacial en Acción               |
| +------------------------------------------------+ |
| | [FOTO 1: Operación GNSS/RTK Milimétrica]       | |
| | [FOTO 2: Fotogrametría con Dron RPAS y MDT]    | |
| | [FOTO 3: Cartografía Catastral y SIG (1101)]   | |
| | [FOTO 4: Avalúos Urbanos y Rurales (Res. 941)] | |
| +------------------------------------------------+ |
+----------------------------------------------------+
| #contacto (Info Directiva + Formulario 6 campos)   |
+----------------------------------------------------+
| <footer> (Logo + Especialidades + Teléfonos)       |
+----------------------------------------------------+
```

### 3.2. Vista Desktop (`>= 1024px` — Split Hero, Collage Doble, Cards Fotográficas 2x2 y Bento Grid)
```text
+------------------------------------------------------------------------------------------------------+
| [LOGO INGEOPREDIAL S.A.S.]            Inicio   Nosotros   Servicios   Galería   Contacto  [Cotizar]  |
+------------------------------------------------------------------------------------------------------+
| #inicio (SPLIT HERO 7 cols / 5 cols sobre Fondo con Overlay --azul-corporativo 78%)                  |
|                                                                                                      |
|  [BADGE INSTITUCIONAL]                                 +------------------------------------------+  |
|  H1: Seguridad Jurídica y Precisión Técnica            | [Badge: Precisión Milimétrica GNSS/RTK]  |  |
|      para su Patrimonio Inmobiliario...                |                                          |  |
|  Subtítulo profesional conciso...                      |      [ FOTOGRAFÍA NÍTIDA EN CAMPO:       |  |
|                                                        |        INGENIERO GEODESTA CON RTK ]      |  |
|  [ Solicitar Asesoría (Verde) ] [ Explorar Servicios ] |                                          |  |
|                                                        | [Badge: Normativa IGAC • Res. 941 2026]  |  |
|  +------------------------+ +------------------------+ +------------------------------------------+  |
|  | ★ Avalúos Comerciales  | | ★ Topografía GNSS/RTK  |                                               |
|  |   Ver alcance →        | |   Ver alcance →        |  ✓ 3 Ing. Catastrales | ✓ IGAC & SNR | ✓ Nal. |
|  +------------------------+ +------------------------+                                               |
+------------------------------------------------------------------------------------------------------+
| #nosotros (Grid 12 cols: 6 cols Narrativa + 3 Pilares / 6 cols Collage Doble Imagen + 3 KPIs)        |
|  +-----------------------------------------------+   +--------------------------------------------+  |
|  | H2: Autoridad Técnica Liderada por Ingenieros |   | [ FOTO 1: Planos e Ingeniería Catastral ]  |  |
|  | Párrafos institucionales...                   |   |          +-------------------------------+ |  |
|  | [01 Rigor Geodésico] [02 Blindaje Registral]  |   |          | [ FOTO 2: Trabajo Campo GNSS ]| |  |
|  | [03 Cobertura Nacional Multipropósito]        |   |          +-------------------------------+ |  |
|  +-----------------------------------------------+   | [100% IGAC/SNR] [Nacional] [3 Directores]  |  |
|                                                      +--------------------------------------------+  |
+------------------------------------------------------------------------------------------------------+
| #servicios (Grid 2x2 de Tarjetas con Cabecera Fotográfica + Ícono SVG Flotante + Chips Visuales)     |
|  +-----------------------------------------------+   +--------------------------------------------+  |
|  | [ FOTO: ./assets/images/servicio-avaluos.png ]|   | [ FOTO: ./assets/images/servicio-topo.png ]|  |
|  | [Tag: IGAC • Res. 941]         (( SVG Verde ))|   | [Tag: GNSS/RTK • Dron]      (( SVG Verde ))|  |
|  | H3: Avalúos Comerciales, Urbanos y Rurales    |   | H3: Topografía de Precisión, Dron y SIG    |  |
|  | Párrafo ejecutivo conciso...                  |   | Párrafo ejecutivo conciso...               |  |
|  | [Chip: Inmuebles Urbanos] [Chip: Predios Rur.]|   | [Chip: Georreferenciación RTK] [Chip: RPAS]|  |
|  | [Chip: Indemnizaciones & NIIF]                |   | [Chip: Ortofotos y MDT] [Chip: SIG]        |  |
|  | Cotizar Avalúo Técnico →                      |   | Solicitar Levantamiento →                  |  |
|  +-----------------------------------------------+   +--------------------------------------------+  |
|  | [ FOTO: ./assets/images/servicio-catastro.png]|   | [ FOTO: ./assets/images/servicio-legal.png]|  |
|  | (Trámites Prediales y Gestión Catastral 1101) |   | (Legalización Urbanística y Consultoría)   |  |
|  +-----------------------------------------------+   +--------------------------------------------+  |
+------------------------------------------------------------------------------------------------------+
| #galeria (NUEVA SECCIÓN: Bento Grid Asimétrico de 4 Fotografías con Gradiente --azul-corporativo)    |
|  +-----------------------------------------------+   +--------------------+  +--------------------+  |
|  | [ BENTO 1 (Grande 6 cols x 2 filas):          |   | [ BENTO 2 (6 cols): |  | (Continuación)     |  |
|  |   Operación GNSS/RTK de Precisión Milimétrica |   |   Fotogrametría     |  |                    |  |
|  |   Amarrada a Red MAGNA-SIRGAS ]               |   |   con Dron (RPAS) ] |  |                    |  |
|  |                                               |   +--------------------+  +--------------------+  |
|  |                                               |   | [ BENTO 3 (3 cols): |  | [ BENTO 4 (3 cols):|  |
|  |                                               |   |   Cartografía SIG   |  |   Avalúos Res. 941 |  |
|  |                                               |   |   Res. 1101 ]       |  |   Urbanos/Rurales ]|  |
|  +-----------------------------------------------+   +--------------------+  +--------------------+  |
+------------------------------------------------------------------------------------------------------+
| #contacto (5 cols Información Directiva + 7 cols Formulario) + <footer> + Botón Flotante WhatsApp    |
+------------------------------------------------------------------------------------------------------+
```

---

## 4. Especificación Semántica Detallada por Sección (HTML5 + Reglas UI/UX)

### 4.1. Encabezado (`<header class="site-header">`)
Se mantiene el Sticky Header en `--blanco-fondo` con el logo transparente `./assets/images/logo-ingeopredial.png` a la izquierda y se agrega el enlace opcional `Galería` (`#galeria`) o se conserva la navegación limpia (`Inicio`, `Nosotros`, `Servicios`, `Tecnología`, `Contacto`) junto al CTA `Solicitar Cotización`.

---

### 4.2. Hero Section (`#inicio`) con Imagen Destacada Lateral (Split Hero en Desktop)

#### Cambios Clave de UI/UX:
1. **Fondo General + Overlay Corporativo:** Se conserva la imagen de fondo a pantalla completa cubierta por `--azul-overlay-hero` (`rgba(13, 43, 69, 0.78)`) para garantizar contraste AAA del texto blanco.
2. **Columna Derecha Fotográfica (`.hero-visual-col`):** En pantallas `>= 992px`, el Hero se divide en un grid de 12 columnas (`7 columnas` para el bloque editorial y `5 columnas` para una **tarjeta fotográfica flotante de alta nitidez**). En móvil se muestra debajo de los botones CTA principales.
3. **Indicadores Técnicos Flotantes (`.hero-floating-badge`):** Sobre el marco fotográfico derecho se superponen dos píldoras técnicas con estética de instrumentación geodésica:
   - **Superior derecha:** Punto indicador verde pulsante + `"Precisión GNSS/RTK Milimétrica"`
   - **Inferior izquierda:** Ícono de verificación + `"Normativa IGAC 2026 • Res. 941 & 1101"`

#### Estructura Semántica DOM (`#inicio`):
```html
<section id="inicio" class="hero-section" aria-labelledby="hero-title">
  <!-- Fondo general con overlay --azul-corporativo al 78% -->
  <div class="hero-bg-wrapper">
    <img src="./assets/images/servicio-topografia.png" 
         alt="Ingenieros catastrales y geodestas ejecutando levantamientos topográficos de alta precisión con equipos GNSS RTK y fotogrametría con dron en Colombia" 
         class="hero-bg-image" fetchpriority="high">
    <div class="hero-overlay"></div>
  </div>

  <div class="container hero-container">
    <!-- Layout Split Hero (Texto Izquierda / Imagen Nítida Derecha) -->
    <div class="hero-split-grid">
      <div class="hero-content">
        <span class="eyebrow-badge">INGENIERÍA CATASTRAL, GEODESIA Y CONSULTORÍA PREDIAL EN COLOMBIA</span>
        <h1 id="hero-title">Seguridad Jurídica y Precisión Técnica para su Patrimonio Inmobiliario y Territorial</h1>
        <p class="hero-subtitle">
          Respaldamos sus decisiones de inversión, infraestructura y saneamiento de la propiedad mediante avalúos comerciales certificados, levantamientos topográficos de alta precisión y gestión integral del territorio bajo estricto cumplimiento de la normatividad IGAC y SNR.
        </p>

        <div class="hero-cta-group">
          <a href="#contacto" class="btn btn-primary btn-lg">Solicitar Asesoría Técnica</a>
          <a href="#servicios" class="btn btn-outline-light btn-lg">Explorar Portafolio de Servicios</a>
        </div>
      </div>

      <!-- NUEVO: Tarjeta Fotográfica Lateral de Alta Nitidez con Telemetría Técnica -->
      <div class="hero-visual-showcase">
        <figure class="hero-featured-frame">
          <img src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=85" 
               alt="Operación de receptor geodésico GNSS RTK de precisión milimétrica y control topográfico en campo por INGEOPREDIAL S.A.S." 
               class="hero-featured-img" width="540" height="440">
          
          <!-- Indicador Flotante 1: Precisión RTK -->
          <div class="hero-floating-badge badge-top-right">
            <span class="status-dot" aria-hidden="true"></span>
            <div>
              <strong>Precisión GNSS/RTK</strong>
              <span>Georreferenciación MAGNA-SIRGAS</span>
            </div>
          </div>

          <!-- Indicador Flotante 2: Normativa IGAC 2026 -->
          <div class="hero-floating-badge badge-bottom-left">
            <span class="badge-icon-check" aria-hidden="true">✓</span>
            <div>
              <strong>Normativa IGAC 2026</strong>
              <span>Res. 941 • Res. Conjunta 1101</span>
            </div>
          </div>
        </figure>
      </div>
    </div>

    <!-- Accesos Directos Destacados en Primera Pantalla: Avalúos y Topografía -->
    <div class="hero-quick-access" aria-label="Accesos directos a servicios principales">
      <article class="quick-card">
        <div class="quick-card-header">
          <span class="quick-icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 14l2 2 4-4"/></svg>
          </span>
          <h2>Avalúos Comerciales (IGAC / Res. 941 de 2026)</h2>
        </div>
        <p>Dictámenes técnicos de valor comercial para predios urbanos, rurales y activos especiales con rigor metodológico y validez oficial.</p>
        <a href="#servicio-avaluos" class="quick-link">Ver alcance en Avalúos →</a>
      </article>

      <article class="quick-card">
        <div class="quick-card-header">
          <span class="quick-icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>
          </span>
          <h2>Topografía GNSS/RTK, Fotogrametría y SIG</h2>
        </div>
        <p>Georreferenciación milimétrica, mapeo aerofotogramétrico con dron (RPAS) y modelamiento cartográfico para proyectos urbanos y rurales.</p>
        <a href="#servicio-topografia" class="quick-link">Ver alcance en Topografía →</a>
      </article>
    </div>

    <!-- Barra de Confianza (Trust Bar) -->
    <ul class="hero-trust-bar" aria-label="Garantías institucionales">
      <li><span class="trust-check">✓</span> Liderado por Ingenieros Catastrales y Geodestas</li>
      <li><span class="trust-check">✓</span> Normatividad Vigente IGAC &amp; SNR</li>
      <li><span class="trust-check">✓</span> Cobertura en Bogotá D.C. y a Nivel Nacional</li>
    </ul>
  </div>
</section>
```

---

### 4.3. Sección Nosotros (`#nosotros`) con Collage de Doble Imagen y Tarjetas de Métricas Visuales

#### Cambios Clave de UI/UX:
1. **Composición de Doble Imagen (`.about-collage`):**
   - **Imagen Principal (`.about-collage-primary`):** Fotografía técnica de análisis de planos catastrales, cartografía e ingeniería (`width: 82%`, alineada arriba a la izquierda, bordes redondeados `14px`).
   - **Imagen Secundaria Superpuesta (`.about-collage-secondary`):** Fotografía de operación en campo con instrumentación geodésica (`width: 58%`, superpuesta en la esquina inferior derecha con un borde grueso `6px solid var(--gris-claro)` y sombra profunda para crear profundidad tridimensional).
2. **Tarjetas de Métricas Visuales (`.about-metrics-grid`):** Tres tarjetas compactas en `--blanco-fondo` con borde de acento izquierdo o superior en `--verde-corporativo` que reemplazan bloques densos y comunican autoridad de un vistazo:
   - **Métrica 1:** `100%` — `Cumplimiento Normativo IGAC / SNR`
   - **Métrica 2:** `Nacional` — `Cobertura Urbana y Rural en Colombia`
   - **Métrica 3:** `3 Directores` — `Ingenieros Catastrales y Geodestas`

#### Estructura Semántica DOM (`#nosotros`):
```html
<section id="nosotros" class="section about-section bg-light" aria-labelledby="about-title">
  <div class="container about-grid">
    <!-- Columna Izquierda: Contenido Institucional y 3 Pilares -->
    <div class="about-content">
      <span class="section-eyebrow">RESPALDO INSTITUCIONAL Y RIGOR CIENTÍFICO</span>
      <h2 id="about-title" class="section-title">Autoridad Técnica Liderada por Ingenieros Catastrales y Geodestas Expertos</h2>
      <p class="about-lead">
        <strong>INGEOPREDIAL S.A.S.</strong> es una firma colombiana de ingeniería y consultoría especializada en la administración, valoración y ordenamiento físico-jurídico del territorio. Nuestra organización está <strong>liderada por un equipo directivo de tres ingenieros catastrales y geodestas expertos</strong>, cuya trayectoria combina el dominio de las ciencias geoespaciales, la valuación inmobiliaria y el derecho registral y catastral.
      </p>
      <p class="about-body">
        Entendemos que cada metro cuadrado y cada línea de lindero representan patrimonio, inversión y viabilidad de proyectos. Por ello, integramos instrumentación geodésica de última generación con un análisis riguroso de los títulos de propiedad y las disposiciones vigentes del Instituto Geográfico Agustín Codazzi (IGAC), la Superintendencia de Notariado y Registro (SNR), los Planes de Ordenamiento Territorial (POT) y las Curadurías Urbanas, garantizando <strong>seguridad jurídica y técnica en todo el territorio colombiano</strong>.
      </p>

      <!-- 3 Pilares de Valor Corporativo -->
      <div class="about-pillars">
        <article class="pillar-item">
          <div class="pillar-marker" aria-hidden="true">01</div>
          <div>
            <h3>Rigor Técnico y Geodésico</h3>
            <p>Aplicación estricta de estándares posicionales MAGNA-SIRGAS, tecnología GNSS/RTK y procesamiento fotogramétrico de alta resolución.</p>
          </div>
        </article>
        <article class="pillar-item">
          <div class="pillar-marker" aria-hidden="true">02</div>
          <div>
            <h3>Blindaje Normativo y Registral</h3>
            <p>Articulación exacta entre la realidad física del terreno, la base catastral y la tradición jurídica en los folios de matrícula inmobiliaria.</p>
          </div>
        </article>
        <article class="pillar-item">
          <div class="pillar-marker" aria-hidden="true">03</div>
          <div>
            <h3>Cobertura Nacional Multipropósito</h3>
            <p>Capacidad operativa en Bogotá D.C. y despliegue técnico en zonas urbanas, suburbanas y rurales de cualquier departamento del país.</p>
          </div>
        </article>
      </div>
    </div>

    <!-- Columna Derecha: Collage Técnico de Doble Imagen + 3 Tarjetas de Métricas Visuales -->
    <div class="about-visual-column">
      <div class="about-collage" role="group" aria-label="Registro visual de ingeniería de gabinete y operación geodésica en campo">
        <!-- Imagen Principal: Planos / Ingeniería Catastral -->
        <figure class="about-collage-primary">
          <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=85" 
               alt="Equipo directivo de ingenieros catastrales y geodestas analizando cartografía predial, planos topográficos y estudios de títulos para seguridad jurídica territorial" 
               loading="lazy" width="520" height="400">
          <span class="collage-tag">Gabinete Técnico &amp; Cartografía</span>
        </figure>

        <!-- Imagen Secundaria Superpuesta: Trabajo en Campo con Equipo Geodésico -->
        <figure class="about-collage-secondary">
          <img src="./assets/images/servicio-topografia.png" 
               alt="Ingenieros geodestas ejecutando levantamiento en campo con equipo GNSS RTK de alta precisión" 
               loading="lazy" width="340" height="250">
          <span class="collage-tag collage-tag-green">Operación Geodésica en Campo</span>
        </figure>
      </div>

      <!-- Tarjetas de Métricas Visuales (KPI Cards) -->
      <div class="about-metrics-grid" aria-label="Indicadores de respaldo institucional">
        <div class="metric-card">
          <strong class="metric-value">100%</strong>
          <span class="metric-label">Cumplimiento IGAC / SNR</span>
        </div>
        <div class="metric-card">
          <strong class="metric-value">Nacional</strong>
          <span class="metric-label">Cobertura en Colombia</span>
        </div>
        <div class="metric-card">
          <strong class="metric-value">3 Directores</strong>
          <span class="metric-label">Ing. Catastrales y Geodestas</span>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

### 4.4. Sección Servicios (`#servicios`) con Cabecera Fotográfica + Ícono SVG Flotante + Chips Escaneables

#### Cambios Clave de UI/UX:
1. **Cabecera Fotográfica de Alto Impacto (`.service-card-media`):**
   - Cada una de las 4 tarjetas incorpora en su parte superior un contenedor de imagen de `210px` de altura con `overflow: hidden` y efecto de zoom sutil (`transform: scale(1.05)`) al hacer `:hover` sobre la tarjeta.
   - Rutas obligatorias de las 4 imágenes locales:
     - Pilar 1 (`#servicio-avaluos`): `./assets/images/servicio-avaluos.png`
     - Pilar 2 (`#servicio-topografia`): `./assets/images/servicio-topografia.png`
     - Pilar 3 (`#servicio-tramites-prediales`): `./assets/images/servicio-catastro.png`
     - Pilar 4 (`#servicio-legalizacion`): `./assets/images/servicio-legalizacion.png`
2. **Badge Flotante con Ícono Vectorial SVG en `--verde-corporativo` (`.service-icon-floating`):**
   - Posicionado en la intersección entre la fotografía superior y el cuerpo de la tarjeta (`position: absolute; bottom: -24px; right: 24px; width: 56px; height: 56px; background: var(--blanco-fondo); border-radius: 12px; box-shadow: var(--shadow-floating-badge); border: 2px solid var(--verde-corporativo);`).
   - Contiene los **4 íconos vectoriales SVG minimalistas** renderizados en `stroke: var(--verde-corporativo)`.
3. **Síntesis Visual mediante "Chips" / Etiquetas Escaneables (`.service-chips`):**
   - Para erradicar la sensación de "muro de texto", las listas extensas se transforman en una combinación de **chips técnicos interactivos** (píldoras con check verde `✓`) y puntos clave concisos de lectura rápida (< 1 segundo por chip).

#### Estructura Semántica DOM (`#servicios`):
```html
<section id="servicios" class="section services-section" aria-labelledby="services-title">
  <div class="container">
    <header class="section-header text-center">
      <span class="section-eyebrow">SOLUCIONES INTEGRALES EN INGENIERÍA DEL TERRITORIO</span>
      <h2 id="services-title" class="section-title">Nuestro Portafolio Especializado de Servicios</h2>
      <p class="section-description">
        Ejecutamos estudios, dictámenes y trámites técnicos con trazabilidad documental y precisión certificada, estructurados en cuatro líneas estratégicas de actuación predial:
      </p>
    </header>

    <div class="services-grid">
      <!-- TARJETA 1: AVALÚOS -->
      <article id="servicio-avaluos" class="service-card">
        <div class="service-card-media">
          <img src="./assets/images/servicio-avaluos.png" 
               alt="Avalúos comerciales de inmuebles urbanos, rurales e industriales en Colombia bajo normatividad IGAC y Resolución 941 de 2026" 
               loading="lazy" width="600" height="240">
          <div class="service-media-overlay"></div>
          <span class="service-norm-tag">Normatividad IGAC • Resolución 941 de 2026</span>
          <div class="service-icon-box service-icon-floating">
            <svg class="service-icon-svg" role="img" aria-label="Ícono de avalúos comerciales urbanos y rurales bajo normativa IGAC" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--verde-corporativo)" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 9h6"/><path d="M9 13h6"/><path d="M9 17l2 2 4-4"/>
            </svg>
          </div>
        </div>

        <div class="service-card-body">
          <h3 class="service-card-title">Avalúos Comerciales, Urbanos y Rurales</h3>
          <p class="service-card-desc">
            Dictámenes valuatorios objetivos y sustentados estadísticamente para determinar el valor comercial real de inmuebles urbanos, rurales e industriales bajo metodologías del <strong>IGAC</strong> y la <strong>Resolución 941 de 2026</strong>.
          </p>

          <!-- Síntesis Visual mediante Chips Técnicos Escaneables -->
          <ul class="service-chips" aria-label="Alcances en Avalúos">
            <li class="service-chip"><span class="chip-dot">✓</span> Inmuebles Urbanos y Lotes</li>
            <li class="service-chip"><span class="chip-dot">✓</span> Predios Rurales y Agropecuarios</li>
            <li class="service-chip"><span class="chip-dot">✓</span> Activos Industriales y NIIF</li>
            <li class="service-chip"><span class="chip-dot">✓</span> Indemnizaciones y Servidumbres</li>
          </ul>

          <a href="#contacto" class="service-card-cta">Cotizar Avalúo Técnico →</a>
        </div>
      </article>

      <!-- TARJETA 2: TOPOGRAFÍA -->
      <article id="servicio-topografia" class="service-card">
        <div class="service-card-media">
          <img src="./assets/images/servicio-topografia.png" 
               alt="Levantamientos topográficos de alta precisión con equipos GNSS RTK, fotogrametría con dron RPAS y cartografía SIG" 
               loading="lazy" width="600" height="240">
          <div class="service-media-overlay"></div>
          <span class="service-norm-tag">Equipos GNSS/RTK • Dron (RPAS) • Cartografía Digital</span>
          <div class="service-icon-box service-icon-floating">
            <svg class="service-icon-svg" role="img" aria-label="Ícono de levantamientos topográficos con GNSS RTK, dron y SIG" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--verde-corporativo)" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="10" r="3"/><circle cx="12" cy="10" r="7"/><path d="M12 2v2"/><path d="M4 10H2"/><path d="M22 10h-2"/><path d="M12 17v5"/><path d="M8 22l4-5 4 5"/>
            </svg>
          </div>
        </div>

        <div class="service-card-body">
          <h3 class="service-card-title">Topografía de Precisión, Fotogrametría y SIG</h3>
          <p class="service-card-desc">
            Ejecución de <strong>levantamientos topográficos</strong> urbanos y rurales amarrados a la red geodésica nacional con receptores <strong>GNSS/RTK</strong>, captura aerofotogramétrica con <strong>dron (RPAS)</strong> y bases de datos en <strong>SIG</strong>.
          </p>

          <ul class="service-chips" aria-label="Alcances en Topografía">
            <li class="service-chip"><span class="chip-dot">✓</span> Georreferenciación GNSS/RTK</li>
            <li class="service-chip"><span class="chip-dot">✓</span> Fotogrametría Dron (RPAS)</li>
            <li class="service-chip"><span class="chip-dot">✓</span> Ortofotomosaicos y MDT/MDS</li>
            <li class="service-chip"><span class="chip-dot">✓</span> Cartografía Oficial y SIG</li>
          </ul>

          <a href="#contacto" class="service-card-cta">Solicitar Levantamiento →</a>
        </div>
      </article>

      <!-- TARJETA 3: TRÁMITES PREDIALES Y GESTIÓN CATASTRAL -->
      <article id="servicio-tramites-prediales" class="service-card">
        <div class="service-card-media">
          <img src="./assets/images/servicio-catastro.png" 
               alt="Cartografía catastral, actualización de linderos y trámites prediales bajo Resolución Conjunta 1101 IGAC SNR" 
               loading="lazy" width="600" height="240">
          <div class="service-media-overlay"></div>
          <span class="service-norm-tag">Resolución Conjunta 1101 (IGAC - SNR) • Saneamiento</span>
          <div class="service-icon-box service-icon-floating">
            <svg class="service-icon-svg" role="img" aria-label="Ícono de trámites prediales, gestión catastral y Resolución Conjunta 1101" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--verde-corporativo)" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
            </svg>
          </div>
        </div>

        <div class="service-card-body">
          <h3 class="service-card-title">Trámites Prediales y Gestión Catastral</h3>
          <p class="service-card-desc">
            Gestión integral ante gestores catastrales, notarías y Registro de Instrumentos Públicos para armonizar la realidad física y jurídica del predio bajo la <strong>Resolución Conjunta 1101</strong>.
          </p>

          <ul class="service-chips" aria-label="Alcances en Trámites Prediales">
            <li class="service-chip"><span class="chip-dot">✓</span> Rectificación Áreas y Linderos (1101)</li>
            <li class="service-chip"><span class="chip-dot">✓</span> Englobes, Desenglobes y Loteos</li>
            <li class="service-chip"><span class="chip-dot">✓</span> Deslindes y Servidumbres</li>
            <li class="service-chip"><span class="chip-dot">✓</span> Estudios Técnicos de Títulos</li>
          </ul>

          <a href="#contacto" class="service-card-cta">Iniciar Trámite Predial →</a>
        </div>
      </article>

      <!-- TARJETA 4: LEGALIZACIÓN Y CONSULTORÍA -->
      <article id="servicio-legalizacion" class="service-card">
        <div class="service-card-media">
          <img src="./assets/images/servicio-legalizacion.png" 
               alt="Planos arquitectónicos, legalización de construcciones y consultoría normativa POT ante Curadurías Urbanas" 
               loading="lazy" width="600" height="240">
          <div class="service-media-overlay"></div>
          <span class="service-norm-tag">Normativa POT • Curadurías Urbanas • Viabilidad</span>
          <div class="service-icon-box service-icon-floating">
            <svg class="service-icon-svg" role="img" aria-label="Ícono de legalización de construcciones y consultoría normativa POT" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--verde-corporativo)" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15l2 2 4-4"/>
            </svg>
          </div>
        </div>

        <div class="service-card-body">
          <h3 class="service-card-title">Legalización Urbanística y Consultoría Técnica</h3>
          <p class="service-card-desc">
            Asesoría especializada para la regularización de desarrollos constructivos, diagnóstico de matrículas inmobiliarias, análisis de determinantes del <strong>POT</strong> y expedientes ante <strong>Curadurías Urbanas</strong>.
          </p>

          <ul class="service-chips" aria-label="Alcances en Legalización">
            <li class="service-chip"><span class="chip-dot">✓</span> Legalización de Construcciones</li>
            <li class="service-chip"><span class="chip-dot">✓</span> Consultoría Normativa POT</li>
            <li class="service-chip"><span class="chip-dot">✓</span> Diagnóstico de Matrículas</li>
            <li class="service-chip"><span class="chip-dot">✓</span> Análisis Estructural Básico</li>
          </ul>

          <a href="#contacto" class="service-card-cta">Consultar Viabilidad →</a>
        </div>
      </article>
    </div>
  </div>
</section>
```

---

### 4.5. NUEVA Sección Visual / Galería Bento Grid: "Tecnología y Operación en Campo" (`#galeria`)

#### Objetivo de Diseño UI/UX:
Ubicada entre `#servicios` y `#contacto`, esta sección rompe la monotonía textual mediante un **Mosaico Visual Bento Grid de 4 fotografías técnicas** con leyendas cortas superpuestas sobre un degradado en `--azul-corporativo` (`linear-gradient(180deg, rgba(13, 43, 69, 0.05) 0%, rgba(13, 43, 69, 0.92) 100%)`) y etiquetas superiores en `--verde-corporativo`.

#### Los 4 Bloques del Bento Grid:
1. **Item 1 (Destacado vertical/ancho):** **Operación GNSS/RTK de Precisión Milimétrica** — Georreferenciación satelital de doble frecuencia amarrada a la red geodésica nacional MAGNA-SIRGAS.
2. **Item 2 (Horizontal superior derecho):** **Fotogrametría con Dron (RPAS) y Modelos Digitales de Terreno** — Ortofotomosaicos de alta resolución, nubes de puntos densas y curvas de nivel.
3. **Item 3 (Cuadrado inferior central):** **Cartografía Catastral y SIG (Resolución Conjunta 1101)** — Modelamiento geoespacial para actualización de cabida y linderos IGAC - SNR.
4. **Item 4 (Cuadrado inferior derecho):** **Avalúos Urbanos, Rurales e Industriales (Resolución 941 de 2026)** — Inspección física rigurosa e investigación econométrica del mercado inmobiliario.

#### Estructura Semántica DOM (`#galeria`):
```html
<section id="galeria" class="section gallery-section" aria-labelledby="gallery-title">
  <div class="container">
    <header class="section-header text-center">
      <span class="section-eyebrow">TECNOLOGÍA Y OPERACIÓN EN CAMPO</span>
      <h2 id="gallery-title" class="section-title">Ingeniería Geoespacial y Precisión Técnica en Acción</h2>
      <p class="section-description">
        Combinamos instrumentación satelital de última generación con rigor jurídico-catastral para entregar dictámenes y levantamientos con validez oficial en toda Colombia.
      </p>
    </header>

    <!-- Mosaico Visual Bento Grid (4 Fotografías con Overlay Gradiente --azul-corporativo) -->
    <div class="bento-grid">
      <!-- BENTO ITEM 1: GNSS/RTK -->
      <figure class="bento-item bento-item-featured">
        <img src="./assets/images/servicio-topografia.png" 
             alt="Operación en campo con receptores satelitales GNSS RTK de precisión milimétrica amarrados a la red MAGNA-SIRGAS" 
             loading="lazy" width="700" height="560">
        <figcaption class="bento-overlay">
          <span class="bento-tag">GEODESIA SATELITAL</span>
          <h3>Operación GNSS/RTK de Precisión Milimétrica</h3>
          <p>Posicionamiento en tiempo real amarrado a la red MAGNA-SIRGAS para control geodésico urbano y rural.</p>
        </figcaption>
      </figure>

      <!-- BENTO ITEM 2: DRON RPAS -->
      <figure class="bento-item bento-item-wide">
        <img src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1000&q=85" 
             alt="Mapeo aerofotogramétrico con dron RPAS y generación de Modelos Digitales de Terreno para topografía rural y urbana" 
             loading="lazy" width="700" height="320">
        <figcaption class="bento-overlay">
          <span class="bento-tag">AEROFOTOGRAMETRÍA RPAS</span>
          <h3>Fotogrametría con Dron (RPAS) y Modelos Digitales de Terreno</h3>
          <p>Ortofotomosaicos centimétricos, cálculo volumétrico y modelamiento topográfico de grandes extensiones.</p>
        </figcaption>
      </figure>

      <!-- BENTO ITEM 3: CARTOGRAFÍA Y SIG -->
      <figure class="bento-item">
        <img src="./assets/images/servicio-catastro.png" 
             alt="Análisis espacial en Sistemas de Información Geográfica SIG y cartografía predial bajo Resolución Conjunta 1101" 
             loading="lazy" width="500" height="320">
        <figcaption class="bento-overlay">
          <span class="bento-tag">CATASTRO MULTIPROPÓSITO</span>
          <h3>Cartografía Catastral y SIG (Resolución Conjunta 1101)</h3>
          <p>Estructuración de bases geográficas y planos protocolizables ante IGAC, gestores catastrales y SNR.</p>
        </figcaption>
      </figure>

      <!-- BENTO ITEM 4: AVALÚOS RESOLUCIÓN 941 -->
      <figure class="bento-item">
        <img src="./assets/images/servicio-avaluos.png" 
             alt="Inspección técnica para avalúos comerciales urbanos, rurales e industriales bajo Resolución 941 de 2026 del IGAC" 
             loading="lazy" width="500" height="320">
        <figcaption class="bento-overlay">
          <span class="bento-tag">VALUACIÓN CERTIFICADA</span>
          <h3>Avalúos Urbanos, Rurales e Industriales (Resolución 941 de 2026)</h3>
          <p>Dictámenes corporativos, comerciales y judiciales con rigor metodológico y estadístico.</p>
        </figcaption>
      </figure>
    </div>
  </div>
</section>
```

---

### 4.6. Sección Contacto (`#contacto`) y Pie de Página (`<footer>`)
Se conservan íntegramente todos los datos obligatorios de `directrices.md` y `copywriting.md`:
- Operación en **Bogotá D.C. y atención a nivel nacional**.
- Líneas directas de los 3 directores: **310-629-1208**, **322-738-9449** y **312-533-8045**.
- Formulario estructurado de 6 campos con redirección/integración directa de cotización.
- Botón flotante de WhatsApp (`position: fixed`) en `--verde-corporativo`.
- Footer en `--azul-corporativo` con el logo transparente `./assets/images/logo-ingeopredial.png`.

---

## 5. Especificación CSS para los Nuevos Componentes Visuales (Guía para el Desarrollador)

El Agente Desarrollador debe incorporar las siguientes reglas de layout en `style.css` manteniendo el enfoque **Mobile-First**:

### 5.1. Split Hero con Tarjeta Fotográfica Lateral (`.hero-split-grid` y `.hero-featured-frame`)
```css
.hero-split-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.25rem;
  align-items: center;
  margin-bottom: 2.5rem;
}

.hero-featured-frame {
  position: relative;
  border-radius: var(--border-radius-card);
  overflow: visible;
  margin: 0;
}

.hero-featured-img {
  width: 100%;
  height: clamp(260px, 34vw, 400px);
  object-fit: cover;
  border-radius: var(--border-radius-card);
  border: 3px solid rgba(255, 255, 255, 0.22);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.38);
  display: block;
}

.hero-floating-badge {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  background-color: var(--blanco-fondo);
  color: var(--azul-corporativo);
  padding: 0.65rem 1rem;
  border-radius: 10px;
  box-shadow: var(--shadow-floating-badge);
  border-left: 4px solid var(--verde-corporativo);
  font-size: 0.82rem;
  line-height: 1.25;
  z-index: 2;
}

@media (min-width: 992px) {
  .hero-split-grid {
    grid-template-columns: 7fr 5fr;
    gap: 3rem;
  }
}
```

### 5.2. Collage de Doble Imagen y Métricas en `#nosotros` (`.about-collage` y `.about-metrics-grid`)
```css
.about-collage {
  position: relative;
  padding-bottom: 3.5rem;
  margin-bottom: 1.75rem;
}

.about-collage-primary {
  width: 85%;
  border-radius: var(--border-radius-card);
  overflow: hidden;
  box-shadow: var(--shadow-card);
  margin: 0;
}

.about-collage-primary img {
  width: 100%;
  height: 340px;
  object-fit: cover;
  display: block;
}

.about-collage-secondary {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 58%;
  border-radius: var(--border-radius-card);
  overflow: hidden;
  border: 6px solid var(--gris-claro);
  box-shadow: var(--shadow-floating-badge);
  margin: 0;
}

.about-collage-secondary img {
  width: 100%;
  height: 210px;
  object-fit: cover;
  display: block;
}

.about-metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.85rem;
}

.metric-card {
  background-color: var(--blanco-fondo);
  border: 1px solid var(--azul-borde-sutil);
  border-top: 3px solid var(--verde-corporativo);
  border-radius: 10px;
  padding: 0.9rem 0.75rem;
  text-align: center;
  box-shadow: var(--shadow-card);
}
```

### 5.3. Tarjetas de Servicios con Header Fotográfico, Badge SVG Flotante y Chips (`.service-card-media` y `.service-chips`)
```css
.service-card {
  background-color: var(--blanco-fondo);
  border-radius: var(--border-radius-card);
  border: 1px solid var(--azul-borde-sutil);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: var(--transition-base);
}

.service-card-media {
  position: relative;
  height: 215px;
  overflow: visible;
}

.service-card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.45s ease;
}

.service-card:hover .service-card-media img {
  transform: scale(1.05);
}

.service-icon-floating {
  position: absolute;
  bottom: -24px;
  right: 24px;
  width: 56px;
  height: 56px;
  background-color: var(--blanco-fondo);
  border: 2px solid var(--verde-corporativo);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-floating-badge);
  z-index: 3;
}

.service-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  margin: 1rem 0 1.5rem;
}

.service-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background-color: var(--gris-claro);
  color: var(--azul-corporativo);
  border: 1px solid var(--azul-borde-sutil);
  border-radius: var(--border-radius-chip);
  padding: 0.38rem 0.8rem;
  font-size: 0.84rem;
  font-weight: 600;
}

.service-chip .chip-dot {
  color: var(--verde-corporativo);
  font-weight: 700;
}
```

### 5.4. Mosaico Bento Grid en `#galeria` (`.bento-grid`)
```css
.bento-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

.bento-item {
  position: relative;
  border-radius: var(--border-radius-card);
  overflow: hidden;
  min-height: 250px;
  margin: 0;
  box-shadow: var(--shadow-card);
}

.bento-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}

.bento-item:hover img {
  transform: scale(1.06);
}

.bento-overlay {
  position: absolute;
  inset: 0;
  background: var(--azul-gradiente-bento);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.5rem;
  color: var(--blanco-fondo);
}

.bento-tag {
  align-self: flex-start;
  background-color: var(--verde-corporativo);
  color: var(--blanco-fondo);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  padding: 0.25rem 0.65rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

@media (min-width: 768px) {
  .bento-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 992px) {
  .bento-grid {
    grid-template-columns: repeat(12, 1fr);
    grid-auto-rows: 240px;
    gap: 1.5rem;
  }
  .bento-item-featured {
    grid-column: span 5;
    grid-row: span 2;
  }
  .bento-item-wide {
    grid-column: span 7;
    grid-row: span 1;
  }
  .bento-item:nth-child(3) {
    grid-column: span 4;
    grid-row: span 1;
  }
  .bento-item:nth-child(4) {
    grid-column: span 3;
    grid-row: span 1;
  }
}
```
