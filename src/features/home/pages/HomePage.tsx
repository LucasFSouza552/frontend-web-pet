import IntroSection from "../components/IntroSection";
import FeaturesSection from "../components/FeaturesSection";
import { HeaderComponent } from "../../../shared/components/HeaderComponent";
import styled from "styled-components";
import FooterSection from "../components/FooterSection";
import Assessment from "../components/Assessment";

export default function HomeSection() {
  return (
    <Container>
      <HeaderComponent />
      <MainFlex>
        <IntroSection />
        <FeaturesSection />
        <Assessment />
        <FooterSection />
      </MainFlex>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainFlex = styled.main`
  flex: 1;
`;
