import { AnimatePresence, motion } from 'motion/react'
import type { SelectedPlanetState } from '../../types/scene'
import type { CelestialBodyApiResponse } from '../../types/api'
import { celestialUiMap } from '../../data/planetUi'

type PlanetInfoPanelProps = {
    selectedBody: SelectedPlanetState | null
    selectedBodyInfo: CelestialBodyApiResponse | null
}

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

function formatDiscovery(discoveredBy?: string) {
    if (!discoveredBy || discoveredBy.trim().length === 0) return 'Unknown'
    return discoveredBy
}

function formatDiscoveryDate(value?: string) {
    if (!value || value.trim().length === 0) return 'Unknown'
    return value
}

function PlanetInfoPanel({ selectedBody, selectedBodyInfo }: PlanetInfoPanelProps) {
    const selectedBodyUi = selectedBody ? celestialUiMap[selectedBody.id] : null

    const primaryStats = selectedBodyInfo
        ? [
            { label: 'Temperature', value: formatTemperature(selectedBodyInfo.avgTemp) },
            { label: 'Moons', value: formatMoons(selectedBodyInfo.moons) },
            { label: 'Gravity', value: formatGravity(selectedBodyInfo.gravity) },
            { label: 'Equatorial radius', value: formatRadius(selectedBodyInfo.equaRadius) },
        ]
        : []

    const secondaryStats = selectedBodyInfo
        ? [
            { label: 'Density', value: formatDensity(selectedBodyInfo.density) },
            { label: 'Discovered by', value: formatDiscovery(selectedBodyInfo.discoveredBy) },
            { label: 'Discovery date', value: formatDiscoveryDate(selectedBodyInfo.discoveryDate) },
        ]
        : []

    return (
        <aside className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-auto md:right-8 md:top-24 md:w-96 lg:w-104">
        <AnimatePresence mode="wait">
            {selectedBody && selectedBodyUi ? (
            <motion.div
                key={selectedBody.id}
                initial={{ opacity: 0, x: 28, scale: 0.98, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: 18, scale: 0.985, filter: 'blur(8px)' }}
                transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-auto relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/55 shadow-[0_12px_70px_rgba(0,0,0,0.48)] backdrop-blur-2xl"
            >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_20%),radial-gradient(circle_at_15%_0%,rgba(96,165,250,0.16),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.015))]" />
                <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-white/40 to-transparent" />
                <div
                className="pointer-events-none absolute -right-14 -top-14 h-32 w-32 rounded-full opacity-40 blur-3xl"
                style={{ backgroundColor: selectedBodyUi.accent }}
                />

                <div className="orbix-scrollbar relative max-h-[min(78vh,760px)] overflow-y-auto px-4 py-4 md:max-h-[calc(100vh-8rem)] md:px-5 md:py-5">
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                    <p
                        className="text-[10px] uppercase tracking-[0.34em]"
                        style={{ color: selectedBodyUi.accent }}
                    >
                        {selectedBodyUi.eyebrow}
                    </p>

                    <h2
                        className="mt-2 text-[1.8rem] font-semibold tracking-[-0.04em] text-balance md:text-[1.95rem]"
                        style={{ color: selectedBodyUi.accent }}
                    >
                        {selectedBody.name}
                    </h2>

                    <p className="mt-3 max-w-[30ch] text-sm leading-6 text-slate-300">
                        {selectedBodyUi.summary}
                    </p>
                    </div>

                    <div
                    className="mt-1 h-3 w-3 shrink-0 rounded-full shadow-[0_0_26px_currentColor]"
                    style={{
                        backgroundColor: selectedBodyUi.accent,
                        color: selectedBodyUi.accent,
                    }}
                    />
                </div>

                <div className="grid grid-cols-2 gap-2.5 md:gap-3">
                    {primaryStats.map((stat) => (
                    <div
                        key={stat.label}
                        className="rounded-[20px] border border-white/8 bg-white/5 p-3.5 md:p-4"
                    >
                        <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                        {stat.label}
                        </p>
                        <p className="mt-2.5 text-base font-medium text-white md:text-lg">
                        {stat.value}
                        </p>
                    </div>
                    ))}
                </div>

                <div className="mt-2.5 rounded-[20px] border border-white/8 bg-white/5 p-3.5 md:mt-3 md:p-4">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                    Quick facts
                    </p>

                    <div className="mt-3 space-y-2.5">
                    {secondaryStats.map((fact) => (
                        <div
                        key={fact.label}
                        className="flex items-start justify-between gap-4 border-b border-white/6 pb-2.5 last:border-b-0 last:pb-0"
                        >
                        <span className="text-sm text-slate-400">{fact.label}</span>
                        <span className="max-w-48 text-right text-sm font-medium text-slate-100">
                            {fact.value}
                        </span>
                        </div>
                    ))}
                    </div>
                </div>

                <div className="mt-2.5 rounded-[20px] border border-white/8 bg-white/5 p-3.5 md:mt-3 md:p-4">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                    Curated snapshot
                    </p>

                    <div className="mt-3 space-y-2.5">
                    {selectedBodyUi.facts.map((fact) => (
                        <div
                        key={fact.label}
                        className="flex items-start justify-between gap-4 border-b border-white/6 pb-2.5 last:border-b-0 last:pb-0"
                        >
                        <span className="text-sm text-slate-400">{fact.label}</span>
                        <span className="max-w-48 text-right text-sm font-medium text-slate-100">
                            {fact.value}
                        </span>
                        </div>
                    ))}
                    </div>
                </div>

                <button
                    type="button"
                    className="mt-3 w-full rounded-[16px] border border-white/12 bg-white/8 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/12"
                >
                    View more
                </button>
                </div>
            </motion.div>
            ) : (
            <motion.div
                key="empty-panel"
                initial={{ opacity: 0, x: 28, scale: 0.98, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: 18, scale: 0.985, filter: 'blur(8px)' }}
                transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-auto relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/45 shadow-[0_12px_70px_rgba(0,0,0,0.44)] backdrop-blur-2xl"
            >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_20%),radial-gradient(circle_at_10%_0%,rgba(96,165,250,0.12),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.015))]" />
                <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-white/35 to-transparent" />

                <div className="relative p-4 md:p-5">
                <p className="text-[10px] uppercase tracking-[0.34em] text-slate-500">
                    Orbital archive
                </p>

                <h2 className="mt-2 text-[1.7rem] font-semibold tracking-[-0.04em] text-white md:text-[1.85rem]">
                    Select a celestial body
                </h2>

                <p className="mt-3 max-w-[32ch] text-sm leading-6 text-slate-300">
                    Click the Sun or any planet to open a focused profile panel with live backend data and a curated visual summary.
                </p>

                <div className="mt-5 rounded-[20px] border border-white/8 bg-white/5 p-4">
                    <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-sky-300 shadow-[0_0_18px_rgba(125,211,252,0.85)]" />
                    <p className="text-sm text-slate-300">
                        Awaiting celestial selection
                    </p>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2.5">
                    <div className="rounded-[18px] border border-white/6 bg-black/10 p-3.5">
                        <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                        Mode
                        </p>
                        <p className="mt-2.5 text-sm font-medium text-white">
                        Overview
                        </p>
                    </div>

                    <div className="rounded-[18px] border border-white/6 bg-black/10 p-3.5">
                        <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                        Data state
                        </p>
                        <p className="mt-2.5 text-sm font-medium text-white">
                        Waiting for selection
                        </p>
                    </div>
                    </div>
                </div>
                </div>
            </motion.div>
            )}
        </AnimatePresence>
        </aside>
    )
}

export default PlanetInfoPanel