import IntroSection from "../components/IntroSection";
import FeaturesSection from "../components/FeaturesSection";
import { HeaderComponent } from "@components/HeaderComponent";
import styled from "styled-components";
import FooterSection from "../components/FooterSection";
import Assessment from "../components/Assessment";
import GallerySection from "../components/GallerySection";
import { ProfileContext } from "@contexts/ProfileContext";
import { useContext } from "react";

export default function HomeSection() {

  const { account } = useContext(ProfileContext);
  
  return (
    <Container>
      <HeaderComponent account={account} />
      <MainFlex>
        <IntroSection />
        <FeaturesSection />
        <GallerySection />
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
