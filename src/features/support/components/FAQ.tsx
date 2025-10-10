import styled from "styled-components";
import Section from "../../../shared/styles/SectionStyle";
import FAQList from "./FAQList";

export default function FAQ() {
    return (
        <Section height="auto">
            <FAQTitleDiv>
                <Title>Dúvidas Frequentes</Title>
                <Subtitle>Encontre respostas para as perguntas mais comuns.</Subtitle>
            </FAQTitleDiv>
            <FAQList />
        </Section>
    )
}

const Title = styled.h1`
    font-family: "Sacramento";
    color: #B648A0;
    font-size: 5.3rem;
    margin-top: 20px
`;

const Subtitle = styled.h4`
    color: #332630;
`;

const FAQTitleDiv = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
    margin: 25px 0 25px 0;
    color: white;
`;