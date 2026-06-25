import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import SceneCamera from './SceneCamera'
import SceneLights from './SceneLights'
import SceneEnvironment from './SceneEnvironment'
import CameraControls from '../controls/CameraControls'
import SolarSystem from '../../celestial/systems/SolarSystem'
import SunMesh from '../../celestial/components/SunMesh'

function SpaceScene() {
    return (
        <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
        camera={{ position: [0, 18, 42], fov: 42, near: 0.1, far: 300 }}
        >
        <color attach="background" args={['#02040a']} />

        <SceneCamera />
        <SceneLights />
        <SceneEnvironment />
        <CameraControls />

        <SunMesh />

        <SolarSystem />

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