import logging
import os
import time

import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

from api import products, scent

# from api import naver  # 네이버 쇼핑 검색 API 종료로 미사용 (아래 include_router 주석 참고)
from database.mongodb import check_mongodb, ensure_cache_ttl_index

load_dotenv()
logging.basicConfig(level=logging.INFO)

FRONTEND_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend")
_BOOT_TS = str(int(time.time()))

app = FastAPI(title="Scent Finder API")


class NoCacheStaticMiddleware(BaseHTTPMiddleware):
    """개발 환경에서 정적 파일 캐시를 방지합니다."""

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        path = request.url.path
        if path.endswith((".css", ".js", ".html")) or path == "/":
            response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
        return response


app.add_middleware(NoCacheStaticMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://scent-fe.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scent.router, tags=["Fragrances"])
app.include_router(products.router, tags=["Products"])
# 네이버 쇼핑 검색 API(shop.json)가 2026-07-31부로 종료되어 /naver/search는 항상 502를 반환한다.
# 라우터 파일(api/naver.py)은 참고용으로 남겨두고 앱에는 연결하지 않는다.
# app.include_router(naver.router, prefix="/naver", tags=["Naver"])

@app.on_event("startup")
def startup_event():
    ensure_cache_ttl_index()


@app.get("/health", tags=["Health"])
def health_check():
    mongodb_ok = check_mongodb()
    return {
        "status": "ok" if mongodb_ok else "degraded",
        "mongodb": mongodb_ok,
    }


def _serve_html(html_path: str, status_code: int = 200) -> HTMLResponse:
    """HTML 파일을 읽어 정적 참조에 캐시 버스팅 쿼리를 붙여 반환합니다."""
    with open(html_path, "r", encoding="utf-8") as f:
        html = f.read()
    html = html.replace('.css"', f'.css?v={_BOOT_TS}"')
    html = html.replace('.js"', f'.js?v={_BOOT_TS}"')
    return HTMLResponse(html, status_code=status_code)


@app.get("/")
def root():
    return _serve_html(os.path.join(FRONTEND_DIR, "index.html"))


@app.get("/pages/{page_name}.html")
def get_page(page_name: str):
    filepath = os.path.join(FRONTEND_DIR, "pages", f"{page_name}.html")
    if not os.path.exists(filepath):
        return _serve_html(os.path.join(FRONTEND_DIR, "index.html"), status_code=404)
    return _serve_html(filepath)


# 정적 애셋 (JS·CSS·이미지) 마운트 — API 라우트 등록 후 마지막에
app.mount("/js", StaticFiles(directory=os.path.join(FRONTEND_DIR, "js")), name="js")
app.mount("/styles", StaticFiles(directory=os.path.join(FRONTEND_DIR, "styles")), name="styles")
app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIR, "assets")), name="assets")


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_dirs=[os.path.dirname(__file__), FRONTEND_DIR],
    )
