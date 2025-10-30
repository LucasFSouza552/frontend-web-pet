import styled from "styled-components";
import { Link } from "react-router-dom";
import Section from "../../../shared/styles/SectionStyle";

import useLoginController from "../controllers/useLoginController";
import { InputComponent } from "../../../shared/components/InputComponent";
import ErrorContainer from "../../../shared/components/ErrorContainer";
import { PrimaryButton } from "../../../shared/components/PrimaryButton";

export default function AuthForm() {
  const { credentials, error, handleChange, handleLogin } = useLoginController();

  return (
    <Section height={"100dvh - var(--header-height)"}>
      <OndaBackground />
      <Wrapper>
        <FormContainer onSubmit={handleLogin}>
          <h2>Entrar</h2>
          <p>Digite seu email e senha para continuar</p>

          <InputComponent
            placeholder="Email"
            label="email"
            onChange={handleChange}
            value={credentials.email}
            type="email"
          />

          <InputComponent
            placeholder="Senha"
            label="password"
            onChange={handleChange}
            value={credentials.password}
            type="password"
          />

          <PrimaryButton
            text="Entrar"
            type="submit"
            filled
            width="100%"
            height="45px"
          />

          <SmallText>
            Não tem conta? <Link to="/register">Clique aqui</Link></SmallText>
        </FormContainer>

        <ErrorContainer message={error} />
      </Wrapper>
    </Section>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: calc(100dvh - 80px);
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 15px;
  justify-content: center;
  align-items: center;
`;

const OndaBackground = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 45vh;
  background-color: #b84ba0;
  border-top-left-radius: 60% 25%;
  border-top-right-radius: 60% 25%;
`;

const FormContainer = styled.form`
  position: relative;
  z-index: 2;
  background-color: #2d282e;
  color: #fff;
  border-radius: 6px;
  padding: 40px 60px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.25);

  h2 {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 5px;
  }

  p {
    font-size: 14px;
    color: #e5e5e5;
    margin-bottom: 10px;
  }
`;

const SmallText = styled.p`
  font-size: 13px;
  color: #ccc;
  margin-top: 5px;

  a {
    color: #ffffff;
    text-decoration: underline;
    cursor: pointer;

    &:hover {
      color: #eaa7e2;
    }
  }
`;
