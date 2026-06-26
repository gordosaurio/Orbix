import { useMemo, useState } from 'react'
import SpaceScene from './scene/components/SpaceScene'
import type { SelectedPlanetState } from './types/scene'

const planetUiMap: Record<
  string,
  {
    accent: string
    eyebrow: string
    summary: string
    facts: { label: string; value: string }[]
  }
> = {
  mercury: {
    accent: '#aeb4c4',
    eyebrow: 'Inner world',
    summary:
      'The swiftest planet in the system, shaped by extreme sunlight and long shadows.',
    facts: [
      { label: 'Orbit class', value: 'Terrestrial' },
      { label: 'Atmosphere', value: 'Extremely thin exosphere' },
      { label: 'Daylight feel', value: 'Harsh, metallic, cratered' },
      { label: 'Mood', value: 'Fast, silent, scorched' },
    ],
  },
  venus: {
    accent: '#d9b17a',
    eyebrow: 'Veiled world',
    summary:
      'A dense and radiant planet wrapped in thick clouds and a powerful golden glow.',
    facts: [
      { label: 'Orbit class', value: 'Terrestrial' },
      { label: 'Atmosphere', value: 'Dense carbon-rich cloud layer' },
      { label: 'Surface feel', value: 'Pressurized, volcanic, hidden' },
      { label: 'Mood', value: 'Bright, heavy, mysterious' },
    ],
  },
  earth: {
    accent: '#58a6ff',
    eyebrow: 'Living world',
    summary:
      'A balanced blue sphere where oceans, atmosphere, and light create a familiar calm.',
    facts: [
      { label: 'Orbit class', value: 'Terrestrial' },
      { label: 'Atmosphere', value: 'Nitrogen-oxygen rich' },
      { label: 'Surface feel', value: 'Oceanic, dynamic, habitable' },
      { label: 'Mood', value: 'Alive, vivid, stable' },
    ],
  },
  mars: {
    accent: '#d97757',
    eyebrow: 'Red frontier',
    summary:
      'A dry rust-colored desert planet marked by dust, rock basins, and cold horizons.',
    facts: [
      { label: 'Orbit class', value: 'Terrestrial' },
      { label: 'Atmosphere', value: 'Thin carbon dioxide layer' },
      { label: 'Surface feel', value: 'Dusty, rocky, cold' },
      { label: 'Mood', value: 'Remote, cinematic, austere' },
    ],
  },
  jupiter: {
    accent: '#d7b089',
    eyebrow: 'Gas giant',
    summary:
      'A colossal striped atmosphere in constant motion, filled with storms and layered clouds.',
    facts: [
      { label: 'Orbit class', value: 'Gas giant' },
      { label: 'Atmosphere', value: 'Hydrogen and helium' },
      { label: 'Surface feel', value: 'No solid surface visible' },
      { label: 'Mood', value: 'Massive, stormy, dominant' },
    ],
  },
  saturn: {
    accent: '#d8c18a',
    eyebrow: 'Ringed giant',
    summary:
      'A pale golden world defined by elegant rings and a soft atmospheric banding.',
    facts: [
      { label: 'Orbit class', value: 'Gas giant' },
      { label: 'Atmosphere', value: 'Hydrogen and helium' },
      { label: 'Signature', value: 'Iconic ring system' },
      { label: 'Mood', value: 'Graceful, expansive, iconic' },
    ],
  },
  uranus: {
    accent: '#8cc8d8',
    eyebrow: 'Ice giant',
    summary:
      'A serene cyan planet with a cold atmosphere and a quietly unusual axial tilt.',
    facts: [
      { label: 'Orbit class', value: 'Ice giant' },
      { label: 'Atmosphere', value: 'Hydrogen, helium, methane' },
      { label: 'Surface feel', value: 'Diffuse, icy, distant' },
      { label: 'Mood', value: 'Cool, minimal, quiet' },
    ],
  },
  neptune: {
    accent: '#5b7fff',
    eyebrow: 'Deep blue giant',
    summary:
      'A dark luminous world of fast winds, saturated blues, and far-edge intensity.',
    facts: [
      { label: 'Orbit class', value: 'Ice giant' },
      { label: 'Atmosphere', value: 'Hydrogen, helium, methane' },
      { label: 'Surface feel', value: 'Windy, dark, energetic' },
      { label: 'Mood', value: 'Deep, cold, dramatic' },
    ],
  },
}

