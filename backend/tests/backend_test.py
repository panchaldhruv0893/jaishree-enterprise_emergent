"""Backend tests for Jaishree Enterprise Owner CMS (auth + admin CRUD + public content)."""
import os
import re
import copy
import uuid
from pathlib import Path

import pytest
import requests
from dotenv import dotenv_values

frontend_env = dotenv_values("/app/frontend/.env")
base_url = os.environ.get("REACT_APP_BACKEND_URL") or frontend_env.get("REACT_APP_BACKEND_URL")
if not base_url:
    raise RuntimeError("REACT_APP_BACKEND_URL missing")
BASE_URL = base_url.rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="session")
def creds():
    p = Path("/app/memory/test_credentials.md")
    if not p.exists():
        pytest.skip("missing test_credentials.md")
    c = p.read_text()
    e = re.search(r'(?im)^\s*(?:[-*]\s*)?(?:\*\*)?Email(?:\*\*)?\s*:\s*`?([^`\s]+)', c)
    pw = re.search(r'(?im)^\s*(?:[-*]\s*)?(?:\*\*)?Password(?:\*\*)?\s*:\s*`?([^`\s]+)', c)
    if not e or not pw:
        pytest.skip("no creds found")
    return {"email": e.group(1), "password": pw.group(1)}


@pytest.fixture(scope="session")
def token(creds):
    r = requests.post(f"{API}/auth/login", json=creds, timeout=30)
    if r.status_code != 200:
        pytest.fail(f"login failed {r.status_code}: {r.text[:300]}")
    t = r.json().get("token")
    assert t
    return t


@pytest.fixture(scope="session")
def client(token):
    s = requests.Session()
    s.headers.update({"Authorization": f"Bearer {token}", "Content-Type": "application/json"})
    return s


# ---------------------------------------------------------------- public content
class TestPublic:
    def test_root(self):
        r = requests.get(f"{API}/", timeout=30)
        assert r.status_code == 200
        assert "message" in r.json()

    def test_products_list(self):
        r = requests.get(f"{API}/products", timeout=30)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list) and len(data) >= 1
        for p in data:
            assert "_id" not in p
            assert p.get("slug") and p.get("name")
            assert p.get("published", True) is True

    def test_product_detail_and_404(self):
        slug = requests.get(f"{API}/products", timeout=30).json()[0]["slug"]
        r = requests.get(f"{API}/products/{slug}", timeout=30)
        assert r.status_code == 200
        assert r.json()["slug"] == slug
        assert "_id" not in r.json()
        assert requests.get(f"{API}/products/no-such-slug-xyz", timeout=30).status_code == 404

    def test_capabilities_and_milestones(self):
        rc = requests.get(f"{API}/capabilities", timeout=30)
        rm = requests.get(f"{API}/milestones", timeout=30)
        assert rc.status_code == 200 and rm.status_code == 200
        assert len(rc.json()) > 0 and len(rm.json()) > 0
        assert all("_id" not in x for x in rc.json() + rm.json())
        years = [m.get("year") for m in rm.json()]
        assert all(y for y in years)


