import styled, { keyframes } from "styled-components";
import Section from "@styles/SectionStyle";
import { useState } from "react";

const faqs = [
  {
    question: "Como funciona o processo de adoção?",
    answer:
      "Basta criar uma conta, escolher o animal que deseja adotar e preencher o formulário de interesse. Nossa equipe entrará em contato para validar as informações e agendar uma visita.",
  },
  {
    question: "Há algum custo para adotar?",
    answer:
      "Não! A adoção é gratuita. Porém, pedimos uma pequena contribuição opcional para ajudar a manter o projeto e cuidar de outros animais.",
  },
  {
    question: "Como posso ajudar sem adotar?",
    answer:
      "Você pode contribuir com doações de ração, medicamentos, itens de limpeza ou apoio financeiro. Toda ajuda faz diferença.",
  },
  {
    question: "Posso visitar os animais antes da adoção?",
    answer:
      "Sim! Agende uma visita presencial para conhecer os animais disponíveis e conversar com nossa equipe de voluntários.",
  },
  {
    question: "Como entro em contato com o suporte?",
    answer:
      "Você pode enviar uma mensagem pelo formulário abaixo ou entrar em contato via e-mail e WhatsApp. Nossa equipe responde em até 24h úteis.",
  },
  {
    question: "O que preciso levar no dia da adoção?",
    answer:
      "Leve um documento com foto, comprovante de residência e, se possível, uma caixa de transporte para o animal. Nossa equipe ajudará com todo o processo.",
  },
  {
    question: "Posso devolver o animal depois da adoção?",
    answer:
      "Não incentivamos a devolução, mas entendemos que imprevistos acontecem. Caso precise, entre em contato conosco para analisarmos juntos a melhor solução para o bem-estar do animal.",
  },
  {
    question: "Os animais já estão vacinados e castrados?",
    answer:
      "Sim! Todos os animais disponíveis para adoção passam por um processo de avaliação veterinária, vacinação, vermifugação e castração antes de irem para um novo lar.",
  },
  {
    question: "Posso adotar mais de um animal?",
    answer:
      "Sim, desde que o ambiente seja adequado e a equipe de adoção aprove a estrutura para receber mais de um pet. O importante é garantir o bem-estar de todos.",
  },
  {
    question: "O site é seguro para doações?",
    answer:
      "Sim! Utilizamos plataformas confiáveis e protegidas para processar doações, garantindo segurança e transparência em cada contribuição.",
  },
];

export default function FAQList() {
  const [actualIndex, setActualIndex] = useState<number | null>(null);

  return (
    <Section height="auto">
      <FormContainer>
        <UnorderedList>
          {faqs.map((faqs, index) => (
            <ListItem
              key={index}
              onClick={() => setActualIndex(actualIndex === index ? null : index)}
            >
              <ListItemTitle>{faqs.question}</ListItemTitle>
              {actualIndex === index && <Paragraph>{faqs.answer}</Paragraph>}
            </ListItem>
          ))}
        </UnorderedList>
      </FormContainer>
    </Section>
  );
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const UnorderedList = styled.ul`
  display: flex;
  flex-direction: column;
  max-width: 800px;
  color: white;
  align-items: center;
  gap: 15px;
  margin-top: 40px;
`;

const Paragraph = styled.p`
  width: 700px;
  background-color: #61475c;
  border-radius: 0 0 15px 15px;
  padding: 20px;
  font-size: 15px;
  line-height: 1.5;
  animation: ${fadeIn} 0.3s ease;
`;

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 60px;
`;

const ListItem = styled.li`
  padding: 0;
  width: 100%;
  list-style: none;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.01);
  }
`;

const ListItemTitle = styled.h3`
  user-select: none;
  width: 700px;
  text-align: center;
  cursor: pointer;
  background-color: #b648a0;
  border-radius: 15px 15px 0 0;
  padding: 15px 20px;
  font-size: 1.1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ca5db6;
  }
`;
