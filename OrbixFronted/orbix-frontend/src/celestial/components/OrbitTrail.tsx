import { useMemo } from 'react'
import * as THREE from 'three'

type OrbitTrailProps = {
    radius: number
    angle: number
    frontArc?: number
    backArc?: number
}

function OrbitTrail({
    radius,
    angle,
    frontArc = 0.55,
    backArc = 1.15,
    }: OrbitTrailProps) {
    const { backLine, frontLine } = useMemo(() => {
        const createArcPoints = (
        startAngle: number,
        endAngle: number,
        segments: number
        ) => {
        const points: THREE.Vector3[] = []

        for (let i = 0; i <= segments; i += 1) {
            const t = i / segments
            const currentAngle = startAngle + (endAngle - startAngle) * t
            const x = Math.cos(currentAngle) * radius
            const z = Math.sin(currentAngle) * radius
            points.push(new THREE.Vector3(x, 0, z))
        }

        return points
        }

        const backPoints = createArcPoints(angle - backArc, angle, 72)
        const frontPoints = createArcPoints(angle, angle + frontArc, 42)

        const backGeometry = new THREE.BufferGeometry().setFromPoints(backPoints)
        const frontGeometry = new THREE.BufferGeometry().setFromPoints(frontPoints)

        const backMaterial = new THREE.LineBasicMaterial({
        color: '#dbeafe',
        transparent: true,
        opacity: 0.14,
        })

        const frontMaterial = new THREE.LineBasicMaterial({
        color: '#ffffff',
        transparent: true,
        opacity: 0.5,
        })

        return {
        backLine: new THREE.Line(backGeometry, backMaterial),
        frontLine: new THREE.Line(frontGeometry, frontMaterial),
        }
    }, [radius, angle, frontArc, backArc])

    return (
        <group>
        <primitive object={backLine} />
        <primitive object={frontLine} />
        </group>
    )
}

export default OrbitTrail