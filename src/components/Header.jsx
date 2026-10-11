import { Doodle, FlightPath, Scribble } from './Doodles'
import { WashiTape } from './Fasteners'

const nameClass = 'font-script text-4xl font-bold text-ink sm:text-5xl'

/** Input que parece texto escrito a mano y crece según lo que se escribe */
function NameInput({ value, placeholder, onChange, label, editable }) {
  if (!editable) return <span className={nameClass}>{value || placeholder}</span>
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value.slice(0, 18))}
      placeholder={placeholder}
      aria-label={label}
      size={Math.max(value.length, placeholder.length, 2)}
      className={`min-w-0 border-b-2 border-dashed border-transparent bg-transparent text-center outline-none placeholder:text-ink/45 hover:border-ink/30 focus:border-ink ${nameClass}`}
    />
  )
}

export default function Header({ count, names, onNamesChange, editable }) {
  const [name1, name2] = names

  return (
    <header className="relative px-5 pt-[max(2.5rem,env(safe-area-inset-top))] pb-6 text-center sm:pt-14">
      {/* doodles decorativos: amor + viajes */}
      <Doodle name="plane" className="animate-float absolute top-5 left-3 h-10 w-10 rotate-[35deg] sm:left-10 sm:h-14 sm:w-14" />
      <Doodle name="heart" className="absolute top-20 left-12 h-5 w-5 -rotate-12 text-ink sm:left-28 sm:h-6 sm:w-6" />
      <Doodle name="ticket" className="absolute top-32 left-3 hidden h-10 w-10 -rotate-12 sm:left-14 sm:block" />
      <Doodle name="globe" className="absolute top-5 right-4 h-10 w-10 rotate-6 sm:right-12 sm:h-14 sm:w-14" />
      <Doodle name="heartOutline" className="absolute top-20 right-12 h-5 w-5 rotate-12 text-ink/70 sm:right-32 sm:h-7 sm:w-7" />
      <Doodle name="suitcase" className="absolute top-32 right-3 hidden h-10 w-10 rotate-6 sm:right-14 sm:block" />

      <div className="flex items-center justify-center gap-1 sm:gap-3">
        <NameInput value={name1} placeholder="tú" label="Primer nombre" editable={editable} onChange={(v) => onNamesChange([v, name2])} />
        <Doodle name="heart" className="animate-beat h-6 w-6 shrink-0 text-ink sm:h-8 sm:w-8" />
        <NameInput value={name2} placeholder="yo" label="Segundo nombre" editable={editable} onChange={(v) => onNamesChange([name1, v])} />
      </div>

      <h1 className="relative mx-auto mt-3 inline-block font-script text-6xl leading-none font-bold sm:text-8xl">
        recuerdos
        <Scribble className="absolute -bottom-3 left-0 h-4 w-full text-ink/80" />
      </h1>
      <p className="mt-5 font-hand text-base text-ink/60 sm:text-lg">viajes, citas y momentos bonitos</p>

      <FlightPath className="mx-auto mt-4 h-10 w-52 text-ink/70 sm:w-64" />

      <span className="relative mt-4 inline-block px-4 py-1 font-hand text-lg">
        <WashiTape color={0} className="absolute inset-0 h-full w-full -rotate-2" />
        <span className="relative">
          {count === 0 ? 'aún sin recuerdos' : `${count} ${count === 1 ? 'recuerdo' : 'recuerdos'}`}
        </span>
      </span>
    </header>
  )
}
