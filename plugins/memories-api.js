import fs from 'node:fs/promises'
import path from 'node:path'

/**
 * API local (solo en `npm run dev`) que guarda los recuerdos DENTRO del proyecto:
 *   public/recuerdos/*.jpg          → las fotos
 *   public/recuerdos/recuerdos.json → textos, fechas y estilo de cada polaroid
 * Al hacer `npm run build`, la carpeta public/ se copia al sitio publicado.
 */
const DIR = path.resolve('public/recuerdos')
const DATA_FILE = path.join(DIR, 'recuerdos.json')
const EMPTY = { names: ['', ''], memories: [] }
const DATA_URL_RE = /^data:image\/(jpeg|png|webp);base64,/
const STYLE_FIELDS = ['rotation', 'fastener', 'tape', 'tapeTilt']
const MIME = {
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.json': 'application/json',
}

async function readData() {
  try {
    return { ...EMPTY, ...JSON.parse(await fs.readFile(DATA_FILE, 'utf8')) }
  } catch {
    return structuredClone(EMPTY)
  }
}

async function writeData(data) {
  await fs.mkdir(DIR, { recursive: true })
  await fs.writeFile(DATA_FILE, `${JSON.stringify(data, null, 2)}\n`)
}

function readBody(req, limit = 60 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks = []
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > limit) reject(new Error('Las fotos pesan demasiado.'))
      else chunks.push(chunk)
    })
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'))
      } catch {
        reject(new Error('Datos inválidos.'))
      }
    })
    req.on('error', reject)
  })
}

function send(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

const text = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`

// Las escrituras se hacen una por una para no pisar el JSON
let queue = Promise.resolve()
const serial = (fn) => (queue = queue.then(fn, fn))

async function createMemory(body) {
  const photos = Array.isArray(body.photos) ? body.photos.slice(0, 4) : []
  if (!photos.length || !photos.every((p) => DATA_URL_RE.test(p))) {
    throw Object.assign(new Error('Faltan las fotos o no son imágenes válidas.'), { status: 400 })
  }

  const id = uid()
  await fs.mkdir(DIR, { recursive: true })
  const files = []
  for (const [i, dataUrl] of photos.entries()) {
    const ext = dataUrl.match(DATA_URL_RE)[1].replace('jpeg', 'jpg')
    const name = `${id}-${i + 1}.${ext}`
    await fs.writeFile(path.join(DIR, name), Buffer.from(dataUrl.replace(DATA_URL_RE, ''), 'base64'))
    files.push(`recuerdos/${name}`)
  }

  const memory = {
    id,
    photos: files,
    caption: text(body.caption, 80),
    place: text(body.place, 30),
    date: text(body.date, 10),
    createdAt: Number(body.createdAt) || Date.now(),
    ...Object.fromEntries(STYLE_FIELDS.filter((k) => k in body).map((k) => [k, body[k]])),
  }

  const data = await readData()
  data.memories.unshift(memory)
  await writeData(data)
  return memory
}

async function deleteMemory(id) {
  const data = await readData()
  const memory = data.memories.find((m) => m.id === id)
  if (!memory) return
  for (const p of memory.photos ?? []) {
    // path.basename evita borrar algo fuera de la carpeta
    await fs.rm(path.join(DIR, path.basename(p)), { force: true })
  }
  data.memories = data.memories.filter((m) => m.id !== id)
  await writeData(data)
}

async function saveNames(names) {
  const data = await readData()
  data.names = [text(names?.[0], 18), text(names?.[1], 18)]
  await writeData(data)
  return data.names
}

export default function memoriesApi() {
  return {
    name: 'memories-api',
    apply: 'serve',
    configureServer(server) {
      // Sirve las fotos recién subidas (Vite solo conoce los archivos de public/ que existían al arrancar)
      server.middlewares.use('/recuerdos', async (req, res, next) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') return next()
        const name = path.basename(decodeURIComponent((req.url ?? '').split('?')[0]))
        const type = MIME[path.extname(name).toLowerCase()]
        if (!type) return next()
        try {
          const file = await fs.readFile(path.join(DIR, name))
          res.setHeader('Content-Type', type)
          res.setHeader('Cache-Control', 'no-store')
          res.end(req.method === 'HEAD' ? undefined : file)
        } catch {
          next()
        }
      })

      server.middlewares.use('/api', async (req, res, next) => {
        const url = (req.url ?? '').split('?')[0]
        try {
          if (req.method === 'POST' && url === '/memories') {
            const body = await readBody(req)
            send(res, 201, await serial(() => createMemory(body)))
          } else if (req.method === 'DELETE' && url.startsWith('/memories/')) {
            const id = decodeURIComponent(url.slice('/memories/'.length))
            await serial(() => deleteMemory(id))
            send(res, 200, { ok: true })
          } else if (req.method === 'PUT' && url === '/names') {
            const body = await readBody(req)
            send(res, 200, { names: await serial(() => saveNames(body.names)) })
          } else {
            next()
          }
        } catch (e) {
          send(res, e.status ?? 500, { error: e.message })
        }
      })
    },
  }
}
