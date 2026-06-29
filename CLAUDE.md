# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

향수·뷰티 제품의 향 카테고리를 탐색하고 네이버 쇼핑에서 관련 상품을 검색하는 서비스입니다.

- `fragrance-be/`: FastAPI 백엔드 (MongoDB + Naver Shopping API) — 프론트엔드도 함께 서빙
- `new_fe/`: (레거시) 별도 정적 서버용 프론트엔드 소스. 현재는 `fragrance-be/static/`이 정본.

## 개발 명령어

### 백엔드 (`fragrance-be/`에서 실행)

```powershell
# 최초 세팅
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.template .env   # 이후 .env에 MongoDB URL, Naver 인증 정보 입력

# 초기 데이터 입력
python scripts/seed_data.py

# 서버 실행 (http://127.0.0.1:8000) — 프론트엔드도 동일 포트에서 서빙
uvicorn main:app --reload

# API 문서 확인
# http://127.0.0.1:8000/docs
```

백엔드 서버 하나만 실행하면 프론트엔드(`http://127.0.0.1:8000/`)도 함께 제공됩니다.

## 아키텍처

### 백엔드 레이어 구조

```
api/         ← 얇은 라우터 핸들러 (FastAPI 예외 처리 담당)
services/    ← 비즈니스 로직
utils/       ← 외부 API 호출 (naver_api.py)
database/    ← MongoDB 연결 (lru_cache 싱글톤)
models/      ← Pydantic 스키마
scripts/     ← 유틸리티 스크립트 (seed_data.py)
static/      ← 프론트엔드 정적 파일 (FastAPI가 직접 서빙)
```

- 라우터 핸들러는 최대한 얇게 유지하고 로직은 `services/`에 둡니다.
- MongoDB 클라이언트는 `database/mongodb.py`의 `get_client()`가 `lru_cache`로 싱글톤을 보장합니다.
- Naver API 인증 정보는 서버에서만 사용하며 클라이언트에 노출되지 않습니다.

### 프론트엔드 구조 (`fragrance-be/static/`)

```
index.html         ← 메인 페이지 (GET /)
pages/             ← 서브 페이지 (GET /pages/{name}.html)
js/shared.js       ← 공통 유틸리티 → window.ScentApp 네임스페이스로 노출
js/main.js         ← 메인 페이지 전용
js/scent.js        ← scent 페이지 전용
js/product.js      ← product 페이지 전용
js/fragrance.js    ← fragrance 페이지 전용
js/navbar.js       ← 네비게이션 공통
styles/            ← 공통 CSS
assets/            ← 이미지 등 정적 애셋
```

- 모든 공통 헬퍼(`fetchJson`, `renderProductCards`, `searchNaver` 등)는 `shared.js`의 `window.ScentApp`에 정의합니다.
- 페이지별 동작은 각 페이지 스크립트에만 작성합니다.
- API 베이스 URL 기본값은 `""` (동일 오리진). `window.SCENT_API_BASE_URL` 또는 `localStorage`로 오버라이드 가능합니다.
- 프론트엔드 파일을 수정할 때는 `fragrance-be/static/`을 편집합니다 (`new_fe/`는 레거시).

## 정적 파일 서빙 방식

`main.py`에서 API 라우트를 먼저 등록한 뒤 StaticFiles를 마운트해 충돌을 방지합니다.

- `GET /` → `static/index.html`
- `GET /pages/{name}.html` → `static/pages/{name}.html`
- `GET /js/*`, `/styles/*`, `/assets/*` → StaticFiles 마운트

## 주요 API 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/fragrances` | 모든 향 카테고리 목록 |
| GET | `/naver/search?query=&display=` | 네이버 쇼핑 검색 |
| GET | `/health` | 서버 및 MongoDB 상태 확인 |

## 환경 변수 (`.env`)

```
MONGODB_URL=mongodb://localhost:27017
NAVER_CLIENT_ID=...
NAVER_CLIENT_SECRET=...
```

설정 키가 변경될 경우 `.env.template`도 같이 업데이트합니다 (실제 값은 제외).

## 코딩 규칙

- **Python**: 4칸 들여쓰기, `snake_case`
- **JavaScript**: 2칸 들여쓰기, 역할이 드러나는 DOM 변수명
- `app/`, `crud/` 디렉토리는 현재 미사용 골격입니다.
