from passlib.context import CryptContext
from schemas import UserLogin, UserInDB

# contexto de hasheo para contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Hashear contraseña usando SHA-256"""
    try: 
        hashed_password = pwd_context.hash(password)
    except AttributeError:
        pass
    return hashed_password

def verify_password(password, hashed_password):
    return pwd_context.verify(password, hashed_password)
        