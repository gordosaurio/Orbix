import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { celestialUiMap } from '../data/planetUi'
import { getPlanetInfoById, getSunInfo } from '../lib/api'
import type { CelestialBodyApiResponse } from '../types/api'

function formatTemperature(value?: number) {
    if (value === undefined || value === null) return 'Unknown'
    return `${value} K`
}

function formatMoons(value?: number) {
    if (value === undefined || value === null) return 'Unknown'
    return `${value}`
}

function formatGravity(value?: number) {
    if (value === undefined || value === null) return 'Unknown'
    return `${value.toFixed(2)} m/s²`
}

function formatRadius(value?: number) {
    if (value === undefined || value === null) return 'Unknown'
    return `${new Intl.NumberFormat('en-US').format(Math.round(value))} km`
}

function formatDensity(value?: number) {
    if (value === undefined || value === null) return 'Unknown'
    return `${value.toFixed(2)} g/cm³`
}

function formatDistance(value?: number) {
    if (value === undefined || value === null) return 'Unknown'
    return `${new Intl.NumberFormat('en-US').format(Math.round(value))} km`
}

function formatDiscovery(discoveredBy?: string) {
    if (!discoveredBy || discoveredBy.trim().length === 0) return 'Unknown'
    return discoveredBy
}

function formatDiscoveryDate(value?: string) {
    if (!value || value.trim().length === 0) return 'Unknown'
    return value
}

function formatScientificValue(
    value?: number,
    exponent?: number,
    unit?: string,
    ) {
    if (
        value === undefined ||
        value === null ||
        exponent === undefined ||
        exponent === null
    ) {
        return 'Unknown'
    }

    return `${value} × 10^${exponent}${unit ? ` ${unit}` : ''}`
}

