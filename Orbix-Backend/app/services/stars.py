from __future__ import annotations
from typing import Any

from app.clients.solar_system_open_data import SolarSystemOpenDataClient
from app.services.mappers import build_general_info


class StarService:
    def __init__(self) -> None:
        self._client = SolarSystemOpenDataClient()

    async def get_sun_general_info(self) -> dict[str, Any]:
        sun = await self._client.get_body_by_id("soleil")
        return build_general_info(sun)
