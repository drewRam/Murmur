import React, { useState, useEffect } from "react";
import styled from "styled-components";

const StyledChat = styled.section`
    height: 100vh;
    display: flex;
    flex-direction: column;
    color: rgba(233, 233, 235, 1);
`;

const DisplayMessageBackground = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 100px 0;
    background-image: linear-gradient(to top, rgba(54, 55, 66, 1), rgba(37, 38, 47, 0.75));
    border-bottom-left-radius: 25px;
    border-bottom-right-radius: 25px;
    flex: 1;
    width: 100%;
`;

const DisplayMessages = styled.div`
    flex: 1 0 0;
    width: 80%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 10px;
    overflow-y: auto;
    
    div.message {
        max-width: 60%;
        padding 10px 15px;
        border-radius: 15px;
        word-break: break-word;
        height: auto;
        padding: 10px;
    }

    div.my-message {
        align-self: flex-end;
        background-color: #007aff;
        color: white;
        border-bottom-right-radius: 0;
        margin-right: 5px;
    }

    div.other-message {
        align-self: flex-start;
        background-color: rgba(233, 233, 235, 1);
        color: black;
        border-bottom-left-radius: 0;
        margin-left: 5px;
    }
`;

const Fields = styled.div`
    display: flex;
    font-size: 1rem;
    box-sizing: border-box;
    border-radius: 5px;
    height: 50px;
    width: 80%;
    margin: 15px;

    input {
        flex: 1;
        border: 1px solid rgba(31, 127, 244, 1);
        border-radius: 5px;
        background: none;
        color: inherit;
        padding-left: 15px;
    }

    button {
        background: none;
        border: none;

        img {
            transform: scaleY(-1);
            height: 100%;
        }

        &:hover img {
            filter: brightness(0.7);
            transform: scaleY(-1) scale(1.1);
        }

        &:active img {
            transform: scaleY(-1) scale(0.95);
        }
    }
`;

interface ChatProps {
    username: string;
}

const Chat: React.FC<ChatProps> = ({ username }) => {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState("");
    const [ws, setWs] = useState<WebSocket | null>(null);

    useEffect(() => {
        const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
        const wsUrl = `${wsProtocol}://${window.location.hostname}:8000/ws/${username}`;

        const socket = new WebSocket(wsUrl);

        socket.onmessage = (event) => {
            setMessages((prev) => [...prev, event.data]);
        };

        setWs(socket);

        return () => socket.close();
    }, [username]);

    const sendMessage = () => {
        if (ws && input.trim() !== "") {
            ws.send(input);
            setInput("");
        }
    };

    return (
        <StyledChat>
            <DisplayMessageBackground>
                <DisplayMessages>
                    {messages.map((msg, i) => {
                        const isMine = msg.startsWith(username);
                        return (
                            <div
                                key={i}
                                className={`message ${isMine ? "my-message" : "other-message"}`}
                            >
                                { msg.replace(`${username}: `, "")}
                            </div>
                        );
                    })}
                </DisplayMessages>
                <Fields>
                    <input
                        type="text"
                        value={input}
                        placeholder="Write a message..."
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button onClick={sendMessage}>
                        <img src="/content/arrow_button.png" alt="submit" />
                    </button>
                </Fields>
            </DisplayMessageBackground>
        </StyledChat>
    );
};

export default Chat;
