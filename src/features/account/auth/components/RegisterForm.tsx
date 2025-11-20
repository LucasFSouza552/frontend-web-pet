import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import { useRegisterController } from "../controllers/useRegisterController";

export default function RegisterForm() {
  const { data, currentStep, error, loading, handleChange, nextStep, prevStep, handleSubmit } = useRegisterController();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <Wrapper>
      <Title>Vamos personalizar sua experiência</Title>
      <StepIndicator>
        <StepDot $active={currentStep >= 1}>1</StepDot>
        <StepLine $active={currentStep >= 2} />
        <StepDot $active={currentStep >= 2}>2</StepDot>
        <StepLine $active={currentStep >= 3} />
        <StepDot $active={currentStep >= 3}>3</StepDot>
      </StepIndicator>
      
      <FormContainer onSubmit={currentStep === 3 ? handleSubmit : handleNext}>
        {currentStep === 1 && (
          <>
            <FormTitle>Informações básicas</FormTitle>

            <FloatingInput fullWidth>
              <input
                name="firstName"
                placeholder=" "
                value={data.firstName}
                onChange={handleChange}
                required
              />
              <label>Nome</label>
            </FloatingInput>

            <FloatingInput fullWidth>
              <input
                name="cpfCnpj"
                type="text"
                placeholder=" "
                value={data.cpfCnpj}
                onChange={handleChange}
                maxLength={18}
                required
              />
              <label>CPF ou CNPJ</label>
            </FloatingInput>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <PrimaryButton type="submit" disabled={loading}>
              {loading ? 'Carregando...' : 'Próximo'}
            </PrimaryButton>
          </>
        )}

        {currentStep === 2 && (
          <>
            <FormTitle>Contato</FormTitle>

            <FloatingInput fullWidth>
              <input
                name="phone"
                type="text"
                placeholder=" "
                value={data.phone}
                onChange={handleChange}
                maxLength={15}
                required
              />
              <label>Telefone</label>
            </FloatingInput>

            <FloatingInput fullWidth>
              <input
                name="email"
                type="email"
                placeholder=" "
                value={data.email}
                onChange={handleChange}
                required
              />
              <label>E-mail</label>
            </FloatingInput>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <ButtonContainer>
              <SecondaryButton type="button" onClick={prevStep} disabled={loading}>
                Voltar
              </SecondaryButton>
              <PrimaryButton type="submit" disabled={loading}>
                {loading ? 'Carregando...' : 'Próximo'}
              </PrimaryButton>
            </ButtonContainer>
          </>
        )}

        {currentStep === 3 && (
          <>
            <FormTitle>Segurança</FormTitle>

            <FloatingInput fullWidth>
              <input
                name="password"
                type="password"
                placeholder=" "
                value={data.password}
                onChange={handleChange}
                required
              />
              <label>Crie uma senha</label>
            </FloatingInput>

            <FloatingInput fullWidth>
              <input
                name="confirmPassword"
                type="password"
                placeholder=" "
                value={data.confirmPassword}
                onChange={handleChange}
                required
              />
              <label>Confirme sua senha</label>
            </FloatingInput>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <ButtonContainer>
              <SecondaryButton type="button" onClick={prevStep} disabled={loading}>
                Voltar
              </SecondaryButton>
              <PrimaryButton type="submit" disabled={loading}>
                {loading ? 'Criando conta...' : 'Criar conta'}
              </PrimaryButton>
            </ButtonContainer>
          </>
        )}

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

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 30px;
`;

const StepDot = styled.div<{ $active: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  background: ${({ $active }) => ($active ? 'linear-gradient(135deg, #d946ef, #c735de)' : 'rgba(255, 255, 255, 0.1)')};
  color: ${({ $active }) => ($active ? 'white' : '#d8bfd8')};
  border: 2px solid ${({ $active }) => ($active ? '#d946ef' : 'rgba(217, 70, 239, 0.3)')};
  transition: all 0.3s ease;
`;

const StepLine = styled.div<{ $active: boolean }>`
  width: 60px;
  height: 2px;
  background: ${({ $active }) => ($active ? 'linear-gradient(90deg, #d946ef, #c735de)' : 'rgba(255, 255, 255, 0.1)')};
  transition: all 0.3s ease;
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  font-size: 0.9rem;
  text-align: center;
  padding: 10px;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 107, 107, 0.3);
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 10px;
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
  box-shadow: 0 6px 15px rgba(217, 70, 239, 0.35);
  flex: 1;

  &:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 10px 25px rgba(217, 70, 239, 0.5);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled.button`
  background: transparent;
  color: #d946ef;
  border: 2px solid #d946ef;
  border-radius: 15px;
  padding: 14px 50px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;

  &:hover:not(:disabled) {
    background: rgba(217, 70, 239, 0.1);
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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
