from fastapi import APIRouter, Depends, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.auth import GoogleAuthRequest, TokenResponse, UserTokenProfile
from app.services.auth_service import AuthService

router = APIRouter()


@router.post("/google", response_model=TokenResponse)
async def login_google(
    request_data: GoogleAuthRequest,
    response: Response,
    session: AsyncSession = Depends(get_db),
) -> TokenResponse:
    auth_service = AuthService(session)
    result = await auth_service.authenticate_google_user(request_data.token)
    
    # Refresh token en cookie HttpOnly, Secure, SameSite=Strict
    response.set_cookie(
        key="refresh_token",
        value=result["refresh_token"],
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=7 * 24 * 3600,
    )
    return result["token_response"]


@router.get("/me", response_model=UserTokenProfile)
async def get_me(current_user: User = Depends(get_current_user)) -> UserTokenProfile:
    return UserTokenProfile(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        role=current_user.role,
        municipio_id=current_user.municipio_id,
        parroquia_id=current_user.parroquia_id,
        avatar_url=current_user.avatar_url,
    )
