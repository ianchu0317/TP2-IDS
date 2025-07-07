from fastapi import FastAPI, HTTPException
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends
from typing import Annotated
from schemas import User, UserLogin, UserInfo, Token
from schemas import Phobia, PhobiaInDB
from schemas import Comment, CommentInDB
import db_controller as db
import auth_controller as auth


app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


# **** Autenticación de usuarios ****
# Registrar usuario
@app.post("/register", status_code=201)
async def register_user(user_data: User):
    try:
        await db.create_user(user_data)
    except:
        raise HTTPException(
            status_code=400,
            detail="Datos inválidos")

# Login usuario
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


# Obtener información de un usuario
@app.get("/profile", status_code=200, response_model=UserInfo)
async def get_user_info(token: Annotated[str, Depends(oauth2_scheme)]):
    user_id = auth.get_id_from_token(token)
    user_in_db = await db.get_user_info(user_id)

    return UserInfo(
        username=user_in_db.username,
        email=user_in_db.email,
        phone=user_in_db.phone,
        date=user_in_db.date
    )



# **** CRUD Fobias ****
# Crear fobia
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


# Obtener todas las fobias en una lista
@app.get("/phobias", status_code=200, response_model=list[PhobiaInDB])
async def get_phobias():
    return await db.get_phobias()


# Obtener fobia por ID específica de la lista
@app.get("/phobias/{phobia_id}", status_code=200, response_model=PhobiaInDB)
async def get_phobia(phobia_id: int):
    phobia = await db.get_phobia(phobia_id)
    if not phobia:
        raise HTTPException(
            status_code=404,
            detail="Fobia no encontrada"
        )
    return phobia


# Actualizar fobia (título, descripción)
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


# Eliminar fobia
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



# *** CRUD comentarios ***
# Crear comentario en una fobia
@app.post("/phobias/{phobia_id}/comments", status_code=200)
async def create_comment(phobia_id: int,
                         comment_data: Comment,
                         token: Annotated[str, Depends(oauth2_scheme)]):
    user_id = auth.get_id_from_token(token)

    try:
        comment_db = await db.create_comment(comment_data, user_id, phobia_id)
    except:
        raise HTTPException(
            status_code=400,
            detail="Error creando comentario"
        ) 
    return comment_db


# Obtener comentarios de una fobia
@app.get("/phobias/{phobia_id}/comments", status_code=200, response_model=list[CommentInDB])
async def get_comments(phobia_id: int):
    comments = await db.get_comments(phobia_id)
    if not comments:
        raise HTTPException(
            status_code=404,
            detail="No hay comentarios para esta fobia"
        )
    return comments



# **** Rankings ****
# Dar like a fobia
@app.put("/phobias/{phobia_id}/like", status_code=200)
async def like_phobia(phobia_id: int, token: Annotated[str, Depends(oauth2_scheme)]):
    await db.like_phobia(phobia_id)

# Lista de fobias ordenadas por cantidad de likes
@app.get("/rankings", status_code=200, response_model=list[PhobiaInDB])
async def get_rankings(token: Annotated[str, Depends(oauth2_scheme)]):
    phobias = await db.get_rankings()
    return phobias
