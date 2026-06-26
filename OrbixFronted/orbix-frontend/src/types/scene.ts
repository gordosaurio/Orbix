export type CelestialBodyKind = 'star' | 'planet'

export type SelectedPlanetState = {
    id: string
    name: string
    kind: CelestialBodyKind
    radius: number
    position: [number, number, number]
}