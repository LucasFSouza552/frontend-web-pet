import styled from "styled-components";
import { HeaderComponent } from "@components/HeaderComponent";
import FAQ from "../components/FAQ";
import FooterSection from "../../home/components/FooterSection";
import { useContext } from "react";
import { ProfileContext } from "@contexts/ProfileContext";

export default function FAQSection() {
    const { account } = useContext(ProfileContext);
    return (
        <Container>
            <HeaderComponent account={account} />
            <Main>
                <FAQ />
            </Main>
            <FooterSection />
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
`;

const Main = styled.main`
    flex: 1;
`;