import logging
from typing import List

from fastapi import APIRouter, HTTPException
from pymongo.errors import PyMongoError, ServerSelectionTimeoutError
from starlette import status

from models.fragrance_schema import FragranceCategory
import services.scent_service as scent_service

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get(
    "/fragrances",
    response_model=List[FragranceCategory],
    summary="모든 향 카테고리 조회",
    status_code=status.HTTP_200_OK,
)
def get_all_categories_route():
    try:
        return scent_service.get_all_fragrance_categories()
    except RuntimeError as exc:
        logger.warning("Fragrance configuration error: %s", exc)
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except (PyMongoError, ServerSelectionTimeoutError) as exc:
        logger.exception("MongoDB query failed")
        raise HTTPException(status_code=503, detail="MongoDB connection failed.") from exc
