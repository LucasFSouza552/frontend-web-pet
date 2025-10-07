import styled from 'styled-components';

export function FeatureCard({ icon, title, description }: any) {
  return (
    <CardContainer>
      <IconWrapper>{icon}</IconWrapper>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardContainer>
  );
}

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 220px;
  gap: 10px;
`;

const IconWrapper = styled.div`
  font-size: 50px;
  color: #E02880;
`;

const CardTitle = styled.h3`
  color: #E02880;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  margin: 0;
`;

const CardDescription = styled.p`
  color: #D3D3D3;
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0;
`;
