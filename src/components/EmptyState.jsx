import { Doodle } from './Doodles'
import { HeartPin, WashiTape } from './Fasteners'
import EmptySlot from './EmptySlot'

export default function EmptyState({ onAdd, editable = true }) {
  if (!editable) {
    return (
      <section className="flex flex-col items-center gap-3 px-6 pt-10 pb-32 text-center">
        <Doodle name="suitcase" className="h-14 w-14" />
        <p className="font-script text-3xl">todavía no hay recuerdos por aquí</p>
        <Doodle name="heart" className="animate-beat h-6 w-6" />
      </section>
    )
  }

  return (
    <section className="relative mx-auto flex max-w-md flex-col items-center px-6 pt-4 pb-32 text-center">
      <div className="relative w-64 rotate-[-3deg] sm:w-72">
        <HeartPin className="absolute -top-4 left-1/2 z-10 w-10 -translate-x-1/2" />
        <button
          type="button"
          onClick={onAdd}
          className="polaroid group block w-full p-3 pb-2 transition hover:rotate-2 hover:scale-[1.03] active:scale-[0.98]"
        >
          <div className="grid grid-cols-2 gap-1.5">
            {['camera', 'heart', 'plane', 'plus'].map((name, i) => (
              <div
                key={i}
                className="flex aspect-square items-center justify-center rounded-sm border-2 border-dashed border-ink/40 bg-ink/[0.03] text-ink/70 transition group-hover:bg-ink/[0.07]"
              >
                <Doodle name={name} className={i === 0 ? 'h-10 w-10' : 'h-6 w-6'} strokeWidth={2.4} />
              </div>
            ))}
          </div>
          <p className="pt-3 pb-1 font-hand text-lg leading-tight text-ink/60">
            toca para pegar
            <br />
            el primer recuerdo ♡
          </p>
        </button>
      </div>


      <div className="mt-10 grid w-full grid-cols-2 gap-5 opacity-80">
        <EmptySlot variant={1} onAdd={onAdd} />
        <EmptySlot variant={2} onAdd={onAdd} />
      </div>

      <Doodle name="paperPlane" className="animate-float absolute top-4 right-2 h-9 w-9 sm:-right-6" />
      <Doodle name="route" className="absolute top-14 right-10 h-10 w-10 text-ink/60 sm:right-2" />
      <Doodle name="compass" className="absolute top-24 left-0 h-9 w-9 -rotate-12 sm:-left-10" />
      <Doodle name="stamp" className="absolute top-72 -left-1 h-11 w-11 -rotate-12 sm:-left-10" />
      <Doodle name="balloon" className="animate-float absolute top-80 -right-1 h-12 w-12 sm:-right-10" />
      <Doodle name="heart" className="absolute top-[23rem] right-10 h-5 w-5 rotate-12" />
      <WashiTape color={4} className="absolute bottom-24 left-6 w-20 rotate-[14deg] opacity-80" />
    </section>
  )
}
