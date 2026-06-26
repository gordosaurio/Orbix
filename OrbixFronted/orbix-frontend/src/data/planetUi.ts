export type CelestialFact = {
    label: string
    value: string
}

export type CelestialUiEntry = {
    accent: string
    eyebrow: string
    summary: string
    facts: CelestialFact[]
}

export const celestialUiMap: Record<string, CelestialUiEntry> = {
    sun: {
        accent: '#f7c46b',
        eyebrow: 'Central star',
        summary:
        'The radiant core of the system, projecting heat, light, and gravitational order across every orbit.',
        facts: [
        { label: 'Body type', value: 'Star' },
        { label: 'Role', value: 'System center' },
        { label: 'Visual feel', value: 'Radiant, dominant, incandescent' },
        { label: 'Mood', value: 'Vast, luminous, sovereign' },
        ],
    },
    mercury: {
        accent: '#aeb4c4',
        eyebrow: 'Inner world',
        summary:
        'The swiftest planet in the system, shaped by extreme sunlight and long shadows.',
        facts: [
        { label: 'Body type', value: 'Planet' },
        { label: 'Orbit class', value: 'Terrestrial' },
        { label: 'Atmosphere', value: 'Extremely thin exosphere' },
        { label: 'Mood', value: 'Fast, silent, scorched' },
        ],
    },
    venus: {
        accent: '#d9b17a',
        eyebrow: 'Veiled world',
        summary:
        'A dense and radiant planet wrapped in thick clouds and a powerful golden glow.',
        facts: [
        { label: 'Body type', value: 'Planet' },
        { label: 'Orbit class', value: 'Terrestrial' },
        { label: 'Atmosphere', value: 'Dense carbon-rich cloud layer' },
        { label: 'Mood', value: 'Bright, heavy, mysterious' },
        ],
    },
    earth: {
        accent: '#58a6ff',
        eyebrow: 'Living world',
        summary:
        'A balanced blue sphere where oceans, atmosphere, and light create a familiar calm.',
        facts: [
        { label: 'Body type', value: 'Planet' },
        { label: 'Orbit class', value: 'Terrestrial' },
        { label: 'Atmosphere', value: 'Nitrogen-oxygen rich' },
        { label: 'Mood', value: 'Alive, vivid, stable' },
        ],
    },
    mars: {
        accent: '#d97757',
        eyebrow: 'Red frontier',
        summary:
        'A dry rust-colored desert planet marked by dust, rock basins, and cold horizons.',
        facts: [
        { label: 'Body type', value: 'Planet' },
        { label: 'Orbit class', value: 'Terrestrial' },
        { label: 'Atmosphere', value: 'Thin carbon dioxide layer' },
        { label: 'Mood', value: 'Remote, cinematic, austere' },
        ],
    },
    jupiter: {
        accent: '#d7b089',
        eyebrow: 'Gas giant',
        summary:
        'A colossal striped atmosphere in constant motion, filled with storms and layered clouds.',
        facts: [
        { label: 'Body type', value: 'Planet' },
        { label: 'Orbit class', value: 'Gas giant' },
        { label: 'Atmosphere', value: 'Hydrogen and helium' },
        { label: 'Mood', value: 'Massive, stormy, dominant' },
        ],
    },
    saturn: {
        accent: '#d8c18a',
        eyebrow: 'Ringed giant',
        summary:
        'A pale golden world defined by elegant rings and a soft atmospheric banding.',
        facts: [
        { label: 'Body type', value: 'Planet' },
        { label: 'Orbit class', value: 'Gas giant' },
        { label: 'Signature', value: 'Iconic ring system' },
        { label: 'Mood', value: 'Graceful, expansive, iconic' },
        ],
    },
    uranus: {
        accent: '#8cc8d8',
        eyebrow: 'Ice giant',
        summary:
        'A serene cyan planet with a cold atmosphere and a quietly unusual axial tilt.',
        facts: [
        { label: 'Body type', value: 'Planet' },
        { label: 'Orbit class', value: 'Ice giant' },
        { label: 'Atmosphere', value: 'Hydrogen, helium, methane' },
        { label: 'Mood', value: 'Cool, minimal, quiet' },
        ],
    },
    neptune: {
        accent: '#5b7fff',
        eyebrow: 'Deep blue giant',
        summary:
        'A dark luminous world of fast winds, saturated blues, and far-edge intensity.',
        facts: [
        { label: 'Body type', value: 'Planet' },
        { label: 'Orbit class', value: 'Ice giant' },
        { label: 'Atmosphere', value: 'Hydrogen, helium, methane' },
        { label: 'Mood', value: 'Deep, cold, dramatic' },
        ],
    },
}