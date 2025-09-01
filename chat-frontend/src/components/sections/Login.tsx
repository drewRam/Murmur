import React, { useState } from "react";
import styled from "styled-components";

const StyledLogin = styled.section`
    display: flex;
    justify-content: center; 
    flex-direction: column;
    align-items: flex-start;
    min-height: 100vh;
    height: 100vh;
    padding 0;
    color: rgba(233, 233, 235, 1);
    margin-left: 100px;

    h1 {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 6rem;
        font-weight: 400;
        margin: 0;
    }

    h1 img {
        height: 1em;
        width: auto;
    }

    h3 {
        font-size: 2rem;
        font-weight: 400;
        margin: 0;
        margin-bottom: 50px;
        color: rgba(90, 90, 105, 1);
    }

    input, button {
        width: 500px;
        font-size: 1rem;
        padding: 25px;
        box-sizing: border-box;
        border-radius: 5px;
    }

    input {
        background-color: rgba(54, 55, 66, 1);
        border: none;
        margin-bottom: 15px;
        color: inherit;

        &::placeholder {
            position: absolute;
            top: 5px;
            left: 10px;
            font-size: 0.75rem;
            color: rgba(233, 233, 235, 1);
        }
    }

    button {
        background-color: #ff6600ff;
        color: rgba(233, 233, 235, 1);
        border: none;
        text-align: center;
        cursor: pointer;

        &:hover {
            background-color: #e65c00;
        }

        &:active {
            background-color: #cc5200;
            transform: scale(0.97);
        }

        &:disabled {
            background-color: rgba(204, 204, 204, 0.7);
            cursor: not-allowed;
        }
    }

    .warning {
        color: rgba(255, 77, 77, 0.8);
        font-size: 0.85rem;
        margin-top: 10px;
        min-height: 1.2em;
    }
`;

const ToTitleCase = (str: string) => {
    return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
    });
}

interface LoginProps {
    onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [input, setInput] = useState<string>("");
    const [placeholder, setPlaceholder] = useState<string>("Username");
    const [triedSubmit, setTriedSubmit] = useState<boolean>(false);
    const [uniqueUsername, setUniqueUsername] = useState<boolean>(true);
    const isValidLength = input.trim().length >= 3 && input.trim().length <= 15;

    const handleLogin = async() => {
        setTriedSubmit(true);
        if (!isValidLength) return;

        const name = ToTitleCase(input);
        try {
            const res = await fetch("http://localhost:8000/check-username", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: name }),
            });
            
            if (!res.ok) {
                const data = await res.json();
                console.log(data);
                setUniqueUsername(false);
                // alert(data.detail || "Username not available");
                return;
            }
            
            setUniqueUsername(true);
            onLogin(name);
        } catch (err) {
            console.error("Error checking username", err);
        }
    };

    return (
        <StyledLogin>
            <h1>
                Welcome
                <img src="/content/waving_hand.png" alt="wave" />
            </h1>
            <h3>Set a username to get started</h3>
            <input 
                placeholder={placeholder}
                value={input}
                minLength={3}
                maxLength={10}
                onChange={(e) => {
                    setInput(e.target.value)
                    setUniqueUsername(true)
                }}
                onFocus={() => setPlaceholder("")}
                onBlur={() => {
                    if (input.trim() === "") setPlaceholder("Username");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()} 
            />
            <button disabled={!isValidLength} onClick={handleLogin}>
                Enter
            </button>
            <div className="warning">
                {triedSubmit && (
                    !isValidLength
                        ? "Username must be 3-15 characters long"
                        : !uniqueUsername
                        ? "Username is already taken."
                        : ""
                )}
            </div>
        </StyledLogin>
    );
};

export default Login;
