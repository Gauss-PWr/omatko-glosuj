from dotenv import load_dotenv
import os

if os.getenv("RUNNING_IN_CONTAINER", "0") != "1":
    load_dotenv(".env.dev")


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
from routers.votes import router as votes_router

# from scripts.insert_delete_data import add_data


logger = logging.getLogger("uvicorn.error")
logger.setLevel(logging.DEBUG)


models_db.Base.metadata.create_all(bind=engine)

logger.info("Database tables created successfully.")

app = FastAPI()

logger.info("FastAPI application instance created.")

app.include_router(auth_router)
app.include_router(lectures_router)
app.include_router(posters_router)
app.include_router(healthcheck_router)
app.include_router(votes_router)

origins = [
    os.getenv("FRONTEND_ORIGIN", "http://localhost:5173"),
]

logger.info(f"Allowed CORS origins: {origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=os.getenv("BACKEND_HOST", "localhost"),
        port=int(os.getenv("BACKEND_PORT", 5555)),
        reload= (True if os.getenv("RUNNING_IN_CONTAINER", "0") != "1" else False),
        log_level="debug",
        workers=4,
    )
