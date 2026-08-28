# Scent Finder

향수·뷰티 제품의 향 카테고리를 탐색하고 관련 상품을 연결하는 중개 서비스입니다.

## 서비스 개요

- 제품 유형(향수, 바디로션 등) → 향 계열(플로럴, 우디 등) → 세부 향(장미, 샌달우드 등) 순으로 드릴다운 탐색
- 선택한 향을 기반으로 큐레이션된 상품을 카드 형태로 표시
- 직접 판매 없이 탐색·중개에 집중

> **참고**: 네이버 쇼핑 검색 API(shop.json)가 2026-07-31부로 종료되어, 수동 큐레이션 데이터 기반으로 전환했습니다. 상세는 `docs/프로젝트-개발-기록.md` 참고.

## 기술 스택

| 구분 | 기술 |
|------|------|
| 백엔드 | Python, FastAPI, MongoDB (PyMongo), Uvicorn |
| 프론트엔드 | HTML, CSS, Vanilla JS (빌드 도구 없음) |
| 상품 데이터 | CSV 기반 수동 큐레이션 → MongoDB 적재 |
| 서빙 방식 | FastAPI StaticFiles — 단일 서버에서 API + 프론트엔드 동시 서빙 |

## 프로젝트 구조

```
scent-project/
├── backend/               # FastAPI 백엔드
│   ├── main.py            # 앱 진입점 — 라우터 등록 + 프론트엔드 서빙
│   ├── api/               # 라우터 핸들러 (얇게 유지)
│   │   ├── scent.py       # 향 카테고리 API
│   │   ├── products.py    # 상품 관련 API (curated_product_service 사용)
│   │   └── naver.py       # [미사용] 네이버 쇼핑 검색 API (참고용 보존)
│   ├── services/          # 비즈니스 로직
│   │   ├── curated_product_service.py  # 큐레이션 상품 조회
│   │   └── product_service.py         # [미사용] 네이버 API 기반 (참고용 보존)
│   ├── utils/             # 외부 API 호출 (naver_api.py)
│   ├── database/          # MongoDB 연결 (lru_cache 싱글톤)
│   ├── models/            # Pydantic 스키마
│   ├── scripts/           # 유틸리티 스크립트
│   │   ├── seed_data.py                   # 초기 향 데이터 입력
│   │   ├── curated_products_template.csv  # 큐레이션 상품 CSV 템플릿
│   │   └── import_curated_products.py     # CSV → MongoDB 적재
│   ├── requirements.txt
│   └── .env.template      # 환경 변수 양식 (실제 값 없음)
├── frontend/              # 프론트엔드 정적 파일
│   ├── index.html         # 메인 페이지
│   ├── pages/             # 서브 페이지 (product, scent, fragrance)
│   ├── js/                # shared.js + 페이지별 JS
│   ├── styles/            # CSS
│   └── assets/            # 이미지 등
└── docs/                  # 프로젝트 문서
```

## 로컬 실행

### 사전 요구사항

- Python 3.x
- MongoDB 실행 중 (기본 포트 27017)

### 초기 세팅 (Windows)

```powershell
cd backend

# 가상 환경 생성 및 활성화
python -m venv venv
.\venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# 환경 변수 설정
copy .env.template .env
# .env 파일을 열어 MongoDB URL 입력

# 초기 향 데이터 입력
python scripts/seed_data.py

# 큐레이션 상품 데이터 적재 (CSV에 데이터를 채운 후 실행)
python scripts/import_curated_products.py

# 서버 실행
python -m uvicorn main:app --reload
```

### 초기 세팅 (Linux / Mac)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.template .env
# .env 파일 편집 후 값 입력
python scripts/seed_data.py
python scripts/import_curated_products.py
python -m uvicorn main:app --reload
```

서버 실행 후 `http://127.0.0.1:8000` 에서 프론트엔드와 API 모두 접근 가능합니다.

### 큐레이션 상품 데이터 관리

1. `backend/scripts/curated_products_template.csv`에 상품 데이터를 채웁니다
2. `python scripts/import_curated_products.py`를 실행하여 MongoDB에 적재합니다
3. 데이터를 수정하면 스크립트를 다시 실행합니다 (productId 기준 덮어쓰기)

## 환경 변수

`backend/.env.template` 을 복사해 `.env` 를 만들고 아래 값을 입력합니다.

```env
MONGODB_URL=mongodb://localhost:27017
```

> `.env` 파일은 `.gitignore` 에 의해 Git에서 제외됩니다. 절대 커밋하지 마세요.

## 주요 API 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/` | 메인 페이지 |
| GET | `/pages/{name}.html` | 서브 페이지 |
| GET | `/fragrances` | 향 카테고리 목록 |
| GET | `/fragrances/{product}/products` | 제품별 전체 상품 목록 |
| GET | `/fragrances/{product}/{scent}/products` | 향 계열별 상품 목록 |
| GET | `/health` | 서버 및 MongoDB 상태 확인 |

API 문서: `http://127.0.0.1:8000/docs`
