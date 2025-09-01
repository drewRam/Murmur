# Realtime Chat App

A real-time chat application built with:

- **Frontend**: React (TypeScript)
- **Backend**: FastAPI (Python, WebSockets)

## Features

- Real-time messaging between users  
- Users can choose a display name  
- Simple and clean UI built with React  
- Fast backend powered by FastAPI and WebSockets  

---

## Getting Started

### Frontend

```bash
# Navigate to frontend
cd chat-frontend

# Install dependencies
npm install

# Start frontend development server
npm start
```
The frontend will typically run on http://localhost:3000.


### Backend
```bash
# Navigate to backend
cd chat-backend

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --host 0.0.0.0 --port 8000
```

Using --host 0.0.0.0 allows any device on your network to connect using your machine's IP.

By default, it runs on port 8000.