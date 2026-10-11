/**
 * Doodles dibujados "a mano": trazos SVG con un filtro de ruido
 * (#rough, definido en <RoughFilter/>) y un segundo trazo desplazado
 * para que parezcan hechos con bolígrafo.
 */

const SHAPES = {
  star: (
    <path d="M24 3.5 29.6 17.8 44.6 18.4 32.8 27.6 37.2 42.6 24.3 33.8 11.2 43 15.7 27.8 3.6 18.6 18.7 17.6Z" />
  ),
  smiley: (
    <>
      <path d="M24 4.5c11 0 19.5 8.6 19.5 19.6 0 10.8-8.8 19.4-19.6 19.4C13 43.5 4.6 34.9 4.6 24 4.6 13 13 4.5 24 4.5Z" />
      <path d="M18.5 15.5v8.5M29.5 15.5v8.5" />
      <path d="M13.5 28.5c3 6 7 8.5 10.8 8.4 4.2-.1 8-3 10.4-8.6" />
    </>
  ),
  cup: (
    <>
      <path d="M9 21h24v11c0 6-5 10-12 10S9 38 9 32Z" />
      <path d="M33 24.5c5-1 8.2 1 8 4.5-.2 3.6-4 5.4-8.6 4.6" />
      <path d="M4.5 45c9 1.4 25 1.5 35 .1" />
      <path d="M16 16c-2.5-2.5 2.5-4.5 0-8M22 15c-2.5-2.5 2.5-4.5 0-8M28 16c-2.5-2.5 2.5-4.5 0-8" />
    </>
  ),
  swirl: <path strokeDasharray="2.5 4" d="M3 42c10 3 16-5 11-10.5S2 31 8 37s20 3 25-7 5-17 12-24" />,
  arrow: (
    <>
      <path d="M5 8c6 18 18 27 34 30" />
      <path d="M31.5 31.5 39.5 38l-10 3.5" />
    </>
  ),
  sparkle: (
    <path d="M24 5c1.6 10 3.6 14.5 14.5 19C27.6 28.5 25.6 33 24 43c-1.6-10-3.6-14.5-14.5-19C20.4 19.5 22.4 15 24 5Z" />
  ),
  sun: (
    <>
      <path d="M24 15.5c5 0 8.6 3.8 8.6 8.6 0 4.6-3.8 8.4-8.7 8.4-4.8 0-8.4-3.8-8.4-8.5 0-4.8 3.7-8.5 8.5-8.5Z" />
      <path d="M24 4v6M24 38v6M4 24h6M38 24h6M9.5 9.5l4.2 4.2M34.3 34.3l4.2 4.2M38.5 9.5l-4.2 4.2M13.7 34.3l-4.2 4.2" />
    </>
  ),
  camera: (
    <>
      <path d="M6.5 16.5h8.5l3-5.5h12l3 5.5h8.5v23h-35Z" />
      <path d="M24 21c4 0 7 3 7 7s-3 7-7 7-7-3-7-7 3-7 7-7Z" />
      <path d="M36 21.5h2" />
    </>
  ),
  flower: (
    <>
      <path d="M24 22c-6-1-8-7-3-9 0-6 7-6 7 0 5 1 5 8 0 9 3 5-3 9-6 5-4 4-10-1-6-5Z" />
      <path d="M24 26c.5 7 0 12-1.5 18M23.5 36c3-3 6-3.5 9-2.5" />
    </>
  ),
  plus: <path d="M24 7.5c.6 11 .4 21-.4 33M7.5 24.5c11-.7 21-.6 33 .3" />,
  close: <path d="M12 11.5c8 8 16 16 24.5 25M36 11.5c-8 8.5-16 16.5-24 25" />,
  left: <path d="M30.5 8.5c-5.5 5.5-11 10.5-16 15.5 5 5.5 10.5 10.5 16 15.5" />,
  right: <path d="M17.5 8.5c5.5 5.5 11 10.5 16 15.5-5 5.5-10.5 10.5-16 15.5" />,
  trash: (
    <>
      <path d="M9 14h30M18.5 14V9h11v5" />
      <path d="M13 14.5l2.5 26h17l2.5-26" />
      <path d="M21 20.5v14.5M27 20.5v14.5" />
    </>
  ),
  heart: <path fill="currentColor" d="M24 41C9 31 4 22 6.5 14.5 9 7.5 18 6.5 24 14c6-7.5 15-6.5 17.5.5C44 22 39 31 24 41Z" />,
  heartOutline: <path d="M24 41C9 31 4 22 6.5 14.5 9 7.5 18 6.5 24 14c6-7.5 15-6.5 17.5.5C44 22 39 31 24 41Z" />,
  twoHearts: (
    <>
      <path d="M17 34C7 27 4 21 5.6 16.2 7.3 11.6 13 11 17 15.8c4-4.8 9.7-4.2 11.4.4C30 21 27 27 17 34Z" />
      <path d="M33 26c-6.5-4.5-8.4-8.4-7.4-11.5 1.1-3 4.8-3.4 7.4-.3 2.6-3.1 6.3-2.7 7.4.3 1 3.1-.9 7-7.4 11.5Z" />
    </>
  ),
  envelope: (
    <>
      <path d="M6 13.5h36v23H6Z" />
      <path d="M6.5 14 24 27.5 41.5 14" />
      <path fill="currentColor" stroke="none" d="M24 33c-3.6-2.5-4.6-4.6-4-6.3.6-1.7 2.6-1.9 4-.2 1.4-1.7 3.4-1.5 4 .2.6 1.7-.4 3.8-4 6.3Z" />
    </>
  ),
  // ——— viajes ———
  plane: (
    <>
      <path d="M24 4c2 0 3 2 3 5v10l15 8v4l-15-4v9l5 4v3l-8-2-8 2v-3l5-4v-9L6 31v-4l15-8V9c0-3 1-5 3-5Z" />
      <path d="M12 23.5v3M36 23.5v3" />
    </>
  ),
  paperPlane: (
    <>
      <path d="M4 21 44 6 33 41 23 29Z" />
      <path d="M44 6 23 29v11l5-6" />
    </>
  ),
  route: (
    <>
      <path strokeDasharray="2.5 3.5" d="M3 44c4-10 12-12 17-8s9 2 10-6 4-14 8-17" />
      <path d="M36 4.5 45 8l-7.5 6Z" />
      <path d="M2.5 40.5 7 45M7 40.5 2.5 45" />
    </>
  ),
  suitcase: (
    <>
      <path d="M8 16h32v24H8Z" />
      <path d="M18 16v-5h12v5M8 26h32M15 16v24M33 16v24" />
      <path d="M13 41v2.5M35 41v2.5" />
    </>
  ),
  globe: (
    <>
      <path d="M24 5c10.5 0 19 8.5 19 19s-8.5 19-19 19S5 34.5 5 24 13.5 5 24 5Z" />
      <path d="M5.5 24h37M24 5c-6 6-8 12-8 19s2 13 8 19M24 5c6 6 8 12 8 19s-2 13-8 19M8.5 14.5h31M8.5 33.5h31" />
    </>
  ),
  ticket: (
    <>
      <path d="M5 14h38v6a4 4 0 0 0 0 8v6H5v-6a4 4 0 0 0 0-8Z" />
      <path strokeDasharray="2 2.5" d="M32 15.5v17" />
      <path d="M10 20.5h15M10 26.5h10" />
      <path d="M36.5 21.5l2.5 2.5-2.5 2.5" />
    </>
  ),
  mountains: (
    <>
      <path d="M3 40 17 18l8 11 6-8 14 19Z" />
      <path d="M13 24.5l4-6.5 4 5.5" />
      <path d="M37 7a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z" />
    </>
  ),
  compass: (
    <>
      <path d="M24 6c10 0 18 8 18 18s-8 18-18 18S6 34 6 24 14 6 24 6Z" />
      <path d="M24 13l4.5 11L24 35l-4.5-11Z" />
      <path d="M24 2.5v3M24 42.5v3M2.5 24h3M42.5 24h3" />
    </>
  ),
  stamp: (
    <>
      <path strokeDasharray="2.6 2" d="M7 5h34v38H7Z" />
      <path d="M12 10h24v23H12Z" />
      <path d="M13 31l7-9 5 6 4-4 6 7" />
      <path d="M30 14a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" />
      <path d="M14 38h12" />
    </>
  ),
  van: (
    <>
      <path d="M5 13h29l8 12v12H5Z" />
      <path d="M9 17h9v7H9ZM22 17h9.5l4.5 7H22Z" />
      <path d="M10 37a4 4 0 1 0 8 0 4 4 0 1 0-8 0ZM29 37a4 4 0 1 0 8 0 4 4 0 1 0-8 0Z" />
      <path d="M5 30h4M38 30h4" />
    </>
  ),
  balloon: (
    <>
      <path d="M24 4c8 0 13 6 13 13 0 8-8 13-10 17h-6c-2-4-10-9-10-17 0-7 5-13 13-13Z" />
      <path d="M24 4c-4 4-5 9-5 14s2 11 2 16M24 4c4 4 5 9 5 14s-2 11-2 16" />
      <path d="M21 34l-.5 5M27 34l.5 5M19.5 39h9v5h-9Z" />
    </>
  ),
  map: (
    <>
      <path d="M5 12l12-5 14 5 12-5v29l-12 5-14-5-12 5Z" />
      <path d="M17 7v29M31 12v29" />
      <path strokeDasharray="2 2.5" d="M9 31c4-1 6-5 10-6s7 3 11 0 5-8 8-9" />
      <path d="M36 13.5l3 3M39 13.5l-3 3" />
    </>
  ),
  infinity: (
    <path d="M24 24c-4-5.5-7.5-8-11-8-4.5 0-8 3.5-8 8s3.5 8 8 8c3.5 0 7-2.5 11-8s7.5-8 11-8c4.5 0 8 3.5 8 8s-3.5 8-8 8c-3.5 0-7-2.5-11-8Z" />
  ),
}

