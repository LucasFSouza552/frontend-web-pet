import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";

import useLoginController from "../controllers/useLoginController";
import Section from "@styles/SectionStyle";
import { InputComponent } from "@components/InputComponent";
import { PrimaryButton } from "@components/PrimaryButton";
import ErrorContainer from "@components/ErrorContainer";

export default function AuthForm() {
  const { credentials, error, handleChange, handleLogin } = useLoginController();

  return (
    <Section height="auto">
      <OndaBackground />
      <Wrapper>
        <FormContainer onSubmit={handleLogin}>
          <h2>Bem-vindo de volta</h2>
          <p>Entre para continuar sua jornada</p>

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
            height="48px"
          />

          <SmallText>
            <div>
              Não tem conta? <Link to="/register">Crie a sua</Link>
            </div>
            <ForgotPasswordText>
              <Link to="/forgot-password">Esqueci minha senha</Link>
            </ForgotPasswordText>
          </SmallText>
        </FormContainer>

        <ErrorContainer message={error} />
      </Wrapper>
    </Section>
  );
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Wrapper = styled.div`
  width: 100%;
  height: calc(100dvh - 80px);
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const OndaBackground = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 50vh;
  background-color: #b84ba0;
  border-top-left-radius: 60% 25%;
  border-top-right-radius: 60% 25%;
  box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.2);
`;

const FormContainer = styled.form`
  position: relative;
  z-index: 2;
  background-color: #2d282e;
  color: #fff;
  border-radius: 10px;
  padding: 50px 70px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.3);
  animation: ${fadeIn} 0.8s ease;

  h2 {
    font-size: 30px;
    font-weight: 700;
    margin-bottom: 8px;
    color: #ffffff;
  }

  p {
    font-size: 15px;
    color: #e2d6e0;
    margin-bottom: 20px;
  }
`;

const SmallText = styled.p`
  font-size: 14px;
  color: white;
  margin-top: 8px;
  display: flex;
  gap: 10px;
  align-items: center;
  flex-direction: column;

  a {
    text-decoration: underline;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: #eaa7e2;
    }
  }
`;

const ForgotPasswordText = styled.p`
  font-size: 13px;
  color: #ffffff;
  
  a {
    color: #a2a2a2;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: #ffffff;
    }
  }
`;
