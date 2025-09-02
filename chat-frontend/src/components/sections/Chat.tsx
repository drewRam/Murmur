import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const StyledChat = styled.section`
    height: 100vh;
    display: flex;
    flex-direction: column;
    color: rgba(233, 233, 235, 1);
`;

const MessageBoard = styled.div`
    display: flex;
    flex: 1;
    margin-top: 50px;
`;

const ChatSidebar  = styled.div`
    display: flex;
    flex-direction: column;
    width: 30%;
    margin-right: 20px;

    h1 {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: auto;
        gap: 8px;
        font-size: 3rem;
        font-weight: 500;
        margin: 0;
        margin: 0 15px;
        margin-bottom: 10px;

        button {
            display: flex;
            align-items: center;
            background: none;
            border: none;
            margin-right: 10px;
            cursor: pointer;
            height: 3rem;
            min-height: 3rem;
            
            img {
                height: 100%;
                width: 100%;
                filter: invert(1);
            }   
            
            &:hover img {
                filter: invert(1);
                transform: scale(1.1);
            }
        
            &:active img {
                filter: invert(1);
                transform: scale(0.95);
            }
    }
`;

const ChatList  = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1 0 0;
    margin-bottom: 100px;
    padding-right: 15px;
    overflow-y: auto;
    
    button {
        min-height: 100px;
        margin: 5px 0;
        font-size: 1.25rem;
        text-align: left;
        text-indent: 15px;
        background: none;
        border: none;
        color: inherit;
        padding: 10px;
        cursor: pointer;
        border-radius: 25px;
        background-image: linear-gradient(to right, rgba(54, 55, 66, 1), rgba(37, 38, 47, 0.75));
        
        &:hover {
            background: rgba(255, 255, 255, 0.1);
            }
        }
            
    .active {
        background-image: linear-gradient(to right, rgba(0, 122, 255, 0.2), rgba(37, 38, 47, 0.75));
    }
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

const MessageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    &.mine {
        align-items: flex-end;
    }

    .username {
        font-size: 0.8rem;
        color: rgba(200, 200, 200, 0.7);
        margin-bottom: 3px;
        margin-left: 10px;
        margin-bottom: 5px;
    }
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
        margin-right: 5px;
        border-bottom-right-radius: 0;
    }

    div.other-message {
        align-self: flex-start;
        background-color: rgba(233, 233, 235, 1);
        color: black;
        border-bottom-left-radius: 0;
        margin-left: 5px;
    }
`;

const EmptyState = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: rgba(200, 200, 200, 0.8);
    font-size: 1.2rem;
    text-align: center;
    gap: 15px;

    img {
        width: 240px;
        height: 240px;
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

interface Message {
    username: string;
    message: string;
}

interface ChatSession {
    id: number;
    title: string;
    messages: Message[];
}

const Chat: React.FC<ChatProps> = ({ username }) => {
    const [chats, setChats] = useState<ChatSession[]>([
        { id: 1, title: "Chat 1", messages: [] }
    ]);
    const [activeChatId, setActiveChatId] = useState<number>(1);// Store sockets in a ref to prevent recreation
    const chatSockets = useRef<Record<number, WebSocket>>({});
    const [input, setInput] = useState<string>("");

    const activeChat = chats.find((c: any) => c.id === activeChatId) as ChatSession | undefined;

    useEffect(() => {
        if (!activeChat) return;
        if (chatSockets.current[activeChat.id]) return; // already exists

        const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
        const wsUrl = `${wsProtocol}://${window.location.hostname}:8000/ws/${username}/${activeChat.id}`;
        const socket = new WebSocket(wsUrl);

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setChats((prev) =>
                prev.map((chat) =>
                    chat.id === activeChat!.id
                        ? { ...chat, messages: [...chat.messages, data] }
                        : chat
                )
            );
        };

        chatSockets.current[activeChat.id] = socket;
    }, [activeChat, username]); // do NOT include chatSockets



    const sendMessage = () => {
        if (!activeChat) return;

        const socket = chatSockets.current[activeChat.id];

        if (!socket || input.trim() === "") return;

        const msg = input;
        setInput("");

        if (socket.readyState === WebSocket.OPEN) {
            socket.send(msg);
        } else {
            socket.addEventListener("open", () => socket.send(msg), { once: true });
        }
    };

    const addNewChat = () => {
        const newId = chats.length + 1;
        setChats([...chats, { id: newId, title: `Chat ${newId}`, messages: [] }]);
        setActiveChatId(newId);
    };

    return (
        <StyledChat>
            <MessageBoard>
                <ChatSidebar >
                    <h1>
                        Chats
                        <button onClick={addNewChat}>
                            <img src="/content/new_message.svg" alt="New message" />
                        </button>
                    </h1>
                    <ChatList >
                        {chats.map((chat: any) => (
                            <button
                                key={chat.id}
                                className={chat.id === activeChatId ? "active" : ""}
                                onClick={() => setActiveChatId(chat.id)}
                            >
                                {chat.title}
                            </button>
                        ))}
                    </ChatList >
                </ChatSidebar >
                <DisplayMessageBackground>
                    <DisplayMessages>
                        {activeChat?.messages.length ? (
                            activeChat?.messages.map((msg: any, i: number) => {
                            const isMine = msg.username === username;
                            const prevMsg = i > 0 ? activeChat.messages[i - 1] : null;
                            const isFirstOfBlock = !prevMsg || prevMsg.username !== msg.username;

                            return (
                            <MessageWrapper key={i} className={isMine ? "mine" : ""}>
                                {!isMine && isFirstOfBlock && (
                                    <div className="username">{msg.username}</div>
                                )}
                                <div className={`message ${isMine ? "my-message" : "other-message"}`}>
                                    {msg.message}
                                </div>
                            </MessageWrapper>
                            );
                        })
                            ) : (
                                <EmptyState>
                                    <img src="/content/peace.png" alt="No messages" />
                                    <p>No messages here yet...</p>
                                </EmptyState>
                            )}
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
            </MessageBoard>
        </StyledChat>
    );
};

export default Chat;
