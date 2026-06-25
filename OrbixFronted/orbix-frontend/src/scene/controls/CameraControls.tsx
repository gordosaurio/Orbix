import { useEffect, useRef } from 'react'
import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import type { SelectedPlanetState } from '../components/SpaceScene'

type CameraControlsProps = {
    selectedPlanet: SelectedPlanetState | null
    initialCameraPosition: [number, number, number]
    initialTarget: [number, number, number]
}

function CameraControls({
    selectedPlanet,
    initialCameraPosition,
    initialTarget,
    }: CameraControlsProps) {
    const controlsRef = useRef<OrbitControlsImpl>(null)
    const { camera } = useThree()

    const freeTarget = useRef(new THREE.Vector3(...initialTarget))
    const freeCameraPosition = useRef(new THREE.Vector3(...initialCameraPosition))

    const followTarget = useRef(new THREE.Vector3(...initialTarget))
    const followOffset = useRef(new THREE.Vector3(10, 4, 10))

    const previousSelectionId = useRef<string | null>(null)

    useEffect(() => {
        if (!controlsRef.current) return

        if (!selectedPlanet) {
        camera.position.copy(freeCameraPosition.current)
        controlsRef.current.target.copy(freeTarget.current)
        controlsRef.current.update()
        previousSelectionId.current = null
        return
        }

        const planetPos = new THREE.Vector3(...selectedPlanet.position)

        if (previousSelectionId.current !== selectedPlanet.id) {
        const currentOffset = camera.position.clone().sub(controlsRef.current.target)

        followOffset.current.copy(currentOffset)
        followTarget.current.copy(planetPos)

        previousSelectionId.current = selectedPlanet.id
        }
    }, [selectedPlanet, camera])

    useFrame((_, delta) => {
        const controls = controlsRef.current
        if (!controls) return

        const lerpAlpha = 1 - Math.exp(-delta * 6)

        if (!selectedPlanet) {
        freeTarget.current.copy(controls.target)
        freeCameraPosition.current.copy(camera.position)
        return
        }

        const livePlanetPosition = new THREE.Vector3(...selectedPlanet.position)

        followTarget.current.lerp(livePlanetPosition, lerpAlpha)

        const desiredCameraPosition = followTarget.current.clone().add(followOffset.current)

        camera.position.lerp(desiredCameraPosition, lerpAlpha)
        controls.target.lerp(followTarget.current, lerpAlpha)
        controls.update()

        followOffset.current.copy(camera.position).sub(controls.target)
    })

    return (
        <OrbitControls
        ref={controlsRef}
        enablePan
        enableZoom
        enableRotate
        screenSpacePanning
        zoomSpeed={0.9}
        panSpeed={0.9}
        rotateSpeed={0.55}
        minDistance={4}
        maxDistance={120}
        minPolarAngle={0.15}
        maxPolarAngle={Math.PI - 0.2}
        dampingFactor={0.09}
        enableDamping
        />
    )
}

export default CameraControls