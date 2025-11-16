import styled from "styled-components";
import backgroundPage from "@assets/images/background-page.jpg";
import { useContext, useState } from "react";
import Section from "@styles/SectionStyle";
import { ProfileContext } from "@contexts/ProfileContext";
import SideBar from "@components/Sidebar";
import { PrimaryButton } from "@components/PrimaryButton";
import { InputComponent } from "@components/InputComponent";
import { FaHeart, FaCreditCard, FaPix, FaBarcode } from "react-icons/fa6";
import { FaDonate } from "react-icons/fa";
import StickySidebar from "@/shared/styles/StickySidebar";

export default function DonationPage() {
  const { account } = useContext(ProfileContext);
  const [donationData, setDonationData] = useState({
    amount: "",
    paymentMethod: "",
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleChange = (key: string, value: string) => {
    setDonationData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dados da doação:", donationData);
  };

  const quickAmounts = [25, 50, 100, 200, 500];

  return (
    <Container>
      <SectionContent>
        <StickySidebar>
          <SideBar account={account} />
        </StickySidebar>
        <MainContent>
          <HeaderSection>
            <IconContainer>
              <FaDonate size={48} />
            </IconContainer>
            <Title>Faça uma Doação</Title>
            <Subtitle>
              Sua contribuição ajuda a cuidar de animais que precisam de amor e atenção.
              Cada doação faz a diferença!
            </Subtitle>
          </HeaderSection>

          <DonationForm onSubmit={handleSubmit}>
            <FormSection>
              <SectionTitle>Valor da Doação</SectionTitle>
              <QuickAmounts>
                {quickAmounts.map(amount => (
                  <AmountButton
                    key={amount}
                    type="button"
                    onClick={() => handleChange("amount", amount.toString())}
                    $active={donationData.amount === amount.toString()}
                  >
                    R$ {amount}
                  </AmountButton>
                ))}
              </QuickAmounts>
              <InputComponent
                label="amount"
                placeholder="Ou digite um valor personalizado"
                value={donationData.amount}
                onChange={handleChange}
                type="number"
              />
            </FormSection>

            <FormSection>
              <SectionTitle>Método de Pagamento</SectionTitle>
              <PaymentMethods>
                <PaymentOption
                  onClick={() => handleChange("paymentMethod", "pix")}
                  $selected={donationData.paymentMethod === "pix"}
                >
                  <FaPix size={32} />
                  <span>PIX</span>
                  <Badge>Instantâneo</Badge>
                </PaymentOption>
                <PaymentOption
                  onClick={() => handleChange("paymentMethod", "credit")}
                  $selected={donationData.paymentMethod === "credit"}
                >
                  <FaCreditCard size={32} />
                  <span>Cartão de Crédito</span>
                </PaymentOption>
                <PaymentOption
                  onClick={() => handleChange("paymentMethod", "barcode")}
                  $selected={donationData.paymentMethod === "barcode"}
                >
                  <FaBarcode size={32} />
                  <span>Boleto</span>
                </PaymentOption>
              </PaymentMethods>
            </FormSection>

            <FormSection>
              <SectionTitle>Seus Dados</SectionTitle>
              <InputComponent
                label="name"
                placeholder="Nome completo"
                value={donationData.name}
                onChange={handleChange}
                type="text"
              />
              <InputComponent
                label="email"
                placeholder="E-mail"
                value={donationData.email}
                onChange={handleChange}
                type="email"
              />
              <InputComponent
                label="phone"
                placeholder="Telefone (opcional)"
                value={donationData.phone}
                onChange={handleChange}
                type="tel"
              />
            </FormSection>

            <FormSection>
              <SectionTitle>Mensagem (Opcional)</SectionTitle>
              <InputComponent
                label="message"
                placeholder="Deixe uma mensagem de carinho para os animais..."
                value={donationData.message}
                onChange={handleChange}
                type="textarea"
              />
            </FormSection>

            <DonationSummary>
              <SummaryRow>
                <span>Valor da doação:</span>
                <Amount>R$ {donationData.amount || "0,00"}</Amount>
              </SummaryRow>
              <SummaryRow>
                <span>Método:</span>
                <span>{donationData.paymentMethod || "Não selecionado"}</span>
              </SummaryRow>
            </DonationSummary>

            <SubmitButtonContainer>
              <PrimaryButton
                text="Confirmar Doação"
                type="submit"
                filled={true}
                width="100%"
                height="50px"
              />
            </SubmitButtonContainer>
          </DonationForm>

          <InfoCards>
            <InfoCard>
              <FaHeart size={24} />
              <h3>100% Transparente</h3>
              <p>Todas as doações são utilizadas diretamente no cuidado dos animais</p>
            </InfoCard>
            <InfoCard>
              <FaHeart size={24} />
              <h3>Seguro e Confiável</h3>
              <p>Seus dados estão protegidos e a transação é totalmente segura</p>
            </InfoCard>
            <InfoCard>
              <FaHeart size={24} />
              <h3>Receba Atualizações</h3>
              <p>Fique por dentro de como sua doação está sendo utilizada</p>
            </InfoCard>
          </InfoCards>
        </MainContent>
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

const MainContent = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 1024px) {
    max-width: 100%;
  }
`;

const HeaderSection = styled.div`
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.quarternary} 0%, ${({ theme }) => theme.colors.tertiary} 100%);
  border-radius: 16px;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  box-shadow: 0 8px 32px rgba(182, 72, 160, 0.3);
`;

const IconContainer = styled.div`
  display: inline-flex;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  margin-bottom: 1rem;
  color: white;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  margin: 0.5rem 0;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin-top: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const DonationForm = styled.form`
  background-color: ${({ theme }) => theme.colors.quarternary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 16px rgba(182, 72, 160, 0.25);
  display: flex;
  flex-direction: column;
  gap: 2rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    gap: 1.5rem;
  }
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: "";
    width: 4px;
    height: 24px;
    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: 2px;
  }
`;

const QuickAmounts = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const AmountButton = styled.button<{ $active: boolean }>`
  padding: 1rem;
  border-radius: 12px;
  border: 2px solid ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.secondary};
  background-color: ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.quinary};
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(182, 72, 160, 0.3);
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  ${({ $active, theme }) => $active && `
    background-color: ${theme.colors.primary};
    box-shadow: 0 4px 16px rgba(182, 72, 160, 0.4);
  `}
`;

const PaymentMethods = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const PaymentOption = styled.div<{ $selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem 1rem;
  border-radius: 12px;
  border: 2px solid ${({ theme, $selected }) => $selected ? theme.colors.primary : theme.colors.secondary};
  background-color: ${({ theme, $selected }) => $selected ? `${theme.colors.primary}20` : theme.colors.quinary};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 20px rgba(182, 72, 160, 0.3);
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  ${({ $selected, theme }) => $selected && `
    background-color: ${theme.colors.primary}30;
    box-shadow: 0 4px 16px rgba(182, 72, 160, 0.4);
  `}
  
  span {
    font-weight: bold;
    color: white;
    font-size: 1rem;
  }
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-weight: bold;
`;

const DonationSummary = styled.div`
  background-color: ${({ theme }) => theme.colors.quinary};
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  font-size: 1.1rem;
  
  span:first-child {
    color: rgba(255, 255, 255, 0.8);
  }
`;

const Amount = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`;

const SubmitButtonContainer = styled.div`
  margin-top: 1rem;
`;

const InfoCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
`;

const InfoCard = styled.div`
  background-color: ${({ theme }) => theme.colors.quarternary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(182, 72, 160, 0.3);
  }
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
  
  h3 {
    color: white;
    font-size: 1.2rem;
    margin: 0;
  }
  
  p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.95rem;
    line-height: 1.5;
    margin: 0;
  }
`;

