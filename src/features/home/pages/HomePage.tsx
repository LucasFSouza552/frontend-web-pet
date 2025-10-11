import IntroSection from "../components/IntroSection";
import FeaturesSection from "../components/FeaturesSection";
import { HeaderComponent } from "../../../shared/components/HeaderComponent";
import styled from "styled-components";
import FooterSection from "../components/FooterSection";
import Assessment from "../components/Assessment";
import { useContext } from "react";
import { AuthContext } from "../../auth/authContext";

export default function HomeSection() {

  const { account } = useContext(AuthContext);
  return (
    <Container>
      <HeaderComponent account={account} />
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
