import { CardContainer, CardDescription, CardTitle, IconWrapper } from "./styles";

export function FeatureCard({ icon, title, description }: any) {
  return (
    <CardContainer>
      <IconWrapper>{icon}</IconWrapper>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardContainer>
  );
}