import styled from "styled-components";
import { FaHome, FaHandHoldingHeart, FaSearchLocation } from "react-icons/fa";
import Section from "../../../shared/styles/SectionStyle";
import { FeatureCard } from "../../../shared/components/FeatureCard";

const featuresData = [
  {
    icon: <FaHome />,
    title: "Adote seu novo amigo",
    description: "Adotando um novo amigo fará a diferença na sua vida e na dele.",
  },
  {
    icon: <FaHandHoldingHeart />,
    title: "Faça Doações",
    description: "Ajude a nossa plataforma a crescer através de doações.",
  },
  {
    icon: <FaSearchLocation />,
    title: "Encontre Agora",
    description: "Encontrar e ajudar animais pode transformar vidas.",
  },
  {
    icon: <FaHome />,
    title: "Encontre Agora",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis feugiat lacinia felis ac pulvinar.",
  },
];

export default function FeaturesSection() {
  return (
    <SectionWrapper>
      <Container>
        <GridContainer>
          {featuresData.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </GridContainer>
      </Container>
    </SectionWrapper>
  );
}

const SectionWrapper = styled(Section)`
  background-color: #2d2a2f;
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 0; 
  overflow: visible; 
`;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  background-color: #ffffff;
  padding: 40px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
`;

const GridContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
  background-color: #2d2a2f;
  padding: 60px;
  border-radius: 12px;
`;
