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
    user_data = user.dict()
    user_data["id"] = user_id
    
    db.collection("users").document(user_id).set(user_data)
    return user_data

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
