import styled from 'styled-components';
import { FaHome, FaHandHoldingHeart, FaSearchLocation } from 'react-icons/fa';
import { FeatureCard } from '../../components/FeatureCard';
import Section from '../../styles/SectionStyle';

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
    <Section>
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
  flex-direction: column;
  width: 100%;
  padding: 10px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  flex-direction: row;
  width: fit-content;
`;