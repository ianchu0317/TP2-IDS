import jwt
from fastapi import HTTPException
from passlib.context import CryptContext
from schemas import UserLogin, UserInDB
from datetime import datetime, timezone, timedelta

# contexto de hasheo para contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# variables para generación de jwt
# openssl rand -hex 32
SECRET_KEY = "354198b9efb425526d5822bd4e4d5ab36fa92dcf2e40521d18402e4edcd60ae1"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 10


def hash_password(password: str) -> str:
    """Hashear contraseña usando SHA-256"""
    try: 
        hashed_password = pwd_context.hash(password)
    except AttributeError:
        pass
    return hashed_password


def verify_password(password, hashed_password):
    return pwd_context.verify(password, hashed_password)


def create_token(user: UserInDB):
    """Create a token for the user"""
    data = {
        "sub": str(user.id),
        "username": user.username,
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    } 
    jwt_token = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
    return jwt_token


def get_id_from_token(token: str) -> int:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Token invalido, logear de nuevo (expirado)"    
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=401,
            detail="Token invalido"
        )