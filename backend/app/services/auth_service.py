from typing import Any, Dict
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import (
    create_access_token,
    create_refresh_token,
    verify_google_token,
)
from app.repositories.user_repo import UserRepository
from app.schemas.auth import TokenResponse, UserTokenProfile


class AuthService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.user_repo = UserRepository(session)

    async def authenticate_google_user(self, token: str) -> Dict[str, Any]:
        try:
            google_payload = verify_google_token(token)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Fallo de autenticación con Google: {str(e)}",
            )

        email = google_payload.get("email")
        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El token de Google no proporcionó una dirección de correo.",
            )

        user = await self.user_repo.get_by_email(email.lower())
        if not user:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"El correo {email} no está autorizado como usuario directivo u operador en SIGO-PJ.",
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="La cuenta de usuario se encuentra suspendida o inactiva.",
            )

        # Actualizar datos de Google si no los tenía
        if not user.google_id:
            user.google_id = google_payload.get("sub")
            if google_payload.get("picture"):
                user.avatar_url = google_payload.get("picture")

        await self.user_repo.update_last_login(user)

        claims = {
            "email": user.email,
            "role": user.role,
            "municipio_id": user.municipio_id,
            "parroquia_id": user.parroquia_id,
        }

        access_token = create_access_token(subject=str(user.id), claims=claims)
        refresh_token = create_refresh_token(subject=str(user.id))

        user_profile = UserTokenProfile(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            role=user.role,
            municipio_id=user.municipio_id,
            parroquia_id=user.parroquia_id,
            avatar_url=user.avatar_url,
        )

        return {
            "token_response": TokenResponse(access_token=access_token, user=user_profile),
            "refresh_token": refresh_token,
        }
