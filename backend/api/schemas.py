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


class Token(BaseModel):
    token: str
    token_type: str
    
    
# POSTS
class Phobia(BaseModel):
    phobia_name: str
    description: str | None    


class PhobiaInDB(BaseModel):
    id: int | None
    phobia_name: str 
    description: str | None
    creator_id: int
    likes: int | None
    date: datetime.date | None