import { Doodle } from './Doodles'
import { WashiTape } from './Fasteners'

// Notitas de amor y viajes que se intercalan entre las fotos
const STICKERS = [
  { doodle: 'plane', text: 'a donde sea, pero contigo', tape: 0, tilt: -3, rot: 30 },
  { doodle: 'twoHearts', text: 'te elegiría en todas las vidas', tape: 5, tilt: 4 },
  { doodle: 'suitcase', text: 'maletas listas, corazón también', tape: 4, tilt: -2 },
  { doodle: 'ticket', text: 'boleto de ida: nosotros', tape: 1, tilt: 3 },
  { doodle: 'globe', text: 'el mundo es más bonito a tu lado', tape: 3, tilt: -4 },
  { doodle: 'cup', text: 'otra cita de cafecito, porfa', tape: 2, tilt: 2 },
  { doodle: 'mountains', text: 'próxima parada: aventura', tape: 1, tilt: -2 },
  { doodle: 'envelope', text: 'contigo todo es mejor', tape: 5, tilt: 3 },
  { doodle: 'van', text: 'roadtrip con mi persona favorita', tape: 0, tilt: -3 },
  { doodle: 'balloon', text: 'contigo hasta las nubes', tape: 3, tilt: 2 },
  { doodle: 'stamp', text: 'recuerdos con sello de amor', tape: 4, tilt: -3 },
  { doodle: 'map', text: 'nuestro mapa de aventuras', tape: 2, tilt: 4 },
  { doodle: 'camera', text: 'click click: este fue bonito', tape: 0, tilt: -2 },
  { doodle: 'infinity', text: 'tú + yo = para siempre', tape: 5, tilt: 3 },
]

export default function Sticker({ variant = 0 }) {
  const s = STICKERS[variant % STICKERS.length]
  return (
    <div className="mb-9 break-inside-avoid px-2 pt-3 sm:mb-12" aria-hidden="true">
      <div
        className="relative mx-auto flex max-w-[11rem] flex-col items-center gap-1.5 bg-white/75 px-3 pt-5 pb-3 text-center shadow-[0_6px_14px_-8px_rgba(0,0,0,0.35)]"
        style={{ rotate: `${s.tilt}deg` }}
      >
        <WashiTape color={s.tape} className="absolute -top-3 left-1/2 w-16 -translate-x-1/2 rotate-[-4deg]" />
        <Doodle name={s.doodle} className="animate-float h-10 w-10 text-ink sm:h-12 sm:w-12" style={s.rot ? { rotate: `${s.rot}deg` } : undefined} />
        <p className="font-hand text-[15px] leading-tight text-ink sm:text-lg">{s.text}</p>
      </div>
    </div>
  )
}
