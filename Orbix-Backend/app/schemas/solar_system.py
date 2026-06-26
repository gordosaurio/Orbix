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


class PlanetsGeneralInfoResponseSchema(RootModel[Dict[str, BodyGeneralInfoSchema]]):
    pass
