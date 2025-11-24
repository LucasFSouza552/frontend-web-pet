import ErrorContainer from "@components/ErrorContainer";
import { HeaderComponent } from "@components/HeaderComponent";
import Section from "@styles/SectionStyle";
import { useResetPasswordController } from "@features/account/auth/controllers/useResetPasswordController";
import ResetPasswordForm from "@features/account/forgotPassword/components/ResetPasswordForm";
import styled from "styled-components";
import backgroundPage from "@assets/images/background-page.jpg";

export default function ResetPasswordPage() {
    const {
        password,
        confirmPassword,
        error,
        loading,
        success,
        handlePasswordChange,
        handleConfirmPasswordChange,
        handleSubmit,
    } = useResetPasswordController();

    return (
        <SectionResetPassword height="auto">
            <HeaderComponent />
            <MainFlex>
                <ContentDiv>
                    <HeroPanel>
                        <Badge>Segurança em primeiro lugar</Badge>
                        <HeroTitle>Redefinir senha</HeroTitle>
                        <HeroText>
                            Crie uma nova senha segura para acessar sua conta.
                            Certifique-se de escolher uma combinação única e difícil de adivinhar.
                        </HeroText>
                        <StepList>
                            <StepItem>
                                <StepDot>1</StepDot>
                                <StepCopy>
                                    <strong>Digite sua nova senha</strong>
                                    <span>Mínimo de 6 caracteres para maior segurança.</span>
                                </StepCopy>
                            </StepItem>
                            <StepItem>
                                <StepDot>2</StepDot>
                                <StepCopy>
                                    <strong>Confirme a senha</strong>
                                    <span>Certifique-se de que ambas as senhas coincidem.</span>
                                </StepCopy>
                            </StepItem>
                            <StepItem>
                                <StepDot>3</StepDot>
                                <StepCopy>
                                    <strong>Pronto!</strong>
                                    <span>Faça login com sua nova senha.</span>
                                </StepCopy>
                            </StepItem>
                        </StepList>
                    </HeroPanel>
                    <FormPanel>
                        {error && <ErrorContainer message={error} />}
                        <ResetPasswordForm
                            password={password}
                            confirmPassword={confirmPassword}
                            error={error}
                            loading={loading}
                            success={success}
                            handlePasswordChange={handlePasswordChange}
                            handleConfirmPasswordChange={handleConfirmPasswordChange}
                            handleSubmit={handleSubmit}
                        />
                    </FormPanel>
                </ContentDiv>
            </MainFlex>
        </SectionResetPassword>
    );
}

const SectionResetPassword = styled(Section)`
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
    width: min(1100px, 92vw);
    background-color: ${({ theme }) => theme.colors.quarternary};
    border: 1px solid ${({ theme }) => theme.colors.primary};
    box-shadow: 0 4px 16px rgba(182, 72, 160, 0.25);
    border-radius: 12px;
    padding: 40px;
    display: flex;
    gap: 32px;
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;

    &:hover {
        box-shadow: 0 6px 24px rgba(182, 72, 160, 0.35);
    }

    @media (max-width: 1024px) {
        width: 92vw;
        padding: 1.5rem;
        gap: 1.5rem;
    }

    @media (max-width: 768px) {
        padding: 1rem;
        gap: 1rem;
        border-radius: 8px;
    }
`;

const HeroPanel = styled.div`
    flex: 1;
    padding: 20px;
    border-radius: 12px;
    background-color: ${({ theme }) => theme.colors.quarternary};
    border: 1px solid ${({ theme }) => theme.colors.primary};
    display: flex;
    flex-direction: column;
    gap: 20px;
    backdrop-filter: blur(10px);
`;

const Badge = styled.div`
    align-self: flex-start;
    padding: 6px 16px;
    border-radius: 999px;
    border: 1px solid ${({ theme }) => theme.colors.primary};
    font-size: 12px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.bg};
    background-color: ${({ theme }) => theme.colors.primary};
`;

const HeroTitle = styled.h1`
    font-size: 46px;
    margin: 0;
    color: #fff;
`;

const HeroText = styled.p`
    margin: 0;
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.6;
`;

const StepList = styled.ul`
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const StepItem = styled.li`
    display: flex;
    gap: 12px;
    align-items: flex-start;
`;

const StepDot = styled.span`
    width: 32px;
    height: 32px;
    background: ${({ theme }) => theme.colors.primary || "#B648A0"};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    color: white;
`;

const StepCopy = styled.div`
    display: flex;
    flex-direction: column;
    color: rgba(255, 255, 255, 0.9);

    span {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.65);
    }
`;

const FormPanel = styled.div`
    flex: 1;
    padding: 20px;
    border-radius: 12px;
    background-color: ${({ theme }) => theme.colors.quarternary};
    border: 1px solid ${({ theme }) => theme.colors.primary};
    display: flex;
    flex-direction: column;
    justify-content: center;
    backdrop-filter: blur(10px);
`;

