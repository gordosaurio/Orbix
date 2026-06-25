import type { PlanetVisualConfig } from '../../types/planet'
import PlanetRing from './PlanetRing'

type PlanetMeshProps = {
    config: PlanetVisualConfig
}

function PlanetMesh({ config }: PlanetMeshProps) {
    return (
        <group>
        <mesh>
            <sphereGeometry args={[config.radius, 48, 48]} />
            <meshStandardMaterial
            color={config.color}
            emissive={config.emissive ?? '#000000'}
            emissiveIntensity={config.emissiveIntensity ?? 0}
            roughness={0.95}
            metalness={0}
            />
        </mesh>

        {config.ring ? <PlanetRing config={config.ring} /> : null}
        </group>
    )
}

export default PlanetMesh