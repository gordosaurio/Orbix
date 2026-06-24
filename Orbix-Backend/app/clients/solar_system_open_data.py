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

    async def get_all_bodies(self) -> dict[str, Any]:
        return await self._client.get(
            path="/rest/bodies/",
            headers=self._auth_headers,
        )

    async def get_body_by_id(self, body_id: str) -> dict[str, Any]:
        return await self._client.get(
            path=f"/rest/bodies/{body_id}",
            headers=self._auth_headers,
        )
