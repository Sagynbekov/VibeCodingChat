from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    nickname: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str

    class Config:
        from_attributes = True

class MessageBase(BaseModel):
    sender_id: str
    receiver_id: str
    content: str

class MessageCreate(MessageBase):
    pass

class Message(BaseModel):
    id: str
    sender_id: str
    receiver_id: str
    content: str
    timestamp: datetime

    class Config:
        from_attributes = True
