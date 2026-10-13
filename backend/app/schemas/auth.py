from typing import Optional
import uuid
from pydantic import BaseModel, EmailStr


class GoogleAuthRequest(BaseModel):
    token: str


class UserTokenProfile(BaseModel):
    id: uuid.UUID
    email: EmailStr
    full_name: str
    role: str
    municipio_id: Optional[int] = None
    parroquia_id: Optional[int] = None
    avatar_url: Optional[str] = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserTokenProfile


class TokenPayload(BaseModel):
    sub: str
    email: str
    role: str
    municipio_id: Optional[int] = None
    parroquia_id: Optional[int] = None
    exp: int
    iat: int
