import type {
    PlanetApiResponse,
    PlanetMediaApiResponse,
    PlanetSpecializedInfoApiResponse,
    SunApiResponse,
    SunSpecializedInfoApiResponse,
} from '../types/api'

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'https://orbix-backend.fastapicloud.dev'

async function apiGet<T>(path: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: 'GET',
    })

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`)
    }

    return response.json() as Promise<T>
}

export function getPlanetInfoById(planetId: string) {
    return apiGet<PlanetApiResponse>(`/info/planet/${planetId}`)
}

export function getSunInfo() {
    return apiGet<SunApiResponse>('/info/sun')
}

export function getPlanetSpecializedInfoByName(planetName: string) {
    return apiGet<PlanetSpecializedInfoApiResponse>(
        `/info/jpl/specialized/planet/${encodeURIComponent(planetName)}`,
    )
}

export function getSunSpecializedInfo() {
    return apiGet<SunSpecializedInfoApiResponse>('/info/jpl/specialized/sun')
}

export function getPlanetMediaByName(planetName: string) {
    return apiGet<PlanetMediaApiResponse>(
        `/info/nasa-media/${encodeURIComponent(planetName)}`,
    )
}