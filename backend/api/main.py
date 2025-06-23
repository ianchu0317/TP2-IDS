from fastapi import FastAPI, HTTPException
from schemas import User, UserLogin, Token
import db_controller as db
import auth_controller as auth

app = FastAPI()


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
