# server/websocket_manager.py
from typing import Dict, List
from fastapi import WebSocket


class ConnectionManager:
    def __init__(self) -> None:
        self.rooms: Dict[str, List[WebSocket]] = {}

    async def connect(self, room: str, websocket: WebSocket) -> None:
        await websocket.accept()
        if room not in self.rooms:
            self.rooms[room] = []
        self.rooms[room].append(websocket)

    def disconnect(self, room: str, websocket: WebSocket) -> None:
        if room not in self.rooms:
            return
        self.rooms[room] = [ws for ws in self.rooms[room] if ws is not websocket]
        if not self.rooms[room]:
            del self.rooms[room]

    async def broadcast(self, room: str, message: str) -> None:
        if room not in self.rooms:
            return
        dead: List[WebSocket] = []
        for ws in self.rooms[room]:
            try:
                await ws.send_text(message)
            except Exception:
                dead.append(ws)

        if dead:
            self.rooms[room] = [ws for ws in self.rooms[room] if ws not in dead]
            if not self.rooms[room]:
                del self.rooms[room]


manager = ConnectionManager()
