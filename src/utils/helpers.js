export const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

export const randomBetween = (min, max) => Math.random() * (max - min) + min

export const pick = (list) => list[Math.floor(Math.random() * list.length)]

/** Fecha de hoy en formato YYYY-MM-DD según la zona horaria local */
export const todayISO = () => {
  const d = new Date()
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}

/** "2023-11-10" -> "10 nov 2023" */
export const formatDate = (iso) => {
  if (!iso) return ''
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return ''
  return d
    .toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })
    .replace(/\./g, '')
    .replace(/ de /g, ' ')
}

/** Ruta guardada ("recuerdos/x.jpg") -> URL que funciona en dev y en el sitio publicado */
export const photoUrl = (src) => (src.startsWith('data:') ? src : `${import.meta.env.BASE_URL}${src}`)

export const photosOf = (memory) => (memory.photos ?? (memory.src ? [memory.src] : [])).map(photoUrl)

export const MAX_PHOTOS = 4

const heart = (fill) =>
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24'%3E%3Cpath fill='${fill}' d='M12 21C4.5 15.5 2 11.5 3.2 7.8 4.4 4.3 8.8 3.8 12 7.5c3.2-3.7 7.6-3.2 8.8.3C22 11.5 19.5 15.5 12 21Z'/%3E%3C/svg%3E")`

const stripes = (c) => `repeating-linear-gradient(-45deg, ${c} 0 4px, transparent 4px 10px)`

export const TAPE_COLORS = [
  { base: 'rgba(232, 214, 207, 0.85)', pattern: stripes('rgba(255,255,255,.35)') }, // rosa empolvado
  { base: 'rgba(196, 222, 207, 0.85)', pattern: stripes('rgba(255,255,255,.4)') },  // menta
  { base: 'rgba(240, 222, 160, 0.85)', pattern: stripes('rgba(255,255,255,.4)') },  // mostaza suave
  { base: 'rgba(205, 200, 232, 0.85)', pattern: stripes('rgba(255,255,255,.4)') },  // lavanda
  { base: 'rgba(214, 196, 168, 0.85)', pattern: stripes('rgba(255,255,255,.3)') },  // kraft
  { base: 'rgba(232, 214, 207, 0.85)', pattern: heart('%23ffffff') },               // rosa empolvado con corazones
]

export const FASTENERS = ['binder', 'clip', 'tape', 'tape-corners', 'heart']
