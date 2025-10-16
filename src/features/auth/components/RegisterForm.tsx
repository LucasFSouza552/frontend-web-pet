import styled from "styled-components";
import { Link } from "react-router-dom";
import { useRegisterController } from "../controllers/useRegisterController";

export default function RegisterForm() {
    const { data, handleChange, handleSubmit } = useRegisterController();

    return (
        <>
            <Title>Vamos personalizar sua experiência</Title>
            <FormContainer onSubmit={handleSubmit}>
                <FormTitle>Informações básicas</FormTitle>
                
                <InputGrid>
                    <Input name="firstName" placeholder="Primeiro nome" value={data.firstName} onChange={handleChange} required />
                    <Input name="lastName" placeholder="Sobrenome" value={data.lastName} onChange={handleChange} required />
                </InputGrid>
                
                <Input name="email" type="email" placeholder="E-mail" value={data.email} onChange={handleChange} required />
                <Input name="address" placeholder="Endereço" value={data.address} onChange={handleChange} required />
                <Input name="password" type="password" placeholder="Crie uma senha" value={data.password} onChange={handleChange} required />
                
                <PrimaryButton type="submit">Próximo</PrimaryButton>

                <SmallText>
                    Já tem uma conta? <Link to="/login">Clique aqui!</Link>
                </SmallText>
            </FormContainer>
        </>
    );
}

// --- Estilos ---

const Title = styled.h2`
    color: #f0eafc;
    font-weight: 400;
    font-size: 1.2rem;
    margin-bottom: 40px;
    text-align: center;
`;

const FormContainer = styled.form`
    background-color: transparent;
    border: 1px solid #D946EF;
    border-radius: 20px;
    padding: 40px;
    width: 100%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 25px;
    box-shadow: 0 0 20px rgba(217, 70, 239, 0.2);
`;

const FormTitle = styled.h3`
    text-align: center;
    font-weight: 500;
    font-size: 1.5rem;
    color: #f0eafc;
    margin-bottom: 10px;
`;

const InputGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    width: 100%;
`;

const Input = styled.input`
    width: 100%;
    padding: 12px 5px;
    background-color: transparent;
    border: none;
    border-bottom: 1px solid #c8a2c8;
    color: #f0eafc;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.3s ease;

    &::placeholder {
        color: #d8bfd8;
    }

    &:focus {
        border-bottom-color: #D946EF;
    }
`;

const PrimaryButton = styled.button`
    background-color: #D946EF;
    color: white;
    border: none;
    border-radius: 10px;
    padding: 14px 45px;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;
    margin-top: 20px;

    &:hover {
        background-color: #c735de;
    }
`;

const SmallText = styled.p`
    font-size: 0.9rem;
    color: #d8bfd8;

    a {
        color: #f0eafc;
        text-decoration: underline;
        font-weight: bold;
    }
`;