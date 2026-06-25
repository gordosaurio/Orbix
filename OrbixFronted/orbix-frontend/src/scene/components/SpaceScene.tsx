import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import SceneCamera from './SceneCamera'
import SceneLights from './SceneLights'
import SceneEnvironment from './SceneEnvironment'
import CameraControls from '../controls/CameraControls'
import SolarSystem from '../../celestial/systems/SolarSystem'

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

        <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[2.3, 64, 64]} />
            <meshStandardMaterial
            color="#f6e27a"
            emissive="#ffb347"
            emissiveIntensity={3}
            />
        </mesh>

        <SolarSystem />

        <EffectComposer>
            <Bloom
            intensity={0.2}
            luminanceThreshold={0.8}
            luminanceSmoothing={0.2}
            mipmapBlur
            />
        </EffectComposer>
        </Canvas>
    )
}

export default SpaceScene