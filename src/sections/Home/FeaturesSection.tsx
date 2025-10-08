import styled from 'styled-components';
import { FaHome, FaHandHoldingHeart, FaSearchLocation } from 'react-icons/fa';
import Section from '../../shared/styles/SectionStyle';
import { FeatureCard } from '../../shared/components/FeatureCard';

const featuresData = [
  {
    icon: <FaHome />,
    title: 'Adote seu novo amigo',
    description: 'Adotando um novo amigo fará a diferença na sua vida e na dele.',
  },
  {
    icon: <FaHandHoldingHeart />,
    title: 'Faça Doações',
    description: 'Ajude a nossa plataforma a crescer através de doações.',
  },
  {
    icon: <FaSearchLocation />,
    title: 'Encontre Agora',
    description: 'Encontrar e ajudar animais pode transformar vidas.',
  },
  {
    icon: <FaHome />,
    title: 'Encontre Agora',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis feugiat lacinia felis ac pulvinar.',
  }
];

export default function FeaturesSection() {
  return (
    <Section height="auto">
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
    </Section>
  );
}

const Container = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.colors.secondary};
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  width: 100%;
`;

const GridContainer = styled.div`
  display: flex;
  background-color: #1b1b1b;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  padding: 50px;
`;