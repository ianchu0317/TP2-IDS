from fastapi import FastAPI, HTTPException
from schemas import User
import db_controller as db

app = FastAPI()

@app.post("/register", status_code=201)
async def register_user(user_data: User):
    await db.create_user(user_data)
    return {"hello": "world"}

