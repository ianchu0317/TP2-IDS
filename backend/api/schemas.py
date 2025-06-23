from pydantic import BaseModel


class User(BaseModel):
    username: str
    email: str
    phone: int
    password: str


class UserLogin(BaseModel):
    email: str
    password: str
