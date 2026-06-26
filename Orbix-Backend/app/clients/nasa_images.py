from __future__ import annotations
import random

from app.clients.base import BaseApiClient
from app.core.config import settings
from app.schemas.solar_system import NasaMediaItemSchema, PlanetMediaResponseSchema


class NasaImagesClient:
    def __init__(self) -> None:
        self._client = BaseApiClient(
            base_url=settings.nasa_images_api_base_url,
            timeout=settings.request_timeout_seconds,
        )

    async def search_planet_media_by_name(self, planet_name: str) -> PlanetMediaResponseSchema:
        payload = await self._client.get(
            path="/search",
            params={
                "q": planet_name,
                "media_type": "image",
            },
        )

        collection = payload.get("collection", {})
        items = collection.get("items", [])

        images: list[NasaMediaItemSchema] = []

        for item in items:
            data_list = item.get("data", [])
            links = item.get("links", [])

            if not data_list:
                continue

            data = data_list[0]
            media_type = data.get("media_type")
            nasa_id = data.get("nasa_id")
            title = data.get("title") or planet_name
            description = data.get("description")
            preview_url = links[0].get("href") if links else None

            asset_url = await self._resolve_asset_url(nasa_id, media_type, preview_url)

            if not nasa_id or not asset_url or media_type != "image":
                continue

            media_item = NasaMediaItemSchema(
                nasaId=nasa_id,
                title=title,
                description=description,
                url=asset_url,
                previewUrl=preview_url,
                mediaType=media_type,
            )

            images.append(media_item)

        images = self._pick_up_to_five(images)

        return PlanetMediaResponseSchema(
            name=planet_name,
            images=images,
        )

    async def _resolve_asset_url(
        self,
        nasa_id: str | None,
        media_type: str | None,
        fallback_url: str | None,
    ) -> str | None:
        if not nasa_id or not media_type:
            return fallback_url

        try:
            payload = await self._client.get(path=f"/asset/{nasa_id}")
            collection = payload.get("collection", {})
            items = collection.get("items", [])

            hrefs = [item.get("href") for item in items if item.get("href")]

            if media_type == "image":
                preferred = [
                    href for href in hrefs
                    if href.lower().endswith((".jpg", ".jpeg", ".png", ".webp"))
                ]
                if preferred:
                    return preferred[0]

            return hrefs[0] if hrefs else fallback_url
        except Exception:
            return fallback_url

    def _pick_up_to_five(
        self, items: list[NasaMediaItemSchema]
    ) -> list[NasaMediaItemSchema]:
        if len(items) <= 5:
            return items

        return random.sample(items, 5)
