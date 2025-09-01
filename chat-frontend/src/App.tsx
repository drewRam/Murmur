import React from "react";
import { Layout } from "./components";
import styled from "styled-components";

const Container = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-rows: 1fr auto;
  grid-template-columns: 100%;
`;

const Main = styled.main`
  margin: 0 auto;
  width: 100%;
  max-width: 1600px;
  min height: 100vh;
  padding: 0;
`;

const App: React.FC = () => {
  return (
    <Container>
      <Main>
        <Layout />
      </Main>
    </Container>
  );
}

export default App;
