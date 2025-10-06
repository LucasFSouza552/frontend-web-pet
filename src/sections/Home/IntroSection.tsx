import styled from "styled-components";
import girlImg from "../../assets/Women with Cat.png";
import Section from "../../styles/SectionStyle";

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
          <img src={girlImg} />
        </RightDiv>
      </Container>
    </Section>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
`;


const LeftDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;

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
`;
