import { Doodle } from './Doodles'
import { WashiTape } from './Fasteners'

const ICONS = ['heart', 'plane', 'plus', 'camera', 'suitcase', 'plus', 'globe', 'heartOutline']
const TEXTS = ['nuestro próximo destino', 'aquí va otra cita', 'el siguiente viaje juntos', 'una foto más de nosotros']

/** Polaroid vacía con cuadritos punteados que invita a subir más fotos */
export default function EmptySlot({ variant = 0, onAdd }) {
  const tilt = [2.5, -3, 1.5, -2][variant % 4]
  return (
    <figure className="mb-9 break-inside-avoid pt-5 sm:mb-12">
      <button
        type="button"
        onClick={onAdd}
        className="group relative block w-full bg-white/50 p-2 pb-1 shadow-[0_8px_18px_-12px_rgba(0,0,0,0.35)] transition hover:scale-[1.03] hover:bg-white/80 active:scale-[0.98] sm:p-3"
        style={{ rotate: `${tilt}deg` }}
      >
        <WashiTape color={variant + 2} className="absolute -top-3 left-1/2 w-20 -translate-x-1/2 rotate-[4deg]" />
        <div className="grid grid-cols-2 gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex aspect-square items-center justify-center rounded-sm border-2 border-dashed border-ink/35 bg-ink/[0.03] text-ink/50 transition group-hover:border-ink/60 group-hover:text-ink"
            >
              <Doodle name={ICONS[(variant + i) % ICONS.length]} className={i === 0 ? 'h-7 w-7' : 'h-5 w-5'} strokeWidth={2.2} />
            </div>
          ))}
        </div>
        <p className="pt-2 pb-1.5 text-center font-hand text-sm leading-tight text-ink/45 sm:text-base">
          {TEXTS[variant % TEXTS.length]}
        </p>
      </button>
    </figure>
  )
}
