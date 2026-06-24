from fastapi import APIRouter, HTTPException

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
