import { useEffect, useMemo } from 'react'
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'
import * as THREE from 'three'
import type { PlanetVisualConfig } from '../../types/planet'
import PlanetRing from './PlanetRing'

type PlanetMeshProps = {
    config: PlanetVisualConfig
}

const PLANET_TEXTURES: Record<string, string> = {
    mercury: '/textures/mercury.jpg',
    venus: '/textures/venus.jpg',
    earth: '/textures/earth.jpg',
    mars: '/textures/mars.jpg',
    jupiter: '/textures/jupiter.jpg',
    saturn: '/textures/saturn.jpg',
    uranus: '/textures/uranus.jpg',
    neptune: '/textures/neptune.jpg',
}

function PlanetMesh({ config }: PlanetMeshProps) {
    const texturePath = PLANET_TEXTURES[config.id]

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

    useEffect(() => {
        if (!texturePath) {
        console.warn(`[PlanetMesh] No texture mapping found for planet id: ${config.id}`)
        return
        }

    }, [config.id, texturePath, planetTexture])

    return (
        <group>
        <mesh>
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
}

export default PlanetMesh