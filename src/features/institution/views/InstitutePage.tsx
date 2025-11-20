import styled from "styled-components";
import backgroundPage from "@assets/images/background-page.jpg";
import { useContext, useEffect, useState } from "react";
import Section from "@styles/SectionStyle";
import { ProfileContext } from "@contexts/ProfileContext";
import SideBar from "@components/Sidebar";
import { useParams, useNavigate } from "react-router-dom";
import { accountService } from "@api/accountService";
import { pictureService } from "@api/pictureService";
import { FaDonate, FaMapMarkerAlt, FaPhone, FaEnvelope, FaHeart, FaBuilding } from "react-icons/fa";
import { BsPatchCheckFill } from "react-icons/bs";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import animationFile from "@assets/lottie/loading.lottie?url";
import type { IAccount } from "@models/Account";
import StickySidebar from "@/shared/styles/StickySidebar";
import ResponsiveSidebar, { HamburgerButton } from "@/shared/components/ResponsiveSidebar";
import { useResponsiveSidebar } from "@/shared/hooks/useResponsiveSidebar";

export default function InstitutePage() {
  const { account } = useContext(ProfileContext);
  const { isMenuOpen, toggleMenu, closeMenu } = useResponsiveSidebar();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [institution, setInstitution] = useState<IAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [donationAmount, setDonationAmount] = useState<string>("");
  const [donationError, setDonationError] = useState<string>("");
  const [donating, setDonating] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }
    loadInstitution();
    // eslint-disable-next-line
  }, [id]);

  const loadInstitution = async () => {
    try {
      setLoading(true);
      const institutionData = await accountService.fetchAccountById(id!);
      if (institutionData.avatar) {
        institutionData.avatar = pictureService.fetchPicture(institutionData.avatar);
      }
      setInstitution(institutionData);
    } catch (error) {
      console.error("Erro ao carregar instituição:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async () => {
    if (!id) return;

    const amount = parseFloat(donationAmount.replace(",", "."));

    if (isNaN(amount) || amount < 10) {
      setDonationError("O valor mínimo para doação é R$ 10,00");
      return;
    }

    if (!account) {
      setDonationError("Você precisa estar logado para fazer uma doação");
      return;
    }

    try {
      setDonating(true);
      setDonationError("");
      const response = await accountService.sponsorPet(id, amount);

      if (response.url) {
        const width = 1000;
        const height = 1100;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;

        window.open(
          response.url,
          "MercadoPago",
          `width=${width},height=${height},top=${top},left=${left}`
        );
        setDonationSuccess(true);
        setDonationAmount("");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? error.message
        : (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Erro ao processar doação. Tente novamente.";
      setDonationError(errorMessage);
    } finally {
      setDonating(false);
    }
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    const formattedValue = (parseInt(numericValue) / 100).toFixed(2);
    return formattedValue.replace(".", ",");
  };

  if (loading) {
    return (
      <Container>
        <BackgroundLayer />
        <LoadingContainer>
          <DotLottieReact src={animationFile} autoplay loop style={{ width: "500px" }} />
        </LoadingContainer>
      </Container>
    );
  }

  if (!institution) {
    return null;
  }

  return (
    <Container>
      <ResponsiveSidebar 
        account={account} 
        isMenuOpen={isMenuOpen} 
        onCloseMenu={closeMenu}
      />
      <BackgroundLayer />
      <SectionContent>
        <StickySidebar>
          <SideBar account={account} />
        </StickySidebar>
        <MiddleSideContainer>
          <HamburgerButton onClick={toggleMenu} />
          <InstitutionHeader>
            <AvatarContainer>
              <InstitutionAvatar src={pictureService.fetchPicture(institution.avatar || "")} alt={institution.name} />
              {institution.verified && <VerifiedBadge />}
            </AvatarContainer>
            <InstitutionInfo>
              <InstitutionName>
                {institution.name}
                {institution.verified && <VerifiedIcon />}
              </InstitutionName>
              <InstitutionRole>
                <FaBuilding /> Instituição
              </InstitutionRole>
              {institution.address && (
                <InstitutionLocation>
                  <FaMapMarkerAlt /> {institution.address.city}, {institution.address.state}
                </InstitutionLocation>
              )}
            </InstitutionInfo>
          </InstitutionHeader>

          <ContentGrid>
            <InfoCard>
              <CardTitle>
                <FaHeart /> Sobre a Instituição
              </CardTitle>
              <CardContent>
                {(institution.phone_number || institution.email) && (
                  <>
                    <CardSubTitle>Contatos</CardSubTitle>
                    <InfoGrid>
                      {institution.phone_number && (
                        <InfoItem>
                          <FaPhone /> {institution.phone_number}
                        </InfoItem>
                      )}
                      {institution.email && (
                        <InfoItem>
                          <FaEnvelope /> {institution.email}
                        </InfoItem>
                      )}
                    </InfoGrid>
                  </>
                )}

                {institution.cnpj && (
                  <>
                    <CardSubTitle>Documentos</CardSubTitle>
                    <InfoItem>
                      <strong>CNPJ:</strong> {institution.cnpj}
                    </InfoItem>
                  </>
                )}

                {institution.address && (
                  <>
                    <CardSubTitle>Endereço</CardSubTitle>
                    <InfoItem>
                      <FaMapMarkerAlt /> {institution.address.street}
                      {institution.address.number ? `, ${institution.address.number}` : ""}
                      {institution.address.neighborhood ? ` - ${institution.address.neighborhood}` : ""}
                      <br />
                      {institution.address.city}/{institution.address.state}
                      {institution.address.cep && (
                        <>
                          <br />
                          CEP: {institution.address.cep}
                        </>
                      )}
                    </InfoItem>
                  </>
                )}
              </CardContent>
            </InfoCard>

            <DonationCard>
              <DonationHeader>
                <DonationIcon>
                  <FaDonate />
                </DonationIcon>
                <DonationTitle>Faça uma Doação</DonationTitle>
                <DonationSubtitle>
                  Sua contribuição ajuda a manter esta instituição, cuidando e salvando vidas de animais.
                </DonationSubtitle>
              </DonationHeader>

              <DonationForm>
                <AmountInputContainer>
                  <CurrencyLabel>R$</CurrencyLabel>
                  <AmountInput
                    type="text"
                    placeholder="0,00"
                    value={donationAmount}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value) {
                        const formatted = formatCurrency(value);
                        setDonationAmount(formatted);
                      } else {
                        setDonationAmount("");
                      }
                      setDonationError("");
                    }}
                    maxLength={10}
                  />
                </AmountInputContainer>

                {donationError && <ErrorMessage>{donationError}</ErrorMessage>}
                {donationSuccess && <SuccessMessage>Redirecionando para o pagamento...</SuccessMessage>}

                <DonateButton onClick={handleDonate} disabled={donating || !donationAmount}>
                  {donating ? "Processando..." : "Doar Agora"}
                </DonateButton>

                <QuickAmounts>
                  <QuickAmountButton onClick={() => setDonationAmount("10,00")}>R$ 10</QuickAmountButton>
                  <QuickAmountButton onClick={() => setDonationAmount("25,00")}>R$ 25</QuickAmountButton>
                  <QuickAmountButton onClick={() => setDonationAmount("50,00")}>R$ 50</QuickAmountButton>
                  <QuickAmountButton onClick={() => setDonationAmount("100,00")}>R$ 100</QuickAmountButton>
                </QuickAmounts>
              </DonationForm>
            </DonationCard>
          </ContentGrid>
        </MiddleSideContainer>
      </SectionContent>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  min-height: 100dvh;
  width: 100%;
  overflow-x: hidden;
`;

const BackgroundLayer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${backgroundPage});
  background-size: cover;
  background-position: center;
  background-repeat: repeat;
  background-attachment: fixed;
  z-index: 0;
  pointer-events: none;
`;

const SectionContent = styled(Section)`
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
  min-height: calc(100dvh - var(--header-height, 80px));
  padding: 1.25rem;
  gap: 1.25rem;
  box-sizing: border-box;
  overflow-x: hidden;

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: stretch;
    padding: 1rem;
    gap: 1rem;
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
    gap: 0.75rem;
  }
`;

const MiddleSideContainer = styled.div`
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  flex: 2;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.quarternary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  box-shadow: 0 4px 16px rgba(182, 72, 160, 0.25);
  color: white;
  min-height: fit-content;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  overflow: visible;

  &:hover {
    box-shadow: 0 6px 24px rgba(182, 72, 160, 0.35);
  }

  @media (max-width: 1024px) {
    width: 100%;
    flex: 1;
    padding: 1.5rem;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 8px;
    gap: 1.5rem;
  }
`;

const LoadingContainer = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100dvh;
  width: 100%;
`;

const InstitutionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid rgba(182, 72, 160, 0.3);

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
    padding-bottom: 1.5rem;
  }
`;

const AvatarContainer = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const InstitutionAvatar = styled.img`
  width: 120px;
  height: 120px;
  background-color: ${({ theme }) => theme.colors.bg};
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid ${({ theme }) => theme.colors.primary};
  box-shadow: 0 4px 16px rgba(182, 72, 160, 0.4);

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
`;

const VerifiedBadge = styled(BsPatchCheckFill)`
  position: absolute;
  bottom: 0;
  right: 0;
  color: #00D9FF;
  font-size: 2rem;
  border-radius: 50%;
  filter: drop-shadow(0px 2px 4px rgba(0, 217, 255, 0.5));
`;

const InstitutionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
`;

const InstitutionName = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    justify-content: center;
  }
`;

const VerifiedIcon = styled(BsPatchCheckFill)`
  color: #00D9FF;
  font-size: 1.5rem;
  filter: drop-shadow(0px 2px 4px rgba(0, 217, 255, 0.5));
`;

const InstitutionRole = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.1rem;
  font-weight: 600;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const InstitutionLocation = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #d8d8d8;
  font-size: 0.95rem;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const InfoCard = styled.div`
  background: rgba(20, 18, 20, 0.6);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(182, 72, 160, 0.3);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 4px 12px rgba(182, 72, 160, 0.2);
  }
`;

const CardTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CardSubTitle = styled.h3`
  font-size: 1rem;
  color: #ffffff;
  opacity: 0.9;
  margin: 0.5rem 0 0.5rem 0;
  font-weight: 700;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  color: #e0e0e0;
  font-size: 0.95rem;
  line-height: 1.6;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;

  svg {
    color: ${({ theme }) => theme.colors.primary};
    margin-top: 0.2rem;
    flex-shrink: 0;
  }

  strong {
    color: white;
  }
`;

const DonationCard = styled.div`
  background: linear-gradient(135deg, rgba(182, 72, 160, 0.15) 0%, rgba(20, 18, 20, 0.8) 100%);
  border-radius: 12px;
  padding: 2rem;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  box-shadow: 0 8px 24px rgba(182, 72, 160, 0.3);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const DonationHeader = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const DonationIcon = styled.div`
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.primary};
  filter: drop-shadow(0px 4px 8px rgba(182, 72, 160, 0.5));
  margin-bottom: 0.5rem;
`;

const DonationTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  color: white;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const DonationSubtitle = styled.p`
  color: #d8d8d8;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
`;

const DonationForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const AmountInputContainer = styled.div`
  display: flex;
  align-items: center;
  background: rgba(20, 18, 20, 0.8);
  border: 2px solid rgba(182, 72, 160, 0.3);
  border-radius: 12px;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 12px rgba(182, 72, 160, 0.4);
  }
`;

const CurrencyLabel = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.5rem;
  font-weight: bold;
  margin-right: 0.5rem;
`;

const AmountInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: white;
  font-size: 2rem;
  font-weight: bold;
  outline: none;
  text-align: right;

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ErrorMessage = styled.div`
  color: #ff5777;
  font-size: 0.9rem;
  padding: 0.75rem;
  background: rgba(255, 87, 119, 0.1);
  border: 1px solid rgba(255, 87, 119, 0.3);
  border-radius: 8px;
  text-align: center;
`;

const SuccessMessage = styled.div`
  color: #4ade80;
  font-size: 0.9rem;
  padding: 0.75rem;
  background: rgba(74, 222, 128, 0.1);
  border: 1px solid rgba(74, 222, 128, 0.3);
  border-radius: 8px;
  text-align: center;
`;

const DonateButton = styled.button`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, #d060c2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(182, 72, 160, 0.4);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(182, 72, 160, 0.6);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const QuickAmounts = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin-top: 0.5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const QuickAmountButton = styled.button`
  background: rgba(182, 72, 160, 0.2);
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(182, 72, 160, 0.3);
  }
`;