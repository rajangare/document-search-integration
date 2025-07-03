import pytest

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_search_tags():
    response = client.get("/search_tags/", params={"search_string": "tag1"})
    assert response.status_code == 200
    assert "tag1" in response.json()