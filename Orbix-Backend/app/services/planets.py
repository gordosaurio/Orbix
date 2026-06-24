from __future__ import annotations
from typing import Any

from app.clients.solar_system_open_data import SolarSystemOpenDataClient
from app.services.mappers import build_general_info


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
