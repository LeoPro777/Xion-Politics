import asyncio
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
import structlog

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.database import AsyncSessionLocal, engine
from app.core.init_db import init_db_seeds
from app.models.base import Base
# Asegurar carga de modelos para DDL
import app.models.estructura
import app.models.lead
import app.models.militante
import app.models.user

# Configurar Logging Estructurado
structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso", utc=True),
        structlog.processors.JSONRenderer(),
    ]
)
logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Inicialización de esquema y seeds en arranque con reintentos
    max_retries = 5
    for attempt in range(1, max_retries + 1):
        try:
            logger.info("db_init_attempt", host=engine.url.host, attempt=attempt)
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
            async with AsyncSessionLocal() as session:
                await init_db_seeds(session)
            logger.info("db_init_success", host=engine.url.host)
            break
        except Exception as e:
            if attempt == max_retries:
                logger.error("db_connection_failed", host=engine.url.host, error=str(e))
                raise
            logger.warning("db_connection_retry", attempt=attempt, host=engine.url.host, error=str(e))
            await asyncio.sleep(2 * attempt)
    yield
    await engine.dispose()


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"https://.*\.onrender\.com",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Manejador centralizado de Starlette/FastAPI HTTPException según Catálogo Estándar 06_api_spec.md
@app.exception_handler(StarletteHTTPException)
async def custom_http_exception_handler(request: Request, exc: StarletteHTTPException):
    code_mapping = {
        400: "BAD_REQUEST",
        401: "UNAUTHORIZED",
        403: "FORBIDDEN_TERRITORIAL_ACCESS",
        404: "RESOURCE_NOT_FOUND",
        422: "UNPROCESSABLE_ENTITY",
        500: "INTERNAL_SERVER_ERROR",
    }
    error_code = code_mapping.get(exc.status_code, "ERROR")

    logger.warning(
        "http_exception",
        path=request.url.path,
        status_code=exc.status_code,
        detail=exc.detail,
    )

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error_code": error_code,
            "detail": exc.detail,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        },
    )


# Manejador de validación de datos Pydantic (422)
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    first_error = errors[0]["msg"] if errors else "Datos malformados"
    loc = " -> ".join(str(l) for l in errors[0]["loc"]) if errors else "body"

    logger.warning("validation_error", path=request.url.path, errors=errors)

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error_code": "UNPROCESSABLE_ENTITY",
            "detail": f"Error en campo '{loc}': {first_error}",
            "timestamp": datetime.now(timezone.utc).isoformat(),
        },
    )


# Manejador de excepciones genéricas no capturadas (500)
@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error("internal_server_error", path=request.url.path, error=str(exc))
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error_code": "INTERNAL_SERVER_ERROR",
            "detail": "Ha ocurrido un error inesperado en los servidores de SIGO.",
            "timestamp": datetime.now(timezone.utc).isoformat(),
        },
    )


@app.api_route("/", methods=["GET", "HEAD"], tags=["Root"])
async def root():
    return {
        "message": f"{settings.PROJECT_NAME} API en línea",
        "status": "online",
        "docs": f"{settings.API_V1_STR}/docs",
        "health": "/health",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content=None)


@app.api_route("/health", methods=["GET", "HEAD"], tags=["Salud"])
async def health_check():
    return {
        "status": "healthy",
        "app": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


app.include_router(api_router, prefix=settings.API_V1_STR)
