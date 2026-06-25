import { useMemo } from 'react'
import * as THREE from 'three'

function SceneEnvironment() {
  const stars = useMemo(() => {
    const starCount = 12000
    const positions = new Float32Array(starCount * 3)

    for (let i = 0; i < starCount; i += 1) {
      const i3 = i * 3

      positions[i3] = THREE.MathUtils.randFloatSpread(260)
      positions[i3 + 1] = THREE.MathUtils.randFloatSpread(180)
      positions[i3 + 2] = THREE.MathUtils.randFloatSpread(260) - 40
    }

    return positions
  }, [])

    return (
        <>
        <points frustumCulled={false}>
            <bufferGeometry>
            <bufferAttribute
                attach="attributes-position"
                count={stars.length / 3}
                array={stars}
                itemSize={3}
            />
            </bufferGeometry>

            <pointsMaterial
            color="#ffffff"
            size={0.7}
            sizeAttenuation
            transparent
            opacity={0.9}
            depthWrite={false}
            />
        </points>

        <points frustumCulled={false}>
            <bufferGeometry>
            <bufferAttribute
                attach="attributes-position"
                count={stars.length / 3}
                array={stars}
                itemSize={3}
            />
            </bufferGeometry>

            <pointsMaterial
            color="#94a3b8"
            size={0.35}
            sizeAttenuation
            transparent
            opacity={0.35}
            depthWrite={false}
            />
        </points>
        </>
    )
}

export default SceneEnvironment