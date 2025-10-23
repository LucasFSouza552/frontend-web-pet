import styled, { keyframes } from "styled-components";
import WomenImg from "@/shared/assets/images/women-with-cat.png";
import Section from "../../../shared/styles/SectionStyle";

export default function IntroSection() {
  return (
    <Section>
      <Container>
        <LeftDiv>
          <h1>
            <span className="left">Conheça</span>
            <span className="center">seu</span>
            <span className="right">amigo</span>
          </h1>
        </LeftDiv>
        <RightDiv>
          <img src={WomenImg} />
        </RightDiv>
      </Container>
    </Section>
  );
}

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

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  animation: ${fadeUp} 1s ease-out forwards;
`;

const LeftDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  animation: ${fadeUp} 1s ease-out forwards;
  animation-delay: 0.3s;
  opacity: 0; /* começa invisível até a animação iniciar */

  h1 {
    font-family: "Sacramento", cursive;
    width: 40%;
    font-size: 10rem;
    font-weight: 300;
    line-height: 1.2;
    color: ${({ theme }) => theme.colors.text};
  }

  span {
    width: 100%;
    display: flex;
  }

  span.left {
    justify-content: left;
  }

  span.center {
    justify-content: center;
  }

  span.right {
    justify-content: right;
  }
`;

const RightDiv = styled.div`
  display: flex;
  justify-content: flex-end;
  width: auto;
  animation: ${fadeUp} 1s ease-out forwards;
  animation-delay: 0.6s;
  opacity: 0;

  img {
    width: 90%;
    height: auto;
    object-fit: contain;
  }
`;
