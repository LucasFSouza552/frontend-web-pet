import ErrorContainer from "@components/ErrorContainer";
import { HeaderComponent } from "@components/HeaderComponent";
import Section from "@styles/SectionStyle";
import { useForgotPasswordController } from "@features/account/auth/controllers/useForgotPasswordController";
import ReceivedScreen from "@features/account/forgotPassword/components/Received";
import RecoveryPasswordForm from "@features/account/forgotPassword/components/SendForm";
import styled from "styled-components";
import backgroundPage from "@assets/images/background-page.jpg";

const steps = [
    {
        title: "Solicite o link",
        description: "Envie o e-mail cadastrado para receber o link de redefinição.",
    },
    {
        title: "Confira a caixa de entrada",
        description: "O e-mail chega rapidinho com instruções claras.",
    },
    {
        title: "Defina uma nova senha segura",
        description: "Use combinação única e proteja seu perfil.",
    },
];

export default function ForgotPasswordPage() {
    const { email, handleChange, handleSubmit, error, actualStep } = useForgotPasswordController();
    return (
        <SectionForgotPassword height="auto">
            <HeaderComponent />
            <MainFlex>
            <ContentDiv>
                <HeroPanel>
                    <Badge>Segurança em primeiro lugar</Badge>
                    <HeroTitle>Esqueci minha senha</HeroTitle>
                    <HeroText>
                        Crie uma nova senha em poucos minutos.
                        Basta informar o e-mail associado à conta e seguir o link seguro que enviaremos.
                    </HeroText>
                    <StepList>
                        {steps.map((step, index) => (
                            <StepItem key={step.title}>
                                <StepDot>{index + 1}</StepDot>
                                <StepCopy>
                                    <strong>{step.title}</strong>
                                    <span>{step.description}</span>
                                </StepCopy>
                            </StepItem>
                        ))}
                    </StepList>
                </HeroPanel>
                <FormPanel>
                    {error && <ErrorContainer message={error} />}
                    {actualStep == 1 && (
                        <RecoveryPasswordForm email={email} handleChange={handleChange} handleSubmit={handleSubmit} />
                    )}
                    {actualStep == 2 && <ReceivedScreen />}
                </FormPanel>
            </ContentDiv>
            </MainFlex>
        </SectionForgotPassword>
    );
}

const SectionForgotPassword = styled(Section)`
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