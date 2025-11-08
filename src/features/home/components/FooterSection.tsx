import styled from "styled-components";
import Section from "../../../shared/styles/SectionStyle";
import { PrimaryButton } from "../../../shared/components/PrimaryButton";

export default function FooterSection() {
  return (
    <Section height="70dvh">
      <FooterContainer>
        <ContentQuestions>
          <Title>Dúvidas?</Title>
          <Description>
            Tem alguma pergunta? Estamos aqui para ajudar!
            Nossa equipe está pronta para esclarecer qualquer dúvida sobre adoções, doações ou uso da plataforma.
            Entre em contato e teremos prazer em orientar você em cada passo.
          </Description>
          <PrimaryButton text="TIRAR DÚVIDAS" filled={false} width="200px" height="50px"  />
        </ContentQuestions>
        <FooterCurve>
          <FooterColumn>
            <FooterTitle>Institucional</FooterTitle>
            <FooterLink href="#">Sobre</FooterLink>
            <FooterLink href="#">Unidade</FooterLink>
            <FooterLink href="#">FAQ</FooterLink>
            <FooterLink href="#">Histórias</FooterLink>
          </FooterColumn>

          <FooterColumn>
            <FooterTitle>Como ajudar?</FooterTitle>
            <FooterLink href="#">Quero adotar</FooterLink>
            <FooterLink href="#">Quero doar</FooterLink>
          </FooterColumn>
        </FooterCurve>
      </FooterContainer>
    </Section>
  );
}

const ContentQuestions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const FooterContainer = styled.div`
  display: flex;
  align-items: center;
  flex:1;
  overflow: hidden;
  justify-content: space-between;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.secondary};
  padding-top: 40px;
`;

const Title = styled.h2`
  font-size: 3.8rem;
  font-weight: lighter;
  margin-bottom: 20px;
  color: white;
`;

const Description = styled.p`
  max-width: 600px;
  margin: 0 auto 40px auto;
  line-height: 1.6;
  color: #e0e0e0;
`;

const FooterCurve = styled.div`
  background-color: ${({ theme }) => theme.colors.primary};
  border-top-left-radius: 50% 20%;
  border-top-right-radius: 50% 20%;
  display: flex;
  width: 100%;
  padding: 40px 0;
  justify-content: space-evenly;
  align-items: center;
  color: #fff;
`;

const FooterColumn = styled.div`
  text-align: left;
`;

const FooterTitle = styled.p`
  font-weight: bold;
  margin-bottom: 10px;
`;

const FooterLink = styled.a`
  display: block;
  color: #fff;
  font-size: 0.9rem;
  margin-bottom: 5px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
