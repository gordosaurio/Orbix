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


class PlanetsGeneralInfoResponseSchema(RootModel[Dict[str, BodyGeneralInfoSchema]]):
    pass
