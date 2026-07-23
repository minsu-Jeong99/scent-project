# Scent Finder

향수·뷰티 제품의 향 카테고리를 탐색하고 네이버 쇼핑에서 관련 상품을 연결하는 중개 서비스입니다.

## 서비스 개요

- 제품 유형(향수, 바디로션 등) → 향 계열(플로럴, 우디 등) → 세부 향(장미, 샌달우드 등) 순으로 드릴다운 탐색
- 선택한 향을 기반으로 네이버 쇼핑 상품을 검색해 카드 형태로 표시
- 직접 판매 없이 탐색·중개에 집중

## 기술 스택

| 구분 | 기술 |
|------|------|
| 백엔드 | Python, FastAPI, MongoDB (Motor), Uvicorn |
| 프론트엔드 | HTML, CSS, Vanilla JS (빌드 도구 없음) |
| 외부 API | 네이버 쇼핑 검색 API |
| 서빙 방식 | FastAPI StaticFiles — 단일 서버에서 API + 프론트엔드 동시 서빙 |

## 프로젝트 구조

```
test_project_v1/
├── fragrance-be/          # FastAPI 백엔드 (프론트엔드도 함께 서빙)
│   ├── main.py            # 앱 진입점 — 라우터 등록 + StaticFiles 마운트
│   ├── api/               # 라우터 핸들러 (얇게 유지)
│   │   ├── scent.py       # 향 카테고리 API
│   │   ├── products.py    # 상품 관련 API
│   │   └── naver.py       # 네이버 쇼핑 검색 API
│   ├── services/          # 비즈니스 로직
│   ├── utils/             # 외부 API 호출 (naver_api.py)
│   ├── database/          # MongoDB 연결 (lru_cache 싱글톤)
│   ├── models/            # Pydantic 스키마
│   ├── scripts/           # 초기 데이터 입력 (seed_data.py)
│   ├── static/            # 프론트엔드 정적 파일
│   │   ├── index.html
│   │   ├── pages/         # fragrance.html, product.html, scent.html
│   │   ├── js/            # shared.js + 페이지별 JS
│   │   ├── styles/
│   │   └── assets/
│   ├── requirements.txt
│   └── .env.template      # 환경 변수 양식 (실제 값 없음)
├── new_fe/                # (레거시) 더 이상 사용하지 않음
└── docs/                  # 프로젝트 문서
    └── 프로젝트-개발-기록.md
```

## 로컬 실행

### 사전 요구사항

- Python 3.x
- MongoDB 실행 중 (기본 포트 27017)
- [네이버 개발자센터](https://developers.naver.com) 에서 쇼핑 검색 API 애플리케이션 등록

### 초기 세팅 (Windows)

```powershell
cd fragrance-be

# 가상 환경 생성 및 활성화
python -m venv venv
venv\Scripts\activate

# 의존성 설치
python -m pip install -r requirements.txt

# 환경 변수 설정
copy .env.template .env
# .env 파일을 열어 MongoDB URL과 Naver API 키 입력

# 초기 향 데이터 입력
python scripts/seed_data.py

# 서버 실행
uvicorn main:app --reload
```

### 초기 세팅 (Linux / Mac)

```bash
cd fragrance-be
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.template .env
# .env 파일 편집 후 값 입력
python scripts/seed_data.py
uvicorn main:app --reload
```

서버 실행 후 `http://127.0.0.1:8000` 에서 프론트엔드와 API 모두 접근 가능합니다.

## 환경 변수

`fragrance-be/.env.template` 을 복사해 `.env` 를 만들고 아래 값을 입력합니다.

```env
MONGODB_URL=mongodb://localhost:27017
NAVER_CLIENT_ID=발급받은_클라이언트_ID
NAVER_CLIENT_SECRET=발급받은_클라이언트_시크릿
```

> `.env` 파일은 `.gitignore` 에 의해 Git에서 제외됩니다. 절대 커밋하지 마세요.

## 주요 API 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/` | 메인 페이지 |
| GET | `/pages/{name}.html` | 서브 페이지 |
| GET | `/fragrances` | 향 카테고리 목록 |
| GET | `/naver/search?query=&display=` | 네이버 쇼핑 검색 |
| GET | `/health` | 서버 및 MongoDB 상태 확인 |

API 문서: `http://127.0.0.1:8000/docs`

## 개발 로드맵

- **Phase 1 (단기)**: 검색 품질 개선 — 향 동의어 처리, 0건 결과 대체 UI
- **Phase 2 (중기)**: 서비스 완성 — 상품 카드 디자인 고도화, 향 데이터 확장
- **Phase 3 (장기)**: 커뮤니티 기능 + 프론트엔드 Next.js 전환

자세한 내용은 [`docs/프로젝트-개발-기록.md`](docs/프로젝트-개발-기록.md) 를 참고하세요.
