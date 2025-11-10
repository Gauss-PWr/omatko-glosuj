from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import models as models_db
from database_connect import engine, SessionLocal
from routers.auth import router as auth_router
from routers.lectures import router as lectures_router
from routers.posters import router as posters_router
from dotenv import load_dotenv
import os


ENV_FILE = ".env.dev"
if os.getenv("RUNNING_IN_CONTAINER") == True:
    ENV_FILE = ".env.prod"


models_db.Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(lectures_router)
app.include_router(posters_router)

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     except Exception:
#         db.rollback()
#     finally:
#         db.close()


def main():
    uvicorn.run(
        "main:app",
        host=os.getenv("BACKEND_HOST", "localhost"),
        port=int(os.getenv("BACKEND_PORT", 5555)),
        reload=True,
        log_level="debug",
    )


if __name__ == "__main__":
    main()