function App() {
  const [selectedPlanet, setSelectedPlanet] = useState<SelectedPlanetState | null>(null)
  const [resetToken, setResetToken] = useState(0)

  const initialCameraPosition = useMemo<[number, number, number]>(() => [0, 18, 42], [])
  const initialTarget = useMemo<[number, number, number]>(() => [0, 0, 0], [])

  const handleResetView = () => {
    setSelectedPlanet(null)
    setResetToken((prev) => prev + 1)
  }

  const selectedPlanetUi = selectedPlanet ? planetUiMap[selectedPlanet.id] : null

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

        <aside className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-auto md:right-8 md:top-24 md:w-[380px]">
          <div
            className={[
              'pointer-events-auto relative overflow-hidden rounded-[28px] border',
              'border-white/10 bg-slate-950/50 backdrop-blur-2xl',
              'shadow-[0_12px_60px_rgba(0,0,0,0.45)]',
              'transition-all duration-500 ease-out',
              selectedPlanet ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0',
            ].join(' ')}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_22%),radial-gradient(circle_at_20%_0%,rgba(96,165,250,0.16),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.01))]" />
            <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />

            {selectedPlanet && selectedPlanetUi ? (
              <div className="relative p-5 md:p-6">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p
                      className="text-[11px] uppercase tracking-[0.38em]"
                      style={{ color: selectedPlanetUi.accent }}
                    >
                      {selectedPlanetUi.eyebrow}
                    </p>
                    <h2
                      className="mt-3 text-3xl font-semibold tracking-tight"
                      style={{ color: selectedPlanetUi.accent }}
                    >
                      {selectedPlanet.name}
                    </h2>
                    <p className="mt-3 max-w-[30ch] text-sm leading-6 text-slate-300">
                      {selectedPlanetUi.summary}
                    </p>
                  </div>

                  <div
                    className="mt-1 h-3 w-3 shrink-0 rounded-full shadow-[0_0_24px_currentColor]"
                    style={{ backgroundColor: selectedPlanetUi.accent, color: selectedPlanetUi.accent }}
                  />
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
                    <p className="text-[11px] uppercase tracking-[0.32em] text-slate-500">
                      Live focus
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      Camera locked to selected body. Click the Sun or the close button to return to the overview.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
                      <p className="text-[11px] uppercase tracking-[0.32em] text-slate-500">
                        Visual radius
                      </p>
                      <p className="mt-3 text-lg font-medium text-white">
                        {selectedPlanet.radius.toFixed(2)}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
                      <p className="text-[11px] uppercase tracking-[0.32em] text-slate-500">
                        Position
                      </p>
                      <p className="mt-3 text-sm font-medium text-white">
                        {selectedPlanet.position[0].toFixed(1)}, {selectedPlanet.position[2].toFixed(1)}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
                    <p className="text-[11px] uppercase tracking-[0.32em] text-slate-500">
                      Snapshot
                    </p>

                    <div className="mt-4 space-y-3">
                      {selectedPlanetUi.facts.map((fact) => (
                        <div
                          key={fact.label}
                          className="flex items-start justify-between gap-4 border-b border-white/6 pb-3 last:border-b-0 last:pb-0"
                        >
                          <span className="text-sm text-slate-400">{fact.label}</span>
                          <span className="max-w-[12rem] text-right text-sm font-medium text-slate-100">
                            {fact.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative p-5 md:p-6">
                <p className="text-[11px] uppercase tracking-[0.38em] text-slate-500">
                  Orbital archive
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                  Select a planet
                </h2>
                <p className="mt-3 max-w-[32ch] text-sm leading-6 text-slate-300">
                  Click any planet in the scene to open its focused profile. This panel is already prepared for future backend data.
                </p>

                <div className="mt-6 rounded-2xl border border-white/8 bg-white/4 p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-sky-300 shadow-[0_0_18px_rgba(125,211,252,0.85)]" />
                    <p className="text-sm text-slate-300">
                      Awaiting celestial selection
                    </p>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/6 bg-black/10 p-4">
                      <p className="text-[11px] uppercase tracking-[0.32em] text-slate-500">
                        Mode
                      </p>
                      <p className="mt-3 text-sm font-medium text-white">
                        Overview
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/6 bg-black/10 p-4">
                      <p className="text-[11px] uppercase tracking-[0.32em] text-slate-500">
                        Data
                      </p>
                      <p className="mt-3 text-sm font-medium text-white">
                        Visual shell ready
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
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