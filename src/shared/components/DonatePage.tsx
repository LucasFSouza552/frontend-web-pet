import styled from "styled-components";
import SideBar from "@components/Sidebar";
import { useContext, useState } from "react";
import { FaDonate, FaServer, FaPaw, FaUsers, FaHandHoldingHeart } from "react-icons/fa";
import { PrimaryButton } from "@components/PrimaryButton";
import { ProfileContext } from "@contexts/ProfileContext";
import { accountService } from "../api/accountService";
import StickySidebar from "../styles/StickySidebar";
import ResponsiveSidebar, { HamburgerButton } from "@/shared/components/ResponsiveSidebar";
import { useResponsiveSidebar } from "@/shared/hooks/useResponsiveSidebar";

export default function DonatePage() {
  const { account } = useContext(ProfileContext);
  const { isMenuOpen, toggleMenu, closeMenu } = useResponsiveSidebar();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleDonate = async () => {

    try {
      const number = Number(value.replace(",", "."));
      if (isNaN(number) || number < 10) {
        setError("O valor mínimo para doação é R$ 10,00");
        return;
      }

      const response = await accountService.donate(number);
      if (response.url) {
        const width = 1000;
        const height = 1100;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;
        window.open(response.url, "MercadoPago", `width=${width},height=${height},top=${top},left=${left}`);
      } else {
        setError("Erro ao processar doação");
      }
    } catch (error) {
      setError(error as string);
    }

  };

  return (
    <PageWrapper>
      <ResponsiveSidebar 
        account={account} 
        isMenuOpen={isMenuOpen} 
        onCloseMenu={closeMenu}
      />

      <ContentWrapper>
        <HamburgerButtonWrapper>
          <HamburgerButton onClick={toggleMenu} />
        </HamburgerButtonWrapper>
          <StickySidebar>
            <SideBar account={account} />
          </StickySidebar>
        <Pattern />
        <MainContent>
        <DonateCard>
          <IconContainer>
            <FaDonate />
          </IconContainer>

          <Title>Faça uma Doação</Title>

          <ImageContainer>
            <DonationImage src="/donation-img1.jpg" alt="Doação para animais" />
          </ImageContainer>

          <Text>Sua doação mantém a plataforma no ar e acelera melhorias.</Text>

          <IconGrid>
            <IconBenefit>
              <IconCircle><FaServer /></IconCircle>
              <BenefitLabel>Manter o site ativo</BenefitLabel>
            </IconBenefit>
            <IconBenefit>
              <IconCircle><FaUsers /></IconCircle>
              <BenefitLabel>Aproximar adotantes e pets</BenefitLabel>
            </IconBenefit>
            <IconBenefit>
              <IconCircle><FaPaw /></IconCircle>
              <BenefitLabel>Dar visibilidade aos resgates</BenefitLabel>
            </IconBenefit>
            <IconBenefit>
              <IconCircle><FaHandHoldingHeart /></IconCircle>
              <BenefitLabel>Apoiar instituições</BenefitLabel>
            </IconBenefit>
          </IconGrid>

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
        </MainContent>
      </ContentWrapper>
    </PageWrapper>
  );
}

const MainContent = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 800px;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  width: 100%;
`;
const PageWrapper = styled.div`
  position: relative;
  width: 100%;
  min-height: 100dvh; 
  display: flex;
  flex-direction: row;
  background-color: ${({ theme }) => theme.colors.secondary};
  overflow-x: hidden;
`;

const ContentWrapper = styled.div`
  flex: 1;
  padding: 20px;
  position: relative;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  gap: 1rem;


`;

const HamburgerButtonWrapper = styled.div`
  align-self: flex-start;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1rem;

  @media (min-width: 1025px) {
    display: none;
  }
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
  margin-bottom: 10px;
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

  flex: 1;
  max-height: 350px;

  @media (max-width: 1024px) {
    max-height: 200px;
  }

  @media (max-width: 768px) {
    max-height: 150px;
  }
`;

const DonationImage = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;

`;

const IconGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin: 10px 0 12px 0;
`;

const IconBenefit = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 10px 12px;
`;

const IconCircle = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: white;
  background: ${({ theme }) => theme.colors.primary};
  box-shadow: 0 0 10px ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
  svg {
    font-size: 16px;
  }
`;

const BenefitLabel = styled.span`
  color: #eaeaea;
  font-size: 0.9rem;
  line-height: 1.2;
`;
