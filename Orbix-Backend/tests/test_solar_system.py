def test_get_sun_info(client):
    response = client.get("/info/sun")

    assert response.status_code == 200

    data = response.json()

    expected_keys = {
        "id",
        "moons",
        "perihelion",
        "aphelion",
        "mass",
        "vol",
        "density",
        "gravity",
        "equaRadius",
        "discoveredBy",
        "discoveryDate",
        "avgTemp",
    }

    assert set(data.keys()) == expected_keys
    assert isinstance(data["id"], str)
    assert isinstance(data["moons"], int)
    assert isinstance(data["mass"], dict)
    assert isinstance(data["vol"], dict)


def test_get_planets_info(client):
    response = client.get("/info/planets")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, dict)
    assert len(data) > 0

    first_planet = next(iter(data.values()))

    expected_keys = {
        "id",
        "moons",
        "perihelion",
        "aphelion",
        "mass",
        "vol",
        "density",
        "gravity",
        "equaRadius",
        "discoveredBy",
        "discoveryDate",
        "avgTemp",
    }

    assert set(first_planet.keys()) == expected_keys
