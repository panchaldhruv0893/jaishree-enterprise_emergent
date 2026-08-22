import asyncio
import ipaddress
import logging
import os
import re
import time
import uuid
from datetime import datetime, timedelta, timezone
from html import escape
from html.parser import HTMLParser
from pathlib import Path
from typing import Optional
from urllib.parse import urlparse

import bcrypt
import httpx
import jwt
import requests
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, FastAPI, File, Form, HTTPException, Request, Response, UploadFile
from motor.motor_asyncio import AsyncIOMotorClient
from starlette.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI()
api_router = APIRouter(prefix="/api")
auth_router = APIRouter(prefix="/api/auth")
admin_router = APIRouter(prefix="/api/admin")

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------- email (Emergent managed Resend)
EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ["EMERGENT_EMAIL_KEY"]
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
EMAIL_REPLY_TO = os.environ.get("EMAIL_REPLY_TO")
OWNER_EMAIL = os.environ["OWNER_EMAIL"]
PUBLIC_API_URL = os.environ.get("PUBLIC_API_URL", "").rstrip("/")

_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str, reply_to: Optional[str] = None) -> Optional[str]:
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    if reply_to or EMAIL_REPLY_TO:
        payload["contact_email"] = reply_to or EMAIL_REPLY_TO
    try:
        async with httpx.AsyncClient(timeout=30) as client_http:
            resp = await client_http.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": EMAIL_KEY},
                json=payload,
            )
        resp.raise_for_status()
        return resp.json().get("id")
    except httpx.HTTPStatusError as e:
        logger.error(f"Email send failed: {e.response.status_code} {e.response.text}")
        raise HTTPException(status_code=502, detail="Failed to send email")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Email send error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send email")


# ---------------------------------------------------------------- object storage
STORAGE_BASE = (os.environ.get("INTEGRATION_PROXY_URL") or "").strip() or "https://integrations.emergentagent.com"
STORAGE_URL = STORAGE_BASE.rstrip("/") + "/objstore/api/v1/storage"
EMERGENT_KEY = os.environ.get("EMERGENT_LLM_KEY")
APP_NAME = "jaishree-enterprise"
storage_key = None


def init_storage(force: bool = False):
    global storage_key
    if storage_key and not force:
        return storage_key
    resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_KEY}, timeout=30)
    resp.raise_for_status()
    storage_key = resp.json()["storage_key"]
    return storage_key


def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    resp = requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data,
        timeout=120,
    )
    resp.raise_for_status()
    return resp.json()


def get_object(path: str):
    key = init_storage()
    resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key}, timeout=60)
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")


# ---------------------------------------------------------------- seed data
from seed_data import PRODUCTS, CAPABILITIES, MILESTONES  # noqa: E402


async def seed_if_empty():
    if await db.products.count_documents({}) == 0:
        await db.products.insert_many(PRODUCTS)
    if await db.capabilities.count_documents({}) == 0:
        await db.capabilities.insert_many(CAPABILITIES)
    if await db.milestones.count_documents({}) == 0:
        await db.milestones.insert_many(MILESTONES)


@app.on_event("startup")
async def startup():
    await seed_if_empty()
    await seed_owner()
    try:
        await asyncio.to_thread(init_storage)
        logger.info("Object storage initialized")
    except Exception as e:
        logger.error(f"Storage init failed: {e}")


# ---------------------------------------------------------------- public content routes
@api_router.get("/")
async def root():
    return {"message": "Jaishree Enterprise API"}


@api_router.get("/products")
async def list_products():
    return await db.products.find({"published": True}, {"_id": 0}).sort("order", 1).to_list(100)


@api_router.get("/products/{slug}")
async def get_product(slug: str):
    doc = await db.products.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Product not found")
    return doc


@api_router.get("/capabilities")
async def list_capabilities():
    return await db.capabilities.find({}, {"_id": 0}).to_list(100)


@api_router.get("/milestones")
async def list_milestones():
    return await db.milestones.find({}, {"_id": 0}).sort("order", 1).to_list(100)


