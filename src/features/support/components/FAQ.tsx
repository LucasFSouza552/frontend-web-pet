import styled from "styled-components";
import Section from "@styles/SectionStyle";
import FAQList from "./FAQList";

export default function FAQ() {
  return (
    <Section height="auto">
      <FAQHeader>
        <Title>Dúvidas Frequentes</Title>
        <Subtitle>Encontre respostas para as perguntas mais comuns</Subtitle>
      </FAQHeader>
      <FAQList />
    </Section>
  );
}

const FAQHeader = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  margin: 25px 0;
  color: white;
`;

const Title = styled.h1`
  font-family: "Sacramento", cursive;
  color: #b648a0;
  font-size: 5.3rem;
  margin-top: 20px;
`;

const Subtitle = styled.h4`
  color: #332630;
`;