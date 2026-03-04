"""
FastAPI application factory.
Registers all routers, configures CORS, and handles startup/shutdown events.
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api.v1 import programs, bolashak, checklists, deadlines, users


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifecycle: startup → yield → shutdown."""
    # Startup: nothing special needed (Alembic handles migrations)
    yield
    # Shutdown: dispose the async engine


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        description=(
            "Backend API for Academic.kz — "
            "Kazakhstan's centralized platform for Bachelor/Master/PhD applicants."
        ),
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    # ── CORS ───────────────────────────────────────────────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── Routers ────────────────────────────────────────────────
    prefix = "/api/v1"
    app.include_router(programs.router,   prefix=prefix, tags=["Programs"])
    app.include_router(bolashak.router,   prefix=prefix, tags=["Bolashak"])
    app.include_router(checklists.router, prefix=prefix, tags=["Checklists"])
    app.include_router(deadlines.router,  prefix=prefix, tags=["Deadlines"])
    app.include_router(users.router,      prefix=prefix, tags=["Users & Auth"])

    # ── Health check ───────────────────────────────────────────
    @app.get("/health", tags=["Health"])
    async def health():
        return {"status": "ok", "app": settings.app_name}

    return app


app = create_app()
