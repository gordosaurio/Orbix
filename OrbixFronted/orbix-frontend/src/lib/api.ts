import type { PlanetApiResponse, SunApiResponse } from '../types/api'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

if (!API_BASE_URL) {
    throw new Error('Missing VITE_API_BASE_URL in environment variables')
}

async function apiGet<T>(path: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        },
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