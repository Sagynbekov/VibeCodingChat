from fastapi.testclient import TestClient
from .main import app

client = TestClient(app)

def test_read_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_create_user_validation():
    # Проверка, что API требует username
    response = client.post("/api/users", json={})
    assert response.status_code == 422 # Validation Error