function CelestialDetailsPage() {
    const { id } = useParams()
    const isSunRoute = window.location.pathname === '/sun'
    const bodyId = isSunRoute ? 'sun' : id ?? ''
    const bodyUi = celestialUiMap[bodyId]

    const [data, setData] = useState<CelestialBodyApiResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false

        const fetchData = async () => {
        if (!isSunRoute && !id) {
            setError('Celestial body not found.')
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            setError(null)

            const response = isSunRoute ? await getSunInfo() : await getPlanetInfoById(id!)

            if (!cancelled) {
            setData(response)
            console.log(`DETAIL PAGE (${bodyId}) =>`, response)
            }
        } catch (err) {
            if (!cancelled) {
            setError('Unable to load celestial details.')
            setData(null)
            console.error('Error fetching detail page data:', err)
            }
        } finally {
            if (!cancelled) {
            setLoading(false)
            }
        }
        }

        void fetchData()

        return () => {
        cancelled = true
        }
    }, [bodyId, id, isSunRoute])

    const detailGroups = useMemo(() => {
        if (!data) return []

        return [
        {
            title: 'Identity',
            items: [
            { label: 'Display name', value: bodyId.charAt(0).toUpperCase() + bodyId.slice(1) },
            { label: 'API id', value: data.id || 'Unknown' },
            { label: 'Category', value: isSunRoute ? 'Star' : 'Planet' },
            ],
        },
        {
            title: 'Orbital metrics',
            items: [
            { label: 'Perihelion', value: formatDistance(data.perihelion) },
            { label: 'Aphelion', value: formatDistance(data.aphelion) },
            { label: 'Moons', value: formatMoons(data.moons) },
            { label: 'Average temperature', value: formatTemperature(data.avgTemp) },
            ],
        },
        {
            title: 'Physical properties',
            items: [
            {
                label: 'Mass',
                value: formatScientificValue(data.mass?.massValue, data.mass?.massExponent, 'kg'),
            },
            {
                label: 'Volume',
                value: formatScientificValue(data.vol?.volValue, data.vol?.volExponent, 'km³'),
            },
            { label: 'Density', value: formatDensity(data.density) },
            { label: 'Gravity', value: formatGravity(data.gravity) },
            { label: 'Equatorial radius', value: formatRadius(data.equaRadius) },
            ],
        },
        {
            title: 'Discovery',
            items: [
            { label: 'Discovered by', value: formatDiscovery(data.discoveredBy) },
            { label: 'Discovery date', value: formatDiscoveryDate(data.discoveryDate) },
            ],
        },
        ]
    }, [bodyId, data, isSunRoute])

    if (!bodyUi) {
        return (
        <div className="flex min-h-screen items-center justify-center px-6 text-white">
            <div className="w-full max-w-xl rounded-[28px] border border-white/10 bg-slate-950/60 p-6 text-center backdrop-blur-2xl">
            <h1 className="text-2xl font-semibold">Unknown celestial body</h1>
            <p className="mt-3 text-slate-300">
                The requested object does not exist in the current Orbix archive.
            </p>
            <Link
                to="/"
                className="mt-5 inline-flex rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/12"
            >
                Return to explorer
            </Link>
            </div>
        </div>
        )
    }

    return (
        <div className="min-h-screen overflow-x-hidden text-white">
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_28%),radial-gradient(circle_at_20%_80%,rgba(168,85,247,0.06),transparent_22%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.04),transparent_18%),linear-gradient(180deg,#020617_0%,#010308_55%,#000000_100%)]" />

        <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.99, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 md:px-8 md:py-8"
        >
            <header className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-3xl">
                <p
                className="text-[10px] uppercase tracking-[0.38em]"
                style={{ color: bodyUi.accent }}
                >
                Orbix archive
                </p>

                <h1
                className="mt-3 font-['Cabinet_Grotesk',sans-serif] text-4xl font-semibold tracking-tighter md:text-6xl"
                style={{ color: bodyUi.accent }}
                >
                {bodyId.charAt(0).toUpperCase() + bodyId.slice(1)}
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                {bodyUi.summary}
                </p>
            </div>

            <Link
                to="/"
                className="inline-flex items-center justify-center rounded-2xl border border-white/12 bg-slate-950/60 px-4 py-3 text-sm font-medium text-white backdrop-blur-xl transition hover:bg-white/10"
            >
                Back to explorer
            </Link>
            </header>

            <section className="grid gap-4 md:grid-cols-[1.2fr_0.8fr] lg:gap-5">
            <div className="rounded-[28px] border border-white/10 bg-slate-950/55 p-5 shadow-[0_12px_70px_rgba(0,0,0,0.48)] backdrop-blur-2xl md:p-6">
                <p
                className="text-[10px] uppercase tracking-[0.34em]"
                style={{ color: bodyUi.accent }}
                >
                Primary profile
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-[20px] border border-white/8 bg-white/5 p-4">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                    Temperature
                    </p>
                    <p className="mt-3 text-lg font-medium text-white">
                    {loading ? 'Loading...' : data ? formatTemperature(data.avgTemp) : 'Unknown'}
                    </p>
                </div>

                <div className="rounded-[20px] border border-white/8 bg-white/5 p-4">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                    Moons
                    </p>
                    <p className="mt-3 text-lg font-medium text-white">
                    {loading ? 'Loading...' : data ? formatMoons(data.moons) : 'Unknown'}
                    </p>
                </div>

                <div className="rounded-[20px] border border-white/8 bg-white/5 p-4">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                    Gravity
                    </p>
                    <p className="mt-3 text-lg font-medium text-white">
                    {loading ? 'Loading...' : data ? formatGravity(data.gravity) : 'Unknown'}
                    </p>
                </div>

                <div className="rounded-[20px] border border-white/8 bg-white/5 p-4">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                    Equatorial radius
                    </p>
                    <p className="mt-3 text-lg font-medium text-white">
                    {loading ? 'Loading...' : data ? formatRadius(data.equaRadius) : 'Unknown'}
                    </p>
                </div>
                </div>

                <div className="mt-4 rounded-[20px] border border-white/8 bg-white/5 p-4">
                <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                    Curated snapshot
                </p>

                <div className="mt-3 space-y-2.5">
                    {bodyUi.facts.map((fact) => (
                    <div
                        key={fact.label}
                        className="flex items-start justify-between gap-4 border-b border-white/6 pb-2.5 last:border-b-0 last:pb-0"
                    >
                        <span className="text-sm text-slate-400">{fact.label}</span>
                        <span className="max-w-56 text-right text-sm font-medium text-slate-100">
                        {fact.value}
                        </span>
                    </div>
                    ))}
                </div>
                </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-950/55 p-5 shadow-[0_12px_70px_rgba(0,0,0,0.48)] backdrop-blur-2xl md:p-6">
                <p
                className="text-[10px] uppercase tracking-[0.34em]"
                style={{ color: bodyUi.accent }}
                >
                Data status
                </p>

                <div className="mt-5 rounded-[20px] border border-white/8 bg-white/5 p-4">
                <div className="flex items-center gap-3">
                    <div
                    className="h-2.5 w-2.5 rounded-full shadow-[0_0_18px_currentColor]"
                    style={{ backgroundColor: bodyUi.accent, color: bodyUi.accent }}
                    />
                    <p className="text-sm text-slate-200">
                    {loading ? 'Loading backend response...' : error ? error : 'Live backend data loaded'}
                    </p>
                </div>
                </div>

                <div className="mt-4 rounded-[20px] border border-white/8 bg-white/5 p-4">
                <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                    Summary
                </p>

                <p className="mt-3 text-sm leading-7 text-slate-300">
                    {loading
                    ? 'Orbix is retrieving the selected celestial record.'
                    : error
                        ? 'The archive could not complete the request for this celestial body.'
                        : 'This page expands the selected object into a dedicated full-screen reading view while preserving the same cinematic design system.'}
                </p>
                </div>
            </div>
            </section>

            <section className="mt-4 rounded-[28px] border border-white/10 bg-slate-950/55 p-5 shadow-[0_12px_70px_rgba(0,0,0,0.48)] backdrop-blur-2xl md:mt-5 md:p-6">
            <p
                className="text-[10px] uppercase tracking-[0.34em]"
                style={{ color: bodyUi.accent }}
            >
                Expanded dataset
            </p>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {detailGroups.map((group) => (
                <div
                    key={group.title}
                    className="rounded-[22px] border border-white/8 bg-white/5 p-4"
                >
                    <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                    {group.title}
                    </p>

                    <div className="mt-3 space-y-2.5">
                    {group.items.map((item) => (
                        <div
                        key={`${group.title}-${item.label}`}
                        className="flex items-start justify-between gap-4 border-b border-white/6 pb-2.5 last:border-b-0 last:pb-0"
                        >
                        <span className="text-sm text-slate-400">{item.label}</span>
                        <span className="max-w-56 text-right text-sm font-medium text-slate-100">
                            {loading ? 'Loading...' : item.value}
                        </span>
                        </div>
                    ))}
                    </div>
                </div>
                ))}
            </div>
            </section>
        </motion.div>
        </div>
    )
}

export default CelestialDetailsPage