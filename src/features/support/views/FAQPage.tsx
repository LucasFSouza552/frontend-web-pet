import styled from "styled-components";
import { HeaderComponent } from "../../../shared/components/HeaderComponent";
import FAQ from "../components/FAQ";
import FooterSection from "../../home/components/FooterSection";
import { AuthContext } from "../../auth/AuthContext";
import { useContext } from "react";

export default function FAQSection() {
    const { account } = useContext(AuthContext);
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