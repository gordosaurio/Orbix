import { forwardRef, useMemo } from 'react'
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'
import * as THREE from 'three'
import type { Mesh } from 'three'
import type { PlanetVisualConfig } from '../../types/planet'
import PlanetRing from './PlanetRing'

type PlanetMeshProps = {
    config: PlanetVisualConfig
}

const PlanetMesh = forwardRef<Mesh, PlanetMeshProps>(function PlanetMesh(
    { config },
    ref
    ) {
    const texturePath = config.texturePath

    const loadedTexture = useLoader(
        TextureLoader,
        texturePath ?? '/textures/mercury.jpg'
    )

    const planetTexture = useMemo(() => {
        if (!texturePath) return null

        const texture = loadedTexture.clone()
        texture.colorSpace = THREE.SRGBColorSpace
        texture.needsUpdate = true
        return texture
    }, [loadedTexture, texturePath])

    return (
        <group>
        <mesh ref={ref}>
            <sphereGeometry args={[config.radius, 48, 48]} />
            <meshStandardMaterial
            map={planetTexture ?? undefined}
            color={planetTexture ? '#ffffff' : config.color}
            emissive={config.emissive ?? '#000000'}
            emissiveIntensity={config.emissiveIntensity ?? 0}
            roughness={0.95}
            metalness={0}
            />
        </mesh>

        {config.ring ? <PlanetRing config={config.ring} /> : null}
        </group>
    )
})

export default PlanetMesh