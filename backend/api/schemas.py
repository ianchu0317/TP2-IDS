from pydantic import BaseModel
import datetime

class User(BaseModel):
    username: str
    email: str
    phone: int | None
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserInDB(BaseModel):
    id: int
    username: str
    email: str
    phone: int | None
    hashed_password: str
    date: datetime.date