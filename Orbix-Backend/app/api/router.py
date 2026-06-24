from fastapi import APIRouter

from app.api.v1.solar_system import router as solar_system_router


api_router = APIRouter()
api_router.include_router(solar_system_router)
