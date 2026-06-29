from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

mongodb_url = os.getenv("MONGODB_URL")
if not mongodb_url:
    raise RuntimeError("MONGODB_URL environment variable is required.")

client = MongoClient(mongodb_url, serverSelectionTimeoutMS=3000)
db = client["scent_db"]
collection = db["fragrances"]

seed_data = [
    {
        "product": "shampoo",
        "scent": "과일향",
        "scent_slug": "fruity",
        "fragrances": [
            {"name": "복숭아향", "slug": "peach"},
            {"name": "자몽향", "slug": "grapefruit"},
            {"name": "레몬향", "slug": "lemon"},
            {"name": "망고향", "slug": "mango"},
            {"name": "딸기향", "slug": "strawberry"},
        ],
    },
    {
        "product": "shampoo",
        "scent": "플로럴향",
        "scent_slug": "floral",
        "fragrances": [
            {"name": "로즈향", "slug": "rose"},
            {"name": "라벤더향", "slug": "lavender"},
        ],
    },
    {
        "product": "bodywash",
        "scent": "과일향",
        "scent_slug": "fruity",
        "fragrances": [
            {"name": "복숭아향", "slug": "peach"},
            {"name": "자몽향", "slug": "grapefruit"},
            {"name": "레몬향", "slug": "lemon"},
            {"name": "망고향", "slug": "mango"},
            {"name": "딸기향", "slug": "strawberry"},
        ],
    },
    {
        "product": "bodywash",
        "scent": "우디향",
        "scent_slug": "woody",
        "fragrances": [
            {"name": "샌달우드향", "slug": "sandalwood"},
            {"name": "시더우드향", "slug": "cedarwood"},
        ],
    },
]

collection.delete_many({})
collection.insert_many(seed_data)

print("Seed data inserted successfully.")
