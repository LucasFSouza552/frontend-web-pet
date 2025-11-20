import ErrorContainer from "@components/ErrorContainer";
import { HeaderComponent } from "@components/HeaderComponent";
import Section from "@styles/SectionStyle";
import { useForgotPasswordController } from "@features/account/auth/controllers/useForgotPasswordController";
import ReceivedScreen from "@features/account/forgotPassword/components/Received";
import RecoveryPasswordForm from "@features/account/forgotPassword/components/SendForm";
import styled from "styled-components";

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
        </SectionForgotPassword>
    );
}

const SectionForgotPassword = styled(Section)`
    background: radial-gradient(circle at top left, rgba(255, 255, 255, 0.08), transparent 45%),
        radial-gradient(circle at 20% 80%, rgba(230, 74, 170, 0.4), transparent 50%),
        linear-gradient(180deg, #0e0a12 0%, #1a1120 60%, #120915 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
`;

const ContentDiv = styled.div`
    width: min(1100px, 92vw);
    background: rgba(11, 7, 13, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
    border-radius: 32px;
    padding: 40px;
    display: flex;
    gap: 32px;
    position: relative;
    overflow: hidden;
`;

const HeroPanel = styled.div`
    flex: 1;
    padding: 20px;
    border-radius: 24px;
    background: linear-gradient(160deg, rgba(217, 144, 255, 0.12), rgba(255, 255, 255, 0.05));
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const Badge = styled.div`
    align-self: flex-start;
    padding: 6px 16px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.25);
    font-size: 12px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #f0e8ff;
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
    background: linear-gradient(180deg, #e5a1ff, #b648a0);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    color: #1e0416;
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
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.04);
    display: flex;
    flex-direction: column;
    justify-content: center;
`;