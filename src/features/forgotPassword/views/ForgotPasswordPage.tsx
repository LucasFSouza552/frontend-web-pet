import ErrorContainer from "../../../shared/components/ErrorContainer";
import { HeaderComponent } from "../../../shared/components/HeaderComponent";
import Section from "../../../shared/styles/SectionStyle";
import { useForgotPasswordController } from "../../auth/controllers/useForgotPasswordController";
import Step2 from "../components/Received";
import RecoveryPasswordForm from "../components/SendForm";
import styled from "styled-components";

export default function ForgotPasswordPage() {
    const { email, handleChange, handleSubmit, error, actualStep } = useForgotPasswordController();
    return (
        <SectionForgotPassword height="auto">
            <HeaderComponent />
            <ContentDiv>
                {actualStep == 1 && <RecoveryPasswordForm email={email} handleChange={handleChange} handleSubmit={handleSubmit} />}
                {actualStep == 2 && <Step2 />}
                {error && <ErrorContainer message={error} />}
            </ContentDiv>
        </SectionForgotPassword>
    );
}

const SectionForgotPassword = styled(Section)`
    display: flex;
    align-items: center;
`;

const ContentDiv = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 100px;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.quarternary};
    filter: drop-shadow(6px 5px 24px #000000);
    width: 40%;
    margin: 150px;
    border-radius: 30px;
`;