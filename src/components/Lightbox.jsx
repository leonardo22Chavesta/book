import { useEffect, useRef, useState } from 'react'
import { formatDate, photosOf } from '../utils/helpers'
import { Doodle, Pin } from './Doodles'
import { WashiTape } from './Fasteners'

export default function Lightbox({ memories, index, onClose, onNavigate, onDelete }) {
  const memory = memories[index]
  const photos = memory ? photosOf(memory) : []
  const [photo, setPhoto] = useState(0)
  const [confirming, setConfirming] = useState(false)
  const touchX = useRef(null)
  const total = memories.length

  // Primero recorre las fotos del recuerdo y luego pasa al siguiente
  const go = (dir) => {
    setConfirming(false)
    const nextPhoto = photo + dir
    if (nextPhoto >= 0 && nextPhoto < photos.length) {
      setPhoto(nextPhoto)
      return
    }
    if (total < 2) return
    const nextIndex = (index + dir + total) % total
    setPhoto(dir > 0 ? 0 : photosOf(memories[nextIndex]).length - 1)
    onNavigate(nextIndex)
  }

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (!memory) return null

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]"
      role="dialog"
      aria-modal="true"
      aria-label="Recuerdo ampliado"
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return
        const dx = e.changedTouches[0].clientX - touchX.current
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
        touchX.current = null
      }}
    >
      <div className="animate-fade absolute inset-0 bg-[#1b1a18]/85 backdrop-blur-sm" onClick={onClose} />

      {/* barra superior */}
      <div className="relative z-10 mb-3 flex w-full max-w-xl items-center justify-between text-paper">
        <span className="font-hand text-lg opacity-80">{index + 1} / {total}</span>
        <button type="button" onClick={onClose} aria-label="Cerrar" autoFocus className="p-2 opacity-90 hover:opacity-100">
          <Doodle name="close" className="h-7 w-7" strokeWidth={2.5} />
        </button>
      </div>

      {/* polaroid grande */}
      <figure key={memory.id} className="polaroid animate-pop relative z-10 w-fit max-w-[min(92vw,36rem)] -rotate-1 p-3 pb-2 sm:p-4 sm:pb-3">
        <WashiTape color={memory.tape ?? 0} className="absolute -top-3 left-1/2 z-10 w-28 -translate-x-1/2 rotate-[-3deg]" />
        <div className="photo-frame overflow-hidden bg-neutral-200">
          <img
            key={photo}
            src={photos[Math.min(photo, photos.length - 1)]}
            alt={memory.caption || 'Recuerdo'}
            className="photo-vintage animate-fade mx-auto block max-h-[52dvh] w-auto max-w-full object-contain"
          />
        </div>

        {/* miniaturas de los cuadritos */}
        {photos.length > 1 && (
          <div className="mt-2 flex justify-center gap-1.5">
            {photos.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPhoto(i)}
                aria-label={`Ver foto ${i + 1}`}
                className={`h-11 w-11 overflow-hidden rounded-sm transition sm:h-12 sm:w-12 ${
                  i === photo ? 'ring-2 ring-ink ring-offset-2' : 'opacity-55 hover:opacity-90'
                }`}
              >
                <img src={src} alt="" className="photo-vintage h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
        <figcaption className="px-1 pt-3 pb-1">
          {memory.caption && <p className="font-hand text-xl leading-tight break-words sm:text-2xl">{memory.caption}</p>}
          <div className="mt-1 flex items-center justify-between gap-3 font-hand text-sm text-ink/65 sm:text-base">
            <span className="flex items-center gap-1">
              {memory.place && (
                <>
                  <Pin className="h-3.5 w-3" /> {memory.place}
                </>
              )}
            </span>
            {memory.date && <span>{formatDate(memory.date)}</span>}
          </div>
        </figcaption>
      </figure>

      {/* navegación (escritorio) */}
      {(total > 1 || photos.length > 1) && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Anterior"
            className="absolute top-1/2 left-3 z-10 hidden -translate-y-1/2 p-3 text-paper/80 hover:text-paper sm:block lg:left-10"
          >
            <Doodle name="left" className="h-10 w-10" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Siguiente"
            className="absolute top-1/2 right-3 z-10 hidden -translate-y-1/2 p-3 text-paper/80 hover:text-paper sm:block lg:right-10"
          >
            <Doodle name="right" className="h-10 w-10" strokeWidth={2.5} />
          </button>
        </>
      )}

      {/* acciones */}
      <div className="relative z-10 mt-6 flex min-h-12 items-center justify-center gap-3 text-paper">
        {!onDelete ? null : confirming ? (
          <>
            <span className="font-hand text-lg">¿despegar este recuerdo?</span>
            <button
              type="button"
              onClick={() => onDelete(memory.id)}
              className="sketch-border border-pin bg-pin px-4 py-1.5 font-hand text-lg text-white"
            >
              sí, borrar
            </button>
            <button type="button" onClick={() => setConfirming(false)} className="px-3 py-1.5 font-hand text-lg opacity-80">
              no
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="sketch-border flex items-center gap-2 border-paper/60 px-4 py-1.5 font-hand text-lg text-paper/90 hover:border-pin hover:text-[#ff8a7d]"
          >
            <Doodle name="trash" className="h-5 w-5" /> eliminar
          </button>
        )}
      </div>

      {(total > 1 || photos.length > 1) && <p className="relative z-10 mt-2 font-hand text-sm text-paper/50 sm:hidden">desliza para ver más</p>}
    </div>
  )
}
