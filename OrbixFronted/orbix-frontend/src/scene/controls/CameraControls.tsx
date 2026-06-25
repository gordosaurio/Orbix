import { useEffect, useRef } from 'react'
import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import type { SelectedPlanetState } from '../../types/scene'

type CameraControlsProps = {
    selectedPlanet: SelectedPlanetState | null
    initialCameraPosition: [number, number, number]
    initialTarget: [number, number, number]
    resetToken: number
}

function CameraControls({
    selectedPlanet,
    initialCameraPosition,
    initialTarget,
    resetToken,
    }: CameraControlsProps) {
    const controlsRef = useRef<OrbitControlsImpl>(null)
    const { camera } = useThree()

    const initialCameraVec = useRef(new THREE.Vector3(...initialCameraPosition))
    const initialTargetVec = useRef(new THREE.Vector3(...initialTarget))

    const followTarget = useRef(new THREE.Vector3(...initialTarget))
    const followOffset = useRef(new THREE.Vector3(10, 4, 10))

    const desiredCameraPosition = useRef(new THREE.Vector3(...initialCameraPosition))
    const desiredTarget = useRef(new THREE.Vector3(...initialTarget))

    const previousSelectionId = useRef<string | null>(null)
    const isResetting = useRef(false)
    const isAutoZooming = useRef(false)

    useEffect(() => {
        desiredCameraPosition.current.copy(initialCameraVec.current)
        desiredTarget.current.copy(initialTargetVec.current)
        previousSelectionId.current = null
        isResetting.current = true
        isAutoZooming.current = false
    }, [resetToken])

    useEffect(() => {
        const controls = controlsRef.current
        if (!controls || !selectedPlanet) return

        const planetPos = new THREE.Vector3(...selectedPlanet.position)

        if (previousSelectionId.current !== selectedPlanet.id) {
        followTarget.current.copy(planetPos)

        const zoomDistance = Math.max(selectedPlanet.radius * 6, 3.5)
        const currentDirection = camera.position.clone().sub(controls.target)

        if (currentDirection.lengthSq() > 0.0001) {
            currentDirection.normalize().multiplyScalar(zoomDistance)
            followOffset.current.copy(currentDirection)
        } else {
            followOffset.current.set(zoomDistance, zoomDistance * 0.45, zoomDistance)
        }

        desiredTarget.current.copy(planetPos)
        desiredCameraPosition.current.copy(planetPos.clone().add(followOffset.current))

        previousSelectionId.current = selectedPlanet.id
        isResetting.current = false
        isAutoZooming.current = true
        }
    }, [selectedPlanet, camera])

    useFrame((_, delta) => {
        const controls = controlsRef.current
        if (!controls) return

        const followAlpha = 1 - Math.exp(-delta * 6)
        const resetAlpha = 1 - Math.exp(-delta * 4.5)
        const autoZoomAlpha = 1 - Math.exp(-delta * 7)

        if (isResetting.current) {
        camera.position.lerp(initialCameraVec.current, resetAlpha)
        controls.target.lerp(initialTargetVec.current, resetAlpha)
        controls.update()

        const distanceToCamera = camera.position.distanceTo(initialCameraVec.current)
        const distanceToTarget = controls.target.distanceTo(initialTargetVec.current)

        if (distanceToCamera < 0.05 && distanceToTarget < 0.05) {
            camera.position.copy(initialCameraVec.current)
            controls.target.copy(initialTargetVec.current)
            controls.update()
            isResetting.current = false
        }

        return
        }

        if (!selectedPlanet) {
        return
        }

        const livePlanetPosition = new THREE.Vector3(...selectedPlanet.position)
        followTarget.current.lerp(livePlanetPosition, followAlpha)

        if (isAutoZooming.current) {
        camera.position.lerp(desiredCameraPosition.current, autoZoomAlpha)
        controls.target.lerp(desiredTarget.current, autoZoomAlpha)
        controls.update()

        const distanceToCamera = camera.position.distanceTo(desiredCameraPosition.current)
        const distanceToTarget = controls.target.distanceTo(desiredTarget.current)

        if (distanceToCamera < 0.05 && distanceToTarget < 0.05) {
            camera.position.copy(desiredCameraPosition.current)
            controls.target.copy(desiredTarget.current)
            controls.update()
            isAutoZooming.current = false
        }

        followOffset.current.copy(camera.position).sub(controls.target)
        return
        }

        const nextCameraPosition = followTarget.current.clone().add(followOffset.current)

        camera.position.lerp(nextCameraPosition, followAlpha)
        controls.target.lerp(followTarget.current, followAlpha)
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
        minDistance={2}
        maxDistance={120}
        minPolarAngle={0.15}
        maxPolarAngle={Math.PI - 0.2}
        dampingFactor={0.09}
        enableDamping
        />
    )
}

export default CameraControls