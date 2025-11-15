import ErrorContainer from "@components/ErrorContainer";
import { HeaderComponent } from "@components/HeaderComponent";
import Section from "@styles/SectionStyle";
import { useForgotPasswordController } from "@features/account/auth/controllers/useForgotPasswordController";
import ReceivedScreen from "@features/account/forgotPassword/components/Received";
import RecoveryPasswordForm from "@features/account/forgotPassword/components/SendForm";
import styled from "styled-components";

export default function ForgotPasswordPage() {
    const { email, handleChange, handleSubmit, error, actualStep } = useForgotPasswordController();
    return (
        <SectionForgotPassword height="auto">
            <HeaderComponent />
            <ContentDiv>
                {actualStep == 1 && <RecoveryPasswordForm email={email} handleChange={handleChange} handleSubmit={handleSubmit} />}
                {actualStep == 2 && <ReceivedScreen />}
                {error && <ErrorContainer message={error} />}
            </ContentDiv>
        </SectionForgotPassword>
    );
}

const SectionForgotPassword = styled(Section)`
    display: flex;
    align-items: center;
    background-image: url("/Doodle pet 3.png");
    background-size: 50%;
    background-repeat: no-repeat;
    background-position: bottom right;
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