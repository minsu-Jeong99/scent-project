# Repository Guidelines

## 프로젝트 구조 및 모듈 구성

이 저장소는 두 개의 애플리케이션으로 구성됩니다.

- `fragrance-be/`: 향 카테고리 데이터와 Naver Shopping 검색을 제공하는 FastAPI 백엔드입니다.
- `fragrance-be/api/`: `scent.py`, `naver.py` 같은 라우터 모듈을 둡니다.
- `fragrance-be/services/`: 비즈니스 로직과 외부 연동 코드를 둡니다.
- `fragrance-be/database/`: MongoDB 연결과 상태 확인 헬퍼를 둡니다.
- `fragrance-be/models/`: Pydantic 스키마를 둡니다.
- `fragrance-be/scripts/`: `seed_data.py` 같은 유틸리티 스크립트를 둡니다.
- `new_fe/`: 정적 HTML, CSS, JavaScript 프론트엔드입니다.
- `new_fe/pages/`: 서브 페이지 HTML 파일을 둡니다.
- `new_fe/js/`: 브라우저 JavaScript 모듈을 둡니다.
- `new_fe/styles/`: 공통 CSS를 둡니다.
- `new_fe/assets/`: `logo.png` 같은 이미지 파일을 둡니다.

## 빌드, 테스트, 개발 명령어

백엔드 명령어는 `fragrance-be/`에서 실행합니다.

- `python -m venv venv`: 가상환경을 생성합니다.
- `venv\Scripts\activate`: Windows PowerShell에서 가상환경을 활성화합니다.
- `pip install -r requirements.txt`: FastAPI, MongoDB, API 의존성을 설치합니다.
- `copy .env.template .env`: 로컬 설정 파일을 만들고 MongoDB 및 Naver 인증 정보를 입력합니다.
- `python scripts/seed_data.py`: 향 데이터를 MongoDB에 초기 입력합니다.
- `uvicorn main:app --reload`: API를 `http://127.0.0.1:8000`에서 실행합니다.

프론트엔드 명령어는 `new_fe/`에서 실행합니다.

- `npm start`: 정적 파일 서버를 `http://127.0.0.1:5500`에서 실행합니다.
- `npm run check`: `node --check`로 JavaScript 문법을 검사합니다.

## 코딩 스타일 및 이름 규칙

Python은 4칸 들여쓰기를 사용합니다. 라우터 핸들러는 얇게 유지하고 재사용 로직은 `services/`에 둡니다. Python 파일, 함수, 변수는 `snake_case`를 사용합니다. Pydantic 스키마는 `models/`, API 라우터는 `api/`에 배치합니다.

JavaScript는 2칸 들여쓰기를 사용하고 DOM 변수명은 역할이 드러나게 작성합니다. 공통 브라우저 헬퍼는 `new_fe/js/shared.js`에 두고, 페이지별 동작은 `product.js`, `scent.js`처럼 해당 페이지 스크립트에 둡니다.

## 테스트 가이드라인

아직 커밋된 자동화 테스트 스위트는 없습니다. 변경 전에는 `npm run check`를 실행하고, 백엔드가 실행 중인 상태에서 주요 흐름을 수동으로 확인합니다. 백엔드 변경 시 `uvicorn main:app --reload`를 실행한 뒤 `GET /health`와 영향받은 엔드포인트를 `http://127.0.0.1:8000/docs`에서 확인합니다.

## 커밋 및 Pull Request 가이드라인

기존 커밋 메시지는 `README.md modify`, `cors url modify`처럼 짧은 요약 형태입니다. 앞으로는 범위가 드러나는 간결한 명령형 메시지를 권장합니다. 예: `backend: update cors origins`, `frontend: fix product navigation`.

Pull Request에는 간단한 설명, 영향 범위(`fragrance-be` 또는 `new_fe`), 설정 또는 마이그레이션 메모, 관련 이슈, 화면 변경이 있는 경우 스크린샷을 포함합니다. `.env`, 가상환경, 생성된 캐시 파일은 커밋하지 않습니다.

## 보안 및 설정 팁

Naver API 인증 정보와 MongoDB URL은 `fragrance-be/.env`에 보관합니다. 설정 키가 바뀌면 `.env.template`을 갱신하되 실제 비밀값은 넣지 않습니다.
