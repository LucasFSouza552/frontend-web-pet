import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import { useRegisterController } from "../controllers/useRegisterController";
import { useState } from "react";

export default function RegisterForm() {
  const { data, handleChange, handleSubmit } = useRegisterController();
  const [focusField, setFocusField] = useState<string | null>(null);

  return (
    <Wrapper>
      <Title>Vamos personalizar sua experiência</Title>
      <FormContainer onSubmit={handleSubmit}>
        <FormTitle>Informações básicas</FormTitle>

        <InputGrid>
          <FloatingInput>
            <input
              name="firstName"
              placeholder=" "
              value={data.firstName}
              onChange={handleChange}
              onFocus={() => setFocusField("firstName")}
              onBlur={() => setFocusField(null)}
              required
            />
            <label>Primeiro nome</label>
          </FloatingInput>

          <FloatingInput>
            <input
              name="lastName"
              placeholder=" "
              value={data.lastName}
              onChange={handleChange}
              onFocus={() => setFocusField("lastName")}
              onBlur={() => setFocusField(null)}
              required
            />
            <label>Sobrenome</label>
          </FloatingInput>
        </InputGrid>

        <FloatingInput fullWidth>
          <input
            name="email"
            type="email"
            placeholder=" "
            value={data.email}
            onChange={handleChange}
            onFocus={() => setFocusField("email")}
            onBlur={() => setFocusField(null)}
            required
          />
          <label>E-mail</label>
        </FloatingInput>

        <FloatingInput fullWidth>
          <input
            name="address"
            placeholder=" "
            value={data.address}
            onChange={handleChange}
            onFocus={() => setFocusField("address")}
            onBlur={() => setFocusField(null)}
            required
          />
          <label>Endereço</label>
        </FloatingInput>

        <FloatingInput fullWidth>
          <input
            name="password"
            type="password"
            placeholder=" "
            value={data.password}
            onChange={handleChange}
            onFocus={() => setFocusField("password")}
            onBlur={() => setFocusField(null)}
            required
          />
          <label>Crie uma senha</label>
        </FloatingInput>

        <PrimaryButton type="submit">Próximo</PrimaryButton>

        <SmallText>
          Já tem uma conta? <Link to="/login">Clique aqui!</Link>
        </SmallText>
      </FormContainer>
    </Wrapper>
  );
}

const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(20px);}
  100% { opacity: 1; transform: translateY(0);}
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeInUp} 0.8s ease forwards;
`;

const Title = styled.h2`
  color: #f0eafc;
  font-weight: 400;
  font-size: 1.4rem;
  margin-bottom: 40px;
  text-align: center;
`;

const FormContainer = styled.form`
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid #d946ef;
  border-radius: 25px;
  padding: 45px;
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  box-shadow: 0 0 25px rgba(217, 70, 239, 0.25);
  backdrop-filter: blur(10px);
  animation: ${fadeInUp} 1s ease forwards;
`;

const FormTitle = styled.h3`
  text-align: center;
  font-weight: 500;
  font-size: 1.7rem;
  color: #f0eafc;
  margin-bottom: 20px;
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  width: 100%;
`;

const FloatingInput = styled.div<{ fullWidth?: boolean }>`
  position: relative;
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "100%")};

  input {
    width: 100%;
    padding: 14px 10px;
    background-color: transparent;
    border: none;
    border-bottom: 2px solid #c8a2c8;
    color: #f0eafc;
    font-size: 1rem;
    outline: none;
    transition: all 0.3s ease;

    &:focus {
      border-bottom-color: #d946ef;
    }

    &:focus + label,
    &:not(:placeholder-shown) + label {
      top: -12px;
      font-size: 0.8rem;
      color: #d946ef;
    }
  }

  label {
    position: absolute;
    left: 10px;
    top: 14px;
    color: #d8bfd8;
    font-size: 1rem;
    pointer-events: none;
    transition: all 0.3s ease;
  }
`;

const PrimaryButton = styled.button`
  background: linear-gradient(135deg, #d946ef, #c735de);
  color: white;
  border: none;
  border-radius: 15px;
  padding: 14px 50px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  box-shadow: 0 6px 15px rgba(217, 70, 239, 0.35);

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 25px rgba(217, 70, 239, 0.5);
  }
`;

const SmallText = styled.p`
  font-size: 0.9rem;
  color: #d8bfd8;
  text-align: center;

  a {
    color: #f0eafc;
    text-decoration: underline;
    font-weight: bold;
    transition: color 0.3s;

    &:hover {
      color: #d946ef;
    }
  }
`;
