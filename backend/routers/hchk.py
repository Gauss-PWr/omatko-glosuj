from fastapi import APIRouter, status as fastapi_status


router = APIRouter()


@router.get("/health", status_code=fastapi_status.HTTP_200_OK)
async def healthcheck():
    return {"status": "ok"}