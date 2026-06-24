import pytest
from fastapi.testclient import TestClient

from app.main import app


def get_client() -> TestClient:
    return TestClient(app)


@pytest.fixture
def client() -> TestClient:
    return get_client()
