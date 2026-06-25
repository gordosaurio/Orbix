import { planetConfigs } from '../../config/planets'
import OrbitPath from '../../celestial/components/OrbitPath'
import OrbitalBody from './OrbitalBody'

function SolarSystem() {
    return (
        <group>
        {planetConfigs.map((planet) => (
            <group key={planet.id}>
            <OrbitPath radius={planet.orbitRadius} />
            <OrbitalBody config={planet} />
            </group>
        ))}
        </group>
    )
}

export default SolarSystem