# ---------------------------------------------------------------- auth
class TestAuth:
    def test_login_success(self, creds):
        r = requests.post(f"{API}/auth/login", json=creds, timeout=30)
        assert r.status_code == 200
        d = r.json()
        assert d["email"] == creds["email"].lower()
        assert isinstance(d["token"], str) and len(d["token"]) > 20
        assert d.get("role") == "owner"
        assert "password_hash" not in d
        # httpOnly cookie
        cookie_hdr = r.headers.get("set-cookie", "")
        assert "access_token=" in cookie_hdr and "HttpOnly" in cookie_hdr

    def test_login_wrong_password(self, creds):
        r = requests.post(f"{API}/auth/login",
                          json={"email": creds["email"], "password": "definitely-wrong-1"}, timeout=30)
        assert r.status_code == 401
        assert "Invalid" in r.json()["detail"]

    def test_login_unknown_user(self):
        r = requests.post(f"{API}/auth/login",
                          json={"email": "nobody-xyz@example.com", "password": "whatever12"}, timeout=30)
        assert r.status_code == 401

    def test_bcrypt_hash_format(self, creds):
        # verify stored hash uses bcrypt $2b$
        try:
            from motor.motor_asyncio import AsyncIOMotorClient  # noqa
            import asyncio
            be = dotenv_values("/app/backend/.env")
            cl = AsyncIOMotorClient(be["MONGO_URL"])

            async def get():
                return await cl[be["DB_NAME"]].users.find_one({"email": creds["email"].lower()})
            user = asyncio.get_event_loop().run_until_complete(get()) if False else asyncio.run(get())
        except Exception as e:
            pytest.skip(f"db access unavailable: {e}")
        assert user is not None, "owner user not seeded"
        assert user["password_hash"].startswith("$2b$"), user["password_hash"][:10]

    def test_me_requires_token(self):
        assert requests.get(f"{API}/auth/me", timeout=30).status_code == 401

    def test_me_invalid_token(self):
        r = requests.get(f"{API}/auth/me", headers={"Authorization": "Bearer garbage.token.x"}, timeout=30)
        assert r.status_code == 401

    def test_me_with_token(self, client, creds):
        r = client.get(f"{API}/auth/me", timeout=30)
        assert r.status_code == 200
        d = r.json()
        assert d["email"] == creds["email"].lower()
        assert "password_hash" not in d and "_id" not in d

    def test_logout(self, client):
        r = client.post(f"{API}/auth/logout", timeout=30)
        assert r.status_code == 200

    def test_change_password_wrong_current(self, client):
        r = client.post(f"{API}/auth/change-password",
                        json={"current_password": "wrong-current", "new_password": "SomeNewPass123"}, timeout=30)
        assert r.status_code == 401
        assert r.json()["detail"] == "Current password is incorrect"

    def test_change_password_short_new(self, client, creds):
        r = client.post(f"{API}/auth/change-password",
                        json={"current_password": creds["password"], "new_password": "short"}, timeout=30)
        assert r.status_code == 422

    def test_brute_force_lockout(self):
        # unique email so we do not lock the owner account
        # randomised per-run: the server keeps a 15-min in-memory counter per ip:email
        email = f"lockout-probe-{uuid.uuid4().hex[:10]}@example.com"
        codes = []
        for _ in range(7):
            r = requests.post(f"{API}/auth/login", json={"email": email, "password": "bad"}, timeout=30)
            codes.append(r.status_code)
        assert 429 in codes, f"no lockout after 7 failures: {codes}"
        assert codes[:5] == [401] * 5, codes


# ---------------------------------------------------------------- admin auth protection
class TestAdminAuthProtection:
    ENDPOINTS = [
        ("get", "/admin/products"), ("post", "/admin/products"), ("put", "/admin/products/x"),
        ("get", "/admin/capabilities"), ("post", "/admin/capabilities"), ("delete", "/admin/capabilities/x"),
        ("get", "/admin/milestones"), ("post", "/admin/milestones"), ("delete", "/admin/milestones/x"),
        ("get", "/admin/quotes"),
    ]

    @pytest.mark.parametrize("method,path", ENDPOINTS)
    def test_requires_auth(self, method, path):
        r = requests.request(method, f"{API}{path}", json={}, timeout=30)
        assert r.status_code == 401, f"{method.upper()} {path} -> {r.status_code}"


