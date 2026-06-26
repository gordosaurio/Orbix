export type CelestialBodyApiResponse = {
    id: string
    moons?: number
    perihelion?: number
    aphelion?: number
    mass?: {
        massValue?: number
        massExponent?: number
    }
    vol?: {
        volValue?: number
        volExponent?: number
    }
    density?: number
    gravity?: number
    equaRadius?: number
    discoveredBy?: string
    discoveryDate?: string
    avgTemp?: number
}

export type PlanetApiResponse = CelestialBodyApiResponse

export type SunApiResponse = CelestialBodyApiResponse

export type PlanetSpecializedInfoApiResponse = Record<string, unknown>

export type SunSpecializedInfoApiResponse = Record<string, unknown>

export type PlanetMediaApiResponse = Record<string, unknown>
