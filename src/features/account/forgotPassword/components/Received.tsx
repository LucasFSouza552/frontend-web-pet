import { Link } from "react-router-dom";
import styled, { useTheme } from "styled-components";
import { FaCheckCircle } from "react-icons/fa";

export default function ReceivedScreen() {
    const theme = useTheme();

    return (
        <ContentDiv>
            <IconCircle>
                <FaCheckCircle size={48} color={theme.colors.primary} />
            </IconCircle>
            <ConfirmationTitle>Link enviado com sucesso!</ConfirmationTitle>
            <Description>
                Dê uma olhada na sua caixa de entrada e siga o link seguro para criar uma nova senha.
                Essa solicitação expira em 30 minutos.
            </Description>
            <ActionGroup>
                <ActionLink to="/login">Voltar ao login</ActionLink>
            </ActionGroup>
        </ContentDiv>
    );
}

const ContentDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 18px;
    text-align: center;
    color: rgba(255, 255, 255, 0.9);
`;

const IconCircle = styled.div`
    width: 92px;
    height: 92px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ConfirmationTitle = styled.h2`
    font-size: 32px;
    color: #fff;
    margin: 0;
`;

const Description = styled.p`
    font-size: 16px;
    max-width: 320px;
    margin: 0;
`;

const ActionGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
`;

const ActionLink = styled(Link)`
    background: linear-gradient(180deg, #eeb5ff, #b648a0);
    border: none;
    border-radius: 14px;
    padding: 12px 0;
    font-weight: 700;
    color: #120211;
    text-decoration: none;
    display: block;
`;