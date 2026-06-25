import { useLoader } from '@react-three/fiber'
import { useMemo } from 'react'
import { TextureLoader } from 'three'
import * as THREE from 'three'

function SunMesh() {
    const loadedTexture = useLoader(TextureLoader, '/textures/sun.jpg')

    const sunTexture = useMemo(() => {
        const texture = loadedTexture.clone()
        texture.colorSpace = THREE.SRGBColorSpace
        texture.needsUpdate = true
        return texture
    }, [loadedTexture])

    return (
        <mesh position={[0, 0, 0]}>
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