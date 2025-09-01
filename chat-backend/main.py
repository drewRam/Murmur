from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connections and usernames
active_connections: dict[WebSocket, str] = {}

class UsernameRequest(BaseModel):
    username: str

@app.post("/check-username")
async def check_username(req: UsernameRequest):
    username = req.username.strip()
    if username in active_connections.values():
        raise HTTPException(status_code=400, detail="Username already taken")
    return {"available": True}

async def broadcast(message: str):
    for conn in active_connections.keys():
        await conn.send_text(message)

@app.websocket("/ws/{username}")
async def websocket_endpoint(websocket: WebSocket, username: str):
    username = username.strip()

    # Prevent duplicate usernames
    if username in active_connections.values():
        await websocket.close(code=4000)
        return

    await websocket.accept()
    active_connections[websocket] = username

    try:
        while True:
            data = await websocket.receive_text()
            await broadcast(f"{username}: {data}")
    except WebSocketDisconnect:
        # Clean up username when the socket closes
        active_connections.pop(websocket, None)
