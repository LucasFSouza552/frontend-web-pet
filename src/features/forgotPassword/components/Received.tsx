import { styled } from "styled-components";

export default function Step2() {
    return (
        <div>
            <h2>Enviamos com sucesso um link!</h2>
            <p>E-mail enviado com sucesso!
                Dê uma olhada na sua caixa de entrada e siga o link para redefinir sua senha.</p>
            <PrevButtonStyle>Voltar</PrevButtonStyle>
        </div>
    );
}

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