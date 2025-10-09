import styled from "styled-components";
import {
  FaHome, FaHandHoldingHeart, FaSearchLocation, FaPaw
} from "react-icons/fa";

import Section from "../../../shared/styles/SectionStyle";
import { FeatureCard } from "../../../shared/components/FeatureCard";

const featuresData = [
  {
    icon: <FaPaw />,
    title: "Adote seu novo amigo",
    description: "Adotar é abrir as portas do coração. Dê um lar e receba amor incondicional em troca.",
  },
  {
    icon: <FaHandHoldingHeart />,
    title: "Contribua com Doações",
    description: "Sua doação ajuda a salvar vidas e manter nossa causa viva. Cada gesto faz a diferença.",
  },
  {
    icon: <FaSearchLocation />,
    title: "Encontre um Companheiro",
    description: "Descubra animais próximos a você e transforme o destino de quem só precisa de uma chance.",
  },
  {
    icon: <FaHome />,
    title: "Transforme Vidas",
    description: "Juntos podemos mudar o mundo, um animal de cada vez. Participe dessa jornada de amor e esperança.",
  }

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
