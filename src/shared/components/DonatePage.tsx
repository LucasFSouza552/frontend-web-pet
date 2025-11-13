import styled from "styled-components";
import SideBar from "@components/SideBar";
import { useState } from "react";
import { FaDonate } from "react-icons/fa";
import { PrimaryButton } from "@components/PrimaryButton";

export default function DonatePage() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleDonate = () => {
    const number = Number(value.replace(",", "."));
    if (isNaN(number) || number < 10) {
      setError("O valor mínimo para doação é R$ 10,00");
      return;
    }
    setError("");
  };

  return (
    <PageWrapper>
      <SideBar account={null} />

      <ContentWrapper>
        <Pattern />

        <DonateCard>
          <IconContainer>
            <FaDonate />
          </IconContainer>

          <Title>Faça uma Doação</Title>
          <Text>
            Sua contribuição ajuda a manter nossa instituição de pets, cuidando e salvando vidas.
          </Text>

          <Input
            type="number"
            placeholder="Digite o valor"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          {error && <Error>{error}</Error>}

          <PrimaryButton text="Doar Agora" type="button" filled onClick={handleDonate} />
        </DonateCard>
      </ContentWrapper>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  width: 100%;
  min-height: 100dvh;
  display: flex;
  background-color: ${({ theme }) => theme.colors.secondary};
`;

const ContentWrapper = styled.div`
  flex: 1;
  padding: 40px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Pattern = styled.div`
  position: absolute;
  inset: 0;
  background-image: url("/src/assets/images/background_paws.png");
  background-size: 320px;
  background-repeat: repeat;
  opacity: 0.08;
  pointer-events: none;
`;

const DonateCard = styled.div`
  width: 440px;
  padding: 38px 30px;
  border-radius: 14px;
  background-color: ${({ theme }) => theme.colors.quarternary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  box-shadow: 0 0 18px ${({ theme }) => theme.colors.primary};
  backdrop-filter: blur(14px);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
`;

const IconContainer = styled.div`
  font-size: 3.4rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 12px;
  filter: drop-shadow(0px 6px 8px ${({ theme }) => theme.colors.primary});
`;

const Title = styled.h1`
  color: #fff;
  font-size: 1.9rem;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 8px;
`;

const Text = styled.p`
  color: #d8d8d8;
  font-size: 1rem;
  text-align: center;
  margin-bottom: 25px;
  line-height: 1.4;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border-radius: 10px;
  border: 1px solid rgba(182, 72, 160, 0.3);
  background-color: rgba(20, 18, 20, 0.55);
  color: #fff;
  font-size: 1rem;
  margin-bottom: 8px;
  outline: none;
  transition: 0.15s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 10px ${({ theme }) => theme.colors.primary};
  }
`;

const Error = styled.span`
  width: 100%;
  color: #ff5777;
  font-size: 0.9rem;
  margin-bottom: 14px;
  text-align: left;
`;
