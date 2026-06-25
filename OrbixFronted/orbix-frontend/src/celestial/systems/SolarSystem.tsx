import { planetConfigs } from '../../config/planets'
import OrbitalBody from './OrbitalBody'
import type { SelectedPlanetState } from '../../types/scene'

type SolarSystemProps = {
    selectedPlanetId: string | null
    onSelectPlanet: (planet: SelectedPlanetState) => void
    onPlanetPositionChange: (planet: SelectedPlanetState) => void
}

function SolarSystem({
    selectedPlanetId,
    onSelectPlanet,
    onPlanetPositionChange,
    }: SolarSystemProps) {
    return (
        <group>
        {planetConfigs.map((planet) => (
            <OrbitalBody
            key={planet.id}
            config={planet}
            isSelected={selectedPlanetId === planet.id}
            onSelectPlanet={onSelectPlanet}
            onPlanetPositionChange={onPlanetPositionChange}
            />
        ))}
        </group>
    )
}

export default SolarSystem