# Academic.kz — Backend API

> Web platform for Kazakhstan applicants (Bachelor/Master/PhD): program matching, application checklist & deadlines, and Bolashak scholarship module.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | FastAPI 0.111 + Python 3.11 |
| ORM | SQLAlchemy 2.x (async) |
| Migrations | Alembic |
| Validation | Pydantic v2 |
| Auth | JWT (python-jose + passlib/bcrypt) |
| Database | PostgreSQL 15 |
| Container | Docker + docker-compose |

## Project Structure

```
backend/
├── app/
│   ├── main.py           # FastAPI app factory + routers
│   ├── config.py         # Settings (pydantic-settings)
│   ├── database.py       # Async SQLAlchemy engine + session
│   ├── models/           # ORM models (SQLAlchemy)
│   ├── schemas/          # Pydantic request/response schemas
│   ├── crud/             # Database query layer
│   ├── api/v1/           # API routers
│   └── auth/             # JWT + OAuth2 dependencies
├── alembic/              # DB migrations
├── scripts/seed.py       # Initial data seeder
├── tests/                # Pytest test suite
├── Dockerfile
├── alembic.ini
└── requirements.txt
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/programs` | List & filter programs (search, city, degree level, language, fee) |
| `GET` | `/api/v1/programs/{id}` | Program detail (requirements, deadlines, documents) |
| `GET` | `/api/v1/bolashak` | Full Bolashak scholarship overview |
| `GET` | `/api/v1/bolashak/criteria` | Eligibility criteria |
| `GET` | `/api/v1/bolashak/steps` | Application steps |
| `GET` | `/api/v1/bolashak/documents` | Required documents |
| `GET` | `/api/v1/deadlines` | Upcoming deadlines (filter by program or `upcoming_days`) |
| `GET` | `/api/v1/checklists` | Personal checklist (auth required) |
| `POST` | `/api/v1/checklists` | Add checklist item |
| `PATCH` | `/api/v1/checklists/{id}` | Update status (todo → in_progress → done) |
| `DELETE` | `/api/v1/checklists/{id}` | Remove item |
| `POST` | `/api/v1/users/register` | Register user |
| `POST` | `/api/v1/users/login` | Login → get JWT token |
| `GET` | `/api/v1/users/me` | Current user profile |
| `GET` | `/health` | Health check |

## Quick Start (Docker)

```bash
# 1. Clone repo
git clone https://github.com/steppeai/academic.kz.git
cd academic.kz

# 2. Copy env file
cp backend/.env.example backend/.env

# 3. Start services (PostgreSQL + backend)
docker-compose up -d

# 4. Seed initial data (Bolashak + sample universities)
docker-compose exec backend python scripts/seed.py

# 5. Open Swagger UI
open http://localhost:8000/docs
```

## Local Development (without Docker)

```bash
cd backend

# Create virtual environment
python -m venv .venv && source .venv/bin/activate

# Install deps
pip install -r requirements.txt

# Set up .env
cp .env.example .env  # edit DATABASE_URL to point to your local PG

# Run migrations
alembic upgrade head

# Seed data
python scripts/seed.py

# Start dev server
uvicorn app.main:app --reload
```

## Running Tests

```bash
cd backend
pytest tests/ -v
```

## Execution Plan

| Week | Feature |
|---|---|
| Week 3 | Program Search & Filter → `GET /api/v1/programs` |
| Week 4 | Bolashak Module → `GET /api/v1/bolashak` |
| Week 5 | Document Checklist → `GET/POST /api/v1/checklists` |
| Week 6 | Deadline Reminders → `GET /api/v1/deadlines?upcoming_days=7` |
| Week 7 | Program Comparison (multi-id query) |
| Week 8–11 | Polish, real university data, testing, deployment |

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md).
