import styled from "styled-components";
import { HeaderComponent } from "../../../shared/components/HeaderComponent";
import FAQ from "../components/FAQ";
import FooterSection from "../../home/components/FooterSection";

export default function FAQSection() {
    return (
        <Container>
            <HeaderComponent />
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