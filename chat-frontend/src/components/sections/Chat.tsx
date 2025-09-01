import React, { useState, useEffect } from "react";

interface ChatProps {
    username: string;
}

const Chat: React.FC<ChatProps> = ({ username }) => {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState("");
    const [ws, setWs] = useState<WebSocket | null>(null);

    useEffect(() => {
        const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
        const wsUrl = `${wsProtocol}://${window.location.hostname}:8000/ws`;

        const socket = new WebSocket(wsUrl);

        socket.onmessage = (event) => {
            setMessages((prev) => [...prev, event.data]);
        };

        setWs(socket);

        return () => socket.close();
    }, []);

    const sendMessage = () => {
        if (ws && input.trim() !== "") {
            ws.send(`${username}: ${input}`);
            setInput("");
        }
    };

    return (
    <div style={{ padding: "20px" }}>
        <h2>Chat as {username}</h2>
        <div
        style={{
            border: "1px solid black",
            height: "200px",
            overflowY: "scroll",
            padding: "10px",
        }}
        >
        {messages.map((msg, i) => (
            <div key={i}>{msg}</div>
        ))}
        </div>
        <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
    </div>
    );
};

export default Chat;
