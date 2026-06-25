import { OrbitControls } from '@react-three/drei'

function CameraControls() {
    return (
        <OrbitControls
        enablePan
        enableZoom
        enableRotate
        zoomSpeed={0.7}
        panSpeed={0.6}
        rotateSpeed={0.45}
        minDistance={10}
        maxDistance={90}
        maxPolarAngle={Math.PI / 1.85}
        minPolarAngle={0.2}
        dampingFactor={0.08}
        enableDamping
        />
    )
}

export default CameraControls