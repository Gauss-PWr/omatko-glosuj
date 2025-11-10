from dotenv import load_dotenv
import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import models as models_db
from database_connect import engine, SessionLocal
from routers.auth import router as auth_router
from routers.lectures import router as lectures_router
from routers.posters import router as posters_router
from routers.hchk import router as healthcheck_router
from scripts.insert_delete_data import add_data


logger = logging.getLogger('uvicorn.error')
logger.setLevel(logging.DEBUG)


models_db.Base.metadata.create_all(bind=engine)

logger.info("Database tables created successfully.")

app = FastAPI(title="Licznik Backend")

logger.info("FastAPI application instance created.")

app.include_router(auth_router)
app.include_router(lectures_router)
app.include_router(posters_router)
app.include_router(healthcheck_router)

origins = [os.getenv("FRONTEND_HOST", "http://localhost") + ":" + os.getenv("FRONTEND_PORT", "3000")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


if __name__ == "__main__":
    logging.info("Starting Uvicorn server...")
    uvicorn.run(
        "main:app",
        host=os.getenv("BACKEND_HOST", "localhost"),
        port=int(os.getenv("BACKEND_PORT", 5555)),
        reload=True,
        log_level="debug",
    )
    add_data()
