from __future__ import annotations
from typing import Any

from app.clients.base import BaseApiClient
from app.core.config import settings


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