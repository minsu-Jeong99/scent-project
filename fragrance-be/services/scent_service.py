from typing import List

from models.fragrance_schema import FragranceCategory
from database.mongodb import get_scent_collection


def get_all_fragrance_categories() -> List[FragranceCategory]:
    collection = get_scent_collection()
    return list(collection.find({}, {"_id": 0}))
