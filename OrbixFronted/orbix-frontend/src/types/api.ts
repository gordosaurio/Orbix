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

export type PlanetSpecializedInfoApiResponse = {
    name?: string
    revised?: string
    meanRadiusKm?: number | null
    equatorialRadiusKm?: number | null
    densityGcm3?: number | null
    escapeSpeedKmS?: number | null
    geometricAlbedo?: number | null
    gravityMs2?: number | null
    massValue?: number | null
    massExponent?: number | null
    meanTemperatureK?: number | null
    obliquityToOrbit?: string | null
    orbitSpeedKmS?: number | null
    siderealOrbitPeriod?: string | null
    siderealRotationPeriod?: string | null
    [key: string]: unknown
}

export type SunSpecializedInfoApiResponse = {
    name?: string
    revised?: string
    meanRadiusKm?: number | null
    solarRadiusKm?: number | null
    photosphereRadiusKm?: number | null
    densityGcm3?: number | null
    escapeSpeedKmS?: number | null
    massValue?: number | null
    massExponent?: number | null
    meanTemperatureK?: number | null
    siderealRotationPeriod?: string | null
    [key: string]: unknown
}

export type NasaMediaItem = {
    title?: string
    description?: string
    nasaId?: string
    mediaType?: string
    previewUrl?: string
    url?: string
}

export type PlanetMediaApiResponse = {
    name?: string
    images?: NasaMediaItem[]
}