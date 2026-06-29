import logging
from typing import Optional

import requests
from fastapi import APIRouter, HTTPException, Query
from pymongo.errors import PyMongoError, ServerSelectionTimeoutError
from starlette import status

import services.product_service as product_service
from models.product_schema import PaginatedProductResponse

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get(
    "/fragrances/{product}/products",
    response_model=PaginatedProductResponse,
    summary="제품 전체 향 상품 목록 (페이지네이션)",
    status_code=status.HTTP_200_OK,
)
def get_product_items(
    product: str,
    page: int = Query(1, ge=1, description="페이지 번호"),
    per_page: int = Query(20, ge=1, le=100, description="페이지당 결과 수"),
):
    try:
        return product_service.get_product_products_paginated(product, page, per_page)
    except RuntimeError as exc:
        logger.warning("설정 오류: %s", exc)
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except requests.Timeout as exc:
        raise HTTPException(status_code=504, detail="Naver API request timed out.") from exc
    except requests.HTTPError as exc:
        if exc.response is not None and exc.response.status_code == 429:
            raise HTTPException(status_code=429, detail="네이버 API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.") from exc
        raise HTTPException(status_code=502, detail="Naver API returned an error.") from exc
    except requests.RequestException as exc:
        raise HTTPException(status_code=502, detail="Naver API request failed.") from exc
    except (PyMongoError, ServerSelectionTimeoutError) as exc:
        logger.exception("MongoDB 오류")
        raise HTTPException(status_code=503, detail="MongoDB connection failed.") from exc


@router.get(
    "/fragrances/{product}/{scent_slug}/products",
    response_model=PaginatedProductResponse,
    summary="향 계열별 상품 목록 (페이지네이션)",
    status_code=status.HTTP_200_OK,
)
def get_scent_products(
    product: str,
    scent_slug: str,
    page: int = Query(1, ge=1, description="페이지 번호"),
    per_page: int = Query(20, ge=1, le=100, description="페이지당 결과 수"),
    fragrance: Optional[str] = Query(None, description="세부 향 슬러그 (fragrance.html 전용)"),
):
    try:
        return product_service.get_products_paginated(product, scent_slug, fragrance, page, per_page)
    except RuntimeError as exc:
        logger.warning("설정 오류: %s", exc)
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except requests.Timeout as exc:
        logger.warning("Naver API 타임아웃 (product=%s, scent=%s)", product, scent_slug)
        raise HTTPException(status_code=504, detail="Naver API request timed out.") from exc
    except requests.HTTPError as exc:
        if exc.response is not None and exc.response.status_code == 429:
            raise HTTPException(
                status_code=429,
                detail="네이버 API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.",
            ) from exc
        raise HTTPException(status_code=502, detail="Naver API returned an error.") from exc
    except requests.RequestException as exc:
        logger.warning("Naver API 요청 실패: %s", exc)
        raise HTTPException(status_code=502, detail="Naver API request failed.") from exc
    except (PyMongoError, ServerSelectionTimeoutError) as exc:
        logger.exception("MongoDB 오류")
        raise HTTPException(status_code=503, detail="MongoDB connection failed.") from exc