# ---------------------------------------------------------------- RFQ
ALLOWED_EXT = {"pdf", "jpg", "jpeg", "png", "dwg", "dxf"}
MAX_FILE_BYTES = 10 * 1024 * 1024
_rate: dict = {}


def _rate_limit(ip: str):
    now = time.time()
    hits = [t for t in _rate.get(ip, []) if now - t < 3600]
    if len(hits) >= 6:
        raise HTTPException(status_code=429, detail="Too many enquiries. Please email us directly.")
    hits.append(now)
    _rate[ip] = hits


def _row(label: str, value: str) -> str:
    return (f'<tr><td style="padding:8px 12px;color:#666;font-size:13px;vertical-align:top;'
            f'border-bottom:1px solid #eee">{escape(label)}</td>'
            f'<td style="padding:8px 12px;font-size:14px;border-bottom:1px solid #eee">{value}</td></tr>')


@api_router.post("/quotes")
async def create_quote(
    request: Request,
    name: str = Form(...),
    email: str = Form(...),
    company: str = Form(""),
    phone: str = Form(""),
    location: str = Form(""),
    product: str = Form(...),
    material: str = Form(""),
    specs: str = Form(""),
    quantity: str = Form(""),
    delivery_date: str = Form(""),
    message: str = Form(""),
    website: str = Form(""),
    drawing: Optional[UploadFile] = File(None),
):
    if website:  # honeypot
        return {"status": "success", "id": "ok"}
    _rate_limit(request.client.host if request.client else "unknown")
    if not name.strip() or not product.strip():
        raise HTTPException(status_code=422, detail="Name and product are required")
    if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email):
        raise HTTPException(status_code=422, detail="Valid business email required")

    quote_id = str(uuid.uuid4())
    drawing_path, drawing_name = None, None
    if drawing and drawing.filename:
        ext = drawing.filename.rsplit(".", 1)[-1].lower() if "." in drawing.filename else ""
        if ext not in ALLOWED_EXT:
            raise HTTPException(status_code=422, detail="Drawing must be PDF, JPG, PNG, DWG or DXF")
        data = await drawing.read()
        if len(data) > MAX_FILE_BYTES:
            raise HTTPException(status_code=422, detail="Drawing must be under 10 MB")
        path = f"{APP_NAME}/drawings/{quote_id}.{ext}"
        result = await asyncio.to_thread(put_object, path, data, drawing.content_type or "application/octet-stream")
        drawing_path = result["path"]
        drawing_name = drawing.filename

    doc = {
        "id": quote_id,
        "name": name.strip(), "company": company.strip(), "email": email.strip(),
        "phone": phone.strip(), "location": location.strip(), "product": product.strip(),
        "material": material.strip(), "specs": specs.strip(), "quantity": quantity.strip(),
        "delivery_date": delivery_date.strip(), "message": message.strip(),
        "drawing_path": drawing_path, "drawing_name": drawing_name,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.quotes.insert_one(doc)

    rows = "".join([
        _row("Name", escape(doc["name"])),
        _row("Company", escape(doc["company"]) or "—"),
        _row("Business email", escape(doc["email"])),
        _row("Phone / WhatsApp", escape(doc["phone"]) or "—"),
        _row("City / Country", escape(doc["location"]) or "—"),
        _row("Product required", escape(doc["product"])),
        _row("Material", escape(doc["material"]) or "To be advised"),
        _row("Dimensions / specifications", escape(doc["specs"]) or "—"),
        _row("Quantity", escape(doc["quantity"]) or "—"),
        _row("Required delivery date", escape(doc["delivery_date"]) or "—"),
        _row("Message", escape(doc["message"]) or "—"),
    ])
    drawing_html = ""
    if drawing_path and PUBLIC_API_URL:
        link = f"{PUBLIC_API_URL}/api/files/{quote_id}/drawing"
        drawing_html = (f'<p style="font-size:14px">Drawing attached ({escape(drawing_name or "file")}): '
                        f'<a href="{link}">Download the drawing</a></p>')
    subject = f"New RFQ — {doc['product']} — {doc['company'] or doc['name']}"
    html = (f'<table role="presentation" width="100%" style="font-family:Arial,sans-serif;max-width:640px">'
            f'<tr><td style="padding:24px">'
            f'<h2 style="margin:0 0 16px;font-size:18px">New request for quotation</h2>'
            f'<table role="presentation" width="100%" style="border-collapse:collapse">{rows}</table>'
            f'{drawing_html}'
            f'<p style="font-size:12px;color:#888;margin-top:16px">Sent by the Jaishree Enterprise '
            f'website enquiry form.</p></td></tr></table>')
    await send_email(to=OWNER_EMAIL, subject=subject, html=html, reply_to=doc["email"])

    confirm_subject = "We have received your enquiry — Jaishree Enterprise"
    confirm_html = (f'<table role="presentation" width="100%" style="font-family:Arial,sans-serif;max-width:640px">'
                    f'<tr><td style="padding:24px">'
                    f'<p style="font-size:14px">Dear {escape(doc["name"])},</p>'
                    f'<p style="font-size:14px">Thank you for your enquiry regarding '
                    f'<strong>{escape(doc["product"])}</strong>. Our team will review your requirement '
                    f'and respond shortly.</p>'
                    f'<p style="font-size:14px">Jaishree Enterprise, 328-5, Devjipura, Dudheshwar, Ahmedabad, Gujarat 380004, India</p>'
                    f'<p style="font-size:12px;color:#888">Sent by Jaishree Enterprise. We never ask for '
                    f'passwords or card details by email.</p></td></tr></table>')
    await send_email(to=doc["email"], subject=confirm_subject, html=confirm_html)

    return {"status": "success", "id": quote_id}


@api_router.get("/files/{quote_id}/drawing")
async def download_drawing(quote_id: str):
    record = await db.quotes.find_one({"id": quote_id}, {"_id": 0})
    if not record or not record.get("drawing_path"):
        raise HTTPException(status_code=404, detail="File not found")
    data, content_type = await asyncio.to_thread(get_object, record["drawing_path"])
    return Response(content=data, media_type=content_type,
                    headers={"Content-Disposition": f'attachment; filename="{record.get("drawing_name", "drawing")}"'})


# ---------------------------------------------------------------- owner auth (JWT)
JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGORITHM = "HS256"
OWNER_LOGIN_EMAIL = os.environ["OWNER_LOGIN_EMAIL"].strip().lower()
OWNER_LOGIN_PASSWORD = os.environ["OWNER_LOGIN_PASSWORD"]
_login_attempts: dict = {}


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except ValueError:
        return False


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id, "email": email, "type": "access",
        "exp": datetime.now(timezone.utc) + timedelta(hours=12),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def seed_owner():
    existing = await db.users.find_one({"email": OWNER_LOGIN_EMAIL})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()), "email": OWNER_LOGIN_EMAIL,
            "password_hash": hash_password(OWNER_LOGIN_PASSWORD),
            "name": "Owner", "role": "owner",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
    elif not verify_password(OWNER_LOGIN_PASSWORD, existing["password_hash"]):
        await db.users.update_one(
            {"email": OWNER_LOGIN_EMAIL},
            {"$set": {"password_hash": hash_password(OWNER_LOGIN_PASSWORD)}},
        )


