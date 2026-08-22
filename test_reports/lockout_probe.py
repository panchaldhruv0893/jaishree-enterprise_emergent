import requests
from dotenv import dotenv_values

BASE = dotenv_values("/app/frontend/.env")["REACT_APP_BACKEND_URL"].rstrip("/")
email = "lockout-probe-fixed-1@example.com"
codes = []
for _ in range(12):
    r = requests.post(f"{BASE}/api/auth/login", json={"email": email, "password": "bad"}, timeout=30)
    codes.append(r.status_code)
print("public url:", codes)

codes = []
for _ in range(12):
    r = requests.post("http://localhost:8001/api/auth/login", json={"email": email, "password": "bad"}, timeout=30)
    codes.append(r.status_code)
print("localhost:", codes)
