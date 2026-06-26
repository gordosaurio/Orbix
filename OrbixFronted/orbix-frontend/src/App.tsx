import { useEffect, useMemo, useState } from 'react'
import SpaceScene from './scene/components/SpaceScene'
import PlanetInfoPanel from './components/planet/PlanetInfoPanel'
import type { SelectedPlanetState } from './types/scene'
import { getPlanetInfoById, getSunInfo } from './lib/api'

function App() {
  const [selectedPlanet, setSelectedPlanet] = useState<SelectedPlanetState | null>(null)
  const [resetToken, setResetToken] = useState(0)

  const initialCameraPosition = useMemo<[number, number, number]>(() => [0, 18, 42], [])
  const initialTarget = useMemo<[number, number, number]>(() => [0, 0, 0], [])

  const handleResetView = () => {
    setSelectedPlanet(null)
    setResetToken((prev) => prev + 1)
  }

  useEffect(() => {
    if (!selectedPlanet) return

    const fetchBodyInfo = async () => {
      try {
        if (selectedPlanet.kind === 'star') {
          const sunData = await getSunInfo()
          console.log('SUN INFO =>', sunData)
          return
        }

        const planetData = await getPlanetInfoById(selectedPlanet.id)
        console.log(`PLANET INFO (${selectedPlanet.id}) =>`, planetData)
      } catch (error) {
        console.error('Error fetching celestial body info:', error)
      }
    }

    void fetchBodyInfo()
  }, [selectedPlanet?.id, selectedPlanet?.kind])

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 z-0">
        <SpaceScene
          selectedPlanet={selectedPlanet}
          setSelectedPlanet={setSelectedPlanet}
          resetToken={resetToken}
          onResetView={handleResetView}
          initialCameraPosition={initialCameraPosition}
          initialTarget={initialTarget}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-10">
        <header className="pointer-events-auto flex items-start justify-between p-6 md:p-8">
          <div className="max-w-md">
            <p className="text-[10px] uppercase tracking-[0.45em] text-slate-400">
              Orbix
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-4xl">
              Solar System Explorer
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 md:text-base">
              A cinematic interactive journey through the Solar System.
            </p>
          </div>
        </header>

        <PlanetInfoPanel selectedBody={selectedPlanet} />
      </div>

      {selectedPlanet ? (
        <button
          type="button"
          onClick={handleResetView}
          className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-slate-950/75 text-2xl text-white backdrop-blur-md transition hover:bg-slate-900/85"
          aria-label="Volver a la vista inicial"
          title="Volver"
        >
          ×
        </button>
      ) : null}
    </div>
  )
}

export default App