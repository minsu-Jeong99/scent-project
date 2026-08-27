# Scent Finder — Backend

FastAPI 백엔드. 향 카테고리 데이터 제공 및 네이버 쇼핑 검색 API를 중계합니다.

## 세팅

```powershell
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
copy .env.template .env
# .env 파일에 MongoDB URL, Naver API 키 입력
```

## 초기 데이터

```powershell
python scripts/seed_data.py
```

## 실행

```powershell
python -m uvicorn main:app --reload
```

API 문서: `http://127.0.0.1:8000/docs`

## 엔드포인트

- `GET /health` — 서버 및 MongoDB 상태
- `GET /fragrances` — 향 카테고리 목록
- `GET /naver/search?query={keyword}&display=100` — 네이버 쇼핑 검색

## 구조

```
api/         라우터 핸들러
services/    비즈니스 로직
database/    MongoDB 연결
models/      Pydantic 스키마
utils/       외부 API 호출
scripts/     유틸리티 스크립트
main.py      앱 진입점 (프론트엔드 서빙 포함)
```

프론트엔드 정적 파일은 `../frontend/`에 위치하며, `main.py`가 해당 디렉토리를 서빙합니다.
