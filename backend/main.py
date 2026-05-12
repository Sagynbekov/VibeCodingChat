from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from datetime import datetime
import uuid

import schemas, firebase_config

app = FastAPI(title="VibeChat API")

# Настройка CORS для работы с React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    firebase_config.init_firebase()

@app.get("/api/health")
def health_check():
    return {"status": "ok", "timestamp": datetime.utcnow()}

@app.post("/api/users", response_model=schemas.User)
def create_user(user: schemas.UserCreate):
    db = firebase_config.get_db()
    if not db:
        raise HTTPException(status_code=500, detail="Firebase not connection")
    
    user_id = str(uuid.uuid4())
    # В реальном приложении пароль нужно хешировать!
    # Например: hashed_password = bcrypt.hash(user.password)
    user_data = {
        "id": user_id,
        "nickname": user.nickname,
        "password": user.password # В учебных целях храним как есть
    }
    
    db.collection("users").document(user_id).set(user_data)
    
    # Не возвращаем пароль клиенту
    return schemas.User(id=user_id, nickname=user.nickname)

@app.get("/api/users", response_model=List[schemas.User])
def get_users():
    db = firebase_config.get_db()
    if not db:
        return []
    
    docs = db.collection("users").stream()
    users = []
    for doc in docs:
        data = doc.to_dict()
        # Убедимся, что возвращаем только нужные поля, без пароля
        users.append(schemas.User(id=data.get("id"), nickname=data.get("nickname")))
    return users

@app.post("/api/login", response_model=schemas.User)
def login_user(user: schemas.UserCreate):
    db = firebase_config.get_db()
    if not db:
        raise HTTPException(status_code=500, detail="Firebase not connection")

    users_ref = db.collection("users").where("nickname", "==", user.nickname).limit(1)
    docs = users_ref.stream()
    
    found_user = None
    for doc in docs:
        found_user = doc.to_dict()
        break

    if not found_user or found_user.get("password") != user.password:
        raise HTTPException(status_code=401, detail="Invalid nickname or password")

    return schemas.User(id=found_user.get("id"), nickname=found_user.get("nickname"))

@app.get("/api/messages", response_model=List[schemas.Message])
def get_messages():
    db = firebase_config.get_db()
    if not db:
        return []
    
    docs = db.collection("messages").order_by("timestamp").stream()
    messages = []
    for doc in docs:
        data = doc.to_dict()
        messages.append(data)
    return messages

@app.post("/api/messages", response_model=schemas.Message)
def send_message(msg: schemas.MessageCreate):
    db = firebase_config.get_db()
    msg_id = str(uuid.uuid4())
    msg_data = {
        "id": msg_id,
        "sender_id": msg.sender_id,
        "content": msg.content,
        "timestamp": datetime.utcnow()
    }
    db.collection("messages").document(msg_id).set(msg_data)
    return msg_data
