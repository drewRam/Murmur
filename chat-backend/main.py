from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Set
import json

app = FastAPI()

# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# chat_rooms: room_id -> set of WebSockets
chat_rooms: Dict[str, Set[WebSocket]] = {}

# usernames per connection
usernames: Dict[WebSocket, str] = {}

class UsernameRequest(BaseModel):
    username: str

@app.post("/check-username")
async def check_username(req: UsernameRequest):
    username = req.username.strip()
    if username in usernames.values():
        raise HTTPException(status_code=400, detail="Username already taken")
    return {"available": True}

async def broadcast(room_id: str, sender_ws: WebSocket, username: str, message: str):
    if room_id in chat_rooms:
        payload = json.dumps({"username": username, "message": message})
        for conn in chat_rooms[room_id]:
            # Optional: skip sender if you want sender to manage local UI
            # if conn == sender_ws:
            #     continue
            await conn.send_text(payload)

@app.websocket("/ws/{username}/{room_id}")
async def websocket_endpoint(websocket: WebSocket, username: str, room_id: str):
    username = username.strip()
    await websocket.accept()

    # Add to room (set prevents duplicates)
    if room_id not in chat_rooms:
        chat_rooms[room_id] = set()
    chat_rooms[room_id].add(websocket)

    try:
        while True:
            data = await websocket.receive_text()
            await broadcast(room_id, websocket, username, data)
    except WebSocketDisconnect:
        chat_rooms[room_id].discard(websocket)
        if len(chat_rooms[room_id]) == 0:
            del chat_rooms[room_id]
