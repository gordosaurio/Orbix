import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { celestialUiMap } from '../data/planetUi'
import {
    getPlanetInfoById,
    getPlanetMediaByName,
    getPlanetSpecializedInfoByName,
    getSunInfo,
    getSunSpecializedInfo,
} from '../lib/api'
import type {
    CelestialBodyApiResponse,
    NasaMediaItem,
    PlanetMediaApiResponse,
    PlanetSpecializedInfoApiResponse,
    SunSpecializedInfoApiResponse,
} from '../types/api'

type DetailItem = {
    label: string
    value: string
}

type DetailGroup = {
    title: string
    items: DetailItem[]
}

function formatTemperature(value?: number | null) {
    if (value === undefined || value === null || value === 0) return 'Unknown'
    return `${new Intl.NumberFormat('en-US').format(value)} K`
}

function formatMoons(value?: number | null) {
    if (value === undefined || value === null) return 'Unknown'
    return `${value}`
}

function formatGravity(value?: number | null) {
    if (value === undefined || value === null || value === 0) return 'Unknown'
    return `${value.toFixed(2)} m/s²`
}

function formatRadius(value?: number | null) {
    if (value === undefined || value === null || value === 0) return 'Unknown'
    return `${new Intl.NumberFormat('en-US').format(Math.round(value))} km`
}

function formatDensity(value?: number | null) {
    if (value === undefined || value === null || value === 0) return 'Unknown'
    return `${value.toFixed(2)} g/cm³`
}

