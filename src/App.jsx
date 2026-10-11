import { Fragment, useCallback, useState } from 'react'
import { CAN_EDIT, useMemories } from './hooks/useMemories'
import { useGlobalFileDrop } from './hooks/useGlobalFileDrop'
import { useScrollLock } from './hooks/useScrollLock'
import { Doodle, FlightPath, RoughFilter } from './components/Doodles'
import Header from './components/Header'
import EmptyState from './components/EmptyState'
import EmptySlot from './components/EmptySlot'
import PolaroidCard from './components/PolaroidCard'
import Sticker from './components/Sticker'
import UploadModal from './components/UploadModal'
import Lightbox from './components/Lightbox'
import HeartBurst from './components/HeartBurst'

export default function App() {
  const { memories, loading, names, setNames, addMemory, removeMemory } = useMemories()
  const [uploadOpen, setUploadOpen] = useState(false)
  const [droppedFiles, setDroppedFiles] = useState(null)
  const [viewing, setViewing] = useState(null) // índice en el lightbox
  const [burst, setBurst] = useState(0) // cambia para lanzar corazones

  const openUpload = useCallback(() => setUploadOpen(true), [])
  const closeUpload = useCallback(() => {
    setUploadOpen(false)
    setDroppedFiles(null)
  }, [])

  const dragging = useGlobalFileDrop((files) => {
    setViewing(null)
    setDroppedFiles(files)
    setUploadOpen(true)
  }, CAN_EDIT)

  useScrollLock(uploadOpen || viewing !== null)

  const handleSave = useCallback(
    async (data) => {
      const result = await addMemory(data)
      if (result.ok) {
        setBurst(Date.now())
        setTimeout(() => setBurst(0), 2600)
      }
      return result
    },
    [addMemory],
  )

  const handleDelete = async (id) => {
    const remaining = memories.length - 1
    if (!(await removeMemory(id))) return
    setViewing((i) => (remaining <= 0 ? null : Math.min(i, remaining - 1)))
  }

  // Cuadritos vacíos al final del muro para invitar a seguir llenándolo
  const emptySlots = memories.length % 2 === 0 ? 2 : 3
  const [name1, name2] = names

  return (
    <div className="min-h-dvh md:px-6 md:py-8">
      <RoughFilter />

      <main className="paper-bg relative mx-auto min-h-dvh max-w-6xl overflow-x-clip md:min-h-[calc(100dvh-4rem)] md:rounded-sm md:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)]">
        <Header count={memories.length} names={names} onNamesChange={setNames} editable={CAN_EDIT} />


        {loading ? (
          <div className="flex flex-col items-center gap-2 py-24 font-hand text-lg text-ink/50">
            <Doodle name="paperPlane" className="animate-float h-10 w-10" />
            cargando recuerdos…
          </div>
        ) : memories.length === 0 ? (
          <EmptyState onAdd={openUpload} editable={CAN_EDIT} />
        ) : (
          <section className="columns-2 gap-x-4 px-4 pt-4 pb-36 sm:columns-3 sm:gap-x-8 sm:px-8 lg:columns-4 lg:px-12">
            {memories.map((memory, i) => (
              <Fragment key={memory.id}>
                <PolaroidCard
                  memory={memory}
                  index={i}
                  onOpen={() => setViewing(i)}
                  onDelete={CAN_EDIT ? () => removeMemory(memory.id) : null}
                />
                {i % 3 === 1 && <Sticker variant={Math.floor(i / 3)} />}
              </Fragment>
            ))}
            {CAN_EDIT &&
              Array.from({ length: emptySlots }, (_, i) => (
                <EmptySlot key={`slot-${i}`} variant={i} onAdd={openUpload} />
              ))}
          </section>
        )}

        <footer className="pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center gap-1 px-8 text-ink/40">
          <FlightPath className="h-9 w-48" />
          <p className="font-hand text-sm">
            {name1 && name2 ? `${name1} & ${name2}` : 'tú & yo'} · próximo destino: para siempre ♡
          </p>
        </footer>
      </main>

      {CAN_EDIT && (
        <button
          type="button"
          onClick={openUpload}
          className="sketch-border fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-40 flex items-center gap-2 border-ink bg-ink py-3 pr-5 pl-4 font-hand text-lg text-white shadow-[4px_6px_0_rgba(31,29,26,0.22)] transition hover:-translate-y-1 hover:rotate-[-2deg] active:translate-y-0 active:scale-95 md:right-10 md:bottom-10"
        >
          <Doodle name="heart" className="animate-beat h-5 w-5" />
          nuevo recuerdo
        </button>
      )}

      {uploadOpen && <UploadModal files={droppedFiles} onClose={closeUpload} onSave={handleSave} />}

      {viewing !== null && (
        <Lightbox
          memories={memories}
          index={viewing}
          onClose={() => setViewing(null)}
          onNavigate={setViewing}
          onDelete={CAN_EDIT ? handleDelete : null}
        />
      )}

      {burst > 0 && <HeartBurst key={burst} />}

      {/* overlay al arrastrar archivos */}
      {dragging && (
        <div className="animate-fade pointer-events-none fixed inset-0 z-[60] flex items-center justify-center bg-paper/85 p-6">
          <div className="sketch-border flex w-full max-w-lg flex-col items-center gap-3 border-dashed border-ink bg-white/60 px-6 py-14 text-center">
            <div className="flex items-end gap-2">
              <Doodle name="suitcase" className="animate-wiggle h-16 w-16" />
              <Doodle name="heart" className="animate-beat mb-2 h-6 w-6" />
            </div>
            <p className="font-script text-4xl font-bold">suelta sus fotos aquí</p>
            <p className="font-hand text-ink/60">hasta 4 por recuerdo ♡</p>
          </div>
        </div>
      )}
    </div>
  )
}
