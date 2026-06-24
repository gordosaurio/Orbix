from fastapi import FastAPI, HTTPException

from app.clients.solar_system_open_data import SolarSystemOpenDataClient

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


@app.get("/debug/solar-system")
async def debug_solar_system() -> dict:
    try:
        client = SolarSystemOpenDataClient()
        response = await client.get_all_bodies()

        bodies = response.get("bodies", [])

        return {
            "connected": True,
            "contains_bodies": "bodies" in response,
            "total_bodies": len(bodies),
            "sample_body_names": [body.get("englishName") for body in bodies[:5]],
        }
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Failed to connect to Solar System OpenData: {str(exc)}",
        ) from exc
