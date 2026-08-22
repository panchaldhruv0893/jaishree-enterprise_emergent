import requests, os, uuid
from dotenv import dotenv_values
BASE = dotenv_values("/app/frontend/.env")["REACT_APP_BACKEND_URL"].rstrip("/")
API = BASE + "/api"

print("== brute force via public url ==")
email = f"probe-{uuid.uuid4().hex[:6]}@example.com"
for i in range(7):
    r = requests.post(f"{API}/auth/login", json={"email": email, "password": "bad"}, timeout=30)
    print(i, r.status_code, r.text[:80])

print("== brute force via localhost ==")
email = f"probe-{uuid.uuid4().hex[:6]}@example.com"
for i in range(7):
    r = requests.post("http://localhost:8001/api/auth/login", json={"email": email, "password": "bad"}, timeout=30)
    print(i, r.status_code, r.text[:80])

print("== storage put direct ==")
be = dotenv_values("/app/backend/.env")
STORAGE = (be.get("INTEGRATION_PROXY_URL") or "https://integrations.emergentagent.com").rstrip("/") + "/objstore/api/v1/storage"
init = requests.post(f"{STORAGE}/init", json={"emergent_key": be.get("EMERGENT_LLM_KEY")}, timeout=30)
print("init", init.status_code, init.text[:200])
key = init.json().get("storage_key")
data = b"%PDF-1.4 test drawing\n" + b"0" * 500
r = requests.put(f"{STORAGE}/objects/jaishree-enterprise/drawings/qa-test-{uuid.uuid4().hex[:6]}.pdf",
                 headers={"X-Storage-Key": key, "Content-Type": "application/pdf"}, data=data, timeout=60)
print("put pdf", r.status_code, r.text[:300])
png = bytes.fromhex("89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c6360000002000154a24f5f0000000049454e44ae426082")
r2 = requests.put(f"{STORAGE}/objects/jaishree-enterprise/drawings/qa-test-{uuid.uuid4().hex[:6]}.png",
                  headers={"X-Storage-Key": key, "Content-Type": "image/png"}, data=png, timeout=60)
print("put png", r2.status_code, r2.text[:300])
