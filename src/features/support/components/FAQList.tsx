import styled, { keyframes } from "styled-components";
import Section from "../../../shared/styles/SectionStyle";

export default function FAQList() {
  return (
    <Section height="auto">
      <ListContainer>
        {faqItems.map(({ id, title, text }, index) => (
          <Card key={id} $delay={index * 0.15}>
            <Question>{title}</Question>
            <Answer>{text}</Answer>
          </Card>
        ))}
      </ListContainer>
    </Section>
  );
}

const faqItems = [
  {
    id: 1,
    title: "Como funciona o processo de adoção?",
    text: `Basta criar uma conta, escolher o animal que deseja adotar e preencher 
           o formulário de interesse. Nossa equipe entrará em contato para validar 
           as informações e agendar uma visita.`,
  },
  {
    id: 2,
    title: "Há algum custo para adotar?",
    text: `Não! A adoção é gratuita. Porém, pedimos uma pequena contribuição opcional 
           para ajudar a manter o projeto e cuidar de outros animais.`,
  },
  {
    id: 3,
    title: "Como posso ajudar sem adotar?",
    text: `Você pode contribuir com doações de ração, medicamentos, itens de limpeza 
           ou apoio financeiro. Toda ajuda faz diferença.`,
  },
  {
    id: 4,
    title: "Posso visitar os animais antes da adoção?",
    text: `Sim! Agende uma visita presencial para conhecer os animais disponíveis e 
           conversar com nossa equipe de voluntários.`,
  },
  {
    id: 5,
    title: "Como entro em contato com o suporte?",
    text: `Você pode enviar uma mensagem pelo formulário abaixo ou entrar em contato 
           via e-mail e WhatsApp. Nossa equipe responde em até 24h úteis.`,
  },
];

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ListContainer = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
  padding: 50px 40px;
  margin: 50px 180px;
  background: linear-gradient(145deg, #61475c 0%, #4a344a 100%);
  border-radius: 40px;
  color: white;
  box-shadow: inset 0 0 25px rgba(0, 0, 0, 0.25);
`;

const Card = styled.li<{ $delay: number }>`
  width: 100%;
  max-width: 800px;
  background-color: #332630;
  border-radius: 18px;
  padding: 25px 30px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.25);
  transition: all 0.3s ease;
  opacity: 0;
  animation: ${fadeUp} 0.8s ease-out forwards;
  animation-delay: ${({ $delay }) => $delay}s;

  &:hover {
    transform: translateY(-4px) scale(1.02);
    background-color: #3c2b39;
    box-shadow: 0 8px 18px rgba(182, 72, 160, 0.35);
  }
`;

const Question = styled.h3`
  color: #b648a0;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
`;

const Answer = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #f3f3f3;
`;