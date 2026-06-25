import type { PlanetRingConfig } from '../../types/planet'

type PlanetRingProps = {
    config: PlanetRingConfig
}

function PlanetRing({ config }: PlanetRingProps) {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[config.innerRadius, config.outerRadius, 128]} />
        <meshBasicMaterial
            color={config.color}
            transparent
            opacity={config.opacity}
            depthWrite={false}
            side={2}
        />
        </mesh>
    )
}

export default PlanetRing