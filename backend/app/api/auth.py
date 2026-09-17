from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.database import get_db
from app.models.models import User
from app.schemas.schemas import UserLogin, Token, UserSchema
from app.core.security import verify_password, create_access_token
from app.api.deps import get_required_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=Token)
async def login(login_data: UserLogin, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(User).where(User.email == login_data.email))
    user = res.scalars().first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user account")
    
    token = create_access_token(subject=user.id)
    return Token(
        access_token=token,
        token_type="bearer",
        user=UserSchema.model_validate(user)
    )

@router.get("/me", response_model=UserSchema)
async def get_me(current_user: User = Depends(get_required_user)):
    return UserSchema.model_validate(current_user)

@router.post("/logout")
async def logout():
    return {"message": "Logged out successfully"}
