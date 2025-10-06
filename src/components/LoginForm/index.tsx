import styled from "styled-components";
import { PrimaryButton } from "../PrimaryButton";
import { Link } from "react-router-dom";
import useLoginController from "../../controllers/useLoginController";
import InputComponent from "../InputComponent";
import ErrorContainer from "../ErrorContainer";
import Section from "../../styles/SectionStyle";

export default function LoginForm() {
    const { credentials, error, handleChange, handleLogin } = useLoginController();
    return (
        <Section>
            <Container>
                <FormContainer onSubmit={handleLogin}>
                    <h2>Entrar</h2>
                    <p>Digite seu email e senha para continuar</p>
                    <InputComponent placeholder="Email" label="email" onChange={handleChange} value={credentials.email} type="email" />
                    <InputComponent placeholder="Senha" label="senha" onChange={handleChange} value={credentials.password} type="password" />
                    <PrimaryButton text="Entrar" type="submit" filled />
                    <p>Não tem conta? <Link to="register">Clique aqui</Link></p>
                </FormContainer>
                <ErrorContainer message={error} />
            </Container>
        </Section>
    );
}

const Container = styled.div`
    width: 100%;
    flex: 1;
    display: flex;
    gap: 5px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const FormContainer = styled.form`
    background-color:  ${({ theme }) => theme.colors.secondary};
    color: #fff;
    border-radius: 5px;
    gap: 5px;
    padding: 10px;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
