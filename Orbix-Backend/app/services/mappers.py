from __future__ import annotations
from typing import Any


def build_general_info(body: dict[str, Any]) -> dict[str, Any]:
    moons = body.get("moons")

    return {
        "id": body.get("id"),
        "moons": len(moons) if moons else 0,
        "perihelion": body.get("perihelion"),
        "aphelion": body.get("aphelion"),
        "mass": body.get("mass"),
        "vol": body.get("vol"),
        "density": body.get("density"),
        "gravity": body.get("gravity"),
        "equaRadius": body.get("equaRadius"),
        "discoveredBy": body.get("discoveredBy"),
        "discoveryDate": body.get("discoveryDate"),
        "avgTemp": body.get("avgTemp"),
    }
