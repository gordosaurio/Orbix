import { useMemo } from 'react'
import * as THREE from 'three'

type OrbitPathProps = {
    radius: number
    color?: string
    opacity?: number
}

function OrbitPath({
    radius,
    color = '#94a3b8',
    opacity = 0.18,
    }: OrbitPathProps) {
    const orbitLine = useMemo(() => {
        const curve = new THREE.EllipseCurve(
        0,
        0,
        radius,
        radius,
        0,
        2 * Math.PI,
        false,
        0
        )

        const points = curve.getPoints(256)
        const orbitPoints = points.map(
        (point) => new THREE.Vector3(point.x, 0, point.y)
        )

        const geometry = new THREE.BufferGeometry().setFromPoints(orbitPoints)
        const material = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity,
        })

        return new THREE.LineLoop(geometry, material)
    }, [radius, color, opacity])

    return <primitive object={orbitLine} />
}

export default OrbitPath