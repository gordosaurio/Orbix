from __future__ import annotations
from typing import Any

from app.clients.base import BaseApiClient
from app.core.config import settings


class SolarSystemOpenDataClient:
    def __init__(self) -> None:
        self._client = BaseApiClient(
            base_url=settings.solar_system_api_base_url,
            timeout=settings.request_timeout_seconds,
        )
        self._auth_headers = {
            "Authorization": f"Bearer {settings.solar_system_api_token}",
        }

    def _build_general_info(self, body: dict[str, Any]) -> dict[str, Any]:
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

    async def get_all_bodies(self) -> dict[str, Any]:
        return await self._client.get(
            path="/rest/bodies/",
            headers=self._auth_headers,
        )

    async def get_planets(self) -> list[dict[str, Any]]:
        response = await self.get_all_bodies()
        bodies = response.get("bodies", [])

        planets = [
            body
            for body in bodies
            if body.get("isPlanet") is True
        ]
        return planets

    async def get_planets_general_info(self) -> dict[str, dict[str, Any]]:
        planets = await self.get_planets()
        result: dict[str, dict[str, Any]] = {}

        for planet in planets:
            english_name = planet.get("englishName")

            if not english_name:
                continue

            result[english_name] = self._build_general_info(planet)

        return result

    async def get_body_by_id(self, body_id: str) -> dict[str, Any]:
        return await self._client.get(
            path=f"/rest/bodies/{body_id}",
            headers=self._auth_headers,
        )

    async def get_sun_general_info(self) -> dict[str, Any]:
        sun = await self.get_body_by_id("soleil")
        return self._build_general_info(sun)
