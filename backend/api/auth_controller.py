import jwt
from fastapi import HTTPException
from passlib.context import CryptContext
from schemas import UserInDB
from datetime import datetime, timezone, timedelta
from os import getenv

# contexto de hasheo para contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# variables para generación de jwt
SECRET_KEY = getenv('SECRET_KEY')
ALGORITHM = getenv('ALGORITHM', 'HS256') 
ACCESS_TOKEN_EXPIRE_MINUTES = int(getenv('ACCESS_TOKEN_EXPIRE_MINUTES', 30))


# Manejo de contraseñas
# Hashear contraseña
def hash_password(password: str) -> str:
    try: 
        hashed_password = pwd_context.hash(password)
    except AttributeError:
        pass
    return hashed_password

# Verificar contraseña
def verify_password(password, hashed_password):
    return pwd_context.verify(password, hashed_password)


#  Manejo de tokens JWT
# Crear token para el usuario
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


# Obtener ID de usuario desde el token
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
