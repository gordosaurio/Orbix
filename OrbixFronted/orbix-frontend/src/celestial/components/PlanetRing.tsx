import { useMemo } from 'react'
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'
import * as THREE from 'three'
import type { PlanetRingConfig } from '../../types/planet'

type PlanetRingProps = {
    config: PlanetRingConfig
}

function PlanetRing({ config }: PlanetRingProps) {
    const texturePath = config.texturePath

    const loadedTexture = useLoader(
        TextureLoader,
        texturePath ?? '/textures/saturn_ring.png'
    )

    const ringTexture = useMemo(() => {
        if (!texturePath) return null

        const texture = loadedTexture.clone()
        texture.colorSpace = THREE.SRGBColorSpace
        texture.needsUpdate = true
        return texture
    }, [loadedTexture, texturePath])


    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[config.innerRadius, config.outerRadius, 128]} />
        <meshBasicMaterial
            map={ringTexture ?? undefined}
            color={ringTexture ? '#ffffff' : config.color}
            transparent
            opacity={config.opacity}
            depthWrite={false}
            side={THREE.DoubleSide}
        />
        </mesh>
    )
}

export default PlanetRing