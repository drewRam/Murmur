import React, { useState } from "react";
import { Login, Chat } from "components";
import styled from "styled-components";

const StyledLayout = styled.div`
    display:flex;
    flex-direction: column;
    min-height: 100vh;
`;

const Layout: React.FC = () => {
    const [username, setUsername] = useState<string>("");

    return (
        <StyledLayout>
            { !username ? (
                <Login onLogin={(name: string) => setUsername(name)} />
            ): (
                <Chat username={ username } />
            )}
        </StyledLayout>
    );
}

export default Layout;