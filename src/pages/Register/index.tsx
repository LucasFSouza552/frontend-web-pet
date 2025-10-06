import styled from "styled-components";

export default function RegisterSection() {
    return (
        <Container>
            <div>
                <h1>Registrar-se</h1>
                <form>
                    <input type="text" placeholder="Nome" />
                    <input type="email" placeholder="Email" />
                    <input type="password" placeholder="Senha" />
                    <button type="submit">Registrar</button>
                </form>
            </div>
        </Container>
    );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 150px;
`;