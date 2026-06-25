function SceneLights() {
    return (
        <>
        <ambientLight intensity={0.12} color="#94a3b8" />
        <pointLight
            position={[0, 0, 0]}
            intensity={260}
            distance={160}
            decay={2}
            color="#ffd27a"
        />
        <directionalLight
            position={[-18, 10, 12]}
            intensity={0.35}
            color="#9fb3ff"
        />
        </>
    )
}

export default SceneLights