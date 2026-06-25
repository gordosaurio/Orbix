import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Group, Mesh } from 'three'
import type { PlanetVisualConfig } from '../../types/planet'
import type { SelectedPlanetState } from '../../types/scene'
import PlanetMesh from '../components/PlanetMesh'
import OrbitTrail from '../components/OrbitTrail'

type OrbitalBodyProps = {
    config: PlanetVisualConfig
    isSelected: boolean
    onSelectPlanet: (planet: SelectedPlanetState) => void
    onPlanetPositionChange: (planet: SelectedPlanetState) => void
}

function OrbitalBody({
    config,
    isSelected,
    onSelectPlanet,
    onPlanetPositionChange,
    }: OrbitalBodyProps) {
    const orbitRef = useRef<Group>(null)
    const planetMeshRef = useRef<Mesh>(null)
    const worldPosition = useRef(new THREE.Vector3())

    const initialAngle = useMemo(() => {
        const angleMap: Record<string, number> = {
        mercury: 0.2,
        venus: 0.8,
        earth: 1.4,
        mars: 2.1,
        jupiter: 2.8,
        saturn: 3.5,
        uranus: 4.2,
        neptune: 5.0,
        }

        return angleMap[config.id] ?? 0
    }, [config.id])

    const axialRotationSpeed = useMemo(() => {
        const minOrbit = 7.5
        const maxOrbit = 38
        const normalized = 1 - (config.orbitRadius - minOrbit) / (maxOrbit - minOrbit)
        const clamped = Math.max(0, Math.min(1, normalized))

        const minSpin = 0.25
        const maxSpin = 1.4

        return minSpin + clamped * (maxSpin - minSpin)
    }, [config.orbitRadius])

    const angleRef = useRef(initialAngle)
    const [trailAngle, setTrailAngle] = useState(initialAngle)

    useFrame((_, delta) => {
        angleRef.current += delta * config.orbitSpeed * 0.12

        const currentAngle = angleRef.current
        const x = Math.cos(currentAngle) * config.orbitRadius
        const z = Math.sin(currentAngle) * config.orbitRadius

        if (orbitRef.current) {
        orbitRef.current.position.x = x
        orbitRef.current.position.z = z
        orbitRef.current.getWorldPosition(worldPosition.current)
        }

        if (planetMeshRef.current) {
        planetMeshRef.current.rotation.y += delta * axialRotationSpeed
        }

        if (isSelected) {
        const p = worldPosition.current
        onPlanetPositionChange({
            id: config.id,
            name: config.name,
            radius: config.radius,
            position: [p.x, p.y, p.z],
        })
        }

        setTrailAngle(currentAngle)
    })

    const handleSelect = () => {
        const p = worldPosition.current
        onSelectPlanet({
        id: config.id,
        name: config.name,
        radius: config.radius,
        position: [p.x, p.y, p.z],
        })
    }

    return (
        <group>
        <OrbitTrail radius={config.orbitRadius} angle={trailAngle} />

        <group ref={orbitRef}>
            <PlanetMesh
            ref={planetMeshRef}
            config={config}
            onSelect={handleSelect}
            />
        </group>
        </group>
    )
}

export default OrbitalBody