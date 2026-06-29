from typing import Any, Dict

from utils.naver_api import call_naver_shopping_api


def search_naver_shopping(query: str, display: int = 100, start: int = 1) -> Dict[str, Any]:
    return call_naver_shopping_api(query, display, start)
