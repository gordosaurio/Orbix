export type PlanetRingConfig = {
    innerRadius: number
    outerRadius: number
    color: string
    opacity: number
}

export type PlanetVisualConfig = {
    id: string
    name: string
    color: string
    radius: number
    orbitRadius: number
    orbitSpeed: number
    rotationSpeed: number
    emissive?: string
    emissiveIntensity?: number
    ring?: PlanetRingConfig
}