import { useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import SceneCamera from './SceneCamera'
import SceneLights from './SceneLights'
import SceneEnvironment from './SceneEnvironment'
import CameraControls from '../controls/CameraControls'
import SolarSystem from '../../celestial/systems/SolarSystem'
import SunMesh from '../../celestial/components/SunMesh'

export type SelectedPlanetState = {
    id: string
    name: string
    radius: number
    position: [number, number, number]
}

function SpaceScene() {
    const [selectedPlanet, setSelectedPlanet] = useState<SelectedPlanetState | null>(null)

    const initialCameraPosition = useMemo<[number, number, number]>(() => [0, 18, 42], [])
    const initialTarget = useMemo<[number, number, number]>(() => [0, 0, 0], [])

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        {selectedPlanet ? (
            <button
            onClick={() => setSelectedPlanet(null)}
            style={{
                position: 'absolute',
                top: 20,
                right: 20,
                zIndex: 20,
                width: 42,
                height: 42,
                borderRadius: '999px',
                border: '1px solid rgba(255,255,255,0.18)',
                background: 'rgba(10,14,24,0.78)',
                color: '#ffffff',
                fontSize: 22,
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
            }}
            aria-label="Volver a la vista libre"
            title="Volver"
            >
            ×
            </button>
        ) : null}

        <Canvas
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: false }}
            camera={{ position: initialCameraPosition, fov: 42, near: 0.1, far: 300 }}
        >
            <color attach="background" args={['#02040a']} />

            <SceneCamera />
            <SceneLights />
            <SceneEnvironment />

            <CameraControls
            selectedPlanet={selectedPlanet}
            initialCameraPosition={initialCameraPosition}
            initialTarget={initialTarget}
            />

            <SunMesh />

            <SolarSystem
            selectedPlanetId={selectedPlanet?.id ?? null}
            onSelectPlanet={setSelectedPlanet}
            onPlanetPositionChange={(planet) => {
                setSelectedPlanet((current) => {
                if (!current || current.id !== planet.id) return current
                return { ...current, position: planet.position }
                })
            }}
            />

            <EffectComposer>
            <Bloom
                intensity={0.08}
                luminanceThreshold={0.15}
                luminanceSmoothing={0.45}
                mipmapBlur
            />
            </EffectComposer>
        </Canvas>
        </div>
    )
}

export default SpaceScene