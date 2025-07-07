from fastapi import FastAPI, HTTPException
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends
from typing import Annotated
from schemas import User, UserLogin, Token, Phobia
import db_controller as db
import auth_controller as auth

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


# Autenticación de usuarios
@app.post("/register", status_code=201)
async def register_user(user_data: User):
    try:
        await db.create_user(user_data)
    except:
        raise HTTPException(
            status_code=400,
            detail="Datos inválidos")


@app.post("/login", status_code=200)
async def login_user(user_data: UserLogin):
    user_db = await db.get_user(user_data)
    if not user_db:
        raise HTTPException(
            status_code=401,
            detail="Datos inválidos"
        )
    if not auth.verify_password(user_data.password, user_db.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Datos inválidos"
        )

    return { 
        "access_token": Token(
            token=auth.create_token(user_db),
            token_type="bearer"
            )
        }


# CRUD Fobias
@app.post("/phobias", status_code=201)
async def create_post(phobia: Phobia, 
                      token: Annotated[str, Depends(oauth2_scheme)]):
    # verificar token
    user_id = auth.get_id_from_token(token)
    
    return f"Vos sos {user_id}"