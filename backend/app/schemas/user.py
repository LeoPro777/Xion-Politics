from datetime import datetime
from typing import Optional
import uuid
from pydantic import BaseModel, ConfigDict, EmailStr


class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "OPERADOR_PARROQUIAL"
    municipio_id: Optional[int] = None
    parroquia_id: Optional[int] = None
    avatar_url: Optional[str] = None
    is_active: bool = True


class UserCreate(UserBase):
    google_id: Optional[str] = None


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    role: Optional[str] = None
    municipio_id: Optional[int] = None
    parroquia_id: Optional[int] = None
    is_active: Optional[bool] = None


class UserResponse(UserBase):
    id: uuid.UUID
    created_at: datetime
    last_login: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
