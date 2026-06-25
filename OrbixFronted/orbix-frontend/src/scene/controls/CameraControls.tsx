import { OrbitControls } from '@react-three/drei'

function CameraControls() {
  return (
    <OrbitControls
      enablePan
      enableZoom
      enableRotate
      screenSpacePanning
      zoomSpeed={0.9}
      panSpeed={0.9}
      rotateSpeed={0.55}
      minDistance={8}
      maxDistance={120}
      minPolarAngle={0.15}
      maxPolarAngle={Math.PI - 0.2}
      dampingFactor={0.09}
      enableDamping
    />
  )
}

export default CameraControls