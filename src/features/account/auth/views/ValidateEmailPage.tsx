import ErrorContainer from "@components/ErrorContainer";
import { HeaderComponent } from "@components/HeaderComponent";
import Section from "@styles/SectionStyle";
import { useValidateEmailController } from "@features/account/auth/controllers/useValidateEmailController";
import styled from "styled-components";
import backgroundPage from "@assets/images/background-page.jpg";
import { FaCheckCircle, FaEnvelope, FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTheme } from "styled-components";

export default function ValidateEmailPage() {
    const { loading, error, success } = useValidateEmailController();
    const theme = useTheme();

    return (
        <SectionValidateEmail height="auto">
            <HeaderComponent />
            <MainFlex>
                <ContentDiv>
                    <IconCircle>
                        {loading && <FaSpinner size={48} color={theme.colors.primary} className="spinning" />}
                        {success && <FaCheckCircle size={48} color={theme.colors.primary} />}
                        {error && <FaEnvelope size={48} color="#ff4444" />}
                    </IconCircle>
                    {loading && (
                        <>
                            <Title>Validando seu email...</Title>
                            <Description>
                                Aguarde enquanto verificamos seu token de validação.
                            </Description>
                        </>
                    )}
                    {success && (
                        <>
                            <Title>Email validado com sucesso!</Title>
                            <Description>
                                Seu email foi confirmado. Você será redirecionado para a página de login em instantes.
                            </Description>
                            <ActionGroup>
                                <ActionLink to="/login">Ir para login</ActionLink>
                            </ActionGroup>
                        </>
                    )}
                    {error && (
                        <>
                            <Title>Erro ao validar email</Title>
                            <Description>
                                {error}
                            </Description>
                            <ActionGroup>
                                <ActionLink to="/login">Voltar ao login</ActionLink>
                            </ActionGroup>
                        </>
                    )}
                </ContentDiv>
            </MainFlex>
        </SectionValidateEmail>
    );
}

const SectionValidateEmail = styled(Section)`
    background-image: url(${backgroundPage});
    background-size: cover;
    background-position: center;
    background-repeat: repeat;
    background-attachment: fixed;
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
    min-height: 100dvh;
`;

const MainFlex = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ContentDiv = styled.div`
    width: min(600px, 92vw);
    background-color: ${({ theme }) => theme.colors.quarternary};
    border: 1px solid ${({ theme }) => theme.colors.primary};
    box-shadow: 0 4px 16px rgba(182, 72, 160, 0.25);
    border-radius: 12px;
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    text-align: center;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;

    &:hover {
        box-shadow: 0 6px 24px rgba(182, 72, 160, 0.35);
    }

    @media (max-width: 768px) {
        width: 92vw;
        padding: 1.5rem;
    }
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

    .spinning {
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
`;

const Title = styled.h1`
    font-size: 32px;
    margin: 0;
    color: #fff;
`;

const Description = styled.p`
    margin: 0;
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.6;
    max-width: 400px;
`;

const ActionGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    max-width: 300px;
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
    text-align: center;
    transition: transform 0.2s, opacity 0.2s;

    &:hover {
        transform: translateY(-1px);
        opacity: 0.95;
    }
`;

