from __future__ import annotations
from typing import Any
import httpx


class BaseApiClient:
    def __init__(self, base_url: str, timeout: float) -> None:
        self._base_url = base_url
        self._timeout = timeout

    async def get(
        self,
        path: str,
        params: dict[str, Any] | None = None,
        headers: dict[str, str] | None = None,
    ) -> dict[str, Any]:
        async with httpx.AsyncClient(
            base_url=self._base_url,
            timeout=self._timeout,
            headers=headers,
        ) as client:
            response = await client.get(path, params=params)
            response.raise_for_status()
            return response.json()
