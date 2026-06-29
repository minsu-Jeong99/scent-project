from typing import List
from pydantic import BaseModel

class FragranceItem(BaseModel):
    name: str
    slug: str

class FragranceCategory(BaseModel):
    product: str
    scent: str
    scent_slug: str
    fragrances: List[FragranceItem]
