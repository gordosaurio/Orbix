from __future__ import annotations
from typing import Any
import re

from app.clients.base import BaseApiClient
from app.core.config import settings
from app.schemas.solar_system import PlanetSpecializedInfoSchema


HORIZONS_MAJOR_BODIES: dict[str, str] = {
    "sun": "10",
    "mercury": "199",
    "venus": "299",
    "earth": "399",
    "mars": "499",
    "jupiter": "599",
    "saturn": "699",
    "uranus": "799",
    "neptune": "899",
}


class JplHorizonsClient:
    def __init__(self) -> None:
        self._client = BaseApiClient(
            base_url=settings.jpl_horizons_api_base_url,
            timeout=settings.request_timeout_seconds,
        )

    async def get_raw_object_data(self, command: str) -> dict[str, Any]:
        return await self._client.get(
            path="/api/horizons.api",
            params={
                "format": "json",
                "COMMAND": f"'{command}'",
                "OBJ_DATA": "'YES'",
                "MAKE_EPHEM": "'NO'",
            },
        )

    async def get_all_major_bodies_raw_data(self) -> dict[str, dict[str, Any]]:
        result: dict[str, dict[str, Any]] = {}

        for body_name, command in HORIZONS_MAJOR_BODIES.items():
            result[body_name] = await self.get_raw_object_data(command)

        return result

    async def get_body_raw_data_by_id(self, body_id: str) -> dict[str, Any] | None:
        command = HORIZONS_MAJOR_BODIES.get(body_id.lower())

        if not command:
            return None

        return await self.get_raw_object_data(command)

    async def get_specialized_planet_info_by_name(
        self, planet_name: str
    ) -> PlanetSpecializedInfoSchema | None:
        normalized_name = planet_name.strip().lower()
        command = HORIZONS_MAJOR_BODIES.get(normalized_name)

        if not command or normalized_name == "sun":
            return None

        raw = await self.get_raw_object_data(command)
        result_text = raw.get("result", "")

        return self._parse_specialized_planet_info(
            name=planet_name.strip(),
            text=result_text,
        )

    def _parse_specialized_planet_info(
        self, name: str, text: str
    ) -> PlanetSpecializedInfoSchema:
        revised = self._extract(r"Revised:\s*([A-Za-z]+\s+\d{1,2},\s+\d{4})", text)

        mean_radius = self._extract_float(
            r"Vol\.\s*[Mm]ean [Rr]adius.*?=\s*([0-9]+(?:\.[0-9]+)?)", text
        )

        equatorial_radius = self._extract_float(
            r"Equ(?:at(?:orial)?|\.)\.?\s*[Rr]adius.*?=\s*([0-9]+(?:\.[0-9]+)?)", text
        )

        density = self._extract_float(
            r"Density\s*\(g\/cm\^?3\)|Density\s*\(g cm\^-3\)|Density\s*\(g\/cm\^3\)",
            text,
            value_after_label=True,
        )

        mass_match = self._extract_mass(text)

        gravity = self._extract_float(
            r"(?:Equ\.\s*gravity\s*m\/s\^2|Equ\.\s*grav[, ]+ge\s*\(m\/s\^2\)|g_o,\s*m\/s\^2\s*=)\s*=?\s*([0-9]+(?:\.[0-9]+)?)",
            text,
        )

        mean_temperature = self._extract_float(
            r"(?:Mean Temperature\s*\(K\)|Mean temperature\s*\(K\)|Mean surface temp \(Ts\), K|Atmos\.\s*temp\.\s*\(1 bar\)|Atmos\.\s*temp\.\s*\(1 bar\)\s*)\s*=?\s*([0-9]+(?:\.[0-9]+)?)",
            text,
        )

        sidereal_rotation = self._extract(
            r"(?:Sidereal rot\. period|Sid\. rot\. period \(III\)|Rot\. period).*?=\s*([^\n]+)",
            text,
        )

        sidereal_orbit = self._extract(
            r"(?:Sidereal orbit period|Sidereal orb\. per\.|Mean sidereal orb per|Sidereal orb\. per\., y|Sidereal orb period).*?=\s*([^\n]+)",
            text,
        )

        orbit_speed = self._extract_float(
            r"(?:Mean Orbit vel\.\s*km\/s|Orbit speed,\s*km\/s|Orbital speed,\s*km\/s|Mean orbit speed,\s*km\/s|Mean orbit velocity\s*=)\s*([0-9]+(?:\.[0-9]+)?)",
            text,
        )

        escape_speed = self._extract_float(
            r"(?:Escape vel\.\s*km\/s|Escape speed,\s*km\/s|Escape velocity\s*=|Escape speed \(1 bar\)\s*=)\s*([0-9]+(?:\.[0-9]+)?)",
            text,
        )

        obliquity = self._extract(
            r"(?:Obliquity to orbit(?:\[1\])?|Obliquity to orbit,\s*deg)\s*=?\s*([^\n]+)",
            text,
        )

        geometric_albedo = self._extract_float(
            r"Geometric Albedo\s*=\s*([0-9]+(?:\.[0-9]+)?)", text
        )

        return PlanetSpecializedInfoSchema(
            name=name,
            revised=revised,
            meanRadiusKm=mean_radius,
            equatorialRadiusKm=equatorial_radius,
            densityGcm3=density,
            massValue=mass_match["massValue"] if mass_match else None,
            massExponent=mass_match["massExponent"] if mass_match else None,
            gravityMs2=gravity,
            meanTemperatureK=mean_temperature,
            siderealRotationPeriod=sidereal_rotation.strip() if sidereal_rotation else None,
            siderealOrbitPeriod=sidereal_orbit.strip() if sidereal_orbit else None,
            orbitSpeedKmS=orbit_speed,
            escapeSpeedKmS=escape_speed,
            obliquityToOrbit=obliquity.strip() if obliquity else None,
            geometricAlbedo=geometric_albedo,
        )

    def _extract(self, pattern: str, text: str, value_after_label: bool = False) -> str | None:
        if value_after_label:
            lines = text.splitlines()
            for line in lines:
                if re.search(pattern, line, re.IGNORECASE):
                    parts = line.split("=")
                    if len(parts) > 1:
                        return parts[1].strip()
            return None

        match = re.search(pattern, text, re.IGNORECASE)
        return match.group(1).strip() if match else None

    def _extract_float(
        self, pattern: str, text: str, value_after_label: bool = False
    ) -> float | None:
        raw = self._extract(pattern, text, value_after_label=value_after_label)

        if raw is None:
            return None

        match = re.search(r"([0-9]+(?:\.[0-9]+)?)", raw)
        return float(match.group(1)) if match else None

    def _extract_mass(self, text: str) -> dict[str, int | float] | None:
        patterns = [
            r"Mass x10\^23 \(kg\)\s*=\s*([0-9]+(?:\.[0-9]+)?)",
            r"Mass x10\^24 \(kg\)\s*=\s*([0-9]+(?:\.[0-9]+)?)",
            r"Mass x 10\^26 \(kg\)\s*=\s*([0-9]+(?:\.[0-9]+)?)",
            r"Mass x10\^26 \(kg\)\s*=\s*([0-9]+(?:\.[0-9]+)?)",
        ]

        exponent_by_pattern = [23, 24, 26, 26]

        for pattern, exponent in zip(patterns, exponent_by_pattern):
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return {
                    "massValue": float(match.group(1)),
                    "massExponent": exponent,
                }

        return None
