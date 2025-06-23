from fastapi import FastAPI, HTTPException
from schemas import User, UserLogin
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
    return await db.is_user_in_db(user_data)

{
    "username": "testing",
    "email": "test@testing.com",
    "phone": 123456,
    "password": "password"
}