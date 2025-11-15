import styled from "styled-components";
import SideBar from "@components/Sidebar";
import { useContext, useState } from "react";
import { FaDonate } from "react-icons/fa";
import { PrimaryButton } from "@components/PrimaryButton";
import { ProfileContext } from "@contexts/ProfileContext";

export default function DonatePage() {
  const { account } = useContext(ProfileContext);
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
      <StickySidebar>
        <SideBar account={account} />
      </StickySidebar>

      <ContentWrapper>
        <Pattern />

        <DonateCard>
          <IconContainer>
            <FaDonate />
          </IconContainer>

          <Title>Faça uma Doação</Title>
          
          <ImageContainer>
            <DonationImage src="/donation-img1.jpg" alt="Doação para animais" />
          </ImageContainer>

          <Text>
            Sua contribuição é essencial para que nosso site continue funcionando e conectando animais em situação de vulnerabilidade a pessoas dispostas a oferecer um novo lar. 
            Somos uma plataforma <strong>sem fins lucrativos</strong> dedicada a facilitar o processo de adoção e apoiar o resgate de pets que precisam de cuidado e proteção.
          </Text>

          <DescriptionText>
            Com sua doação, conseguimos:
          </DescriptionText>
          
          <BenefitsList>
            <BenefitItem>• Manter o site ativo, estável e acessível</BenefitItem>
            <BenefitItem>• Melhorar ferramentas que aproximam adotantes e animais</BenefitItem>
            <BenefitItem>• Dar visibilidade a pets resgatados e em busca de uma família</BenefitItem>
            <BenefitItem>• Apoiar instituições e protetores independentes que divulgam animais para adoção</BenefitItem>
            <BenefitItem>• Continuar promovendo a adoção responsável e transformando vidas</BenefitItem>
          </BenefitsList>

          <Text>
            Cada contribuição ajuda diretamente na manutenção e evolução da plataforma. 
            Sua generosidade permite que mais pets tenham uma nova chance! 💙🐾
          </Text>

          <Input
            type="number"
            placeholder="Digite o valor"
            value={value}
            min={10}
            onChange={(e) => setValue(e.target.value)}
          />

          {error && <Error>{error}</Error>}

          <PrimaryButton text="Doar Agora" type="button" filled onClick={handleDonate} />
        </DonateCard>
      </ContentWrapper>
    </PageWrapper>
  );
}


const StickySidebar = styled.div`
    position: sticky;
    top: 0;
    align-self: flex-start;
    height: fit-content;
    max-height: calc(100dvh - 30px);
    overflow-y: auto;
    z-index: 10;
    flex-shrink: 0;
    
    &::-webkit-scrollbar {
        width: 4px;
    }
    
    &::-webkit-scrollbar-track {
        background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
        background: ${({ theme }) => theme.colors.primary || "#B648A0"};
        border-radius: 2px;
    }
    
    @media (max-width: 1024px) {
        position: static;
        width: 100%;
        max-height: none;
        z-index: 1;
    }
`;

const PageWrapper = styled.div`
  width: 100%;
  height: 100dvh;
  display: flex;
  background-color: ${({ theme }) => theme.colors.secondary};
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  flex: 1;
  padding: 20px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
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
  width: 500px;
  max-width: 90vw;
  max-height: calc(100dvh - 40px);
  padding: 24px 24px;
  border-radius: 14px;
  background-color: ${({ theme }) => theme.colors.quarternary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  box-shadow: 0 0 18px ${({ theme }) => theme.colors.primary};
  backdrop-filter: blur(14px);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primary || "#B648A0"};
    border-radius: 3px;
  }
`;

const IconContainer = styled.div`
  font-size: 2.8rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 8px;
  filter: drop-shadow(0px 6px 8px ${({ theme }) => theme.colors.primary});
  flex-shrink: 0;
`;

const Title = styled.h1`
  color: #fff;
  font-size: 1.6rem;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 6px;
  flex-shrink: 0;
`;

const Text = styled.p`
  color: #d8d8d8;
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 12px;
  line-height: 1.3;
  flex-shrink: 0;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid rgba(182, 72, 160, 0.3);
  background-color: rgba(20, 18, 20, 0.55);
  color: #fff;
  font-size: 0.95rem;
  margin-bottom: 8px;
  outline: none;
  transition: 0.15s ease;
  flex-shrink: 0;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 10px ${({ theme }) => theme.colors.primary};
  }
`;

const Error = styled.span`
  width: 100%;
  color: #ff5777;
  font-size: 0.85rem;
  margin-bottom: 10px;
  text-align: left;
  flex-shrink: 0;
`;

const ImageContainer = styled.div`
  width: 100%;
  margin-bottom: 12px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
  aspect-ratio: 16/9;

  max-height: 350px;
`;

const DonationImage = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;

`;

const DescriptionText = styled.p`
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  text-align: center;
  margin: 10px 0 8px 0;
  flex-shrink: 0;
`;

const BenefitsList = styled.ul`
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0 0 12px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-shrink: 0;
`;

const BenefitItem = styled.li`
  color: #d8d8d8;
  font-size: 0.85rem;
  text-align: left;
  line-height: 1.4;
  padding-left: 8px;
`;
