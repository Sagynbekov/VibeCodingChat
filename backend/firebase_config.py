import firebase_admin
from firebase_admin import credentials, firestore
import os
from typing import Optional

# Глобальная переменная для БД
db: Optional[firestore.client] = None

def init_firebase():
    global db
    # ВАЖНО: Для локальной разработки используем serviceAccountKey.json
    # В AI Studio/Cloud мы бы использовали переменные окружения
    cred_path = os.path.join(os.path.dirname(__file__), "serviceAccountKey.json")
    
    if not firebase_admin._apps:
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        else:
            # Фолбэк для тестов или если ключа нет (выдаст ошибку при запросе)
            print("WARNING: serviceAccountKey.json not found!")
            return None
            
    db = firestore.client()
    return db

def get_db():
    if db is None:
        return init_firebase()
    return db
