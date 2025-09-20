import styled from "styled-components";
import { PrimaryButton } from "../PrimaryButton";
import { Link } from "react-router-dom";
import useLoginController from "../../controllers/useLoginController";
import InputComponent from "../InputComponent";
import ErrorContainer from "../ErrorContainer";

export default function LoginForm() {
    const { credentials, error, handleChange, handleLogin } = useLoginController();
    return (
        <>
            <FormContainer onSubmit={handleLogin}>
                <h2>Entrar</h2>
                <p>Digite seu email e senha para continuar</p>
                <InputComponent placeholder="Email" label="email" onChange={handleChange} value={credentials.email} type="email" />
                <InputComponent placeholder="Senha" label="senha" onChange={handleChange} value={credentials.password} type="password" />
                <PrimaryButton text="Entrar" type="submit" filled />
                <p>Não tem conta? <Link to="register">Clique aqui</Link></p>

            </FormContainer>
            <ErrorContainer message={error} />
        </>
    );
}


const FormContainer = styled.form`
    background-color:  ${({ theme }) => theme.colors.secondary};
    color: #fff;
    border-radius: 5px;
    gap: 5px;
    padding: 10px;
    height: 40%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;