import { styled } from "styled-components";
import { HeaderComponent } from "../../../shared/components/HeaderComponent";
import Section from "../../../shared/styles/SectionStyle";
import backgroundPage from "../../../shared/assets/images/background-page.jpg";
import { useContext } from "react";
import MatchCard from "../../match/components/MatchCard";
import { AuthContext } from "@/features/account/auth/AuthContext";
import { ProfileContext } from "@/app/contexts/ProfileContext";

export default function DesiredPetsPage() {
    const { account } = useContext(AuthContext);
    const { petFeed } = useContext(ProfileContext);

    const desiredPets = petFeed; 

    return (
        <Container>
            <HeaderComponent account={account} />
            <SectionContent>
                <ContentWrapper>
                    <Title>Pets que você quer adotar</Title>
                    {desiredPets.length === 0 ? (
                        <EmptyState>
                            <h3>Nenhum pet marcado ainda</h3>
                            <p>Quando você demonstrar interesse em um pet, ele aparecerá aqui.</p>
                        </EmptyState>
                    ) : (
                        <CardsGrid>
                            {desiredPets.map((pet, index) => (
                                <MatchCard key={`${pet.id}-${index}`} Pet={pet} />
                            ))}
                        </CardsGrid>
                    )}
                </ContentWrapper>
            </SectionContent>
        </Container>
    );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const SectionContent = styled(Section)`
    display: flex;
    width: 100%;
    min-height: 100%;
    max-height: calc(100dvh - var(--header-height));
    background-image: url(${backgroundPage});
    background-size: cover;
    background-position: center;
    background-repeat: repeat;
    background-attachment: fixed;
`;

const ContentWrapper = styled.div`
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px 16px;
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

const Title = styled.h2`
    color: ${({ theme }) => theme.colors.primary};
`;

const EmptyState = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: ${({ theme }) => theme.colors.tertiary};
    background-color: ${({ theme }) => theme.colors.quarternary};
    border-radius: 16px;
    padding: 32px;
    text-align: center;
`;

const CardsGrid = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
    gap: 24px;
    align-items: start;
`;


