import styled, { useTheme } from "styled-components";
import { FaQuestion } from 'react-icons/fa';

interface RecoveryPassProps {
    email: string, 
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void, 
    handleSubmit: (e: React.FormEvent) => void
}

export default function RecoveryPasswordForm({email, handleChange, handleSubmit}: RecoveryPassProps) {
    const theme = useTheme();

    return (
        <ContentDiv>
            <FaQuestion size={50} color={theme.colors.primary} />
            <PageHeader>Esqueci minha senha</PageHeader>
            <DescriptionText>Sem problemas! Acontece com todo mundo.
                Informe seu e-mail e enviaremos um link para você criar uma nova senha rapidinho.</DescriptionText>
            <InputFieldContainer>
                <label><b>E-mail ou usuário</b></label>
                <InputField
                    id="email"
                    type="email"
                    placeholder="Insira um e-mail"
                    value={email}
                    onChange={handleChange} />
            </InputFieldContainer>
            <ButtonStyle onClick={handleSubmit}>Enviar</ButtonStyle>
        </ContentDiv>
    );
}

const PageHeader = styled.h1`
    color: ${({ theme }) => theme.colors.primary};
`;

const DescriptionText = styled.p`
    width: 100%;
`;

const InputFieldContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 20px;
    margin-top: 20px;
`;

const InputField = styled.input`
    border: none;
    border-bottom: 1px solid white;
    outline: none;
    border-radius: 4px;
    padding: 8px;
    background-color: transparent;

    &::placeholder {
        color: white;
    }
`;

const ContentDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    color: white;
`;

const ButtonStyle = styled.button<{ filled?: boolean }>`
    background-color:${({ theme, filled }) => filled ? theme.colors.primary : "transparent"};
    border: ${({ filled, theme }) =>
        filled ? `2px solid #FFF` : `2px solid ${theme.colors.primary}`};
    border-radius: 10px;
    width: 100%;
    font-size: 25px;
    padding: 5px 10px;
    font-weight: bolder;
    transition: all 0.3s;
    color: ${({ filled, theme }) => filled ? "#FFF" : theme.colors.primary};
    cursor: pointer;
    &:hover {
        background-color: ${({ filled, theme }) => filled ? "transparent" : theme.colors.primary};
        border: ${({ filled, theme }) => !filled ? "2px solid transparent" : `2px solid ${theme.colors.primary}`};
        color: ${({ filled }) => filled ? "#FFF" : "#FFF"};
    }
`;