# ---------------------------------------------------------------- admin products
class TestAdminProducts:
    def test_list_products(self, client):
        r = client.get(f"{API}/admin/products", timeout=30)
        assert r.status_code == 200
        data = r.json()
        assert len(data) >= 4, f"expected >=4 products, got {len(data)}"
        assert all("_id" not in p for p in data)

    def test_update_product_persists(self, client):
        orig = client.get(f"{API}/admin/products", timeout=30).json()[0]
        slug = orig["slug"]
        backup = copy.deepcopy(orig)
        payload = {
            "name": orig["name"], "tagline": "TEST_tagline_qa",
            "image": orig.get("image", ""), "published": True,
            "overview": ["TEST_overview line one"],
            "applications": ["TEST_app_a", "TEST_app_b"],
            "specs": (orig.get("specs") or []) + [{"label": "TEST_spec", "value": "42 mm"}],
            "benefits": orig.get("benefits") or [],
            "gallery": orig.get("gallery") or [],
        }
        r = client.put(f"{API}/admin/products/{slug}", json=payload, timeout=30)
        assert r.status_code == 200, r.text

        pub = requests.get(f"{API}/products/{slug}", timeout=30).json()
        assert pub["tagline"] == "TEST_tagline_qa"
        assert pub["applications"] == ["TEST_app_a", "TEST_app_b"]
        assert {"label": "TEST_spec", "value": "42 mm"} in pub["specs"]

        # restore
        restore = {k: backup.get(k) for k in
                   ["name", "tagline", "image", "published", "overview", "applications", "specs", "benefits", "gallery"]}
        rr = client.put(f"{API}/admin/products/{slug}", json=restore, timeout=30)
        assert rr.status_code == 200
        after = requests.get(f"{API}/products/{slug}", timeout=30).json()
        assert after["tagline"] == backup["tagline"]

    def test_publish_toggle_hides_from_public(self, client):
        products = client.get(f"{API}/admin/products", timeout=30).json()
        slug = products[-1]["slug"]
        assert client.put(f"{API}/admin/products/{slug}", json={"published": False}, timeout=30).status_code == 200
        public_slugs = [p["slug"] for p in requests.get(f"{API}/products", timeout=30).json()]
        admin_slugs = [p["slug"] for p in client.get(f"{API}/admin/products", timeout=30).json()]
        try:
            assert slug not in public_slugs, "hidden product still public"
            assert slug in admin_slugs, "hidden product missing from admin list"
        finally:
            assert client.put(f"{API}/admin/products/{slug}", json={"published": True}, timeout=30).status_code == 200
        assert slug in [p["slug"] for p in requests.get(f"{API}/products", timeout=30).json()]

    def test_update_unknown_slug_404(self, client):
        r = client.put(f"{API}/admin/products/no-such-slug-xyz", json={"name": "x"}, timeout=30)
        assert r.status_code == 404

    def test_create_product_validation(self, client):
        r = client.post(f"{API}/admin/products", json={"name": "TEST_only_name"}, timeout=30)
        assert r.status_code == 422

    def test_create_and_hide_product(self, client):
        slug = "test-qa-temp-product"
        r = client.post(f"{API}/admin/products",
                        json={"slug": slug, "name": "TEST_QA Product", "order": 99, "published": False}, timeout=30)
        assert r.status_code == 200
        assert slug in [p["slug"] for p in client.get(f"{API}/admin/products", timeout=30).json()]
        assert slug not in [p["slug"] for p in requests.get(f"{API}/products", timeout=30).json()]
        # cleanup directly in db (no admin delete endpoint exists)
        import asyncio
        from motor.motor_asyncio import AsyncIOMotorClient
        be = dotenv_values("/app/backend/.env")
        cl = AsyncIOMotorClient(be["MONGO_URL"])

        async def rm():
            await cl[be["DB_NAME"]].products.delete_one({"slug": slug})
        asyncio.run(rm())
        assert slug not in [p["slug"] for p in client.get(f"{API}/admin/products", timeout=30).json()]


# ---------------------------------------------------------------- admin capabilities
class TestAdminCapabilities:
    def test_crud_capability(self, client):
        before = client.get(f"{API}/admin/capabilities", timeout=30).json()
        r = client.post(f"{API}/admin/capabilities",
                        json={"title": "TEST_Cap", "text": "TEST cap text", "confirmed": False, "order": 99}, timeout=30)
        assert r.status_code == 200
        cid = r.json()["id"]
        assert cid

        pub = requests.get(f"{API}/capabilities", timeout=30).json()
        created = next((c for c in pub if c["id"] == cid), None)
        assert created is not None, "created capability not in public list"
        assert created["title"] == "TEST_Cap" and created["confirmed"] is False

        # update in place
        r2 = client.post(f"{API}/admin/capabilities",
                         json={"id": cid, "title": "TEST_Cap edited", "text": "edited", "confirmed": True, "order": 99},
                         timeout=30)
        assert r2.status_code == 200 and r2.json()["id"] == cid
        upd = next(c for c in requests.get(f"{API}/capabilities", timeout=30).json() if c["id"] == cid)
        assert upd["title"] == "TEST_Cap edited" and upd["confirmed"] is True

        assert client.delete(f"{API}/admin/capabilities/{cid}", timeout=30).status_code == 200
        after = client.get(f"{API}/admin/capabilities", timeout=30).json()
        assert cid not in [c["id"] for c in after]
        assert len(after) == len(before)


