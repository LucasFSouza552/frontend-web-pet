import styled, { keyframes } from "styled-components";
import {
  FaHome,
  FaHandHoldingHeart,
  FaSearchLocation,
  FaPaw,
} from "react-icons/fa";
import { useEffect, useRef, useState } from "react";

import Section from "@styles/SectionStyle";
import { FeatureCard } from "@components/FeatureCard";

const featuresData = [
  {
    icon: <FaPaw />,
    title: "Adote seu novo amigo",
    description:
      "Adotar é abrir as portas do coração. Dê um lar e receba amor incondicional em troca.",
  },
  {
    icon: <FaHandHoldingHeart />,
    title: "Contribua com Doações",
    description:
      "Sua doação ajuda a salvar vidas e manter nossa causa viva. Cada gesto faz a diferença.",
  },
  {
    icon: <FaSearchLocation />,
    title: "Encontre um Companheiro",
    description:
      "Descubra animais próximos a você e transforme o destino de quem só precisa de uma chance.",
  },
  {
    icon: <FaHome />,
    title: "Transforme Vidas",
    description:
      "Juntos podemos mudar o mundo, um animal de cada vez. Participe dessa jornada de amor e esperança.",
  },
];

export default function FeaturesSection() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <SectionWrapper ref={sectionRef} height="auto" $visible={visible}>
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

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const SectionWrapper = styled(Section)<{ $visible: boolean }>`
  background-color: #2d2a2f;
  padding: 80px 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: visible;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) =>
    $visible ? "translateY(0)" : "translateY(60px)"};
  transition: all 0.8s ease-in-out;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 60px 40px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  animation: ${fadeInUp} 1s ease-in-out;
`;

const GridContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 40px 50px;
  justify-content: center;
  background-color: #2d2a2f;
  border-radius: 12px;
  animation: ${fadeInUp} 1.2s ease-in-out;
`;
