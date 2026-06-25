import { planetConfigs } from '../../config/planets'
import OrbitalBody from './OrbitalBody'

function SolarSystem() {
    return (
        <group>
        {planetConfigs.map((planet) => (
            <OrbitalBody key={planet.id} config={planet} />
        ))}
        </group>
    )
}

export default SolarSystem