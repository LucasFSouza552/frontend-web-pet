import styled from "styled-components";
import Section from "../../../shared/styles/SectionStyle";
import FAQList from "./FAQList";

export default function FAQSection() {
    return (
        <Section>
            <FAQTitleDiv>
                <Title>Dúvidas Frequentes</Title>
                <h4>Encontre respostas para as perguntas mais comuns.</h4>
            </FAQTitleDiv>
            <FAQList />
        </Section>
    )
}

const Title = styled.h1`
    font-family: "Sacramento";
    font-size: 50px;
`;

const FAQTitleDiv = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
    margin: 10% 0 3%;
    color: ${({ theme }) => theme.colors.text};
`;