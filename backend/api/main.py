from fastapi import FastAPI, HTTPException
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends
from typing import Annotated
from schemas import User, UserLogin, Token
from schemas import Phobia, PhobiaInDB
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
async def create_phobia(phobia_data: Phobia, 
                      token: Annotated[str, Depends(oauth2_scheme)]):
    # verificar token
    user_id = auth.get_id_from_token(token)
    try:
        db_phobia = await db.create_phobia(phobia_data, user_id)
    except:
        raise HTTPException(
            status_code=400,
            detail="Error creando fobia")
    return db_phobia


@app.get("/phobias", status_code=200, response_model=list[PhobiaInDB])
async def get_phobias(token: Annotated[str, Depends(oauth2_scheme)]):
    return await db.get_phobias()

# Get fobia por su id en db
@app.get("/phobias/{phobia_id}", status_code=200, response_model=PhobiaInDB)
async def get_phobia(phobia_id: int,
                    token: Annotated[str, Depends(oauth2_scheme)]):
    phobia = await db.get_phobia(phobia_id)
    if not phobia:
        raise HTTPException(
            status_code=404,
            detail="Fobia no encontrada"
        )
    return phobia

@app.put("/phobias/{phobia_id}", status_code=201)
async def update_phobia(phobia_id: int,
                        phobia_data: Phobia,
                        token: Annotated[str, Depends(oauth2_scheme)]):
    user_id = auth.get_id_from_token(token)
    phobia_in_db = await db.get_phobia(phobia_id)
    user_in_db = phobia_in_db.creator_id
    
    # verificar que el usuario que actualiza la fobia es el creador
    if user_id != user_in_db:
        raise HTTPException(
            status_code=403,
            detail="No sos el usuario creador lol"
        )
    try:     
        await db.update_phobia(phobia_id, phobia_data)
    except: 
        HTTPException(
            status_code=400,
            detail="Error actualizando fobia"
        )

@app.delete("/phobias/{phobia_id}", status_code=204)
async def delete_phobia(phobia_id: int, 
                        token: Annotated[str, Depends(oauth2_scheme)]):
    user_id = auth.get_id_from_token(token)
    phobia_in_db = await db.get_phobia(phobia_id)
    user_in_db = phobia_in_db.creator_id
    # verificar que el usuario que borra la fobia es el creador
    if user_id != user_in_db:
        raise HTTPException(
            status_code=403,
            detail="No sos el usuario creador lol"
        )
    try:     
        await db.update_phobia(phobia_id)
    except: 
        HTTPException(
            status_code=400,
            detail="Error actualizando fobia"
        )