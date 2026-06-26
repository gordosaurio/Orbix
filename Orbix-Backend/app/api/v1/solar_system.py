from fastapi import APIRouter, HTTPException

from app.clients.jpl_horizons import JplHorizonsClient
from app.schemas import BodyGeneralInfoSchema, PlanetsGeneralInfoResponseSchema
from app.services.planets import PlanetService
from app.services.stars import StarService


router = APIRouter(prefix="/info", tags=["Solar System"])


@router.get("/sun", response_model=BodyGeneralInfoSchema)
async def get_sun_info():
    try:
        service = StarService()
        return await service.get_sun_general_info()
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Failed to fetch Sun information: {str(exc)}",
        ) from exc


@router.get("/planets", response_model=PlanetsGeneralInfoResponseSchema)
async def get_planets_info():
    try:
        service = PlanetService()
        return await service.get_planets_general_info()
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Failed to fetch planets information: {str(exc)}",
        ) from exc


@router.get("/planet/{planet_id}", response_model=BodyGeneralInfoSchema)
async def get_planet_info(planet_id: str):
    try:
        service = PlanetService()
        planet = await service.get_planet_general_info_by_id(planet_id)

        if planet is None:
            raise HTTPException(
                status_code=404,
                detail=f"Planet with id '{planet_id}' was not found.",
            )

        return planet
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Failed to fetch planet information: {str(exc)}",
        ) from exc


@router.get("/jpl/test")
async def test_jpl_connection():
    try:
        client = JplHorizonsClient()
        return await client.get_raw_object_data("499")
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Failed to connect to JPL Horizons: {str(exc)}",
        ) from exc