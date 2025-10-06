import styled from "styled-components";
import { HeaderComponent } from "../../components/Header";
import Section from "../../styles/SectionStyle";
import LoginForm from "../../components/LoginForm";

export default function LoginSection() {
    return (
        <>
            <HeaderComponent />
            <main>
                <LoginForm />
            </main>
        </>
    );
}



