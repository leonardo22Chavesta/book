import { TAPE_COLORS } from '../utils/helpers'

/** Clip negro de presión (binder clip) */
export function BinderClip({ className = '' }) {
  return (
    <svg viewBox="0 0 64 54" className={`drop-shadow-[0_2px_1.5px_rgba(0,0,0,0.35)] ${className}`} aria-hidden="true">
      {/* asas metálicas */}
      <path d="M17 34 21 5h22l4 29" fill="none" stroke="#c9ccd1" strokeWidth="3" strokeLinejoin="round" />
      <path d="M17 34 21 5h22l4 29" fill="none" stroke="#7d8189" strokeWidth="1" strokeLinejoin="round" opacity=".7" />
      {/* cuerpo */}
      <path d="M7 30h50l-4 21H11Z" fill="#141414" />
      <path d="M9.5 33h45" stroke="#3a3a3a" strokeWidth="2" />
      <path d="M12 47.5h40" stroke="#000" strokeWidth="1.5" opacity=".6" />
    </svg>
  )
}

/** Clip de papel plateado */
export function PaperClip({ className = '' }) {
  const d = 'M16 20v29a5.5 5.5 0 0 1-11 0V11a7.5 7.5 0 0 1 15 0v40a9 9 0 0 1-18 0V18'
  return (
    <svg
      viewBox="0 0 24 64"
      fill="none"
      strokeLinecap="round"
      className={`drop-shadow-[1px_2px_1px_rgba(0,0,0,0.25)] ${className}`}
      aria-hidden="true"
    >
      <path d={d} stroke="#a7abb2" strokeWidth="2.6" />
      <path d={d} stroke="#eef0f3" strokeWidth=".9" opacity=".9" />
    </svg>
  )
}

/** Tira de cinta washi semitransparente */
export function WashiTape({ color = 0, className = '', style }) {
  const c = TAPE_COLORS[color % TAPE_COLORS.length]
  return (
    <div
      aria-hidden="true"
      className={`washi h-6 ${className}`}
      style={{
        backgroundColor: c.base,
        backgroundImage: c.pattern,
        ...style,
      }}
    />
  )
}

/** Chincheta en forma de corazón */
export function HeartPin({ className = '', style }) {
  return (
    <svg viewBox="0 0 32 30" className={`drop-shadow-[1px_3px_2px_rgba(0,0,0,0.3)] ${className}`} style={style} aria-hidden="true">
      <path d="M16 28C5 20.5 1.5 14 3.2 8.8 5 3.6 11.4 2.8 16 8c4.6-5.2 11-4.4 12.8.8C30.5 14 27 20.5 16 28Z" fill="#d94a3d" />
      <path d="M16 28C5 20.5 1.5 14 3.2 8.8 5 3.6 11.4 2.8 16 8c4.6-5.2 11-4.4 12.8.8C30.5 14 27 20.5 16 28Z" fill="none" stroke="#a8352b" strokeWidth="1" />
      <ellipse cx="9.5" cy="10" rx="3" ry="1.8" fill="#fff" opacity=".55" transform="rotate(-35 9.5 10)" />
    </svg>
  )
}

/** Elige el sujetador según el estilo guardado en cada recuerdo */
export function Fastener({ type, tape = 0, tilt = 0 }) {
  switch (type) {
    case 'heart':
      return (
        <HeartPin
          className="pointer-events-none absolute -top-4 left-1/2 z-10 w-9 sm:w-10"
          style={{ transform: `translateX(-50%) rotate(${tilt}deg)` }}
        />
      )
    case 'binder':
      return <BinderClip className="pointer-events-none absolute -top-7 left-1/2 z-10 w-12 -translate-x-1/2 sm:w-14" />
    case 'clip':
      return <PaperClip className="pointer-events-none absolute -top-5 right-[14%] z-10 h-14 rotate-[8deg] sm:h-16" />
    case 'tape-corners':
      return (
        <>
          <WashiTape color={tape} className="pointer-events-none absolute -top-1 -left-5 z-10 w-16 -rotate-[38deg]" />
          <WashiTape color={tape + 2} className="pointer-events-none absolute -right-5 -bottom-1 z-10 w-16 -rotate-[38deg]" />
        </>
      )
    case 'tape':
    default:
      return (
        <WashiTape
          color={tape}
          className="pointer-events-none absolute -top-3 left-1/2 z-10 w-24 sm:w-28"
          style={{ transform: `translateX(-50%) rotate(${tilt}deg)` }}
        />
      )
  }
}
