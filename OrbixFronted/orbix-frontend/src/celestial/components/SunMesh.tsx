import { useLoader, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { TextureLoader } from 'three'
import * as THREE from 'three'
import type { Mesh } from 'three'

type SunMeshProps = {
    onSelect?: () => void
}

function SunMesh({ onSelect }: SunMeshProps) {
    const sunRef = useRef<Mesh>(null)
    const loadedTexture = useLoader(TextureLoader, '/textures/sun.jpg')

    const sunTexture = useMemo(() => {
        const texture = loadedTexture.clone()
        texture.colorSpace = THREE.SRGBColorSpace
        texture.needsUpdate = true
        return texture
    }, [loadedTexture])

    useFrame((_, delta) => {
        if (!sunRef.current) return
        sunRef.current.rotation.y += delta * 0.08
    })

    return (
        <mesh
        ref={sunRef}
        position={[0, 0, 0]}
        onClick={(event) => {
            event.stopPropagation()
            onSelect?.()
        }}
        >
        <sphereGeometry args={[2.3, 128, 128]} />
        <meshBasicMaterial
            map={sunTexture}
            color="#ffd27a"
            toneMapped={false}
        />
        </mesh>
    )
}

export default SunMesh