import os
from typing import Any, Dict

import requests

NAVER_API_BASE_URL = "https://openapi.naver.com/v1/search/shop.json"
NAVER_TIMEOUT_SECONDS = 5
MAX_DISPLAY = 100


def call_naver_shopping_api(query: str, display: int = MAX_DISPLAY, start: int = 1) -> Dict[str, Any]:
    client_id = os.getenv("NAVER_CLIENT_ID")
    client_secret = os.getenv("NAVER_CLIENT_SECRET")

    if not client_id or not client_secret:
        raise RuntimeError("NAVER_CLIENT_ID and NAVER_CLIENT_SECRET are required.")

    safe_display = max(1, min(display, MAX_DISPLAY))
    safe_start = max(1, min(start, 1000))

    response = requests.get(
        NAVER_API_BASE_URL,
        headers={
            "X-Naver-Client-Id": client_id,
            "X-Naver-Client-Secret": client_secret,
        },
        params={"query": query, "display": safe_display, "start": safe_start},
        timeout=NAVER_TIMEOUT_SECONDS,
    )
    response.raise_for_status()
    return response.json()
