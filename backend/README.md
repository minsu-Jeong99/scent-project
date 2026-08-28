# Scent Finder — Backend

FastAPI 백엔드. 향 카테고리 데이터 제공 및 큐레이션 상품 데이터를 서빙합니다.

## 세팅

```powershell
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
copy .env.template .env
# .env 파일에 MongoDB URL 입력
```

## 초기 데이터

```powershell
# 향 카테고리 데이터
python scripts/seed_data.py

# 큐레이션 상품 데이터 (CSV에 데이터를 채운 후 실행)
python scripts/import_curated_products.py
```

## 실행

```powershell
python -m uvicorn main:app --reload
```

API 문서: `http://127.0.0.1:8000/docs`

## 엔드포인트

- `GET /health` — 서버 및 MongoDB 상태
- `GET /fragrances` — 향 카테고리 목록
- `GET /fragrances/{product}/products` — 제품별 전체 상품 목록
- `GET /fragrances/{product}/{scent}/products` — 향 계열별 상품 목록

## 구조

```
api/         라우터 핸들러
services/    비즈니스 로직 (curated_product_service.py가 현재 사용)
database/    MongoDB 연결
models/      Pydantic 스키마
utils/       외부 API 호출 (현재 미사용, 참고용 보존)
scripts/     유틸리티 스크립트 (seed_data, import_curated_products)
main.py      앱 진입점 (프론트엔드 서빙 포함)
```

프론트엔드 정적 파일은 `../frontend/`에 위치하며, `main.py`가 해당 디렉토리를 서빙합니다.
