import logging

import requests
from fastapi import APIRouter, HTTPException, Query
from starlette import status

import services.naver_service as naver_service

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/search", summary="네이버 쇼핑 검색", status_code=status.HTTP_200_OK)
def search_products_route(
    query: str = Query(..., min_length=1, description="검색어"),
    display: int = Query(100, ge=1, le=100, description="검색 결과 수"),
):
    try:
        return naver_service.search_naver_shopping(query, display)
    except RuntimeError as exc:
        logger.warning("Naver API configuration error: %s", exc)
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except requests.Timeout as exc:
        logger.warning("Naver API timeout for query=%s", query)
        raise HTTPException(status_code=504, detail="Naver API request timed out.") from exc
    except requests.HTTPError as exc:
        if exc.response is not None and exc.response.status_code == 429:
            logger.warning("Naver API rate limit exceeded for query=%s", query)
            raise HTTPException(
                status_code=429,
                detail="네이버 API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.",
            ) from exc
        logger.warning("Naver API HTTP error: %s", exc)
        raise HTTPException(status_code=502, detail="Naver API returned an error.") from exc
    except requests.RequestException as exc:
        logger.warning("Naver API request failed: %s", exc)
        raise HTTPException(status_code=502, detail="Naver API request failed.") from exc
