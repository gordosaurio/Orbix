from __future__ import annotations
from typing import Any

from app.clients.solar_system_open_data import SolarSystemOpenDataClient
from app.services.mappers import build_general_info


PLANET_PROVIDER_IDS: dict[str, str] = {
    "mercury": "mercure",
    "venus": "venus",
    "earth": "terre",
    "mars": "mars",
    "jupiter": "jupiter",
    "saturn": "saturne",
    "uranus": "uranus",
    "neptune": "neptune",
}


class PlanetService:
    def __init__(self) -> None:
        self._client = SolarSystemOpenDataClient()

    async def get_planets(self) -> list[dict[str, Any]]:
        response = await self._client.get_all_bodies()
        bodies = response.get("bodies", [])

        return [
            body
            for body in bodies
            if body.get("isPlanet") is True
        ]

    async def get_planets_general_info(self) -> dict[str, dict[str, Any]]:
        planets = await self.get_planets()
        result: dict[str, dict[str, Any]] = {}

        for planet in planets:
            english_name = planet.get("englishName")

            if not english_name:
                continue

            result[english_name] = build_general_info(planet)

        return result

    async def get_planet_general_info_by_id(self, planet_id: str) -> dict[str, Any] | None:
        provider_planet_id = PLANET_PROVIDER_IDS.get(planet_id.lower())

        if not provider_planet_id:
            return None

        planet = await self._client.get_body_by_id(provider_planet_id)

        if not planet:
            return None

        if planet.get("isPlanet") is not True:
            return None

        return build_general_info(planet)