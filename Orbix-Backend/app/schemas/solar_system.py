from __future__ import annotations
from typing import Dict

from pydantic import BaseModel, RootModel


class MassSchema(BaseModel):
    massValue: float
    massExponent: int


class VolumeSchema(BaseModel):
    volValue: float
    volExponent: int


class BodyGeneralInfoSchema(BaseModel):
    id: str
    moons: int
    perihelion: int
    aphelion: int
    mass: MassSchema
    vol: VolumeSchema
    density: float
    gravity: float
    equaRadius: float
    discoveredBy: str
    discoveryDate: str
    avgTemp: int


class PlanetSpecializedInfoSchema(BaseModel):
    name: str
    revised: str | None = None
    meanRadiusKm: float | None = None
    equatorialRadiusKm: float | None = None
    densityGcm3: float | None = None
    massValue: float | None = None
    massExponent: int | None = None
    gravityMs2: float | None = None
    meanTemperatureK: float | None = None
    siderealRotationPeriod: str | None = None
    siderealOrbitPeriod: str | None = None
    orbitSpeedKmS: float | None = None
    escapeSpeedKmS: float | None = None
    obliquityToOrbit: str | None = None
    geometricAlbedo: float | None = None


class SunSpecializedInfoSchema(BaseModel):
    name: str
    revised: str | None = None
    meanRadiusKm: float | None = None
    solarRadiusKm: float | None = None
    photosphereRadiusKm: float | None = None
    meanDensityGcm3: float | None = None
    surfaceGravityMs2: float | None = None
    escapeSpeedKmS: float | None = None
    effectiveTemperatureK: float | None = None
    photosphereTempBottomK: float | None = None
    photosphereTempTopK: float | None = None
    siderealRotationPeriodDays: float | None = None
    obliquityToEclipticDeg: float | None = None
    solarConstantWm2: float | None = None
    luminosity10e24Js: float | None = None
    sunspotCycleYears: float | None = None


class NasaMediaItemSchema(BaseModel):
    nasaId: str
    title: str
    description: str | None = None
    url: str
    previewUrl: str | None = None
    mediaType: str


class PlanetMediaResponseSchema(BaseModel):
    name: str
    images: list[NasaMediaItemSchema]


class PlanetsGeneralInfoResponseSchema(RootModel[Dict[str, BodyGeneralInfoSchema]]):
    pass
