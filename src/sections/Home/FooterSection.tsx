import React from "react";
import styled from "styled-components";


export default function DuvidasSection() {
  return (
    <Section>
      <Title>DUVIDAS?</Title>
      <Description>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis feugiat
        lacinia felis ac pulvinar. Cras commodo velit non tortor faucibus tempus
        eu elementum orci. Sed eu volutpat est. Etiam mattis venenatis neque, sed
        venenatis enim. Phasellus euismod tincidunt sapien eu scelerisque.
        Suspendisse et nunc porta, blandit lectus et, ornare massa.
      </Description>
      <Button>TIRAR DÚVIDAS</Button>

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
    </Section>
  );
}

const Section = styled.section`
  background-color: #2d2a2f; 
  color: #fff;
  text-align: center;
  padding: 80px 20px 0 20px;
  position: relative;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Description = styled.p`
  max-width: 600px;
  margin: 0 auto 40px auto;
  line-height: 1.6;
  color: #e0e0e0;
`;

const Button = styled.button`
  border: 2px solid #b14ebf;
  background: transparent;
  color: #b14ebf;
  padding: 10px 25px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #b14ebf;
    color: #fff;
  }
`;

const FooterCurve = styled.div`
  background-color: #b14ebf; /* cor roxa */
  height: 150px;
  border-top-left-radius: 50% 20%;
  border-top-right-radius: 50% 20%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-top: 40px;
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
