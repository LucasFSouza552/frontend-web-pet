import styled from 'styled-components';
import { FaHome, FaHandHoldingHeart, FaSearchLocation } from 'react-icons/fa';
import { FeatureCard } from '../../components/FeatureCard';

const SectionContainer = styled.section`
  background-color: #3C3C3C;
  padding: 60px 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 40px;
`;

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
    <SectionContainer>
      {featuresData.map((feature, index) => (
        <FeatureCard
          key={index}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </SectionContainer>
  );
}