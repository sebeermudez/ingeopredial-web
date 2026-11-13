# Directrices del Proyecto (Knowledge Base) — INGEOPREDIAL S.A.S.

> **INSTRUCCIÓN OBLIGATORIA PARA TODOS LOS AGENTES:** Todos los agentes (`copywriter`, `disenador`, `desarrollador`) deben leer y acatar estrictamente este documento antes de ejecutar cualquier tarea.

---

## 1. Identidad de la Empresa y Tono de Comunicación
- **Empresa:** **INGEOPREDIAL S.A.S.**, firma especializada fundada por ingenieros catastrales y geodestas.
- **Liderazgo:** Dirigida por un equipo de **tres ingenieros catastrales y geodestas expertos**, enfocados en rigor técnico y normativo.
- **Tono de Redacción:** Técnico, riguroso, institucional y orientado a brindar **seguridad jurídica y técnica en el territorio colombiano**.

---

## 2. Portafolio Detallado de Servicios (4 Pilares)

### 2.1. Avalúos
- Avalúos comerciales, urbanos y rurales bajo normatividad **IGAC** y **Resolución 941 de 2026**.

### 2.2. Topografía
- Levantamientos topográficos urbanos y rurales (operación con equipos **GNSS/RTK**), dron (fotogrametría / RPAS), cartografía y Sistemas de Información Geográfica (**SIG**).

### 2.3. Trámites Prediales y Gestión Catastral
- Deslindes y amojonamientos, constitución de servidumbres, loteos, parcelaciones, englobes/desenglobes, rectificaciones y actualizaciones de áreas y linderos registrales, **Resolución Conjunta 1101** (IGAC - SNR) y estudios de títulos.

### 2.4. Legalización y Consultoría
- Legalización de construcciones, revisión de folios de matrícula inmobiliaria, análisis estructural básico y asesoría frente a normas del **POT** (Plan de Ordenamiento Territorial) y **Curadurías Urbanas**.

---

## 3. Estructura de la Landing Page (Single-Page Application)

1. **Encabezado (`<header>`):**
   - Logo de INGEOPREDIAL S.A.S. en el extremo izquierdo apuntando a `./assets/images/logo-ingeopredial.png` (con respaldo `.svg`).
   - En escritorio: Barra de navegación fija (**Sticky Header**) siempre visible al hacer scroll.
   - En móvil: Menú tipo **hamburguesa** completamente funcional.
   - Enlaces de navegación con desplazamiento suave (`scroll-behavior: smooth`).

2. **Inicio — Hero Section (`#inicio`):**
   - Título principal (`<h1>`) de gran impacto con la propuesta de valor institucional.
   - Subtítulo profesional que refuerce la seguridad técnica y jurídica predial.
   - Botones de Llamado a la Acción (**Call to Action - CTA**).
   - Visibilidad y accesos directos desde la primera pantalla a los servicios principales: **Avalúos** y **Topografía**.
   - Imagen de fondo temática (topografía/GNSS/dron) con capa superpuesta (**overlay**) usando `--azul-corporativo` al **70%–80% de opacidad** para garantizar legibilidad del texto blanco.

3. **Nosotros (`#nosotros`):**
   - Bloque institucional que genere autoridad.
   - Mención explícita de que la firma está liderada por un **equipo de tres ingenieros catastrales y geodestas expertos**, enfocados en rigor técnico y normativo en Colombia.
   - Imagen de apoyo de alta calidad relacionada con ingeniería catastral, planos o geodesia.

4. **Servicios (`#servicios`):**
   - Presentación visual en formato de cuadrícula (**Grid**) o Tarjetas (**Cards**) para los **4 pilares** (Avalúos, Topografía, Trámites Prediales y Gestión Catastral, Legalización y Consultoría).
   - **No usar fotos en las tarjetas**: cada tarjeta debe incluir un **ícono vectorial minimalista (SVG)** renderizado en `--verde-corporativo` y una descripción técnica concisa.

5. **Contacto (`#contacto`) y Pie de Página (`<footer>`):**
   - Formulario de contacto claro y estructurado.
   - Ubicación de operación: **Bogotá D.C. y atención a nivel nacional**.
   - Números de contacto del equipo directivo:
     - **310-629-1208**
     - **322-738-9449**
     - **312-533-8045**
   - **Botón flotante de WhatsApp** siempre visible en pantalla (`position: fixed`).
   - Pie de página (`<footer>`) con el logo de INGEOPREDIAL S.A.S. (`./assets/images/logo-ingeopredial.png`), datos institucionales y derechos reservados.

---

## 4. Identidad Visual y Reglas de Estilo (CSS3)
Diseño limpio, profesional y minimalista. Es obligatorio definir y utilizar estrictamente las siguientes variables en `:root`:

```css
:root {
  --blanco-fondo: #ffffff;       /* Fondo principal de la página */
  --gris-claro: #f4f7f6;         /* Alternar fondo en secciones para descanso visual */
  --azul-corporativo: #0d2b45;   /* Títulos, textos principales, encabezado y pie de página */
  --verde-corporativo: #2d8a39;  /* Exclusivo para botones de acción, íconos de servicios y detalles de acento visual */
}
```

---

## 5. Manejo de Activos Visuales, SEO y Accesibilidad
- **Carpeta de recursos:** `./assets/images/` (rutas relativas estrictas para compatibilidad con GitHub Pages `/ingeopredial-web/`).
- **Logo:** `./assets/images/logo-ingeopredial.png` (se copia el logo oficial existente en el repositorio a esta ruta).
- **Placeholders:** Imágenes de alta calidad vía Unsplash utilizando únicamente temáticas de `topography`, `surveying`, `GNSS`, `blueprints`, `real estate`, `drone mapping`. Prohibido usar imágenes corporativas genéricas de oficina.
- **Accesibilidad y SEO en imágenes:** Todas las etiquetas `<img>` deben tener atributo `alt` con descripciones técnicas precisas redactadas por el Copywriter.
- **Metadatos e Idioma:**
  - Declaración `<html lang="es-CO">`.
  - `<title>` optimizado para SEO (ej. `INGEOPREDIAL S.A.S. | Avalúos y Topografía en Colombia`).
  - `<meta name="description">` persuasiva de **máximo 155 caracteres** que contenga las palabras clave: `"ingenieros catastrales"`, `"avalúos comerciales"` y `"levantamientos topográficos"`.
  - Etiqueta `<link rel="icon" href="./assets/images/logo-ingeopredial.png" type="image/png">`.

---

## 6. Roles y Permisos de los Agentes
1. **Agente Copywriter (`copywriter`):** Redacta todos los textos técnicos, títulos, subtítulos, CTAs, metadatos SEO y atributos `alt`. Guarda su entregable en `copywriting.md`.
2. **Agente Diseñador (`disenador`):** Define el wireframe, jerarquía visual, estructura de etiquetas semánticas (`<header>`, `<main>`, `<section>`, `<footer>`) y tokens de diseño en `wireframe_diseno.md`.
3. **Agente Desarrollador (`desarrollador`):** Único agente autorizado para crear y modificar archivos `.html` y `.css`. Programa `index.html` y `style.css` y los guarda en la carpeta `landing_page/` (y sincroniza la raíz del repositorio para despliegue en GitHub Pages).
