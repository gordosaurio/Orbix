from fastapi import FastAPI

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