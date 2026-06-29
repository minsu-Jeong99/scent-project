from typing import Dict, List

# shared.js의 FRAGRANCE_SYNONYMS, PRODUCT_KEYWORDS와 동일한 값
FRAGRANCE_SYNONYMS: Dict[str, List[str]] = {
    "peach": ["복숭아", "피치", "peach"],
    "grapefruit": ["자몽", "그레이프후르트", "grapefruit"],
    "lemon": ["레몬", "lemon"],
    "mango": ["망고", "mango"],
    "strawberry": ["딸기", "strawberry"],
    "rose": ["로즈", "장미", "rose"],
    "lavender": ["라벤더", "lavender"],
    "sandalwood": ["샌달우드", "산달우드", "sandalwood"],
    "cedarwood": ["시더우드", "씨더우드", "cedar"],
}

PRODUCT_KEYWORDS: Dict[str, List[str]] = {
    "shampoo": ["샴푸", "shampoo"],
    "bodywash": ["바디워시", "샤워젤", "바디클렌저", "샤워크림", "bodywash", "body wash", "shower gel", "body cleanser"],
    "handcream": ["핸드크림", "핸드로션", "hand cream", "hand lotion"],
    "perfume": ["향수", "퍼퓸", "오드퍼퓸", "오드뚜왈렛", "perfume", "eau de parfum", "eau de toilette"],
}

PRIMARY_PRODUCT_KEYWORD: Dict[str, str] = {
    "shampoo": "샴푸",
    "bodywash": "바디워시",
    "handcream": "핸드크림",
    "perfume": "향수",
}
