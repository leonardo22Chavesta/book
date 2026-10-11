import { useCallback, useEffect, useRef, useState } from 'react'
import { FASTENERS, TAPE_COLORS, pick, randomBetween } from '../utils/helpers'

/**
 * Los recuerdos viven en public/recuerdos/ (fotos + recuerdos.json).
 * - En `npm run dev` se pueden subir y borrar: la API local escribe en esa carpeta.
 * - En el sitio publicado solo se leen (es un sitio estático).
 */
export const CAN_EDIT = import.meta.env.DEV

const DATA_URL = `${import.meta.env.BASE_URL}recuerdos/recuerdos.json`
const LEGACY_KEY = 'book-de-recuerdos:v1' // versión anterior guardada en localStorage

const randomStyle = () => ({
  rotation: Number(randomBetween(-4.5, 4.5).toFixed(2)),
  fastener: pick(FASTENERS),
  tape: Math.floor(Math.random() * TAPE_COLORS.length),
  tapeTilt: Number(randomBetween(-9, 9).toFixed(1)),
})

async function request(method, url, body) {
  const res = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'No se pudo guardar. ¿Está corriendo npm run dev?')
  return data
}

function readLegacy() {
  try {
    const parsed = JSON.parse(localStorage.getItem(LEGACY_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

let migrating = false // evita correrlo dos veces (StrictMode monta los efectos dos veces)

async function migrateLegacy(onAdded) {
  if (!CAN_EDIT || migrating) return
  let remaining = readLegacy()
  if (!remaining.length) return
  migrating = true
  try {
    // del más antiguo al más nuevo, para mantener el orden
    for (const old of [...remaining].reverse()) {
      const photos = old.photos ?? (old.src ? [old.src] : [])
      if (photos.length) {
        const { caption, place, date, createdAt, rotation, fastener, tape, tapeTilt } = old
        onAdded(await request('POST', '/api/memories', {
          photos, caption, place, date, createdAt, rotation, fastener, tape, tapeTilt,
        }))
      }
      // se quita del navegador apenas se guarda, así un fallo a medias no duplica nada
      remaining = remaining.filter((m) => m !== old)
      localStorage.setItem(LEGACY_KEY, JSON.stringify(remaining))
    }
    localStorage.removeItem(LEGACY_KEY)
    localStorage.removeItem('book-de-recuerdos:pareja')
  } catch {
    /* se reintenta la próxima vez que se abra la página */
  } finally {
    migrating = false
  }
}

export function useMemories() {
  const [memories, setMemories] = useState([])
  const [names, setNamesState] = useState(['', ''])
  const [loading, setLoading] = useState(true)
  const namesTimer = useRef(null)

  useEffect(() => {
    let alive = true
    fetch(DATA_URL, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : {}))
      .catch(() => ({}))
      .then((data) => {
        if (!alive) return
        setMemories(Array.isArray(data.memories) ? data.memories : [])
        setNamesState(Array.isArray(data.names) ? data.names : ['', ''])
        setLoading(false)
        // Fotos de la versión anterior (localStorage): se pasan solas a la carpeta del proyecto
        migrateLegacy((memory) => alive && setMemories((prev) => [memory, ...prev].sort((a, b) => b.createdAt - a.createdAt)))
      })
    return () => {
      alive = false
    }
  }, [])

  const addMemory = useCallback(async ({ photos, caption = '', place = '', date = '' }) => {
    if (!CAN_EDIT) return { ok: false, error: 'Para agregar recuerdos abre el proyecto con npm run dev.' }
    try {
      const memory = await request('POST', '/api/memories', { photos, caption, place, date, ...randomStyle() })
      setMemories((prev) => [memory, ...prev])
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e.message }
    }
  }, [])

  const removeMemory = useCallback(async (id) => {
    if (!CAN_EDIT) return false
    try {
      await request('DELETE', `/api/memories/${encodeURIComponent(id)}`)
      setMemories((prev) => prev.filter((m) => m.id !== id))
      return true
    } catch {
      return false
    }
  }, [])

  // Los nombres se guardan en recuerdos.json un momento después de dejar de escribir
  const setNames = useCallback((next) => {
    setNamesState(next)
    if (!CAN_EDIT) return
    clearTimeout(namesTimer.current)
    namesTimer.current = setTimeout(() => request('PUT', '/api/names', { names: next }).catch(() => {}), 600)
  }, [])

  return { memories, loading, names, setNames, addMemory, removeMemory }
}
