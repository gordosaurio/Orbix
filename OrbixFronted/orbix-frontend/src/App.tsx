import SpaceScene from './scene/components/SpaceScene'

function App() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 z-0">
        <SpaceScene />
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
      </div>
    </div>
  )
}

export default App