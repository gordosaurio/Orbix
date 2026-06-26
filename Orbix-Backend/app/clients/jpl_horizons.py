from __future__ import annotations
from typing import Any

from app.clients.base import BaseApiClient
from app.core.config import settings


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