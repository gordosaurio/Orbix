import { Stars } from '@react-three/drei'

function SceneEnvironment() {
    return (
        <>
        <Stars
            radius={180}
            depth={80}
            count={7000}
            factor={4}
            saturation={0}
            fade
            speed={0.25}
        />

        <mesh position={[0, -18, -60]}>
            <sphereGeometry args={[10, 32, 32]} />
            <meshBasicMaterial color="#1e293b" transparent opacity={0.08} />
        </mesh>

        <mesh position={[-30, 14, -45]}>
            <sphereGeometry args={[6, 32, 32]} />
            <meshBasicMaterial color="#334155" transparent opacity={0.06} />
        </mesh>

        <mesh position={[32, -10, -55]}>
            <sphereGeometry args={[8, 32, 32]} />
            <meshBasicMaterial color="#0f172a" transparent opacity={0.08} />
        </mesh>
        </>
    )
}

export default SceneEnvironment