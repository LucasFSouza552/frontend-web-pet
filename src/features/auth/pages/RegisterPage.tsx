import styled from "styled-components";
import { HeaderComponent } from "../../../shared/components/HeaderComponent";
import FooterSection from "../../home/components/FooterSection";
import RegisterForm from "../components/RegisterForm";

export default function RegisterSection() {
    return (
        <PageContainer>
            <HeaderComponent />
            <MainContent>
                <RegisterForm />
            </MainContent>
            <FooterSection />
        </PageContainer>
    );
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #3C2A3A;
  padding: 40px 20px;
`;