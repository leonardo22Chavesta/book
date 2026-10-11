import { useMemo } from 'react'
import { Doodle } from './Doodles'

/** Lluvia de corazones (y algún avioncito) al pegar un recuerdo nuevo */
export default function HeartBurst() {
  const hearts = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: 5 + Math.random() * 90,
        size: 14 + Math.random() * 22,
        delay: Math.random() * 0.5,
        tilt: -25 + Math.random() * 50,
        shape: i % 5 === 0 ? 'paperPlane' : Math.random() > 0.6 ? 'heartOutline' : 'heart',
      })),
    [],
  )

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] overflow-hidden" aria-hidden="true">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="animate-rise absolute -bottom-10"
          style={{ left: `${h.left}%`, animationDelay: `${h.delay}s`, '--tilt': `${h.tilt}deg` }}
        >
          <Doodle
            name={h.shape}
            className="text-ink"
            strokeWidth={2.5}
            style={{ width: h.size, height: h.size }}
          />
        </span>
      ))}
    </div>
  )
}