function formatDistance(value?: number | null) {
    if (value === undefined || value === null || value === 0) return 'Unknown'
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
    value?: number | null,
    exponent?: number | null,
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

function formatNumber(
    value?: number | null,
    unit?: string,
    decimals = 2,
    treatZeroAsUnknown = false,
) {
    if (value === undefined || value === null) return 'Unknown'
    if (treatZeroAsUnknown && value === 0) return 'Unknown'

    return `${new Intl.NumberFormat('en-US', {
        maximumFractionDigits: decimals,
        minimumFractionDigits: 0,
    }).format(value)}${unit ? ` ${unit}` : ''}`
}

function cleanText(value?: string | null) {
    if (!value || value.trim().length === 0) return 'Unknown'
    return value.trim()
}

function truncateText(value?: string, max = 180) {
    if (!value || value.trim().length === 0) return 'No description available.'
    if (value.length <= max) return value
    return `${value.slice(0, max).trim()}…`
}

function statusText(
    loading: boolean,
    ready: boolean,
    error: string | null,
    successLabel: string,
) {
    if (loading) return 'Loading...'
    if (error) return error
    if (ready) return successLabel
    return 'Not available'
}

function SkeletonStatCard() {
    return (
        <div className="rounded-[20px] border border-white/8 bg-white/5 p-4">
            <div className="orbix-skeleton-line h-3 w-24" />
            <div className="mt-3 orbix-skeleton-line h-6 w-32" />
        </div>
    )
}

function SkeletonDatasetCard() {
    return <div className="orbix-skeleton-card" />
}

function EmptyState({ text }: { text: string }) {
    return (
        <div className="rounded-[22px] border border-white/8 bg-white/5 p-5">
            <p className="text-sm leading-7 text-slate-300">{text}</p>
        </div>
    )
}

function StatusBadge({
    label,
    loading,
    ready,
    error,
    accent,
}: {
    label: string
    loading: boolean
    ready: boolean
    error: string | null
    accent: string
}) {
    const dotClass = error
        ? 'bg-rose-400 shadow-[0_0_18px_rgba(251,113,133,0.95)]'
        : ready
            ? ''
            : loading
                ? 'bg-amber-300 shadow-[0_0_18px_rgba(252,211,77,0.95)]'
                : 'bg-slate-400 shadow-[0_0_18px_rgba(148,163,184,0.65)]'

    return (
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs text-slate-200 backdrop-blur-xl">
            <span
                className={`h-2.5 w-2.5 rounded-full ${dotClass}`}
                style={!error && ready ? { backgroundColor: accent, boxShadow: `0 0 18px ${accent}` } : undefined}
            />
            <span>{label}</span>
        </div>
    )
}

function CelestialDetailsPage() {
    const { id } = useParams()
    const isSunRoute = window.location.pathname === '/sun'
    const bodyId = isSunRoute ? 'sun' : id ?? ''
    const bodyUi = celestialUiMap[bodyId]
    const bodyName = bodyId.charAt(0).toUpperCase() + bodyId.slice(1)

    const [data, setData] = useState<CelestialBodyApiResponse | null>(null)
    const [specializedData, setSpecializedData] = useState<
        PlanetSpecializedInfoApiResponse | SunSpecializedInfoApiResponse | null
    >(null)
    const [mediaData, setMediaData] = useState<PlanetMediaApiResponse | null>(null)

    const [loading, setLoading] = useState(true)
    const [specializedLoading, setSpecializedLoading] = useState(true)
    const [mediaLoading, setMediaLoading] = useState(true)

    const [error, setError] = useState<string | null>(null)
    const [specializedError, setSpecializedError] = useState<string | null>(null)
    const [mediaError, setMediaError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false

        const fetchData = async () => {
            if (!isSunRoute && !id) {
                setError('Celestial body not found.')
                setLoading(false)
                setSpecializedLoading(false)
                setMediaLoading(false)
                return
            }

            try {
                setLoading(true)
                setSpecializedLoading(true)
                setMediaLoading(true)
                setError(null)
                setSpecializedError(null)
                setMediaError(null)
                setSpecializedData(null)
                setMediaData(null)

                const primaryResponse = isSunRoute
                    ? await getSunInfo()
                    : await getPlanetInfoById(id!)

                if (cancelled) return

                setData(primaryResponse)
                setLoading(false)

                const specializedPromise = isSunRoute
                    ? getSunSpecializedInfo()
                    : getPlanetSpecializedInfoByName(bodyName)

                const mediaPromise = getPlanetMediaByName(bodyName)

                specializedPromise
                    .then((response) => {
                        if (cancelled) return
                        setSpecializedData(response)
                        setSpecializedError(null)
                    })
                    .catch((err) => {
                        if (cancelled) return
                        setSpecializedData(null)
                        setSpecializedError(
                            err instanceof Error ? err.message : 'Unable to load scientific data.',
                        )
                    })
                    .finally(() => {
                        if (cancelled) return
                        setSpecializedLoading(false)
                    })

                mediaPromise
                    .then((response) => {
                        if (cancelled) return
                        setMediaData(response)
                        setMediaError(null)
                    })
                    .catch((err) => {
                        if (cancelled) return
                        setMediaData(null)
                        setMediaError(
                            err instanceof Error ? err.message : 'Unable to load NASA imagery.',
                        )
                    })
                    .finally(() => {
                        if (cancelled) return
                        setMediaLoading(false)
                    })
            } catch (err) {
                if (!cancelled) {
                    setError('Unable to load celestial details.')
                    setData(null)
                    setLoading(false)
                    setSpecializedLoading(false)
                    setMediaLoading(false)
                    console.error(`Error loading detail page for ${bodyName}:`, err)
                }
            }
        }

        void fetchData()

        return () => {
            cancelled = true
        }
    }, [bodyName, id, isSunRoute])

    const overviewStats = useMemo(() => {
        if (!data) return []

        const stats: DetailItem[] = [
            { label: 'Temperature', value: formatTemperature(data.avgTemp) },
            { label: 'Gravity', value: formatGravity(data.gravity) },
            { label: 'Equatorial radius', value: formatRadius(data.equaRadius) },
            { label: 'Density', value: formatDensity(data.density) },
            {
                label: 'Mass',
                value: formatScientificValue(data.mass?.massValue, data.mass?.massExponent, 'kg'),
            },
            {
                label: 'Volume',
                value: formatScientificValue(data.vol?.volValue, data.vol?.volExponent, 'km³'),
            },
        ]

        if (!isSunRoute) {
            stats.splice(1, 0, {
                label: 'Moons',
                value: formatMoons(data.moons),
            })
        }

        return stats
    }, [data, isSunRoute])

    const detailGroups = useMemo<DetailGroup[]>(() => {
        if (!data) return []

        const identity: DetailGroup = {
            title: 'Identity',
            items: [
                { label: 'Display name', value: bodyName },
                { label: 'Category', value: isSunRoute ? 'Star' : 'Planet' },
                { label: 'API id', value: data.id || 'Unknown' },
            ],
        }

        const orbital: DetailGroup = {
            title: 'Orbital metrics',
            items: [
                { label: 'Perihelion', value: formatDistance(data.perihelion) },
                { label: 'Aphelion', value: formatDistance(data.aphelion) },
                { label: 'Average temperature', value: formatTemperature(data.avgTemp) },
                ...(!isSunRoute ? [{ label: 'Moons', value: formatMoons(data.moons) }] : []),
            ],
        }

        const physical: DetailGroup = {
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
        }

        const discovery: DetailGroup = {
            title: 'Discovery',
            items: [
                { label: 'Discovered by', value: formatDiscovery(data.discoveredBy) },
                { label: 'Discovery date', value: formatDiscoveryDate(data.discoveryDate) },
            ],
        }

        return [identity, orbital, physical, discovery]
    }, [bodyName, data, isSunRoute])

    const scientificItems = useMemo<DetailItem[]>(() => {
        if (!specializedData) return []

        if (isSunRoute) {
            const sun = specializedData as SunSpecializedInfoApiResponse

            return [
                { label: 'Mean radius', value: formatRadius(sun.meanRadiusKm) },
                { label: 'Solar radius', value: formatRadius(sun.solarRadiusKm) },
                { label: 'Photosphere radius', value: formatRadius(sun.photosphereRadiusKm) },
                { label: 'Density', value: formatDensity(sun.densityGcm3) },
                { label: 'Escape speed', value: formatNumber(sun.escapeSpeedKmS, 'km/s', 2) },
                {
                    label: 'Mass',
                    value: formatScientificValue(sun.massValue, sun.massExponent, 'kg'),
                },
                {
                    label: 'Mean temperature',
                    value: formatNumber(sun.meanTemperatureK, 'K', 1, true),
                },
                {
                    label: 'Sidereal rotation',
                    value: cleanText(sun.siderealRotationPeriod),
                },
                { label: 'Revision', value: cleanText(sun.revised) },
            ]
        }

        const planet = specializedData as PlanetSpecializedInfoApiResponse

        return [
            { label: 'Mean radius', value: formatRadius(planet.meanRadiusKm) },
            { label: 'Equatorial radius', value: formatRadius(planet.equatorialRadiusKm) },
            { label: 'Density', value: formatDensity(planet.densityGcm3) },
            { label: 'Gravity', value: formatNumber(planet.gravityMs2, 'm/s²', 2) },
            { label: 'Escape speed', value: formatNumber(planet.escapeSpeedKmS, 'km/s', 2) },
            {
                label: 'Mean temperature',
                value: formatNumber(planet.meanTemperatureK, 'K', 1, true),
            },
            {
                label: 'Mass',
                value: formatScientificValue(planet.massValue, planet.massExponent, 'kg'),
            },
            {
                label: 'Geometric albedo',
                value: formatNumber(planet.geometricAlbedo, undefined, 3),
            },
            { label: 'Orbit speed', value: formatNumber(planet.orbitSpeedKmS, 'km/s', 2) },
            { label: 'Sidereal orbit', value: cleanText(planet.siderealOrbitPeriod) },
            { label: 'Sidereal rotation', value: cleanText(planet.siderealRotationPeriod) },
            { label: 'Obliquity', value: cleanText(planet.obliquityToOrbit) },
            { label: 'Revision', value: cleanText(planet.revised) },
        ]
    }, [specializedData, isSunRoute])

    const galleryItems = useMemo<NasaMediaItem[]>(() => {
        return mediaData?.images ?? []
    }, [mediaData])

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
                            {bodyName}
                        </h1>

                        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                            {bodyUi.summary}
                        </p>

                        <div className="mt-5 flex flex-wrap gap-2.5">
                            <StatusBadge
                                label={statusText(loading, !!data, error, 'Primary profile ready')}
                                loading={loading}
                                ready={!!data}
                                error={error}
                                accent={bodyUi.accent}
                            />
                            <StatusBadge
                                label={statusText(
                                    specializedLoading,
                                    !!specializedData,
                                    specializedError,
                                    'Scientific data ready',
                                )}
                                loading={specializedLoading}
                                ready={!!specializedData}
                                error={specializedError}
                                accent={bodyUi.accent}
                            />
                            <StatusBadge
                                label={statusText(
                                    mediaLoading,
                                    galleryItems.length > 0,
                                    mediaError,
                                    `${galleryItems.length} media assets`,
                                )}
                                loading={mediaLoading}
                                ready={galleryItems.length > 0}
                                error={mediaError}
                                accent={bodyUi.accent}
                            />
                        </div>
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

                        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            {loading
                                ? Array.from({ length: 6 }).map((_, index) => (
                                      <SkeletonStatCard key={index} />
                                  ))
                                : overviewStats.map((stat) => (
                                      <div
                                          key={stat.label}
                                          className="rounded-[20px] border border-white/8 bg-white/5 p-4"
                                      >
                                          <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                                              {stat.label}
                                          </p>
                                          <p className="mt-3 text-lg font-medium text-white">
                                              {stat.value}
                                          </p>
                                      </div>
                                  ))}
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
                                    {loading
                                        ? 'Loading primary orbital record...'
                                        : specializedLoading || mediaLoading
                                            ? 'The page is visible now and the remaining datasets are still loading in the background.'
                                            : error
                                                ? error
                                                : 'All available datasets have been resolved for this celestial profile.'}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 rounded-[20px] border border-white/8 bg-white/5 p-4">
                            <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                                Summary
                            </p>

                            <p className="mt-3 text-sm leading-7 text-slate-300">
                                This full profile expands the selected body into a cinematic reading
                                surface with live scientific fields, orbital data, and NASA media.
                            </p>
                        </div>

                        <div className="mt-4 rounded-[20px] border border-white/8 bg-white/5 p-4">
                            <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                                Extra datasets
                            </p>

                            <div className="mt-3 space-y-2.5">
                                <div className="flex items-start justify-between gap-4 border-b border-white/6 pb-2.5">
                                    <span className="text-sm text-slate-400">Specialized JPL data</span>
                                    <span className="max-w-56 text-right text-sm font-medium text-slate-100">
                                        {statusText(
                                            specializedLoading,
                                            !!specializedData,
                                            specializedError,
                                            'Loaded',
                                        )}
                                    </span>
                                </div>

                                <div className="flex items-start justify-between gap-4 pb-0">
                                    <span className="text-sm text-slate-400">NASA media data</span>
                                    <span className="max-w-56 text-right text-sm font-medium text-slate-100">
                                        {statusText(
                                            mediaLoading,
                                            galleryItems.length > 0,
                                            mediaError,
                                            galleryItems.length > 0
                                                ? `${galleryItems.length} assets`
                                                : 'Loaded',
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-4 rounded-[28px] border border-white/10 bg-slate-950/55 p-5 shadow-[0_12px_70px_rgba(0,0,0,0.48)] backdrop-blur-2xl md:mt-5 md:p-6">
                    <p
                        className="text-[10px] uppercase tracking-[0.34em]"
                        style={{ color: bodyUi.accent }}
                    >
                        Scientific profile
                    </p>

                    {specializedLoading ? (
                        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <SkeletonDatasetCard key={index} />
                            ))}
                        </div>
                    ) : specializedData ? (
                        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {scientificItems.map((item) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, y: 14 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                                    className="rounded-[22px] border border-white/8 bg-white/5 p-4"
                                >
                                    <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                                        {item.label}
                                    </p>
                                    <p className="mt-3 text-base font-medium text-white">
                                        {item.value}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="mt-5">
                            <EmptyState text="Scientific data is not available for this celestial body." />
                        </div>
                    )}
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

                <section className="mt-4 rounded-[28px] border border-white/10 bg-slate-950/55 p-5 shadow-[0_12px_70px_rgba(0,0,0,0.48)] backdrop-blur-2xl md:mt-5 md:p-6">
                    <p
                        className="text-[10px] uppercase tracking-[0.34em]"
                        style={{ color: bodyUi.accent }}
                    >
                        NASA imagery
                    </p>

                    {mediaLoading ? (
                        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="rounded-[22px] border border-white/8 bg-white/5 p-3"
                                >
                                    <div className="orbix-skeleton-image" />
                                    <div className="mt-3 orbix-skeleton-line w-3/4" />
                                    <div className="mt-2 orbix-skeleton-line w-full" />
                                    <div className="mt-2 orbix-skeleton-line w-5/6" />
                                </div>
                            ))}
                        </div>
                    ) : galleryItems.length > 0 ? (
                        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {galleryItems.map((item) => (
                                <motion.a
                                    key={item.nasaId ?? item.url ?? item.title}
                                    href={item.url || item.previewUrl || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    initial={{ opacity: 0, y: 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                                    className="group rounded-[22px] border border-white/8 bg-white/5 p-3 transition hover:bg-white/[0.07]"
                                >
                                    <div className="overflow-hidden rounded-[18px] border border-white/8 bg-black/20">
                                        {item.previewUrl ? (
                                            <img
                                                src={item.previewUrl}
                                                alt={item.title || `${bodyName} NASA image`}
                                                className="h-52 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="flex h-52 items-center justify-center text-sm text-slate-400">
                                                Preview unavailable
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-3">
                                        <p className="text-sm font-medium text-white">
                                            {item.title || 'Untitled NASA asset'}
                                        </p>

                                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-300">
                                            {truncateText(item.description)}
                                        </p>

                                        <div className="mt-3 flex items-center justify-between gap-3">
                                            <span className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                                                {item.mediaType || 'image'}
                                            </span>
                                            {item.nasaId ? (
                                                <span className="text-[11px] text-slate-400">
                                                    {item.nasaId}
                                                </span>
                                            ) : null}
                                        </div>
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    ) : (
                        <div className="mt-5">
                            <EmptyState text="No NASA imagery was returned for this celestial body." />
                        </div>
                    )}
                </section>
            </motion.div>
        </div>
    )
}

export default CelestialDetailsPage