export function Doodle({ name, className = '', strokeWidth = 2, sketchy = true, style, ...rest }) {
  const shape = SHAPES[name]
  if (!shape) return null
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      style={{ filter: 'url(#rough)', overflow: 'visible', ...style }}
      {...rest}
    >
      {shape}
      {sketchy && name !== 'heart' && name !== 'envelope' && (
        <g transform="translate(.8 -.7) rotate(1.2 24 24)" opacity=".5" strokeWidth={strokeWidth * 0.6}>
          {shape}
        </g>
      )}
    </svg>
  )
}

/** Subrayado tipo garabato para títulos */
export function Scribble({ className = '' }) {
  return (
    <svg
      viewBox="0 0 200 18"
      preserveAspectRatio="none"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
      style={{ filter: 'url(#rough)' }}
    >
      <path d="M4 9c45-6 110-7 190-2" />
      <path d="M14 14c40-3 95-4 150-1" opacity=".6" />
    </svg>
  )
}

/** Línea zig-zag como la de la referencia */
export function Zigzag({ className = '' }) {
  return (
    <svg
      viewBox="0 0 200 20"
      preserveAspectRatio="none"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      style={{ filter: 'url(#rough)' }}
    >
      <path d="M2 14 10 5l8 10 8-10 8 10 8-10 8 10 8-10 8 10 8-10 8 10 8-10 8 10 8-10 8 10 8-10 8 10 8-10 8 10 8-10 8 10 8-10 8 10 6-7" />
    </svg>
  )
}

