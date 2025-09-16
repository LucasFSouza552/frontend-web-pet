import { useState } from "react";
import styled from "styled-components";
import { PrimaryButton } from "./PrimaryButton";
import { Link } from "react-router-dom";

export default function LoginForm() {
    const [login, setLogin] = useState({
        email: "",
        password: ""
    });

    const handleChange = (key: string, value: string) => {
        setLogin((prev) => ({
            ...prev,
            [key]: value
        }));
    }

    return (
        <FormContainer>
            <h2>Entrar</h2>
            <p>Digite seu email e senha para continuar</p>
            <InputContainer placeholder="Email" label="email" setValue={handleChange} value={login.email} type="email" />
            <InputContainer placeholder="Senha" label="senha" setValue={handleChange} value={login.password} type="password" />
            <PrimaryButton text="Entrar" type="submit" filled />
            <p>Não tem conta? <Link to="register">Clique aqui</Link></p>
        </FormContainer>
    )
}

interface InputProps {
    label: string;
    placeholder: string;
    value: string;
    type?: string;
    setValue: (key: string, value: string) => void;
}

const InputContainer = ({ label, placeholder, value, setValue, type }: InputProps) => {
    return (
        <Input>
            <input
                id={label}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => setValue(e.target.id, e.target.value)} />
        </Input>
    );
}

const Input = styled.div`
    margin-bottom: 5px;
    width: 50%;

    input {
        padding: 10px;
        border-radius: 10px;
        border: none;
        outline: none;
        width: 100%;
    }
`

const FormContainer = styled.form`
    background-color:  ${({ theme }) => theme.colors.secondary};
    color: #fff;
    border-radius: 5px;
    gap: 5px;
    width: 25%;
    height: 40%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;