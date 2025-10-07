import styled from "styled-components";
import { Link } from "react-router-dom";
import Section from "../../../shared/styles/SectionStyle";

import useLoginController from "../controllers/useLoginController";
import { InputComponent } from "../../../shared/components/InputComponent";
import ErrorContainer from "../../../shared/components/ErrorContainer";
import { PrimaryButton } from "../../../shared/components/PrimaryButton";
export default function AuthForm() {
    const { credentials, error, handleChange, handleLogin } = useLoginController();
    return (
        <Section>
            <Container>
                <FormContainer onSubmit={handleLogin}>
                    <h2>Entrar</h2>
                    <p>Digite seu email e senha para continuar</p>
                    <InputComponent placeholder="Email" label="email" onChange={handleChange} value={credentials.email} type="email" />
                    <InputComponent placeholder="Senha" label="senha" onChange={handleChange} value={credentials.password} type="password" />
                    <PrimaryButton text="Entrar" type="submit" filled width="50%" height="50px" />
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
    padding: 30px;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

`;
