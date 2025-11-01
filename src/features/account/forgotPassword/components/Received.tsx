import { styled } from "styled-components";

export default function ReceivedScreen() {
    return (
        <ContentDiv>
            <ConfirmationTitle>Enviamos com sucesso um link!</ConfirmationTitle>
            <p>E-mail enviado com sucesso!
                Dê uma olhada na sua caixa de entrada e siga o link para redefinir sua senha.</p>
            <PrevButtonStyle onClick={() => {window.location.href = "/forgot-password"}}>Voltar</PrevButtonStyle>
        </ContentDiv>
    );
}

const ContentDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    p {
        color: white;
    }
`;

const PrevButtonStyle = styled.button`
    background-color: transparent;
    font-size: 18px;
    font-weight: bold;
    color: white;
    padding: 10px;
    margin-top: 10px;
    &:hover {
        color: ${({ theme }) => theme.colors.primary};
    }
`;

const ConfirmationTitle = styled.h2`
    color: ${({ theme }) => theme.colors.primary};
    font-size: 25px;
    text-align: center;
    padding-bottom: 20px;
`;