# ---------------------------------------------------------------- admin milestones
class TestAdminMilestones:
    def test_crud_milestone(self, client):
        before = client.get(f"{API}/admin/milestones", timeout=30).json()
        r = client.post(f"{API}/admin/milestones",
                        json={"year": "2099", "title": "TEST_Milestone", "text": "TEST text",
                              "placeholder": True, "order": 99}, timeout=30)
        assert r.status_code == 200
        mid = r.json()["id"]
        pub = requests.get(f"{API}/milestones", timeout=30).json()
        created = next((m for m in pub if m["id"] == mid), None)
        assert created and created["year"] == "2099" and created["placeholder"] is True

        r2 = client.post(f"{API}/admin/milestones",
                         json={"id": mid, "year": "2098", "title": "TEST_Milestone edited",
                               "text": "edited", "placeholder": False, "order": 98}, timeout=30)
        assert r2.status_code == 200
        upd = next(m for m in requests.get(f"{API}/milestones", timeout=30).json() if m["id"] == mid)
        assert upd["year"] == "2098" and upd["placeholder"] is False

        assert client.delete(f"{API}/admin/milestones/{mid}", timeout=30).status_code == 200
        after = client.get(f"{API}/admin/milestones", timeout=30).json()
        assert mid not in [m["id"] for m in after] and len(after) == len(before)


# ---------------------------------------------------------------- admin quotes
class TestAdminQuotes:
    def test_list_quotes(self, client):
        r = client.get(f"{API}/admin/quotes", timeout=30)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        for q in data:
            assert "_id" not in q
            assert q.get("id") and q.get("email")


# ---------------------------------------------------------------- RFQ submission + drawing download
class TestRFQ:
    def test_quote_validation_bad_email(self):
        r = requests.post(f"{API}/quotes",
                          data={"name": "TEST_QA", "email": "not-an-email", "product": "Sleeves"}, timeout=60)
        assert r.status_code == 422, r.text

    def test_submit_quote_with_drawing_and_download(self, client):
        png = bytes.fromhex(
            "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4"
            "890000000a49444154789c6360000002000154a24f5f0000000049454e44ae426082")
        r = requests.post(
            f"{API}/quotes",
            data={"name": "TEST_QA Buyer", "email": "delivered@resend.dev", "company": "TEST_QA Co",
                  "phone": "+91 9000000000", "location": "Ahmedabad, India",
                  "product": "Vacuum Calibration Sleeves", "material": "Aluminium",
                  "specs": "TEST_QA 120mm OD", "quantity": "2", "message": "TEST_QA automated test"},
            files={"drawing": ("test_drawing.png", png, "image/png")},
            timeout=120,
        )
        assert r.status_code == 200, f"{r.status_code}: {r.text[:400]}"
        body = r.json()
        assert body["status"] == "success"
        qid = body["id"]
        assert qid and qid != "ok"

        # drawing retrievable
        d = requests.get(f"{API}/files/{qid}/drawing", timeout=60)
        assert d.status_code == 200, d.text[:300]
        assert len(d.content) == len(png)

        # appears in admin quotes with correct fields
        quotes = client.get(f"{API}/admin/quotes", timeout=30).json()
        rec = next((q for q in quotes if q["id"] == qid), None)
        assert rec is not None, "quote not listed in admin panel"
        assert rec["name"] == "TEST_QA Buyer"
        assert rec["product"] == "Vacuum Calibration Sleeves"
        assert rec["drawing_name"] == "test_drawing.png"
        assert rec.get("drawing_path")

    def test_drawing_download_unknown_id_404(self):
        assert requests.get(f"{API}/files/{'0'*36}/drawing", timeout=30).status_code == 404

    def test_honeypot_silently_accepts(self):
        r = requests.post(f"{API}/quotes",
                          data={"name": "TEST_bot", "email": "bot@example.com", "product": "x",
                                "website": "http://spam"}, timeout=60)
        assert r.status_code == 200 and r.json()["id"] == "ok"
