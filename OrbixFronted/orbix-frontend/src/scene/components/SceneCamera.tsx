import { PerspectiveCamera } from '@react-three/drei'

function SceneCamera() {
    return (
        <PerspectiveCamera
        makeDefault
        position={[0, 18, 42]}
        fov={42}
        near={0.1}
        far={300}
        />
    )
}

export default SceneCamera