import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import type { PlanetVisualConfig } from '../../types/planet'
import PlanetMesh from '../components/PlanetMesh'
import OrbitTrail from '../components/OrbitTrail'

type OrbitalBodyProps = {
    config: PlanetVisualConfig
}

function OrbitalBody({ config }: OrbitalBodyProps) {
    const planetRef = useRef<Group>(null)

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

    const angleRef = useRef(initialAngle)
    const [trailAngle, setTrailAngle] = useState(initialAngle)

    useFrame((_, delta) => {
        angleRef.current += delta * config.orbitSpeed * 0.12

        const currentAngle = angleRef.current
        const x = Math.cos(currentAngle) * config.orbitRadius
        const z = Math.sin(currentAngle) * config.orbitRadius

        if (planetRef.current) {
        planetRef.current.position.x = x
        planetRef.current.position.z = z
        planetRef.current.rotation.y += delta * config.rotationSpeed * 2
        }

        setTrailAngle(currentAngle)
    })

    return (
        <group>
        <OrbitTrail radius={config.orbitRadius} angle={trailAngle} />
        <group ref={planetRef}>
            <PlanetMesh config={config} />
        </group>
        </group>
    )
}

export default OrbitalBody