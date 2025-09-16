import styled from "styled-components";
import { HeaderComponent } from "../components/HeaderComponent";
import LoginForm from "../components/LoginForm";
import Section from "../styles/SectionStyle";

export default function LoginSection() {
    return (
        <Section>
            <HeaderComponent />
            <Container>
                <LoginForm />
            </Container>
        </Section>
    );
}

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

