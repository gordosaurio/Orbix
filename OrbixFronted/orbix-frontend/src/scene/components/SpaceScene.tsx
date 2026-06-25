import type { Dispatch, SetStateAction } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import SceneCamera from './SceneCamera'
import SceneLights from './SceneLights'
import SceneEnvironment from './SceneEnvironment'
import CameraControls from '../controls/CameraControls'
import SolarSystem from '../../celestial/systems/SolarSystem'
import SunMesh from '../../celestial/components/SunMesh'
import type { SelectedPlanetState } from '../../types/scene'

type SpaceSceneProps = {
    selectedPlanet: SelectedPlanetState | null
    setSelectedPlanet: Dispatch<SetStateAction<SelectedPlanetState | null>>
    resetToken: number
    onResetView: () => void
    initialCameraPosition: [number, number, number]
    initialTarget: [number, number, number]
}

function SpaceScene({
    selectedPlanet,
    setSelectedPlanet,
    resetToken,
    onResetView,
    initialCameraPosition,
    initialTarget,
    }: SpaceSceneProps) {
    return (
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
            resetToken={resetToken}
        />

        <SunMesh onSelect={onResetView} />

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
    )
}

export default SpaceScene