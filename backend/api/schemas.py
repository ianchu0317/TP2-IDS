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


class UserInfo(BaseModel):
    username: str
    email: str
    phone: int
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
    likes: int
    date: datetime.date | None

    
class PhobiaOUT(BaseModel):
    id: int
    phobia_name: str
    description: str | None
    creator: str # username creador
    likes: int
    comments: int | None
    date: datetime.date | None

    
# Comentarios
class Comment(BaseModel):
    comment: str

class CommentInDB(BaseModel):
    id: int | None
    comment: str
    creator_id: int
    phobia_id: int
    date: datetime.date | None

class CommentOUT(BaseModel):
    comment: str
    creator: str # username creador
    date: datetime.date 