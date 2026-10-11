import { useCallback, useEffect, useRef, useState } from 'react'
import { compressImage } from '../utils/image'
import { MAX_PHOTOS, formatDate, todayISO } from '../utils/helpers'
import { Doodle, Pin } from './Doodles'
import { WashiTape } from './Fasteners'

const CAPTION_MAX = 80

export default function UploadModal({ files, onClose, onSave }) {
  const inputRef = useRef(null)
  const replaceSlot = useRef(null) // índice del cuadrito a reemplazar, o null para agregar
  const [photos, setPhotos] = useState([])
  const [caption, setCaption] = useState('')
  const [place, setPlace] = useState('')
  const [date, setDate] = useState(todayISO)
  const [busy, setBusy] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const processFiles = useCallback(async (list, slot = null) => {
    const images = Array.from(list ?? []).filter((f) => f.type.startsWith('image/'))
    if (!images.length) return
    setError('')
    setNotice('')

    const batch = slot === null ? images : images.slice(0, 1)
    setBusy((n) => n + batch.length)
    try {
      const results = await Promise.all(batch.map((f) => compressImage(f)))
      setPhotos((prev) => {
        if (slot !== null) return prev.map((p, i) => (i === slot ? results[0] : p))
        const next = [...prev, ...results]
        if (next.length > MAX_PHOTOS) setNotice(`Solo caben ${MAX_PHOTOS} fotos por recuerdo, guardé las primeras.`)
        return next.slice(0, MAX_PHOTOS)
      })
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy((n) => n - batch.length)
    }
  }, [])

  // Imágenes soltadas sobre la página (drag & drop global)
  useEffect(() => {
    if (files?.length) processFiles(files)
  }, [files, processFiles])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const pickFiles = (slot = null) => {
    replaceSlot.current = slot
    inputRef.current.multiple = slot === null
    inputRef.current.click()
  }

  const removePhoto = (i) => setPhotos((prev) => prev.filter((_, j) => j !== i))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!photos.length || busy || saving) return
    setSaving(true)
    setError('')
    const result = await onSave({ photos, caption, place, date })
    if (result.ok) onClose()
    else {
      setError(result.error)
      setSaving(false)
    }
  }

  const slots = Array.from({ length: MAX_PHOTOS }, (_, i) => photos[i] ?? null)
  const firstEmpty = photos.length

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="upload-title">
      <div className="animate-fade absolute inset-0 bg-ink/50 backdrop-blur-[2px]" onClick={onClose} />

      <form
        onSubmit={handleSubmit}
        className="paper-bg animate-sheet scrollbar-none relative max-h-[94dvh] w-full overflow-y-auto rounded-t-[28px] px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl sm:max-w-md sm:rounded-md sm:px-7 sm:pt-6"
      >
        <div className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-ink/25 sm:hidden" />

        <div className="flex items-center justify-between">
          <h2 id="upload-title" className="flex items-center gap-2 font-script text-4xl font-bold">
            nuevo recuerdo
            <Doodle name="paperPlane" className="animate-float h-7 w-7" />
          </h2>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="-mr-2 p-2 text-ink/70 hover:text-ink">
            <Doodle name="close" className="h-6 w-6" />
          </button>
        </div>
        <p className="font-hand text-sm text-ink/50">hasta {MAX_PHOTOS} fotos, se pegan juntas como collage</p>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            processFiles(e.target.files, replaceSlot.current)
            e.target.value = ''
          }}
        />

        {/* Polaroid con 4 cuadritos */}
        <div className="polaroid relative mx-auto mt-6 mb-6 w-[86%] max-w-[18rem] rotate-[-2deg] p-2.5 pb-2">
          <WashiTape color={0} className="absolute -top-3 left-1/2 z-10 w-24 -translate-x-1/2 rotate-[3deg]" />

          <div className="grid grid-cols-2 gap-1.5">
            {slots.map((src, i) =>
              src ? (
                <div key={i} className="photo-frame relative aspect-square overflow-hidden bg-neutral-200">
                  <button type="button" onClick={() => pickFiles(i)} aria-label={`Cambiar foto ${i + 1}`} className="block h-full w-full">
                    <img src={src} alt={`Foto ${i + 1}`} className="photo-vintage h-full w-full object-cover" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    aria-label={`Quitar foto ${i + 1}`}
                    className="absolute top-1 right-1 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-ink shadow"
                  >
                    <Doodle name="close" className="h-3.5 w-3.5" strokeWidth={3.5} sketchy={false} />
                  </button>
                </div>
              ) : (
                <button
                  key={i}
                  type="button"
                  onClick={() => pickFiles(null)}
                  aria-label="Agregar fotos"
                  className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-sm border-2 border-dashed transition active:scale-95 ${
                    i === firstEmpty
                      ? 'border-ink/60 bg-ink/[0.03] text-ink'
                      : 'border-ink/25 bg-ink/[0.03] text-ink/40'
                  }`}
                >
                  {busy > 0 && i === firstEmpty ? (
                    <Doodle name="sparkle" className="h-8 w-8 animate-spin [animation-duration:2s]" />
                  ) : (
                    <Doodle name={i === firstEmpty ? 'camera' : 'plus'} className={i === firstEmpty ? 'h-9 w-9' : 'h-5 w-5'} />
                  )}
                  {i === firstEmpty && (
                    <span className="font-hand text-sm leading-none">{busy > 0 ? 'revelando…' : photos.length ? 'otra más' : 'elegir fotos'}</span>
                  )}
                </button>
              ),
            )}
          </div>

          <p className="min-h-10 px-1 pt-2 text-left font-hand text-base leading-tight break-words">
            {caption || <span className="text-ink/35">su nota aparecerá aquí…</span>}
          </p>
          {(place || date) && (
            <div className="flex items-center justify-between px-1 font-hand text-xs text-ink/60">
              <span className="flex items-center gap-1">{place && <><Pin className="h-3 w-2.5" />{place}</>}</span>
              <span>{formatDate(date)}</span>
            </div>
          )}
        </div>

        <label className="block">
          <span className="font-hand text-sm text-ink/60">pie de foto o nota de amor</span>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value.slice(0, CAPTION_MAX))}
            rows={2}
            placeholder="nuestro primer viaje juntos ♡"
            className="lined mt-1 block w-full resize-none bg-transparent px-1 font-hand text-xl text-ink outline-none placeholder:text-ink/30"
          />
          <span className="block text-right font-hand text-xs text-ink/40">
            {caption.length}/{CAPTION_MAX}
          </span>
        </label>

        <div className="mt-2 grid grid-cols-2 gap-4">
          <label className="block">
            <span className="flex items-center gap-1 font-hand text-sm text-ink/60">
              <Pin className="h-3 w-2.5" /> lugar
            </span>
            <input
              value={place}
              onChange={(e) => setPlace(e.target.value.slice(0, 30))}
              placeholder="Cusco"
              className="mt-1 w-full border-b-2 border-dashed border-ink/30 bg-transparent px-1 py-1 font-hand text-lg outline-none placeholder:text-ink/30 focus:border-ink"
            />
          </label>
          <label className="block">
            <span className="font-hand text-sm text-ink/60">fecha</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full border-b-2 border-dashed border-ink/30 bg-transparent px-1 py-1 font-hand text-lg outline-none focus:border-ink"
            />
          </label>
        </div>

        {notice && !error && <p className="mt-4 font-hand text-base text-ink/60">{notice}</p>}
        {error && (
          <p role="alert" className="sketch-border-alt mt-4 border-pin/60 bg-pin/10 px-3 py-2 font-hand text-base text-pin">
            {error}
          </p>
        )}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2.5 font-hand text-lg text-ink/60 hover:text-ink">
            cancelar
          </button>
          <button
            type="submit"
            disabled={!photos.length || busy > 0 || saving}
            className="sketch-border flex items-center gap-2 border-ink bg-ink px-5 py-2.5 font-hand text-lg text-white shadow-[3px_4px_0_rgba(31,29,26,0.22)] transition hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <Doodle name="heart" className="h-4 w-4" />
            {saving ? 'guardando…' : 'guardar recuerdo'}
          </button>
        </div>
      </form>
    </div>
  )
}