/** Ruta punteada con un avioncito al final, para cabecera y pie */
export function FlightPath({ className = '', reverse = false }) {
  return (
    <svg
      viewBox="0 0 220 60"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      style={{ filter: 'url(#rough)', overflow: 'visible', transform: reverse ? 'scaleX(-1)' : undefined }}
    >
      <path strokeDasharray="3 5" d="M4 50c25-4 40-30 70-28s30 26 58 22 40-30 60-34" />
      <path d="M8.5 45.5l-5 5M3.5 45.5l5 5" />
      {/* avión de papel */}
      <path d="M196 4l20 3-14 13-3-7Z" fill="var(--color-paper)" />
      <path d="M216 7 199 13" />
    </svg>
  )
}

/** Pin rojo de ubicación */
export function Pin({ className = '' }) {
  return (
    <svg viewBox="0 0 12 16" className={className} aria-hidden="true">
      <path d="M6 15.5S11 9.8 11 6.2A5 5 0 0 0 1 6.2c0 3.6 5 9.3 5 9.3Z" fill="var(--color-pin)" />
      <circle cx="6" cy="6" r="1.8" fill="#fff" />
    </svg>
  )
}

/** Filtro SVG global que hace temblar los trazos */
export function RoughFilter() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <defs>
        <filter id="rough" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  )
}