async def get_current_owner(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        header = request.headers.get("Authorization", "")
        if header.startswith("Bearer "):
            token = header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired. Please sign in again.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({"id": payload.get("sub")}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


def _set_auth_cookie(response: Response, token: str):
    response.set_cookie(key="access_token", value=token, httponly=True, secure=True,
                        samesite="none", max_age=43200, path="/")


@auth_router.post("/login")
async def login(request: Request, response: Response, payload: dict):
    email = (payload.get("email") or "").strip().lower()
    password = payload.get("password") or ""
    ident = f"{request.client.host if request.client else 'unknown'}:{email}"
    now = time.time()
    attempts = [t for t in _login_attempts.get(ident, []) if now - t < 900]
    if len(attempts) >= 5:
        raise HTTPException(status_code=429, detail="Too many attempts. Try again in 15 minutes.")
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(password, user["password_hash"]):
        attempts.append(now)
        _login_attempts[ident] = attempts
        raise HTTPException(status_code=401, detail="Invalid email or password")
    _login_attempts.pop(ident, None)
    token = create_access_token(user["id"], user["email"])
    _set_auth_cookie(response, token)
    return {"id": user["id"], "email": user["email"], "name": user.get("name"), "role": user.get("role"), "token": token}


@auth_router.get("/me")
async def me(owner: dict = Depends(get_current_owner)):
    return owner


@auth_router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(key="access_token", path="/")
    return {"status": "ok"}


@auth_router.post("/change-password")
async def change_password(payload: dict, owner: dict = Depends(get_current_owner)):
    current = payload.get("current_password") or ""
    new = payload.get("new_password") or ""
    if len(new) < 8:
        raise HTTPException(status_code=422, detail="New password must be at least 8 characters")
    user = await db.users.find_one({"id": owner["id"]})
    if not verify_password(current, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Current password is incorrect")
    await db.users.update_one({"id": owner["id"]}, {"$set": {"password_hash": hash_password(new)}})
    return {"status": "ok"}


# ---------------------------------------------------------------- admin (owner CMS)
@admin_router.get("/quotes")
async def admin_quotes(owner: dict = Depends(get_current_owner)):
    return await db.quotes.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)


@admin_router.get("/products")
async def admin_list_products(owner: dict = Depends(get_current_owner)):
    return await db.products.find({}, {"_id": 0}).sort("order", 1).to_list(100)


@admin_router.post("/products")
async def admin_create_product(payload: dict, owner: dict = Depends(get_current_owner)):
    if not payload.get("slug") or not payload.get("name"):
        raise HTTPException(status_code=422, detail="slug and name required")
    payload.setdefault("published", True)
    await db.products.update_one({"slug": payload["slug"]}, {"$set": payload}, upsert=True)
    return {"status": "ok"}


@admin_router.put("/products/{slug}")
async def admin_update_product(slug: str, payload: dict, owner: dict = Depends(get_current_owner)):
    payload.pop("slug", None)
    result = await db.products.update_one({"slug": slug}, {"$set": payload})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"status": "ok"}


@admin_router.get("/capabilities")
async def admin_list_capabilities(owner: dict = Depends(get_current_owner)):
    return await db.capabilities.find({}, {"_id": 0}).sort("order", 1).to_list(100)


@admin_router.post("/capabilities")
async def admin_upsert_capability(payload: dict, owner: dict = Depends(get_current_owner)):
    cid = payload.get("id") or str(uuid.uuid4())
    payload["id"] = cid
    await db.capabilities.update_one({"id": cid}, {"$set": payload}, upsert=True)
    return {"status": "ok", "id": cid}


@admin_router.delete("/capabilities/{cid}")
async def admin_delete_capability(cid: str, owner: dict = Depends(get_current_owner)):
    await db.capabilities.delete_one({"id": cid})
    return {"status": "ok"}


@admin_router.get("/milestones")
async def admin_list_milestones(owner: dict = Depends(get_current_owner)):
    return await db.milestones.find({}, {"_id": 0}).sort("order", 1).to_list(100)


@admin_router.post("/milestones")
async def admin_upsert_milestone(payload: dict, owner: dict = Depends(get_current_owner)):
    mid = payload.get("id") or str(uuid.uuid4())
    payload["id"] = mid
    await db.milestones.update_one({"id": mid}, {"$set": payload}, upsert=True)
    return {"status": "ok", "id": mid}


@admin_router.delete("/milestones/{mid}")
async def admin_delete_milestone(mid: str, owner: dict = Depends(get_current_owner)):
    await db.milestones.delete_one({"id": mid})
    return {"status": "ok"}


app.include_router(api_router)
app.include_router(auth_router)
app.include_router(admin_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
