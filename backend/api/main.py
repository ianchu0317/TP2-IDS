from fastapi import FastAPI
from schemas import User

app = FastAPI()


@app.post("/register")
async def register_user(user_data: User):
    return {"hello": "world"}

