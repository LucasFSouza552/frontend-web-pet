import { styled } from "styled-components";
import Section from "../../../shared/styles/SectionStyle";
import { useState } from "react";

const faqs = [
    { question: "Como funciona o processo de adoção?", answer: "Basta criar uma conta, escolher o animal que deseja adotar e preencher o formulário de interesse. Nossa equipe entrará em contato para validar as informações e agendar uma visita." },
    { question: "Há algum custo para adotar?", answer: "Não! A adoção é gratuita. Porém, pedimos uma pequena contribuição opcional para ajudar a manter o projeto e cuidar de outros animais." },
    { question: "Como posso ajudar sem adotar?", answer: "Você pode contribuir com doações de ração, medicamentos, itens de limpeza ou apoio financeiro. Toda ajuda faz diferença" },
    { question: "Posso visitar os animais antes da adoção?", answer: "Sim! Agende uma visita presencial para conhecer os animais disponíveis e conversar com nossa equipe de voluntários." },
    { question: "Como entro em contato com o suporte?", answer: "Você pode enviar uma mensagem pelo formulário abaixo ou entrar em contato via e-mail e WhatsApp. Nossa equipe responde em até 24h úteis." }
];

export default function FAQList() {
    const [actualIndex, setActualIndex] = useState<number | null>(null);

    return (
        <Section height="auto">
            <FormContainer>
                <UnorderedList>
                    {faqs.map((faqs, index) => (
                        <ListItem
                            onClick={() => setActualIndex(actualIndex == index ? null : index)}>
                            <ListItemTitle>{faqs.question}</ListItemTitle>
                            {actualIndex == index && <Paragraph>{faqs.answer}</Paragraph>}
                        </ListItem>
                    ))}
                </UnorderedList>
            </FormContainer>
        </Section>
    );
}

const UnorderedList = styled.ul`
    display: flex;
    flex-direction: column;
    max-width: 800px;
    color: white;
    align-items: center;
`;

const Paragraph = styled.p`
    width: 500px;
    background-color: #61475C;
    border-radius: 0 0 15px 15px;
    padding: 20px
`;

const FormContainer = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    margin-bottom: 50px;
`;

const ListItem = styled.li`
    padding: 5px;
`;

const ListItemTitle = styled.h3`
    user-select: none;
    width: 500px;
    cursor: pointer;
    background-color: #B648A0;
    border-radius: 15px 15px 0 0;
    padding: 10px;
`;