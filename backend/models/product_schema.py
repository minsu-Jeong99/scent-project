from typing import List

from pydantic import BaseModel


class NaverProductItem(BaseModel):
    productId: str
    title: str
    link: str
    image: str
    lprice: str
    mallName: str


class PaginatedProductResponse(BaseModel):
    items: List[NaverProductItem]
    total: int
    page: int
    per_page: int
    total_pages: int
