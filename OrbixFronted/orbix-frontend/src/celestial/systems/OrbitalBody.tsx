import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import type { PlanetVisualConfig } from '../../types/planet'
import PlanetMesh from '../components/PlanetMesh'

type OrbitalBodyProps = {
    config: PlanetVisualConfig
}

function OrbitalBody({ config }: OrbitalBodyProps) {
    const orbitRef = useRef<Group>(null)
    const planetRef = useRef<Group>(null)

    useFrame((_, delta) => {
        if (orbitRef.current) {
        orbitRef.current.rotation.y += delta * config.orbitSpeed * 0.12
        }

        if (planetRef.current) {
        planetRef.current.rotation.y += delta * config.rotationSpeed * 2
        }
    })

    return (
        <group ref={orbitRef}>
        <group position={[config.orbitRadius, 0, 0]} ref={planetRef}>
            <PlanetMesh config={config} />
        </group>
        </group>
    )
}

export default OrbitalBody