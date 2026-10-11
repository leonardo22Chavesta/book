/**
 * Coloca 1 a 4 fotos como cuadritos dentro del marco polaroid:
 *  1 → foto completa · 2 → lado a lado · 3 → una grande y dos chicas · 4 → 2×2
 */
export default function PhotoCollage({ photos, alt = 'Recuerdo' }) {
  if (photos.length === 1) {
    return (
      <div className="photo-frame overflow-hidden bg-neutral-200">
        <img src={photos[0]} alt={alt} loading="lazy" decoding="async" className="photo-vintage block h-auto w-full" />
      </div>
    )
  }

  const cell = (src, i, extra = 'aspect-square') => (
    <div key={i} className={`photo-frame overflow-hidden bg-neutral-200 ${extra}`}>
      <img src={src} alt={`${alt} (${i + 1})`} loading="lazy" decoding="async" className="photo-vintage h-full w-full object-cover" />
    </div>
  )

  return (
    <div className="grid grid-cols-2 gap-1 sm:gap-1.5">
      {photos.length === 2 && photos.map((src, i) => cell(src, i, 'aspect-[3/4]'))}
      {photos.length === 3 && [cell(photos[0], 0, 'col-span-2 aspect-[4/3]'), cell(photos[1], 1), cell(photos[2], 2)]}
      {photos.length >= 4 && photos.slice(0, 4).map((src, i) => cell(src, i))}
    </div>
  )
}
