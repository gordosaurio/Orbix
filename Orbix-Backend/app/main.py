from fastapi import FastAPI, HTTPException

from app.services.planets import PlanetService
from app.services.stars import StarService


app = FastAPI(
    title="Orbix API",
    version="0.1.0",
    description="Backend API for celestial objects and Solar System data.",
)


@app.get("/")
async def root() -> dict[str, str]:
    return {"message": "Orbix API is running"}


@app.get("/health")
async def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/info/sun")
async def get_sun_info():
    try:
        service = StarService()
        return await service.get_sun_general_info()
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Failed to fetch Sun information: {str(exc)}",
        ) from exc


@app.get("/info/planets")
async def get_planets_info():
    try:
        service = PlanetService()
        return await service.get_planets_general_info()
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Failed to fetch planets information: {str(exc)}",
        ) from exc
