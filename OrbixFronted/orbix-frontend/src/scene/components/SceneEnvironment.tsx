import { useMemo } from 'react'
import * as THREE from 'three'

function SceneEnvironment() {
    const stars = useMemo(() => {
        const starCount = 6500
        const minDistanceFromCenter = 55
        const positions = new Float32Array(starCount * 3)

        let i = 0

        while (i < starCount) {
            const x = THREE.MathUtils.randFloatSpread(280)
            const y = THREE.MathUtils.randFloatSpread(180)
            const z = THREE.MathUtils.randFloatSpread(280) - 40

            const distanceFromCenter = Math.sqrt(x * x + y * y + z * z)

            if (distanceFromCenter < minDistanceFromCenter) {
                continue
            }

            const i3 = i * 3
            positions[i3] = x
            positions[i3 + 1] = y
            positions[i3 + 2] = z

            i += 1
        }

        return positions
    }, [])

    return (
        <>
            <points frustumCulled={false} renderOrder={-2}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        args={[stars, 3]}
                    />
                </bufferGeometry>

                <pointsMaterial
                    color="#ffffff"
                    size={0.18}
                    sizeAttenuation
                    transparent
                    opacity={0.8}
                    depthWrite={false}
                />
            </points>

            <points frustumCulled={false} renderOrder={-3}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        args={[stars, 3]}
                    />
                </bufferGeometry>

                <pointsMaterial
                    color="#94a3b8"
                    size={0.08}
                    sizeAttenuation
                    transparent
                    opacity={0.22}
                    depthWrite={false}
                />
            </points>
        </>
    )
}

export default SceneEnvironment