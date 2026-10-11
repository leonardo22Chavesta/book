import { useState } from 'react'
import { formatDate, photosOf } from '../utils/helpers'
import { Doodle, Pin } from './Doodles'
import { Fastener } from './Fasteners'
import PhotoCollage from './PhotoCollage'

export default function PolaroidCard({ memory, index, onOpen, onDelete }) {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { caption, place, date, rotation, fastener, tape, tapeTilt } = memory
  const photos = photosOf(memory)
  const hasFooter = place || date

  return (
    <figure className="group/card relative mb-9 break-inside-avoid pt-5 sm:mb-12">
      <button
        type="button"
        onClick={onOpen}
        aria-label={caption ? `Ver recuerdo: ${caption}` : 'Ver recuerdo'}
        className="polaroid animate-pop group relative block w-full cursor-zoom-in p-2 pb-1 text-left transition-[rotate,scale,box-shadow] duration-300 ease-out rotate-[var(--r)] hover:z-20 hover:scale-[1.04] hover:rotate-0 focus-visible:z-20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink active:scale-[0.98] sm:p-3 sm:pb-1.5"
        style={{ '--r': `${rotation}deg`, animationDelay: `${Math.min(index, 10) * 70}ms` }}
      >
        <Fastener type={fastener} tape={tape} tilt={tapeTilt} />

        <PhotoCollage photos={photos} alt={caption || 'Recuerdo'} />

        {/* corazoncito que late al pasar el dedo / mouse */}
        <Doodle
          name="heart"
          className="absolute top-3 right-3 h-5 w-5 text-ink opacity-0 drop-shadow transition group-hover:animate-beat group-hover:opacity-100 sm:top-4 sm:right-4"
        />

        <figcaption className="flex min-h-12 flex-col justify-center px-0.5 pt-2 pb-1.5 sm:min-h-16 sm:px-1">
          {caption && (
            <p className="font-hand text-[15px] leading-tight break-words text-ink sm:text-lg">{caption}</p>
          )}
          {hasFooter && (
            <div className="mt-1 flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5 font-hand text-[12px] text-ink/70 sm:text-sm">
              {place ? (
                <span className="flex min-w-0 items-center gap-1">
                  <Pin className="h-3 w-2.5 shrink-0" />
                  <span className="truncate">{place}</span>
                </span>
              ) : (
                <span />
              )}
              {date && <span className="whitespace-nowrap">{formatDate(date)}</span>}
            </div>
          )}
        </figcaption>
      </button>

      {/* borrar directo desde el muro (solo en npm run dev) */}
      {onDelete &&
        (confirming ? (
          <div className="animate-fade absolute top-2 right-0 z-30 flex items-center gap-1 rounded-full bg-white px-2 py-1 font-hand text-sm shadow-[0_4px_12px_-4px_rgba(0,0,0,0.4)]">
            <span className="px-1">¿borrar?</span>
            <button
              type="button"
              disabled={deleting}
              onClick={async () => {
                setDeleting(true)
                if (!(await onDelete())) {
                  setDeleting(false)
                  setConfirming(false)
                }
              }}
              className="rounded-full bg-pin px-2.5 py-0.5 text-white disabled:opacity-50"
            >
              {deleting ? '…' : 'sí'}
            </button>
            <button type="button" onClick={() => setConfirming(false)} className="px-1.5 py-0.5 text-ink/60">
              no
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            aria-label="Borrar recuerdo"
            className="absolute top-1 -right-2 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-ink/70 shadow-[0_3px_8px_-3px_rgba(0,0,0,0.45)] transition hover:text-pin focus-visible:opacity-100 sm:opacity-0 sm:group-hover/card:opacity-100"
          >
            <Doodle name="trash" className="h-5 w-5" strokeWidth={2.4} />
          </button>
        ))}
    </figure>
  )
}
