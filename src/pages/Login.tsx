import styled from "styled-components";
import { HeaderComponent } from "../components/Header";
import Section from "../styles/SectionStyle";
import LoginForm from "../components/LoginForm";

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
    gap: 5px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

