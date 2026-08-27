# Scent Finder Backend

FastAPI backend for fragrance category data and Naver Shopping search.

## Setup

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.template .env
```

Fill `.env`:

```env
MONGODB_URL=mongodb://localhost:27017
NAVER_CLIENT_ID=YOUR_CLIENT_ID_HERE
NAVER_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
```

## Seed Data

```bash
python scripts/seed_data.py
```

## Run

```bash
uvicorn main:app --reload
```

API docs: `http://127.0.0.1:8000/docs`

## Endpoints

- `GET /health`: server and MongoDB status
- `GET /fragrances`: fragrance category list
- `GET /naver/search?query={keyword}&display=100`: Naver Shopping search
